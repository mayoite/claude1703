# Decisions

Use this file to record recovery decisions that should not be re-litigated in every new session.

## Current Decisions

### 2026-03-16 Seating Image Warning Lane Closure And Deployment-Hardening Rotation

- Decision: Close the residual seating image optimizer warning lane and rotate the active frontier to bounded deployment/environment hardening.
- Why:
  - The warning source was stale Phoenix WEBP references that were not repo-backed.
  - `lib/assetPaths.ts` now maps valid Phoenix indices to existing JPG files and drops invalid overflow indices.
  - Verification after the fix is green:
    - `npm run test:e2e:filters`: pass
    - `npm run build`: pass
    - `npm test`: pass
- Impact:
  - `NEXT-PLAN.md` now marks automated verification hardening as closed.
  - `RECOVERY-CHECKLIST.md` records warning-lane closure.
  - `latest.md` now points to deployment/environment hardening as the single active frontier.

### 2026-03-16 Automated Verification Hardening Baseline Locked

- Decision: Lock the automated verification baseline as green and keep the active frontier narrowed to residual runtime warning cleanup.
- Why:
  - Core checks now pass in one bounded pass:
    - `npm test`
    - `npm run test:e2e:nav`
    - `npm run test:e2e:filters`
    - `npm run test:e2e:stats-consistency`
    - `npm run test:a11y`
    - `npm run lint`
    - `npm run build`
  - Remaining noise is now runtime warning-level (`next/image` optimizer warnings for some seating image paths), not test-failing regressions.
- Impact:
  - `NEXT-PLAN.md` now tracks automated verification hardening as the active block with warning cleanup as the next explicit step.
  - Phase 10 automated verification checkboxes in `WORLD-CLASS-PLAN.md` are now marked complete for unit and targeted E2E suites.
  - Recovery sequencing stays bounded and does not reopen design or catalog-repair scope.

### 2026-03-16 Trust-Copy/Alt-Text Lane Closure And Verification-Hardening Rotation

- Decision: Close the bounded trust-sensitive copy and alt-text hardening lane and rotate the active frontier to automated verification hardening.
- Why:
  - High-impact trust-copy and alt-text gaps were addressed without widening scope: shared hero background images now use correct decorative treatment, product/category/PDP/gallery alt fallbacks are more descriptive, and high-risk sustainability/PDP fallback copy was rewritten to repo-backed language.
  - Verification for the lane is sufficient:
    - `npm run lint`: pass
    - `npm run build`: pass
  - The next blocking quality gap is verification reliability, not public copy structure.
- Impact:
  - `NEXT-PLAN.md` closure markers are now complete for the trust-copy lane.
  - `RECOVERY-CHECKLIST.md` records trust-copy lane closure and fresh verification.
  - `WORLD-CLASS-PLAN.md` now marks alt-text/trust-copy quality as completed and sets automated verification hardening as the active frontier.

### 2026-03-15 Footer Closure And Trust-Copy Frontier Rotation

- Decision: Close the bounded footer and global contact-surface hardening lane and rotate the active frontier to a bounded trust-sensitive copy and alt-text quality pass.
- Why:
  - The shared shell now exits more cleanly: duplicate footer support links were removed, sales/planning vs support contact ownership is clearer in the footer, and the extra footer conversion panel no longer repeats on routes that already carry a dedicated conversion surface.
  - Verification for the footer lane is sufficient:
    - `npm run lint`: pass
    - `npm run build`: pass
  - The next adjacent trust/SEO gap is now content quality, not shell structure: trust-sensitive public copy and alt-text quality still need one bounded pass on the strongest routes.
- Impact:
  - `NEXT-PLAN.md` now points to a bounded trust-sensitive copy and alt-text hardening lane.
  - `RECOVERY-CHECKLIST.md` records the footer lane as verified and closed.
  - The next explicit step is to audit trust-sensitive public copy and alt-text ownership on the highest-impact public routes before editing.

### 2026-03-15 SEO Ownership Closure And Footer Frontier Rotation

- Decision: Close the bounded SEO and structured-data ownership lane on the highest-impact public entry routes and rotate the active frontier to a bounded footer and global contact-surface hardening pass.
- Why:
  - Route-level metadata ownership is now explicit on `/`, `/products`, `/contact`, `/products/[category]`, and `/products/[category]/[product]`, which closes the highest-impact search-facing gap without widening into route-by-route metadata churn.
  - Page-level schema and breadcrumb schema are now explicit on the core public entry routes, and the PDP still preserves filtered-return continuity after moving `from=` handling to the client boundary.
  - Verification for the SEO lane is sufficient:
    - `npm run lint`: pass
    - `npm run build`: pass
    - `npx playwright test tests/dynamic-filters.spec.ts --grep "product detail carries from context and breadcrumb returns to filtered list" --workers=1`: pass
  - The next adjacent leverage point is the final shared route-exit surface: the global footer and adjacent contact modules still need one bounded clarity pass.
- Impact:
  - `NEXT-PLAN.md` now points to a bounded footer and global contact-surface lane.
  - `RECOVERY-CHECKLIST.md` records the SEO ownership lane as verified and closed.
  - The next explicit step is to audit `components/site/Footer.tsx` and the current footer/contact surfaces before editing.

### 2026-03-15 Quote-Contact Closure And SEO Ownership Frontier Rotation

- Decision: Close the bounded quote/contact flow hardening lane and rotate the active frontier to a bounded SEO and structured-data ownership pass on the highest-impact public routes.
- Why:
  - The shortlist-to-contact handoff is now materially clearer: compare and quote-cart carry quote intent into `/contact`, the contact form shows source-aware context, and customer-query submissions preserve contextual `requirement`, `source`, and `sourcePath`.
  - Verification for the quote/contact lane is sufficient:
    - `npm run lint`: pass
    - `npm run build`: pass
    - `npx playwright test tests/product-tools.spec.ts --workers=1`: pass
  - The next adjacent leverage point is no longer conversion continuity. It is the consistency of route-level metadata and structured-data ownership across the strongest public entry routes.
- Impact:
  - `NEXT-PLAN.md` now points to a bounded SEO and structured-data ownership lane.
  - `RECOVERY-CHECKLIST.md` records quote/contact continuity as verified and closed.
  - The next explicit step is to audit `data/site/seo.ts`, route metadata, and structured-data ownership before editing.

### 2026-03-15 Homepage Route Closure And Conversion-Tool Frontier Rotation

- Decision: Close the homepage route block after visual QA, close the compare/quote-cart continuity pass, and rotate the active frontier to a bounded quote/contact flow hardening lane.
- Why:
  - Homepage desktop/mobile visual QA passed after the layout/search recovery, so the route no longer needs another bounded homepage-only pass.
  - Compare and quote-cart now route users more cleanly into procurement next steps: compare can add directly to quote-cart, quote-cart restores compare continuity, and both surfaces keep Planning and Resource Desk paths visible.
  - Verification for the combined closure is sufficient:
    - `npm run lint`: pass
    - `npm run build`: pass
    - `npx playwright test tests/homepage-visual-qa.spec.ts --workers=1`: pass
    - `npx playwright test tests/product-tools.spec.ts --workers=1`: pass
  - The next highest-impact gap is no longer homepage or shortlist tooling; it is the final quote/contact handoff clarity on `/contact` and related customer-query surfaces.
- Impact:
  - `NEXT-PLAN.md` now points to a bounded quote/contact flow hardening lane.
  - `RECOVERY-CHECKLIST.md` records homepage closure and compare/quote-cart continuity as verified.
  - The next explicit step is to audit `/contact`, `CustomerQueryForm`, and shortlist-to-contact continuity before editing.

### 2026-03-15 Homepage Layout And Search-Entry Recovery Closure

- Decision: Close the bounded homepage layout and closing-flow recovery implementation pass and rotate the active frontier to one final homepage-only visual QA and residual-polish check.
- Why:
  - The homepage runtime sequence is now tighter and more conversion-coherent without reopening content truth: the trust strip moved near the footer, the homepage close is now a planner-led module with lower-noise direct-contact support, and the strongest earlier sections were preserved.
  - Desktop and mobile header search now behave explicitly on Enter instead of silently no-oping when a user submits from the field.
  - Verification for this bounded implementation pass is sufficient:
    - `npm run lint`: pass
    - `npm run build`: pass
    - `npx playwright test tests/homepage.spec.ts --workers=1`: pass
  - The remaining uncertainty is no longer interaction logic; it is route-level visual confirmation on desktop and mobile before rotating away from the homepage.
- Impact:
  - `NEXT-PLAN.md` now points to a homepage-only visual QA and residual-polish block.
  - `RECOVERY-CHECKLIST.md` records the homepage layout/search pass as implemented and verified.
  - The next homepage step is bounded to visual QA rather than more structural or content cleanup.

### 2026-03-15 Homepage Truth-Simplification Closure And Layout Frontier Lock

- Decision: Close the bounded homepage truth-and-simplification pass and rotate the active frontier to a bounded homepage layout and closing-flow recovery wave.
- Why:
  - The homepage content/config layer is now materially cleaner: live homepage truth is consolidated in `data/site/homepage.ts`, homepage collections use canonical category routes, project cards are reduced to sector + company name truth, and the homepage contact model is reduced to planner + WhatsApp + phone.
  - Stale homepage-only component ownership was removed from the active tree, which lowers the risk of layout work reintroducing dead branches.
  - Verification for this bounded cleanup pass is sufficient:
    - `npm run lint`: pass
    - `npm run build`: pass
    - `npx playwright test tests/homepage.spec.ts --workers=1`: pass
    - static search checks: no live homepage-facing stale `?category=` links, no homepage project location strings, and no homepage quick-contact email action
  - The next high-impact homepage issues are no longer source-truth issues; they are visible layout and interaction issues in the closing module, proof-strip placement, and search-entry behavior.
- Impact:
  - `NEXT-PLAN.md` now points to a homepage-only layout and closing-flow recovery lane.
  - `WORLD-CLASS-PLAN.md` now records the homepage truth-and-simplification pass as closed and reopens the homepage as the active bounded frontier for layout and interaction recovery.
  - `docs/homepage-ia-flowchart.md` is now part of the homepage evidence base for later recovery decisions.

### 2026-03-15 Configurator Lane Closure, Archive Deferral, And Global Conversion/SEO Frontier Lock

- Decision: Close the bounded configurator-usefulness lane, record archive recovery as a late-stage deferred plan, and rotate the active frontier to a bounded global conversion and SEO/contact hardening pass.
- Why:
  - The live configurator is no longer a pre-edit audit target. It now includes a dual-mode workflow, route-scoped configurator copilot, quieter global assistant behavior on `/configurator`, stronger review/submission flow, and better mobile review continuity.
  - Verification for the configurator lane is now sufficient:
    - `npm run build`: pass
    - `npm run lint`: pass
    - `npx playwright test tests/homepage.spec.ts tests/product-tools.spec.ts tests/accessibility.spec.ts --workers=1`: pass
  - The archive lane now has a real internal review surface at `/home-unused`, but that work is better treated as late-stage selective reintegration instead of the current live-product frontier.
  - The next adjacent leverage point is the global footer/contact/metadata foundation, where conversion routing and SEO/contact truth can improve without reopening broad route-by-route work.
- Impact:
  - `NEXT-PLAN.md` now points to a bounded global conversion and SEO/contact hardening lane.
  - `WORLD-CLASS-PLAN.md` now includes a late-stage archive recovery and selective reintegration phase positioned around the post-core, roughly 80%-complete stage.
  - The configurator lane is considered closed for this phase, while deeper archive reintegration stays explicitly deferred.

### 2026-03-15 Archive Recovery Review Surface And Deferred Reintegration Rule

- Decision: Treat `/home-unused` as the archive decision surface and defer any real dormant-code reintegration to a late-stage archive recovery lane instead of reviving archived modules opportunistically.
- Why:
  - The archive route now mounts the strongest renderable candidates, including the configurator shell reconstruction, legacy advisor loop, archived 3D viewer with a real local `.glb`, parallax gallery, shared/UI wrappers, and trust-card patterns.
  - The route now exposes verdict tags, strongest-pick summaries, active filters, text search, and live-comparison links, so reintegration decisions can be made from evidence instead of code archaeology.
  - Several archived modules are useful only as patterns, not as runtime components. Blind restoration would revive stale architecture and hardcoded assumptions.
- Impact:
  - `WORLD-CLASS-PLAN.md` now carries a detailed late-stage archive recovery checklist.
  - `unused/components/configurator/ConfiguratorLayout.tsx` is now treated as a structural shell reference for later recovery rather than a component to restore wholesale.
  - `unused/components/ai/Advisor.tsx`, `unused/components/3DViewer.tsx`, and `unused/components/product/ParallaxGallery.tsx` remain the top late-stage archive candidates.
  - Verification for the archive review route is now explicit:
    - `npm run build`: pass
    - `npm run lint`: pass
    - `npx playwright test tests/home-unused.spec.ts --workers=1`: pass

### 2026-03-14 Product Detail Lane Closure And Configurator Frontier Lock

- Decision: Close the bounded product-detail lane and rotate the active frontier to a configurator-usefulness baseline on `/configurator`.
- Why:
  - The PDP now has truthful category return behavior, safe quote/compare routing, clearer planning and Resource Desk continuity, stronger media-summary hierarchy, and more readable specification/support grouping.
  - Verification for the product-detail lane is now sufficient:
    - `npm run build`: pass
    - `npx playwright test tests/dynamic-filters.spec.ts --grep "product detail carries from context and breadcrumb returns to filtered list" --workers=1`: pass
    - `npx playwright test tests/accessibility.spec.ts --grep "product detail route" --workers=1`: pass
  - The next adjacent leverage point after homepage, category, compare, and PDP cleanup is the usefulness of the live planning tool itself.
- Impact:
  - `NEXT-PLAN.md` now points to a bounded configurator-usefulness lane on `/configurator`.
  - The product-detail lane is considered closed for this phase.
  - Fresh build output still showed bounded Supabase/Nhost generation-time fallback and revalidation noise, so that signal remains a hardening watch item instead of an active frontend blocker.

### 2026-03-14 Product Detail Wave 2 (`/products/[category]/[product]`)

- Decision: Finish the second slice of the product-detail lane by improving media-summary hierarchy, specification readability, and practical support signals before closing the route block.
- Why:
  - The route had already fixed breadcrumb and CTA continuity, but the actual decision surface still buried useful fit/configuration/support context too deeply.
  - The page needed clearer visual coverage and model-status feedback, better grouping of practical product signals, and more readable specification cards on mobile and desktop.
  - These improvements stay within the bounded PDP frontier and do not require catalog, configurator, or content-ingestion scope changes.
- Impact:
  - `app/products/[category]/[product]/ProductViewer.tsx` now presents a decision snapshot, stronger media-status cues, clearer return-to-results affordance, card-based specification grouping, and more explicit planning/Resource Desk support truth.
  - `data/site/routeCopy.ts` now owns the added PDP summary and return-path copy instead of leaving those labels local.
  - Verification after the wave:
    - `npm run build`: pass
    - `npx playwright test tests/dynamic-filters.spec.ts --grep "product detail carries from context and breadcrumb returns to filtered list" --workers=1`: pass
    - `npx playwright test tests/accessibility.spec.ts --grep "product detail route" --workers=1`: pass

### 2026-03-13 Product Detail Wave 1 (`/products/[category]/[product]`)

- Decision: Start the PDP lane by fixing route-truth and continuity issues before deeper media/spec hierarchy changes.
- Why:
  - The PDP breadcrumb was labeling the category return path with the product series instead of the category, which weakened return-to-results clarity.
  - Quote-cart and compare payloads were deriving product hrefs from `categoryRoute`, which is unsafe when the category path carries query state.
  - The product detail route needed clearer planning and Resource Desk continuity to stay aligned with the locked document/source-gap truth.
- Impact:
  - `app/products/[category]/[product]/page.tsx` now passes explicit category and product route values into `ProductViewer`.
  - `app/products/[category]/[product]/ProductViewer.tsx` now shows a truthful category breadcrumb label, uses safe product-route hrefs for quote/compare payloads, and routes users more clearly toward planning and the Resource Desk.
  - `data/site/routeCopy.ts` now carries the added PDP CTA labels.
  - Verification after the wave:
    - `npm run build`: pass
    - direct PDP check on `/products/seating/seating-study-fluid-task?from=price%3Dmid%26ecoMin%3D6`: breadcrumb label `Seating`, quote CTA visible, planning and Resource Desk links present

### 2026-03-13 Category Discovery Lane Closure And PDP Frontier Lock

- Decision: Close the bounded category-discovery lane and rotate the active frontier to product detail excellence on `/products/[category]/[product]`.
- Why:
  - The category route now has truthful price-band language, clearer compare/category continuity, stronger active-filter visibility, and cleaner mobile drawer feedback.
  - Verification for the category lane is now sufficient:
    - `npm run build`: pass
    - `npx playwright test tests/dynamic-filters.spec.ts --workers=1`: pass
    - direct mobile check on `/products/seating?price=mid&ecoMin=6`: drawer summary visible, result CTA visible, single clear-all control
  - The next adjacent leverage point after homepage, top-level discovery, and category discovery is the product detail route where users make the actual decision.
- Impact:
  - `NEXT-PLAN.md` now points to a bounded product-detail lane on `/products/[category]/[product]`.
  - The category-discovery lane is considered closed for this phase, with one bounded hardening note only: the default parallel Playwright run showed dev-server timing flake, while the serial verification pass was green.
  - Catalog-truth rules remain locked: `missing_documents` stays visible, `fluid-x` stays the only accepted legacy-slug exception, and `oando-soft-seating--luna` stays explicitly deferred unless repo-backed media evidence appears.

### 2026-03-13 Category Discovery Wave 2 (`/products/[category]`)

- Decision: Finish the second slice of the category-discovery lane by making active filter/search state more visible and improving mobile drawer feedback before any visual closeout decision.
- Why:
  - The route still under-reported active state because search was not counted alongside filters and the current UI did not summarize applied refinements clearly enough.
  - The mobile drawer needed stronger result context before closing so users could understand the impact of their filter changes.
  - These improvements stay within the bounded category-discovery frontier and do not require PDP, configurator, or catalog-data changes.
- Impact:
  - `lib/productFilters.ts` now counts active search as part of the visible refinement state.
  - `app/products/[category]/FilterGrid.tsx` now shows stronger active-state chips, clearer result summaries, and better mobile-drawer feedback while preserving repo-truth routing.
  - `data/site/routeCopy.ts` now owns the added category-filter UI copy instead of scattering it locally.
  - Verification after the wave:
    - `npm run build`: pass

### 2026-03-13 Category Discovery Wave 1 (`/products/[category]`, `/compare`)

- Decision: Start the category-discovery lane by fixing truth issues and continuity gaps before deeper filter-layout changes.
- Why:
  - The category grid still exposed synthetic rupee "starting from" pricing even though the current repo only supports coarse `priceRange` metadata.
  - Compare entry existed, but category-to-compare continuity and compare-page return paths were weaker than the updated homepage and `/products` entry routes.
  - These issues could be corrected safely without reopening PDP, configurator, or broad catalog-repair scope.
- Impact:
  - `app/products/[category]/FilterGrid.tsx` now replaces the synthetic pricing output with truthful price-band/request language and adds clearer category, compare, and Resource Desk continuity above the listing toolbar.
  - `app/compare/page.tsx` now routes users back to categories and the Resource Desk more clearly when comparing or when no items are selected yet.
  - `data/site/routeCopy.ts` now owns the category and compare continuity copy used in this lane.
  - Verification after the wave:
    - `npm run build`: pass

### 2026-03-13 Homepage/Products Follow-Up Closure And Next Frontier Lock

- Decision: Close the bounded homepage/products follow-up, treat the earlier generation-time fallback noise as a bounded hardening watch item, and move the active frontier to category discovery under `/products/[category]`.
- Why:
  - The remaining weak public phrases in the homepage/products pair were isolated to typed content and shared section labels, so the lane could close without reopening structure or catalog scope.
  - A fresh `npm run build` rerun on 2026-03-13 passed cleanly after the copy cleanup and did not reproduce the earlier generation-time Supabase/Nhost fetch noise.
  - The next adjacent leverage point after the cleaned homepage and top-level products route is the category listing experience: filter clarity, product-card scanability, compare entry, and mobile browsing rhythm.
- Impact:
  - The homepage and `/products` pair is now considered closed for this lane.
  - The earlier fallback-noise signal remains recorded as an intermittent hardening watch item for later platform/release-hardening review, not as an active discovery blocker.
  - `NEXT-PLAN.md` now points to a bounded category-discovery and filter-UX lane on `/products/[category]` with compare-entry continuity.
  - Catalog-truth rules remain locked: `missing_documents` stays visible, `fluid-x` stays the only accepted legacy-slug exception, and `oando-soft-seating--luna` stays explicitly deferred unless repo-backed media evidence appears.

### 2026-03-13 Homepage And Top-Level Discovery Frontier (`/`, `/products`)

- Decision: Use the homepage and the top-level products route as the next bounded frontend lane after the company-utility and support-routing waves.
- Why:
  - The adjacent utility and support surfaces are now aligned to the newer route system and no longer provide the highest frontend leverage.
  - The homepage and `/products` now carry the biggest remaining impact on discovery, first impression, and conversion clarity.
  - This lane can materially improve user understanding before widening into deeper PDP or configurator work.
- Impact:
  - `NEXT-PLAN.md` now points to `/` and `/products` as the single active frontend frontier.
  - The next pass is bounded to homepage hierarchy and top-level discovery quality only.
  - The current pair is improved and build-verified, but one bounded follow-up pass remains to remove remaining low-signal public copy and capture catalog/network fallback noise as a hardening item rather than a discovery truth issue.
  - Catalog-truth rules remain locked: `missing_documents` stays visible, `fluid-x` stays the only accepted legacy-slug exception, and `oando-soft-seating--luna` stays explicitly deferred unless repo-backed media evidence appears.

### 2026-03-13 Brand And Company Utility Wave (`/about`, `/sustainability`, `/career`, `/social`)

- Decision: Complete the bounded brand-and-company utility wave before rotating to a new frontier.
- Why:
  - These routes sat adjacent to trust and proof pages but still carried older styling, thinner route ownership, or placeholder-grade public behavior.
  - They could be strengthened safely with typed route copy and support-routing continuity.
- Impact:
  - `app/about/page.tsx`, `app/sustainability/page.tsx`, `app/career/page.tsx`, and `app/social/page.tsx` now align more closely to the shared `scheme-*` route language.
  - `data/site/routeCopy.ts` now owns the main copy and CTA structure for the whole utility cluster.
  - `/social` no longer exposes corrupted mock-feed captions as a public surface.
  - Verification after the full wave:
    - `npm run build`: pass

### 2026-03-13 Support-Routing Utility Wave (`/news`, `/tracking`, `/support-ivr`)

- Decision: Use the adjacent support-routing utility cluster as the next bounded route wave after the company-utility cluster closed.
- Why:
  - `tracking` exposed a fake public order-tracking simulation, which was worse than leaving the route plain.
  - `news` and `support-ivr` still carried older page treatment and weaker route-owned framing.
- Impact:
  - `app/news/page.tsx`, `app/tracking/page.tsx`, and `app/support-ivr/page.tsx` now align to the current route system and truthful support-routing rules.
  - `tracking` is now a real support-routing page instead of a simulated logistics UI.
  - `data/site/routeCopy.ts` now carries typed copy for this route cluster.
  - Verification after the wave:
    - `npm run build`: pass

### 2026-03-13 Next Bounded Utility Frontier (`/about`, `/sustainability`, `/career`, `/social`)

- Decision: Use the brand-and-company utility cluster as the next bounded frontend lane after the completed trust/legal/proof wave.
- Why:
  - These routes are adjacent to trust and brand perception but lower-risk than reopening product, catalog, or configurator work.
  - They can materially improve brand clarity, credibility, and contact routing without inventing unsupported product claims.
  - The lane stays bounded to non-product utility routes and avoids widening into `news`, `tracking`, `support-ivr`, or product-detail work.
- Impact:
  - `NEXT-PLAN.md` now points to `/about`, `/sustainability`, `/career`, and `/social` as the single active utility frontier.
  - The first implementation pair in that lane is `/about` and `/sustainability`; `/career` and `/social` only extend if the first pair verifies cleanly.
  - The catalog-truth rules remain locked: `missing_documents` stays visible, `fluid-x` stays the only accepted legacy-slug exception, and `oando-soft-seating--luna` stays explicitly deferred unless repo-backed media evidence appears.

### 2026-03-13 Legal And Compliance Route Wave (`/privacy`, `/terms`, `/imprint`, `/refund-and-return-policy`)

- Decision: Use the legal/compliance route cluster as the next bounded frontend wave after the trust/support lane.
- Why:
  - These pages still used the older white-page treatment and sat visibly behind the refreshed trust and support surfaces.
  - They are trust-critical routes but low catalog-risk because the content is policy and business-information driven rather than product-data dependent.
- Impact:
  - `data/site/routeCopy.ts` now carries stronger typed structure for privacy, terms, imprint, and refund overviews.
  - `app/privacy/page.tsx`, `app/terms/page.tsx`, `app/imprint/page.tsx`, and `app/refund-and-return-policy/page.tsx` now align to the current `scheme-*` route system and route users cleanly toward contact, service, and the Resource Desk.
  - Verification remains green after the legal wave:
    - `npm run build`: pass

### 2026-03-13 Proof And Showcase Route Wave (`/projects`, `/portfolio`, `/gallery`, `/showrooms`)

- Decision: Continue directly into the adjacent proof/showcase cluster once the legal lane was verified.
- Why:
  - These routes sit next to the trust surfaces in the conversion path and still carried older neutral-only panels despite relying on live proof, project, and KPI signals.
  - The routes already had stable local copy and image sources, so quality could improve without widening into unsupported content.
- Impact:
  - `app/projects/page.tsx`, `app/portfolio/page.tsx`, `app/gallery/page.tsx`, and `app/showrooms/page.tsx` now use the newer route-panel language more consistently.
  - CTA routing between trust, portfolio, and proof surfaces is clearer and more internally connected.
  - Verification remains green after the showcase wave:
    - `npm run build`: pass

### 2026-03-13 `trashfiles/` Reclassification

- Decision: Remove `trashfiles/` from active recovery flow by reclassifying its contents into `archive/trashfiles-review/2026-03-13/` and keep `unused/` as the only salvage pool.
- Why:
  - The folder audit showed `trashfiles/` contained stale recovery-doc copies and a second salvage-style component dump that overlapped with `unused/`.
  - That structure conflicted with the locked preserve-first rule and made salvage intent ambiguous.
- Impact:
  - `archive/trashfiles-review/2026-03-13/` now preserves the old `trashfiles/` residue without deleting anything.
  - `unused/` remains the only active salvage location for dormant source under recovery review.
  - `trashfiles/` is no longer carrying live recovery-doc duplicates or competing salvage structure.

### 2026-03-13 `unused/` And Superseded File Rule Lock

- Decision: Treat `unused/` strictly as a salvage pool and do not use `trashfiles/` as the default destination for superseded implementation files.
- Why:
  - The recovery charter is preserve-first, archive-first, and non-destructive.
  - `unused/` already exists to preserve evidence-backed dormant code without deleting it.
  - Sending replaced files to `trashfiles/` by default would blur the difference between salvage, archive, and disposable clutter.
- Impact:
  - Files in `unused/` must be reviewed and classified before reintegration.
  - Recovered files should come back only when they materially improve the live system and fit the current architecture.
  - Superseded active-tree files should stay preserved in place or be reclassified through the recovery flow, not dumped into `trashfiles/`.

### 2026-03-13 Plan Merge Rule Locked

- Decision: Treat `NEXT-PLAN.md` as the single active plan source and reduce `handover/CURRENT-PLAN.md` to a handoff mirror only.
- Why:
  - The recovery folder had started to drift toward two competing current-plan documents.
  - That duplication makes fresh-session continuation less reliable and increases the chance of stale execution order.
- Impact:
  - `NEXT-PLAN.md` now owns the active execution plan.
  - `handover/CURRENT-PLAN.md` now exists only as a fast-resume mirror/pointer.
  - Recovery docs and helper text now state that if the two files differ, `NEXT-PLAN.md` wins.

### 2026-03-13 Trust Surface Wave 1 (`/trusted-by`)

- Decision: Use `/trusted-by` as the first implementation wave for the new trust-surface frontend lane.
- Why:
  - The route was previously a thin shell around the hero and a shared section, so it carried clear trust/conversion upside with low catalog-risk.
  - The shared `WhyChooseUs` component still contained corrupted public copy and older neutral-only styling that did not match the newer `scheme-*` route system.
  - The route already had a clean typed content source and a local trust-data module, so the page could be expanded without inventing unsupported claims.
- Impact:
  - `data/site/routeCopy.ts` now carries a fuller typed trust-page content set for `/trusted-by`.
  - `app/trusted-by/page.tsx` now includes a real proof overview, KPI block, sector spread, and client roster instead of acting as a thin wrapper.
  - `components/home/WhyChooseUs.tsx` now uses the newer `scheme-*` page/panel primitives and no longer exposes the earlier corrupted encoding in live copy.
  - The first trust/support route wave is now build-verified:
    - `npm run build`: pass
  - The next adjacent frontend lane should move to planning/contact/solutions consistency rather than reopening `/trusted-by`.

### 2026-03-13 Trust Surface Wave 2 (`/planning`, `/contact`, `/solutions`)

- Decision: Use the adjacent planning/contact/solutions cluster as the second trust-surface wave and align it to the same support and conversion standard as the refreshed trust page.
- Why:
  - These routes still carried older neutral-only section treatments and inconsistent CTA treatment despite already participating in the `Resource Desk` flow.
  - The copy and CTA behavior already belonged in typed route data, so the route cluster could be improved without inventing unsupported content.
- Impact:
  - `data/site/routeCopy.ts` now carries the additional planning, contact, and solutions support-copy needed for a consistent route pass.
  - `app/planning/page.tsx`, `app/contact/page.tsx`, and `app/solutions/page.tsx` now use the newer `scheme-*` visual language more consistently.
  - The cluster now routes users more clearly between planning calls, contact, product browsing, and the `Resource Desk`.

### 2026-03-13 Trust Surface Wave 3 (`/service`)

- Decision: Extend the same trust/support lane into `/service` before switching to a new frontend frontier.
- Why:
  - `/service` sits in the same support-routing family and still carried the older neutral-only treatment even after the adjacent planning/contact/solutions cluster was refreshed.
  - The route already participates in support, tracking, and documentation flows, so aligning it to the same CTA and panel system improves continuity without widening scope.
- Impact:
  - `data/site/routeCopy.ts` now includes a clearer support-routing message for document and warranty-reference requests.
  - `app/service/page.tsx` now uses the same `scheme-*` visual system and `Resource Desk`-aware CTA pattern as the rest of the support lane.
  - Verification remains green after the expanded route wave:
    - `npm run build`: pass

### 2026-03-12 Platform Follow-Up Closure And Audit Repair

- The deferred Week 1 platform blocker is now closed in execution:
  - Hasura metadata was updated to track `public.product_slug_aliases`
  - Hasura metadata was updated to track `public.catalog_product_slug_aliases`
  - `npm run audit:nhost:backup` now passes with `tableDiffs=0`, `graphqlFailures=0`
- Build verification remains green after the metadata fix:
  - `npm run build`: pass
- The stale tooling drift in `scripts/audit-product-quality.ts` is now repaired:
  - restored `lib/productSpecSchema.ts` from the local `unused/` salvage pool because the helper remained relevant and structurally useful
  - removed the dead `../lib/catalog.ts` dependency from the audit path
  - rewired the quality audit to fetch the live catalog shape from Supabase instead of relying on removed static fallback catalog files
- `npm run audit:products:quality` now runs successfully again and reports the current live issue baseline instead of failing on missing modules.
- Current live quality-audit signal after the repair:
  - `productsAudited=145`
  - `issueRows=1262`
  - dominant issue types are `invalid_gallery_image_path=934`, `missing_documents=145`, `invalid_primary_image_path=136`
- The next active execution lane is no longer platform follow-up; it is catalog/media repair starting with the workstation priority set already recorded in recovery docs.

### 2026-03-12 Legacy Nhost Dependency Review (Week 1 Closeout)

- Classification rule for this closeout is now fixed as:
  - `active-required`: still required for runtime continuity right now
  - `transition-compatible`: intentionally retained during dual-table transition
  - `removable-now`: safe to remove/reroute immediately
- Dependency matrix (legacy Nhost tables only):
  - `lib/nhostCatalog.ts` (`fetchNhostProductsViaSql`):
    - reads `public.products` and `public.product_slug_aliases`
    - classification: `active-required`
    - reason: SQL rescue path is still required when GraphQL is unavailable/denied/schema-broken or when alias resolution is missing in GraphQL.
  - `scripts/sync_nhost_backup.ts`:
    - writes and verifies legacy tables `public.products`, `public.categories`, `public.product_specs`, `public.product_images`, `public.product_slug_aliases`
    - classification: `transition-compatible`
    - reason: dual-table mirror contract is still intentionally active for fallback/runtime continuity.
  - `scripts/audit_nhost_backup.ts`:
    - reads `public.products` and `public.product_slug_aliases` for parity sampling
    - classification: `transition-compatible`
    - reason: audit surface intentionally checks legacy-table parity until retirement lane is approved.
- Current outcome: no `removable-now` legacy Nhost dependency identified in this first inventory pass.
- Verification rerun for this closeout block:
  - `npm run build`: pass
  - `npm run audit:nhost:backup`: `tableDiffs=0`, `graphqlFailures=1`
  - Remaining known gap is unchanged: GraphQL alias-table query exposure (`product_slug_aliases` on `query_root`) in Nhost schema.
- Re-audit of completed steps (latest pass):
  - proven-dead preservation check: `deleted_scoped=40`, `missing_in_unused=0`
  - `npm run build`: pass
  - `npm run audit:nhost:backup`: `tableDiffs=0`, `graphqlFailures=1` (unchanged accepted transition constraint)
  - `npm run audit:supabase:catalog`: pass (`products=145`, `blankSlugs=0`, `duplicateSlugs=0`)
  - `npm run audit:products:quality`: fails due stale script imports (`../lib/catalog.ts` missing in current tree); treat as tooling drift to fix separately from runtime platform state.
  - comprehensive site re-audit completed and captured in `codex-recovery/AUDIT-ALL-2026-03-12.md` (lint/build/type/unit/e2e/a11y/data/parity/slug-id/external-asset coverage).
  - visual audit completed and captured in `codex-recovery/AUDIT-VISUAL-2026-03-12.md` (desktop/mobile route matrix with screenshot evidence).
  - full-page scroll audit completed and captured in `codex-recovery/AUDIT-FULLPAGE-SCROLL-2026-03-12.md` with evidence in `output/playwright/fullpage-audit-2026-03-12T17-51-12-174Z`.
- Week 1 closeout disposition: `deferred-with-reason`.
  - Deferred item: expose alias-table lookup in Nhost GraphQL schema (`product_slug_aliases` query path expected by runtime/audit verification).
  - Risk: alias lookup remains partially dependent on SQL rescue paths instead of fully mirrored GraphQL reachability.
  - Re-entry trigger: apply schema exposure fix and re-run `npm run audit:nhost:backup` until `graphqlFailures=0`.
  - Decision closure: this is accepted as a transition constraint, not an open decision; SQL alias rescue remains the approved compensating control until schema exposure is upgraded.

### 2026-03-12 Platform Baseline Verification (Resumed Block)

- The previous handover state is now superseded because active recovery execution resumed in this block.
- Proven-dead preservation check passed for tracked source deletions under `components/`, `data/`, and `lib/`: `deleted_scoped=40`, `missing_in_unused=0`.
- Build verification passed on this state (`npm run build` via Next.js 16.1.6).
- Live parity baseline is now recorded from `npm run audit:nhost:backup`:
  - Supabase: `products=145`, `business_stats_current=1`
  - Nhost SQL: `products=145`, `business_stats_current=1`
  - Canonical parity currently matches on product and business-stats counts.
- Nhost GraphQL live reads are verified for:
  - `products` (ok)
  - `business_stats_current` (ok)
- Internal fallback-source contract is locked as: `supabase | nhost-graphql | nhost-sql | stale-cache | safe-default`.
- Runtime/business-stats source labeling no longer uses collapsed `nhost-backup`; active runtime/test surfaces do not contain the old `nhost-backup` literal.
- Remaining mirror-contract gap noted from parity audit:
  - GraphQL alias-table query (`product_slug_aliases`) is not exposed on `query_root` and must be handled in the mirror verification expansion lane.
- Mirror verification expansion is now implemented in `scripts/sync_nhost_backup.ts`:
  - verifies canonical and legacy row counts and fails sync on mismatch
  - verifies GraphQL reads for product-by-slug and active business stats, plus alias lookup when active alias rows exist
  - verifies SQL reads for product-by-slug and active business stats, plus alias lookup when active alias rows exist
  - fails sync when any required GraphQL or SQL verification read is missing
- Legacy runtime dependency review is complete and classified; no `removable-now` dependency was identified in that pass.

### Pending Decision Items Status

- Resolved: legacy-table dependency classification is locked (`active-required`, `transition-compatible`, `removable-now`).
- Resolved: business-stats fallback source labeling and SQL rescue contract are implemented and verified.
- Resolved: mirror verification expansion is implemented in `scripts/sync_nhost_backup.ts`.
- Resolved: GraphQL alias-table exposure gap is accepted as a transition constraint; execution follow-up remains tracked in `NEXT-PLAN.md` as implementation work, not an open decision.

## Non-Negotiable Decisions

- Supabase is the primary source of truth.
- Nhost becomes a strict Supabase mirror for fallback/runtime continuity.
- Canonical product slugs follow `category-subcategory-name`.
- Deep category and subcategory IDs are first-class identifiers.
- Figma and Mobbin are reference-only inputs.

## Current Supabase/Nhost Relationship

- Supabase is already primary for catalog and business stats.
- Nhost is currently used as a fallback path, but its exposure is mixed between GraphQL and direct SQL fallback.
- Nhost mirror logic in `scripts/sync_nhost_backup.ts` now verifies canonical and legacy row-count parity plus GraphQL/SQL read checks.
- Business-stats fallback is now fixed and implemented as `Supabase -> Nhost GraphQL -> Nhost SQL -> stale cache -> safe default`.

## Whole-Site Recovery Planning Decisions

- Whole-site recovery is now planned as a continuous-work `4-week` target.
- Week 1 now runs under a `fix basics first` sequencing rule and is the active primary frontier for the site-level recovery plan.
- `NEXT-PLAN.md` should always be written as a checklist-driven `72-hour` execution block, not just a short note, so each next step is immediately actionable in a fresh session.
- Active recovery blocks must always be written as detailed operational checklists, not abstract milestone summaries.
- Every future `NEXT-PLAN.md` must include these minimum sections:
  - objective
  - ordered `72-hour` slices
  - detailed checklist items
  - completion markers
  - explicit `Not In This Block` exclusions
  - guardrails
- `72-hour block` defines the time structure; `detailed checklist` defines the execution detail.
- Detailed checklist standard:
  - concrete action checkboxes, not only milestone bullets
  - explicit verification checkboxes
  - explicit doc-update or status checkboxes when recovery docs are part of the block
  - explicit completion markers and one explicit follow-on step
- `Fix basics first` means `missing images + hardcoding`, not a platform-only lane.
- Missing-image basics include both invalid existing image paths and missing primary or gallery coverage.
- Hardcoding basics include scattered metadata, JSON-LD, footer and nav labels, route-copy literals, assistant prompt or content arrays acting as content storage, category or route mapping literals, and fallback stats or other public-facing copy that should be centralized.
- Do not widen the hardcoding lane to design tokens, intentional constants, or low-risk one-off UI text unless the existing overhaul notes already classify them as cleanup targets.
- Week 1 order is now: images first, hardcoding second, validation for both, then Supabase/Nhost platform contract hardening inside the same active phase.
- Critical workstation media planning now sits inside the Week 1 basics-first lane; broader catalog cleanup and app-surface cleanup remain sequenced after the basics-first and platform work.
- `3 weeks` is treated as a best-case compression outcome, not the planning baseline.
- `5 to 6 weeks` remains the contingency range if parity issues, catalog inconsistency, or frontend regressions expand.
- Fallback source labels remain internal-only for now and should stay limited to logs, telemetry, and result typing unless a later product decision explicitly exposes them.
- CI gating for mirror verification is deferred until Week 4 verification and release hardening unless Week 1 uncovers repeated parity drift that justifies earlier enforcement.
- Legacy Nhost-table retirement is not required inside the current `4-week` recovery window; the current requirement is to prepare the retirement path while keeping dual-table compatibility in place.
- Week 3 duplicate-family cleanup may proceed from technical ownership evidence alone except where route ownership or visible UX behavior remains ambiguous, in which case product review is required before execution.
- `HOLDS.md` must be treated as a live review queue for unresolved items only, not a permanent storage area for settled preservation rules or active-owner notes.
- `NEXT-PLAN.md` should carry only the hold work actively queued from the current block, while `DECISIONS.md` and `RECOVERY-CHECKLIST.md` retain the durable outcomes and status.

## Hold Resolution Outcomes

- The hold-resolution pass is complete; `HOLDS.md` no longer carries any live unresolved entry.
- `app/home-unused/page.tsx` remains intentionally protected as a preview route.
- `app/ops/customer-queries/page.tsx` remains intentionally protected as an internal operations route.
- Everything under `app/` remains outside ordinary dead-file cleanup unless route ownership is intentionally reviewed.
- `components/layout/*` is resolved as a legacy shell cleanup candidate because it has no active imports in the live app graph.
- `components/configurator/Configurator.tsx`, `components/configurator/configurator/Configurator.tsx`, `components/configurator/ConfiguratorContext.tsx`, `components/configurator/ConfiguratorPreview.tsx`, and `components/configurator/ConfiguratorSteps.tsx` are resolved as a legacy configurator cleanup candidate set; the live public configurator owner remains `components/configurator/Simple2DConfigurator.tsx`.
- `components/shared/ProcessSection.tsx` is resolved as a legacy duplicate cleanup candidate; the live owner remains `components/home/ProcessSection.tsx`.
- `components/ui/CookieConsent.tsx` is resolved as a legacy duplicate cleanup candidate; the live owner remains `components/site/CookieConsentBar.tsx`.
- `components/bot/AdvancedBot.tsx` is resolved as a legacy bot cleanup candidate; the live runtime path remains `app/layout.tsx -> components/bot/DynamicBotWrapper.tsx -> components/bot/UnifiedAssistant.tsx`.
- `data/site/configurator.ts` is resolved as an inactive-config review candidate because it currently has no live imports and does not own the active public configurator route.
- `data/site/support.ts` is resolved as an inactive-config review candidate because it currently has no live imports and does not own an active support surface.
- `oando_website/*` remains resolved as a separate pre-existing dirty-state investigation lane, not part of the current recovery move wave.

## Architecture Follow-Up Contract

- The platform contract lane remains in scope, but it is no longer the first step in the active Week 1 block.
- The current audit in `docs/product-quality-audit.csv` is the source of truth for the missing-image basics lane.
- The hardcoding summary in `docs/tasks/full-overhaul-plan.md` is the source of truth for the initial hardcoding cleanup lane.

### Week 1 Basics-First Lock

- The missing-image basics lane is now locked to critical/high product-image correctness only, not the full metadata backlog.
- The first missing-image repair set stays explicit: `curvivo`, `deskpro`, `sleek`, `panel-pro`, and `x-bench`.
- `curvivo`, `deskpro`, `sleek`, and `panel-pro` are path-correction work because the canonical asset folders already exist and contain usable image assets.
- `x-bench` remains a catalog-link repair case because the canonical asset folder exists but the product still lacks linked primary and gallery coverage.
- Broader `missing_primary_image` and `missing_gallery_images` backlog outside the first workstation set remains deferred behind the current Week 1 basics-first lock.
- Missing-image validation is fixed as:
  - primary image path resolves to an existing runtime asset
  - gallery coverage includes at least two usable images
  - repaired records stay explicitly classified as `path correction` or `catalog-link repair`

### Week 1 Hardcoding Lock

- The hardcoding basics lane is now locked to content/config literals that should be centralized, not a broad visual-system rewrite.
- The first hardcoding cleanup targets are:
  - metadata and JSON-LD literals
  - footer/nav labels and route-copy literals
  - assistant prompt/content arrays acting as content storage
  - category/route mapping literals
  - fallback stats and other public-facing copy that should move behind typed content/config sources
- The first centralization targets should use the existing typed `data/site/*` surface where possible instead of introducing a second config system.
- The first hardcoding pass explicitly excludes:
  - design tokens and shared visual primitives
  - intentional constants that are not acting as content storage
  - low-risk one-off UI text unless it is already identified in the overhaul notes as repeated or policy-bearing
- Hardcoding validation is fixed as:
  - targeted literals are moved out of runtime components/helpers or explicitly queued as the next extraction target
  - grep-based checks from `docs/tasks/full-overhaul-plan.md` remain the validation baseline for repeated region, CTA, trust/client, assistant-prompt, route-map, and arbitrary visual-formula follow-up
- With both basics-first lanes locked, the next immediate follow-on returns to the platform contract sequence: live parity baseline, fallback-source contract, business-stats SQL rescue design, then mirror verification expansion.

- Runtime catalog reads currently enter through `lib/getProducts.ts` and fall back through `lib/nhostCatalog.ts`.
- `lib/nhostCatalog.ts` currently uses Nhost GraphQL first and direct SQL rescue second; keep that dual-path runtime model explicit instead of implicit.
- Runtime business-stats reads currently enter through `lib/businessStats.ts` and fall back through `lib/nhostBackup.ts`.
- Upgrade the Nhost business-stats path to the same dual-path contract as catalog reads: Nhost GraphQL first, Nhost SQL rescue second.
- Supabase remains the only write authority for catalog and business stats; Nhost remains read-only mirror infrastructure for runtime continuity.
- Keep dual-table compatibility in Nhost during the transition by mirroring both canonical `catalog_*` tables and the legacy table names used by current fallback code.
- Mirror verification must confirm both GraphQL and SQL can read the mirrored data successfully after sync, not merely that row counts match.
- Mirror-model upgrades must carry canonical slug v2 fields plus deep category and subcategory identifiers into Nhost without letting Nhost become a second source of truth.
- Business-stats fallback precedence is now fixed as: Supabase -> Nhost GraphQL -> Nhost SQL -> stale cache -> safe default.
- Stale cache is acceptable only after both live Nhost fallback paths fail and a last known good in-memory value exists.
- Safe defaults are acceptable only after Supabase, Nhost GraphQL, Nhost SQL, and stale cache are all unavailable.

## Current Runtime Touchpoint Inventory

### Catalog Read Path

- `lib/getProducts.ts`
  - `getProducts()`: reads Supabase `products`; on any Supabase error, falls back to `fetchNhostProducts()` and returns normalized Nhost rows
  - `getProductsByCategory(categoryId)`: reads Supabase `products` plus `categories(name)` join; on any Supabase error, falls back to `fetchNhostProducts({ categoryId })`
  - `getProductByUrlKey(productUrlKey)`: reads Supabase `products` by `slug`; on any Supabase error, falls back to `fetchNhostProducts({ productUrlKey })`
  - `getCatalog()`: retries Supabase `categories` and `products` reads, then falls back to Nhost only if both category and product result sets stay empty after failure
  - `getCategoryIds()`: reads Supabase `products.category_id`; on any Supabase error, falls back to Nhost products

### Nhost Catalog Fallback Behavior

- `lib/nhostCatalog.ts`
  - fallback is enabled only when `NHOST_BACKUP_ENABLED === "true"`
  - GraphQL is attempted first whenever endpoint plus credential are available
  - GraphQL tries `products(where: ...)` first and alias lookup through `product_slug_aliases` for slug resolution
  - if GraphQL returns access denial, schema-unavailable errors, network failure, or an empty alias-resolution result, direct SQL rescue is attempted
  - SQL rescue reads legacy Nhost tables `public.products` and `public.product_slug_aliases`
  - both GraphQL and SQL paths normalize into the same `Product` shape before returning

### Business Stats Read Path

- `lib/businessStats.ts`
  - live primary path is Supabase `business_stats_current where is_active = true`
  - on failure it currently calls `fetchNhostBusinessStats(...)`
  - if Nhost returns data, the result source is explicitly `nhost-graphql` or `nhost-sql`
  - if Nhost fails, the code uses `lastKnownGoodStats` as stale cache
  - safe defaults are used only when Supabase, Nhost GraphQL, Nhost SQL, and stale cache all fail

### Nhost Business Stats Fallback Behavior

- `lib/nhostBackup.ts`
  - fallback is enabled only when `NHOST_BACKUP_ENABLED === "true"`
  - implementation is GraphQL-first with SQL rescue
  - if GraphQL endpoint or credential is missing, the path falls back to SQL rescue
  - if GraphQL returns missing/denied/schema-broken/timeout/no-active-row outcomes, SQL rescue is attempted before returning `null`

### Mirror Sync Behavior

- `scripts/sync_nhost_backup.ts`
  - reads authoritative rows from Supabase tables `products`, `categories`, `product_specs`, `product_images`, `product_slug_aliases`, and `business_stats_current`
  - writes both canonical `catalog_*` tables and duplicated legacy table names into Nhost in one transaction
  - verifies canonical and legacy row counts after sync and fails on mismatch
  - verifies GraphQL reads for mirrored product-by-slug and active business stats, and alias lookup when alias rows exist
  - verifies SQL reads for mirrored product-by-slug and active business stats, and alias lookup when alias rows exist
  - fails sync when any required GraphQL or SQL verification read is missing

## Current Catalog Data Quality Snapshot

### Issues By Type

- `missing_alt_text`: 95
- `legacy_slug_format`: 95
- `missing_sustainability_score`: 95
- `missing_documents`: 95
- `missing_subcategory`: 86
- `missing_primary_image`: 42
- `missing_gallery_images`: 42
- `invalid_primary_image_path`: 4
- `invalid_gallery_image_path`: 4

### Products By Category

- `collaborative`: 2
- `educational`: 12
- `soft-seating`: 45
- `storage`: 8
- `tables`: 20
- `workstations`: 8

### First 40 Issue Rows

- `workstations/curvivo`: `invalid_primary_image_path` (critical)
- `workstations/curvivo`: `invalid_gallery_image_path` (high)
- `workstations/curvivo`: `missing_alt_text` (medium)
- `workstations/curvivo`: `legacy_slug_format` (medium)
- `workstations/curvivo`: `missing_sustainability_score` (medium)
- `workstations/curvivo`: `missing_documents` (medium)
- `workstations/adaptable`: `missing_alt_text` (medium)
- `workstations/adaptable`: `legacy_slug_format` (medium)
- `workstations/adaptable`: `missing_sustainability_score` (medium)
- `workstations/adaptable`: `missing_documents` (medium)
- `workstations/deskpro`: `invalid_primary_image_path` (critical)
- `workstations/deskpro`: `invalid_gallery_image_path` (high)
- `workstations/deskpro`: `missing_alt_text` (medium)
- `workstations/deskpro`: `legacy_slug_format` (medium)
- `workstations/deskpro`: `missing_sustainability_score` (medium)
- `workstations/deskpro`: `missing_documents` (medium)
- `workstations/sleek`: `invalid_primary_image_path` (critical)
- `workstations/sleek`: `invalid_gallery_image_path` (high)
- `workstations/sleek`: `missing_alt_text` (medium)
- `workstations/sleek`: `legacy_slug_format` (medium)
- `workstations/sleek`: `missing_sustainability_score` (medium)
- `workstations/sleek`: `missing_documents` (medium)
- `workstations/trio-2`: `missing_alt_text` (medium)
- `workstations/trio-2`: `legacy_slug_format` (medium)
- `workstations/trio-2`: `missing_subcategory` (medium)
- `workstations/trio-2`: `missing_sustainability_score` (medium)
- `workstations/trio-2`: `missing_documents` (medium)
- `workstations/panel-pro`: `invalid_primary_image_path` (critical)
- `workstations/panel-pro`: `invalid_gallery_image_path` (high)
- `workstations/panel-pro`: `missing_alt_text` (medium)
- `workstations/panel-pro`: `legacy_slug_format` (medium)
- `workstations/panel-pro`: `missing_subcategory` (medium)
- `workstations/panel-pro`: `missing_sustainability_score` (medium)
- `workstations/panel-pro`: `missing_documents` (medium)
- `workstations/x-bench`: `missing_primary_image` (critical)
- `workstations/x-bench`: `missing_gallery_images` (high)
- `workstations/x-bench`: `missing_alt_text` (medium)
- `workstations/x-bench`: `legacy_slug_format` (medium)
- `workstations/x-bench`: `missing_subcategory` (medium)
- `workstations/x-bench`: `missing_sustainability_score` (medium)

### Active Workstation Media Queue

- `curvivo`: ready for path correction; audit shows invalid primary/gallery paths, while `public/images/catalog/oando-workstations--curvivo/` exists with 52 files including `image-1.webp` and `image-2.webp`
- `deskpro`: ready for path correction; audit shows invalid primary/gallery paths, while `public/images/catalog/oando-workstations--deskpro/` exists with 68 files including `image-1.webp` and `image-2.webp`
- `sleek`: ready for path correction; audit shows invalid primary/gallery paths, while `public/images/catalog/oando-workstations--sleek/` exists with 55 files including `image-1.webp` and `image-2.webp`
- `panel-pro`: ready for path correction; audit shows invalid primary/gallery paths, while `public/images/catalog/oando-workstations--panel-pro/` exists with 47 files including `image-1.webp` and `image-2.webp`
- `x-bench`: ready for catalog-link repair; audit shows missing primary/gallery coverage, while `public/images/catalog/oando-workstations--x-bench/` exists with 55 files including `image-1.webp` and `image-2.webp`
- Medium issue groups remain deferred until the critical/high workstation media mapping is repaired or explicitly blocked.

## 2026-03-13 Sparse Gallery Backfill And Audit Realignment
- Decision: Treat the broad `/images/afc/*` image backlog as an audit-contract problem first, then repair only the remaining real gallery gaps with repo-backed local assets.
- Why:
  - Runtime already normalizes legacy `/images/afc/*` paths through `lib/assetPaths.ts`, so the first large image backlog was overstating live breakage.
  - `lib/productSpecSchema.ts` was updated to use the same normalization contract as runtime.
  - `scripts/fix-missing-images.ts` was rebuilt into a targeted sparse-gallery backfill tool using verified local asset folders and service-role writes.
  - Ten verified product rows were patched safely: `accent-study`, `classy-executive`, `fluid-task`, `fluid-x`, `cocoon-lounge`, `pedestal-3-drawer`, `cabin-60x30`, `cabin-l-shape`, `conference-8-seater`, and canonical `oando-seating--fluid-x` metadata.
- Impact:
  - `npm run audit:products:quality` dropped from `1262` issue rows to `182`.
  - Remaining image-critical backlog is now one product only: `oando-soft-seating--luna` still has `missing_primary_image` and `missing_gallery_images`.
  - Canonical `oando-seating--fluid-x` no longer carries the earlier missing-warranty issue after metadata repair.
  - The remaining high-signal catalog backlog is now:
    - `missing_documents=145`
    - `suspicious_text_encoding=24`
    - `legacy_slug_format=11`
    - `missing_primary_image=1`
    - `missing_gallery_images=1`
  - `Luna` remains explicitly deferred because no trustworthy local image source has been proven inside the repo.
  - `npm run build` still passes after the audit and sparse-gallery changes.

## 2026-03-13 Slug Audit Repair And Text-Encoding Cleanup
- Decision: Repair slug redirect coverage directly in `product_slug_aliases`, then clear the remaining mojibake-bearing seating specs at the source data layer.
- Why:
  - `audit:slug-id` still reported missing alias coverage for two known duplicate groups even though the conflict pattern was already documented in the repo's own slug plan.
  - The remaining `suspicious_text_encoding` audit lane reduced to one repeated bad material token in seating specs (`U+FFFD50mm casters`).
- Impact:
  - Added canonical redirect aliases:
    - `seating-mesh-fluid-x -> oando-seating--fluid-x`
    - `storages-prelam-prelam -> oando-storage--prelam-storage`
  - Updated `scripts/audit_slug_id_integrity.ts` so alias coverage is counted once per canonical target instead of once per duplicate legacy row.
  - `npm run audit:slug-id` now reports `aliasCoverageMissing=0 canonicalConflicts=2`.
  - Repaired 24 seating `specs.materials` rows carrying the replacement-character token.
  - `npm run audit:products:quality` now reports:
    - `issueRows=158`
    - `missing_documents=145`
    - `legacy_slug_format=11`
    - `missing_primary_image=1`
    - `missing_gallery_images=1`
  - `suspicious_text_encoding` is fully cleared from the current audit summary.
  - `npm run build` still passes after both slug and text-cleanup changes.

## 2026-03-13 Legacy Slug Exception And Document-Lane Truth
- Decision: Treat `fluid-x` as the only remaining intentional `legacy_slug_format` exception for now, keep `Luna` deferred as the lone unresolved media blocker, and reclassify `missing_documents` as a source-gap backlog instead of a repair-ready lane.
- Why:
  - `docs/audit/product-quality-audit.json` now shows `legacy_slug_format=1`, and the only remaining row is `Fluid X` with slug `fluid-x`.
  - `fluid-x` is still part of the known duplicate/canonical-conflict group with `oando-seating--fluid-x`, so forcing a slug migration now would collapse a still-active conflict instead of resolving it cleanly.
  - `oando-soft-seating--luna` still has no trustworthy repo-backed local image source in `public/`, `docs/`, or `unused/`, so the media gap remains real and intentionally deferred.
  - The live `products` table has no `documents` column, and the quality audit currently injects `documents: []` for every product.
  - A full scan of `metadata`, `specs`, and `variants` across live product rows found no document-like keys or values (`brochure`, `pdf`, `spec sheet`, `download`, `documents`), so there is no local data source to backfill from.
- Impact:
  - `npm run audit:products:quality` remains at:
    - `issueRows=148`
    - `missing_documents=145`
    - `legacy_slug_format=1`
    - `missing_primary_image=1`
    - `missing_gallery_images=1`
  - The remaining `legacy_slug_format` lane is now bounded to one explicitly accepted exception: `fluid-x`.
  - The remaining media-critical lane is still bounded to one explicitly deferred product: `oando-soft-seating--luna`.
  - `missing_documents=145` should no longer be treated as an easy repair queue; it is a repo-truth content gap until a real document field, asset source, or content ingestion path is introduced.
  - The next active execution lane is to inventory and document this source-gap backlog cleanly, not to fabricate document links.
  - The audit path itself is now future-proofed:
    - `lib/productSpecSchema.ts` now extracts document candidates from `documents`, `technicalDrawings`, and document-like keys inside `metadata`, `specs`, and `variants`
    - `scripts/audit-product-quality.ts` no longer hardcodes an empty document array; it now uses the shared extraction helper
  - Verification after the audit-path cleanup remains stable:
    - `npm run audit:products:quality`: unchanged at `missing_documents=145`, `legacy_slug_format=1`, `missing_primary_image=1`, `missing_gallery_images=1`
    - `npm run build`: pass
  - Route/content reality now matters more than the audit count:
    - `/downloads` and `data/site/routeCopy.ts` already promise "product catalogs", "technical sheets", and "Request documents"
    - `public/` still contains zero `.pdf`, `.doc`, or `.docx` assets
    - this backlog is therefore a real content-product gap, not just a data-field gap

## 2026-03-13 Downloads Page Truth Alignment
- Decision: Reframe `/downloads` as a request-based resource desk instead of a direct-download library until real document assets or mappings exist.
- Why:
  - The repo has no public PDF/doc asset inventory and no product-level document field.
  - The previous downloads copy implied immediate downloadable resources even though the current system can only route requests through contact and planning flows.
  - A world-class site should be explicit about what is available now instead of hiding content gaps behind generic download language.
- Impact:
  - `data/site/routeCopy.ts` now positions the surface as a documentation-request desk with explicit routing, process, and scope.
  - `app/downloads/page.tsx` now explains how requests are handled, what resource types can be requested, and which contact paths are available.
  - The page now uses request-driven CTAs for contact, email, and WhatsApp instead of reading like a dead asset library.
  - `data/site/navigation.ts` now labels `/downloads` as `Resource Desk` in support navigation so route naming matches the actual experience.
  - `npm run build`: pass after the downloads-page and navigation updates.
  - Planning and contact surfaces now acknowledge the Resource Desk explicitly:
    - `app/planning/page.tsx` includes a direct `Open Resource Desk` CTA
    - `app/contact/page.tsx` routes documentation-first users toward the Resource Desk before form submission
  - `npm run build`: still passes after the planning/contact alignment.

## 2026-03-13 Missing Documents Audit Policy Lock
- Decision: Keep `missing_documents` in the product-quality audit as an active policy requirement instead of downgrading it to a hidden backlog.
- Why:
  - The site now explicitly positions `/downloads` as a request-based documentation desk rather than removing the documentation promise.
  - World-class product and planning experiences still require category packs, technical sheets, and model-level support documents where available.
  - Removing the audit signal would hide a real commercial and UX gap rather than solving it.
- Impact:
  - `missing_documents=145` remains visible in `npm run audit:products:quality`.
  - The gap is now interpreted as a controlled content-ingestion lane, not a parser defect and not a silent defer.
  - The future ingestion plan is:
    - add a real product-level document source
    - map product/category resources explicitly
    - keep `/downloads` request-driven until actual assets or links exist
  - This closes the current source-gap triage block and allows the next active lane to move into broader world-class frontend improvement work.

### 2026-03-12

- Use `codex-recovery/` as the recovery control center.
- Keep one master objective, one roadmap, and one active checklist.
- Preserve backups instead of deleting during recovery cleanup.
- Archive duplicate root asset folders instead of deleting them.
- Move only proven dead source files into `unused/`.
- Leave preview/internal and duplicate-but-reachable files in place for now.
- Generate a recovery snapshot every 45 minutes during active work.
- Do not delete any file during recovery unless explicitly requested later.
- Treat `archive/duplicate-assets/root-assets/` as the canonical destination for root-level duplicate asset folders.
- Treat `unused/` as a preservation area for proven-dead source only, never as a dump folder for uncertain files.
- Keep everything under `app/` out of automatic dead-file moves.
- Keep duplicate component families in place unless they are proven dead and non-reachable.

### 2026-03-12 Repo Truth

- Root duplicate asset folders `ClientLogos`, `ClientPhotos`, and `Showroom` were preserved by moving them into `archive/duplicate-assets/root-assets/`.
- Public runtime copies already exist under `public/ClientLogos`, `public/ClientPhotos`, and `public/Showroom`.
- The repo contains preview/internal surfaces such as `app/home-unused/page.tsx`; these are not dead code.
- The repo contains duplicate-but-reachable clusters in `components/layout/*`, `components/site/*`, and configurator variants.
- The current proven-dead move set is restricted to zero-import files that are not route-owned and not on the protected hold list.
- `unused/` is now excluded from the TypeScript compile scope via `tsconfig.json`, so archived proven-dead files can stay preserved without blocking `npm run build`.
- Build verification on 2026-03-12 succeeded after excluding `unused/`, so the current blocker moved from build-boundary isolation to the remaining discovery and worktree-separation tasks.
- The current recovery move wave accounts for 42 archived source files under `unused/`; the remaining 52 deletions under `oando_website/*` are being treated as older separate dirty state until proven otherwise.
- Current verification on 2026-03-12 confirms all 40 tracked source deletions under `components/`, `data/`, and `lib/` are present under `unused/`; none of those tracked moved-source paths are missing from the preservation area.
- `unused/` also contains `components/home/ProductClientBlocks.tsx` and `lib/backup/catalog.ts`, whose active-tree originals are already absent and therefore do not appear in the current tracked deletion list; keep them preserved in place until a later provenance review.
- Current verification on 2026-03-12 confirms `npm run build` still passes on the present workspace state.
- Root inventory classification on 2026-03-12: source folders are `app`, `components`, `data`, `docs`, `hooks`, `lib`, `public`, `scripts`, `supabase`, `tests`; tool/artifact folders are `.next`, `.playwright-cli`, `output`, `reports`, `tmp`; preservation/control folders are `archive`, `codex-recovery`, `unused`; local-tool-state folders are `.vercel`, `.vscode`; standard root manifests/configs remain in place.
- `docs/ops/artifacts/` is a preserved documentation-artifact area. Current contents are zip bundles (`generated-artifacts-20260307-1447.zip`, `generated-artifacts-20260307.zip`), so it should be treated as historical ops output rather than active source.
- `docs/ops/charts/` is a preserved ops-planning area. Current contents include mapping HTML files, `supabase-flowcharts.xlsx`, `supabase-redo-flowchart.md`, and static chart assets under `docs/ops/charts/industry-charts/`; treat these as operational references, not active app source.
- `docs/ops/plans/` is a preserved ops-planning area. Current contents include slug alias plan JSON/MD/SQL files and `slug-policy-with-e.md`; treat these as operational planning references, not active app source.
- `docs/ops/plans/slug-policy-with-e.md` reflects an older canonical format (`{brand}-{category}-{model}`) and should not override the current non-negotiable slug decision (`category-subcategory-name`).
- Route truth snapshot on 2026-03-12:
  - Public pages: `/`, `/about`, `/career`, `/compare`, `/configurator`, `/contact`, `/downloads`, `/gallery`, `/planning`, `/portfolio`, `/privacy`, `/products`, `/products/[category]`, `/products/[category]/[product]`, `/projects`, `/quote-cart`, `/refund-and-return-policy`, `/service`, `/showrooms`, `/social`, `/solutions`, `/solutions/[category]`, `/sustainability`, `/terms`, `/tracking`, `/trusted-by`
  - Preview routes: `/home-unused`
  - Internal routes: `/ops/customer-queries`, `/api/*`
  - Redirect/alias routes: `/brochure`, `/catalog`, `/download-brochure`, `/products/oando-chairs`, `/products/oando-chairs/[product]`, `/products/oando-other-seating`, `/products/oando-other-seating/[product]`, `/workstations/configurator`
  - Uncertain routes: `/imprint`, `/news`, `/support-ivr`
- Duplicate-system review snapshot on 2026-03-12:
  - Live shell owner: `components/site/Header.tsx`, `components/site/Footer.tsx`, `components/site/MobileNavDrawer.tsx`, and `components/site/CookieConsentBar.tsx` are the active shell family used by `app/layout.tsx`
  - Legacy shell hold: `components/layout/*` currently has no active imports in the live app graph and should be treated as a held duplicate family until a separate cleanup pass decides whether to archive or remove it
  - Live configurator owner: `components/configurator/Simple2DConfigurator.tsx` is the active configurator surface used by `app/configurator/page.tsx`
  - Legacy configurator hold: `components/configurator/Configurator.tsx`, `components/configurator/configurator/Configurator.tsx`, and the related preview/step/context files form an older configurator family not used by the current public route and should remain held for now
  - Live process-section owner: `components/home/ProcessSection.tsx` owns the current home process block; `components/shared/ProcessSection.tsx` is an older duplicate variant and remains a hold
  - Live cookie owner: `components/site/CookieConsentBar.tsx` owns the current cookie experience; `components/ui/CookieConsent.tsx` is a legacy duplicate and remains a hold
  - Live bot owner: `app/layout.tsx` loads `components/bot/DynamicBotWrapper.tsx`, which dynamically loads `components/bot/UnifiedAssistant.tsx`; `components/bot/AdvancedBot.tsx` is not part of the active shell path and remains a hold
- Remaining uncertain-route decision on 2026-03-12:
  - `/imprint`, `/news`, and `/support-ivr` remain classified as uncertain because they are routable pages but currently lack main-nav ownership, footer-nav ownership, and sitemap inclusion; they should not be removed or reclassified without a later product/content decision
- Phase 1 recovery summary on 2026-03-12:
  - Root clutter was materially reduced by clearing runtime logs and archiving duplicate root asset folders
  - Duplicate root assets were preserved under `archive/duplicate-assets/root-assets/`
  - The initial proven-unused inventory was completed conservatively, with dynamic imports, routes, preview pages, and duplicate families protected
  - `unused/` currently contains the 42-file proven-dead move wave and is excluded from the TypeScript compile scope so build verification can pass
  - Preview/internal routes and duplicate-but-reachable families were preserved in place
  - `npm run build` passes after isolating `unused/` from the compile scope

## Decision Template

```md
## YYYY-MM-DD
- Decision:
- Why:
- Impact:
```
