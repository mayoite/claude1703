# Trust-Sensitive Copy And Alt-Text Audit
- Timestamp: 2026-03-16
- Active lane: `Trust-Sensitive Copy And Alt-Text Hardening`
- Scope: Highest-impact public routes and shared ownership files only

## Routes And Surfaces Audited
- `/` via shared homepage components
- `/products`
- `/products/[category]`
- `/products/[category]/[product]`
- `/contact`
- `/trusted-by`
- `/sustainability`
- shared content ownership in `data/site/routeCopy.ts`

## High-Impact Findings (First Slice)

1. Generic hero-image alt text in shared `Hero` component
- File: `components/home/Hero.tsx`
- Finding: Hero background image uses `alt="Hero Background"` for many high-traffic routes.
- Risk: Non-informative alt text degrades accessibility quality and trust signal.

2. Product listing/category image alt fallback is too generic
- Files:
  - `components/home/CategoryGrid.tsx`
  - `app/products/[category]/FilterGrid.tsx`
  - `app/products/[category]/[product]/ProductViewer.tsx`
  - `components/ProductGallery.tsx`
- Finding: Multiple fallbacks use short generic patterns (for example only category/product names) without explicit image context.
- Risk: Lower-quality assistive output and weaker image semantics on core discovery/decision routes.

3. `/products` route feature image alt text lacks concrete context
- File: `app/products/page.tsx`
- Finding: Route-level hero-adjacent media uses generic wording (`Workspace product category showcase`).
- Risk: Weak content quality on one of the most visible conversion routes.

4. Trust-sensitive sustainability copy contains unsupported absolutes
- File: `data/site/routeCopy.ts` (`SUSTAINABILITY_PAGE_COPY`)
- Finding: Several lines assert strong claims without repo-backed proof (for example absolute sourcing/process assertions, specific circularity percentage, independent benchmark language, and blanket eco-score coverage wording).
- Risk: Credibility and compliance risk due to over-claiming.

5. PDP fallback trust copy uses inflated/unsupported phrasing
- File: `data/site/routeCopy.ts` (`PDP_ROUTE_COPY`)
- Finding: Default fallback description and trust-badge descriptions overstate certainty (for example premium/certified/guaranteed wording in fallback contexts).
- Risk: Trust-copy quality drift where structured product data is sparse.

## Bounded Fix Plan (Second Slice)
- Convert shared hero background image alt to decorative treatment for accessibility correctness.
- Upgrade product/category/gallery fallback alt patterns to descriptive, route-appropriate text.
- Improve `/products` route image alt text with explicit contextual wording.
- Rewrite only the highest-risk sustainability claims to repo-truth language.
- Normalize PDP fallback trust copy to conditional/fact-based phrasing.
- Keep route structure, conversion flow, and catalog truth unchanged.

## Explicit Non-Goals For This Lane
- No broad catalog data backfill.
- No route redesign or layout restructuring.
- No fabricated certifications/documents/assets.
