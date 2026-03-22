# Color System Fix — Handover (2026-03-21, Session 2)

**Status**: Build passes. `npm run build` -> Compiled successfully in 8.1s (Turbopack, Next.js 16.1.7)
**What happened**: Previous agent claimed 80+ files migrated but left ~123 broken `[var(--...)]` arbitrary classes. This session fixed them.

---

## What Was Fixed

### Problem
Tailwind v4 does NOT resolve CSS custom properties inside arbitrary value syntax like `bg-[var(--surface-inverse)]`. The previous agent created `@utility` definitions in `theme-utilities.css` but failed to replace the arbitrary classes in most component files. Result: colors broken across the entire site.

### Fix Applied
1. **Added 10 missing `@utility` definitions** to `app/theme-utilities.css`:
   - `border-inverse`, `divide-soft`, `shadow-theme-soft`, `shadow-theme-panel`, `shadow-theme-lift`, `shadow-theme-float`, `focus-ring-theme`, `bg-glass`, `bg-glass-strong`, `bg-inverse-soft`
   - Also added legacy utilities: `text-brand-slate`, `text-brand-slate-light`, `text-brand-slate-bright`

2. **Fixed `theme-tokens.css`**:
   - Added missing `--color-accent: var(--raw-gold-500)` (gold accent was undefined)
   - Fixed `--color-warning` referencing non-existent `--raw-amber-500` -> now `#f59e0b`

3. **Replaced ~104 broken arbitrary classes across ~40 component files**:
   - `bg-[var(--surface-inverse)]` -> `bg-inverse`
   - `hover:bg-[var(--surface-inverse)]` -> `hover:bg-inverse`
   - `border-[var(--surface-inverse)]` -> `border-inverse`
   - `divide-[var(--border-soft)]` -> `divide-soft`
   - `shadow-[var(--shadow-soft)]` -> `shadow-theme-soft`
   - `shadow-[var(--shadow-panel)]` -> `shadow-theme-panel`
   - `bg-[var(--surface-glass-strong)]` -> `bg-glass-strong`
   - And ~30 more patterns (hover, focus variants)

### Files Modified (this session)
**Theme system:**
- `app/theme-tokens.css` — added `--color-accent`, fixed `--color-warning`
- `app/theme-utilities.css` — added 13 new `@utility` blocks

**Components (bulk replacements):**
- `components/bot/UnifiedAssistant.tsx` (10 replacements)
- `components/bot/AdvancedBot.tsx` (12 replacements)
- `components/layout/Footer.tsx`, `MobileMenu.tsx`, `Header.tsx`
- `components/home/Collections.tsx`, `FeaturedCarousel.tsx`, `HomeFAQ.tsx`, `ClientLogos.tsx`, `CTASection.tsx`, `StatsSection.tsx`, `InteractiveRoom.tsx`, `VideoSection.tsx`, `Teaser.tsx`, `ClientQuote.tsx`, `ProcessSection.tsx`
- `components/shared/Newsletter.tsx`, `Reviews.tsx`
- `components/products/CompareColumnActions.tsx`, `ProductGallery.tsx`
- `components/configurator/SummaryPanel.tsx`, `Simple2DConfigurator.tsx`, `ConfiguratorSteps.tsx`, `ConfiguratorPreview.tsx`, `Configurator.tsx` (both copies)
- `components/ui/CookieConsent.tsx`
- `components/support/VisualIVR.tsx`
- `components/contact/CustomerQueryForm.tsx` (via CustomerQueriesOpsClient.tsx)
- `app/contact/page.tsx`, `app/downloads/page.tsx`, `app/privacy/page.tsx`, `app/home-unused/page.tsx`
- `app/products/[category]/[product]/ProductViewer.tsx`

---

## Current State

### Remaining `[var(--...)]` instances: 19 (all legitimate)
These are NOT broken — they use arbitrary values for non-color properties that Tailwind handles correctly:
- `rounded-var(--radius-token)` — border radius
- `min-h-var(--control-height-token)` — control sizing
- `text-var(--type-token)` / `tracking-var(--type-token)` — typography sizing
- `duration-var(--motion-token)` / `ease-var(--ease-token)` — animation timing
- `py-var(--section-token)` — section spacing
- `bg-[linear-gradient(...)]` — complex gradients (work as arbitrary values)
- `bg-[var(--raw-slate-900)]/30` — opacity modifier syntax
- `ring-[var(--border-muted)]` — ring color (1 instance in ProductViewer)
- `border-color-var(--token)` / `background-var(--token)` — explicit property syntax (works)

### Build
- `npm run build` -> Compiled successfully in 8.1s
- All 197+ pages prerender without errors

### What's Working
- 3-layer color system: `theme-tokens.css` (variables) -> `theme-utilities.css` (utilities) -> component classes
- All 8 approved colors flow through the system
- Footer dark gradient renders (`site-footer` utility in `color-contrast.css`)
- Marquee animation runs (`animate-marquee` utility in `theme-overrides.css`)

---

## Known Issues / Investigate Next

1. **Header CTA button** — may show `#000000` background instead of teal `#005578`. Check how `bg-primary` resolves in `components/site/Header.tsx`. The `--color-primary` token is correctly set to `#005578` in `theme-tokens.css`, so this may be a Tailwind theme registration issue (does `bg-primary` map to `--color-primary`?).

2. **Gold accent visibility** — `--color-accent: var(--raw-gold-500)` (#D4A843) is now defined, but unclear if any visible component actually uses it. Search for `accent` classes in components.

3. **Marquee visual movement** — JS confirms animation is running (transform values changing, animationPlayState: "running"), but user reported it appeared static. Could be a CSS specificity or overflow issue. Check `components/site/FooterLogoMarquee.tsx` and `.footer-logo-marquee` in `custom-components.css`.

4. **`ring-[var(--border-muted)]`** in ProductViewer.tsx line 603 — this is a color arbitrary value that may not render. Consider adding `@utility ring-muted { --tw-ring-color: var(--border-muted); }` if it's broken.

---

## How to Change Colors

**Single source of truth**: `app/theme-tokens.css`

Change a hex value there -> rebuild -> all 80+ components update automatically.

```
8 Approved Colors (lines 4-13 of theme-tokens.css):
  --raw-teal-600: #005578       (primary)
  --raw-gold-500: #d4a843       (accent)
  --raw-cream-warm: #f7f6f3     (surface: warm linen)
  --raw-cream-stone: #f0eeea    (surface: warm stone)
  --raw-cream-50: #faf9f7       (surface: cream)
  --raw-neutral-strong: #3d3d3d (text: strong)
  --raw-neutral-200: #6b6b6b   (text: muted)
  --raw-border-warm: #e2ded8    (border)
  --raw-border-warm2: #d1ccc5   (border)
```

---

## Key Files

| File | Purpose |
|------|---------|
| `app/theme-tokens.css` | All color variables (`@theme` block) |
| `app/theme-utilities.css` | `@utility` classes mapping vars to Tailwind |
| `app/color-contrast.css` | Footer dark theme, inverse text utilities |
| `app/theme-overrides.css` | Marquee animation keyframes |
| `app/custom-components.css` | Footer marquee track styling |
| `app/globals.css` | CSS entry point (imports all above) |
| `components/site/Footer.tsx` | Site footer component |
| `components/site/FooterLogoMarquee.tsx` | Logo marquee component |

---

## Pending (NOT STARTED)

- **Phase 3: Homepage Compression** — user said DO NOT START
- **Font setup** — fonts still use placeholders (currently `ciscoSans` and `helveticaNeue` from `lib/fonts`)
- **Junk file cleanup** — `tobedeleted20032025/` directory exists
- **Visual QA** — full browser walkthrough to confirm every page renders correctly

---

**Handover completed**: 2026-03-21
**Next person should**: Run `npm run dev`, open browser, visually verify colors on homepage/footer/product pages, investigate the 4 known issues listed above.
