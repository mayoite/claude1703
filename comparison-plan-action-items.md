# Consolidated Plan and Action Items

This file turns the five-report comparison into a concrete plan. It is designed to answer:

- what to do first
- what to do next
- what to defer
- what to remove
- what should be treated as launch-blocking versus quality-improving

## Planning assumptions

- `GPt 511.md` is used as the baseline operating audit.
- `GPT.MD` is used to shape implementation language and sequencing.
- `PAUX.md` is used to prevent underestimating trust and CRO severity.
- `Sonnet.md` is used to gate live first-impression, cookie, and staging-vs-production issues.
- `GPT 52.md` is used to support route-level engineering fixes, especially around fallback behavior and hidden CTAs.

## North-star objective

Convert the site from a visually persuasive but operationally ambiguous experience into a trustworthy, high-intent B2B inquiry system with:

- consistent proof
- coherent journeys
- credible service and support flows
- stronger product decision support
- fewer false or under-finished public signals

## P0 actions: do first

These are the highest-confidence actions across the five reports.

### 1. Repair the contact flow

Why:

- highest-intent route
- directly tied to lead loss
- one broad audit found a critical follow-up-link defect

Action items:

- fix any success-state links that point back to the user instead of official channels
- add structured inquiry fields: city, seats, timeline, budget, intent
- add consent/privacy messaging near submit
- add SLA language such as response-time expectation
- add official quick actions for call, WhatsApp, and email on mobile
- add anti-spam / rate-limiting

Success criteria:

- user submits once and understands exactly what happens next
- all follow-up links point to company-controlled channels
- contact route no longer feels generic or risky

### 2. Remove or hide simulated tracking until real

Why:

- strongest route-level cross-report agreement
- repeated trust damage finding

Action items:

- remove public nav exposure to `/tracking`
- replace with “Request status update” via support until a real backend exists
- if retained temporarily, label explicitly as demo in non-public environments only

Success criteria:

- no public route implies real order tracking unless it is real

### 3. Fix KPI and proof-source consistency

Why:

- one of the most repeated trust problems
- affects homepage, about, projects, and proof pages

Action items:

- create one source of truth for key stats
- show visible as-of date wherever KPI modules appear
- remove conflicting hardcoded KPI blocks
- standardize trust-strip and proof-module wording

Success criteria:

- the same KPI family appears consistently across all proof surfaces
- no page shows a contradictory business scale story

### 4. Turn downloads into a real document experience

Why:

- high-intent resource route
- repeated dead-end friction finding

Action items:

- add real downloadable assets or gated instant-delivery behavior
- show file size, version, and last-updated metadata
- make brochure/catalog redirects land in intent-aware subviews

Success criteria:

- a user seeking a brochure or catalog can actually get one with minimal friction

### 5. Consolidate mobile floating helpers

Why:

- repeated homepage/mobile friction issue
- appears in both broad repo audits and live-build comparison

Action items:

- replace multiple simultaneous floating helpers with one prioritized launcher
- set collision/suppression rules for cookie banner, compare dock, and form states
- preserve a clear primary mobile action path

Success criteria:

- no important CTA or content is obscured by helper UI on mobile

## P1 actions: do next

### 6. Rebuild quote-cart, compare, configurator, and contact as one journey

Why:

- central commercial architecture problem across all broad reports

Action items:

- persist quote-cart selections reliably
- allow compare selection management on-page
- pass compared or quoted items into inquiry flow
- let configurator output feed quote/contact cleanly
- show clear confirmation and carried context at every step

Success criteria:

- no user has to restate product intent after already selecting/configuring products

### 7. Upgrade PDP and compare decision support

Why:

- universal weakness in product evaluation layer

Action items:

- add price framing
- add lead times
- add warranty/service cues
- add downloadable spec/proof documents
- improve product-specific CTA placement
- add better compare rows and mobile compare mode

Success criteria:

- a serious buyer can shortlist products without needing immediate manual clarification for every basic question

### 8. Clarify proof-route IA

Why:

- repeated confusion among `Projects`, `Trusted by`, `Portfolio`, `Gallery`, and `Showrooms`

Action items:

- assign one clear job to each route
- decide which route is client directory, which is case-study hub, which is visual proof, which is showroom utility
- cross-link routes intentionally rather than duplicating badge walls

Success criteria:

- each proof/showcase route has a distinct purpose that a first-time user can infer quickly

### 9. Strengthen planning and solutions pages

Why:

- current offers are valuable in concept but abstract in execution

Action items:

- add sample outputs and deliverables
- add timelines and engagement format
- differentiate `Planning` from `Solutions`
- add lighter capture methods on-page

Success criteria:

- users understand exactly what each service produces and how to start

### 10. Turn service/support into a real after-sales system

Why:

- support credibility matters disproportionately in B2B furniture

Action items:

- add dedicated support form or ticket intake
- separate support from sales routing
- show SLA and support hours
- connect support IVR, support contacts, and policy pages coherently

Success criteria:

- service route builds confidence instead of exposing operational ambiguity

## P2 actions: after core hardening

### 11. Deepen route-specific proof and trust

Action items:

- add real imagery and captions to `About`
- add case snippets to `Projects`
- add proof links to `Trusted by`
- add eco evidence to `Sustainability`
- add role details and process to `Career`

### 12. Improve resource and content quality

Action items:

- decide whether `News` becomes real or is retired
- decide whether `Social` becomes real or is removed
- connect `Gallery` and `Portfolio` more tightly to commercial routes

### 13. Improve legal and consent coherence

Action items:

- align consent wording and controls with privacy behavior
- improve navigation and readability of legal pages
- ensure contact/support claims match legal/policy language

### 14. Improve accessibility and mobile polish on key surfaces

Action items:

- fix low-contrast microcopy
- fix wide tables and comparison overflows
- improve focus-visible and aria-live support where dynamic content appears
- reduce instructional copy mismatches across devices

## Remove / replace decisions

These should be decided explicitly rather than left as accidental leftovers.

| Surface | Recommended decision |
| --- | --- |
| `/tracking` | Remove from public view until real |
| `/social` | Replace with real feed or remove |
| thin `/solutions/*` placeholders | Build fully or collapse honestly |
| weak `News` hub | Build detail structure or retire |
| redirect-only brochure/catalog experience | Replace with intent-aware delivery flow |

## 30-60-90 structure

## Days 0-30

- Repair contact flow
- Hide/remove fake tracking
- Unify KPI source and dates
- Fix homepage mobile helper collisions
- Make downloads credible
- Resolve staging/production mismatch issues that affect live trust

## Days 31-60

- Integrate quote-cart, compare, configurator, and contact
- Improve PDP/compare content depth
- Strengthen planning/service pages
- Clarify proof-route IA
- Fix cookie/legal alignment issues

## Days 61-90

- Rebuild weak support routes
- Expand proof artifacts and case-study quality
- Improve newsroom/social strategy
- Finish mobile/accessibility polish on high-traffic surfaces
- Decide final route merges/renames where duplication remains

## Owner suggestions

| Workstream | Primary owner | Supporting owner |
| --- | --- | --- |
| Contact and support flow | Frontend/Product | Content |
| KPI and trust consistency | Frontend | Content/Leadership |
| Downloads/resources | Content | Frontend |
| Compare/quote/configurator integration | Frontend/Product | Design |
| IA cleanup of proof routes | Product/Content | Design |
| PDP decision support | Content/Product | Frontend |
| Consent/legal alignment | Content/Legal | Frontend |
| Mobile/accessibility hardening | Frontend | Design |

## Action list by business impact

| Rank | Action | Why it matters |
| ---: | --- | --- |
| 1 | Fix contact flow | Closest route to lead capture |
| 2 | Remove fake tracking | Major trust damage |
| 3 | Unify KPI/proof logic | Sitewide trust coherence |
| 4 | Fix downloads/resources | High-intent users currently dead-end |
| 5 | Merge funnel tools operationally | Converts feature richness into actual journey quality |
| 6 | Improve PDP/compare depth | Required for buyer confidence |
| 7 | Clarify proof-route IA | Reduces confusion and duplication |
| 8 | Improve support/service clarity | Protects after-sales trust promise |
| 9 | Remove or replace mock/placeholder content | Stops credibility leaks |
| 10 | Finish mobile/accessibility repairs on key surfaces | Protects first impression and usability |

## Final plan statement

The site should not move into a “minor polish only” phase. The reports support a heavier program of trust, proof, and funnel hardening.

The correct action pattern is:

- fix the trust leaks
- fix the lead-capture breaks
- make discovery and decision support commercially credible
- remove anything public that behaves like a demo or placeholder

Once those are done, the existing visual system becomes an asset rather than a mask for unfinished operations.
