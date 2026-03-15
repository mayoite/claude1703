# Week 1 / Platform Contract Closeout / Next 72-Hour Block

Execution rule for this block: finish the remaining Week 1 platform closeout work, then decide whether to exit into Week 2 catalog recovery.

## Objective

Complete the legacy runtime dependency review for Nhost fallback usage and close Week 1 only if legacy dependency risk is either removed or explicitly documented as an accepted transition constraint.

## Master Objective Alignment

This block is expanded under the repository recovery charter in `MASTER-OBJECTIVE.md` and must follow these non-negotiable principles during execution:

- Preserve before simplifying: do not remove uncertain assets or code paths.
- Evidence before movement: every dependency decision must be traceable to file-level proof.
- Archive before delete: no destructive cleanup in this block.
- Public behavior beats tidiness: do not trade runtime safety for structural neatness.
- Small reversible steps: keep changes incremental with verification after each step.

Execution standards for this block:

- Keep app behavior stable while closing Week 1 platform dependency risk.
- Keep recovery docs as the operational source of truth for fresh-session continuation.
- Keep one explicit next step only at block end.
- Keep snapshot discipline active whenever state materially changes.

## Recorded Completion Baseline

Completed items from the prior 72-hour block are recorded in `DECISIONS.md` and `RECOVERY-CHECKLIST.md` and are intentionally removed from this active execution checklist.

Recorded as complete:

- Live Supabase/Nhost parity baseline capture (`products=145`, `business_stats_current=1`)
- Source-label contract lock (`supabase | nhost-graphql | nhost-sql | stale-cache | safe-default`)
- Business-stats fallback alignment and build verification
- Mirror verification hardening in `scripts/sync_nhost_backup.ts`
- Recovery snapshot refresh and `latest.md` update

## Re-Audit Findings (Latest)

- Comprehensive audit sweep recorded in `codex-recovery/AUDIT-ALL-2026-03-12.md`.
- Current blocking findings outside the single platform follow-up:
  - test/type drift around deleted `components/3DViewer.tsx` (`npm test`, `npx tsc --noEmit`)
  - E2E timeout instability in nav/filters/stats-consistency suites
  - stale script imports in `scripts/audit-product-quality.ts`
- Current platform follow-up remains unchanged:
  - fix Nhost GraphQL alias-table exposure (`product_slug_aliases` on `query_root`) and re-run parity audit.

## 72-Hour Sequence

### First 24 Hours

1. Inventory all runtime reads that still depend on legacy Nhost tables.
2. Classify each dependency as `active-required`, `transition-compatible`, or `removable-now`.
3. Record evidence and ownership for each dependency in recovery docs.

### Middle 24 Hours

1. Remove or reroute any `removable-now` legacy dependencies.
2. Verify fallback behavior still matches `Supabase -> Nhost GraphQL -> Nhost SQL -> stale cache -> safe default`.
3. Re-run build and parity audit after dependency adjustments.

### Final 24 Hours

1. Finalize the legacy dependency review outcome (`closed` or `explicitly deferred with reason`).
2. Update recovery docs with one final Week 1 disposition.
3. Leave one next explicit step only: either Week 2 catalog recovery start or one named deferred dependency task.

## Detailed Checklist

### First 24 Hours

- [x] Enumerate legacy-table reads across runtime and scripts (`products`, `categories`, `product_specs`, `product_images`, `product_slug_aliases`)
- [x] Confirm which runtime paths still require legacy-table compatibility versus canonical-only tables
- [x] Record dependency matrix with file path, function, table, reason, and target disposition
- [x] Update `DECISIONS.md` with dependency-review scope and classification rule
- [x] Update `RECOVERY-CHECKLIST.md` with in-progress Week 1 closeout status
- [x] Confirm no dependency decision violates `preserve before simplify` or `evidence before movement`

### Middle 24 Hours

- [x] Implement low-risk removals or reroutes for `removable-now` legacy dependencies (none identified in first inventory pass)
- [x] Keep dual-table compatibility where dependencies are still `active-required` or `transition-compatible`
- [x] Verify `lib/businessStats.ts`, `lib/nhostBackup.ts`, and related tests still follow the locked fallback order
- [x] Run `npm run build`
- [x] Run `npm run audit:nhost:backup`
- [x] Record verification outputs and any residual gaps in recovery docs
- [x] Confirm verification updates preserve runtime safety before any structural simplification attempt

### Final 24 Hours

- [x] Mark dependency review outcome as `closed` or `deferred-with-reason`
- [x] If deferred, record exact deferred item(s), risk, and re-entry trigger
- [x] Update `NEXT-PLAN.md`, `DECISIONS.md`, and `RECOVERY-CHECKLIST.md` to reflect final Week 1 disposition
- [x] Generate fresh recovery snapshot
- [x] Ensure `latest.md` reflects the newest snapshot
- [x] Leave one next explicit step only
- [x] Confirm final disposition follows `public behavior beats tidiness` and `small reversible steps`

## Completion Markers

- [x] Legacy runtime dependency inventory is complete and evidence-backed.
- [x] Each dependency has explicit disposition (`active-required`, `transition-compatible`, or `removable-now`).
- [x] Any safe removals/reroutes are implemented and verified.
- [x] Build verification passes after dependency review changes.
- [x] Nhost parity audit is re-run and recorded after dependency review changes.
- [x] Recovery docs capture final Week 1 closeout status without ambiguity.
- [x] Remaining work is reduced to one explicit next step only.

## Not In This Block

- [ ] Do not reopen Week 1 basics-first image repair scope
- [ ] Do not reopen Week 1 hardcoding cleanup scope
- [ ] Do not mix broader duplicate-family cleanup into this block
- [ ] Do not pull `oando_website/*` investigation into this block
- [ ] Do not start Week 2 implementation work before Week 1 closeout decision is recorded

## Guardrails

- Keep Supabase as the only write authority and Nhost as read-only mirror infrastructure.
- Keep dual-table compatibility until dependency review explicitly allows reduction.
- Keep this plan execution-focused; completed history belongs in `DECISIONS.md` and `RECOVERY-CHECKLIST.md`, not as active checklist noise.
- Keep `NEXT-PLAN.md` as a detailed 72-hour operational checklist, not a milestone summary.
- Keep `archive before delete` and avoid destructive actions in this block.
- Keep route safety and preview/internal protection rules from `MASTER-OBJECTIVE.md` intact.

## Next Explicit Step

- Resolve the remaining `oando-soft-seating--luna` media blocker using only repo-backed local evidence, then move directly into the next clean catalog lanes in this order: `legacy_slug_format`, `suspicious_text_encoding`, and `missing_documents`, re-running `npm run audit:products:quality`, `npm run audit:slug-id`, and `npm run build` after each lane.
