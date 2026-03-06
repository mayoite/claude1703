# Supabase Redo Checkpoint - 2026-03-02

## Current Remote State (before redo)
- products rows: 145
- legacy category_id values in use:
  - oando-seating: 44
  - oando-workstations: 8
  - oando-tables: 23
  - oando-storage: 9
  - oando-soft-seating: 46
  - oando-collaborative: 2
  - oando-educational: 13
- categories table currently contains old ids (plus stale chairs/other-seating rows)

## Redo Goal
- Canonical runtime category IDs only:
  - seating
  - workstations
  - tables
  - storages
  - soft-seating
  - education
- Remove dependency on LEGACY_CATEGORY_REDIRECTS in product routes.
- Keep backward compatibility for incoming old links using route-level permanent redirects.

## Planned Steps
1. Upsert canonical categories in Supabase categories table.
2. Update products.category_id + products.category from legacy ids to canonical ids.
3. Set metadata.category + metadata.subcategory consistently.
4. Verify distinct categories and sample product routes.
5. Remove LEGACY_CATEGORY_REDIRECTS from app routes and replace with canonical redirect helper.

## Completed
1. Added and executed `scripts/redo_supabase_categories.ts --apply`.
2. Executed `scripts/migrate_catalog_subcategories.ts --apply`.
3. Supabase now uses only canonical category ids:
   - `seating`
   - `workstations`
   - `tables`
   - `storages`
   - `soft-seating`
   - `education`
4. Route-level `LEGACY_CATEGORY_REDIRECTS` constants were removed from:
   - `app/products/[category]/page.tsx`
   - `app/products/[category]/[slug]/page.tsx`
5. Canonical normalization is centralized in `lib/catalogCategories.ts` via `normalizeRequestedCategoryId`.

