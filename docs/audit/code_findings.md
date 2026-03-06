# Code Findings

## Matrix Summary
- Total matrix rows: 35
- Rows with risk/fail status: 26

## High-Priority Code Findings
1. Global canonical strategy risk
- File: app/layout.tsx
- Issue: canonical configured as '/'.
- Impact: can weaken per-page canonical signal quality.
- Fix: move canonical to route-level metadata only.

2. Missing route-level metadata
- Count: 22
- Routes:
- /
- /about
- /career
- /catalog
- /contact
- /downloads
- /gallery
- /imprint
- /news
- /planning
- /privacy
- /products
- /projects
- /quote-cart
- /service
- /showrooms
- /solutions
- /support-ivr
- /sustainability
- /terms
- /tracking
- /workstations/configurator

3. Supabase stats fallback dependency noise
- Files: app/page.tsx, app/projects/page.tsx, lib/businessStats.ts
- Issue: missing public.business_stats_current table in active Supabase.
- Impact: fallback values + console noise; trust/data integrity risk.

4. Sitemap and robots policy hardening
- Files: app/sitemap.ts, app/robots.ts
- Issue: includes utility routes; no explicit fallback disallow.

## code_audit_matrix
- JSON: docs/audit/code_audit_matrix.json
