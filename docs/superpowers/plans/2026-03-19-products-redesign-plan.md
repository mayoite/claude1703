# Products Redesign Plan

## Scope

This plan is grounded in the current products flow:

- [app/products/page.tsx](/d:/Claude1703/app/products/page.tsx)
- [app/products/[category]/page.tsx](/d:/Claude1703/app/products/[category]/page.tsx)
- [app/products/[category]/FilterGrid.tsx](/d:/Claude1703/app/products/[category]/FilterGrid.tsx)
- [app/products/[category]/[product]/ProductViewer.tsx](/d:/Claude1703/app/products/[category]/[product]/ProductViewer.tsx)

Core behavior that must not regress:

- category routing
- URL-driven filters
- search and sort
- compare flow
- quote/cart continuity
- PDP navigation context
- SEO / JSON-LD / breadcrumbs

Current test surface already covers the important parts:

- [tests/dynamic-filters.spec.ts](/d:/Claude1703/tests/dynamic-filters.spec.ts)
- [tests/product-tools.spec.ts](/d:/Claude1703/tests/product-tools.spec.ts)
- [tests/accessibility.spec.ts](/d:/Claude1703/tests/accessibility.spec.ts)
- [tests/navigation-smoke.spec.ts](/d:/Claude1703/tests/navigation-smoke.spec.ts)
- [tests/pdp-image-integrity.spec.ts](/d:/Claude1703/tests/pdp-image-integrity.spec.ts)

## Design Direction

Products should feel like a premium workspace catalog, not a SaaS filter app and not a magazine homepage.

Lock this:

- strong dark anchors
- controlled blue accents
- warm-light surfaces
- quieter borders
- clearer hierarchy
- larger image moments
- simpler product cards
- visible filters, but not dominant
- Helvetica Neue only
- blue italic accent words only where they help, not everywhere

## Route Order

1. `/products`
2. `/products/[category]`
3. `/products/[category]/[product]`
4. compare / quote continuity checks
5. cleanup and dead-style removal

## Phase 1: System Tightening For Products

Target files:

- [app/theme-tokens.css](/d:/Claude1703/app/theme-tokens.css)
- [app/custom-components.css](/d:/Claude1703/app/custom-components.css)
- [app/typography.css](/d:/Claude1703/app/typography.css)

Work:

- define product-specific heading rhythm, card rhythm, filter rhythm, and panel rhythm
- stop mixing raw neutral Tailwind values with semantic surface/text tokens in product pages
- unify card shells, control shells, sticky bars, pills, and metadata text
- keep Tailwind v4 CSS-first structure clean: tokens in `@theme`, primitives in component layer, fewer one-off utilities

Checklist:

- [ ] one product card language
- [ ] one filter control language
- [ ] one PDP panel language
- [ ] one heading/body hierarchy across all product routes
- [ ] reduced color drift and border noise

## Phase 2: `/products` Landing Redesign

Target file:

- [app/products/page.tsx](/d:/Claude1703/app/products/page.tsx)

Current role:

- hero
- strategy section
- category grid
- trust/confidence section
- conversion CTA

Work:

- make this page the bridge between homepage tone and catalog browsing
- keep it calmer and more curated than category pages
- strengthen category discovery with better spacing, stronger category framing, and clearer CTA hierarchy
- reduce repetition between sections
- keep trust logos and conversion, but make them feel integrated instead of appended

Checklist:

- [ ] hero is cleaner and more premium
- [ ] category discovery is clearer
- [ ] trust section feels designed, not bolted on
- [ ] CTA hierarchy is decisive
- [ ] mobile browsing feels intentional

## Phase 3: Category Listing Redesign

Target files:

- [app/products/[category]/page.tsx](/d:/Claude1703/app/products/[category]/page.tsx)
- [app/products/[category]/FilterGrid.tsx](/d:/Claude1703/app/products/[category]/FilterGrid.tsx)

This is the biggest design and behavior surface.

Work:

- redesign the filter shell without changing filter behavior
- keep sidebar visible on desktop
- make mobile drawer cleaner and lighter
- simplify active filter chips
- reduce control clutter
- improve header area above results
- make product cards calmer, more premium, and easier to scan
- make compare actions and quote actions clearer without overpowering the card
- clean up sort/search/filter toolbar hierarchy
- remove old neutral-heavy styling and inconsistent chip/button patterns

Behavior that must stay identical:

- URL hydration
- shareable filter state
- fallback filtering behavior
- compare add/remove
- sort order
- search query syncing
- breadcrumb/category continuity

Checklist:

- [ ] desktop sidebar feels architectural, not noisy
- [ ] mobile filter drawer is simpler
- [ ] result header is cleaner
- [ ] active filters are readable and removable
- [ ] product cards are consistent
- [ ] compare actions remain obvious
- [ ] no filter-state regressions

## Phase 4: PDP Redesign

Target files:

- [app/products/[category]/[product]/page.tsx](/d:/Claude1703/app/products/[category]/[product]/page.tsx)
- [app/products/[category]/[product]/ProductViewer.tsx](/d:/Claude1703/app/products/[category]/[product]/ProductViewer.tsx)

Current PDP responsibilities:

- breadcrumb/context return
- media gallery / model
- product details
- features / materials / specs
- compare
- quote/cart
- related continuity

Work:

- make PDP more image-led and more structured
- improve first-screen hierarchy: product name, short summary, main actions, key info
- simplify spec blocks and chips
- reduce excess borders and panel fragmentation
- make action area feel stronger and cleaner
- improve mobile sticky behavior and readability
- keep technical information dense enough, but not visually heavy

Checklist:

- [ ] first screen feels premium
- [ ] image area does more work
- [ ] primary actions are obvious
- [ ] specifications are easier to scan
- [ ] related metadata is grouped better
- [ ] mobile PDP is not cramped
- [ ] compare/quote continuity still works

## Phase 5: Copy Cleanup

Target files likely include:

- [data/site/routeCopy.ts](/d:/Claude1703/data/site/routeCopy.ts)
- any product-route inline copy in the route files above

Work:

- remove generic corporate filler
- sharpen headings, intros, CTA labels, filter helper text, empty states, and PDP support copy
- ensure category intros sound practical and premium
- tighten any awkward or unreadable copy in search/filter/product support text

Checklist:

- [ ] no filler copy
- [ ] category intros are sharper
- [ ] filter helper text is useful
- [ ] PDP support copy reads cleanly
- [ ] CTA labels are specific

## Phase 6: Cleanup

Work:

- remove superseded product-route styles once replacements are stable
- avoid leaving old and new product styling systems in parallel
- trim redundant utilities only after verification
- update handover and note remaining debt

Checklist:

- [ ] no duplicated product visual system
- [ ] dead style fragments removed
- [ ] remaining debt documented clearly

## Verification Plan

After each phase:

- `npm run lint`
- `npm run build`

After category work:

- `npm run test:e2e:filters`
- `npm run test:e2e:nav`
- `npm run test:a11y`

After PDP work:

- `npx playwright test tests/product-tools.spec.ts`
- `npx playwright test tests/pdp-image-integrity.spec.ts`

Acceptance checklist:

- [ ] `/products` feels like a curated entry, not a dump
- [ ] category pages feel premium but still practical
- [ ] PDP feels image-led and clearer
- [ ] compare and quote flows still work
- [ ] filter URLs still hydrate correctly
- [ ] products flow visually matches homepage direction
- [ ] mobile and desktop both feel designed

## Handover

Update [HANDOVER.md](/d:/Claude1703/HANDOVER.md) after each implementation pass with:

- completed phase
- files touched
- tests run
- tests not run
- remaining product debt
- behavior risks
- any dirty-worktree conflicts that were worked around

Handover checklist:

- [ ] phase completed stated clearly
- [ ] touched files listed
- [ ] regressions checked listed
- [ ] remaining work prioritized
- [ ] risks documented

## Execution Order I Recommend

1. tighten product primitives
2. finish `/products`
3. finish category listing
4. finish PDP
5. run verification
6. cleanup and handover
