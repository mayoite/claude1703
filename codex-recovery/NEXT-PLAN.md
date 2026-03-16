# Automated Verification Hardening
# Objective: Keep one bounded hardening lane focused on repeatable green verification, then close remaining runtime warning clusters without widening into route redesign.

## Current Block

- `Automated Verification Hardening (verification-closed)`

## Execution Charter
This block must follow these non-negotiable principles during execution:

- Keep the lane bounded to verification reliability and runtime warning reduction.
- Do not reopen catalog redesign, copy redesign, or archive reintegration.
- Fix failing tests in small, explicit slices.
- Preserve current route structure and conversion flow.

Execution standards for this block:

- Keep `missing_documents` visible as a source-gap truth.
- Keep `/downloads` as a request-based `Resource Desk`.
- Keep `oando-soft-seating--luna` explicitly deferred unless repo-backed media evidence appears.
- Keep `NEXT-PLAN.md` at or under 17.5% of `WORLD-CLASS-PLAN.md` and limited to this single active lane.
- Update recovery docs as the lane moves so fresh-session resume stays accurate.

## Recorded Completion Baseline
- Trust-sensitive copy and alt-text hardening is closed and verified.
- `npm run lint`: pass.
- `npm run build`: pass.
- `npm test`: pass.
- `npm run test:e2e:nav`: pass.
- `npm run test:e2e:filters`: pass.
- `npm run test:e2e:stats-consistency`: pass.
- `npm run test:a11y`: pass.

## Active Findings
- Core automated verification is now green.
- The seating image optimizer warning cluster was reduced by mapping stale Phoenix `.webp` references to repo-backed `.jpg` assets and dropping non-existent overflow indices.
- The next bounded task is deployment and environment hardening.

## Execution Sequence
### First Slice
1. Lock all automated verification suites to green.
2. Record exact failures and patch only failing harness/tests/runtime assumptions.
3. Re-run the exact failing suites before broad reruns.

### Second Slice
1. Re-run full bounded verification set (`lint`, `build`, unit, nav, filters, stats, a11y).
2. Capture residual runtime warnings that do not fail tests.
3. Prioritize warning clusters by user impact.

### Final Slice
1. Fix the highest-impact runtime warning cluster (seating image optimizer warnings).
2. Re-run targeted suites to confirm warning reduction and no regressions.
3. Leave one next explicit step only.

## Detailed Checklist
### First Slice

- [x] Run `npm test`
- [x] Patch Jest runtime for `next/cache` + `unstable_cache` usage
- [x] Fix failing unit expectations in `tests/get-products.test.ts`
- [x] Re-run `npm test` to green

### Second Slice

- [x] Run `npm run test:e2e:nav`
- [x] Fix and stabilize `tests/dynamic-filters.spec.ts`
- [x] Run `npm run test:e2e:filters`
- [x] Fix and stabilize `tests/stats-consistency.spec.ts`
- [x] Run `npm run test:e2e:stats-consistency`
- [x] Run `npm run test:a11y`
- [x] Re-run `npm run lint`
- [x] Re-run `npm run build`

### Final Slice

- [x] Audit and fix seating image optimizer warning paths reported during Playwright runs
- [x] Re-run `npm run test:e2e:filters` after warning fixes
- [x] Re-run `npm run build` after warning fixes
- [x] Update `DECISIONS.md`, `RECOVERY-CHECKLIST.md`, and `latest.md` after warning-lane closure
- [x] Leave one next explicit step only

## Completion Markers

- [x] Core automated verification suite is fully green.
- [x] High-impact runtime warning clusters are reduced or resolved.
- [x] Recovery docs reflect the warning-lane closure.

## Not In This Block

- [ ] Do not reopen broad catalog repair.
- [ ] Do not reopen homepage/layout redesign.
- [ ] Do not start archive reintegration.
- [ ] Do not fabricate external assets or unsupported claims.

## Guardrails

- Keep repo truth above completeness theater.
- Keep route safety and preview/internal protection rules intact.
- Keep fixes reversible and verifiable.

## Next Explicit Step

- Start bounded deployment and environment hardening: validate production env vars, confirm core asset-path behavior on hosted builds, and capture residual risks.
