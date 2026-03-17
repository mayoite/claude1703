# Dynamic Filters: Current State

## Status
Implemented and live.

The original task proposal is stale. URL-driven category filtering, TanStack Query integration, mobile drawer behavior, and filter route support are already present in the codebase.

## What Exists
- URL-driven filter state for category product pages
- TanStack Query-backed filtered fetches
- Server route for filtered catalog results
- Mobile filter drawer workflow
- Back/forward and shared URL behavior
- Dynamic filter smoke coverage in tests

## Source of Truth
- `app/products/[category]/FilterGrid.tsx`
- `lib/productFilters.ts`
- `app/api/products/filter/route.ts`
- `tests/dynamic-filters.spec.ts`

## Current Filter Contract
- `sub` for subcategory
- `price` for price range buckets
- `mat` for material
- `ecoMin` for sustainability threshold
- additional query params for sort and feature toggles

## Remaining Follow-ups
- Improve filter copy and visual styling where needed
- Continue data-quality cleanup so facets remain meaningful
- Expand test coverage only if new filter dimensions are introduced

## Note
Do not treat this document as an implementation proposal anymore. It is a current-state reference so the repo does not imply that dynamic filters are still pending.
