# Website Walkthrough

## Purpose
This is a practical walkthrough of the public website as a visitor or sales/planning user experiences it today.

## 1. Homepage
Route: `/`

The homepage is the public front door. It should answer three questions quickly:
- who the company is
- what kind of workspace/product help is available
- where the user should go next

Current flow:
- hero
- partnership banner
- supporting product and trust sections
- route-entry cards for planning-related surfaces

What a user should understand from the first screen:
- this is a workspace and furniture brand
- there is a live planner available
- there is a planning/project intake path
- there are product-browsing routes for direct exploration

## 2. Product Discovery
Routes:
- `/products`
- `/products/[category]`
- `/products/[category]/[product]`

This is the catalog exploration path.

Typical user flow:
1. Open `/products`
2. Choose a category or subcategory
3. Inspect product details
4. Add products to compare or quote-related flows

Expected outcome:
- users can discover furniture lines before planning
- product detail pages support browsing, comparison, and follow-up action

## 3. Planner Entry
Primary route: `/planner`

Compatibility redirects:
- `/configurator`
- `/smartdraw`
- `/workstations/configurator`

A visitor entering any of the old planning URLs should land on the same public planner surface.

## 4. Planner Workflow
The planner is intended to feel like a workspace tool for a customer or consultant, not an internal ops panel.

### 4.1 Catalog rail
Left side of the planner:
- search input
- category filter
- selected-item staging card
- product list

Current intended behavior:
- `Workstations` is the default category
- `All categories` is available at the end of the category list
- when a product is selected, the staged product card appears in the same rail
- the user can add the staged product directly to the room from that rail

### 4.2 Workspace toolbar
Top of the workspace column:
- reset
- undo / redo
- save / load
- export PDF
- open 3D
- grid on/off
- canvas size
- draw room / move items / resize walls / inspect room
- quick layout presets

The toolbar is intentionally dense and attached to the workspace column so it reads as canvas control, not page chrome.

### 4.3 Canvas
The canvas is the focal surface.

What a user can do:
- inspect the room shell
- move placed items
- select walls
- switch view modes
- use the visible planning grid for placement orientation

Current visual expectations:
- the grid should be visible when enabled
- the room shell should not bury the grid
- the canvas should occupy more space than surrounding control cards

### 4.4 Direct edit dock
Below the canvas:
- room editing actions
- wall actions
- interaction hints
- room snapshot metrics

This area is for edits after something is selected on canvas.

Typical flow:
1. Select room, wall, or item
2. Use the dock to adjust the selected object
3. Return to the canvas immediately

### 4.5 Project / BOQ strip
Below the edit dock:
- client name
- project name
- prepared by
- plan load summary
- BOQ preview

This turns the planning session into something client-facing and export-ready.

### 4.6 AI helper strip
At the end of the planner flow:
- lightweight planning prompt entry
- planner-aware metrics
- optional recommendation output

It is intentionally placed after the core planning workflow so it does not compete with the canvas.

## 5. Planning Desk
Route: `/planning`

This is the structured project-intake path.

Use this route when:
- the user is starting a project conversation
- the project needs a more guided intake than the live planner
- the next step is consultation rather than direct room drawing

## 6. Contact
Route: `/contact`

Use this route when:
- the user is ready to ask for support, consultation, or follow-up
- the planner or catalog work needs to convert into a real business conversation

## 7. Compare and Quote Cart
Routes:
- `/compare`
- `/quote-cart`

These routes support shortlist and commercial follow-through after browsing or planning.

## 8. Public Behavior Expectations
### Redirect behavior
- `/configurator` should resolve to `/planner`
- `/smartdraw` should resolve to `/planner`
- there should be no loop or dead-end for those URLs

### Overlay suppression on planner
Floating assistant / quick-contact surfaces should not cover the planner canvas. The planner should feel clear and operational, not interrupted by extra launchers.

### Planner interaction priorities
The intended order of importance is:
1. canvas
2. catalog selection
3. direct edit dock
4. project / BOQ strip
5. AI helper strip

## 9. Practical QA Walkthrough
For a manual release pass, walk the site in this order:
1. Open `/`
2. Verify the planning entry points use live routes only
3. Open `/planner`
4. Confirm `Workstations` is the default catalog category
5. Select a product and confirm the staged product card appears in the catalog rail
6. Add the product to the room
7. Confirm placed count and BOQ update
8. Switch grid on/off and verify the grid is visible
9. Switch 2D/3D
10. Save and reload a plan
11. Check `/configurator` and `/smartdraw` redirects
12. Open `/products`, a category page, and a product detail page
13. Open `/planning`
14. Open `/contact`

## 10. Current Experience Goals
The intended public experience is:
- confident and product-facing
- visually calm but not bland
- canvas-first in the planner
- no dead internal-tool language
- no missing links across the public routes
