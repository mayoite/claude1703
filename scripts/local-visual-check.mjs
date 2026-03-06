import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { spawn } from "child_process";

const base = "http://127.0.0.1:3200";
const routes = [
  "/",
  "/products/",
  "/products/chairs-mesh/",
  "/products/chairs-others/",
  "/products/soft-seating/",
  "/products/cafe-seating/",
  "/products/desks-cabin-tables/",
  "/products/workstations/",
  "/products/meeting-conference-tables/",
  "/products/storages/",
  "/products/education/",
  "/products/others-1/",
  "/products/others-2/",
  "/products/oando-seating/",
  "/products/oando-workstations/",
  "/products/oando-tables/",
  "/products/oando-storage/",
  "/products/oando-soft-seating/",
  "/products/oando-collaborative/",
  "/products/oando-educational/",
  "/products/oando-seating/oando-seating--fluid-x/",
  "/products/oando-workstations/oando-workstations--adaptable/",
  "/products/oando-workstations/oando-workstations--deskpro/",
  "/products/oando-workstations/oando-workstations--fenix/",
  "/about/",
  "/solutions/",
  "/contact/",
];
const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];
const outDir = path.join("reports", "visual-check-local-latest");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url, timeoutMs = 180000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status < 500) {
        return true;
      }
    } catch {}
    await sleep(1000);
  }
  return false;
}

function stopServer(server) {
  return new Promise((resolve) => {
    if (!server?.pid) {
      resolve();
      return;
    }

    if (process.platform === "win32") {
      const killer = spawn("taskkill", ["/pid", String(server.pid), "/t", "/f"], { stdio: "ignore" });
      killer.on("close", () => resolve());
      killer.on("error", () => resolve());
      return;
    }

    server.kill("SIGTERM");
    server.on("close", () => resolve());
    setTimeout(resolve, 2000);
  });
}

const server = spawn("npm", ["run", "dev", "--", "--port", "3200"], {
  cwd: process.cwd(),
  shell: true,
  stdio: ["ignore", "pipe", "pipe"],
});

let startupLog = "";
server.stdout.on("data", (chunk) => {
  startupLog += chunk.toString();
});
server.stderr.on("data", (chunk) => {
  startupLog += chunk.toString();
});

let code = 0;
try {
  const ready = await waitForServer(`${base}/`);
  if (!ready) {
    throw new Error(`local server did not start\n${startupLog.slice(-2000)}`);
  }

  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const vp of viewports) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });

    for (const route of routes) {
      const page = await context.newPage();
      const consoleErrors = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          consoleErrors.push(msg.text());
        }
      });

      const url = `${base}${route}`;
      let status = 0;
      let finalUrl = "";
      let title = "";
      let bodyTextLen = 0;
      let has404 = false;
      let hScroll = false;
      let metrics = null;

      try {
        const res = await page.goto(url, { waitUntil: "networkidle", timeout: 120000 });
        status = res ? res.status() : 0;
        await page.waitForTimeout(900);
        finalUrl = page.url();
        title = await page.title();
        const html = await page.content();
        has404 =
          html.includes("NEXT_HTTP_ERROR_FALLBACK") ||
          /\b404\b/i.test(title) ||
          /not found/i.test(html);

        metrics = await page.evaluate(() => {
          const textLen = (document.body?.innerText || "").trim().length;
          const hasHorizontalScroll = document.documentElement.scrollWidth > window.innerWidth + 1;
          const sections = Array.from(document.querySelectorAll(".section")).map((el) => {
            const cs = getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            return {
              opacity: Number(cs.opacity || "1"),
              visibility: cs.visibility,
              display: cs.display,
              h: Math.round(rect.height),
              txt: (el.textContent || "").trim().length,
            };
          });
          const hiddenSections = sections.filter(
            (s) => s.opacity < 0.05 || s.visibility === "hidden" || s.display === "none",
          ).length;
          return {
            textLen,
            hasHorizontalScroll,
            sectionCount: sections.length,
            hiddenSections,
          };
        });

        bodyTextLen = metrics.textLen;
        hScroll = metrics.hasHorizontalScroll;

        const fileSafe =
          route === "/"
            ? "home"
            : route
                .replace(/^\//, "")
                .replace(/\//g, "__")
                .replace(/[^a-zA-Z0-9_-]/g, "");
        await page.screenshot({ path: path.join(outDir, `${vp.name}__${fileSafe}.png`), fullPage: true });
      } catch (err) {
        consoleErrors.push(String(err));
      }

      const ok = status >= 200 && status < 400 && !has404 && bodyTextLen > 200 && !hScroll;
      results.push({
        viewport: vp.name,
        route,
        status,
        finalUrl,
        title,
        bodyTextLen,
        has404,
        hScroll,
        consoleErrors,
        metrics,
        ok,
      });

      await page.close();
    }

    await context.close();
  }

  await browser.close();
  fs.writeFileSync(path.join(outDir, "report.json"), JSON.stringify(results, null, 2), "utf8");

  const bad = results.filter((r) => !r.ok);
  const redirectedLegacy = results.filter(
    (r) => r.route.startsWith("/products/oando-") && r.finalUrl && !r.finalUrl.endsWith(r.route),
  );
  const home = results.find((r) => r.viewport === "desktop" && r.route === "/");

  console.log(`TOTAL=${results.length}`);
  console.log(`BAD=${bad.length}`);
  console.log(`REDIRECTED_LEGACY=${redirectedLegacy.length}`);
  if (home) {
    console.log(`HOME_TEXT=${home.bodyTextLen}`);
    console.log(`HOME_SECTIONS=${home.metrics?.sectionCount ?? 0}`);
    console.log(`HOME_HIDDEN_SECTIONS=${home.metrics?.hiddenSections ?? 0}`);
  }
  for (const b of bad) {
    console.log(
      `BAD ${b.viewport} ${b.route} status=${b.status} 404=${b.has404} text=${b.bodyTextLen} final=${b.finalUrl}`,
    );
  }
  console.log(`REPORT=${path.join(outDir, "report.json")}`);
} catch (err) {
  code = 1;
  console.error(String(err));
} finally {
  await stopServer(server);
}

process.exit(code);
