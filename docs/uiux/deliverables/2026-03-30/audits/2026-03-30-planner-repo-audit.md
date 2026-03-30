# Planner Repo Audit

Date: 2026-03-30
Repo: `D:\Claude1703`
Scope: planner-first repo audit, starting from `docs/uiux/planner-uiux-design-plan.md`

## Verification Run

- `npm run build`: PASS
- `npm test`: PASS (`jest --forceExit`, 34 tests)
- `npm run lint`: PASS with 131 warnings
- `npx playwright test tests/planner-react.spec.ts --reporter=list`: FAIL (5/6)

## Primary Findings

### P1 - Planner smoke tests are stale against the shipped UI

The current planner route builds and loads, but the Playwright smoke suite is asserting an older UI contract.

Evidence:

- Search placeholder drift:
  - Current UI: `Search products` in `components/planner/PlannerCatalogGrid.tsx`
  - Test expects: `Search all items...` in `tests/planner-react.spec.ts`
- CTA drift:
  - Current UI: `Add item to canvas` in `components/planner/PlannerCatalogGrid.tsx`
  - Test expects: `ADD` in `tests/planner-react.spec.ts`
- Loading-copy drift:
  - Current UI: `Updating inventory` in `components/planner/PlannerCatalogGrid.tsx`
  - Test expects: `Loading planner catalog` in `tests/planner-react.spec.ts`
- Empty-search copy drift:
  - Current UI: `No matches found` in `components/planner/PlannerCatalogGrid.tsx`
  - Test expects: `No products match the current search.` in `tests/planner-react.spec.ts`
- Removed heading/status contract:
  - Test still expects `WORKSPACE ENGINE` and `3D review active`
  - Current planner code does not expose the former and only the latter is status-driven, not reliably asserted by the suite

Impact:

- CI confidence on planner behavior is low because the suite mostly fails before it reaches real interaction coverage.
- The docs currently imply stronger planner verification than the repo actually has.

Recommended action:

- Rewrite `tests/planner-react.spec.ts` against current labels and stable role-based locators.
- Add assertions for planner behaviors that matter more than copy, such as catalog availability, item count changes, save/load roundtrip, and view switch state.

### P1 - Planner audit documentation is internally inconsistent

The full audit report under `docs/uiux/deliverables/2026-03-30/docs` states that the codebase is "test-stable", but the planner Playwright smoke suite is failing.

Evidence:

- `package.json` defines `test` as Jest only.
- Planner e2e coverage is split across Playwright scripts and is not part of the default `test` command.
- The existing full audit report states the codebase is buildable and test-stable without distinguishing Jest from Playwright.

Impact:

- Stakeholders can read the docs as "planner is verified" when only unit/integration coverage is green.

Recommended action:

- Update high-level audit docs to separate:
  - unit/integration status (`npm test`)
  - build status (`npm run build`)
  - planner/browser regression status (Playwright)

### P2 - The planner design plan has residual encoding corruption

`docs/uiux/planner-uiux-design-plan.md` contains mojibake in the legacy body text.

Impact:

- The document is harder to review and less trustworthy as a handoff artifact.

Recommended action:

- Normalize the remaining text encoding in a follow-up doc pass.
- Keep the verified audit snapshot at the top as the authoritative status block.

### P1 - Repo push risk due to large unrelated working-tree state

The working tree contains many staged and unstaged changes outside this audit.

Impact:

- A normal commit/push risks bundling unrelated planner, catalog, docs, and asset work.

Recommended action:

- Commit only audit-specific paths with an explicit path-limited commit.
- Push only after verifying the exact path set in the commit.

## Notes

- This audit did not change planner runtime code.
- The highest-value next fix is the broken planner Playwright suite, because it is the fastest way to recover reliable regression coverage.
