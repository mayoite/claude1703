# Full Site Stabilization Plan

Last updated: 2026-03-19 IST
Owner: Lead agent
Status: Active working plan

## Goal

Stabilize the full site before any further redesign work.

This means:
- reduce navigation density
- remove repeated or competing section messages
- fix structural UI issues before styling flourishes
- keep the current brand direction and footer marquee
- move section by section with approvals instead of broad homepage rewrites

## Locked Constraints

- Do not break `/products/*`.
- Do not redesign the whole site in one pass.
- Keep the footer marquee.
- Keep the current site-wide theme direction.
- Use one font family consistently.
- No cheap gradients.
- Tailwind v4 cleanup happens after visual stabilization, not before.

## Primary Problems

### 1. Navigation Is Too Dense

The current header is trying to carry too many first-order destinations at once:
- `Products`
- `Configurator`
- `Solutions`
- `Projects`
- `Portfolio`
- `Trusted by`
- `About`
- `Sustainability`

On top of that, the utility row repeats:
- `Service`
- `Showrooms`
- `Contact`

This creates a width-budget problem and makes the navbar feel busy even when it technically fits.

### 2. Homepage Repeats the Same Message Too Often

The homepage currently spreads trust, proof, process, and conversion across too many separate surfaces.

The main repetitions are:
- `Projects`
- `Testimonials`
- `TrustStrip`
- `ProcessSection`
- `ContactTeaser`
- `FAQ`

These are individually fine, but together they make the page feel longer and denser than it needs to be.

### 3. Structure and Design Are Still Mixed Together

Work has been bouncing between:
- layout
- typography
- motion
- spacing
- section order
- copy

That is why the work feels circular. The site needs a fixed sequence.

## Site-Wide Execution Order

### Phase 0. Freeze and Baseline

Purpose:
- stop broad changes
- define the baseline
- prevent drift

Actions:
- freeze homepage section order unless explicitly approved to change
- freeze footer marquee
- freeze font family decision
- capture desktop and mobile reference screenshots for homepage, products, projects, contact, footer
- treat each approved section as locked once signed off

Exit criteria:
- one agreed baseline per key page
- no parallel redesign experiments

### Phase 1. Navigation and IA Reduction

Purpose:
- make the site easier to read
- reduce top-level choice overload

Recommended top-nav core:
- `Products`
- `Solutions`
- `Projects`
- `About`
- `Sustainability`

Recommended removals from primary nav:
- remove `Trusted by` from primary nav
- merge `Projects` and `Portfolio` into one primary proof route family
- move `Configurator` out of primary nav unless it is a top conversion path

Recommended utility simplification:
- keep one clear utility link such as `Contact`
- move `Service` and `Showrooms` out of the utility row into footer/contact surfaces

Route-family recommendation:
- treat `Planning` and `Configurator` as one planning flow
- keep separate routes only if technically needed
- stop presenting them as separate first-order ideas

Exit criteria:
- desktop header no longer feels crowded at common widths
- mobile nav is simpler, not just visually tighter
- route naming is consistent across header, footer, and internal CTAs

### Phase 2. Homepage Structural Compression

Purpose:
- make the homepage say less and sell better

Recommended homepage shape:
1. Hero
2. Category or product-entry surface
3. Proof surface
4. Process plus conversion surface
5. FAQ
6. Footer

Recommended homepage merges:
- keep `Projects` as the main proof section
- fold either testimonials or trust stats into the same proof band
- attach `ContactTeaser` directly to `ProcessSection` as one conversion sequence

Keep:
- strong hero
- product/category entry
- one main proof story
- one operations-to-conversion story

Reduce:
- repeated proof messaging
- repeated support messaging
- repeated “trust” sections

Exit criteria:
- homepage has fewer repeated messages
- each section has one job only
- scroll length feels deliberate, not padded

### Phase 3. Page Family Stabilization

Purpose:
- clean the rest of the site by route family instead of randomly

Priority order:
- Homepage
- Products
- Projects
- Solutions
- Contact and planning
- About and trust pages
- Remaining support and utility pages

For each family:
- stabilize layout
- stabilize typography
- stabilize image quality and cropping
- stabilize CTA hierarchy
- then clean implementation

Exit criteria:
- each page family uses the same spacing, CTA, and heading logic
- no family feels like it belongs to a different site

### Phase 4. Motion and Interaction Pass

Purpose:
- restore life without reintroducing instability

Allowed motion:
- hero image drift
- restrained hover response
- clean accordion transitions
- quiet marquee behavior

Avoid:
- decorative animation that fights for attention
- scroll reveal systems that risk blank content states
- layered motion stacks in dense sections

Exit criteria:
- the site feels alive, not noisy
- motion supports hierarchy rather than becoming content

### Phase 5. Tailwind v4 Cleanup

Purpose:
- convert stabilized sections cleanly
- avoid rewriting broken patterns into new syntax

Rules:
- convert only approved sections
- preserve approved visuals exactly
- remove semantic homepage-only CSS only after matching the approved result

Exit criteria:
- cleaner implementation
- no visible regressions

## Navigation Simplification Checklist

- [x] Remove `Trusted by` from primary nav
- [x] Decide whether `Portfolio` is merged into `Projects`
- [x] Decide whether `Configurator` remains top-level or moves into planning/support
- [x] Collapse utility links to one clear user-facing support path
- [x] Align header naming with footer naming
- [ ] Verify desktop header at `1440`, `1280`, `1180`, `1080`
- [ ] Verify mobile drawer remains clean after IA reduction

## Homepage Compression Checklist

- [ ] Hero approved
- [ ] Category entry section approved
- [ ] One proof band chosen
- [ ] `Projects` and proof relationship simplified
- [ ] `ProcessSection` and `ContactTeaser` sequence simplified
- [ ] FAQ kept only if it still earns its place
- [ ] Footer transition feels intentional

## Visual QA Checklist

- [ ] Desktop screenshots captured for homepage, products, projects, contact, footer
- [ ] Mobile screenshots captured for the same pages
- [ ] Navbar verified at common desktop widths
- [ ] Hero image framing approved
- [ ] Typography scale does not drift between sections
- [ ] Button styles are consistent
- [ ] No low-contrast text remains
- [ ] No obvious alignment errors remain

## Technical QA Checklist

- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] `npm run test:a11y`
- [ ] Visual spot-check after each approved section pass
- [ ] No route regressions on `/products/*`

## Route Triage

These routes can remain live without influencing primary navigation:
- `/brochure`
- `/download-brochure`
- `/gallery`
- `/social`
- `/tracking`
- `/support-ivr`
- `/quote-cart`
- `/compare`
- `/news`

They should be treated as secondary utility routes unless the user explicitly wants them promoted.

## Immediate Next Step

Do not redesign the whole site again.

Next practical move:
- finish the navbar reduction decision
- then lock the homepage proof/conversion merge plan

That sequence will reduce the sense of circular work more than another styling pass.
