# Phase 10 Live Verification Report (2026-03-16)

## Scope

- Hosted production URL: `https://workingoando.vercel.app`
- Desktop + mobile verification of core user flows
- Accessibility smoke, navigation smoke, filters/state continuity, KPI consistency, compare/quote/contact continuity, configurator flows, trust/projects surfaces, and keyboard focus behavior

## Commands Executed

- `npm run audit:hosted:runtime -- --url=https://workingoando.vercel.app`
- `$env:PLAYWRIGHT_BASE_URL='https://workingoando.vercel.app'; npm run test:e2e:nav`
- `$env:PLAYWRIGHT_BASE_URL='https://workingoando.vercel.app'; npx playwright test tests/product-tools.spec.ts`
- `$env:PLAYWRIGHT_BASE_URL='https://workingoando.vercel.app'; npm run test:a11y`
- `$env:PLAYWRIGHT_BASE_URL='https://workingoando.vercel.app'; npx playwright test tests/homepage-visual-qa.spec.ts`
- `$env:PLAYWRIGHT_BASE_URL='https://workingoando.vercel.app'; npx playwright test tests/dynamic-filters.spec.ts`
- `$env:PLAYWRIGHT_BASE_URL='https://workingoando.vercel.app'; npm run test:e2e:stats-consistency`
- `$env:PLAYWRIGHT_BASE_URL='https://workingoando.vercel.app'; npx playwright test tests/homepage.spec.ts`
- Inline Playwright keyboard-focus probe over `/`, `/products`, `/contact`, `/compare`, `/trusted-by`, `/projects`
- Inline Playwright desktop/mobile route matrix probe over:
  - `/`
  - `/products/seating`
  - `/products/seating/oando-seating--phoenix?from=q%3Dphoenix`
  - `/configurator`
  - `/compare?items=oando-workstations--deskpro`
  - `/contact?intent=quote&source=compare`
  - `/trusted-by`
  - `/projects`

## Outcome Summary

- Hosted smoke gate: pass
- Navigation smoke: pass (5/5)
- Product tools: pass (8/8)
- Accessibility smoke: pass (7/7)
- Homepage visual QA: pass (2/2)
- Dynamic filters: pass (3/3)
- KPI consistency: pass (1/1)
- Homepage suite: pass (9/9) after reliability fixes
- Keyboard focus probe: pass on sampled routes (focus moved to actionable controls; no `BODY` focus after settle)
- Live route matrix probe: pass on sampled desktop/mobile routes (`200`, `main` visible, heading visible)

## Test Reliability Fixes Applied

- `tests/homepage.spec.ts`
  - Guided planner flow now waits for the assistant launcher/listener availability before opening planner dialog.
  - Conversion-order Y-axis check now uses stable DOM evaluation instead of nullable `boundingBox()` values.
  - Desktop search-submit assertion is now deterministic to behavior (`/products/<category>/<slug>`) rather than a single forced mock target.
  - Nav-search route mocking widened to `**/api/nav-search*` for trailing-slash and query variants.

## Residual Risks (Bounded)

- Verification is strong but still sampled; not every product detail route and every category permutation was exercised in this pass.
- Keyboard/focus verification currently includes one inline probe and not yet a committed dedicated spec file.
- Hosted `_next/image` sampled URLs return `404` under intentional unoptimized-hosted behavior; direct catalog image paths are healthy (`200`).

## Next Action

- Begin the next world-class lane from the sequence with a bounded implementation block (design-system/token and visual-consistency unification), while preserving release-hardening guardrails.
