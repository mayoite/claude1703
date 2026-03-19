# Phase 4 Slice 3 — Route Consistency Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align 4 remaining routes to the shared design token system — eliminating hardcoded spacing, colour, and surface values — so the site feels like one consistent system.

**Architecture:** Pure CSS class substitution across 4 files. No logic changes, no new components. Token system lives in `app/theme-tokens.css` (CSS custom properties), `app/custom-components.css` (`btn-*`, `typ-*` utilities), and `app/color-contrast.css` (`scheme-*` utilities). Shared utility classes (`scheme-*`, `btn-*`, `typ-*`) are the system primitives.

**Tech Stack:** Next.js 16, Tailwind CSS, CSS custom properties (`--*` tokens), Playwright for verification.

---

## File Map

| File | Action | What changes |
|------|--------|-------------|
| `app/sustainability/page.tsx` | Modify | Spacing rhythm, border token, dark panel radius |
| `app/contact/page.tsx` | Modify | Button classes on dark surface |
| `app/solutions/page.tsx` | Modify | Border and text colour tokens |
| `app/products/[category]/[product]/ProductViewer.tsx` | Modify | All hardcoded neutral colours → scheme tokens |

---

## Task 1: Fix sustainability/page.tsx spacing drift

**Files:**
- Modify: `app/sustainability/page.tsx`

**Reference tokens:**
- `scheme-*` classes defined in `app/color-contrast.css`
- System section rhythm: `py-18 md:py-22` (matches `/`, `/products`, `/about`)
- System section gap: `mt-20` for major internal sections
- Border: `scheme-border` class (maps to `--border-soft`)
- Dark panel radius: `rounded-[2rem]`

- [ ] **Step 1: Fix outer section padding**

In `app/sustainability/page.tsx` line ~18:
```tsx
// Before
<section className="container px-6 py-24 2xl:px-0">
// After
<section className="container px-6 py-18 2xl:px-0 md:py-22">
```

- [ ] **Step 2: Fix internal section gaps**

There are 3 occurrences of `mt-24` (at lines ~54, ~87, ~105). Replace all with `mt-20`:
```tsx
// Before
className="mt-24 ..."
// After
className="mt-20 ..."
```
Search: `grep -n "mt-24" app/sustainability/page.tsx` to confirm exact lines before editing.

- [ ] **Step 3: Fix grid gaps**

```tsx
// gap-10 on two-column intro grid (~line 19) → gap-8
// gap-16 on pillars/certifications grid (~line 54) → gap-12
```

- [ ] **Step 4: Fix border-black/8**

```tsx
// Before (~line 37)
className="... border-b border-black/8 ..."
// After
className="... border-b border-(--border-soft) ..."
```

- [ ] **Step 5: Fix dark panel radius**

```tsx
// Before (~line 105)
className="scheme-panel-dark relative mt-20 overflow-hidden rounded-3xl p-12"
// After
className="scheme-panel-dark relative mt-20 overflow-hidden rounded-[2rem] p-12"
```

- [ ] **Step 6: Verify build is clean**

```bash
npm run lint && npm run build
```
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add app/sustainability/page.tsx
git commit -m "fix: align sustainability page spacing to system rhythm"
```

---

## Task 2: Fix contact/page.tsx button classes on dark surface

**Files:**
- Modify: `app/contact/page.tsx`

**Context:** The dark info panel inside `.contact-form-panel` uses `home-btn-secondary` and `home-btn-primary` — homepage-specific aliases defined in `app/custom-components.css` lines ~906–923. Replace with system `btn-*` equivalents.

**Note on visual hierarchy:** The existing code assigns `home-btn-secondary` (outline style) to the `/downloads` CTA and `home-btn-primary` (filled style) to `/planning`. This inversion — where the copy-labelled "primary" CTA gets the outline style — is intentional: on this dark panel, `/downloads` is a secondary action and `/planning` is the visual anchor. The replacement preserves this intent: `btn-outline-light` for `/downloads`, `btn-primary` for `/planning`.

- [ ] **Step 1: Replace button classes**

In `app/contact/page.tsx` lines ~131–134:
```tsx
// Before
<Link href="/downloads" className="home-btn-secondary">
  {CONTACT_PAGE_COPY.quickDeskPrimaryCta}
</Link>
<Link href="/planning" className="home-btn-primary">
  {CONTACT_PAGE_COPY.quickDeskSecondaryCta}
</Link>

// After
<Link href="/downloads" className="btn-outline-light">
  {CONTACT_PAGE_COPY.quickDeskPrimaryCta}
</Link>
<Link href="/planning" className="btn-primary">
  {CONTACT_PAGE_COPY.quickDeskSecondaryCta}
</Link>
```

- [ ] **Step 2: Verify build is clean**

```bash
npm run lint && npm run build
```
Expected: no errors.

- [ ] **Step 3: Visual spot-check of contact page dark panel**

```bash
npm run dev
# Open http://localhost:3000/contact
```
Check: the dark panel above the form shows two buttons — outline and filled — both readable on the dark background, correct hover states.

- [ ] **Step 4: Commit**

```bash
git add app/contact/page.tsx
git commit -m "fix: replace home-btn aliases with system btn classes on contact dark panel"
```

---

## Task 3: Fix solutions/page.tsx hardcoded values

**Files:**
- Modify: `app/solutions/page.tsx`

- [ ] **Step 1: Fix step card image border**

```tsx
// Before (~line with "border-neutral-200" on the image divider)
<div className="relative u-aspect-16-10 border-b border-neutral-200">
// After
<div className="relative u-aspect-16-10 border-b scheme-border">
```

- [ ] **Step 2: Fix step card title colour**

```tsx
// Before
<h3 className="typ-h3 text-neutral-950">{step.title}</h3>
// After
<h3 className="typ-h3 scheme-text-strong">{step.title}</h3>
```

- [ ] **Step 3: Verify build is clean**

```bash
npm run lint && npm run build
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add app/solutions/page.tsx
git commit -m "fix: replace hardcoded neutral tokens with scheme classes in solutions page"
```

---

## Task 4: Fix ProductViewer.tsx hardcoded neutrals (highest risk)

**Files:**
- Modify: `app/products/[category]/[product]/ProductViewer.tsx`

**Context:** Large interactive component (~700+ lines). Uses hardcoded `neutral-*` Tailwind classes throughout. Replace systematically using the mapping below. **Do not change any interaction logic, state, or animation.** All `scheme-*` classes are defined in `app/color-contrast.css`.

**Token mapping:**
| Hardcoded | Replacement | Notes |
|-----------|-------------|-------|
| `border-neutral-100` | `border-(--border-soft)` | Subtle dividers |
| `border-neutral-200` | `scheme-border` | Standard borders |
| `border-neutral-300` | `scheme-border-soft` | Slightly stronger (maps to `--border-muted`) |
| `bg-neutral-50` | `bg-(--surface-soft)` | Soft backgrounds |
| `bg-neutral-100` | `scheme-section-soft` | Section backgrounds |
| `bg-white` | Keep `bg-white` for deliberate white cards; use `bg-(--surface-page)` for section backgrounds | Evaluate per-instance |
| `bg-white/90` | `bg-(--surface-glass-strong)` | Sticky nav glass effect |
| `bg-neutral-50/80` | `bg-(--surface-panel-soft)` | Panel backgrounds |
| `text-neutral-500` | `scheme-text-muted` | Muted/overline text |
| `text-neutral-600` | `scheme-text-body` | Body text |
| `text-neutral-700` | `scheme-text-body` | Body text |
| `text-neutral-800` | `scheme-text-body` | Body text |
| `text-neutral-900` | `scheme-text-strong` | Strong/heading text |
| `text-neutral-950` | `scheme-text-strong` | Headings |
| `rounded-3xl` | `rounded-[2rem]` | System panel radius |
| `hover:text-neutral-900` | Keep as-is | Pseudo-class scheme variants not supported |

**EXCLUDED — do NOT change:**
- `bg-neutral-900` at line ~685: intentional dark-ink add-to-quote CTA button
- `hover:bg-neutral-900` at line ~441: intentional dark hover state on variant chip/tab — keep as-is

- [ ] **Step 1: Check if scheme pseudo-classes work in the codebase**

```bash
grep -r "hover:scheme-\|focus:scheme-" app/components/ --include="*.tsx" | head -5
```
If no results → keep all `hover:text-neutral-*` and `hover:bg-neutral-*` as-is (don't attempt conversion).

- [ ] **Step 2: Replace border classes**

Apply border replacements from the mapping table top-to-bottom. Skip any `border-neutral-*` that appear inside hover/focus pseudo variants.

- [ ] **Step 3: Replace background classes**

Apply bg replacements. For each `bg-white` instance, check context: card that needs to pop → keep `bg-white`. Section/page background → `bg-(--surface-page)`.

- [ ] **Step 4: Replace text colour classes**

Apply text colour replacements. Skip pseudo-class variants (`hover:text-neutral-*`, `focus:text-neutral-*`).

- [ ] **Step 5: Fix rounded-3xl**

```tsx
// Before (2 instances at lines ~532 and ~647)
className="rounded-3xl border ..."
// After
className="rounded-[2rem] border ..."
```

- [ ] **Step 6: Verify build and lint**

```bash
npm run lint && npm run build
```
Expected: no errors.

- [ ] **Step 7: Spot-check PDP visually**

```bash
npm run dev
# Open http://localhost:3000/products/oando-chairs/oando-crox
```
Check: image gallery renders, variant selector borders visible, add-to-quote panel correct, sticky header tab bar readable. No washed-out text, no missing borders, no broken hover states.

- [ ] **Step 8: Commit**

```bash
git add "app/products/[category]/[product]/ProductViewer.tsx"
git commit -m "fix: replace hardcoded neutral tokens with scheme classes in ProductViewer"
```

---

## Task 5: Full verification pass

- [ ] **Step 1: Run lint + build**

```bash
npm run lint && npm run build
```
Expected: clean.

- [ ] **Step 2: Run Playwright suite**

```bash
PLAYWRIGHT_BASE_URL=http://localhost:3000 npx playwright test tests/homepage.spec.ts tests/dynamic-filters.spec.ts tests/product-tools.spec.ts --workers=1
```
Expected: all pass.

- [ ] **Step 3: Run nav smoke + a11y**

```bash
npm run test:e2e:nav && npm run test:a11y
```
Expected: all pass.

- [ ] **Step 4: Update HANDOVER.md and recovery state**

Mark Slice 3 complete in HANDOVER.md "Done This Session". Update `codex-recovery/latest.md` with new timestamp and state summary.

- [ ] **Step 5: Final commit and push**

```bash
git add HANDOVER.md codex-recovery/latest.md
git commit -m "docs: mark Phase 4 Slice 3 route consistency pass complete"
git push origin main
```
