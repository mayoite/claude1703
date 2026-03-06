import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { chromium, devices } from "playwright";

const PORT = 3200;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const OUTPUT_DIR = path.join(process.cwd(), "docs", "audit");
const MANIFEST_PATH = path.join(OUTPUT_DIR, "route_manifest.json");
const DESKTOP_PATH = path.join(OUTPUT_DIR, "visual_desktop_audit.json");
const MOBILE_PATH = path.join(OUTPUT_DIR, "visual_mobile_audit.json");

const STATIC_ROUTES = [
  "/",
  "/about",
  "/career",
  "/catalog",
  "/configurator",
  "/contact",
  "/downloads",
  "/gallery",
  "/imprint",
  "/news",
  "/planning",
  "/privacy",
  "/products",
  "/projects",
  "/quote-cart",
  "/service",
  "/showrooms",
  "/social",
  "/solutions",
  "/support-ivr",
  "/sustainability",
  "/terms",
  "/tracking",
  "/workstations/configurator",
  "/robots.txt",
  "/sitemap.xml",
];

const CATEGORY_ROUTES = [
  "/products/seating",
  "/products/workstations",
  "/products/tables",
  "/products/storages",
  "/products/soft-seating",
  "/products/education",
];

const SOLUTION_CATEGORY_ROUTES = [
  "/solutions/seating",
  "/solutions/workstations",
  "/solutions/tables",
  "/solutions/storages",
  "/solutions/soft-seating",
  "/solutions/education",
];

const LEGACY_REDIRECT_ROUTES = [
  "/products/oando-chairs",
  "/products/oando-other-seating",
  "/products/oando-seating",
  "/products/oando-workstations",
  "/products/oando-tables",
  "/products/oando-storage",
  "/products/oando-soft-seating",
  "/products/oando-collaborative",
  "/products/oando-educational",
  "/products/chairs-mesh",
  "/products/chairs-others",
  "/products/cafe-seating",
  "/products/desks-cabin-tables",
  "/products/meeting-conference-tables",
  "/products/others-1",
  "/products/others-2",
];

const MOBILE_HIGH_TRAFFIC = [
  "/",
  "/products",
  "/products/seating",
  "/projects",
  "/contact",
  "/quote-cart",
];

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url, timeoutMs = 180000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.status >= 200 && res.status < 500) {
        return true;
      }
    } catch {
      // ignore retries
    }
    await sleep(1000);
  }
  return false;
}

function startServer() {
  return spawn("npm", ["run", "dev", "--", "--port", String(PORT)], {
    cwd: process.cwd(),
    shell: true,
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function stopServer(server) {
  return new Promise((resolve) => {
    if (!server?.pid) {
      resolve();
      return;
    }
    if (process.platform === "win32") {
      const killer = spawn("taskkill", ["/pid", String(server.pid), "/t", "/f"], {
        stdio: "ignore",
      });
      killer.on("close", () => resolve());
      killer.on("error", () => resolve());
      return;
    }
    server.kill("SIGTERM");
    server.on("close", () => resolve());
    setTimeout(resolve, 2000);
  });
}

async function discoverProductRoutes(context) {
  const routes = new Set();

  for (const categoryRoute of CATEGORY_ROUTES) {
    const page = await context.newPage();
    try {
      await page.goto(`${BASE_URL}${categoryRoute}`, {
        waitUntil: "domcontentloaded",
        timeout: 25000,
      });
      await page.waitForTimeout(300);
      const hrefs = await page.evaluate(() =>
        Array.from(document.querySelectorAll("a[href]"))
          .map((a) => a.getAttribute("href") || "")
          .filter(Boolean),
      );
      for (const href of hrefs) {
        if (!href.startsWith("/products/")) continue;
        const cleaned = href.replace(/\/+$/, "");
        const segments = cleaned.split("/").filter(Boolean);
        if (segments.length >= 3) {
          routes.add(`/${segments.join("/")}`);
        }
      }
    } catch {
      // keep going for other categories
    } finally {
      await page.close();
    }
  }

  return Array.from(routes).sort();
}

async function diagnoseRoute(context, route, viewportLabel) {
  const page = await context.newPage();
  const consoleErrors = [];
  const failedRequests = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text().slice(0, 240));
    }
  });
  page.on("requestfailed", (req) => {
    failedRequests.push(
      `${req.url().slice(0, 180)} :: ${req.failure()?.errorText || "failed"}`.slice(
        0,
        240,
      ),
    );
  });

  let status = 0;
  let navError = null;
  let finalUrl = "";
  let metrics = {
    title: "",
    h1Count: 0,
    textLength: 0,
    imagesMissingAlt: 0,
    brokenImages: 0,
    horizontalOverflow: false,
    hasMain: false,
    ctaCount: 0,
  };

  try {
    const response = await page.goto(`${BASE_URL}${route}`, {
      waitUntil: "domcontentloaded",
      timeout: 25000,
    });
    status = response?.status() || 0;
    await page.waitForTimeout(250);
    finalUrl = page.url();

    metrics = await page.evaluate(() => {
      const main = document.querySelector("main");
      const text = (main?.innerText || document.body.innerText || "")
        .replace(/\s+/g, " ")
        .trim();
      const images = Array.from(document.images || []);
      const ctaSelector = "a,button,[role='button']";
      const ctaCount = Array.from(document.querySelectorAll(ctaSelector)).filter((el) => {
        const textValue = (el.textContent || "").trim();
        return textValue.length >= 2;
      }).length;

      return {
        title: document.title,
        h1Count: document.querySelectorAll("h1").length,
        textLength: text.length,
        imagesMissingAlt: images.filter((img) => !img.alt || !img.alt.trim()).length,
        brokenImages: images.filter((img) => img.complete && img.naturalWidth === 0).length,
        horizontalOverflow:
          document.documentElement.scrollWidth > window.innerWidth + 1,
        hasMain: Boolean(main),
        ctaCount,
      };
    });
  } catch (error) {
    navError = String(error?.message || error).slice(0, 260);
  } finally {
    await page.close();
  }

  const issues = [];
  if (navError) issues.push("navigation_error");
  if (status >= 400) issues.push("http_error");
  if (consoleErrors.length > 0) issues.push("console_error");
  if (failedRequests.length > 0) issues.push("request_failed");
  if (metrics.h1Count === 0) issues.push("missing_h1");
  if (metrics.textLength < 80) issues.push("text_sparse");
  if (metrics.brokenImages > 0) issues.push("broken_images");
  if (metrics.horizontalOverflow) issues.push("horizontal_overflow");
  if (!metrics.hasMain && !route.endsWith(".txt") && !route.endsWith(".xml")) {
    issues.push("missing_main");
  }

  return {
    route,
    viewport: viewportLabel,
    status,
    finalUrl,
    navError,
    issues,
    consoleErrors: consoleErrors.slice(0, 5),
    failedRequests: failedRequests.slice(0, 5),
    metrics,
  };
}

async function runBatch({
  name,
  routes,
  context,
  viewportLabel,
  capMs = 20 * 60 * 1000,
}) {
  const startedAt = Date.now();
  const results = [];
  const skipped = [];

  for (const route of routes) {
    if (Date.now() - startedAt > capMs) {
      skipped.push(route);
      continue;
    }
    const result = await diagnoseRoute(context, route, viewportLabel);
    results.push(result);
  }

  return {
    batch: name,
    routeCount: routes.length,
    auditedCount: results.length,
    skipped,
    results,
    durationMs: Date.now() - startedAt,
  };
}

function summarizeIssues(items) {
  const counters = new Map();
  for (const item of items) {
    for (const issue of item.issues) {
      counters.set(issue, (counters.get(issue) || 0) + 1);
    }
  }
  return Object.fromEntries(Array.from(counters.entries()).sort((a, b) => b[1] - a[1]));
}

async function main() {
  ensureDir(OUTPUT_DIR);
  const server = startServer();

  let startupLog = "";
  server.stdout.on("data", (chunk) => {
    startupLog += chunk.toString();
  });
  server.stderr.on("data", (chunk) => {
    startupLog += chunk.toString();
  });

  try {
    const ready = await waitForServer(`${BASE_URL}/`);
    if (!ready) {
      throw new Error(
        `Audit server failed to start within timeout.\n${startupLog.slice(-2000)}`,
      );
    }

    const browser = await chromium.launch({ headless: true });
    const desktopContext = await browser.newContext({
      ...devices["Desktop Chrome"],
    });
    const mobileContext = await browser.newContext({
      ...devices["iPhone 12"],
    });

    const productRoutes = await discoverProductRoutes(desktopContext);

    const manifest = {
      generatedAt: new Date().toISOString(),
      static_count: STATIC_ROUTES.length,
      category_count: CATEGORY_ROUTES.length,
      product_detail_count: productRoutes.length,
      redirect_count: LEGACY_REDIRECT_ROUTES.length,
      static_routes: STATIC_ROUTES,
      category_routes: CATEGORY_ROUTES,
      solution_category_routes: SOLUTION_CATEGORY_ROUTES,
      product_routes: productRoutes,
      redirect_routes: LEGACY_REDIRECT_ROUTES,
    };
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");

    const batchA = await runBatch({
      name: "A_static_utility",
      routes: Array.from(new Set(STATIC_ROUTES)),
      context: desktopContext,
      viewportLabel: "desktop",
      capMs: 12 * 60 * 1000,
    });
    const batchB = await runBatch({
      name: "B_category_solutions_redirects",
      routes: Array.from(
        new Set([...CATEGORY_ROUTES, ...SOLUTION_CATEGORY_ROUTES, ...LEGACY_REDIRECT_ROUTES]),
      ),
      context: desktopContext,
      viewportLabel: "desktop",
      capMs: 15 * 60 * 1000,
    });
    const batchC = await runBatch({
      name: "C_product_details",
      routes: productRoutes,
      context: desktopContext,
      viewportLabel: "desktop",
      capMs: 40 * 60 * 1000,
    });

    const desktopAll = [...batchA.results, ...batchB.results, ...batchC.results];
    const desktopFailures = desktopAll.filter((item) => item.issues.length > 0);

    const desktopPayload = {
      generatedAt: new Date().toISOString(),
      baseUrl: BASE_URL,
      batches: [batchA, batchB, batchC].map((batch) => ({
        batch: batch.batch,
        routeCount: batch.routeCount,
        auditedCount: batch.auditedCount,
        skippedCount: batch.skipped.length,
        durationMs: batch.durationMs,
      })),
      totals: {
        audited_routes: desktopAll.length,
        failure_routes: desktopFailures.length,
        issue_breakdown: summarizeIssues(desktopAll),
      },
      failures: desktopFailures,
      results: desktopAll,
    };
    fs.writeFileSync(DESKTOP_PATH, JSON.stringify(desktopPayload, null, 2), "utf8");

    const mobileRoutes = Array.from(
      new Set([...MOBILE_HIGH_TRAFFIC, ...desktopFailures.map((item) => item.route)]),
    );
    const mobileBatch = await runBatch({
      name: "M_mobile",
      routes: mobileRoutes,
      context: mobileContext,
      viewportLabel: "mobile",
      capMs: 25 * 60 * 1000,
    });
    const mobileFailures = mobileBatch.results.filter((item) => item.issues.length > 0);

    const mobilePayload = {
      generatedAt: new Date().toISOString(),
      baseUrl: BASE_URL,
      totals: {
        audited_routes: mobileBatch.results.length,
        failure_routes: mobileFailures.length,
        issue_breakdown: summarizeIssues(mobileBatch.results),
      },
      failures: mobileFailures,
      results: mobileBatch.results,
      skipped: mobileBatch.skipped,
    };
    fs.writeFileSync(MOBILE_PATH, JSON.stringify(mobilePayload, null, 2), "utf8");

    await desktopContext.close();
    await mobileContext.close();
    await browser.close();

    console.log(
      JSON.stringify(
        {
          routeManifest: MANIFEST_PATH,
          desktopAudit: DESKTOP_PATH,
          mobileAudit: MOBILE_PATH,
          desktopRoutes: desktopPayload.totals.audited_routes,
          desktopFailures: desktopPayload.totals.failure_routes,
          mobileRoutes: mobilePayload.totals.audited_routes,
          mobileFailures: mobilePayload.totals.failure_routes,
        },
        null,
        2,
      ),
    );
  } finally {
    await stopServer(server);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
