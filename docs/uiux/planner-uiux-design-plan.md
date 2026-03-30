# One&Only Workspace Planner — Comprehensive UI/UX Design Plan

## Scope (Planner-only)

- In scope: `/planner` workspace planning experience, including catalog browsing, 2D layout editing, 3D review, inspector controls, import/export, and customer-facing PDF generation.
- Out of scope (for this plan): marketing pages, product PDP redesign outside what’s required to support planner catalog quality and the “go from plan → quote” workflow.
- Primary target runtime: Chrome (desktop-first), with responsive behavior and mobile minimum viability.

## Current Product Reality (Repo Baseline)

- Planner entry: [planner/page.tsx](file:///d:/Claude1703/app/planner/page.tsx#L1-L18) mounts [BlueprintPlanner](file:///d:/Claude1703/components/planner/BlueprintPlanner.tsx).
- Tech stack: Next.js + Tailwind + Radix primitives; Planner uses React canvas + R3F/Three (2D/3D), Zustand store, React Query.
- Brand tokens already exist (colors, radii, spacing base): [theme-tokens.css](file:///d:/Claude1703/app/theme-tokens.css).
- Brand fonts already exist: Cisco Sans + Helvetica Neue: [fonts.ts](file:///d:/Claude1703/lib/fonts.ts).

## Repo Audit Snapshot (Verified 2026-03-30)

- `npm run build`: PASS
- `npm test`: PASS (`jest --forceExit`, 34 tests)
- `npm run lint`: PASS with 131 warnings, primarily Tailwind class-order drift and a few unused planner props/locals
- `npx playwright test tests/planner-react.spec.ts --reporter=list`: FAIL (5 of 6 tests)

### Immediate repo-level findings

- This plan document still contains legacy encoding corruption below this section. Treat that as a documentation defect until the remaining text is normalized.
- The planner UI contract has drifted away from the Playwright smoke suite:
  - The catalog search placeholder is now `Search products`, but the test expects `Search all items...`.
  - The staged-product CTA is now `Add item to canvas`, but the test expects `ADD`.
  - The catalog loading copy is now `Updating inventory`, but the test expects `Loading planner catalog`.
  - The empty-search copy is now `No matches found`, but the test expects `No products match the current search.`
  - The route no longer exposes the `WORKSPACE ENGINE` heading asserted by the test.
- The current audit docs in `docs/uiux/deliverables/2026-03-30` overstate planner verification because `npm test` only covers Jest. The planner Playwright suite is not part of the default `test` script.
- The repository is in a heavily modified state across many unrelated files. Any push must isolate audit-only changes from the rest of the working tree.

---

## 1) Competitor UI Pattern Analysis (Planner + Catalog Context)

### Competitors covered (direct, planner-adjacent)

- RoomSketcher (desktop app-style planner UX; inspector-first editing)
- Floorplanner (web planner with object library + 2D/3D toggle)
- Homestyler (web planner + room creation workflows, AI planner onboarding)
- Coohom (web planner + massive library + guided onboarding)
- Roomle (3D product configurator + room designer positioning)
- AFC India (catalog IA + product storytelling patterns used by planner catalog sources)
- Featherlite (catalog mega-IA + spaces-first grouping; relevant for product discovery + “spaces → plan” bridge)

### Screenshot set (capture + annotation checklist)

This plan references screenshots from:

- Provided stakeholder screenshots (RoomSketcher editor UI, Floorplanner demo UI, Homestyler UI).
- Additional screenshots captured via browser tooling (AFC/Featherlite pages, etc.).

To make the screenshots “audit-grade” and easy to review in Chrome:

- Capture at 1440×900 and 375×812 (mobile) in Chrome stable.
- Include at least: home/landing, editor canvas, object library, properties/inspector, export/share.
- For each screenshot, apply callouts (A, B, C…) and add a short legend.

**Required screenshot filenames (attach to stakeholder deck)**

- `competitor-roomsketcher-editor.png` (provided) — editor + right inspector
- `competitor-floorplanner-demo.png` (provided) — object library + canvas + 2D/3D
- `competitor-homestyler-editor.png` (provided) — left tool palette + canvas grid
- `competitor-coohom-home.png` — landing + “Start for free” primary CTA
- `competitor-roomle-configurator.png` — positioning + conversion CTAs
- `competitor-afc-home.png` — home IA + product category access
- `competitor-afc-pdp.png` — PDP tabbed content pattern (overview/gallery/dimensions/docs)
- `competitor-featherlite-home.png` — IA breadth + categories
- `competitor-featherlite-products.png` — products hub + category cards

### RoomSketcher (Editor UX benchmark)

**Navigation structure**

- “App-like” top toolbar for global tools (undo/redo, 2D/3D, measurement mode).
- Right inspector panel for selected object properties (dimensions, materials, constraints).
- Canvas occupies majority of viewport; side panels are persistent and content-dense.

**Color scheme**

- Very light neutral canvas background with muted UI chrome.
- Accent uses a single strong hue for selection/handles; de-emphasizes non-selected UI.

**Typography system**

- Functional sans-serif with high legibility and compact density in inspector (small labels, clear numeric inputs).

**Interaction flows**

- Select object → contextual handles appear on-canvas → right panel shows editable properties.
- Direct manipulation first; typed/numeric refinement second.

**Unique design elements**

- Constraint-like editing affordances (resize handles + real-time dimension labels).
- Inspector groups that expose only what matters for the selected object type.

**Annotated screenshot legend (for `competitor-roomsketcher-editor.png`)**

- A: Object selection handles + dimension affordances on canvas
- B: Top toolbar for mode switching and global actions
- C: Right inspector with “Default Size” and numeric fields (width/height)
- D: “Replace Materials” grouping (bulk appearance editing pattern)

**Takeaways to adopt**

- Inspector should be selection-driven and strongly typed (wall vs item vs room).
- “Canvas handles + inspector precision” is the fastest path for pros and novices.

### Floorplanner (Web planner benchmark)

**Navigation structure**

- Left rail: object library with categories + search + results grid.
- Canvas center: floorplan with measurement overlays.
- Top-right: view controls (2D/3D toggle) + quick actions.

**Color scheme**

- Soft neutral UI with subtle borders; blue accent for selection and active states.

**Typography system**

- Modern sans; slightly larger labels than RoomSketcher; “consumer-friendly” readability.

**Interaction flows**

- Browse objects → drag/drop into canvas → contextual edit controls appear.
- 2D/3D toggle is always visible, encouraging review without leaving the workflow.

**Unique design elements**

- Clear “Objects/Project/Build” left navigation, separating tasks into modes.
- Always-on measurement overlays that teach scale.

**Annotated screenshot legend (for `competitor-floorplanner-demo.png`)**

- A: Left navigation (Project/Build/Objects) and selected rail state
- B: Library search + filters + grid/list toggles
- C: Canvas measurement annotations (continuous scale confidence)
- D: 2D/3D toggle cluster placed near the top-right (high discoverability)

**Takeaways to adopt**

- Keep view switching highly discoverable and one-click.
- Use measurement overlays as a “trust signal” during placement and resizing.

### Homestyler (Hybrid planner + onboarding benchmark)

**Navigation structure**

- Left vertical tool stack (“Create room”, “Customize”, “Model library”) with expanded panel.
- Canvas center; right inspector appears contextually (in many flows).

**Color scheme**

- Dark text on light surfaces; bright accent for “active tool” + call-to-action.

**Typography system**

- Mixed sizes; panel headings moderately large for approachability.

**Interaction flows**

- Primary workflow starts with “Create room” step; then walls/doors/windows.
- Tool-driven creation flow (good for novices) + direct manipulation.

**Unique design elements**

- Strong “workflow gating”: clearly communicates the next action.
- AI planner onboarding pattern (multi-step form that produces an initial layout).

**Annotated screenshot legend (for `competitor-homestyler-editor.png`)**

- A: Left workflow module (Create/Import) and “Draw walls” options
- B: Door/window library embedded in the same flow
- C: Grid canvas with active tool state
- D: Inline “tips” overlays (micro-learning)

**Takeaways to adopt**

- Offer a “guided first plan” path for novices, without blocking experts.

### Coohom (Scale + library benchmark)

**Navigation structure**

- Marketing-first landing with clear “Start for free” primary CTA.
- Strong segmentation across products (floor planner, room planner, AI).

**Interaction flows**

- Clear steps: start plan → arrange → visualize → share.

**Takeaways to adopt**

- Reduce ambiguity: label the workflow steps near the top of the planner and in empty states.

### Roomle (3D configurator + lead-gen benchmark)

**Navigation structure**

- “Product Configurator / 3D Viewer / Room Designer” triad; conversion CTAs (“Book discovery”, “Get started”).

**Unique design elements**

- Metrics-led credibility blocks (conversion, session duration uplift) as persuasion.

**Takeaways to adopt**

- Add an optional “export-to-quote” narrative in the planner UI (trust + conversion).

### AFC India + Featherlite (Catalog IA patterns that should influence the planner catalog UX)

These are crucial because the planner catalog baseline pulls from AFC sources, and users will mentally compare “plan assets” to “real product content.”

**AFC patterns**

- Global search, category exploration blocks, and PDP tab anchors (overview/gallery/dimensions/documents) that keep spec discovery structured.
- Planner should mirror this with: “Preview → Specs → Downloads” for catalog items.

**Featherlite patterns**

- Very broad product IA with “Spaces” and “Products” as first-class navigation.
- Planner can adopt a “Spaces-first preset” entry (“Focus 4”, “Meeting 6”, etc.) and keep “Products” as the library.

---

## 2) Audit: Existing Non-Functional Features + Incorrect Models

### Severity scale

- P0: Breaks planning/export or causes data loss
- P1: High user-visible trust erosion or blocks key task completion
- P2: Degrades UX/productivity; workaround exists
- P3: Cosmetic or edge-case quality issues

### Functional & UX issues (Planner surface)

| ID     | Area         | Issue                                                                                             | Severity | User impact                                                 | Evidence                                                                                    |
| ------ | ------------ | ------------------------------------------------------------------------------------------------- | -------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| PL-001 | Catalog      | Planner requires `/planner-app/data/planner-catalog.v1.json`; missing asset must show clear error | P0       | Planner becomes unusable; users cannot start planning       | [planner-react.spec.ts](file:///d:/Claude1703/tests/planner-react.spec.ts#L173-L199)        |
| PL-002 | Import       | Blueprint import can silently fall back to an empty document on parse errors                      | P1       | Users think import succeeded but lose their work/context    | [serializer.ts](file:///d:/Claude1703/lib/planner/serializer.ts#L239-L264)                  |
| PL-003 | Import model | Room outline reconstruction is simplistic and order-dependent                                     | P1       | Incorrect room shapes; resizing/measurement trust collapses | [serializer.ts](file:///d:/Claude1703/lib/planner/serializer.ts#L128-L162)                  |
| PL-004 | Versioning   | Serializer hard-fails on unknown versions (no UX recovery)                                        | P1       | Users cannot load older/newer exports; support burden       | [serializer.ts](file:///d:/Claude1703/lib/planner/serializer.ts#L218-L237)                  |
| PL-005 | Onboarding   | “Guided first plan” exists only via presets; discoverability varies                               | P2       | Novices stall; experts are fine                             | [BlueprintPlanner](file:///d:/Claude1703/components/planner/BlueprintPlanner.tsx#L673-L706) |
| PL-006 | Mobile       | Mobile layout parity is not guaranteed for catalog/inspector/AI panels                            | P2       | Mobile users can’t complete the planning loop               | [BlueprintPlanner](file:///d:/Claude1703/components/planner/BlueprintPlanner.tsx#L736-L987) |
| PL-007 | Keyboard UX  | Hotkeys exist but lack an explicit “shortcuts help” surface                                       | P2       | Power users miss accelerators; discoverability gap          | [BlueprintPlanner](file:///d:/Claude1703/components/planner/BlueprintPlanner.tsx#L116-L154) |

### Data/model correctness issues (Planner catalog + product specs)

| ID     | Area                   | Issue                                                        | Severity | User impact                                               | Evidence                                                                                                          |
| ------ | ---------------------- | ------------------------------------------------------------ | -------- | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| DM-001 | Catalog media          | Large volume of invalid gallery image paths in product data  | P1       | Visual preview breaks; users lose trust in catalog assets | [product-quality-audit.md](file:///d:/Claude1703/docs/audit/product-quality-audit.md#L7-L20)                      |
| DM-002 | Specs                  | Missing materials/dimensions/documents for many SKUs         | P1       | Planner BOQ/spec export is incomplete; quoting errors     | [product-quality-audit.md](file:///d:/Claude1703/docs/audit/product-quality-audit.md#L7-L20)                      |
| DM-003 | Canonical identity     | Duplicate “name keys” across categories (Fluid-X/Halo/Casca) | P2       | Confusing search + mis-association in presets/BOQ         | [supabase-schema-audit.md](file:///d:/Claude1703/docs/ops/audits/supabase-schema-audit.md#L45-L48)                |
| DM-004 | Planner catalog parity | Baseline vs Supabase dimension/category mismatches can exist | P2       | Wrong footprint in plan vs real spec; layout errors       | [report-planner-shared-mismatches.ts](file:///d:/Claude1703/scripts/report-planner-shared-mismatches.ts#L91-L137) |
| DM-005 | Alias parity           | Alias rows differ between Supabase and Nhost                 | P3       | Some legacy links fail; mostly affects SEO/legacy         | [nhost-parity-audit.md](file:///d:/Claude1703/docs/ops/audits/nhost-parity-audit.md#L7-L18)                       |

### Non-functional quality issues affecting planner credibility

| ID     | Area              | Issue                                                                           | Severity | User impact                                 | Evidence                                                                                         |
| ------ | ----------------- | ------------------------------------------------------------------------------- | -------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| NQ-001 | Perceived trust   | Console noise from fallback paths (when backend tables missing)                 | P1       | Users distrust tool; support time increases | [full_audit_summary.md](file:///d:/Claude1703/docs/audit/full_audit_summary.md#L26-L35)          |
| NQ-002 | Content structure | Many pages miss clear H1 signals (affects trust/accessibility on some surfaces) | P2       | “Unfinished” perception; SEO signal quality | [visual_findings_desktop.md](file:///d:/Claude1703/docs/audit/visual_findings_desktop.md#L1-L18) |

---

## 3) Refined UI Concept (Competitor-inspired, brand-consistent, WCAG 2.1 AA)

### Design goals

- Fast: “place, adjust, export” in under 3 minutes for a first-time user.
- Trustworthy: visible measurements, clear spec sourcing, and predictable export.
- Elegant: premium brand feel matching One&Only’s dark-midnight + bronze palette.
- Accessible: keyboard-first editing parity and WCAG 2.1 AA for UI surfaces.

### Information architecture (Planner)

**Primary modes**

- Plan (2D): layout editing (draw/move/resize), measurements, snapping, wall editing.
- Review (3D): spatial check and “presentation-ready” visuals.
- Outputs: BOQ list, export PDF, export plan JSON, “request quote” handoff.

**Primary panels**

- Catalog panel (left): categories, search, item preview, “Add to plan”.
- Inspector (right): selection-driven properties and actions.
- Client/Project details (collapsible): used for customer PDF and quote context.

### Major screen wireframes (ASCII)

#### A) Planner Workspace (Desktop)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Top: Planner Toolbar (Undo/Redo • View 2D/3D • Tool • Grid • Export)      │
├───────────────┬───────────────────────────────────────────┬──────────────┤
│ Catalog Panel │ Canvas (2D or 3D)                          │ Inspector     │
│ - Search      │ - Measurements overlay                     │ - Selection   │
│ - Categories  │ - Selection handles                        │ - Properties  │
│ - Results     │ - Drag/drop + snap                         │ - Actions     │
│ - Preview     │                                           │ - Help tips   │
├───────────────┴───────────────────────────────────────────┴──────────────┤
│ Bottom: Status + shortcuts hint + selection summary (non-modal, inline)   │
└──────────────────────────────────────────────────────────────────────────┘
```

#### B) Planner Workspace (Mobile)

```
┌─────────────────────────────┐
│ Compact Toolbar + View toggle│
├─────────────────────────────┤
│ Canvas (2D/3D)               │
├─────────────────────────────┤
│ Bottom Sheet (tabs):         │
│  [Catalog] [Inspector] [BOQ] │
└─────────────────────────────┘
```

#### C) Export & Quote Handoff

```
┌────────────────────────────────────────────┐
│ Export modal                                │
│ - Customer PDF (includes plan snapshot)     │
│ - BOQ CSV / PDF                             │
│ - Plan JSON (for re-edit)                   │
│ - Request quote (send BOQ + client details) │
└────────────────────────────────────────────┘
```

### Component library (Planner-specific)

**Core**

- AppToolbar (sticky, responsive, keyboard navigable)
- ToolToggleGroup (Move/Draw/Resize/Measure)
- ViewSwitch (2D/3D)
- StatusToast + StatusBar
- CatalogSearch (input + clear + keyboard focus ring)
- CatalogCard (preview, key specs, add button)
- InspectorPanel (sectioned, selection-specific forms)
- NumericField (unit-aware, stepper, validation)
- SegmentedTabs (e.g., Inspector: “Details / Specs / Downloads”)
- ExportModal (multi-output with progress states)

**Canvas accessibility support**

- SelectionList (readable list of placed items with focus + actions)
- LiveRegionStatus (announces selection changes, errors, export progress)

### Design system (tokens + rules)

**Color**

- Use existing semantic tokens where possible: `--color-primary`, `--color-accent`, `--surface-*`, `--text-*` from [theme-tokens.css](file:///d:/Claude1703/app/theme-tokens.css#L102-L189).
- Planner “dark shell” stays premium (inverse surfaces) while the canvas stays white for contrast and printability.

**Typography**

- Base UI: Cisco Sans (UI labels, buttons, navigation). Backup: Helvetica/Arial.
- Document export (PDF): Helvetica is already used in code; keep for consistency and predictable embedding: [BlueprintPlanner](file:///d:/Claude1703/components/planner/BlueprintPlanner.tsx#L382-L409).
- Type scale (desktop): 12 / 14 / 16 / 20 / 24 with 1.35–1.5 line heights.

**Spacing grid**

- 4px base grid (already implied by `--spacing: 0.25rem`): [theme-tokens.css](file:///d:/Claude1703/app/theme-tokens.css#L206-L214).
- Layout rules: 12-column max container; side panels snap to 220/280/320 widths.

**Elevation**

- Use existing shadow tokens (`--shadow-*`) for panels; limit to two elevation levels to keep focus on canvas.

### WCAG 2.1 AA compliance checklist (Planner)

- Contrast: all text ≥ 4.5:1; large text ≥ 3:1; icons must have contrast against surfaces.
- Focus: visible focus ring for all interactive controls; consistent order (left → center → right).
- Keyboard:
  - Tool switching and view switching accessible.
  - Add item: keyboard-select catalog card → “Add” button.
  - Selection list provides non-canvas path to select/move/rotate/delete.
- Motion: respect reduced motion (`useReducedMotion` already present): [BlueprintPlanner](file:///d:/Claude1703/components/planner/BlueprintPlanner.tsx#L99-L100).
- Status announcements: error states (catalog load fail, import fail, export fail) must be announced via ARIA live region.

---

- User satisfaction: +1.0 point in post-export “Was this easy?” survey.
- Drop-off reduction: -15% exits within first 30 seconds.

### Phase 4 — Model quality & catalog integrity

**What ships**

- Automated validation pipeline for planner catalog media/spec completeness.
- Prioritized fix of invalid image paths and missing specs for top SKUs.
- Resolve duplicate name keys and alias mismatches impacting search/BOQ.

**Success metrics**

- Broken preview rate: -80% missing/invalid images in planner.
- Support: -40% tickets about missing specs/docs.

---

## 5) Separate Detailed Checklist (7 Phases)

### Phase 1 — Discovery, Benchmarking, and Scope Lock

- [ ] Confirm planner-only scope boundaries and exclusions
- [ ] Validate target user types, top tasks, and planning scenarios
- [ ] Consolidate competitor screenshots and annotations
- [ ] Extract direct UI patterns from RoomSketcher, Floorplanner, and Homestyler
- [ ] Extract catalog and conversion patterns from AFC India, Featherlite, Coohom, and Roomle

- [ ] Finalize success criteria for usability, trust, and output quality

### Phase 2 — Baseline Audit and Risk Mapping

- [ ] Audit current planner entry flow and shell behavior
- [ ] Validate catalog loading dependencies and failure states
- [ ] Review import, export, and document-versioning behavior
- [ ] Map room, wall, and item selection flows
- [ ] List model-quality issues affecting planner accuracy
- [ ] Rank issues by severity, user impact, and implementation risk

### Phase 3 — Information Architecture and Core UX Structure

- [ ] Finalize planner modes for Plan, Review, and Outputs
- [ ] Define responsibilities for catalog, canvas, inspector, and BOQ regions
- [ ] Define desktop layout hierarchy and panel priorities
- [ ] Define mobile layout hierarchy and bottom-sheet behavior
- [ ] Finalize empty-state flow for first-time users
- [ ] Define shortcut-help, onboarding, and next-step cues

### Phase 4 — Canvas, Selection, and Editing Experience

- [ ] Define room editing interactions and resize behavior
- [ ] Define wall selection, wall controls, and measurement presentation
- [ ] Define item placement, movement, rotation, duplication, and deletion flows
- [ ] Refine on-canvas handles, highlights, and visual selection states
- [ ] Add non-canvas fallback navigation for selection and edits
- [ ] Validate clarity of 2D and 3D switching behavior

### Phase 5 — Catalog, Inspector, and Project Details

- [ ] Upgrade catalog browsing, search, and category filtering behavior
- [ ] Define staged selected-product behavior before placement
- [ ] Expand inspector into room, wall, and item-specific panels
- [ ] Improve project details and client details capture flow
- [ ] Improve BOQ readability, grouping, and editability
- [ ] Define export-ready information requirements for quote handoff

### Phase 6 — Visual Design, Brand System, and Accessibility

- [ ] Align planner surfaces with One&Only tokens and typography
- [ ] Standardize panel styling, spacing, borders, and shadows
- [ ] Refine toolbar hierarchy, emphasis, and control density
- [ ] Improve measurement labels, helper text, and microcopy consistency
- [ ] Validate contrast, focus visibility, and keyboard accessibility
- [ ] Validate reduced-motion and live-region requirements

### Phase 7 — Reliability, Validation, and Stakeholder Handoff

- [ ] Harden import, export, and recovery error states
- [ ] Validate planner catalog media, specs, and dimension accuracy
- [ ] Verify responsive behavior across desktop and mobile breakpoints
- [ ] Verify critical planner tasks with real interaction testing
- [ ] Prepare mockups, prototype, specs, and presentation deck
- [ ] Finalize stakeholder review checklist and implementation handoff

---

## Deliverables for Stakeholder Approval (What will be produced)

### High-fidelity mockups (Figma)

- Desktop planner workspace (catalog open/closed; inspector open/closed; 2D and 3D)
- Mobile planner (canvas + bottom sheet)
- Export modal + quote handoff
- Error states (catalog fail, import fail, export fail)

### Interactive prototype (Figma)

- Core flows: add item → adjust → inspect → export PDF → quote handoff.
- Includes keyboard flows and responsive behavior (desktop + mobile).

### Specifications documentation

- Design system tokens, components, interaction states, empty states, copy rules.
- Accessibility specs (focus order, ARIA labels, live announcements).
- Analytics event spec (names, payloads, success definitions).

### Presentation deck (stakeholder summary)

- Competitor pattern highlights (with annotated screenshots)
- Current audit + severity impact
- Proposed IA + wireframes
- Phased rollout + metrics targets

---

## Notes / Assumptions

- Competitor screenshots embedded in the final deck will be captured in Chrome and annotated with callouts per the checklist above.
- Legacy configurator notes that no longer map to current code are treated as historical context only.
