# Prioritized Fix Backlog

## P0 - Fix Immediately
1. Repair /solutions/[category] runtime failures returning HTTP 500.
- Scope: /solutions/seating, /workstations, /tables, /storages, /soft-seating, /education
- Validation: all return 200 in desktop and mobile visual batches.

## P1 - Trust/SEO/Data Integrity
1. Remove global canonical default from app/layout.tsx and enforce route-level canonical.
2. Add metadata to static pages missing route-level metadata exports.
3. Create and seed Supabase table public.business_stats_current (or disable fallback logging in production).
4. Add per-page JSON-LD for projects/contact and reinforce product/category schema consistency.

## P2 - Quality and Crawl Hygiene
1. Fix missing/broken product image references (starting with top 40 flagged routes).
2. Exclude utility routes from sitemap where not index-worthy.
3. Mark legacy redirects as permanent where migration is complete.
4. Improve alt text consistency for SEO + accessibility quality.

## Regression Checklist After Fixes
1. npm run lint
2. npm run build
3. npm run test:e2e:nav
4. npm run test:e2e:stats-consistency
5. npm run test:a11y
6. Re-run scripts/audit_full_pages.mjs and compare desktop/mobile failure counts.
