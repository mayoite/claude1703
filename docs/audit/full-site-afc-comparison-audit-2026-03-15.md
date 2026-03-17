# Full Site And AFC Comparison Audit

- Date: 2026-03-15
- Local repo: `E:\new-repo-20260306-235837`
- Primary external reference: `https://www.afcindia.in`
- Secondary external reference: `https://afc-india.webflow.io`

## Scope

This audit covered:

- local route inventory and product-route inventory
- local UI crawl on desktop and mobile against a controlled `next start` instance
- Supabase catalog integrity, slug integrity, asset/document coverage, and alt-text coverage
- product inventory comparison against AFC India sitemap URLs

## Evidence Files

- `docs/audit/route_manifest.json`
- `docs/audit/visual_desktop_audit.json`
- `docs/audit/visual_mobile_audit.json`
- `docs/audit/product-quality-audit.md`
- `docs/audit/product-quality-audit.json`
- `docs/audit/afc-sitemap-urls.txt`
- `docs/ops/audits/supabase-schema-audit.md`
- `docs/ops/audits/slug-id-overhaul-baseline.md`

## Executive Summary

The site is not yet a faithful AFC product/catalog implementation.

Confirmed high-confidence issues:

- Catalog parity is weak at the slug and taxonomy level.
- The local site still carries heavy legacy-route debt.
- Product documentation and alt-text coverage are effectively missing.
- Category and solution landing pages are extremely thin on copy.

Nuanced findings:

- The local catalog count is close to AFC after normalization, but the route shape is not.
- A large share of product routes still use legacy `oando-*` slugs instead of AFC-style public slugs.
- Several UI crawler failures are audit-noise rather than confirmed UX breakage.

## High-Confidence Findings

### 1. Product slug parity is badly off even where products exist

- Local product routes discovered: `145`
- AFC sitemap product URLs discovered: `144`
- Exact raw slug overlap: `1`
- Normalized probable product overlap: `127`
- Legacy-prefixed local product routes: `134`

Interpretation:

- The catalog is not missing everything.
- It is missing route/public-slug fidelity almost everywhere.
- The current site mostly represents AFC products through legacy/internal slugs rather than AFC-style public product URLs.

This is the single clearest catalog-quality problem.

### 2. AFC has products with no current local counterpart

After normalization, these AFC sitemap products do not currently have a local route counterpart:

- `copse`
- `crew`
- `crotch`
- `exquisite-mt`
- `ledge`
- `marker-board---nuvora`
- `nordic-2-wbqf1`
- `racks-1dk37`
- `side-unit`
- `side-unit-2`
- `snap`
- `wiesner`

Important note:

- Some AFC sitemap entries are currently unstable or dead on AFC itself.
- `exquisite-mt` redirects to a dead URL.
- `nordic-2-wbqf1` returns `404`.
- `racks-1dk37` returns `404`.
- `side-unit-2` returns `404`.
- `side-unit` currently resolves to `prelam-storage`.

So the reliable live-gap list is smaller than `12`, but it is still real. Confirmed live AFC-only products include:

- `copse`
- `crew`
- `crotch`
- `ledge`
- `snap`
- `wiesner`

### 3. Local has synthetic or non-AFC public product routes

These local routes do not have an AFC normalized counterpart:

- `education-classroom-accent-study-chair` -> `Accent Study Chair`
- `oando-soft-seating--luna` -> `Luna`
- `oando-storage--heavy-duty-racks` -> `Heavy Dut`
- `oando-storage--metal-pedestal` -> `Metal Pedestal`
- `oando-storage--metal-storages` -> `Metal`
- `oando-storage--prelam-storage` -> `Prelam`
- `seating-leather-classy-executive` -> `Classy Executive`
- `seating-study-fluid-task` -> `Fluid Task`
- `soft-seating-collaborative-cocoon-pod` -> `Cocoon Pod`
- `soft-seating-collaborative-solace-pod` -> `Solace Pod`
- `soft-seating-lounge-cocoon-lounge-chair` -> `Cocoon Lounge Chair`
- `storages-prelam-mobile-pedestal-3-drawer` -> `Mobile Pedestal 3-Drawer`
- `tables-meeting-cabin-60-30` -> `Cabin 60×30`
- `tables-meeting-cabin-l-shape` -> `Cabin L-Shape`
- `tables-meeting-conference-table-8-seater` -> `Conference Table 8-Seater`

These are the strongest candidates for cleanup/replacement because they look internally generated rather than AFC-public.

### 4. Taxonomy drift remains significant

Local taxonomy:

- categories in Supabase: `6`
- requested category routes: `seating`, `workstations`, `tables`, `storages`, `soft-seating`, `education`

AFC taxonomy observed from sitemap:

- `workstations`
- `tables`
- `storage`
- `seating`
- `soft-seating`
- `educational`
- `accessories`

Confirmed taxonomy mismatches:

- local uses `storages`; AFC uses `storage`
- local uses `education`; AFC uses `educational`
- AFC has `accessories`; local does not
- seating subcategory language diverges:
- local includes `fabric` and `study`
- AFC uses `training-chair` and does not expose the same public naming

This matters because it affects:

- route fidelity
- search behavior
- breadcrumbs
- canonical URL design
- user trust when comparing against AFC

### 5. Product documentation and alt-text coverage are effectively missing

From automated catalog audits:

- missing documents: `145 / 145`
- missing alt text: `145 / 145`
- missing primary image: `1`
- missing gallery images: `1`

This is a major quality failure for:

- credibility
- accessibility
- downloadable sales collateral
- SEO completeness

### 6. Canonical slug conflicts still exist

Current conflicts:

- `seating-mesh-fluid-x`: `fluid-x`, `oando-seating--fluid-x`
- `storages-prelam-prelam`: `oando-storage--pedestal`, `oando-storage--prelam-storage`

These conflicts show the catalog is still carrying parallel legacy/canonical identities.

## Route And UI Audit

### Route inventory

From the local crawl manifest:

- static/utility routes: `26`
- category routes: `6`
- solution-category routes: `6`
- product detail routes: `145`
- legacy redirect routes: `16`
- total desktop routes audited: `199`
- total mobile routes audited: `198`

### Confirmed route-level issues

- `/catalog` resolves to `/downloads`, which may be intentional but is not AFC-parity behavior.
- Category landing pages are content-thin:
- `/products/seating`
- `/products/tables`
- `/products/storages`
- `/products/soft-seating`
- `/products/education`
- solution category routes are similarly thin, especially storage.

Observed text lengths for thin category/solution pages were generally around `79` to `99` characters in the main content audit.

This is a real UX/content problem even if the page layout technically works.

### Audit noise that should not be treated as confirmed UX breakage yet

- Desktop `request_failed` counts are dominated by aborted `?_rsc=` requests to `/contact` and `/configurator`.
- Those look like interrupted React Server Component prefetch requests, not obvious user-visible failures.
- Product pages were flagged for `missing_h1` by the quick DOM audit.
- Code inspection shows the PDP template does contain a real `<h1>` in `app/products/[category]/[product]/ProductViewer.tsx`.

Conclusion:

- Treat `request_failed` as instrumentation noise unless manually reproduced.
- Treat PDP `missing_h1` as unconfirmed until rerun with a slower post-hydration wait.

## Confidence Notes

High confidence:

- route counts
- product counts
- legacy slug prevalence
- AFC-only and local-only normalized delta
- missing docs / missing alt text / missing images
- taxonomy mismatch
- canonical slug conflicts

Medium confidence:

- exact meaning of some AFC sitemap entries that now redirect or 404
- one-to-one mapping for storage/table edge cases like `side-unit` vs `prelam-storage`

Low confidence:

- desktop `request_failed` as a user-visible bug
- product-detail `missing_h1` from the fast crawl

## Recommended Remediation Order

1. Rebuild public product routes to AFC-style canonical slugs instead of legacy `oando-*` slugs.
2. Add the missing AFC-live products first: `copse`, `crew`, `crotch`, `ledge`, `snap`, `wiesner`.
3. Decide product-by-product whether the `15` local-only routes should be deleted, aliased, or mapped to AFC counterparts.
4. Normalize taxonomy to AFC public language:
5. `storage` not `storages`
6. `educational` not `education`
7. decide how `accessories` should be represented
8. Backfill alt text and document assets across the entire catalog.
9. Resolve the two canonical slug conflicts so one product maps to one public identity.
10. Expand category and solution landing-page copy so they are not effectively heading-only shells.

## Bottom Line

The site is partially there as a catalog shell, but it is not yet AFC-accurate.

The strongest objective statement is:

- product count is close
- product identity is not
- taxonomy is not
- documents/accessibility coverage is not

That means the repo is closer to a legacy catalog migration than a faithful AFC production mirror.
