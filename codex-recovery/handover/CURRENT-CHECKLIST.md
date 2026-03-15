# Current Checklist

`RECOVERY-CHECKLIST.md` is the single active checklist source of truth.

This handover file exists only as the fast-resume mirror inside the handover package. Do not maintain a second independent checklist here.

## Active Checklist Source

- `../RECOVERY-CHECKLIST.md`

## Current Frontline Status

- [x] Catalog source-gap triage is closed.
- [x] `missing_documents` remains visible as an active audit and content-ingestion lane.
- [x] `/downloads` remains a request-based `Resource Desk`.
- [x] The trust/legal/proof route wave is complete and documented.
- [x] The brand/company utility route wave is complete and documented.
- [x] The support-routing utility route wave is complete and documented.
- [x] The homepage/products pass is closed after the bounded follow-up cleanup and fresh build rerun.
- [x] The earlier generation-time Supabase/Nhost fallback noise remains a bounded hardening watch item; fresh builds still pass, but the noise has reappeared intermittently during verification.
- [x] The next bounded frontend frontier is category discovery and filter UX on `/products/[category]` with compare-entry continuity.
- [x] The first category-discovery wave is implemented and build-verified: category pricing truth is cleaner and compare/category return paths are stronger.
- [x] The second category-discovery wave is implemented and build-verified: active search/filter visibility and mobile drawer feedback are stronger.
- [x] The category-discovery lane is verification-closed after build, serial filter E2E, and direct mobile drawer checks.
- [x] The next bounded frontend frontier is product detail excellence on `/products/[category]/[product]`.
- [x] The product-detail lane is verification-closed after build, targeted PDP continuity verification, and targeted PDP accessibility verification.
- [x] The next bounded frontend frontier is configurator usefulness on `/configurator`.
- [x] The configurator lane is verification-closed after build, lint, and targeted homepage/product-tools/accessibility coverage.
- [x] `/home-unused` is a verified archive review route and the detailed archive recovery lane is deferred to the late-stage reintegration slot.
- [x] The bounded homepage truth-and-simplification pass is closed and verified: homepage truth is consolidated into `data/site/homepage.ts`, canonical category routes are restored, project cards are reduced to sector + company name truth, and homepage quick-contact is reduced to planner + WhatsApp + phone.
- [x] Fresh homepage verification rerun is captured on 2026-03-15: `npm run lint` pass, `npm run build` pass, and `npx playwright test tests/homepage.spec.ts --workers=1` pass.
- [x] The next bounded frontend frontier is homepage layout and closing-flow recovery on `/`.
- [x] Homepage layout and closing-flow recovery is implemented and verified: trust now sits near the footer, the homepage close is planner-led with lower-noise direct contact, and desktop/mobile header search submit explicitly on Enter.
- [x] Fresh homepage verification rerun is captured after the layout/search pass on 2026-03-15: `npm run lint` pass, `npm run build` pass, and `npx playwright test tests/homepage.spec.ts --workers=1` pass.
- [x] The next bounded frontend frontier is homepage visual QA and residual polish on `/`.
- [x] Slug and deep-ID policy is recorded as implementation-ready.

## Current Explicit Holds

- [x] Keep `fluid-x` as the only accepted legacy-slug exception.
- [x] Keep `oando-soft-seating--luna` explicitly deferred unless repo-backed evidence appears.
- [x] Keep `missing_documents` visible; do not hide or downgrade it.

## Merge Rule

- Update `RECOVERY-CHECKLIST.md` during active work.
- Refresh this file only as a mirror for handover/resume simplicity.
- If `CURRENT-CHECKLIST.md` and `RECOVERY-CHECKLIST.md` ever differ, trust `RECOVERY-CHECKLIST.md`.
