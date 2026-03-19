# Color Scheme Redo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the One&Only brand palette across the site so it reads as premium enterprise — not generic or cheap.

**Architecture:** All color, surface, and typography tokens live in `app/theme-tokens.css` and `app/typography.css`. Component-level color assignments live in `app/color-contrast.css`. Button/component styles live in `app/custom-components.css`. Targeting these 4 files covers 100% of the visual language without touching any component TSX.

**Tech Stack:** Next.js 16, Tailwind v4 (`@theme {}` / `@utility {}`), Inter (variable font) + Montserrat (300–700).

---

## Brand Palette (Source of Truth)

| Name | Hex | Role |
|------|-----|------|
| Brand Teal | `#006695` | Primary CTA, links, accents |
| Brand Navy | `#002c40` | Dark backgrounds, strong headings |
| Brand Teal Dark | `#153947` | Primary hover state |
| Accent Blue | `#00a0ea` | Secondary highlight, chips |
| Neutral Light | `#F2F5F9` | Section backgrounds |
| White | `#FFFFFF` | Page background |

**What "premium enterprise" means here:**
- Headings at weight 600, not 700 (lighter = more refined)
- Display / hero text at weight 700 only for the biggest titles
- Body copy at 400 with comfortable line-height (1.6)
- Eyebrows: small-caps, tracked out, muted
- Surfaces: subtly tinted from brand palette (not generic gray)
- One accent color used sparingly — `#006695` on interactive elements only

---

## Diagnosed Problems (what makes it look "cheap" now)

1. **Surface tokens are generic grays** — `#f5f7fb`, `#f7f9fc` etc. have no brand DNA; tinting them with `#F2F5F9` as the base anchors them to the palette.
2. **`--color-brand-muted` / `--color-brand-slate`** are generic blue-grays (`#4b5f87`, `#707b95`) — unrelated to the actual brand teal. Replace with teal-derived values.
3. **Font weights too heavy** — almost everything is weight 700 or 600. Large sections should use 600/500, italic accents should be 300.
4. **`u-bg-soft-radial` gradient** still has old rgba(`20,57,129`) instead of brand teal.
5. **`--surface-accent-wash`** (`#f3f7ff`) is generic blue — should be teal-tinted.
6. **`btn-primary` gradient** is flat color-to-same-color — no depth.
7. **Section eyebrows / kickers** use same weight and color as body — no hierarchy.

---

## File Map

| File | What changes |
|------|-------------|
| `app/theme-tokens.css` | Color tokens, surface tokens, brand-slate colors, gradient utilities, shadow values |
| `app/typography.css` | Font weight scale (h2→600, display text handling) |
| `app/color-contrast.css` | Surface scheme classes, section backgrounds |
| `app/custom-components.css` | `btn-primary` gradient depth, eyebrow/kicker classes |

**No TSX files are touched.** All changes are CSS-only.

---

## Task 1 — Fix Color Tokens in `theme-tokens.css`

**Files:**
- Modify: `app/theme-tokens.css` (lines 1–105)

### What to change

Replace the `@theme {}` block's color and surface tokens as follows:

**Surfaces** — tint with brand palette:
```css
--surface-page: #ffffff;
--surface-soft: #F2F5F9;          /* brand neutral-light (was #f5f7fb) */
--surface-muted: #e8edf3;          /* slightly deeper teal-gray (was #edf2f7) */
--surface-panel: #fbfcfe;
--surface-panel-strong: #ffffff;
--surface-panel-soft: rgba(242, 245, 249, 0.96);  /* teal-tinted (was generic) */
--surface-inverse: #002c40;        /* brand navy (was #101a29) */
--surface-inverse-soft: #0a1e2e;   /* darker navy (was #162335) */
--surface-accent-wash: #e8f4fb;    /* teal-tinted wash (was generic blue #f3f7ff) */
```

**Brand slate colors** — derive from teal, not blue-gray:
```css
--color-brand-strong: #006695;
--color-brand-muted: #00536e;      /* darkened teal (was generic #4b5f87) */
--color-brand-slate: #3d7a90;      /* mid teal (was #707b95) */
--color-brand-slate-light: #6698aa; /* light teal (was #8792ad) */
--color-brand-slate-bright: #e0f2f9; /* very light teal (was #eef3ff) */
```

**Gradient utility** — update `u-bg-soft-radial` to use brand teal:
```css
@utility u-bg-soft-radial {
  background-image:
    radial-gradient(circle at 20% 0%, rgba(0, 102, 149, 0.07), transparent 42%),
    radial-gradient(circle at 100% 100%, rgba(0, 44, 64, 0.05), transparent 46%);
}
```

**Footer** — anchor to brand navy:
```css
--color-footer-bg: #002c40;        /* brand navy (was --surface-inverse generic dark) */
--color-footer-muted: #9ab5c4;
--color-footer-subtle: #7a9aaa;
--color-footer-link: #d0e6f0;
--color-footer-hover: #ffffff;
```

**Shadow tokens** — keep brand teal derivation:
```css
--shadow-lift: 0 22px 44px -30px rgba(0, 102, 149, 0.28);  /* slightly softer */
--shadow-soft: 0 16px 48px -30px rgba(0, 44, 64, 0.12);
--shadow-panel: 0 24px 56px -42px rgba(0, 44, 64, 0.10);
```

### Steps

- [ ] **Step 1: Open `app/theme-tokens.css` and replace surface tokens** (lines 16–26)
  Replace `--surface-soft`, `--surface-muted`, `--surface-panel-soft`, `--surface-inverse`, `--surface-inverse-soft`, `--surface-accent-wash` with the values above.

- [ ] **Step 2: Replace brand-slate colors** (lines 102–105)
  Replace `--color-brand-muted`, `--color-brand-slate`, `--color-brand-slate-light`, `--color-brand-slate-bright`.

- [ ] **Step 3: Replace footer color tokens** (lines 33–39)
  Update `--color-footer-bg`, `--color-footer-muted`, `--color-footer-subtle`, `--color-footer-link`.

- [ ] **Step 4: Replace shadow tokens** (lines 43–46)
  Update `--shadow-lift`, `--shadow-soft`, `--shadow-panel`.

- [ ] **Step 5: Update `u-bg-soft-radial` utility** (lines 387–391)
  Replace rgba(20,57,129) with rgba(0,102,149) in both radial-gradient stops.

- [ ] **Step 6: Update `u-bg-soft-grad-1` and `u-bg-soft-grad-2` utilities**
  Change gradient stops to use `#F2F5F9` and `#e8edf3` instead of generic off-whites:
  ```css
  @utility u-bg-soft-grad-1 {
    background-image: linear-gradient(180deg, #ffffff 0%, #F2F5F9 100%);
  }
  @utility u-bg-soft-grad-2 {
    background-image: linear-gradient(180deg, #F2F5F9 0%, #e8edf3 100%);
  }
  ```

- [ ] **Step 7: Verify dev server compiles without errors**
  Run: `npm run dev`
  Expected: No CSS parse errors in terminal.

- [ ] **Step 8: Commit**
  ```bash
  git add app/theme-tokens.css
  git commit -m "design: align color tokens to brand palette (teal surfaces, navy inverse)"
  ```

---

## Task 2 — Fix Typography Weights in `typography.css`

**Files:**
- Modify: `app/typography.css`

**Rule:** Weight 700 only for the single biggest hero/display title. Everything else steps down.

| Class | Current weight | New weight | Rationale |
|-------|---------------|------------|-----------|
| `.typ-h1`, `.typ-display` | 700 | 700 | Keep — biggest title |
| `.typ-h2`, `.typ-section`, `.home-heading` | 700 | **600** | Refined, not chunky |
| `.typ-h3` | 600 | **500** | One step lighter |
| `.projects-section__title` | 700 | **600** | Large display, doesn't need max weight |
| `.partner-strip__title` | 600 | **500** | Wide tracking carries weight |
| `.section-title` | 700 | **600** | Section headings |
| `.home-copy`, `.typ-lead`, `.partner-strip__copy` | 400 | 400 | Keep |
| `.hero-subtitle` | 400 | 400 | Keep |

Also: increase body line-height in `globals.css` from `1.5` to `1.6` for better readability.

### Steps

- [ ] **Step 1: Edit `.typ-h2 / .typ-section / .home-heading` weight** from 700 → 600
- [ ] **Step 2: Edit `.typ-h3` weight** from 600 → 500
- [ ] **Step 3: Edit `.projects-section__title` weight** from 700 → 600
- [ ] **Step 4: Edit `.partner-strip__title` weight** from 600 → 500
- [ ] **Step 5: Edit `.section-title` weight** from 700 → 600
- [ ] **Step 6: Edit `globals.css` body `line-height`** from `1.5` → `1.6`
- [ ] **Step 7: Check browser — headings should look refined, not thinner to the point of weakness**
- [ ] **Step 8: Commit**
  ```bash
  git add app/typography.css app/globals.css
  git commit -m "design: refine font weight scale — headings 600, h3 500, body line-height 1.6"
  ```

---

## Task 3 — Fix Section Scheme Classes in `color-contrast.css`

**Files:**
- Modify: `app/color-contrast.css`

**Goal:** `.scheme-section-soft` and `.scheme-section-muted` should use the brand-tinted surfaces. `.scheme-section-inverse` should use brand navy `#002c40`.

```css
.scheme-section-soft {
  background: linear-gradient(180deg, #F2F5F9 0%, #ffffff 100%);
}

.scheme-section-muted {
  background: linear-gradient(180deg, #e8edf3 0%, #F2F5F9 100%);
}

.scheme-section-inverse {
  background: linear-gradient(180deg, #0a1e2e 0%, #002c40 100%);
  color: var(--text-inverse);
}
```

Also fix `.site-footer`:
```css
.site-footer {
  background: linear-gradient(180deg, #0a1e2e 0%, #002c40 100%);
  color: var(--color-footer-muted);
}
```

### Steps

- [ ] **Step 1: Update `.scheme-section-soft`** gradient stops
- [ ] **Step 2: Update `.scheme-section-muted`** gradient stops
- [ ] **Step 3: Update `.scheme-section-inverse`** to use brand navy
- [ ] **Step 4: Update `.site-footer`** background to use brand navy
- [ ] **Step 5: Visual check** — light sections should feel warm/teal, not cold gray; dark sections should be deep navy not generic dark
- [ ] **Step 6: Commit**
  ```bash
  git add app/color-contrast.css
  git commit -m "design: section schemes use brand teal-light and navy-dark backgrounds"
  ```

---

## Task 4 — Polish Button & Interactive States in `custom-components.css`

**Files:**
- Modify: `app/custom-components.css` (btn-primary, btn-hero-primary sections)

**Goal:** `btn-primary` should have subtle depth (a very slight gradient and clean shadow). Currently it's flat-color-to-same-color.

```css
.btn-primary {
  @apply border text-white;
  border-color: var(--color-primary-hover);
  background: linear-gradient(135deg, #006695 0%, #005580 100%);
  box-shadow: 0 4px 14px -4px rgba(0, 102, 149, 0.45);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #005580 0%, #003d5c 100%);
  box-shadow: 0 6px 18px -4px rgba(0, 102, 149, 0.55);
}
```

`btn-hero-primary` (white/inverse button on dark hero):
```css
.btn-hero-primary {
  @apply border text-neutral-900 bg-white font-semibold;
  border-color: transparent;
  box-shadow: 0 4px 20px -6px rgba(0,0,0,0.4);
}
.btn-hero-primary:hover {
  background: #F2F5F9;
}
```

### Steps

- [ ] **Step 1: Find and update `.btn-primary` styles** — add gradient and shadow depth
- [ ] **Step 2: Add `.btn-primary:hover`** rule with darker gradient
- [ ] **Step 3: Find `.btn-hero-primary`** and update to white bg / dark text on hero (premium look)
- [ ] **Step 4: Visual check buttons** — primary button should have depth; not look flat or cheap
- [ ] **Step 5: Commit**
  ```bash
  git add app/custom-components.css
  git commit -m "design: add gradient depth and shadow to btn-primary; premium hero button"
  ```

---

## Task 5 — Visual Verification

**Goal:** Confirm all 4 tasks combined produce a premium enterprise look.

### Steps

- [ ] **Step 1: Run dev server** — `npm run dev`
- [ ] **Step 2: Check homepage hero** — dark navy background, white text, hero button visible
- [ ] **Step 3: Check section backgrounds** — light sections should be warm teal-gray (not cold white), not jarring
- [ ] **Step 4: Check heading weights** — h2/section headings should be 600 (slightly lighter, more refined than before)
- [ ] **Step 5: Check footer** — should be deep navy, not generic dark
- [ ] **Step 6: Check primary button** — should have gradient depth, not flat
- [ ] **Step 7: Check dark sections** — should be deep navy, harmonious with brand
- [ ] **Step 8: Run accessibility check** — `npm run test:a11y`
- [ ] **Step 9: Commit final state**
  ```bash
  git add -A
  git commit -m "design: color scheme redo complete — brand teal/navy palette, refined weights"
  ```

---

## Acceptance Checklist

- [ ] All section backgrounds derive from brand palette (`#F2F5F9`, `#002c40`) not generic gray
- [ ] Dark sections / footer are brand navy `#002c40`, not `#101a29`
- [ ] h2/section headings weight 600, not 700
- [ ] h3 weight 500
- [ ] Primary button has visible gradient depth and shadow
- [ ] No CSS compile errors in terminal
- [ ] `npm run test:a11y` passes
- [ ] Site loads in browser without visual regressions
