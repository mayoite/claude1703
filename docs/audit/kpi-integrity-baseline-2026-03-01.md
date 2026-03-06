# KPI Integrity Baseline - 2026-03-01

## Pre-implementation Snapshot
1. `npm run lint`
- Status: pass

2. `npm run build`
- Status: fail
- Blocking errors:
  - `Module not found: Can't resolve '@vercel/analytics/react'`
  - `Module not found: Can't resolve '@vercel/speed-insights/next'`

3. KPI drift findings
- `components/home/StatsBlock.tsx` used hardcoded KPI values.
- `app/projects/page.tsx` used conflicting KPI values.
- `components/home/OurWork.tsx` used separate hardcoded client count text.

## Post-implementation Snapshot
1. `npm run lint`
- Status: pass

2. `npm run build`
- Status: pass
- Notes:
  - `business_stats_current` table is not present in active Supabase schema yet.
  - Runtime correctly falls back to `safe-default` data with log:
    - `[business-stats] fallback: supabase:Could not find the table 'public.business_stats_current' in the schema cache`

3. `npm run test:e2e:stats-consistency`
- Status: pass
- Coverage:
  - Homepage KPI values match `/api/business-stats`
  - Projects page KPI values match `/api/business-stats`
  - "As of" label presence on both pages
  - Legacy conflicting strings not present in page body

4. `npm run test:e2e:nav`
- Status: failing on existing unrelated path
- Current failing assertion:
  - quote-cart smoke expects local storage key `quote-cart-v1`
  - runtime error observed in web server logs during product page flow:
    - `No QueryClient set, use QueryClientProvider to set one`
- KPI implementation does not change quote-cart/query provider wiring, so this remains an existing non-KPI issue.

## Action Required in Supabase
1. Apply migration:
- `supabase/migrations/20260301093000_create_business_stats.sql`
2. Re-run build and smoke tests to confirm `source = supabase` on `/api/business-stats`.
