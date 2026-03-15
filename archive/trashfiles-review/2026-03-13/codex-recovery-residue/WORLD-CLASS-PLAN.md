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
- End every phase with verification before proceeding.
- Do not mix deep structural cleanup and deep visual redesign in one uncontrolled wave.
- Update the checklist every 15 minutes even if there is no material progress.
- Terminate any script or command that runs longer than 3 minutes.
- Prefer smaller verification slices over long opaque runs.

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
- [ ] Confirm catalog runtime ownership in active code
- [ ] Confirm business-stats runtime ownership in active code
- [ ] Lock fallback contract as `supabase -> nhost-graphql -> nhost-sql -> stale-cache -> safe-default`
- [ ] Fix Nhost GraphQL alias-table exposure
- [ ] Keep SQL rescue intact until GraphQL alias lookup is verified
- [ ] Re-run `npm run audit:nhost:backup` until `graphqlFailures=0`
- [ ] Confirm mirror verification still covers canonical and legacy table parity
- [ ] Re-run `npm run build`
- [ ] Re-run tests covering stats and fallback paths
- [ ] Update recovery truth so platform behavior is no longer ambiguous

### Exit Criteria
- [ ] Build passes
- [ ] Alias lookup works in the intended GraphQL path
- [ ] Runtime and audits agree on platform truth

## Phase 2: Catalog Correctness And Content Integrity

### Objective
Make the catalog trustworthy for users, search, filtering, and downstream UX.

### Rules Active In This Phase
- Product truth must come from local runtime and data rules only.
- Product media must be validated against real local assets.
- Critical failures are fixed before medium metadata work.
- No catalog repair is accepted without audit verification.

### Checklist
- [ ] Validate canonical slug behavior in runtime
- [ ] Validate alias behavior for legacy slugs
- [ ] Confirm deep category and subcategory IDs are correct and consistently used
- [ ] Repair the critical workstation media lane first
- [ ] Validate primary images against actual public assets
- [ ] Validate gallery image coverage against actual public assets
- [ ] Fix stale audit-tool imports if they block verification
- [ ] Re-run `npm run audit:supabase:catalog`
- [ ] Re-run `npm run audit:slug-id`
- [ ] Re-run `npm run audit:products:quality`
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
- [ ] Confirm active shell ownership
- [ ] Confirm active product listing ownership
- [ ] Confirm active product detail ownership
- [ ] Confirm active configurator ownership
- [ ] Confirm active bot ownership
- [ ] Confirm active trust/project/gallery ownership
- [ ] Confirm route ownership under `app/`

#### Dormant Salvage Review
- [ ] Review `unused/components/3DViewer.tsx`
- [ ] Review `unused/components/product/ParallaxGallery.tsx`
- [ ] Review `unused/components/configurator/ConfiguratorLayout.tsx`
- [ ] Review `unused/components/configurator/ConfiguratorCSS.tsx`
- [ ] Review `unused/components/configurator/productMapping.ts`
- [ ] Review `unused/components/seo/JsonLd.tsx`
- [ ] Review `unused/lib/productSpecSchema.ts`
- [ ] Review `unused/lib/products.ts`
- [ ] Review `unused/lib/trustedBy.ts`

#### Classification
- [ ] mark each candidate `recover-now`
- [ ] mark each candidate `recover-later`
- [ ] mark each candidate `reference-only`
- [ ] mark each candidate `archive-only`

#### Integration Decision Rules
- [ ] improves live UX materially
- [ ] fits current data contracts
- [ ] does not revive abandoned architecture
- [ ] lowers implementation cost without lowering quality
- [ ] supports a world-class end state

### Exit Criteria
- [ ] Active ownership is explicit
- [ ] Dormant local strengths are identified
- [ ] Weak legacy systems are not accidentally revived

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
- [ ] redesign product-detail hierarchy for faster comprehension
- [ ] improve hero media and gallery behavior
- [ ] evaluate local dormant gallery/parallax ideas for selective reintegration
- [ ] improve spec readability and technical detail hierarchy
- [ ] improve CTA placement and quote intent flow
- [ ] improve adjacent discovery and related-product logic
- [ ] improve trust, quality, and practical buying signals
- [ ] ensure 3D/model integration is clean where available
- [ ] ensure fallback media behavior is graceful

### Exit Criteria
- [ ] product pages support confident decisions
- [ ] product media is stable and premium
- [ ] product pages materially exceed current baseline

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
- [ ] define entry path
- [ ] define guided workflow
- [ ] define planning logic
- [ ] define summary output
- [ ] define quote handoff
- [ ] define optional compare/save/share behavior if useful

#### Current-System Audit
- [ ] audit live configurator pages
- [ ] audit live configurator components
- [ ] audit current mapping/state model
- [ ] review dormant configurator and 3D salvage candidates

#### 2D Planning
- [ ] improve speed of layout configuration
- [ ] improve clarity of dimensions and seating choices
- [ ] improve summary and selection feedback
- [ ] improve mobile planning ergonomics

#### 3D Layer
- [ ] decide where 3D is genuinely valuable
- [ ] selectively recover local 3D capabilities if they fit
- [ ] establish explicit asset mapping
- [ ] define fallback behavior for missing/heavy models
- [ ] ensure performance remains production-safe

#### Output Layer
- [ ] improve quote handoff from configuration
- [ ] improve summary clarity
- [ ] improve compare handoff where relevant
- [ ] make the configurator feel like a serious planning tool

### Exit Criteria
- [ ] configurator is premium and useful
- [ ] 3D adds real value
- [ ] tool works well on mobile and desktop
- [ ] performance and fallback behavior are stable

## Phase 9: Trust, SEO, And Conversion Layer

### Objective
Make the site authoritative, credible, and conversion-competent.

### Rules Active In This Phase
- Trust signals must be intentional and visible.
- Metadata ownership must be consistent.
- Conversion flows must be easier and more confidence-building than current state.
- Structured content must live in the local content system, not scattered literals.

### Checklist
- [ ] centralize metadata, route copy, and trust content into local typed data modules
- [ ] normalize route-level SEO ownership
- [ ] normalize structured-data ownership
- [ ] improve trusted-by, projects, contact, and product trust surfaces
- [ ] improve CTA hierarchy and quote/contact flow
- [ ] improve business identity and proof presentation
- [ ] improve alt text and trust-sensitive copy quality
- [ ] ensure footer and global contact surfaces support conversion clearly

### Exit Criteria
- [ ] metadata ownership is clean
- [ ] trust surfaces feel deliberate and credible
- [ ] conversion paths are stronger and clearer

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
- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] `npm test`
- [ ] `npm run test:e2e:nav`
- [ ] `npm run test:e2e:filters`
- [ ] `npm run test:e2e:stats-consistency`
- [ ] `npm run test:a11y`
- [ ] `npm run audit:supabase:catalog`
- [ ] `npm run audit:slug-id`
- [ ] `npm run audit:nhost:backup`

#### Experience Verification
- [ ] verify homepage desktop/mobile
- [ ] verify category listing desktop/mobile
- [ ] verify product detail desktop/mobile
- [ ] verify configurator desktop/mobile
- [ ] verify compare flow
- [ ] verify quote/contact flow
- [ ] verify trust/projects surfaces
- [ ] verify 3D fallback behavior
- [ ] verify core keyboard and focus behavior

#### Final Hardening
- [ ] validate deployment env expectations
- [ ] confirm core asset paths are valid
- [ ] confirm no stale recovery docs override final decisions
- [ ] record only bounded residual risks
- [ ] produce handoff-ready recovery state

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
