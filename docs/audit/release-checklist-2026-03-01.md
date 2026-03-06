# Release Checklist (2026-03-01)

## Build and Test Gates
- [x] `npm run lint`
- [x] `npm run build`
- [x] `npm run test:e2e:filters`
- [x] `npm run test:e2e:nav`
- [x] `npm run test:a11y`

## Preview and Production Deploy
- [x] Preview deploy completed on Vercel
- [x] Preview core endpoint checks completed
- [x] Preview nav smoke completed
- [x] Production deploy completed on Vercel
- [x] Production alias active (`https://oofplpatna.vercel.app`)
- [x] Production core endpoint checks completed
- [x] Production nav smoke completed

## SEO/Indexability Quick Checks
- [x] `robots.txt` reachable
- [x] `sitemap.xml` reachable
- [x] Canonical tag present on tested category page

## Data and Content Operations
- [x] Alt-text sync dry run executes successfully
- [x] Alt-text sync script supports both `metadata`-only schema and `alt_text` schema
- [x] Missing-alt report: `0` currently missing

## Pending Release Closure
- [x] Merge `feat/full-website-sync-20260301` into `main`
- [x] Confirm `main` auto-deploy triggers and passes after merge
- [x] Run post-merge smoke (`/`, `/products/`, `/products/seating/`, `/api/nav-categories/`)
- [ ] Monitor Vercel function logs for `/api/nav-search` and `/api/products/filter` for first 24h
