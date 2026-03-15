# Decisions

Use this file to record recovery decisions that should not be re-litigated in every new session.

## Current Decisions

### 2026-03-12 Platform Follow-Up Closure And Audit Repair

- The deferred Week 1 platform blocker is now closed in execution:
  - Hasura metadata was updated to track `public.product_slug_aliases`
  - Hasura metadata was updated to track `public.catalog_product_slug_aliases`
  - `npm run audit:nhost:backup` now passes with `tableDiffs=0`, `graphqlFailures=0`
- Build verification remains green after the metadata fix:
  - `npm run build`: pass
- The stale tooling drift in `scripts/audit-product-quality.ts` is now repaired:
  - restored `lib/productSpecSchema.ts` from the local `unused/` salvage pool because the helper remained relevant and structurally useful
  - removed the dead `../lib/catalog.ts` dependency from the audit path
  - rewired the quality audit to fetch the live catalog shape from Supabase instead of relying on removed static fallback catalog files
- `npm run audit:products:quality` now runs successfully again and reports the current live issue baseline instead of failing on missing modules.
- Current live quality-audit signal after the repair:
  - `productsAudited=145`
  - `issueRows=1262`
  - dominant issue types are `invalid_gallery_image_path=934`, `missing_documents=145`, `invalid_primary_image_path=136`
- The next active execution lane is no longer platform follow-up; it is catalog/media repair starting with the workstation priority set already recorded in recovery docs.

### 2026-03-12 Legacy Nhost Dependency Review (Week 1 Closeout)

- Classification rule for this closeout is now fixed as:
  - `active-required`: still required for runtime continuity right now
  - `transition-compatible`: intentionally retained during dual-table transition
  - `removable-now`: safe to remove/reroute immediately
- Dependency matrix (legacy Nhost tables only):
  - `lib/nhostCatalog.ts` (`fetchNhostProductsViaSql`):
    - reads `public.products` and `public.product_slug_aliases`
    - classification: `active-required`
    - reason: SQL rescue path is still required when GraphQL is unavailable/denied/schema-broken or when alias resolution is missing in GraphQL.
  - `scripts/sync_nhost_backup.ts`:
    - writes and verifies legacy tables `public.products`, `public.categories`, `public.product_specs`, `public.product_images`, `public.product_slug_aliases`
    - classification: `transition-compatible`
    - reason: dual-table mirror contract is still intentionally active for fallback/runtime continuity.
  - `scripts/audit_nhost_backup.ts`:
    - reads `public.products` and `public.product_slug_aliases` for parity sampling
    - classification: `transition-compatible`
    - reason: audit surface intentionally checks legacy-table parity until retirement lane is approved.
- Current outcome: no `removable-now` legacy Nhost dependency identified in this first inventory pass.
- Verification rerun for this closeout block:
  - `npm run build`: pass
  - `npm run audit:nhost:backup`: `tableDiffs=0`, `graphqlFailures=1`
  - Remaining known gap is unchanged: GraphQL alias-table query exposure (`product_slug_aliases` on `query_root`) in Nhost schema.
- Re-audit of completed steps (latest pass):
  - proven-dead preservation check: `deleted_scoped=40`, `missing_in_unused=0`
  - `npm run build`: pass
  - `npm run audit:nhost:backup`: `tableDiffs=0`, `graphqlFailures=1` (unchanged accepted transition constraint)
  - `npm run audit:supabase:catalog`: pass (`products=145`, `blankSlugs=0`, `duplicateSlugs=0`)
  - `npm run audit:products:quality`: fails due stale script imports (`../lib/catalog.ts` missing in current tree); treat as tooling drift to fix separately from runtime platform state.
  - comprehensive site re-audit completed and captured in `codex-recovery/AUDIT-ALL-2026-03-12.md` (lint/build/type/unit/e2e/a11y/data/parity/slug-id/external-asset coverage).
  - visual audit completed and captured in `codex-recovery/AUDIT-VISUAL-2026-03-12.md` (desktop/mobile route matrix with screenshot evidence).
  - full-page scroll audit completed and captured in `codex-recovery/AUDIT-FULLPAGE-SCROLL-2026-03-12.md` with evidence in `output/playwright/fullpage-audit-2026-03-12T17-51-12-174Z`.
- Week 1 closeout disposition: `deferred-with-reason`.
  - Deferred item: expose alias-table lookup in Nhost GraphQL schema (`product_slug_aliases` query path expected by runtime/audit verification).
  - Risk: alias lookup remains partially dependent on SQL rescue paths instead of fully mirrored GraphQL reachability.
  - Re-entry trigger: apply schema exposure fix and re-run `npm run audit:nhost:backup` until `graphqlFailures=0`.
  - Decision closure: this is accepted as a transition constraint, not an open decision; SQL alias rescue remains the approved compensating control until schema exposure is upgraded.

### 2026-03-12 Platform Baseline Verification (Resumed Block)

- The previous handover state is now superseded because active recovery execution resumed in this block.
- Proven-dead preservation check passed for tracked source deletions under `components/`, `data/`, and `lib/`: `deleted_scoped=40`, `missing_in_unused=0`.
- Build verification passed on this state (`npm run build` via Next.js 16.1.6).
- Live parity baseline is now recorded from `npm run audit:nhost:backup`:
  - Supabase: `products=145`, `business_stats_current=1`
  - Nhost SQL: `products=145`, `business_stats_current=1`
  - Canonical parity currently matches on product and business-stats counts.
- Nhost GraphQL live reads are verified for:
  - `products` (ok)
  - `business_stats_current` (ok)
- Internal fallback-source contract is locked as: `supabase | nhost-graphql | nhost-sql | stale-cache | safe-default`.
- Runtime/business-stats source labeling no longer uses collapsed `nhost-backup`; active runtime/test surfaces do not contain the old `nhost-backup` literal.
- Remaining mirror-contract gap noted from parity audit:
  - GraphQL alias-table query (`product_slug_aliases`) is not exposed on `query_root` and must be handled in the mirror verification expansion lane.
- Mirror verification expansion is now implemented in `scripts/sync_nhost_backup.ts`:
  - verifies canonical and legacy row counts and fails sync on mismatch
  - verifies GraphQL reads for product-by-slug and active business stats, plus alias lookup when active alias rows exist
  - verifies SQL reads for product-by-slug and active business stats, plus alias lookup when active alias rows exist
  - fails sync when any required GraphQL or SQL verification read is missing
- Legacy runtime dependency review is complete and classified; no `removable-now` dependency was identified in that pass.

### Pending Decision Items Status

- Resolved: legacy-table dependency classification is locked (`active-required`, `transition-compatible`, `removable-now`).
- Resolved: business-stats fallback source labeling and SQL rescue contract are implemented and verified.
- Resolved: mirror verification expansion is implemented in `scripts/sync_nhost_backup.ts`.
- Resolved: GraphQL alias-table exposure gap is accepted as a transition constraint; execution follow-up remains tracked in `NEXT-PLAN.md` as implementation work, not an open decision.

## Non-Negotiable Decisions

- Supabase is the primary source of truth.
- Nhost becomes a strict Supabase mirror for fallback/runtime continuity.
- Canonical product slugs follow `category-subcategory-name`.
- Deep category and subcategory IDs are first-class identifiers.
- Figma and Mobbin are reference-only inputs.

## Current Supabase/Nhost Relationship

- Supabase is already primary for catalog and business stats.
- Nhost is currently used as a fallback path, but its exposure is mixed between GraphQL and direct SQL fallback.
- Nhost mirror logic in `scripts/sync_nhost_backup.ts` now verifies canonical and legacy row-count parity plus GraphQL/SQL read checks.
- Business-stats fallback is now fixed and implemented as `Supabase -> Nhost GraphQL -> Nhost SQL -> stale cache -> safe default`.

## Whole-Site Recovery Planning Decisions

- Whole-site recovery is now planned as a continuous-work `4-week` target.
- Week 1 now runs under a `fix basics first` sequencing rule and is the active primary frontier for the site-level recovery plan.
- `NEXT-PLAN.md` should always be written as a checklist-driven `72-hour` execution block, not just a short note, so each next step is immediately actionable in a fresh session.
- Active recovery blocks must always be written as detailed operational checklists, not abstract milestone summaries.
- Every future `NEXT-PLAN.md` must include these minimum sections:
  - objective
  - ordered `72-hour` slices
  - detailed checklist items
  - completion markers
  - explicit `Not In This Block` exclusions
  - guardrails
- `72-hour block` defines the time structure; `detailed checklist` defines the execution detail.
- Detailed checklist standard:
  - concrete action checkboxes, not only milestone bullets
  - explicit verification checkboxes
  - explicit doc-update or status checkboxes when recovery docs are part of the block
  - explicit completion markers and one explicit follow-on step
- `Fix basics first` means `missing images + hardcoding`, not a platform-only lane.
- Missing-image basics include both invalid existing image paths and missing primary or gallery coverage.
- Hardcoding basics include scattered metadata, JSON-LD, footer and nav labels, route-copy literals, assistant prompt or content arrays acting as content storage, category or route mapping literals, and fallback stats or other public-facing copy that should be centralized.
- Do not widen the hardcoding lane to design tokens, intentional constants, or low-risk one-off UI text unless the existing overhaul notes already classify them as cleanup targets.
- Week 1 order is now: images first, hardcoding second, validation for both, then Supabase/Nhost platform contract hardening inside the same active phase.
- Critical workstation media planning now sits inside the Week 1 basics-first lane; broader catalog cleanup and app-surface cleanup remain sequenced after the basics-first and platform work.
- `3 weeks` is treated as a best-case compression outcome, not the planning baseline.
- `5 to 6 weeks` remains the contingency range if parity issues, catalog inconsistency, or frontend regressions expand.
- Fallback source labels remain internal-only for now and should stay limited to logs, telemetry, and result typing unless a later product decision explicitly exposes them.
- CI gating for mirror verification is deferred until Week 4 verification and release hardening unless Week 1 uncovers repeated parity drift that justifies earlier enforcement.
- Legacy Nhost-table retirement is not required inside the current `4-week` recovery window; the current requirement is to prepare the retirement path while keeping dual-table compatibility in place.
- Week 3 duplicate-family cleanup may proceed from technical ownership evidence alone except where route ownership or visible UX behavior remains ambiguous, in which case product review is required before execution.
- `HOLDS.md` must be treated as a live review queue for unresolved items only, not a permanent storage area for settled preservation rules or active-owner notes.
- `NEXT-PLAN.md` should carry only the hold work actively queued from the current block, while `DECISIONS.md` and `RECOVERY-CHECKLIST.md` retain the durable outcomes and status.

## Hold Resolution Outcomes

- The hold-resolution pass is complete; `HOLDS.md` no longer carries any live unresolved entry.
- `app/home-unused/page.tsx` remains intentionally protected as a preview route.
- `app/ops/customer-queries/page.tsx` remains intentionally protected as an internal operations route.
- Everything under `app/` remains outside ordinary dead-file cleanup unless route ownership is intentionally reviewed.
- `components/layout/*` is resolved as a legacy shell cleanup candidate because it has no active imports in the live app graph.
- `components/configurator/Configurator.tsx`, `components/configurator/configurator/Configurator.tsx`, `components/configurator/ConfiguratorContext.tsx`, `components/configurator/ConfiguratorPreview.tsx`, and `components/configurator/ConfiguratorSteps.tsx` are resolved as a legacy configurator cleanup candidate set; the live public configurator owner remains `components/configurator/Simple2DConfigurator.tsx`.
- `components/shared/ProcessSection.tsx` is resolved as a legacy duplicate cleanup candidate; the live owner remains `components/home/ProcessSection.tsx`.
- `components/ui/CookieConsent.tsx` is resolved as a legacy duplicate cleanup candidate; the live owner remains `components/site/CookieConsentBar.tsx`.
- `components/bot/AdvancedBot.tsx` is resolved as a legacy bot cleanup candidate; the live runtime path remains `app/layout.tsx -> components/bot/DynamicBotWrapper.tsx -> components/bot/UnifiedAssistant.tsx`.
- `data/site/configurator.ts` is resolved as an inactive-config review candidate because it currently has no live imports and does not own the active public configurator route.
- `data/site/support.ts` is resolved as an inactive-config review candidate because it currently has no live imports and does not own an active support surface.
- `oando_website/*` remains resolved as a separate pre-existing dirty-state investigation lane, not part of the current recovery move wave.

## Architecture Follow-Up Contract

- The platform contract lane remains in scope, but it is no longer the first step in the active Week 1 block.
- The current audit in `docs/product-quality-audit.csv` is the source of truth for the missing-image basics lane.
- The hardcoding summary in `docs/tasks/full-overhaul-plan.md` is the source of truth for the initial hardcoding cleanup lane.

### Week 1 Basics-First Lock

- The missing-image basics lane is now locked to critical/high product-image correctness only, not the full metadata backlog.
- The first missing-image repair set stays explicit: `curvivo`, `deskpro`, `sleek`, `panel-pro`, and `x-bench`.
- `curvivo`, `deskpro`, `sleek`, and `panel-pro` are path-correction work because the canonical asset folders already exist and contain usable image assets.
- `x-bench` remains a catalog-link repair case because the canonical asset folder exists but the product still lacks linked primary and gallery coverage.
- Broader `missing_primary_image` and `missing_gallery_images` backlog outside the first workstation set remains deferred behind the current Week 1 basics-first lock.
- Missing-image validation is fixed as:
  - primary image path resolves to an existing runtime asset
  - gallery coverage includes at least two usable images
  - repaired records stay explicitly classified as `path correction` or `catalog-link repair`

### Week 1 Hardcoding Lock

- The hardcoding basics lane is now locked to content/config literals that should be centralized, not a broad visual-system rewrite.
- The first hardcoding cleanup targets are:
  - metadata and JSON-LD literals
  - footer/nav labels and route-copy literals
  - assistant prompt/content arrays acting as content storage
  - category/route mapping literals
  - fallback stats and other public-facing copy that should move behind typed content/config sources
- The first centralization targets should use the existing typed `data/site/*` surface where possible instead of introducing a second config system.
- The first hardcoding pass explicitly excludes:
  - design tokens and shared visual primitives
  - intentional constants that are not acting as content storage
  - low-risk one-off UI text unless it is already identified in the overhaul notes as repeated or policy-bearing
- Hardcoding validation is fixed as:
  - targeted literals are moved out of runtime components/helpers or explicitly queued as the next extraction target
  - grep-based checks from `docs/tasks/full-overhaul-plan.md` remain the validation baseline for repeated region, CTA, trust/client, assistant-prompt, route-map, and arbitrary visual-formula follow-up
- With both basics-first lanes locked, the next immediate follow-on returns to the platform contract sequence: live parity baseline, fallback-source contract, business-stats SQL rescue design, then mirror verification expansion.

- Runtime catalog reads currently enter through `lib/getProducts.ts` and fall back through `lib/nhostCatalog.ts`.
- `lib/nhostCatalog.ts` currently uses Nhost GraphQL first and direct SQL rescue second; keep that dual-path runtime model explicit instead of implicit.
- Runtime business-stats reads currently enter through `lib/businessStats.ts` and fall back through `lib/nhostBackup.ts`.
- Upgrade the Nhost business-stats path to the same dual-path contract as catalog reads: Nhost GraphQL first, Nhost SQL rescue second.
- Supabase remains the only write authority for catalog and business stats; Nhost remains read-only mirror infrastructure for runtime continuity.
- Keep dual-table compatibility in Nhost during the transition by mirroring both canonical `catalog_*` tables and the legacy table names used by current fallback code.
- Mirror verification must confirm both GraphQL and SQL can read the mirrored data successfully after sync, not merely that row counts match.
- Mirror-model upgrades must carry canonical slug v2 fields plus deep category and subcategory identifiers into Nhost without letting Nhost become a second source of truth.
- Business-stats fallback precedence is now fixed as: Supabase -> Nhost GraphQL -> Nhost SQL -> stale cache -> safe default.
- Stale cache is acceptable only after both live Nhost fallback paths fail and a last known good in-memory value exists.
- Safe defaults are acceptable only after Supabase, Nhost GraphQL, Nhost SQL, and stale cache are all unavailable.

## Current Runtime Touchpoint Inventory

### Catalog Read Path

- `lib/getProducts.ts`
  - `getProducts()`: reads Supabase `products`; on any Supabase error, falls back to `fetchNhostProducts()` and returns normalized Nhost rows
  - `getProductsByCategory(categoryId)`: reads Supabase `products` plus `categories(name)` join; on any Supabase error, falls back to `fetchNhostProducts({ categoryId })`
  - `getProductByUrlKey(productUrlKey)`: reads Supabase `products` by `slug`; on any Supabase error, falls back to `fetchNhostProducts({ productUrlKey })`
  - `getCatalog()`: retries Supabase `categories` and `products` reads, then falls back to Nhost only if both category and product result sets stay empty after failure
  - `getCategoryIds()`: reads Supabase `products.category_id`; on any Supabase error, falls back to Nhost products

### Nhost Catalog Fallback Behavior

- `lib/nhostCatalog.ts`
  - fallback is enabled only when `NHOST_BACKUP_ENABLED === "true"`
  - GraphQL is attempted first whenever endpoint plus credential are available
  - GraphQL tries `products(where: ...)` first and alias lookup through `product_slug_aliases` for slug resolution
  - if GraphQL returns access denial, schema-unavailable errors, network failure, or an empty alias-resolution result, direct SQL rescue is attempted
  - SQL rescue reads legacy Nhost tables `public.products` and `public.product_slug_aliases`
  - both GraphQL and SQL paths normalize into the same `Product` shape before returning

### Business Stats Read Path

- `lib/businessStats.ts`
  - live primary path is Supabase `business_stats_current where is_active = true`
  - on failure it currently calls `fetchNhostBusinessStats(...)`
  - if Nhost returns data, the result source is explicitly `nhost-graphql` or `nhost-sql`
  - if Nhost fails, the code uses `lastKnownGoodStats` as stale cache
  - safe defaults are used only when Supabase, Nhost GraphQL, Nhost SQL, and stale cache all fail

### Nhost Business Stats Fallback Behavior

- `lib/nhostBackup.ts`
  - fallback is enabled only when `NHOST_BACKUP_ENABLED === "true"`
  - implementation is GraphQL-first with SQL rescue
  - if GraphQL endpoint or credential is missing, the path falls back to SQL rescue
  - if GraphQL returns missing/denied/schema-broken/timeout/no-active-row outcomes, SQL rescue is attempted before returning `null`

### Mirror Sync Behavior

- `scripts/sync_nhost_backup.ts`
  - reads authoritative rows from Supabase tables `products`, `categories`, `product_specs`, `product_images`, `product_slug_aliases`, and `business_stats_current`
  - writes both canonical `catalog_*` tables and duplicated legacy table names into Nhost in one transaction
  - verifies canonical and legacy row counts after sync and fails on mismatch
  - verifies GraphQL reads for mirrored product-by-slug and active business stats, and alias lookup when alias rows exist
  - verifies SQL reads for mirrored product-by-slug and active business stats, and alias lookup when alias rows exist
  - fails sync when any required GraphQL or SQL verification read is missing

## Current Catalog Data Quality Snapshot

### Issues By Type

- `missing_alt_text`: 95
- `legacy_slug_format`: 95
- `missing_sustainability_score`: 95
- `missing_documents`: 95
- `missing_subcategory`: 86
- `missing_primary_image`: 42
- `missing_gallery_images`: 42
- `invalid_primary_image_path`: 4
- `invalid_gallery_image_path`: 4

### Products By Category

- `collaborative`: 2
- `educational`: 12
- `soft-seating`: 45
- `storage`: 8
- `tables`: 20
- `workstations`: 8

### First 40 Issue Rows

- `workstations/curvivo`: `invalid_primary_image_path` (critical)
- `workstations/curvivo`: `invalid_gallery_image_path` (high)
- `workstations/curvivo`: `missing_alt_text` (medium)
- `workstations/curvivo`: `legacy_slug_format` (medium)
- `workstations/curvivo`: `missing_sustainability_score` (medium)
- `workstations/curvivo`: `missing_documents` (medium)
- `workstations/adaptable`: `missing_alt_text` (medium)
- `workstations/adaptable`: `legacy_slug_format` (medium)
- `workstations/adaptable`: `missing_sustainability_score` (medium)
- `workstations/adaptable`: `missing_documents` (medium)
- `workstations/deskpro`: `invalid_primary_image_path` (critical)
- `workstations/deskpro`: `invalid_gallery_image_path` (high)
- `workstations/deskpro`: `missing_alt_text` (medium)
- `workstations/deskpro`: `legacy_slug_format` (medium)
- `workstations/deskpro`: `missing_sustainability_score` (medium)
- `workstations/deskpro`: `missing_documents` (medium)
- `workstations/sleek`: `invalid_primary_image_path` (critical)
- `workstations/sleek`: `invalid_gallery_image_path` (high)
- `workstations/sleek`: `missing_alt_text` (medium)
- `workstations/sleek`: `legacy_slug_format` (medium)
- `workstations/sleek`: `missing_sustainability_score` (medium)
- `workstations/sleek`: `missing_documents` (medium)
- `workstations/trio-2`: `missing_alt_text` (medium)
- `workstations/trio-2`: `legacy_slug_format` (medium)
- `workstations/trio-2`: `missing_subcategory` (medium)
- `workstations/trio-2`: `missing_sustainability_score` (medium)
- `workstations/trio-2`: `missing_documents` (medium)
- `workstations/panel-pro`: `invalid_primary_image_path` (critical)
- `workstations/panel-pro`: `invalid_gallery_image_path` (high)
- `workstations/panel-pro`: `missing_alt_text` (medium)
- `workstations/panel-pro`: `legacy_slug_format` (medium)
- `workstations/panel-pro`: `missing_subcategory` (medium)
- `workstations/panel-pro`: `missing_sustainability_score` (medium)
- `workstations/panel-pro`: `missing_documents` (medium)
- `workstations/x-bench`: `missing_primary_image` (critical)
- `workstations/x-bench`: `missing_gallery_images` (high)
- `workstations/x-bench`: `missing_alt_text` (medium)
- `workstations/x-bench`: `legacy_slug_format` (medium)
- `workstations/x-bench`: `missing_subcategory` (medium)
- `workstations/x-bench`: `missing_sustainability_score` (medium)

### Active Workstation Media Queue

- `curvivo`: ready for path correction; audit shows invalid primary/gallery paths, while `public/images/catalog/oando-workstations--curvivo/` exists with 52 files including `image-1.webp` and `image-2.webp`
- `deskpro`: ready for path correction; audit shows invalid primary/gallery paths, while `public/images/catalog/oando-workstations--deskpro/` exists with 68 files including `image-1.webp` and `image-2.webp`
- `sleek`: ready for path correction; audit shows invalid primary/gallery paths, while `public/images/catalog/oando-workstations--sleek/` exists with 55 files including `image-1.webp` and `image-2.webp`
- `panel-pro`: ready for path correction; audit shows invalid primary/gallery paths, while `public/images/catalog/oando-workstations--panel-pro/` exists with 47 files including `image-1.webp` and `image-2.webp`
- `x-bench`: ready for catalog-link repair; audit shows missing primary/gallery coverage, while `public/images/catalog/oando-workstations--x-bench/` exists with 55 files including `image-1.webp` and `image-2.webp`
- Medium issue groups remain deferred until the critical/high workstation media mapping is repaired or explicitly blocked.

## 2026-03-13 Sparse Gallery Backfill And Audit Realignment
- Decision: Treat the broad `/images/afc/*` image backlog as an audit-contract problem first, then repair only the remaining real gallery gaps with repo-backed local assets.
- Why:
  - Runtime already normalizes legacy `/images/afc/*` paths through `lib/assetPaths.ts`, so the first large image backlog was overstating live breakage.
  - `lib/productSpecSchema.ts` was updated to use the same normalization contract as runtime.
  - `scripts/fix-missing-images.ts` was rebuilt into a targeted sparse-gallery backfill tool using verified local asset folders and service-role writes.
  - Ten verified product rows were patched safely: `accent-study`, `classy-executive`, `fluid-task`, `fluid-x`, `cocoon-lounge`, `pedestal-3-drawer`, `cabin-60x30`, `cabin-l-shape`, `conference-8-seater`, and canonical `oando-seating--fluid-x` metadata.
- Impact:
  - `npm run audit:products:quality` dropped from `1262` issue rows to `182`.
  - Remaining image-critical backlog is now one product only: `oando-soft-seating--luna` still has `missing_primary_image` and `missing_gallery_images`.
  - Canonical `oando-seating--fluid-x` no longer carries the earlier missing-warranty issue after metadata repair.
  - The remaining high-signal catalog backlog is now:
    - `missing_documents=145`
    - `suspicious_text_encoding=24`
    - `legacy_slug_format=11`
    - `missing_primary_image=1`
    - `missing_gallery_images=1`
  - `Luna` remains explicitly deferred because no trustworthy local image source has been proven inside the repo.
  - `npm run build` still passes after the audit and sparse-gallery changes.

### 2026-03-12

- Use `codex-recovery/` as the recovery control center.
- Keep one master objective, one roadmap, and one active checklist.
- Preserve backups instead of deleting during recovery cleanup.
- Archive duplicate root asset folders instead of deleting them.
- Move only proven dead source files into `unused/`.
- Leave preview/internal and duplicate-but-reachable files in place for now.
- Generate a recovery snapshot every 45 minutes during active work.
- Do not delete any file during recovery unless explicitly requested later.
- Treat `archive/duplicate-assets/root-assets/` as the canonical destination for root-level duplicate asset folders.
- Treat `unused/` as a preservation area for proven-dead source only, never as a dump folder for uncertain files.
- Keep everything under `app/` out of automatic dead-file moves.
- Keep duplicate component families in place unless they are proven dead and non-reachable.

### 2026-03-12 Repo Truth

- Root duplicate asset folders `ClientLogos`, `ClientPhotos`, and `Showroom` were preserved by moving them into `archive/duplicate-assets/root-assets/`.
- Public runtime copies already exist under `public/ClientLogos`, `public/ClientPhotos`, and `public/Showroom`.
- The repo contains preview/internal surfaces such as `app/home-unused/page.tsx`; these are not dead code.
- The repo contains duplicate-but-reachable clusters in `components/layout/*`, `components/site/*`, and configurator variants.
- The current proven-dead move set is restricted to zero-import files that are not route-owned and not on the protected hold list.
- `unused/` is now excluded from the TypeScript compile scope via `tsconfig.json`, so archived proven-dead files can stay preserved without blocking `npm run build`.
- Build verification on 2026-03-12 succeeded after excluding `unused/`, so the current blocker moved from build-boundary isolation to the remaining discovery and worktree-separation tasks.
- The current recovery move wave accounts for 42 archived source files under `unused/`; the remaining 52 deletions under `oando_website/*` are being treated as older separate dirty state until proven otherwise.
- Current verification on 2026-03-12 confirms all 40 tracked source deletions under `components/`, `data/`, and `lib/` are present under `unused/`; none of those tracked moved-source paths are missing from the preservation area.
- `unused/` also contains `components/home/ProductClientBlocks.tsx` and `lib/backup/catalog.ts`, whose active-tree originals are already absent and therefore do not appear in the current tracked deletion list; keep them preserved in place until a later provenance review.
- Current verification on 2026-03-12 confirms `npm run build` still passes on the present workspace state.
- Root inventory classification on 2026-03-12: source folders are `app`, `components`, `data`, `docs`, `hooks`, `lib`, `public`, `scripts`, `supabase`, `tests`; tool/artifact folders are `.next`, `.playwright-cli`, `output`, `reports`, `tmp`; preservation/control folders are `archive`, `codex-recovery`, `unused`; local-tool-state folders are `.vercel`, `.vscode`; standard root manifests/configs remain in place.
- `docs/ops/artifacts/` is a preserved documentation-artifact area. Current contents are zip bundles (`generated-artifacts-20260307-1447.zip`, `generated-artifacts-20260307.zip`), so it should be treated as historical ops output rather than active source.
- `docs/ops/charts/` is a preserved ops-planning area. Current contents include mapping HTML files, `supabase-flowcharts.xlsx`, `supabase-redo-flowchart.md`, and static chart assets under `docs/ops/charts/industry-charts/`; treat these as operational references, not active app source.
- `docs/ops/plans/` is a preserved ops-planning area. Current contents include slug alias plan JSON/MD/SQL files and `slug-policy-with-e.md`; treat these as operational planning references, not active app source.
- `docs/ops/plans/slug-policy-with-e.md` reflects an older canonical format (`{brand}-{category}-{model}`) and should not override the current non-negotiable slug decision (`category-subcategory-name`).
- Route truth snapshot on 2026-03-12:
  - Public pages: `/`, `/about`, `/career`, `/compare`, `/configurator`, `/contact`, `/downloads`, `/gallery`, `/planning`, `/portfolio`, `/privacy`, `/products`, `/products/[category]`, `/products/[category]/[product]`, `/projects`, `/quote-cart`, `/refund-and-return-policy`, `/service`, `/showrooms`, `/social`, `/solutions`, `/solutions/[category]`, `/sustainability`, `/terms`, `/tracking`, `/trusted-by`
  - Preview routes: `/home-unused`
  - Internal routes: `/ops/customer-queries`, `/api/*`
  - Redirect/alias routes: `/brochure`, `/catalog`, `/download-brochure`, `/products/oando-chairs`, `/products/oando-chairs/[product]`, `/products/oando-other-seating`, `/products/oando-other-seating/[product]`, `/workstations/configurator`
  - Uncertain routes: `/imprint`, `/news`, `/support-ivr`
- Duplicate-system review snapshot on 2026-03-12:
  - Live shell owner: `components/site/Header.tsx`, `components/site/Footer.tsx`, `components/site/MobileNavDrawer.tsx`, and `components/site/CookieConsentBar.tsx` are the active shell family used by `app/layout.tsx`
  - Legacy shell hold: `components/layout/*` currently has no active imports in the live app graph and should be treated as a held duplicate family until a separate cleanup pass decides whether to archive or remove it
  - Live configurator owner: `components/configurator/Simple2DConfigurator.tsx` is the active configurator surface used by `app/configurator/page.tsx`
  - Legacy configurator hold: `components/configurator/Configurator.tsx`, `components/configurator/configurator/Configurator.tsx`, and the related preview/step/context files form an older configurator family not used by the current public route and should remain held for now
  - Live process-section owner: `components/home/ProcessSection.tsx` owns the current home process block; `components/shared/ProcessSection.tsx` is an older duplicate variant and remains a hold
  - Live cookie owner: `components/site/CookieConsentBar.tsx` owns the current cookie experience; `components/ui/CookieConsent.tsx` is a legacy duplicate and remains a hold
  - Live bot owner: `app/layout.tsx` loads `components/bot/DynamicBotWrapper.tsx`, which dynamically loads `components/bot/UnifiedAssistant.tsx`; `components/bot/AdvancedBot.tsx` is not part of the active shell path and remains a hold
- Remaining uncertain-route decision on 2026-03-12:
  - `/imprint`, `/news`, and `/support-ivr` remain classified as uncertain because they are routable pages but currently lack main-nav ownership, footer-nav ownership, and sitemap inclusion; they should not be removed or reclassified without a later product/content decision
- Phase 1 recovery summary on 2026-03-12:
  - Root clutter was materially reduced by clearing runtime logs and archiving duplicate root asset folders
  - Duplicate root assets were preserved under `archive/duplicate-assets/root-assets/`
  - The initial proven-unused inventory was completed conservatively, with dynamic imports, routes, preview pages, and duplicate families protected
  - `unused/` currently contains the 42-file proven-dead move wave and is excluded from the TypeScript compile scope so build verification can pass
  - Preview/internal routes and duplicate-but-reachable families were preserved in place
  - `npm run build` passes after isolating `unused/` from the compile scope

## Decision Template

```md
## YYYY-MM-DD
- Decision:
- Why:
- Impact:
```
