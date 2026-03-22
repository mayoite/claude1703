# Configurator Session Handover — 2026-03-23

## What Was Built / Changed This Session

### 1. Catalog Rebuild (`lib/planner/catalog.ts`)

**Meeting table seat counts corrected (+2 each):**
| Variant | Dimensions | Seats (was → now) |
|---|---|---|
| mt-1800-900 | 1800 × 900 | 4 → 6 |
| mt-2400-1200 | 2400 × 1200 | 6 → 8 |
| mt-3000-1200 | 3000 × 1200 (2-piece) | 8 → 10 |
| mt-3600-1200 | 3600 × 1200 (2-piece) | 10 → 12 |
| mt-4500-1200 | 4500 × 1200 (3-piece) | 14 → 16 |

**CAD-style color palette (matches professional floor plan reference):**
- Workstations: amber `#F2DFA0` / stroke `#A07820`
- Meeting tables: sage green `#C8DDB8` / stroke `#5A8040`
- L-shape workstations: steel blue `#B8CEE8` / stroke `#3A6A9A` (overridden per-item in canvas render, not in CATEGORY_META)
- Chairs: mid-grey `#8A8A8A` / stroke `#444444`
- Storages: light grey `#D8D8D8` / stroke `#999999`
- Other items: light blue `#B8D4E8` / stroke `#5A8AAA`

---

### 2. Canvas Rendering (`components/configurator/Configurator.tsx`)

**Room boundary:**
- Thick 4px black stroke, sharp corners (cornerRadius=0), white fill
- Previously: thin 2px grey, rounded corners

**Grid:**
- Dotted lines `dash={[4,6]}`, opacity 0.35
- Drawn AFTER room fill rect so they appear on top (previously hidden beneath white room background)

**Item footprints:**
- Shadow: `shadowBlur=4`, `shadowOffsetX/Y=2`, `rgba(0,0,0,0.28)` — CAD drop shadow style
- Selected item: `shadowBlur=10`
- L-shape override: blue fill `#B8CEE8` / stroke `#3A6A9A` detected via `item.variant.footprintShape === "l-shape"`

**Workstation internal lines (backrest/dividers):**
- Dark brown on amber: `rgba(100,70,10,0.25)` fill, `rgba(100,70,10,0.5-0.6)` stroke
- Previously: white-on-dark (invisible on the new amber)

**Chair CAD symbol:**
- Fill `#5A5A5A`, stroke `#2A2A2A`
- Backrest bar + seat body + front arc

**Canvas background:** flat `#e8e8e8` (CAD paper grey)

**Removed:** canvas header bar ("Planner / Starter office — 10 seats placed")

**Canvas height:** increased from `calc(100vh-148px)` to `calc(100vh-48px)` (+100px)

---

### 3. Layout Restructure

**Right rail removed entirely** — canvas now fills full width between left rail and viewport edge.

**Left rail:** `w-[400px]` (was `w-72`/288px). Sticky, `calc(100vh-48px)` tall.

**Below-canvas strip** (horizontally scrollable, `overflow-x-auto`):
- "Product details" (inspector) — 320px
- "Ask the plan" (AI query) — 360px
- "Doors and windows" — 320px
- "Next move" — 280px

**Action bar:** `ml-10` left margin, sits between canvas and the below-canvas strip.

**"Choose your office shell"** (presets) removed from right rail — was a duplicate of left rail content.

**Opening controls:** "Width mm" field removed (door resizable on canvas). Now shows Type / Wall / Offset only in a 2×2 grid (col-span-2 for offset).

---

### 4. Rotation Bug Fix

`rotateSelectedItem()` previously clamped position using `interactionPaddingMm` which caused items near walls to jump when rotated. Fixed to clamp to `[0, room.widthMm - rotatedWidth]` — no forced padding on rotate.

---

### 5. Reset Canvas

`resetCanvas()` restores compact-studio preset (room + openings + seeded workstations). History cleared, stored scene cleared.

---

## Current File Map

| File | Role |
|---|---|
| `lib/planner/catalog.ts` | LIBRARY + CATEGORY_META — all products, variants, colors |
| `lib/planner/types.ts` | TypeScript types — PlannerItem, Opening, RoomState, etc. |
| `lib/planner/utils.ts` | createPlannerItem, buildSeededWorkstations, createSceneFromPreset |
| `lib/planner/sceneStorage.ts` | localStorage read/write/clear |
| `components/configurator/Configurator.tsx` | Main component — all state, canvas render, panels |
| `components/configurator/panels/RoomSetupPanel.tsx` | Left rail room dimensions panel |
| `components/configurator/canvas/PlannerToolbar.tsx` | Tool selector + grid toggle bar above canvas |
| `components/configurator/canvas/constants.ts` | GRID_STEP_MM, SNAP_STEP_MM, INTERACTION_PADDING_MM |
| `components/configurator/canvas/openings.ts` | getOpeningTitle, getOpeningDefaultWidthMm, isDoorOpening |
| `components/configurator/ui/CollapsibleSection.tsx` | Shared collapsible panel component |
| `app/configurator/page.tsx` | Page wrapper — metadata + `<Configurator />` |

---

## Known Issues / Remaining Work

1. **"Planning boundary" text** still appears inside the canvas room rect (canvas Text element at roomX+18, roomY+18). May want to remove.
2. **Legend** in top-right of canvas still shows "Seat marker" with a circle — not updated to reflect chair CAD symbol.
3. **L-shape CAD overlay** — no internal detail lines rendered (workstation backrest/divider pass only handles `linear-shared` and `linear-non-sharing`). L-shape just shows as a flat blue rectangle.
4. **"Choose your office shell" / presets** — removed from UI entirely. If user wants preset selection back, add to left rail below RoomSetupPanel.
5. **AI query** (`Ask the plan`) requires `OPENAI_API_KEY` env var — route at `app/api/planner/suggest/route.ts`.
6. **Mobile layout** — below-canvas strip not shown on mobile (only inspector + left rail in stacked grid). Consider adding.
7. **History** (undo/redo) — walls drawn with the wall tool accumulate correctly but the "history returns" bug was reported. Not fully investigated — may be a stale ref issue on wall draft commits.
