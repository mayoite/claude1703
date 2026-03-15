# Visual Audit (2026-03-12)

## Scope

Manual visual review from fresh Playwright screenshots across key public routes on desktop and mobile.

- Base URL: `http://localhost:3000`
- Capture set: `output/playwright/visual-reaudit-2026-03-12T17-47-28-924Z`
- Matrix: 10 routes x 2 viewports = 20 checks

## Route Coverage

- `/`
- `/products`
- `/products/seating`
- `/solutions`
- `/projects`
- `/trusted-by`
- `/sustainability`
- `/showrooms`
- `/contact`
- `/configurator`

## High-Severity Findings

1. `/products/seating` desktop hero area renders as a large blank/dark block with no visible heading/content in first viewport, while cards below show loading/skeleton state.
2. Repeated browser console resource failures (`400 Bad Request`) on:
   - `/` (desktop/mobile)
   - `/products` (desktop/mobile)
   - `/products/seating` (desktop/mobile)
   This indicates asset/runtime requests are failing during visual render.

## Medium-Severity Findings

1. Persistent cookie bar plus floating chatbot bubble compete for bottom viewport space on mobile pages and may obstruct initial CTA or first product cards.
2. `/products/seating` mobile shows `Refreshing products...` state in first viewport; visual stability at first paint remains weak.

## Pass Observations

- Core shell and top navigation are visually present on all audited routes.
- `/solutions`, `/projects`, `/trusted-by`, `/sustainability`, `/showrooms`, `/contact`, and `/configurator` render without obvious above-the-fold breakage in both audited viewports.

## Evidence Paths

- Summary: `output/playwright/visual-reaudit-2026-03-12T17-47-28-924Z/visual-reaudit.md`
- Structured results: `output/playwright/visual-reaudit-2026-03-12T17-47-28-924Z/visual-reaudit.json`
- Key screenshots:
  - `output/playwright/visual-reaudit-2026-03-12T17-47-28-924Z/home-desktop.png`
  - `output/playwright/visual-reaudit-2026-03-12T17-47-28-924Z/home-mobile.png`
  - `output/playwright/visual-reaudit-2026-03-12T17-47-28-924Z/products--seating-desktop.png`
  - `output/playwright/visual-reaudit-2026-03-12T17-47-28-924Z/products--seating-mobile.png`
