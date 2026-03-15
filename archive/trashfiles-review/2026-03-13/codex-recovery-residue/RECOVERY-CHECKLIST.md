# Recovery Checklist

This is the active execution checklist.

Update this file as recovery work progresses. Keep exactly one active frontier in progress in each working session.

## Current Active Frontier

- [x] Phase 1 structural recovery complete and recorded
- [x] Phase 8 catalog audit consolidation finalized as the active next execution block
- [x] Critical workstation media repair pulled into the Week 1 basics-first lane ahead of medium-severity metadata cleanup
- [x] Supabase/Nhost mirror realignment tasks converted into an implementation-ready work block
- [x] Week 1 reordered to fix basics first: missing images and hardcoding before the platform contract follow-on
- [x] First 24-hour platform baseline captured with live Supabase/Nhost parity counts and source-contract lock
- [x] Middle 24-hour business-stats fallback alignment validated in code and build verification
- [x] Legacy Nhost dependency inventory captured with explicit `active-required` vs `transition-compatible` classification
- [x] Week 1 closeout verification rerun captured (`npm run build` pass, `audit:nhost:backup` parity pass with known GraphQL alias exposure gap)
- [x] Week 1 closeout disposition recorded as `deferred-with-reason` with one explicit re-entry trigger
- [x] Deferred Week 1 platform re-entry trigger executed and closed (`product_slug_aliases` GraphQL exposure now tracked in Hasura metadata; `audit:nhost:backup` at `graphqlFailures=0`)
- [x] Completed-step re-audit rerun captured (proven-dead preservation still intact; build pass; parity `tableDiffs=0`, `graphqlFailures=1`)
- [x] Site re-audit update captured with live catalog signal (`audit:supabase:catalog` pass) and tooling-drift note (`audit:products:quality` stale import failure)
- [x] Product-quality audit drift repaired (`scripts/audit-product-quality.ts` now runs against the live catalog path; `lib/productSpecSchema.ts` restored from local salvage)
- [x] Comprehensive audit sweep captured across lint/build/types/unit/e2e/a11y/data/parity/slug-id/external-asset checks (`codex-recovery/AUDIT-ALL-2026-03-12.md`)
- [x] Visual audit captured for desktop/mobile route matrix with evidence and findings (`codex-recovery/AUDIT-VISUAL-2026-03-12.md`)
- [x] Full-page scroll audit captured with route-level evidence and image-failure findings (`codex-recovery/AUDIT-FULLPAGE-SCROLL-2026-03-12.md`)

## Whole-Site Timeline

### Week 1 Fix Basics First

- [x] Site-level Week 1 milestone is the current active recovery block
- [x] Week 1 sequencing rule is `fix basics first`
- [x] The active `NEXT-PLAN.md` cadence is a checklist-driven 72-hour block
- [x] The active `NEXT-PLAN.md` must be decomposed into detailed checklist steps, not only phase summaries
- [x] The active `NEXT-PLAN.md` must include completion markers and an explicit `Not In This Block` exclusion section
- [x] Missing-image basics-first lane is locked from the current audit baseline
- [x] Hardcoding basics-first lane is locked from the current overhaul notes
- [x] Validation rules exist for both basics-first lanes
- [x] Platform contract follow-on starts only after the basics-first lock is recorded
- [ ] Week 1 exit criteria met
- [ ] Week 1 blocked or deferred

### Week 2 Catalog Recovery

- [ ] Week 2 catalog recovery scheduled as the next site-level milestone
- [ ] Week 2 catalog recovery exit criteria met
- [x] Week 2 catalog recovery is deferred until the Week 1 basics-first lane and platform follow-on are stable

### Week 3 App Surface Cleanup

- [ ] Week 3 app surface cleanup scheduled after catalog recovery
- [ ] Week 3 app surface cleanup exit criteria met
- [ ] Week 3 blocked or deferred

### Week 4 Verification And Release Hardening

- [ ] Week 4 verification and release hardening scheduled after app surface cleanup
- [ ] Week 4 verification and release hardening exit criteria met
- [ ] Week 4 blocked or deferred

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

Status: pulled into the Whole-Site Timeline Week 1 basics-first lane as the first active repair-planning step.

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
- [ ] Inventory legacy slug formats still present in data
- [ ] Define alias handling expectations for legacy slugs
- [ ] Define required deep-ID fields in the target catalog shape

### Validation

- [ ] No current recovery doc implies an older slug format remains canonical

### Done Conditions

- [ ] Slug and deep-ID policy is implementation-ready

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

Status: remains active, but only after the Week 1 basics-first image and hardcoding lock is recorded.

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
- [ ] Cross-check whether any other `docs/ops/*` areas still need preservation notes

### Validation

- [ ] Preserved ops reference areas are explicit and consistent across recovery docs

### Done Conditions

- [ ] Ops references are protected from accidental cleanup or misuse

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
- [ ] Resolve the remaining `oando-soft-seating--luna` primary/gallery blocker with repo-backed evidence
- [ ] Triage the remaining `legacy_slug_format` backlog
- [ ] Triage the remaining `suspicious_text_encoding` backlog
- [ ] Triage the catalog-wide `missing_documents` backlog

### Validation

- [x] Product-quality audit issue volume is reduced to a clean, high-signal baseline
- [x] Build still passes after sparse-gallery and audit-contract repairs
- [x] The remaining media-critical backlog is reduced to one explicitly deferred product

### Done Conditions

- [ ] Media-critical backlog is fully cleared or explicitly bounded
- [ ] Remaining catalog backlog is reduced to documented follow-up lanes only

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
