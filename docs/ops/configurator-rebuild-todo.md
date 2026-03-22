# Configurator Rebuild TODO

Last updated: 2026-03-22 11:45:25 +05:30
Status: Active

## Immediate
- Visually validate the new planner shell in browser and fix any layout or interaction issues.
- Move planner scene logic from component-local state into a more formal planner domain/store if needed.
- Connect the current planner scene into a quote-ready payload for `/api/customer-queries`.

## Short-Term
- Add rectangular room editing with measurements.
- Add doors and windows as simple openings.
- Add placeable workstation footprints.
- Add placeable meeting tables, tables, chairs, and storages.
- Add move, rotate, duplicate, delete, zoom, pan, undo, and redo.
- Add fit and collision helpers.
- Add same-footprint alternative suggestions.
- Add seat and capacity summaries.

## Commercial
- Preserve quote submission via `/api/customer-queries`.
- Convert planner state into a quote-ready summary.
- Add save/share scene serialization.

## Data
- Create a normalized planner catalog shape.
- Map existing repo product/category logic into planner items.
- Prepare import strategy for AFC India and Featherlite specs and images.

## Quality
- Add targeted tests for scene math and fit logic.
- Run lint after each meaningful planner milestone.
- Validate desktop and tablet planner usability visually.

## Notes
- The live route now has a first planner shell.
- The goal is a usable office planning studio, not a single-product visual configurator.
