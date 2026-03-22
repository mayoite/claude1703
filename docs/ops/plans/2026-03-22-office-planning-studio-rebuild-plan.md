# Office Planning Studio Rebuild Plan

Last updated: 2026-03-22 11:22:08 +05:30
Owner: Codex
Status: Active

## Objective
- Rebuild `/configurator` into a premium, site-native office planning studio.
- Replace the removed `Simple2DConfigurator` experience with a useful, interactive, 2D-first planner.
- Preserve route ownership, quote submission pathways, product/spec data, and optional 3D model references where they already exist.

## Product Position
- This is not a generic floor-plan app.
- This is a planning and query tool tied to real office furniture, real dimensions, real photos, and quote-ready outputs.
- The user should be able to answer:
  - what fits in my room
  - how many seats can I get
  - what alternatives fit this footprint
  - what should I quote for this exact office

## Experience Principles
- Eliminate blank-canvas anxiety.
- Make the first useful result achievable within 60 seconds.
- Keep the planner visually aligned with the website theme.
- Show real product images/specs in the inspector even when a full 3D model does not exist.
- Make all query results visual first, with clear explanations and low-friction next actions.

## V1 Scope
- Room setup:
  - rectangular room creation
  - editable room width/depth
  - door and window markers
  - snap grid and dimension overlays
- Planner interactions:
  - drag, place, move, rotate, duplicate, and delete furniture
  - zoom, pan, undo, and redo
  - object selection and inspector drawer
- Product families:
  - workstations
  - meeting tables
  - tables
  - chairs
  - storages
- Query actions:
  - what fits here
  - increase seats
  - reduce footprint
  - show premium alternatives
  - show lower-budget alternatives
  - compare similar items
- Commercial actions:
  - shortlist
  - request quote from current layout
  - scene save/load structure

## Non-Goals For V1
- Full-scene photoreal 3D.
- Exhaustive finish rendering for every product/color combination.
- Runtime scraping of partner websites.
- VR/AR delivery in the first implementation pass.

## Technical Direction
- Route:
  - keep `/configurator`
- 2D interaction layer:
  - use `react-konva` and `konva`
- Optional 3D preview:
  - use existing `three`, `@react-three/fiber`, and `@react-three/drei`
- Scene ownership:
  - keep a renderer-agnostic internal scene model
- Data:
  - normalize product/spec data into an internal planner-ready catalog
- Integrations preserved:
  - `/api/customer-queries`
  - product/category mapping
  - optional model URLs already present in the repo

## Core Domain Model
- `PlannerScene`
- `RoomBoundary`
- `Opening`
- `PlannerZone`
- `PlacedItem`
- `PlacedGroup`
- `ProductFootprintVariant`
- `FinishVariant`
- `VisualAsset`
- `LayoutQueryRequest`
- `LayoutQueryResult`

## Data Strategy
- Seed sources:
  - `afcindia.in`
  - `featherlitefurniture.com`
- Store internally:
  - category
  - product family
  - product name
  - variant
  - width, depth, height
  - capacity or seat count
  - footprint type
  - images
  - finishes
  - technical notes
  - optional CAD/SKP/3D references
- Do not depend on partner sites at runtime.

## Delivery Phases
### Phase 1: Foundation
- define planner types
- create planner state/store
- scaffold planner shell UI
- create live plan/checklist/todo/handover docs

### Phase 2: Room And Canvas
- create room editor
- add scale/grid/measurement system
- add openings
- add selection and transform controls

### Phase 3: Catalog Placement
- create placeable product registry
- add footprint rendering for each product family
- wire selection drawer with photos/specs

### Phase 4: Query Engine
- implement fit checks
- implement seat and capacity summaries
- implement same-footprint alternatives
- implement in-room comparisons

### Phase 5: Commercial Layer
- shortlist and summary bar
- quote handoff
- scene serialization

### Phase 6: Enhancement
- selective 3D preview
- richer finishes
- future 3D/VR/AR compatibility layer

## Immediate Build Order
1. Stabilize the current route after the component swap.
2. Add planner operating docs and working protocol.
3. Introduce planner domain types and state scaffold.
4. Replace the current narrow desk configurator with a real room canvas shell.
5. Add the first placeable product family and inspector.

## Verification Standard
- Lint changed files.
- Verify `/configurator` still renders.
- Verify no broken import remains from `Simple2DConfigurator`.
- Verify scene state and query helpers with unit coverage where possible.
- Verify desktop and tablet usability before claiming progress.

## Operating Rules
- Update the live checklist at least every 10 minutes during active work.
- Update the checklist before changing subsystems.
- Update the handover before stopping for any reason.
- Keep the TODO tracker focused on the next concrete build tasks.

## Current Context
- `Simple2DConfigurator` has been removed.
- `/configurator` currently points to `components/configurator/Configurator.tsx`.
- That older configurator is only a temporary bridge, not the final office planning studio.
