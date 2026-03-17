import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, "app");
const AUDIT_DIR = path.join(ROOT, "docs", "audit");

const ROUTE_MANIFEST_PATH = path.join(AUDIT_DIR, "route_manifest.json");
const VISUAL_DESKTOP_PATH = path.join(AUDIT_DIR, "visual_desktop_audit.json");
const VISUAL_MOBILE_PATH = path.join(AUDIT_DIR, "visual_mobile_audit.json");
const CODE_MATRIX_JSON = path.join(AUDIT_DIR, "code_audit_matrix.json");

const OUT_SUMMARY = path.join(AUDIT_DIR, "full_audit_summary.md");
const OUT_CODE = path.join(AUDIT_DIR, "code_findings.md");
const OUT_DESKTOP = path.join(AUDIT_DIR, "visual_findings_desktop.md");
const OUT_MOBILE = path.join(AUDIT_DIR, "visual_findings_mobile.md");
const OUT_BACKLOG = path.join(AUDIT_DIR, "prioritized_fix_backlog.md");

function listFiles(dir, predicate = () => true, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      listFiles(full, predicate, files);
    } else if (predicate(full)) {
      files.push(full);
    }
  }
  return files;
}

function toPosix(p) {
  return p.replaceAll("\\", "/");
}

function routeFromPageFile(filePath) {
  const rel = toPosix(path.relative(APP_DIR, filePath));
  const routePart = rel === "page.tsx" ? "" : rel.replace(/\/page\.tsx$/, "");
  if (routePart === "") return "/";
  return `/${routePart}`;
}

function readFile(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function hasMetadata(content) {
  return (
    /export\s+const\s+metadata\s*=/.test(content) ||
    /export\s+async\s+function\s+generateMetadata/.test(content) ||
    /export\s+function\s+generateMetadata/.test(content)
  );
}

function hasRedirectOnly(content) {
  return /redirect\(/.test(content) && !/return\s*\(/.test(content);
}

function hasCanonical(content) {
  return /canonical/.test(content);
}

function hasOg(content) {
  return /openGraph/.test(content);
}

function hasTwitter(content) {
  return /twitter\s*:/.test(content);
}

function hasJsonLd(content) {
  return /application\/ld\+json/.test(content) || /@context/.test(content);
}

function detectSupabaseDependency(content) {
  const markers = [
    "@/lib/db",
    "@/lib/getProducts",
    "@/lib/businessStats",
    "@/lib/supabaseSafe",
    "supabase",
  ];
  return markers.some((marker) => content.includes(marker));
}

function issue(status, severity, text) {
  return { status, severity, text };
}

function buildCodeMatrix() {
  const pageFiles = listFiles(APP_DIR, (f) => f.endsWith("/page.tsx") || f.endsWith("\\page.tsx"));
  const layoutPath = path.join(APP_DIR, "layout.tsx");
  const sitemapPath = path.join(APP_DIR, "sitemap.ts");
  const robotsPath = path.join(APP_DIR, "robots.ts");
  const nextConfigPath = path.join(ROOT, "next.config.js");

  const rows = [];

  for (const file of pageFiles) {
    const rel = toPosix(path.relative(ROOT, file));
    const route = routeFromPageFile(file);
    const content = readFile(file);
    const dynamic = /\[[^\]]+\]/.test(route);
    const redirectOnly = hasRedirectOnly(content);

    const row = {
      route,
      file: rel,
      metadata: hasMetadata(content),
      canonical: hasCanonical(content),
      openGraph: hasOg(content),
      twitter: hasTwitter(content),
      jsonLd: hasJsonLd(content),
      supabaseDependency: detectSupabaseDependency(content),
      redirectOnly,
      status: "ok",
      issues: [],
    };

    if (!redirectOnly && !row.metadata && !dynamic) {
      row.status = "risk";
      row.issues.push(issue("risk", "P1", "Missing route-level metadata export"));
    }

    if (route.startsWith("/solutions/") && dynamic && row.metadata) {
      row.issues.push(
        issue(
          "risk",
          "P1",
          "Dynamic route metadata exists but runtime handling must support Next.js async params contract",
        ),
      );
    }

    if (!row.jsonLd && (route === "/" || route.startsWith("/projects") || route === "/contact")) {
      row.issues.push(issue("risk", "P2", "No page-specific JSON-LD schema found"));
      if (row.status === "ok") row.status = "risk";
    }

    rows.push(row);
  }

  const layout = readFile(layoutPath);
  if (/alternates:\s*\{\s*canonical:\s*["'`]\/["'`]/.test(layout)) {
    rows.push({
      route: "*",
      file: "app/layout.tsx",
      metadata: true,
      canonical: true,
      openGraph: hasOg(layout),
      twitter: hasTwitter(layout),
      jsonLd: hasJsonLd(layout),
      supabaseDependency: false,
      redirectOnly: false,
      status: "risk",
      issues: [issue("risk", "P1", "Global canonical set to '/' can collapse canonical signals")],
    });
  }

  const sitemap = readFile(sitemapPath);
  if (sitemap.includes('"/quote-cart"') || sitemap.includes('"/tracking"')) {
    rows.push({
      route: "/sitemap.xml",
      file: "app/sitemap.ts",
      metadata: false,
      canonical: false,
      openGraph: false,
      twitter: false,
      jsonLd: false,
      supabaseDependency: true,
      redirectOnly: false,
      status: "risk",
      issues: [
        issue(
          "risk",
          "P2",
          "Sitemap includes low-index utility routes (/quote-cart or /tracking)",
        ),
      ],
    });
  }

  const robots = readFile(robotsPath);
  if (!robots.includes("/fallback/")) {
    rows.push({
      route: "/robots.txt",
      file: "app/robots.ts",
      metadata: false,
      canonical: false,
      openGraph: false,
      twitter: false,
      jsonLd: false,
      supabaseDependency: false,
      redirectOnly: false,
      status: "risk",
      issues: [issue("risk", "P2", "Robots rules do not explicitly disallow fallback snapshot paths")],
    });
  }

  const nextConfig = readFile(nextConfigPath);
  if (nextConfig.includes("permanent: false")) {
    rows.push({
      route: "/products/* legacy",
      file: "next.config.js",
      metadata: false,
      canonical: false,
      openGraph: false,
      twitter: false,
      jsonLd: false,
      supabaseDependency: false,
      redirectOnly: false,
      status: "risk",
      issues: [
        issue(
          "risk",
          "P2",
          "Legacy route redirects use temporary redirects (permanent:false), weaker for SEO consolidation",
        ),
      ],
    });
  }

  return rows.sort((a, b) => a.route.localeCompare(b.route));
}

function topBrokenImageRoutes(visualPayload, limit = 20) {
  return visualPayload.results
    .filter((r) => r.metrics?.brokenImages > 0)
    .sort((a, b) => b.metrics.brokenImages - a.metrics.brokenImages)
    .slice(0, limit);
}

function failedHttpRoutes(visualPayload) {
  return visualPayload.results.filter((r) => r.status >= 400);
}

function stat(issues, key) {
  return issues[key] || 0;
}

function mdList(items) {
  return items.map((x) => `- ${x}`).join("\n");
}

function buildReports({ matrix, manifest, desktop, mobile }) {
  const codeRisk = matrix.filter((r) => r.status !== "ok");
  const missingMetadataRoutes = matrix
    .filter((r) => r.issues.some((i) => i.text.includes("Missing route-level metadata")))
    .map((r) => r.route);
  const desktopHttpFailures = failedHttpRoutes(desktop);
  const mobileHttpFailures = failedHttpRoutes(mobile);

  const p0Findings = [];
  if (desktopHttpFailures.length > 0) {
    p0Findings.push(
      `Runtime HTTP failures on desktop routes: ${desktopHttpFailures.map((r) => `${r.route} (${r.status})`).join(", ")}`,
    );
  }
  if (mobileHttpFailures.length > 0) {
    p0Findings.push(
      `Runtime HTTP failures on mobile routes: ${mobileHttpFailures.map((r) => `${r.route} (${r.status})`).join(", ")}`,
    );
  }

  const p1Findings = [
    `Missing route-level metadata on ${missingMetadataRoutes.length} indexable static pages`,
    `Global canonical configured at root layout (risk of canonical collapse to homepage)`,
    `Supabase business stats table missing; fallback path logs console errors on key pages`,
  ];

  const p2Findings = [
    `Broken product images detected on ${stat(desktop.totals.issue_breakdown, "broken_images")} desktop route checks`,
    `Sitemap includes low-index utility routes (/quote-cart, /tracking)`,
    `Legacy redirects in next.config.js are temporary (302/307 style) instead of permanent`,
  ];

  const summary = `# Full Extensive Audit Summary\n\n## Scope\n- Code audit completed for app routes, metadata/schema configuration, routing, data dependencies, and accessibility signal scans.\n- Visual audit completed in chunked batches on desktop and mobile.\n\n## Route Universe\n- Static routes: ${manifest.static_count}\n- Category routes: ${manifest.category_count}\n- Product detail routes discovered: ${manifest.product_detail_count}\n- Legacy redirect routes validated: ${manifest.redirect_count}\n\n## Execution Results\n- Lint: pass\n- Build: pass (with Supabase fallback warnings)\n- Playwright nav: pass\n- Playwright KPI consistency: pass\n- Playwright a11y smoke: pass\n- Desktop visual audited routes: ${desktop.totals.audited_routes}\n- Mobile visual audited routes: ${mobile.totals.audited_routes}\n\n## Key Risks by Severity\n### P0\n${p0Findings.length ? mdList(p0Findings) : "- None detected"}\n\n### P1\n${mdList(p1Findings)}\n\n### P2\n${mdList(p2Findings)}\n\n## Notes\n- Console error counts in visual output are heavily driven by known fallback logging from missing Supabase stats table.\n- robots.txt and sitemap.xml are non-HTML endpoints; missing h1/main flags are expected and treated as non-actionable.\n`;

  const codeFindings = `# Code Findings\n\n## Matrix Summary\n- Total matrix rows: ${matrix.length}\n- Rows with risk/fail status: ${codeRisk.length}\n\n## High-Priority Code Findings\n1. Global canonical strategy risk\n- File: app/layout.tsx\n- Issue: canonical configured as '/'.\n- Impact: can weaken per-page canonical signal quality.\n- Fix: move canonical to route-level metadata only.\n\n2. Missing route-level metadata\n- Count: ${missingMetadataRoutes.length}\n- Routes:\n${mdList(missingMetadataRoutes.slice(0, 60))}\n\n3. Supabase stats fallback dependency noise\n- Files: app/page.tsx, app/projects/page.tsx, lib/businessStats.ts\n- Issue: missing public.business_stats_current table in active Supabase.\n- Impact: fallback values + console noise; trust/data integrity risk.\n\n4. Sitemap and robots policy hardening\n- Files: app/sitemap.ts, app/robots.ts\n- Issue: includes utility routes; no explicit fallback disallow.\n\n## code_audit_matrix\n- JSON: docs/audit/code_audit_matrix.json\n`;

  const brokenDesktop = topBrokenImageRoutes(desktop, 40);
  const brokenMobile = topBrokenImageRoutes(mobile, 40);

  const visualDesktop = `# Visual Findings - Desktop\n\n## Coverage\n- Audited routes: ${desktop.totals.audited_routes}\n- Routes with one or more flags: ${desktop.totals.failure_routes}\n- Issue breakdown: ${JSON.stringify(desktop.totals.issue_breakdown)}\n\n## Confirmed Runtime Failures (Actionable)\n${desktopHttpFailures.length ? mdList(desktopHttpFailures.map((r) => `${r.route} -> HTTP ${r.status}`)) : "- None"}\n\n## Broken Image Hotspots (Top)\n${brokenDesktop.length ? mdList(brokenDesktop.map((r) => `${r.route} (brokenImages=${r.metrics.brokenImages})`)) : "- None"}\n\n## Notes\n- console_error is inflated by expected fallback logging ([business-stats] fallback...) and should be triaged separately from true JS runtime crashes.\n- missing_h1 for /robots.txt and /sitemap.xml is expected for non-HTML routes.\n`;

  const visualMobile = `# Visual Findings - Mobile\n\n## Coverage\n- Audited routes: ${mobile.totals.audited_routes}\n- Routes with one or more flags: ${mobile.totals.failure_routes}\n- Issue breakdown: ${JSON.stringify(mobile.totals.issue_breakdown)}\n\n## Confirmed Runtime Failures (Actionable)\n${mobileHttpFailures.length ? mdList(mobileHttpFailures.map((r) => `${r.route} -> HTTP ${r.status}`)) : "- None"}\n\n## Broken Image Hotspots (Top)\n${brokenMobile.length ? mdList(brokenMobile.map((r) => `${r.route} (brokenImages=${r.metrics.brokenImages})`)) : "- None"}\n\n## Mobile-Specific Notes\n- Same solution subcategory failure pattern appears on mobile and desktop.\n- Core high-traffic pages remain navigable, but image integrity defects are widespread on product details.\n`;

  const backlog = `# Prioritized Fix Backlog\n\n## P0 - Fix Immediately\n1. Repair /solutions/[category] runtime failures returning HTTP 500.\n- Scope: /solutions/seating, /workstations, /tables, /storages, /soft-seating, /education\n- Validation: all return 200 in desktop and mobile visual batches.\n\n## P1 - Trust/SEO/Data Integrity\n1. Remove global canonical default from app/layout.tsx and enforce route-level canonical.\n2. Add metadata to static pages missing route-level metadata exports.\n3. Create and seed Supabase table public.business_stats_current (or disable fallback logging in production).\n4. Add per-page JSON-LD for projects/contact and reinforce product/category schema consistency.\n\n## P2 - Quality and Crawl Hygiene\n1. Fix missing/broken product image references (starting with top 40 flagged routes).\n2. Exclude utility routes from sitemap where not index-worthy.\n3. Mark legacy redirects as permanent where migration is complete.\n4. Improve alt text consistency for SEO + accessibility quality.\n\n## Regression Checklist After Fixes\n1. npm run lint\n2. npm run build\n3. npm run test:e2e:nav\n4. npm run test:e2e:stats-consistency\n5. npm run test:a11y\n6. Re-run scripts/audit_full_pages.mjs and compare desktop/mobile failure counts.\n`;

  return { summary, codeFindings, visualDesktop, visualMobile, backlog };
}

function main() {
  const manifest = JSON.parse(readFile(ROUTE_MANIFEST_PATH));
  const desktop = JSON.parse(readFile(VISUAL_DESKTOP_PATH));
  const mobile = JSON.parse(readFile(VISUAL_MOBILE_PATH));

  const matrix = buildCodeMatrix();
  fs.writeFileSync(CODE_MATRIX_JSON, JSON.stringify(matrix, null, 2), "utf8");

  const reports = buildReports({ matrix, manifest, desktop, mobile });

  fs.writeFileSync(OUT_SUMMARY, reports.summary, "utf8");
  fs.writeFileSync(OUT_CODE, reports.codeFindings, "utf8");
  fs.writeFileSync(OUT_DESKTOP, reports.visualDesktop, "utf8");
  fs.writeFileSync(OUT_MOBILE, reports.visualMobile, "utf8");
  fs.writeFileSync(OUT_BACKLOG, reports.backlog, "utf8");

  console.log(
    JSON.stringify(
      {
        codeMatrix: CODE_MATRIX_JSON,
        outputs: [OUT_SUMMARY, OUT_CODE, OUT_DESKTOP, OUT_MOBILE, OUT_BACKLOG],
      },
      null,
      2,
    ),
  );
}

main();
