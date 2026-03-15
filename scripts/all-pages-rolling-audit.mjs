import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

const argMap = new Map(
  process.argv.slice(2).map((arg) => {
    const [k, v = ""] = arg.split("=");
    return [k, v];
  }),
);
const requestedBase = (argMap.get("--base") || "").trim();
const candidateBases = requestedBase
  ? [requestedBase]
  : [
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3200",
      "http://127.0.0.1:3301",
      "http://localhost:3000",
    ];
const maxChecksArg = Number(argMap.get("--maxChecks") || "");
const maxChecks = Number.isFinite(maxChecksArg) && maxChecksArg > 0
  ? Math.floor(maxChecksArg)
  : Number.POSITIVE_INFINITY;

function asPathname(input, base) {
  try {
    const u = new URL(input, base);
    const baseHost = new URL(base).host;
    if (u.host !== baseHost) return null;
    if (u.pathname.startsWith("/_next") || u.pathname.startsWith("/api")) return null;
    if (u.pathname.match(/\.(png|jpe?g|webp|gif|svg|ico|css|js|map|woff2?|ttf|pdf)$/i)) return null;
    const pathname = `${u.pathname}${u.search}`.replace(/\/+$/, "") || "/";
    return pathname || "/";
  } catch {
    return null;
  }
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

async function pickBase() {
  for (const base of candidateBases) {
    try {
      const res = await fetch(`${base}/`, { redirect: "follow" });
      if (res.status < 500) return base;
    } catch {
      // try next
    }
  }
  throw new Error("No running local server found on 3000/3200/3301.");
}

async function discoverRoutes(base, browser) {
  const discovered = new Set(["/"]);
  const queue = ["/"];
  const seen = new Set();

  try {
    const sitemap = await fetch(`${base}/sitemap.xml`);
    if (sitemap.ok) {
      const xml = await sitemap.text();
      const matches = xml.match(/<loc>(.*?)<\/loc>/g) || [];
      for (const item of matches) {
        const loc = item.replace("<loc>", "").replace("</loc>", "").trim();
        const route = asPathname(loc, base);
        if (route && !discovered.has(route)) {
          discovered.add(route);
          queue.push(route);
        }
      }
    }
  } catch {
    // sitemap unavailable: continue with crawl
  }

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  while (queue.length > 0) {
    const route = queue.shift();
    if (!route || seen.has(route)) continue;
    seen.add(route);

    const page = await context.newPage();
    try {
      await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded", timeout: 45000 });
      await page.waitForTimeout(250);
      const hrefs = await page.$$eval("a[href]", (nodes) =>
        nodes.map((n) => n.getAttribute("href") || "").filter(Boolean),
      );
      for (const href of hrefs) {
        const nextRoute = asPathname(href, base);
        if (!nextRoute || discovered.has(nextRoute)) continue;
        discovered.add(nextRoute);
        queue.push(nextRoute);
      }
    } catch {
      // keep crawling
    } finally {
      await page.close();
    }

    if (discovered.size >= 1200) break;
  }

  await context.close();
  return Array.from(discovered).sort();
}

function screenshotName(viewportName, route) {
  if (route === "/") return `${viewportName}__home.png`;
  const cleaned = route
    .replace(/^\//, "")
    .replace(/[/?=&]/g, "--")
    .replace(/[^a-zA-Z0-9_-]/g, "");
  return `${viewportName}__${cleaned}.png`;
}

async function auditRoute({ context, base, route, viewportName, outDir }) {
  const page = await context.newPage();
  const consoleErrors = [];
  const badResponses = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text().slice(0, 280));
    }
  });

  page.on("response", (res) => {
    const status = res.status();
    if (status >= 400) {
      badResponses.push({
        status,
        url: res.url().slice(0, 280),
      });
    }
  });

  let navStatus = 0;
  let finalUrl = "";
  let navError = "";
  let metrics = {
    h1Count: 0,
    textLength: 0,
    hasMain: false,
    brokenImages: 0,
    horizontalOverflow: false,
  };

  try {
    const res = await page.goto(`${base}${route}`, {
      waitUntil: "networkidle",
      timeout: 90000,
    });
    navStatus = res?.status() || 0;
    finalUrl = page.url();

    await page.evaluate(async () => {
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      const maxY = document.documentElement.scrollHeight;
      const step = Math.max(300, Math.floor(window.innerHeight * 0.8));
      for (let y = 0; y < maxY; y += step) {
        window.scrollTo(0, y);
        await delay(75);
      }
      window.scrollTo(0, 0);
      await delay(120);
    });

    metrics = await page.evaluate(() => {
      const main = document.querySelector("main");
      const text = (main?.innerText || document.body?.innerText || "")
        .replace(/\s+/g, " ")
        .trim();
      const images = Array.from(document.images || []);
      return {
        h1Count: document.querySelectorAll("h1").length,
        textLength: text.length,
        hasMain: Boolean(main),
        brokenImages: images.filter((img) => img.complete && img.naturalWidth === 0).length,
        horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      };
    });

    await page.screenshot({
      path: path.join(outDir, screenshotName(viewportName, route)),
      fullPage: true,
    });
  } catch (err) {
    navError = String(err).slice(0, 360);
  } finally {
    await page.close();
  }

  const issues = [];
  if (navError) issues.push("navigation_error");
  if (navStatus >= 400) issues.push("http_error");
  if (badResponses.length > 0) issues.push("bad_responses");
  if (consoleErrors.length > 0) issues.push("console_error");
  if (metrics.brokenImages > 0) issues.push("broken_images");
  if (metrics.horizontalOverflow) issues.push("horizontal_overflow");
  if (metrics.h1Count === 0 && !route.endsWith(".xml") && !route.endsWith(".txt")) {
    issues.push("missing_h1");
  }

  return {
    viewport: viewportName,
    route,
    navStatus,
    finalUrl,
    navError,
    issues,
    metrics,
    badResponseCount: badResponses.length,
    badResponses: badResponses.slice(0, 80),
    consoleErrors: consoleErrors.slice(0, 20),
  };
}

function writeSummary({ base, routes, outDir, rows }) {
  const issueCounts = {};
  for (const row of rows) {
    for (const issue of row.issues) {
      issueCounts[issue] = (issueCounts[issue] || 0) + 1;
    }
  }

  const sortedProblemRows = [...rows]
    .filter((row) => row.badResponseCount > 0 || row.issues.length > 0)
    .sort((a, b) => b.badResponseCount - a.badResponseCount)
    .slice(0, 30);

  const json = {
    base,
    routeCount: routes.length,
    checkCount: rows.length,
    issueCounts,
    rows,
  };
  fs.writeFileSync(path.join(outDir, "all-pages-audit.json"), JSON.stringify(json, null, 2));

  const lines = [];
  lines.push("# All Pages Rolling Audit");
  lines.push("");
  lines.push(`- Base URL: ${base}`);
  lines.push(`- Unique routes: ${routes.length}`);
  lines.push(`- Total checks: ${rows.length}`);
  lines.push("");
  lines.push("## Issue Counts");
  for (const [key, count] of Object.entries(issueCounts).sort((a, b) => b[1] - a[1])) {
    lines.push(`- ${key}: ${count}`);
  }
  lines.push("");
  lines.push("## Top Problem Checks");
  for (const row of sortedProblemRows) {
    lines.push(
      `- ${row.viewport} ${row.route}: nav=${row.navStatus}, badResponses=${row.badResponseCount}, issues=${row.issues.join(",") || "none"}`,
    );
  }
  fs.writeFileSync(path.join(outDir, "all-pages-audit.md"), lines.join("\n"));

  return issueCounts;
}

async function main() {
  const requestedOutDir = argMap.get("--outDir");
  const outDir = requestedOutDir
    ? path.resolve(requestedOutDir)
    : path.join(
        process.cwd(),
        "output",
        "playwright",
        `all-pages-audit-${new Date().toISOString().replace(/[:.]/g, "-")}`,
      );
  ensureDir(outDir);

  const rowsPath = path.join(outDir, "rows.ndjson");
  const statePath = path.join(outDir, "state.json");
  const routesPath = path.join(outDir, "routes.json");

  const base = await pickBase();
  const browser = await chromium.launch({ headless: true });

  try {
    const routes = await discoverRoutes(base, browser);
    fs.writeFileSync(routesPath, JSON.stringify(routes, null, 2));

    const previousRows = fs.existsSync(rowsPath)
      ? fs
          .readFileSync(rowsPath, "utf8")
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => JSON.parse(line))
      : [];
    const doneKeys = new Set(previousRows.map((row) => `${row.viewport}::${row.route}`));
    let processedThisRun = 0;

    for (const viewport of viewports) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
      });
      for (let idx = 0; idx < routes.length; idx += 1) {
        if (processedThisRun >= maxChecks) break;
        const route = routes[idx];
        const key = `${viewport.name}::${route}`;
        if (doneKeys.has(key)) continue;

        const row = await auditRoute({
          context,
          base,
          route,
          viewportName: viewport.name,
          outDir,
        });

        fs.appendFileSync(rowsPath, `${JSON.stringify(row)}\n`);
        previousRows.push(row);
        doneKeys.add(key);
        processedThisRun += 1;

        const state = {
          base,
          outDir,
          progress: {
            completedChecks: previousRows.length,
            totalChecks: routes.length * viewports.length,
            currentViewport: viewport.name,
            currentRouteIndex: idx + 1,
            currentRoute: route,
          },
          updatedAt: new Date().toISOString(),
        };
        fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
      }
      await context.close();
      if (processedThisRun >= maxChecks) break;
    }

    const issueCounts = writeSummary({
      base,
      routes,
      outDir,
      rows: previousRows,
    });

    console.log(`BASE=${base}`);
    console.log(`ROUTES=${routes.length}`);
    console.log(`CHECKS=${previousRows.length}`);
    console.log(`PROCESSED_THIS_RUN=${processedThisRun}`);
    console.log(`OUT_DIR=${outDir}`);
    for (const [key, count] of Object.entries(issueCounts).sort((a, b) => b[1] - a[1])) {
      console.log(`ISSUE ${key}=${count}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(String(err));
  process.exit(1);
});
