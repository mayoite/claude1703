# Full Overhaul Plan

## 1. Title and locked decisions

### Full overhaul title
Supabase-first catalog, Nhost mirror, deep ID, canonical slug, repo cleanup, and foundation-only UI/content overhaul.

### Non-negotiable decisions
- Supabase is the primary source of truth.
- Nhost becomes a strict Supabase mirror for fallback/runtime continuity.
- Canonical product slugs follow `category-subcategory-name`.
- Deep category and subcategory IDs are first-class identifiers.
- The design system lives only in `app/globals.css` plus the existing Tailwind setup.
- Figma and Mobbin are reference-only inputs.
- `.DONOTDELETE` stays local-only and untracked.

### What is not allowed
- No new runtime design plugin.
- No UI kit injection.
- No second styling system.
- No committing `.DONOTDELETE`.

## 2. Current-state baseline

### Repo reorg state
- Root source structure is valid: `app`, `components`, `lib`, `hooks`, `public`, `scripts`, `supabase`, `tests`, `__mocks__`.
- The repo still carries tracked move noise from docs reorganization, root report moves, removal of root `cisco-sans`, removal of `.github`, and removal of tracked `oando_website`.
- `docs/audits` has already been merged into `docs/audit`, and `docs/ops` has already been regrouped into purpose folders, but those moves are not yet formalized cleanly in Git history.
- `.DONOTDELETE` is the protected local vault and must remain excluded from Git.

### Tracked-vs-local boundary
- Tracked: source/runtime folders, `docs/audit`, `docs/tasks`, `docs/checkpoints`, `docs/archive/root-reports`, reorganized `docs/ops/*`, `archive/README.md`, and `archive/root-legacy`.
- Local-only: `.DONOTDELETE`, `archive/tool-state`, `archive/test-artifacts`, `archive/duplicate-assets`, local tool state such as `.vercel`, `.wrangler`, `.claude`, and generated artifacts.

### Active homepage component stack
- `app/page.tsx` currently renders:
  - `HomepageHero`
  - `TrustStrip`
  - `SolutionsGrid`
  - `OurExperience`
  - `ProcessSection`
  - `PartnershipBanner`
  - `ContactTeaser`
- Shared shell currently comes from `app/layout.tsx`, `components/site/Header.tsx`, `components/site/Footer.tsx`, `components/site/MobileNavDrawer.tsx`, `components/site/CookieConsentBar.tsx`, and assistant/floating CTA components.

### Current Supabase/Nhost relationship
- Supabase is already primary for catalog and business stats.
- Nhost is currently used as a fallback path, but its exposure is mixed between GraphQL and direct SQL fallback.
- Nhost mirror logic exists in `scripts/sync_nhost_backup.ts`, but the target model still needs to be upgraded to match the new canonical slug and deep-ID system.
- Business stats fallback currently moves between Supabase, Nhost backup, stale cache, and safe defaults.

### Current slug and category inconsistency summary
- Canonical slug handling is partially implemented in helpers, but the current canonical shape still uses legacy `oando-...--...` patterns.
- Category IDs are inconsistent across runtime, data, and scripts:
  - `oando-seating`
  - `oando-storage`
  - `storage`
  - `storages`
  - `education`
  - `educational`
  - `collaborative`
  - `soft-seating`
- Subcategory handling exists in metadata and filters, but subcategory IDs are not yet first-class canonical identifiers.
- Alias compatibility exists, but the overall model is transitional and not yet overhaul-grade.

### Current hardcoding summary

#### Visual
- Homepage and shared shell still contain many one-off Tailwind-heavy visual formulas for hero surfaces, chips, panels, shadows, and proof cards.
- Shared visual language is partially tokenized in `app/globals.css`, but active sections still overuse local styling.

#### Content
- Repeated region, trust, client, CTA, and contact strings are scattered across shell, homepage, marketing routes, and assistant components.
- Repeated examples include regional copy, client names, sales CTAs, and assistant starter prompts.

#### Config
- Metadata, JSON-LD, footer/nav labels, assistant prompt arrays, category-route maps, and fallback stats are still hardcoded in multiple files.
- Business stats fallback defaults and timeout behavior are still embedded in `lib/businessStats.ts`.

## 3. Target architecture

### Supabase canonical schema target
- Supabase holds the canonical catalog model and business-support tables.
- Canonical catalog shape uses:
  - stable category IDs
  - stable subcategory IDs
  - canonical product slugs based on category + subcategory + product name
  - alias rows for legacy slug compatibility
- Runtime compatibility views/tables may remain temporarily, but canonical data rules are defined in Supabase first.

### Nhost mirror target
- Nhost mirrors the canonical Supabase catalog and business stats exactly for fallback/runtime continuity.
- If legacy compatibility tables are still needed by runtime, they are generated from the canonical mirror model rather than drifting independently.
- Nhost parity is measured by counts, alias behavior, stats parity, and runtime fallback correctness.

### Canonical category IDs
- `seating`
- `workstations`
- `tables`
- `storages`
- `soft-seating`
- `education`

### Canonical subcategory IDs
- Subcategory IDs become first-class and stable.
- Examples by direction, not exhaustive final inventory:
  - `seating-mesh`
  - `seating-leather`
  - `seating-cafe`
  - `workstations-panel`
  - `workstations-height-adjustable`
  - `tables-meeting`
  - `tables-cabin`
  - `storages-locker`
  - `soft-seating-lounge`
  - `education-classroom`

### Canonical slug policy
- Canonical product slug format is:
  - `<category-id>-<subcategory-id>-<product-name-slug>`
- Legacy `oando-...--...` slugs become aliases, not canonicals.
- No blank slug repair remains as the long-term canonical strategy.

### Alias compatibility strategy
- Alias lookup remains alias-first for legacy routes.
- Legacy slugs resolve to the new canonical slug.
- Canonical routes are the only ones emitted by current runtime helpers after migration.
- Alias compatibility is present in both Supabase and mirrored in Nhost.

### Shared route/category/slug helper layer
- One shared canonical helper layer governs:
  - category normalization
  - subcategory normalization
  - series normalization
  - canonical product slug generation
  - route path generation
  - alias lookup and redirect intent
- Duplicate category-route maps and slug helpers in assistant/API code are eliminated.

### `data/site/*` content/config source of truth
- Repeated site/business/config content moves into typed modules under `data/site/`:
  - `brand.ts`
  - `contact.ts`
  - `regions.ts`
  - `navigation.ts`
  - `homepage.ts`
  - `proof.ts`
  - `seo.ts`
  - `assistant.ts`
  - `fallbacks.ts`
  - `routeCopy.ts`

### Foundation-only design system in `app/globals.css`
- Shared semantic UI primitives are defined in `app/globals.css`.
- Existing Tailwind utilities remain for layout glue only.
- No second design system is introduced.
- Figma and Mobbin inform composition and polish only, never runtime dependencies.

## 4. Program A: Repo normalization

### Tracked docs move set
- Formalize the move of root reports into `docs/archive/root-reports`.
- Formalize the merge of `docs/audits` into `docs/audit`.
- Formalize the regrouping of `docs/ops` into:
  - `audits`
  - `charts`
  - `plans`
  - `playbooks`
  - `reconcile`
  - `walkthroughs`

### Root clutter cleanup
- Remove tracked root duplicate `cisco-sans`.
- Remove tracked `.github/workflows/supabase-backup.yml`.
- Remove tracked `.vscode/*`.
- Remove tracked `oando_website/*`.
- Preserve local-only vault content in `.DONOTDELETE` without staging it.

### `.gitignore` vs `.git/info/exclude` policy
- `.gitignore` contains repo-wide generated/runtime ignore rules only.
- `.git/info/exclude` contains local-only private archive and vault rules.
- `.DONOTDELETE` remains excluded through local-only Git behavior.

### Explicit rule that `.DONOTDELETE` stays excluded
- Never stage `.DONOTDELETE`.
- Never add `.DONOTDELETE` contents to tracked docs or source.
- Never treat `.DONOTDELETE` as a project archive that travels with the repo.

### Reference repair after docs/archive moves
- Update scripts and docs referencing old `docs/audits`, old flat `docs/ops`, old root reports, old root `cisco-sans`, and removed `oando_website`.
- `scripts/export_flowcharts_excel.py` is an example known fallout point.

## 5. Program B: Supabase audit and overhaul

### Audit tables and runtime queries
- Audit these tables and compatibility surfaces:
  - `products`
  - `categories`
  - `product_specs`
  - `product_images`
  - `product_slug_aliases`
  - `business_stats_current`
  - `customer_queries`
  - catalog-prefixed equivalents and compatibility views/tables
- Audit runtime query usage in:
  - catalog fetch helpers
  - slug resolver
  - product data helpers
  - business stats
  - customer queries
  - AI/advisor routes
  - tracking routes

### Add slug/ID audit script
- Add `scripts/audit_supabase_catalog.ts`.
- Add `scripts/audit_slug_id_integrity.ts`.
- Emit machine-readable and human-readable outputs.

### Add schema/data quality audit outputs
- Write tracked outputs to `docs/ops/audits/`:
  - `supabase-schema-audit.md`
  - `supabase-schema-audit.json`
  - `supabase-runtime-query-audit.md`
  - `supabase-data-quality-audit.json`
  - `slug-id-overhaul-baseline.md`

### Canonicalize category IDs
- Migrate active category identifiers to the canonical set:
  - `seating`
  - `workstations`
  - `tables`
  - `storages`
  - `soft-seating`
  - `education`
- Remove active dependence on legacy `oando-*` category IDs.

### Add first-class subcategory IDs
- Introduce stable subcategory IDs as dedicated canonical data, not only metadata labels.
- Keep display labels separate from machine IDs.
- Ensure filters, routes, and audits operate on canonical subcategory IDs.

### Canonical slug backfill
- Recompute canonical slugs from category ID + subcategory ID + product name.
- Preserve existing product primary keys unless a concrete relational problem forces change.
- Treat the public route key as the primary migration target.

### Alias table population
- Store all legacy slugs in the alias table.
- Keep alias-first lookup behavior during transition.
- Ensure the alias surface supports both catalog and compatibility naming layers where required.

### Compatibility behavior during migration
- Legacy routes must continue to resolve through alias compatibility.
- Canonical routes become the preferred emitted URLs after migration.
- Runtime helpers must normalize category/subcategory IDs before routing and filtering.

### Business stats timeout/fallback audit
- Audit current timeout/fallback behavior in `lib/businessStats.ts`.
- Decide and implement a production-grade policy for:
  - fetch timeout
  - logging behavior
  - fallback order
  - build-time behavior

## 6. Program C: Nhost mirror rebuild

### Mirror exact Supabase canonical tables
- Nhost must mirror canonical Supabase tables exactly:
  - `catalog_categories`
  - `catalog_products`
  - `catalog_product_specs`
  - `catalog_product_images`
  - `catalog_product_slug_aliases`
  - `business_stats_current`

### Maintain compatibility tables only if runtime still requires them
- If runtime still depends on legacy table names, generate compatibility tables from the canonical mirror model.
- Compatibility tables must never become an independent source of truth.

### Verify row counts, alias parity, and stats parity
- Row counts between Supabase and Nhost must match for mirrored tables.
- Alias-resolution behavior must match.
- Business stats values must match or be explicitly documented where a fallback source is used.

### Document GraphQL limitations and SQL fallback where needed
- Audit the actual Nhost GraphQL surface.
- Where GraphQL cannot expose required parity cleanly, document SQL fallback as intentional and supported.
- Add tracked audit outputs:
  - `nhost-parity-audit.md`
  - `nhost-parity-audit.json`
  - `nhost-runtime-fallback-audit.md`
  - `supabase-vs-nhost-row-diff.json`

## 7. Program D: Slug, ID, and route compatibility overhaul

### New canonical helper layer
- Consolidate route/category/subcategory/slug logic into one canonical helper layer.
- Replace duplicate category-route maps in assistant/API code.
- Replace scattered slug helpers and legacy normalization logic.

### Redirect/alias behavior
- Alias-first resolution remains during transition.
- Canonical route emission becomes the standard.
- Legacy slugs resolve cleanly to canonical slugs through alias mapping.

### Filter/search/nav alignment to deep IDs
- Filters operate on canonical `category_id` and `subcategory_id`.
- Navigation and search surfaces use canonical route helpers.
- Deduplication logic uses canonical category/subcategory identity instead of ad hoc strings.

### Update runtime assumptions currently based on legacy `oando-*` IDs
- Remove active runtime assumptions that products and categories are keyed by legacy prefixed IDs.
- Update marketing route builders, assistant links, filters, and browse helpers to the new canonical identifiers.

## 8. Program E: Foundation-only UI/content overhaul

### `app/globals.css` semantic primitives
- Define a small semantic vocabulary for:
  - page shells
  - section shells
  - dark/light/sand surfaces
  - hero media frames
  - proof chips
  - proof cards
  - stat cards
  - CTA blocks
  - headings and copy roles
- Components consume these classes instead of repeating local styling formulas.

### Shell-first refactor
- Refactor the shared shell before page-level polish:
  - `app/layout.tsx`
  - header
  - footer
  - mobile nav
  - cookie/assistant shell surfaces
- Move shared business/config content out of the shell into `data/site/*`.

### Homepage foundation pass
- Refactor the active homepage sections:
  - `HomepageHero`
  - `TrustStrip`
  - `SolutionsGrid`
  - `OurExperience`
  - `ProcessSection`
  - `PartnershipBanner`
  - `ContactTeaser`
- Remove repeated local visual formulas and repeated proof/contact/CTA copy.

### Route-by-route content extraction into `data/site/*`
- After shell + homepage, extract repeated business/config copy from marketing and browse routes into typed content/config modules.
- Keep unique editorial copy inline where it truly belongs to one route only.

### Legacy/duplicate component import audit before redesign
- Audit active imports first.
- Migrate active component families only.
- Classify inactive duplicates as retained legacy or cleanup candidates.

## 9. Commit sequence

1. `chore(audit): add supabase and nhost audit tooling`
2. `docs(audit): check in current supabase and nhost audit outputs`
3. `chore(repo): normalize tracked docs and repo structure`
4. `feat(data-model): add canonical category/subcategory/slug scaffolding`
5. `refactor(data): migrate supabase to deep ids and canonical slugs`
6. `refactor(nhost): rebuild nhost as exact supabase mirror`
7. `refactor(core): canonicalize shared hooks and content/config scaffolding`
8. `refactor(shell): foundation-first shared shell and seo cleanup`
9. `refactor(home): homepage foundation overhaul`
10. `refactor(routes): remove repeated business copy and align route-level canonical ids/slugs`
11. `docs(ops): add source maps, migration notes, and final audit summaries`
12. `chore(validation): final regression cleanup`

## 10. Validation

### Supabase audit gates
- Schema audit passes.
- Runtime query audit passes.
- Slug/ID integrity audit passes.
- No critical alias or stats integrity failures remain.

### Nhost parity gates
- Canonical table counts match required mirrored counts.
- Alias parity holds.
- Stats parity holds.
- GraphQL/SQL fallback behavior is documented and validated.

### Lint/test/build
- `npm run lint`
- `npm test`
- `npm run build`

### Grep-based hardcoding checks
- Search for repeated region strings outside `data/site/*`.
- Search for repeated CTA strings outside `data/site/*`.
- Search for repeated trust/client strings outside `data/site/*`.
- Search for duplicate assistant prompt arrays and route maps.
- Search homepage/shared shell files for repeated arbitrary visual formulas.

### Desktop/mobile route smoke checks
- Validate the homepage, shell, credibility routes, sales/support routes, legal routes, products, category pages, and a canonical PDP on desktop and mobile.
- Verify no floating-control or cookie collisions.

### Slug alias compatibility checks
- Legacy slugs resolve.
- Canonical slugs resolve.
- Category and subcategory routes use canonical helpers.
- Assistant-generated product links resolve to canonical routes.

## 11. Final acceptance criteria
- Supabase is clean and canonical.
- Nhost mirrors Supabase exactly enough for the fallback role.
- Deep category and subcategory IDs are active.
- Canonical slugs are active and emitted by runtime helpers.
- Aliases work for legacy routes.
- Shell and homepage use one foundation-only visual system.
- Repeated site copy is extracted into `data/site/*`.
- The repo is clean and understandable.
- `.DONOTDELETE` is absent from Git.
