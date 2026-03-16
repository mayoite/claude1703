# World-Class Site Standard Plan With Locked Rules

## Summary

This plan is for the current local repo only. It is a full rebuild-standard plan intended to produce a world-class site and codebase.

The local repo and the recovery docs are the only technical source of truth. Benchmark sites define the quality bar only. Dormant local assets in `unused/` are part of the salvage pool and must be reviewed for reintegration where they materially improve the live product.

The target standard is to outperform `hni.com`, `hermanmiller.com`, and `hon.com` in:
- product discovery
- configurator usefulness
- mobile usability
- product storytelling
- trust and conversion flow
- clarity of information hierarchy
- architectural cleanliness
- overall polish

## Recovery Control Rule

This file is now the main recovery plan.

The active working set is:

- `WORLD-CLASS-PLAN.md`
  long-form recovery standard, phase map, structure rules, and locked execution rules
- `NEXT-PLAN.md`
  single active implementation block
- `RECOVERY-CHECKLIST.md`
  active done/not-done status
- `DECISIONS.md`
  locked cross-session decisions
- `RECOVERY-CHAT-FLOW.txt`
  handoff and new-chat procedure

The older split planning files were redundant and must not override this file.
Everything else in `codex-recovery/` is either generated state, handover mirrors, or preserved reference.

## Current Active Lane

- The catalog-truth/source-gap block is closed.
- The completed trust/legal/proof lane is closed and recorded.
- The completed utility and support-routing lanes are closed and recorded.
- The completed homepage-and-discovery lane on `/` and `/products` is closed and recorded.
- The completed category-discovery lane on `/products/[category]` is closed and recorded.
- The completed product-detail lane on `/products/[category]/[product]` is closed and recorded.
- The bounded configurator-usefulness lane on `/configurator` is closed and recorded.
- The bounded homepage truth-and-simplification pass is closed and recorded.
- The bounded homepage layout and closing-flow recovery lane is implemented and verified.
- The homepage route block is now closed after visual QA.
- The compare/quote-cart continuity lane is implemented and verified.
- The bounded quote/contact flow hardening lane is implemented and verified.
- The bounded SEO and structured-data ownership lane is implemented and verified.
- The bounded footer and global contact-surface hardening lane is implemented and verified.
- The bounded trust-sensitive copy and alt-text hardening lane is implemented and verification-closed.
- The bounded automated verification hardening lane is implemented and verification-closed.
- The bounded deployment and environment hardening lane is verification-closed.
- The bounded Phase 10 live experience verification and release-hardening lane is verification-closed.
- The active execution frontier is now Phase 4 design-system/token and visual-consistency unification.
- The detailed archive recovery plan is explicitly deferred to the late-stage archive slot after core live-route work is stable.
- This lane must keep `missing_documents` visible as a real content-ingestion requirement and keep `oando-soft-seating--luna` explicitly deferred unless repo-backed media evidence appears.

## Current Progress Snapshot

Completed in the current frontend lane:
- `/`
- `/products`
- `/products/[category]`
- `/products/[category]/[product]`
- `/configurator`
- `/trusted-by`
- `/planning`
- `/contact`
- `/solutions`
- `/service`
- `/privacy`
- `/terms`
- `/imprint`
- `/refund-and-return-policy`
- `/projects`
- `/portfolio`
- `/gallery`
- `/showrooms`
- `/about`
- `/sustainability`
- `/career`
- `/social`
- `/news`
- `/tracking`
- `/support-ivr`

Current next step:
- begin Phase 4 token/primitives unification for cross-route desktop/mobile visual consistency

## Locked Rules

### Source Of Truth Rules
- The current local repo is the only implementation source of truth.
- `codex-recovery/*` is the planning and sequencing source of truth.
- External repos and sites are not technical references.
- No external code may be inspected, copied, cited, or used for architecture decisions.
- External benchmarks are quality targets only.

### Recovery Rules
- Do not delete uncertain files.
- Do not move route files without proof.
- Do not treat preview or internal routes as dead code.
- `unused/` is a salvage pool, not a trash folder.
- Dormant local files must be classified before reintegration.
- Archive or preserve before destructive cleanup.
- Structural changes must remain reversible until verified.

### Product Rules
- Supabase remains primary.
- Nhost remains mirror/fallback only.
- Catalog truth must be explicit.
- Alias resolution must work through the intended fallback model.
- Slug and identity behavior must be consistent across runtime and audits.
- Product media must be verified against real assets.

### Quality Rules
- The current site baseline is not good enough.
- The benchmark sites are the competitive bar, not the implementation model.
- The result must feel world-class, not merely cleaner.
- Configurator and 3D must be useful, not decorative.
- Mobile quality must be first-class.
- Accessibility and readability are mandatory, not optional polish.

### Execution Rules
- Work nonstop through the sequence without waiting for human intervention.
- Do not stop at partial cleanup when the broader product standard remains low.
- Keep one active frontier at a time.
- `NEXT-PLAN.md` must cover only the single active execution frontier and stay at or under 17.5% of the size of this file.
- End every phase with verification before proceeding.
- Do not mix deep structural cleanup and deep visual redesign in one uncontrolled wave.
- Mark completed checklist items and status changes every 10 minutes during active work, even if progress in that window is small.
- Update `WORLD-CLASS-PLAN.md` and the active recovery checklist every 10 minutes even if there is no material progress.
- Terminate any script or command that runs longer than 3 minutes.
- Prefer smaller verification slices over long opaque runs.

## Repo Structure Rules

- Live app code belongs in `app/`, `components/`, `data/`, `hooks/`, `lib/`, and `public/`.
- User-facing structured content should move toward `data/site/*`.
- Platform and data-provider work belongs in `scripts/`, `supabase/`, and integration helpers under `lib/`.
- `codex-recovery/` is the recovery control surface.
- `archive/` is preserved history, not active runtime.
- `unused/` is a salvage pool only, not a trash folder.
- Generated artifacts belong in explicit artifact folders, not loose in root.

## Snapshot And Handover Rules

- Keep `latest.md` aligned with the newest recovery snapshot.
- Generate recovery snapshots during active work and after material state changes.
- Generate a handover package before changing chats.
- Handover `CURRENT-*` files are mirrors for resume speed only.

## Master Sequence

The work must happen in this order:

1. platform truth and runtime safety
2. catalog correctness and content integrity
3. ownership resolution and dormant local salvage
4. world-class design system
5. homepage and brand narrative
6. category discovery, compare, and filtering
7. product detail excellence
8. premium configurator and 3D system
9. trust, SEO, and conversion layer
10. accessibility, QA, and release hardening

## Phase 1: Platform Truth And Runtime Safety

### Objective
Remove all high-risk ambiguity from data ownership and runtime behavior.

### Rules Active In This Phase
- Supabase is primary.
- Nhost is fallback/mirror only.
- No fallback ambiguity is acceptable.
- No external implementation pattern is relevant here.
- Build stability is mandatory before continuing.

### Checklist
- [x] Confirm catalog runtime ownership in active code
- [x] Confirm business-stats runtime ownership in active code
- [x] Lock fallback contract as `supabase -> nhost-graphql -> nhost-sql -> stale-cache -> safe-default`
- [x] Fix Nhost GraphQL alias-table exposure
- [x] Keep SQL rescue intact until GraphQL alias lookup is verified
- [x] Re-run `npm run audit:nhost:backup` until `graphqlFailures=0`
- [x] Confirm mirror verification still covers canonical and legacy table parity
- [x] Re-run `npm run build`
- [ ] Re-run tests covering stats and fallback paths
- [x] Update recovery truth so platform behavior is no longer ambiguous

### Exit Criteria
- [x] Build passes
- [x] Alias lookup works in the intended GraphQL path
- [x] Runtime and audits agree on platform truth

## Phase 2: Catalog Correctness And Content Integrity

### Objective
Make the catalog trustworthy for users, search, filtering, and downstream UX.

### Rules Active In This Phase
- Product truth must come from local runtime and data rules only.
- Product media must be validated against real local assets.
- Critical failures are fixed before medium metadata work.
- No catalog repair is accepted without audit verification.

### Checklist
- [x] Validate canonical slug behavior in runtime
- [x] Validate alias behavior for legacy slugs
- [x] Confirm deep category and subcategory IDs are correct and consistently used
- [ ] Repair the critical workstation media lane first
- [ ] Validate primary images against actual public assets
- [ ] Validate gallery image coverage against actual public assets
- [x] Fix stale audit-tool imports if they block verification
- [x] Re-run `npm run audit:supabase:catalog`
- [x] Re-run `npm run audit:slug-id`
- [x] Re-run `npm run audit:products:quality`
- [ ] Re-check product routes for media, alias, and breadcrumb correctness

### Exit Criteria
- [ ] Critical media failures are cleared in the first priority lane
- [ ] Slug and alias behavior is stable
- [ ] Catalog audits are current and trustworthy

## Phase 3: Ownership Resolution And Dormant Local Salvage

### Objective
Resolve the live architecture and recover the best dormant local work.

### Rules Active In This Phase
- `unused/` is a salvage pool.
- No dormant file is revived automatically.
- No duplicate family is removed or restored without classification.
- Preview/internal routes remain protected.
- Local dormant assets may be reused only when they improve the live architecture.

### Checklist

#### Ownership
- [x] Confirm active shell ownership
- [x] Confirm active product listing ownership
- [x] Confirm active product detail ownership
- [x] Confirm active configurator ownership
- [x] Confirm active bot ownership
- [x] Confirm active trust/project/gallery ownership
- [x] Confirm route ownership under `app/`

#### Dormant Salvage Review
- [x] Review `unused/components/3DViewer.tsx`
- [x] Review `unused/components/product/ParallaxGallery.tsx`
- [x] Review `unused/components/configurator/ConfiguratorLayout.tsx`
- [x] Review `unused/components/configurator/ConfiguratorCSS.tsx`
- [x] Review `unused/components/configurator/productMapping.ts`
- [x] Review `unused/components/seo/JsonLd.tsx`
- [x] Review `unused/lib/productSpecSchema.ts`
- [x] Review `unused/lib/products.ts`
- [x] Review `unused/lib/trustedBy.ts`

#### Classification
- [x] mark each candidate `recover-now`
- [x] mark each candidate `recover-later`
- [x] mark each candidate `reference-only`
- [x] mark each candidate `archive-only`

#### Integration Decision Rules
- [x] improves live UX materially
- [x] fits current data contracts
- [x] does not revive abandoned architecture
- [x] lowers implementation cost without lowering quality
- [x] supports a world-class end state

### Exit Criteria
- [x] Active ownership is explicit
- [x] Dormant local strengths are identified
- [x] Weak legacy systems are not accidentally revived

### Current Ownership Notes

- Active shell owner:
  - `app/layout.tsx` -> `components/site/Header.tsx`, `components/site/Footer.tsx`, `components/site/CookieConsentBar.tsx`, `components/bot/DynamicBotWrapper.tsx`
- Active product listing owner:
  - `app/products/page.tsx` -> `components/home/CategoryGrid.tsx`
  - `app/products/[category]/page.tsx` -> local `FilterGrid.tsx`
  - data source: `lib/getProducts.ts`
- Active product detail owner:
  - `app/products/[category]/[product]/page.tsx` -> local `ProductViewer.tsx`
  - resolution/data path: `lib/productSlugResolver.ts`, `lib/getProducts.ts`, `lib/productDataTables.ts`
- Active configurator owner:
  - `app/configurator/page.tsx` -> `components/configurator/Simple2DConfigurator.tsx`
- Active bot owner:
  - `app/layout.tsx` -> `components/bot/DynamicBotWrapper.tsx` -> `components/bot/UnifiedAssistant.tsx`
- Active trust/project/gallery owner:
  - trust: `app/trusted-by/page.tsx`, `components/home/WhyChooseUs.tsx`, `components/ClientBadge.tsx`, `data/site/proof.ts`
  - projects/proof: `app/projects/page.tsx`, `app/portfolio/page.tsx`, `app/gallery/page.tsx`, `app/showrooms/page.tsx`

### Dormant Salvage Classification Snapshot

- `unused/components/3DViewer.tsx`
  - classification: `recover-later`
  - reason: potentially useful for Phase 8, but not safe to revive before a deliberate 3D plan and performance/fallback review
- `unused/components/product/ParallaxGallery.tsx`
  - classification: `recover-later`
  - reason: visually useful for Phase 7, but only after PDP hierarchy and motion rules are intentionally redesigned
- `unused/components/configurator/ConfiguratorLayout.tsx`
  - classification: `archive-only`
  - reason: depends on older configurator structure and would revive abandoned architecture instead of extending the active `Simple2DConfigurator`
- `unused/components/configurator/ConfiguratorCSS.tsx`
  - classification: `reference-only`
  - reason: contains exploratory interaction ideas, but the component itself does not fit the active configurator contract
- `unused/components/configurator/productMapping.ts`
  - classification: `archive-only`
  - reason: hardcoded legacy product mapping tied to old configurator state and stale product paths
- `unused/components/seo/JsonLd.tsx`
  - classification: `reference-only`
  - reason: active SEO ownership already lives in `data/site/seo.ts` and route-level JSON-LD
- `unused/lib/productSpecSchema.ts`
  - classification: `archive-only`
  - reason: the helper was already selectively recovered into the live `lib/productSpecSchema.ts`
- `unused/lib/products.ts`
  - classification: `archive-only`
  - reason: stale static product inventory conflicts with the live Supabase-backed catalog contract
- `unused/lib/trustedBy.ts`
  - classification: `reference-only`
  - reason: current trust/proof ownership already lives in `data/site/proof.ts`

## Phase 4: World-Class Design System

### Objective
Build one premium, differentiated, production-grade visual system.

### Rules Active In This Phase
- The site must exceed the current baseline materially.
- Benchmark sites define the quality bar only.
- The design must be premium and distinct, not generic.
- Tokenization must improve consistency, not create a second styling system.
- Mobile quality is equal priority to desktop quality.

### Checklist

#### System Foundation
- [ ] unify color, type, spacing, surface, control, and motion tokens
- [ ] normalize buttons, cards, panels, nav, footer, hero, and section primitives
- [ ] replace repeated hardcoded visual values with shared tokens
- [ ] define clear component-state behavior for hover, focus, active, disabled

#### Typography
- [ ] define world-class display type
- [ ] define strong section-title system
- [ ] improve body readability and line length
- [ ] standardize metadata, label, and stat typography
- [ ] ensure type scales correctly across breakpoints

#### Layout Rhythm
- [ ] standardize section spacing
- [ ] standardize content widths
- [ ] standardize card and panel densities
- [ ] remove uneven vertical pacing
- [ ] improve scanability and calmness of dense pages

#### Motion
- [ ] keep motion purposeful
- [ ] support reduced-motion
- [ ] avoid ornamental over-animation
- [ ] use motion to aid orientation and polish

#### Responsive Quality
- [ ] audit home on desktop and mobile
- [ ] audit category pages on desktop and mobile
- [ ] audit product pages on desktop and mobile
- [ ] audit configurator on desktop and mobile
- [ ] audit trust/contact/projects on desktop and mobile

### Exit Criteria
- [ ] one cohesive visual system exists
- [ ] key routes feel premium and consistent
- [ ] mobile and desktop both meet world-class quality

## Phase 5: Homepage And Brand Narrative

### Objective
Turn the homepage into a benchmark-beating first impression.

### Rules Active In This Phase
- The homepage must communicate value faster than benchmark competitors.
- It must guide users into products, planning, and trust content clearly.
- It must not feel like a stitched marketing template.

### Checklist
- [ ] redesign hero for immediate clarity and premium impact
- [ ] strengthen brand narrative and proof sequencing
- [ ] improve category discovery blocks
- [ ] improve trust strips and proof metrics
- [ ] improve projects/partnership storytelling
- [ ] improve contact teaser and CTA hierarchy
- [ ] remove repetitive or low-signal section patterns
- [ ] make the page feel deliberate from hero to footer

### Exit Criteria
- [ ] homepage explains value faster
- [ ] homepage supports discovery and conversion
- [ ] homepage is benchmark-competitive or better

## Phase 6: Category Discovery, Filters, And Compare

### Objective
Make catalog browsing materially better than typical furniture-industry experiences.

### Rules Active In This Phase
- Discovery must be faster and clearer than the benchmark set.
- Filters must be low-friction, especially on mobile.
- Compare must be useful, not ornamental.

### Checklist
- [ ] improve category landing page hierarchy
- [ ] improve filter grouping and clarity
- [ ] improve reset and active-filter visibility
- [ ] improve product-card scanability
- [ ] improve compare entry and persistence behavior
- [ ] improve breadcrumb and return-to-results continuity
- [ ] improve empty-state and low-result experiences
- [ ] ensure category pages feel curated rather than raw query output

### Exit Criteria
- [ ] category discovery is faster and clearer
- [ ] filters are excellent on mobile and desktop
- [ ] compare flow is meaningfully useful

## Phase 7: Product Detail Excellence

### Objective
Make product pages decision-driving and premium.

### Rules Active In This Phase
- Product pages must help users decide faster than benchmark pages.
- Product media must be polished and stable.
- Technical detail must be readable, not buried.
- CTA and trust surfaces must support conversion without clutter.

### Checklist
- [x] redesign product-detail hierarchy for faster comprehension
- [x] improve hero media and gallery behavior
- [ ] evaluate local dormant gallery/parallax ideas for selective reintegration
- [x] improve spec readability and technical detail hierarchy
- [x] improve CTA placement and quote intent flow
- [ ] improve adjacent discovery and related-product logic
- [x] improve trust, quality, and practical buying signals
- [x] ensure 3D/model integration is clean where available
- [x] ensure fallback media behavior is graceful

### Exit Criteria
- [x] product pages support confident decisions
- [x] product media is stable and premium
- [x] product pages materially exceed current baseline

## Phase 8: Premium Configurator And 3D System

### Objective
Build a superior planning tool that becomes a flagship capability.

### Rules Active In This Phase
- Configurator usefulness matters more than visual novelty.
- 3D must add decision value.
- 3D must never block core usability.
- Mobile configurator quality is mandatory.
- Dormant local configurator and 3D assets may be recovered only if they improve the live system.

### Checklist

#### Experience Definition
- [x] define entry path
- [x] define guided workflow
- [x] define planning logic
- [x] define summary output
- [x] define quote handoff
- [ ] define optional compare/save/share behavior if useful

#### Current-System Audit
- [x] audit live configurator pages
- [x] audit live configurator components
- [x] audit current mapping/state model
- [x] review dormant configurator and 3D salvage candidates

#### 2D Planning
- [x] improve speed of layout configuration
- [x] improve clarity of dimensions and seating choices
- [x] improve summary and selection feedback
- [x] improve mobile planning ergonomics

#### 3D Layer
- [x] decide where 3D is genuinely valuable
- [ ] selectively recover local 3D capabilities if they fit
- [ ] establish explicit asset mapping
- [ ] define fallback behavior for missing/heavy models
- [ ] ensure performance remains production-safe

#### Output Layer
- [x] improve quote handoff from configuration
- [x] improve summary clarity
- [ ] improve compare handoff where relevant
- [x] make the configurator feel like a serious planning tool

### Exit Criteria
- [x] configurator is premium and useful
- [ ] 3D adds real value
- [x] tool works well on mobile and desktop
- [ ] performance and fallback behavior are stable

## Late-Stage Archive Recovery And Selective Reintegration

### Objective
Use `/home-unused` and the preserved `unused/` pool to recover only the strongest dormant local work after the core live-route lanes are stable.

### Position In Sequence
- This lane is intentionally deferred until the project is roughly 80% through the core live-route execution path.
- It should run after the main configurator/global-conversion work is stable and before final release hardening decides what truly belongs in the live app.
- It is not the active frontier while primary live-route polish is still moving.

### Rules Active In This Phase
- `/home-unused` is the decision surface for archive review; do not reintroduce dormant code blindly.
- Recover patterns, not abandoned architecture.
- Structural shell ideas may return even if the original component tree does not.
- Every reintegration must point to a concrete live route and a concrete user-value gain.
- Archive review must stay non-destructive until final hardening.

### Detailed Checklist

#### Review Surface
- [x] build `/home-unused` into a usable archive review route
- [x] mount the strongest renderable archive modules with current repo assets
- [x] add verdict tags, filters, search, and live-comparison links to `/home-unused`
- [x] keep archive review evidence current enough to support later reintegration decisions

#### Highest-Value Candidates
- [ ] decide whether the archived configurator shell ideas should return as another bounded live configurator improvement wave
- [ ] decide whether the legacy advisor interaction loop should be selectively folded into the live assistant system
- [ ] decide whether the archived `ThreeDViewer` should become a real PDP/media fallback using local `public/models/task4a/*` assets
- [ ] decide whether the archived `ParallaxGallery` should become a selective premium PDP motion upgrade
- [ ] decide whether archived `Accordion` and `Tabs` wrappers deserve a real shared primitive role

#### Reintegration Rules
- [ ] only reintroduce a candidate when the live route and data contract are already stable
- [ ] extract only the useful interaction or shell pattern when the original component ownership is obsolete
- [ ] keep stale hardcoded pricing, dead mappings, and abandoned context ownership out of runtime
- [ ] re-run route-level verification after every reintegration wave
- [ ] record each chosen outcome in `DECISIONS.md` and `RECOVERY-CHECKLIST.md`

### Exit Criteria
- [ ] every top archive candidate is classified as `recover-now-late`, `mine-selectively`, `reference-only`, or `archive-only`
- [ ] no abandoned architecture is revived accidentally
- [ ] `/home-unused` remains an accurate evidence surface for final handoff
- [ ] any late-stage reintegration is verified against a concrete live route

## Phase 9: Trust, SEO, And Conversion Layer

### Objective
Make the site authoritative, credible, and conversion-competent.

### Rules Active In This Phase
- Trust signals must be intentional and visible.
- Metadata ownership must be consistent.
- Conversion flows must be easier and more confidence-building than current state.
- Structured content must live in the local content system, not scattered literals.

### Checklist
- [x] centralize metadata, route copy, and trust content into local typed data modules
- [ ] normalize route-level SEO ownership
- [ ] normalize structured-data ownership
- [x] improve trusted-by, projects, contact, and product trust surfaces
- [x] improve CTA hierarchy and quote/contact flow
- [x] improve business identity and proof presentation
- [x] improve alt text and trust-sensitive copy quality
- [x] ensure footer and global contact surfaces support conversion clearly

### Exit Criteria
- [ ] metadata ownership is clean
- [x] trust surfaces feel deliberate and credible
- [x] conversion paths are stronger and clearer

## Phase 10: Accessibility, QA, And Release Hardening

### Objective
Finish with a site that is premium and verifiably robust.

### Rules Active In This Phase
- Accessibility is not optional polish.
- No release state is acceptable with unresolved critical navigation or runtime ambiguity.
- Verification must be repeatable.
- Only bounded residual risks may remain.

### Checklist

#### Automated Verification
- [x] `npm run lint`
- [x] `npm run build`
- [x] `npm test`
- [x] `npm run test:e2e:nav`
- [x] `npm run test:e2e:filters`
- [x] `npm run test:e2e:stats-consistency`
- [x] `npm run test:a11y`
- [x] `npm run audit:supabase:catalog`
- [x] `npm run audit:slug-id`
- [x] `npm run audit:nhost:backup`

#### Experience Verification
- [x] verify homepage desktop/mobile
- [x] verify category listing desktop/mobile
- [x] verify product detail desktop/mobile
- [x] verify configurator desktop/mobile
- [x] verify compare flow
- [x] verify quote/contact flow
- [x] verify trust/projects surfaces
- [ ] verify 3D fallback behavior
- [x] verify core keyboard and focus behavior

#### Final Hardening
- [x] validate deployment env expectations
- [x] confirm core asset paths are valid
- [x] confirm no stale recovery docs override final decisions
- [x] record only bounded residual risks
- [x] produce handoff-ready recovery state

### Release Gate
- [ ] all core checks pass
- [ ] no unresolved platform ambiguity remains
- [ ] no critical catalog failure remains on core routes
- [ ] no major configurator or 3D regression remains
- [ ] no major accessibility or navigation regression remains
- [ ] final repo state is release-ready and handoff-ready

## Benchmark Rules Applied Across All Phases

- The benchmark is `hni.com`, `hermanmiller.com`, and `hon.com`.
- The goal is to be better, not similar.
- Better means:
  - better clarity
  - better mobile UX
  - better configurator usefulness
  - better product discovery
  - better trust and conversion flow
  - better visual cohesion
  - better architectural discipline
- Do not imitate benchmark implementation details.
- Compete on outcome quality, not visual mimicry.

## Success Definition

The project is complete only when all of the following are true:

- [ ] runtime truth is explicit and stable
- [ ] catalog correctness is trustworthy
- [ ] ownership of live systems is clear
- [ ] best dormant local elements have been properly classified and selectively recovered
- [ ] the visual system feels unified and premium
- [ ] homepage, category, and product experiences feel world-class
- [ ] configurator and 3D are standout strengths
- [ ] trust, SEO, and conversion surfaces are stronger than current state
- [ ] accessibility and QA standards are met
- [ ] the site is competitive with or better than the benchmark set

## Assumptions

- The local repo remains the only technical implementation source.
- `unused/` contains valuable local work worth selective recovery.
- The strongest salvage opportunities are likely in configurator, 3D/product presentation, and structured-content helpers.
- Benchmark sites define the competitive bar only.
- World-class means premium, useful, technically clean, conversion-capable, accessible, and clearly better than both the current site and category norms.
