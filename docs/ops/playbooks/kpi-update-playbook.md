# KPI Update Playbook

## Purpose
Keep public business KPIs (projects, clients, sectors, locations, experience) consistent across all pages and tender documents.

## Source of Truth
- Table: `public.business_stats_current`
- History table: `public.business_stats_history`
- API: `GET /api/business-stats`

## Update Rules
1. Every KPI update must include:
- `as_of_date`
- `source_note` (where numbers came from)
- `updated_by`
2. Update only the active row (`is_active = true`).
3. Never hardcode KPI numbers in React components.

## Suggested Update SQL
```sql
update public.business_stats_current
set
  projects_delivered = 260,
  client_organisations = 122,
  sectors_served = 18,
  locations_served = 20,
  years_experience = 15,
  as_of_date = '2026-03-01',
  source_note = 'Approved monthly KPI review',
  updated_by = 'ops@company'
where is_active = true;
```

## Required Validation Before Publish
1. `npm run lint`
2. `npm run build`
3. `npm run test:e2e:stats-consistency`
4. Verify `/api/business-stats` values match:
- Homepage stats block
- Projects page stat row
- Trusted clients footer count

## Tender Window Checklist (Bihar/Government B2B)
1. Freeze KPI edits 24 hours before bid submission.
2. Reconfirm `as_of_date` is visible on homepage and projects page.
3. Capture screenshot evidence for bid annexures.
4. Review Vercel analytics events:
- `kpi_rendered`
- `kpi_fallback_used`
- `kpi_mismatch_detected`
