# Phase 4 Design-System/Token And Visual-Consistency Unification
# Objective: Unify the shared visual foundation across live routes so the site feels like one premium system on desktop and mobile, without reopening catalog-truth or archive-reintegration scope.

## Current Block

- `Phase 4 Design-System/Token And Visual-Consistency Unification (active)`

## Baseline Entering This Block

- Deployment/environment hardening is verification-closed.
- Phase 10 live experience verification is verification-closed.
- Core route stack is already live and verified.
- The remaining gap is cross-route visual consistency, token discipline, and UI primitive cohesion.

## Execution Charter

- Keep this block bounded to shared visual foundations and route-level consistency only.
- Do not reopen broad catalog repair, homepage truth rewrites, or archive reintegration.
- Normalize tokens and primitives before making isolated route-level styling moves.
- Preserve `missing_documents` as a visible source-gap truth.
- Keep `/downloads` as a request-based `Resource Desk`.
- Keep `fluid-x` as the only accepted legacy-slug exception.
- Keep `oando-soft-seating--luna` explicitly deferred unless repo-backed media evidence appears.

## Detailed Checklist

### Slice 1: Token And Primitive Audit

- [x] Audit active token sources across `app/theme-tokens.css`, `app/typography.css`, `app/custom-components.css`, and live route components
- [x] Identify duplicated hardcoded values for type, spacing, radius, border, and surface treatment
- [x] Define the active primitive set for buttons, cards, panels, chips, labels, and section shells
- [x] Remove stale or conflicting visual patterns from active-route usage

### Slice 2: Shared System Unification

- [x] Normalize typography scale and label usage across hero, section, card, and metadata patterns
- [x] Normalize surface styles, border logic, corner radii, and panel density
- [x] Normalize CTA/button states across primary, secondary, ghost, and dark-surface contexts
- [ ] Normalize spacing rhythm and container behavior across desktop and mobile

### Slice 3: Core Route Consistency Pass

- [x] Recheck `/`, `/products`, and `/products/[category]` for token/primitive drift and patch the shared CTA/card/header surfaces
- [ ] Recheck `/products/[category]/[product]` for token/primitive drift
- [ ] Recheck `/about`, `/trusted-by`, `/sustainability`, `/contact`, and `/solutions` for shell/layout drift
- [x] Remove visibly low-quality repeated UI patterns that break cohesion
- [x] Verify parity on both desktop and mobile for the updated shared system on the touched routes/components

### Slice 4: Verification

- [x] Run `npm run lint`
- [x] Run `npm run build`
- [x] Run targeted Playwright checks on the touched routes/components
- [x] Update `RECOVERY-CHECKLIST.md`, `DECISIONS.md`, `latest.md`, and handover mirrors after the slice closes

## Completion Markers

- [x] Shared visual tokens are materially more consistent
- [x] Shared UI primitives behave consistently across the touched core routes
- [x] Desktop/mobile parity is verified on touched surfaces
- [x] Recovery docs point to the same active frontier with no drift

## Not In This Block

- [ ] Do not reopen broad catalog repair.
- [ ] Do not reopen archive reintegration.
- [ ] Do not fabricate product data or unsupported claims.
- [ ] Do not start a new structural route-ownership wave.

## Next Explicit Step

- Continue the Phase 4 route-consistency pass on `/products/[category]/[product]`, `/about`, `/trusted-by`, `/sustainability`, `/contact`, and `/solutions`, tightening spacing rhythm and section-shell parity without reopening catalog or archive scope.
