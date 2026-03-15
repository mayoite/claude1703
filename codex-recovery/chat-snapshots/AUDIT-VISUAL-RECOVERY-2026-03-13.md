# Visual Recovery Checkpoint (2026-03-13)

## Implemented

- Typography token layer repaired so live `typ-*` classes now resolve valid font and size variables.
- Added missing font aliases:
  - `--font-cisco-ui`
  - `--font-display`
- Added missing type scale aliases:
  - `--fs-100`
  - `--fs-200`
  - `--fs-300`
  - `--fs-400`
- Added missing shared shadow token:
  - `--shadow-soft`
- Removed route-level `force-dynamic` from:
  - `app/products/[category]/page.tsx`
  - `app/products/[category]/[product]/page.tsx`
- Moved catalog freshness control into the data layer using `unstable_cache` with `CATALOG_REVALIDATE_SECONDS = 300` for:
  - catalog tree
  - product lists
  - category-filtered product lists
  - product-by-slug lookups
  - slug resolution
- Kept legacy image-path normalization in `lib/assetPaths.ts` for:
  - `/products/...` to `/images/products/...`
  - `/images/afc/...` to `/images/catalog/...`

## Verified

- `npm run lint` passed.
- `npm run build` passed.
- Build output now shows:
  - `/products/[category]` as prerendered with revalidation instead of forced dynamic rendering
  - `/products/[category]/[product]` still runtime-rendered where slug resolution requires it
- HTTP checks passed:
  - `/`
  - `/products/`
  - `/products/seating/`
  - `/products/workstations/`
  - `/products/seating/oando-seating--arvo/`
  - `/products/workstations/oando-workstations--deskpro/`
- Targeted Playwright recovery check passed on desktop and mobile with `badResponseCount=0` for:
  - `/`
  - `/products/`
  - `/products/seating/`
  - `/products/seating/oando-seating--arvo/`
- Evidence written to:
  - `output/playwright/targeted-recovery-check-2026-03-13/summary.json`

## Remaining

- Typography architecture is still spread across multiple CSS files; the token validity problem is fixed, but the file-structure simplification is not complete yet.
- Broader route coverage beyond the targeted recovery set still needs the resumable audit to be completed.
- Recovery docs have this checkpoint recorded, but checklist-style completion tracking has not yet been updated line-by-line.
