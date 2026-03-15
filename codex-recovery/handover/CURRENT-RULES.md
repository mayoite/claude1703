# Current Rules

## Source Of Truth

- The current local repo is the only implementation source of truth.
- `codex-recovery/*` is the planning and sequencing source of truth.
- External repos and sites are not technical references.
- No external code may be inspected, copied, cited, or used for architecture decisions.
- External benchmarks are quality targets only.

## Recovery Rules

- Do not delete uncertain files.
- Do not move route files without proof.
- Do not treat preview or internal routes as dead code.
- `unused/` is a salvage pool, not a trash folder.
- Dormant local files must be classified before reintegration.
- Archive or preserve before destructive cleanup.
- Structural changes must remain reversible until verified.

## Product Rules

- Supabase remains primary.
- Nhost remains mirror/fallback only.
- Catalog truth must be explicit.
- Alias resolution must work through the intended fallback model.
- Slug and identity behavior must be consistent across runtime and audits.
- Product media must be verified against real assets.

## Quality Rules

- The current site baseline is not good enough.
- The benchmark sites are the competitive bar, not the implementation model.
- The result must feel world-class, not merely cleaner.
- Configurator and 3D must be useful, not decorative.
- Mobile quality must be first-class.
- Accessibility and readability are mandatory, not optional polish.

## Execution Rules

- Work nonstop through the sequence without waiting for human intervention.
- Do not stop at partial cleanup when the broader product standard remains low.
- Keep one active frontier at a time.
- Keep `NEXT-PLAN.md` at or under 17.5% of `WORLD-CLASS-PLAN.md`.
- End every phase with verification before proceeding.
- Do not mix deep structural cleanup and deep visual redesign in one uncontrolled wave.
- Update `WORLD-CLASS-PLAN.md` and the active recovery checklist every 10 minutes even if there is no material progress.
- Terminate any script or command that runs longer than 3 minutes.
- Prefer smaller verification slices over long opaque runs.

## Current Bounded Exceptions

- `fluid-x` remains the only accepted `legacy_slug_format` exception.
- `oando-soft-seating--luna` remains the only unresolved media blocker.
- `missing_documents` remains an active audit requirement and content-ingestion lane.
- `/downloads` is intentionally positioned as a request-based `Resource Desk`, not a direct file library.
