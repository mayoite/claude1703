# Configurator Rebuild Handover

Last updated: 2026-03-22 22:47:15 +05:30  
Owner: Codex  
Branch: `main`  
Status: Active handover

## Completed
- Removed `components/configurator/Simple2DConfigurator.tsx` and routed `/configurator` to the new planner shell.
- Rebuilt `components/configurator/Configurator.tsx` into a 2D planning studio with room presets, canvas, catalog rail, query rail, inspector, and action bar.
- Added planner domain in `lib/planner` (catalog, types, utils) and split UI helpers into:
  - `components/configurator/ui/CollapsibleSection.tsx`
  - `components/configurator/panels/RoomSetupPanel.tsx`
- Implemented tool modes: `select`, `product`, `wall`, `door`, `window`, `column`, `note`.
- Added walls/columns/notes rendering and grid toggle.
- Added opening placement and editing:
  - single door, double door, and window
  - drag/resize handles and large hit-zones
  - per-opening offset input in the panel
- Added right-click context menu for rotate/flip/duplicate/delete.
- Added a dedicated top interaction hit-layer for placed items so selection/drag is reliable.
- Added opening entity selection with rotate/flip/delete (via context menu and inspector).
- Added opening inspector panel with explicit controls.
- Added opening hinge logic so door rotate flips swing without changing wall edge.
- Restored `app/ops/planner-lab/page.tsx` shim to fix build typegen.
- `npm run build` completes (with existing CSS warnings unrelated to configurator).

## Partially Done / In Progress
- User reports doors still “not draggable” in practice. Latest changes are intended to fix this, but the issue needs a manual confirmation pass.
- Query engine remains heuristic; no rule-based packing yet.
- Catalog content is still a starter set; full AFC/Featherlite normalization not implemented.
- UX polish still needed for best-in-class tool feel.

## Current Worktree State
- Repo is heavily dirty with many unrelated modifications already present. Do not revert unrelated files.
- Key files for this slice:
  - `components/configurator/Configurator.tsx`
  - `lib/planner/types.ts`
  - `lib/planner/catalog.ts`
  - `lib/planner/utils.ts`
  - `components/configurator/canvas/*`
  - `components/configurator/panels/*`
  - `components/configurator/ui/*`
  - `app/ops/planner-lab/page.tsx`
  - `docs/ops/configurator-rebuild-live-checklist.md`

## Known Issues / Risks
- User feedback: doors still appear non-draggable in the UI. Needs a targeted test after refresh.
- CSS build warnings (12) are emitted from broader style utilities (not configurator-specific).
- Supabase stats cache revalidation timeout appears in build logs (non-fatal).

## Immediate Next Actions
1. Open `/configurator`, add a door, and verify drag + rotate/flip from both context menu and opening inspector.
2. If drag still fails, add temporary on-canvas debug overlay for hit-zones and pointer position.
3. If rotate/flip still disabled on openings, verify right-click hit detection on arcs.

## Verification Already Run
- `npx eslint components/configurator/Configurator.tsx`
- `npm run build` (passes; emits existing CSS warnings)

## Verification Still Pending
- Manual UX verification of opening drag/rotate/flip behavior.
- Manual UX verification of right-click context menu reliability.

## Resume Notes
- Start in `components/configurator/Configurator.tsx` around the openings rendering section.
- Opening entity logic: `findOpeningIdAtClientPoint`, `rotateSelectedOpening`, `flipSelectedOpening`, `deleteSelectedOpening`.
- Hinge handling defaults to `"start"`; rotate toggles hinge without moving walls.
- Keep `docs/ops/configurator-rebuild-live-checklist.md` updated every 10 minutes during active work.
