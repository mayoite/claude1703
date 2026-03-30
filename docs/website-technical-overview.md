# Website Technical Overview

## Scope
This document describes the current public website and planner implementation in this repository, with emphasis on the parts that matter for maintenance, release checks, and future extension.

## Stack
- Framework: Next.js App Router
- UI: React 19, TypeScript, custom CSS, utility classes, Framer Motion
- Planner rendering: SVG/2D planner UI plus Three.js-based 3D review components
- State: Zustand for planner document/history/state
- Data: Supabase SSR clients, Nhost backup/catalog helpers, static planner runtime export
- Testing: Jest for unit/integration coverage, Playwright for planner, navigation, and accessibility smoke coverage

## Top-Level Application Shape
- `app/`
  Public routes, API routes, metadata, sitemap, and global CSS entrypoints.
- `components/`
  UI composition split by product area, especially `home/`, `layout/`, and `planner/`.
- `lib/`
  Data access, planner document/store logic, Supabase helpers, Nhost helpers, and shared utilities.
- `data/`
  Static site content and planner-adjacent data payloads.
- `scripts/`
  Planner catalog export, runtime publication, Supabase backup, and Nhost backup utilities.
- `tests/`
  Playwright smoke coverage and Jest suites.

## Primary Public Routes
- `/`
  Marketing homepage and public entry surface.
- `/products`
  Category and product discovery.
- `/planning`
  Structured project intake / planning desk.
- `/planner`
  Public workspace planner for room layout, furniture selection, BOQ context, and export.
- `/contact`
  Contact funnel.
- `/compare`
  Product comparison surface.
- `/quote-cart`
  Quote/cart surface.

## Legacy Route Strategy
The repo keeps compatibility redirects for retired planner-related entry points:
- `/configurator` -> `/planner`
- `/smartdraw` -> `/planner`
- `/workstations/configurator` -> `/planner`
- `/lab` -> `/planner`

These routes are kept for compatibility and route hygiene, but public discovery should point to `/planner`.

## Homepage Architecture
- Entry file: `app/page.tsx`
- Key sections live under `components/home/`
- The current homepage flow places `PartnershipBanner` directly after the hero, followed by the remaining editorial/product sections.
- Route-entry cards in `components/home/InteractiveTools.tsx` now point only to live destinations.

## Planner Architecture
The planner is implemented as a public product surface, not an internal admin tool.

### Planner entry
- Route: `app/planner/page.tsx`
- Boundary: `components/planner/PlannerErrorBoundary.tsx`
- Orchestrator: `components/planner/BlueprintPlanner.tsx`

### Planner shell
`BlueprintPlanner.tsx` owns the page composition:
- left catalog rail
- workspace toolbar
- status bar
- 2D / 3D canvas
- direct edit dock
- project / BOQ strip
- AI helper strip at the end of the flow

### Planner UI components
- `PlannerToolbar.tsx`
  Dense workspace control band. Handles reset, undo/redo, save/load, export, view, and edit mode actions.
- `PlannerCatalogGrid.tsx`
  Left rail for search, category filtering, selected-item staging, and product browsing.
- `PlannerCanvas2D.tsx`
  Main 2D planner surface with item drag, wall drag, room selection, and context actions.
- `PlannerCanvas3D.tsx`
  3D review surface.
- `PlannerGrid.tsx`
  Background grid renderer for the 2D surface.
- `PlannerRoomLayer.tsx`
  Room shell, wall guides, measurement overlays, and room pattern/fill.
- `PlannerItemsLayer.tsx`, `PlannerSelectionLayer.tsx`
  Product placement and selection overlays.
- `PlannerInspector.tsx`
  Direct room, wall, and placed-item actions.
- `PlannerClientBar.tsx`
  Client/project metadata plus BOQ summary strip.
- `PlannerAiPanel.tsx`
  Planner advisory strip. It is intentionally placed after the core planning workflow.

### Planner state and document model
Planner logic lives under `lib/planner/`:
- `store.ts`
  Zustand state store for document history, tool mode, view mode, and selection state.
- `document.ts`
  Document transforms for room, wall, and item mutations.
- `history.ts`
  Undo/redo handling.
- `serializer.ts`
  Planner document serialization and import/export interoperability.
- `importExport.ts`
  Download/upload flow for saved planner files.
- `boq.ts`
  BOQ generation from the live planner document.
- `units.ts`
  Length/area formatting utilities.

### Planner catalog source
- Runtime asset path: `/planner-app/data/planner-catalog.v1.json`
- Supporting scripts in `scripts/` build and reconcile planner catalog/runtime artifacts.

## AI Advisor Surface
- API route: `app/api/ai-advisor/route.ts`
- Request context types: `lib/aiAdvisor.ts`

Current implementation notes:
- Planner advisor context now identifies itself as `planner`, not `configurator`.
- The endpoint now rate-limits requests by request IP/header key.
- Caller-supplied `userId` history lookups were removed from the public flow to avoid trusting arbitrary client identity.
- Fallback summaries now distinguish planner context from generic/global context.

## Supabase and Nhost
### Supabase
- Public/server SSR clients live in `lib/supabase/`
- Admin-style backup and audit scripts live in `scripts/backup_supabase.ts` and related utilities
- Migrations live under `supabase/migrations/`

### Nhost
- Nhost catalog/backup helpers live in:
  - `lib/nhostCatalog.ts`
  - `lib/nhostBackup.ts`
- Nhost sync/audit scripts:
  - `scripts/sync_nhost_backup.ts`
  - `scripts/audit_nhost_backup.ts`

## SEO and Discovery
- Planner is indexable as a public route.
- Sitemap is generated in `app/sitemap.ts`
- Redirect aliases are kept for compatibility, but `/planner` is the canonical planning route in public discovery.

## Testing Surface
### Jest
- `npm test`

### Playwright
- Planner smoke: `tests/planner-react.spec.ts`
- Navigation smoke: `tests/navigation-smoke.spec.ts`
- Accessibility smoke: `tests/accessibility.spec.ts`

## Release Notes Relevant To This Refactor
- The planner is now positioned as a public workspace planner, not a configurator-lab surface.
- Legacy planner URLs redirect cleanly to `/planner`.
- Floating assistant / quick-contact overlays are suppressed on planner routes so the canvas remains the focal surface.
- Toolbar density and canvas sizing were adjusted to prioritize the planning surface.
- The selected-item staging card now lives in the catalog rail instead of the edit dock.

## Current Operational Caveats
- Some broader repo surfaces remain noisy because the worktree contains many unrelated changes outside the planner scope.
- Product-page accessibility smoke showed timeouts during one validation pass; those failures were not on the planner route itself and should be rechecked separately before a production release.
- Package scripts were pruned to remove commands whose target files are not present in the current tracked repo surface.
