# Phase 10 Experience Verification And Release Hardening
# Objective: Run a bounded live-route verification matrix, capture only bounded residual risks, and close release-hardening gaps without reopening design or catalog scope.

## Current Block

- `Phase 10 Experience Verification And Release Hardening (active)`

## Baseline Entering This Block

- Deployment/environment hardening is verification-closed.
- Hosted runtime/env baseline is verified (`npx vercel env ls` and hosted smoke checks).
- Hosted production deploy is current (`npx vercel --prod --yes`).

## Execution Charter

- Keep this block bounded to verification and release hardening only.
- Do not reopen broad catalog repair, homepage redesign, or archive reintegration.
- Keep `missing_documents` visible as a source-gap truth.
- Keep `/downloads` as a request-based `Resource Desk`.
- Keep `fluid-x` as the only accepted legacy-slug exception.
- Keep `oando-soft-seating--luna` explicitly deferred unless repo-backed media evidence appears.

## Detailed Checklist

### Slice 1: Live Route Matrix

- [ ] Verify homepage desktop/mobile on hosted production
- [ ] Verify category listing desktop/mobile on hosted production
- [ ] Verify product detail desktop/mobile on hosted production
- [ ] Verify configurator desktop/mobile on hosted production
- [ ] Verify compare flow on hosted production
- [ ] Verify quote/contact flow on hosted production
- [ ] Verify trust/projects surfaces on hosted production

### Slice 2: Accessibility And Interaction

- [ ] Verify core keyboard navigation and visible focus behavior across key routes
- [ ] Re-run `npm run test:a11y`
- [ ] Re-run `npm run test:e2e:nav`
- [ ] Re-run `npm run test:e2e:filters`

### Slice 3: Release Closeout

- [ ] Capture bounded residual risks only (no scope expansion)
- [ ] Confirm no stale recovery docs override current decisions
- [ ] Update `RECOVERY-CHECKLIST.md`, `DECISIONS.md`, and `latest.md`
- [ ] Leave one next explicit step only

## Completion Markers

- [ ] Live route matrix is complete for desktop/mobile critical flows
- [ ] Keyboard/focus/accessibility verification is complete
- [ ] Residual risks are bounded and explicit
- [ ] Recovery docs and handover mirrors are consistent

## Not In This Block

- [ ] Do not reopen broad catalog repair.
- [ ] Do not reopen homepage/layout redesign.
- [ ] Do not start archive reintegration.
- [ ] Do not fabricate external assets or unsupported claims.

## Next Explicit Step

- Run the hosted live-route matrix starting with `/`, `/products`, `/products/[category]`, `/products/[category]/[product]`, and `/configurator`, then record findings before any code edits.
