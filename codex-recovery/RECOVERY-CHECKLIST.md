# Recovery Checklist

This is the active execution checklist.

Update this file as recovery work progresses. Keep exactly one active frontier in progress in each working session.

## Current Active Frontier

- [x] Phase 1 structural recovery complete and recorded
- [x] Phase 8 catalog audit consolidation finalized as an active execution block
- [x] Critical workstation media repair pulled into the Week 1 basics-first lane ahead of medium-severity metadata cleanup
- [x] Supabase/Nhost mirror realignment tasks converted into an implementation-ready work block
- [x] The basics-first order was locked: missing images and hardcoding before the platform contract follow-on
- [x] First 24-hour platform baseline captured with live Supabase/Nhost parity counts and source-contract lock
- [x] Middle 24-hour business-stats fallback alignment validated in code and build verification
- [x] Legacy Nhost dependency inventory captured with explicit `active-required` vs `transition-compatible` classification
- [x] Platform closeout verification rerun captured (`npm run build` pass, `audit:nhost:backup` parity pass with known GraphQL alias exposure gap)
- [x] Platform closeout disposition recorded as `deferred-with-reason` with one explicit re-entry trigger
- [x] Deferred platform re-entry trigger executed and closed (`product_slug_aliases` GraphQL exposure now tracked in Hasura metadata; `audit:nhost:backup` at `graphqlFailures=0`)
- [x] Completed-step re-audit rerun captured (proven-dead preservation still intact; build pass; parity `tableDiffs=0`, `graphqlFailures=1`)
- [x] Site re-audit update captured with live catalog signal (`audit:supabase:catalog` pass) and tooling-drift note (`audit:products:quality` stale import failure)
- [x] Product-quality audit drift repaired (`scripts/audit-product-quality.ts` now runs against the live catalog path; `lib/productSpecSchema.ts` restored from local salvage)
- [x] Comprehensive audit sweep captured across lint/build/types/unit/e2e/a11y/data/parity/slug-id/external-asset checks (`codex-recovery/AUDIT-ALL-2026-03-12.md`)
- [x] Visual audit captured for desktop/mobile route matrix with evidence and findings (`codex-recovery/AUDIT-VISUAL-2026-03-12.md`)
- [x] Full-page scroll audit captured with route-level evidence and image-failure findings (`codex-recovery/AUDIT-FULLPAGE-SCROLL-2026-03-12.md`)
- [x] Catalog source-gap triage closed with one explicit next step only
- [x] Trust/support frontend lane is now the single active frontier
- [x] The first trust/support route cluster is selected and documented before code edits begin
- [x] The first trust/support route wave is implemented and build-verified
- [x] Folder-order audit completed and `trashfiles/` residue reclassified into `archive/trashfiles-review/2026-03-13`
- [x] Legal/compliance route wave implemented and build-verified
- [x] Proof/showcase route wave implemented and build-verified
- [x] Fresh verification rerun completed for active world-class-plan alignment (`npm run build` pass, `npm run lint` pass, top-phase completed items re-marked from verified repo state)
- [x] Recovery helper `.txt` files re-audited and rewritten so resume, handoff, and block-execution instructions match the current folder rules
- [x] Recovery planning authority collapsed to three files: `WORLD-CLASS-PLAN.md`, `NEXT-PLAN.md`, and `RECOVERY-CHECKLIST.md`
- [x] Redundant helper docs deleted from `codex-recovery/` so the folder no longer carries duplicate operator instructions
- [x] Minimal important helper files restored: folder map, close-chat prompt, and new-chat prompts
- [x] Added `RECOVERY-FOLDER-GUIDE.txt` with the file-by-file recovery map plus one full handoff command and one full new-chat command
- [x] Merged the overlapping helper files into one operator file: `RECOVERY-CHAT-FLOW.txt`
- [x] Next bounded frontend frontier is now explicit: brand/company utility routes (`/about`, `/sustainability`, `/career`, `/social`)
- [x] Slug and deep-ID policy is now recorded as implementation-ready from current audit and runtime truth
- [x] `oando-soft-seating--luna` remains explicitly deferred until repo-backed media evidence appears
- [x] `NEXT-PLAN.md` size rule locked: single active frontier only, capped at 17.5% of `WORLD-CLASS-PLAN.md`
- [x] First utility-route implementation pair completed and build-verified: `/about` and `/sustainability`
- [x] Second utility-route implementation pair completed and build-verified: `/career` and `/social`
- [x] Support-routing route wave completed and build-verified: `/news`, `/tracking`, `/support-ivr`
- [x] Next bounded frontend frontier is now homepage and top-level product discovery: `/` and `/products`
- [x] First homepage/discovery pass implemented and build-verified: homepage proof/discovery expansion plus `/products` route-system alignment
- [x] Homepage/discovery data cleanup implemented and build-verified: stronger hero trust copy plus reduced duplicated collection/category literals
- [x] Homepage brand-statement narrative restored into live flow with typed copy and cleaned public text
- [x] Products-route CTA flow now includes direct `Resource Desk` continuity instead of drifting away from request-based document truth
- [x] Homepage/products follow-up closed: remaining low-signal public copy removed from the active pair through typed content and shared section cleanup
- [x] Fresh homepage/products rerun captured: `npm run build` pass on 2026-03-13 with the earlier generation-time fallback noise not reproducing; keep that prior signal as a bounded hardening watch item
- [x] Recovery snapshot and handover regenerated after the homepage/products pass and follow-up state was mirrored into the handover package
- [x] Next bounded frontend frontier is now category discovery and filter UX on `/products/[category]` with compare-entry continuity
- [x] Category discovery wave 1 implemented and build-verified: removed synthetic category-card pricing, added category-to-compare continuity, and improved `/compare` return routing and empty-state truth
- [x] Category discovery wave 2 implemented and build-verified: active search/filter state is clearer, results summaries are more visible, and the mobile drawer gives stronger result feedback before closing
- [x] Targeted category-discovery verification closed cleanly: `npm run build` pass, `npx playwright test tests/dynamic-filters.spec.ts --workers=1` pass, and direct mobile drawer verification pass
- [x] Next bounded frontend frontier is now product detail excellence on `/products/[category]/[product]`
- [x] Product-detail wave 1 implemented and build-verified: breadcrumb truth is cleaner, PDP quote/compare href continuity is safer, and planning/Resource Desk CTA continuity is stronger
- [x] Product-detail wave 2 implemented and verified: media-summary hierarchy, decision snapshot, spec grouping, and support truth are stronger on `/products/[category]/[product]`
- [x] Targeted product-detail verification closed cleanly: `npm run build` pass, PDP continuity Playwright pass, and PDP accessibility Playwright pass
- [x] Fresh build verification still passes, with Supabase/Nhost generation-time fallback noise recorded again as a bounded hardening watch item rather than an active frontend blocker
- [x] The product-detail lane is closed and the next bounded frontend frontier rotated to configurator usefulness on `/configurator`
- [x] Configurator usefulness wave implemented and verified: dual-mode flow, route-scoped copilot, quieter global assistant behavior on `/configurator`, clearer review/submission path, and mobile review continuity are all live
- [x] Configurator verification closed cleanly: `npm run build` pass, `npm run lint` pass, and `npx playwright test tests/homepage.spec.ts tests/product-tools.spec.ts tests/accessibility.spec.ts --workers=1` pass
- [x] `/home-unused` is now a verified archive review route with mounted candidates, verdicts, search/filtering, and live-comparison links
- [x] The detailed archive recovery plan is now recorded as a deferred late-stage lane rather than an active frontend frontier
- [x] The next bounded frontend frontier is now global conversion and SEO/contact hardening through the global footer, contact routing, and metadata foundation
- [x] Homepage truth-and-simplification pass implemented and verified: live homepage truth consolidated into `data/site/homepage.ts`, canonical category routes restored, project cards reduced to sector + company name truth, and the homepage contact model reduced to planner + WhatsApp + phone
- [x] Homepage stale-branch cleanup implemented and verified: old homepage-only component ownership was removed from the active tree and the IA/layout rationale was recorded in `docs/homepage-ia-flowchart.md`
- [x] Homepage verification closed cleanly for the truth-and-simplification pass: `npm run lint` pass, `npm run build` pass, `npx playwright test tests/homepage.spec.ts --workers=1` pass, and static search checks showed no live homepage-facing stale `?category=` links, no project location strings, and no homepage quick-contact email action
- [x] Fresh homepage verification rerun captured after recovery-doc realignment: `npm run lint` pass, `npm run build` pass, and `npx playwright test tests/homepage.spec.ts --workers=1` pass on 2026-03-15
- [x] The next bounded frontend frontier is now homepage layout and closing-flow recovery on `/`
- [x] Homepage layout and closing-flow recovery is implemented and verified: the proof strip now sits near the footer, the homepage close is planner-led with quieter direct-contact support, and desktop/mobile header search now submit explicitly on Enter
- [x] Fresh homepage verification rerun captured after the layout/search pass on 2026-03-15: `npm run lint` pass, `npm run build` pass, and `npx playwright test tests/homepage.spec.ts --workers=1` pass
- [x] The next bounded frontend frontier is now homepage visual QA and residual polish on `/`
- [x] Homepage visual QA and residual polish is verification-closed: targeted desktop/mobile QA passed and the homepage route block can close without further edits
- [x] Compare and quote-cart continuity is implemented and verified: compare now hands products directly into quote-cart, quote-cart restores compare continuity, and both routes use stronger planning/Resource Desk conversion copy
- [x] Fresh conversion-tool verification rerun captured on 2026-03-15: `npm run lint` pass, `npm run build` pass, `npx playwright test tests/product-tools.spec.ts --workers=1` pass, and `npx playwright test tests/homepage-visual-qa.spec.ts --workers=1` pass
- [x] The next bounded frontend frontier is now quote/contact flow hardening on `/contact`
- [x] Quote/contact flow hardening is implemented and verified: compare and quote-cart now preserve quote intent into `/contact`, `/contact` shows source-aware quote context, and customer-query submissions now keep contextual `requirement`, `source`, and `sourcePath`
- [x] Fresh quote/contact verification rerun captured on 2026-03-15: `npm run lint` pass, `npm run build` pass, and `npx playwright test tests/product-tools.spec.ts --workers=1` pass
- [x] The next bounded frontend frontier is now SEO and structured-data ownership hardening on key public entry routes
- [x] SEO and structured-data ownership hardening is implemented and verified on key public entry routes: `/`, `/products`, `/contact`, `/products/[category]`, and `/products/[category]/[product]` now use clearer route-level metadata ownership and explicit page/breadcrumb schema
- [x] Fresh SEO-lane verification rerun captured on 2026-03-15: `npm run lint` pass, `npm run build` pass, and `npx playwright test tests/dynamic-filters.spec.ts --grep "product detail carries from context and breadcrumb returns to filtered list" --workers=1` pass
- [x] The next bounded frontend frontier is now footer and global contact surface hardening
- [x] Footer and global contact-surface hardening is implemented and verified: duplicate footer contact paths were reduced, footer contact ownership is clearer, and the footer conversion panel no longer repeats on routes that already carry a dedicated conversion surface
- [x] Fresh footer-lane verification rerun captured on 2026-03-15: `npm run lint` pass and `npm run build` pass
- [x] The next bounded frontend frontier is now trust-sensitive copy and alt-text hardening
- [x] Trust-sensitive copy and alt-text hardening is implemented and verification-closed on 2026-03-16: shared hero alt handling is corrected, high-traffic product/category/PDP/gallery alt fallbacks are more descriptive, and high-risk sustainability/PDP fallback copy is now repo-truth aligned.
- [x] Fresh trust-copy verification rerun captured on 2026-03-16: `npm run lint` pass and `npm run build` pass
- [x] The next bounded frontend frontier is now automated verification hardening (`npm test` and targeted E2E stability)
- [x] Automated verification hardening slice is green on 2026-03-16: `npm test`, `npm run test:e2e:nav`, `npm run test:e2e:filters`, `npm run test:e2e:stats-consistency`, and `npm run test:a11y` all pass
- [x] Fresh hardening rerun captured on 2026-03-16: `npm run lint` pass and `npm run build` pass after test fixes
- [x] The current bounded frontier remains automated verification hardening, narrowed to residual runtime warning cleanup (seating image optimizer warnings)
- [x] Seating image optimizer warning lane is patched on 2026-03-16: stale `/images/catalog/oando-seating--phoenix/*.webp` references are mapped to repo-backed JPG assets and invalid overflow indices are dropped
- [x] Post-warning verification rerun captured on 2026-03-16: `npm run test:e2e:filters` pass, `npm run build` pass, and `npm test` pass
- [x] The next bounded frontend frontier is deployment and environment hardening
- [x] Deployment/environment hardening baseline verified on 2026-03-16: Vercel Production+Development env vars confirmed via `npx vercel env ls`; hosted `/`, `/products/`, `/contact/`, `/api/categories/`, and `/api/nav-categories/` return `200`
- [x] Hosted runtime smoke command added and verified: `npm run audit:hosted:runtime -- --url=https://workingoando.vercel.app` passes with direct catalog image checks green
- [x] Production deployment hardening applied on 2026-03-16 via `npx vercel --prod --yes`; hosted alias updated and deployment lane is verification-closed
- [x] The next bounded frontend frontier is Phase 10 live experience verification and release-hardening closeout

## Whole-Site Recovery Frame

### Basics First

- [x] The basics-first milestone was the active recovery block
- [x] Basics-first sequencing rule is locked
- [x] The active `NEXT-PLAN.md` cadence is a checklist-driven bounded block
- [x] The active `NEXT-PLAN.md` must be decomposed into detailed checklist steps, not only phase summaries
- [x] The active `NEXT-PLAN.md` must include completion markers and an explicit `Not In This Block` exclusion section
- [x] Missing-image basics-first lane is locked from the current audit baseline
- [x] Hardcoding basics-first lane is locked from the current overhaul notes
- [x] Validation rules exist for both basics-first lanes
- [x] Platform contract follow-on starts only after the basics-first lock is recorded
- [ ] Basics-first exit criteria met
- [ ] Basics-first blocked or deferred

### Catalog Recovery

- [ ] Catalog recovery scheduled as the next site-level milestone
- [ ] Catalog recovery exit criteria met
- [x] Catalog recovery is deferred until the basics-first lane and platform follow-on are stable

### App Surface Cleanup

- [ ] App surface cleanup scheduled after catalog recovery
- [ ] App surface cleanup exit criteria met
- [ ] App surface cleanup blocked or deferred

### Verification And Release Hardening

- [ ] Verification and release hardening scheduled after app surface cleanup
- [ ] Verification and release hardening exit criteria met
- [ ] Verification and release hardening blocked or deferred

## Archive And Removal Tracking Rule

- [ ] Any active-tree removal is recorded with source path, destination/archive path, reason, and validation result
- [ ] Any true deletion, if ever explicitly approved later, is marked as an approved exception in recovery docs

## Phase 0: Recovery Control

### Objective

Make `codex-recovery/` the active control center for the recovery effort.

### Tasks

- [x] Create `codex-recovery/`
- [x] Create `MASTER-OBJECTIVE.md`
- [x] Create `RECOVERY-ROADMAP.md`
- [x] Create `RECOVERY-CHECKLIST.md`
- [x] Create `DECISIONS.md`
- [x] Create `HOLDS.md`
- [x] Generate first recovery snapshot
- [x] Ensure `latest.md` exists
- [x] Create `NEXT-PLAN.md`

### Validation

- [x] All recovery control docs exist
- [x] Snapshot generation works

### Done Conditions

- [x] Recovery control center is usable in a fresh session

## Phase 1: Root Inventory

### Objective

Understand everything currently sitting at repo root before further moves.

### Tasks

- [x] List all root directories
- [x] List all root files
- [x] Mark root source folders
- [x] Mark root config/manifests
- [x] Mark root generated artifacts
- [x] Mark root duplicate asset folders
- [x] Mark root unknowns

### Validation

- [x] Root classification table exists in notes or snapshot

### Done Conditions

- [x] Every meaningful root item has a class

## Phase 2: Runtime Artifact Cleanup

### Objective

Remove or relocate disposable runtime clutter that does not belong in the active working surface.

### Tasks

- [x] Delete root runtime `.log` files
- [x] Delete `.playwright-cli/console-*.log`
- [x] Delete `.next/dev/logs/*`
- [x] Delete turbopack `LOG` files
- [x] Delete `output/playwright/*log*`
- [x] Review non-log generated artifact folders for later relocation

### Validation

- [x] Confirm no in-scope runtime logs remain
- [x] Confirm docs/history logs remain

### Done Conditions

- [ ] Runtime log clutter is cleared across all non-source tool output areas

## Phase 3: Duplicate Root Asset Audit

### Objective

Confirm which root asset folders duplicate `public/` before archival.

### Tasks

- [x] Confirm root `ClientLogos` count vs `public/ClientLogos`
- [x] Confirm root `ClientPhotos` count vs `public/ClientPhotos`
- [x] Confirm root `Showroom` count vs `public/Showroom`
- [ ] Record any filename/path mismatches if found
- [x] Record archive destination choice

### Validation

- [x] Public copies verified
- [x] Archive plan explicit

### Done Conditions

- [x] Duplicate root asset move is fully justified

## Phase 4: Archive Duplicate Root Assets

### Objective

Move duplicate root asset folders into archive backup without deleting them.

### Tasks

- [x] Move root `ClientLogos` out of root
- [x] Move root `ClientPhotos` out of root
- [x] Move root `Showroom` out of root
- [x] Normalize final archive destination as `archive/duplicate-assets/root-assets/`
- [x] Confirm archived copies exist
- [x] Confirm root is clear of these duplicate folders

### Validation

- [x] Public copies still exist
- [x] Archive copies exist
- [x] No source references require root versions

### Done Conditions

- [x] Duplicate root assets archived safely

## Phase 5: Protect Current Worktree

### Objective

Track what is pre-existing dirty state versus cleanup-induced moves.

### Tasks

- [x] Re-run `git status --short`
- [x] Note cleanup-related file moves
- [x] Note pre-existing user/source changes
- [x] Confirm no accidental source deletion happened
- [x] Confirm archive moves are the only intended structural moves so far

### Validation

- [x] Status review recorded in a snapshot

### Done Conditions

- [x] Cleanup moves and existing source changes are not being confused

## Phase 6: Proven-Unused Discovery Setup

### Objective

Build the rules and file set for reliable dead-file discovery.

### Tasks

- [x] Enumerate source files in `components/`
- [x] Enumerate source files in `data/`
- [x] Enumerate source files in `lib/`
- [x] Enumerate source files in `hooks/`
- [x] Exclude route files under `app/`
- [x] Exclude preview/internal route-owned files
- [x] Exclude dynamic imports from automatic dead classification
- [x] Exclude uncertain files from automatic moves

### Validation

- [x] Discovery scope is explicit and conservative

### Done Conditions

- [x] Proven-unused discovery can run without obvious false positives

## Phase 7: Import Graph and Dead-File Proof

### Objective

Identify zero-import files while filtering out false positives.

### Tasks

- [x] Build static import graph
- [x] Produce first zero-import candidate list
- [x] Review candidate list for dynamic-import usage
- [x] Review candidate list for preview/internal reachability
- [x] Review candidate list for duplicate-but-reachable families
- [x] Split candidates into `proven-dead` and `unknown-hold`

### Validation

- [x] Candidate list reviewed manually
- [x] False positives removed from move set

### Done Conditions

- [x] A reliable proven-dead list exists

## Phase 8: Holds and Protected Clusters

### Objective

Prevent dangerous files from being buried too early.

### Tasks

- [x] Record preview/internal route holds
- [x] Record duplicate family holds
- [x] Record uncertain component holds
- [x] Record route-owned file holds
- [x] Record dynamic-import holds

### Validation

- [x] `HOLDS.md` exists and is populated

### Done Conditions

- [x] Dangerous move candidates are explicitly protected

## Phase 9: Prepare `unused/`

### Objective

Set up a destination that preserves structure instead of hiding evidence.

### Tasks

- [x] Create `unused/`
- [x] Define relative-path preservation rule
- [x] Confirm no uncertain file will enter `unused/`
- [x] Confirm route files are excluded

### Validation

- [x] `unused/` destination structure is clear before moving files

### Done Conditions

- [x] `unused/` is ready for controlled moves

## Phase 10: Move Proven Dead Files

### Objective

Move only evidence-backed dead source into `unused/`.

### Tasks

- [x] Move first proven-dead batch
- [x] Preserve original relative paths beneath `unused/`
- [x] Keep all uncertain files in place
- [x] Keep all preview/internal files in place
- [x] Keep all duplicate-but-reachable files in place

### Validation

- [x] Moved files exist under `unused/`
- [x] No protected file was moved

### Done Conditions

- [x] First safe dead-file move wave complete

## Phase 11: Post-Move Verification

### Objective

Verify that the structural move wave did only what it was supposed to do.

### Tasks

- [x] Re-run `git status --short`
- [x] Confirm moved files are only proven-dead files
- [x] Confirm no route or preview/internal file moved
- [x] Confirm no duplicate-but-reachable family moved by mistake
- [x] Confirm archive paths still exist

### Validation

- [x] Verification recorded in snapshot

### Done Conditions

- [x] Move wave is confirmed safe

## Phase 12: Buildability and Integrity

### Objective

Keep the repo structurally recoverable after cleanup.

### Tasks

- [x] Reconfirm required root config files remain
- [x] Reconfirm active source folders remain intact
- [x] Run build after structural cleanup wave
- [x] Record build result
- [x] Record blockers if build fails

### Validation

- [x] Build result captured

### Done Conditions

- [x] Repo remains structurally stable after cleanup

## Phase 13: Route Truth

### Objective

Understand what is public, internal, preview, redirect, and hold.

### Tasks

- [x] Inventory routes under `app/`
- [x] Mark public routes
- [x] Mark internal routes
- [x] Mark preview routes
- [x] Mark redirect/alias routes
- [x] Mark uncertain routes

### Validation

- [x] Route truth summary exists in recovery notes

### Done Conditions

- [x] Route ownership is clear enough to support later cleanup

## Phase 14: Duplicate System Review

### Objective

Understand duplicate systems without collapsing them prematurely.

### Tasks

- [x] Review header family
- [x] Review footer family
- [x] Review configurator family
- [x] Review process-section family
- [x] Review cookie-consent family
- [x] Review assistant/bot family

### Validation

- [x] Duplicate status recorded in `HOLDS.md` or `DECISIONS.md`

### Done Conditions

- [x] Duplicate families are understood and protected

## Phase 15: Session Discipline

### Objective

Ensure recovery progress survives long chats and new sessions.

### Tasks

- [ ] Generate a snapshot at session start
- [ ] Generate a snapshot every 45 minutes during active work
- [ ] Update `RECOVERY-CHECKLIST.md` every 10 minutes during active work even if no material progress occurs
- [ ] Mark completed checklist items and status changes every 10 minutes during active work
- [ ] Generate a snapshot after each major movement wave
- [ ] Update `latest.md`
- [ ] Record blockers and next step before ending session
- [x] Keep every new `NEXT-PLAN.md` as a detailed operational checklist rather than a short session summary

### Done Conditions

- [ ] Recovery can resume from `codex-recovery/` alone

## Phase 16: Phase-1 Completion

### Objective

Close the initial structural recovery phase with evidence.

### Tasks

- [x] Root clutter materially reduced
- [x] Duplicate root assets archived
- [x] Proven-unused inventory complete for initial pass
- [x] `unused/` contains only proven-dead files
- [x] Preview/internal files preserved
- [x] Duplicate-but-reachable files preserved
- [x] Build remains possible after structural cleanup
- [x] Final phase summary recorded

### Done Conditions

- [x] Phase 1 recovery is complete and future cleanup can proceed from evidence

## Phase 17: Catalog Audit Consolidation

### Objective

Turn the current catalog quality findings into one execution baseline that drives repair work.

### Tasks

- [x] Record issue counts by type
- [x] Record product counts by category
- [x] Record first workstation-heavy issue rows
- [x] Mark critical issues as higher priority than medium metadata issues
- [x] Convert the issue snapshot into one active remediation queue
- [x] Record which issue groups are blocked versus ready

### Validation

- [x] One repair order exists and is referenced consistently

### Done Conditions

- [x] The catalog audit baseline is execution-ready

## Phase 18: Critical Workstation Media Repair Planning

### Objective

Prioritize the workstation media failures before broader metadata cleanup.

Status: pulled into the basics-first recovery lane as the first active repair-planning step.

### Tasks

- [x] Record the critical workstation set: `curvivo`, `deskpro`, `sleek`, `panel-pro`, `x-bench`
- [x] Separate invalid path failures from missing asset failures
- [x] Confirm which failures require path correction versus asset sourcing
- [x] Define validation for repaired primary images
- [x] Define validation for repaired gallery images
- [x] Keep medium issues deferred until critical/high media issues are resolved

### Validation

- [x] Every critical/high workstation media issue has a planned repair path

### Done Conditions

- [x] Workstation media repair can start without reprioritization

## Phase 18A: Hardcoding Basics Planning

### Objective

Lock the first hardcoding cleanup pass so repeated content/config literals are scoped before the broader app-surface cleanup phase.

### Tasks

- [x] Use `docs/tasks/full-overhaul-plan.md` as the source of truth for the initial hardcoding lane
- [x] Keep the first hardcoding pass limited to metadata, JSON-LD, footer/nav labels, route-copy literals, assistant prompt/content arrays acting as content storage, category/route mapping literals, and fallback/public-facing copy that should be centralized
- [x] Keep design tokens, intentional constants, and low-risk one-off UI text out of this first hardcoding pass unless already flagged in the overhaul notes
- [x] Record the first centralization targets clearly enough that implementation can start without re-deciding scope
- [x] Define hardcoding validation expectations from the existing grep-based overhaul checks

### Validation

- [x] The first hardcoding pass is explicit enough to execute without reopening scope

### Done Conditions

- [x] Hardcoding cleanup can start without re-litigating what counts as basics

## Phase 19: Canonical Slug And Deep-ID Baseline

### Objective

Lock the target slug and identifier model before implementation.

### Tasks

- [x] Record canonical slug rule as `category-subcategory-name`
- [x] Record deep category and subcategory IDs as first-class identifiers
- [x] Record that old slug planning docs are historical reference only
- [x] Inventory legacy slug formats still present in data
- [x] Define alias handling expectations for legacy slugs
- [x] Define required deep-ID fields in the target catalog shape

### Validation

- [x] No current recovery doc implies an older slug format remains canonical

### Done Conditions

- [x] Slug and deep-ID policy is implementation-ready

### Resolved State

- Remaining legacy slug exception is explicitly bounded to `fluid-x`
- Legacy alias handling remains alias-first through `product_slug_aliases`
- Target canonical fields are `categoryIdCanonical`, `subcategoryId`, `canonicalSlugV2`, and `canonicalSeriesId`

## Phase 20: Supabase/Nhost Mirror Gap Analysis

### Objective

Turn the current mixed fallback setup into one clear target architecture.

### Tasks

- [x] Record Supabase as primary for catalog and business stats
- [x] Record Nhost as current fallback path with mixed GraphQL/SQL exposure
- [x] Record mirror-script existence in `scripts/sync_nhost_backup.ts`
- [x] Inventory current GraphQL fallback touchpoints
- [x] Inventory current direct SQL fallback touchpoints
- [x] Define target strict-mirror contract for Nhost
- [x] Record mirror-model upgrade needs for canonical slug and deep IDs
- [x] Record exact current catalog fallback precedence from runtime code
- [x] Record exact current business-stats fallback precedence from runtime code

### Validation

- [x] Current state and target state are both explicit

### Done Conditions

- [x] Supabase/Nhost realignment is decision-complete

## Phase 21: Business Stats Fallback Simplification

### Objective

Document and simplify the business-stats fallback chain.

Status: remains active, but only after the basics-first image and hardcoding lock is recorded.

### Tasks

- [x] Record that fallback currently moves between Supabase, Nhost backup, stale cache, and safe defaults
- [x] Define intended fallback precedence
- [x] Define acceptable fallback versus error conditions
- [x] Record where stale cache is still allowed
- [x] Record where safe defaults are still allowed
- [x] Record that Nhost business-stats currently lacks SQL rescue and must be upgraded to match the catalog dual-path contract

### Implementation Queue

- [x] Add explicit source labeling for Nhost fallback results so GraphQL versus SQL origin is visible in code-level diagnostics
- [x] Upgrade `lib/nhostBackup.ts` to add SQL rescue after GraphQL failure or GraphQL unavailability
- [x] Update `lib/businessStats.ts` to use `Supabase -> Nhost GraphQL -> Nhost SQL -> stale cache -> safe default`
- [x] Upgrade `scripts/sync_nhost_backup.ts` to verify both GraphQL and SQL read paths after sync
- [x] Upgrade `scripts/sync_nhost_backup.ts` to verify both canonical `catalog_*` counts and mirrored legacy-table counts
- [x] Record whether any runtime path still depends on legacy Nhost tables after the mirror contract changes

### Validation

- [x] Fallback order is clear enough to implement without guessing
- [x] Dual-path fallback behavior is explicit enough to implement without new architecture decisions

### Done Conditions

- [x] Business stats fallback behavior is no longer ad hoc
- [x] Catalog and business-stats fallback behavior share the same mirror contract

## Phase 22: Ops Reference Protection

### Objective

Protect operational reference folders from being mistaken as active app source.

### Tasks

- [x] Classify `docs/ops/artifacts/*` as preserved reference output
- [x] Classify `docs/ops/charts/*` as preserved planning/reference material
- [x] Classify `docs/ops/plans/*` as preserved planning/reference material
- [x] Record that stale slug policy docs must not override current canonical slug direction
- [x] Cross-check whether any other `docs/ops/*` areas still need preservation notes

### Validation

- [x] Preserved ops reference areas are explicit and consistent across recovery docs

### Done Conditions

- [x] Ops references are protected from accidental cleanup or misuse

## Phase 23: Next Active Target Selection

### Objective

Choose the next execution block explicitly.

### Tasks

- [x] Choose whether the next block targets catalog/media repair, held duplicate families, remaining root tool/artifact folders, or `oando_website/*` investigation
- [x] Update `NEXT-PLAN.md` to reflect that chosen target only
- [x] Ensure no unrelated cleanup lane is mixed into the same block

### Validation

- [x] `NEXT-PLAN.md` exposes one obvious next block

### Done Conditions

- [x] The next execution block is unambiguous

## Phase 25: Catalog Audit Signal Cleanup

### Objective

Collapse false-positive media noise, repair the verified sparse-gallery products, and expose the next real catalog backlog.

### Tasks

- [x] Align `lib/productSpecSchema.ts` asset-path checks with runtime normalization
- [x] Rebuild `scripts/fix-missing-images.ts` into a targeted sparse-gallery backfill tool
- [x] Backfill verified gallery sets for `accent-study`, `classy-executive`, `fluid-task`, `fluid-x`, `cocoon-lounge`, `pedestal-3-drawer`, `cabin-60x30`, `cabin-l-shape`, and `conference-8-seater`
- [x] Repair canonical `oando-seating--fluid-x` metadata so warranty data is no longer missing
- [x] Re-run `npm run audit:products:quality`
- [x] Re-run `npm run build`
- [x] Keep the remaining `oando-soft-seating--luna` primary/gallery blocker explicitly deferred until repo-backed evidence appears
- [x] Triage the remaining `legacy_slug_format` backlog
- [x] Triage and clear the remaining `suspicious_text_encoding` backlog
- [x] Triage the catalog-wide `missing_documents` backlog

### Validation

- [x] Product-quality audit issue volume is reduced to a clean, high-signal baseline
- [x] Build still passes after sparse-gallery and audit-contract repairs
- [x] The remaining media-critical backlog is reduced to one explicitly deferred product
- [x] Slug audit redirect coverage is restored for the known duplicate groups
- [x] Text-encoding issues are removed from the active product-quality summary

### Done Conditions

- [x] Media-critical backlog is fully cleared or explicitly bounded
- [x] Remaining catalog backlog is reduced to documented follow-up lanes only

### Phase 25 Follow-Up State

- [x] `legacy_slug_format` is bounded to one intentional exception: `fluid-x`
- [x] `missing_documents` is reclassified as a source-gap backlog rather than a direct backfill lane
- [x] Product-quality audit path no longer hardcodes `documents: []`; it now detects document-like fields if they appear
- [x] `/downloads` and route-copy document promises are confirmed while `public/` still contains zero `.pdf`, `.doc`, or `.docx` assets
- [x] Document-source evidence and next-decision options are recorded in `codex-recovery/DOCUMENT-SOURCE-GAP.md`
- [x] `/downloads` is reframed as a request-based resource desk so live UX matches current repo truth
- [x] Support navigation now labels `/downloads` as `Resource Desk` to match the updated UX
- [x] Planning and contact surfaces now route document-first users into the Resource Desk flow
- [x] `missing_documents` source-gap backlog is inventory-complete and paired with a future ingestion plan
- [x] `oando-soft-seating--luna` remains explicitly deferred at handoff unless repo-backed evidence appears

## Phase 26: Trust Surface Polish

### Objective

Raise the quality and consistency of trust, support, legal, proof, and conversion-facing routes without disturbing the locked catalog-truth decisions.

### Tasks

- [x] Audit `/trusted-by`, `/planning`, `/contact`, `/solutions`, and adjacent shared components for visual-system drift
- [x] Select the first high-impact trust/support route cluster for implementation
- [x] Keep route-copy changes inside `data/site/*` where possible
- [x] Remove corrupted or placeholder-grade public copy in the chosen cluster
- [x] Align the chosen route cluster to the newer `scheme-*` visual primitives where appropriate
- [x] Keep CTA flows aligned with the `Resource Desk` truth and current contact model
- [x] Run `npm run build`
- [x] Update recovery docs with the lane outcome and the next explicit step
- [x] Expand the lane into `/privacy`, `/terms`, `/imprint`, and `/refund-and-return-policy` once the support cluster is verified
- [x] Expand the lane into `/projects`, `/portfolio`, `/gallery`, and `/showrooms` once the legal lane is verified
- [x] Re-run `npm run build` after the legal/proof expansion

### Validation

- [x] The chosen trust/support route cluster feels materially more intentional and consistent
- [x] No catalog-truth decision was weakened or hidden during the route polish pass
- [x] Build verification passes after the route wave
- [x] The adjacent legal/proof route clusters also feel materially more intentional and consistent

### Done Conditions

- [x] One trust/support route cluster is upgraded and documented
- [x] The adjacent legal/proof route clusters are upgraded and documented
- [x] The next adjacent frontend lane is explicit

## Phase 24: Hold Resolution Pass

### Objective

Resolve the current contents of `HOLDS.md` so protected clusters are either kept intentionally, reassigned, archived, or moved into a separate investigation lane.

### Tasks

- [x] Revisit every group in `HOLDS.md`
- [x] Keep preview/internal and route-owned holds explicitly protected unless a later product decision changes them
- [x] Resolve duplicate-family holds into `active owner`, `legacy keep`, or `archive/remove candidate`
- [x] Resolve protected data/config holds into `active config`, `hold for later review`, or `cleanup candidate`
- [x] Resolve dynamic-import holds into `protected runtime surface` or `cleanup candidate` based on actual usage
- [x] Resolve pre-existing dirty-state holds such as `oando_website/*` into a separate documented investigation lane
- [x] Record hold outcomes in recovery docs so `HOLDS.md` becomes a live review list instead of a permanent parking lot

### Validation

- [x] Every current hold group has an explicit revisit outcome

### Done Conditions

- [x] No major hold cluster remains unresolved without an assigned next action
