# Current Checklist

`RECOVERY-CHECKLIST.md` is the single active checklist source of truth.

This handover file exists only as the fast-resume mirror inside the handover package. Do not maintain a second independent checklist here.

## Active Checklist Source

- `../RECOVERY-CHECKLIST.md`

## Current Frontline Status

- [x] Catalog source-gap triage is closed.
- [x] `missing_documents` remains visible as an active audit and content-ingestion lane.
- [x] `/downloads` remains a request-based `Resource Desk`.
- [x] Trust/legal/proof, utility/support, homepage/discovery, category discovery, PDP, configurator, homepage closure, compare/quote-cart, quote/contact, SEO, footer, and trust-copy lanes are all closed and recorded.
- [x] Automated verification hardening is verification-closed on 2026-03-16 (`npm test`, targeted e2e, `lint`, and `build` all green).
- [x] Seating image optimizer warning lane is patched and verified on 2026-03-16.
- [x] Deployment/environment hardening is verification-closed on 2026-03-16 (Vercel env baseline verified, hosted route/API smoke green, production redeploy complete, hosted smoke command added).
- [x] Phase 10 live experience verification and release-hardening closeout is verification-closed on 2026-03-16 (hosted route matrix, keyboard/focus checks, and core nav/tools/a11y/filter/stats suites all green).
- [x] The active frontier has rotated to Phase 4 design-system/token and visual-consistency unification.
- [x] Slug and deep-ID policy is recorded as implementation-ready.

## Current Explicit Holds

- [x] Keep `fluid-x` as the only accepted legacy-slug exception.
- [x] Keep `oando-soft-seating--luna` explicitly deferred unless repo-backed evidence appears.
- [x] Keep `missing_documents` visible; do not hide or downgrade it.

## Merge Rule

- Update `RECOVERY-CHECKLIST.md` during active work.
- Refresh this file only as a mirror for handover/resume simplicity.
- If `CURRENT-CHECKLIST.md` and `RECOVERY-CHECKLIST.md` ever differ, trust `RECOVERY-CHECKLIST.md`.
