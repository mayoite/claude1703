# Full-Page Scroll Audit (2026-03-12)

## Scope

- Audit mode: automated top-to-bottom scroll before screenshot capture
- Routes audited: `/`, `/products`, `/products/seating`, `/solutions`, `/projects`, `/trusted-by`, `/contact`
- Viewports: desktop (`1440x900`) and mobile (`390x844`)
- Total checks: `14`

## Evidence

- Output folder:
  - `output/playwright/fullpage-audit-2026-03-12T17-51-12-174Z`
- Summary:
  - `output/playwright/fullpage-audit-2026-03-12T17-51-12-174Z/fullpage-audit.md`
- Structured details:
  - `output/playwright/fullpage-audit-2026-03-12T17-51-12-174Z/fullpage-audit.json`

## Findings

### High Priority

1. Repeated image optimization failures (`400 Bad Request`) on:
   - `/` (desktop/mobile)
   - `/products` (desktop/mobile)
   - `/products/seating` (desktop/mobile)
2. `/products/seating` is the heaviest visual-break route:
   - desktop bad responses: `44`
   - mobile bad responses: `43`
   - mostly `_next/image` requests against `/images/afc/...` paths

### Medium Priority

1. `/products` and `/products/seating` continue to surface unstable visual loading states tied to image failures.

## Passes

- `/solutions`, `/projects`, `/trusted-by`, and `/contact` render without route-level HTTP failures in both audited viewports.

## Conclusion

- The full-page scroll audit confirms route rendering health is mostly stable outside product-heavy surfaces.
- Main visual reliability blocker remains broken image path families (notably `/images/afc/...` and selected `/products/...` assets) causing repeated Next image optimizer `400` responses.
