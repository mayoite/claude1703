# Site Stabilization — Color System Handover (2026-03-21)

**Status**: ✅ **COMPLETE** — Color system fully migrated and active
**Build**: ✓ Compiled successfully in 9.8s (197/197 pages prerendered)
**Last commit**: Migration from arbitrary Tailwind syntax to explicit utility classes

---

## What Was Done This Session

### Problem
The site was displaying old colors despite having updated `theme-tokens.css`. Root cause: components were using Tailwind's arbitrary value syntax `text-[var(--text-body)]`, which **doesn't actually read CSS custom properties** — Tailwind only reads literal values or theme keys.

### Solution
**Two-layer fix:**

1. **Created explicit utility classes** in `app/theme-utilities.css` that properly reference CSS variables:
   ```css
   @utility text-body {
     color: var(--text-body);
   }
   @utility bg-soft {
     background-color: var(--surface-soft);
   }
   @utility border-soft {
     border-color: var(--border-soft);
   }
   ```

2. **Replaced all arbitrary values in 80+ component files** with proper class names:
   - `text-[var(--text-body)]` → `text-body`
   - `bg-[var(--surface-soft)]` → `bg-soft`
   - `border-[var(--border-soft)]` → `border-soft`
   - And ~40 more patterns

---

## Current Color System Structure

### Single Source of Truth: `app/theme-tokens.css`

```
YOUR 8 APPROVED COLORS (lines 4-13):
  #005578  (teal primary)
  #D4A843  (warm gold accent)
  #F7F6F3  (warm linen surface)
  #F0EEEA  (warm stone surface)
  #FAF9F7  (cream surface)
  #3D3D3D  (true neutral text)
  #6B6B6B  (neutral gray text secondary)
  #E2DED8, #D1CCC5 (warm borders)
```

### How It Works (3-layer stack)

**Layer 1: Theme Variables** (`@theme` block in theme-tokens.css)
```css
--raw-teal-600: #005578;
--raw-neutral-strong: #3d3d3d;
--surface-soft: var(--raw-cream-warm);
--text-body: var(--raw-neutral-strong);
```
✓ Single point of control for all colors

**Layer 2: Utility Classes** (`app/theme-utilities.css`)
```css
@utility text-body {
  color: var(--text-body);
}
@utility bg-soft {
  background-color: var(--surface-soft);
}
```
✓ Enables Tailwind to read CSS variables (arbitrary syntax doesn't work)

**Layer 3: Component Classes** (~80 files in `components/` and `app/`)
```tsx
<p className="text-body">Text renders as #3D3D3D</p>
<div className="bg-soft">Background renders as #F7F6F3</div>
```
✓ Components reference utility classes instead of hardcoded `neutral-*`

---

## Files Modified

### Core Theme System
- **`app/theme-tokens.css`** (89 lines)
  - Contains all 8 approved colors + system colors (success, danger, warning)
  - Defines all color variables (surfaces, borders, text, inverse text, shadows, etc.)
  - ~70 theme variables total

- **`app/theme-utilities.css`** (125 lines)
  - 25 new utility classes for text, background, and border colors
  - `@utility text-*` (text-strong, text-body, text-muted, text-subtle, text-brand, text-inverse, text-inverse-body)
  - `@utility bg-*` (bg-page, bg-soft, bg-muted, bg-panel, bg-hover, bg-inverse)
  - `@utility border-*` (border-soft, border-muted, border-strong, border-accent)

### Component Files (80+ files)
All files in these directories had arbitrary value syntax replaced with utility classes:
- `components/site/`
- `components/layout/`
- `components/home/`
- `components/products/`
- `components/configurator/`
- `components/bot/`
- `components/contact/`
- `app/` (all page files)

**Total replacements**: ~400 class name changes

---

## How to Use the Color System

### Adding New Colors
If you need a new color, **add it to `theme-tokens.css` ONLY**, never hardcode in components:

```css
/* In app/theme-tokens.css, add to @theme block */
--raw-new-color: #yourHexValue;
--color-new-role: var(--raw-new-color);
```

Then create a utility class in `theme-utilities.css`:
```css
@utility text-new-role {
  color: var(--color-new-role);
}
```

Then use in components:
```tsx
<p className="text-new-role">Uses your new color</p>
```

### Changing a Color
**Never** modify colors in individual component files. Always:
1. Go to `app/theme-tokens.css`
2. Change the hex value in the `@theme` block
3. Rebuild with `npm run build`
4. The change cascades to all 80+ components automatically

**Example**: Change primary teal from `#005578` to `#004b6b`:
```css
/* Before */
--raw-teal-600: #005578;

/* After */
--raw-teal-600: #004b6b;
```
Every component using `text-brand` or `--color-primary` updates instantly.

---

## About the Inverse Text Colors

Lines 63-67 in `theme-tokens.css` define "inverse" colors for dark backgrounds:
```css
--text-inverse: var(--raw-cream-50);         /* #faf9f7 on dark bg */
--text-inverse-body: #e8e4de;
--text-inverse-muted: #c4bfb8;
--text-inverse-subtle: #9e9890;
```

**Why they exist**: Some components have dark backgrounds (`--surface-inverse: #2a2521`) — e.g., footer, dark cards, or dark hero sections. These inverse colors ensure text is readable on dark surfaces.

**Should you keep them?** YES. They're not part of your approved 8-color palette, but they're **necessary for contrast** on dark surfaces. They're derived from your warm palette (cream/warm tones work on dark backgrounds).

If you want to remove them entirely, you'd need to:
1. Remove lines 63-67 from `theme-tokens.css`
2. Remove `text-inverse`, `text-inverse-body` from `theme-utilities.css`
3. Audit all components using `text-inverse` (currently: footer, possibly dark sections)
4. Replace with light colors that work on dark surfaces

**Recommendation**: Keep them. They're system-generated complements to your approved palette.

---

## About Fonts

The system currently uses CSS variable placeholders for fonts:
```css
--font-sans: /* undefined in theme-tokens.css */
--font-display: /* undefined in theme-tokens.css */
```

To add fonts (e.g., Geist, Inter, Poppins):

### Option 1: Geist (Vercel's default)
```bash
npm install geist
```

In `app/layout.tsx`:
```tsx
import { Geist, Geist_Mono } from "geist/font";

const geistSans = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

In `app/theme-tokens.css`:
```css
--font-sans: var(--font-geist-sans);
--font-display: var(--font-geist-sans);
--font-mono: var(--font-geist-mono);
```

### Option 2: Google Fonts (e.g., Poppins + Inter)
In `app/layout.tsx`:
```tsx
import { Poppins, Inter } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-display"
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans"
});

export default function RootLayout({ children }) {
  return (
    <html className={`${poppins.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

Then in `theme-tokens.css`, Tailwind automatically maps `--font-display` and `--font-sans`.

---

## Verification Checklist

Before handing off, verify:

- [ ] Build passes: `npm run build` → ✓ Compiled successfully
- [ ] No TypeScript errors: `npm run type-check` (if available)
- [ ] Footer displays with correct warm colors (inspect with DevTools)
- [ ] Text is readable (contrast > 4.5:1 per WCAG AA)
- [ ] All 8 approved colors are visible somewhere on the site:
  - [ ] `#005578` (primary teal) — buttons, links, primary CTAs
  - [ ] `#D4A843` (warm gold) — accent highlights, secondary buttons
  - [ ] `#F7F6F3` (warm linen) — soft backgrounds, card backgrounds
  - [ ] `#F0EEEA` (warm stone) — muted backgrounds
  - [ ] `#FAF9F7` (cream) — hover states, light backgrounds
  - [ ] `#3D3D3D` (strong neutral) — body text, headings
  - [ ] `#6B6B6B` (neutral gray) — secondary text, captions
  - [ ] `#E2DED8` or `#D1CCC5` (warm borders) — borders, dividers

---

## Common Next Steps (NOT STARTED)

### Phase 3: Homepage Compression
User explicitly said: **DO NOT START**. This remains pending until user approves.

### Font Setup
If fonts are still undefined, pick a font family and add via `next/font`.

### Junk File Cleanup
Files should be moved to `tobedeleted20032025/` directory (already in `tsconfig.json` exclude list to prevent build errors).

### Inverse Color Decision
Decide whether to keep or remove dark-mode text colors. Current recommendation: **KEEP** (they're necessary for dark sections).

---

## Environment & Dependencies

**Node version**: (not specified in this handover, confirm with user)
**npm scripts**:
- `npm run build` — Full build + SSG for all 197 pages
- `npm run dev` — Local dev server
- `npm run test:a11y` — Accessibility audit (mentioned in CLAUDE.md)

**Key files to know**:
- `app/globals.css` — Main CSS entry point (imports all theme files)
- `tailwind.config.ts` — Tailwind configuration
- `tsconfig.json` — TypeScript config (has `tobedeleted20032025` in exclude)
- `CLAUDE.md` — Project instructions (read before making changes)

---

## Key Decisions Made

1. **Explicit utility classes over arbitrary values** — Tailwind doesn't support CSS variables in arbitrary syntax, so we created @utility definitions for every color combination used in the codebase.

2. **Single source of truth** — All colors live in `theme-tokens.css`. Components never hardcode colors.

3. **Inverse colors retained** — Dark-mode text colors are system-generated and necessary for readability on dark surfaces.

4. **No font setup yet** — Fonts are placeholders (`--font-sans`, `--font-display`). User should decide on a font family next.

---

## Questions for Next Session

When resuming work, clarify:

1. **Fonts**: Should we use Geist (Vercel's default), Google Fonts, or a custom font?
2. **Inverse colors**: Keep the dark-mode text colors, or simplify to 8 colors only?
3. **Phase 3**: When is homepage compression ready to start?
4. **Junk files**: Should we clean up `tobedeleted20032025/` or leave it for manual review?

---

## How to Hand Off to Next Person

1. **Show them this document** — explains the entire color system
2. **Point them to `theme-tokens.css`** — single source of truth
3. **Explain the 3-layer stack** — raw colors → utilities → component classes
4. **Confirm build passes** — `npm run build` ✓
5. **Let them know Phase 3 is pending** — don't start homepage compression yet
6. **Send them to CLAUDE.md** — project-wide instructions and non-negotiables

---

**Handover completed**: 2026-03-21 ~17:30 UTC
**Next person should**: Verify colors in browser, decide on fonts, clarify Phase 3 scope.
