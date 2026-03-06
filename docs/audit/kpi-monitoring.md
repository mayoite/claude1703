# KPI Monitoring Notes

## Instrumented Events
1. `kpi_rendered`
- Fired when KPI block renders.
- Payload: `asOfDate`, `source`.

2. `kpi_fallback_used`
- Fired when source is not Supabase.
- Payload: `source` (`stale-cache` or `safe-default`).

3. `kpi_mismatch_detected`
- Fired when rendered KPI differs from `/api/business-stats`.
- Payload: `page`, `field`, `expected`, `actual`.

## Alert Thresholds
1. `kpi_fallback_used > 0` in a 30-minute window:
- Investigate Supabase availability and SSL edge errors.

2. Any `kpi_mismatch_detected` in production:
- Treat as release regression and hotfix same day.

3. `source = safe-default` on more than 1% sessions:
- Escalate to infra and disable cache invalidation jobs until root cause is fixed.

## Operational Checks
1. Confirm `Analytics` and `SpeedInsights` components render in `app/layout.tsx`.
2. Validate `/api/business-stats` returns `source = supabase` under normal conditions.
3. Review events after every production deployment.
