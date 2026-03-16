# Typography And Color Audit

Last updated: 2026-03-15

## Fonts

| Role | Source | Family / Variable | Weights in repo | Where it is used |
| --- | --- | --- | --- | --- |
| Primary UI + display | [lib/fonts.ts](/e:/new-repo-20260306-235837/lib/fonts.ts) | `--font-cisco` -> Helvetica Neue local files | 300, 400, 500, 700 | Global body, headings, labels, nav, display |

There is currently 1 loaded font family in the live app.

## Type Tokens

| Token / Class | Size | Weight | Letter spacing | Transform / style | Intended use |
| --- | --- | --- | --- | --- | --- |
| `body` | `1rem` | browser default / normal | default | normal | Base copy in [globals.css](/e:/new-repo-20260306-235837/app/globals.css) |
| `typ-display` / `typ-h1` | `clamp(2.75rem, 5.5vw, 4.5rem)` | 200 | `-0.035em` | italic | Hero/display statements |
| `typ-section` / `typ-h2` / `home-heading` | `clamp(1.875rem, 3.5vw, 2.5rem)` | 300 | `-0.025em` | normal | Section titles |
| `typ-h3` | `0.9375rem` | 400 | `-0.01em` | normal | Compact tertiary titles |
| `typ-lead` / `home-copy` | `clamp(1rem, 0.97rem + 0.2vw, 1.1rem)` | 350 | `-0.01em` | normal | Lead/body-large copy |
| `typ-body-sm` | `0.9375rem` | 375 | `-0.01em` | normal | Secondary copy and shell copy |
| `page-copy` | `clamp(1rem, 0.97rem + 0.2vw, 1.1rem)` | 350 | `-0.01em` | normal | Long-form route copy |
| `page-copy-sm` | `1rem` | 350 | default | normal | Smaller long-form copy |
| `typ-label` | `0.75rem` | 550 | `0.25em` | uppercase | Strong section labels |
| `typ-overline` | `0.6875rem` | 600 | `0.14em` | uppercase | Micro metadata / eyebrow labels |
| `typ-chip` | `0.75rem` | 600 | `0.12em` | uppercase | Chips and pills |
| `typ-nav` | `1rem` | 400 | `0.01em` | normal | Primary nav text |
| `typ-nav-sm` | `0.6875rem` | 400 | `0.04em` | normal | Utility nav / small shell copy |
| `typ-micro` | `0.6875rem` | 500 | `0.04em` | normal | Search meta / counts / UI microcopy |
| `typ-stat` | `clamp(2.75rem, 5.5vw, 4.5rem)` | 250 | `-0.035em` | normal | KPI values |
| `typ-cta` | `0.9375rem` | 500 | `0.12em` | uppercase | CTA text |
| `hero-subtitle` | `clamp(1rem, 0.96rem + 0.55vw, 1.45rem)` | 350 | `-0.01em` | normal | Hero subtitle |
| `section-title` | `clamp(2rem, 1.7rem + 1.6vw, 3.2rem)` | 300 | `-0.03em` | normal | Premium title variant |

## Color Tokens

| Token | Value | Use |
| --- | --- | --- |
| `--color-primary` | `#0d2db4` | Brand / primary actions |
| `--color-primary-hover` | `#0a2499` | Primary hover |
| `--text-strong` | `#09090b` | Strong text |
| `--text-heading` | `#18181b` | Heading text |
| `--text-body` | `#3f3f46` | Body text |
| `--text-muted` | `#71717a` | Muted text |
| `--color-footer-bg` | `#16202f` | Footer surface |
| `--color-footer-muted` | `#8a96b0` | Footer readable muted text |
| `--color-footer-link` | `#b3bfd8` | Footer links |
| `--color-footer-hover` | `#e8edf8` | Footer hover |

## Contrast Table

| Pair | Foreground | Background | Ratio | Status |
| --- | --- | --- | --- | --- |
| Strong text on white | `#09090b` | `#ffffff` | `19.90` | Pass |
| Heading text on white | `#18181b` | `#ffffff` | `17.72` | Pass |
| Body text on white | `#3f3f46` | `#ffffff` | `10.44` | Pass |
| Muted text on white | `#71717a` | `#ffffff` | `4.83` | Pass |
| Neutral 400 on white | `#a1a1aa` | `#ffffff` | `2.56` | Fail |
| Primary on white | `#0d2db4` | `#ffffff` | `10.24` | Pass |
| White on footer | `#ffffff` | `#16202f` | `16.38` | Pass |
| Footer link on footer | `#b3bfd8` | `#16202f` | `8.86` | Pass |
| Footer muted on footer | `#8a96b0` | `#16202f` | `5.52` | Pass |
| Footer dim on footer | `#74809e` | `#16202f` | `4.15` | Borderline fail for small text |
| Approx `white/72` on `neutral-950` | `#b8b8b8` | `#09090b` | `10.03` | Pass |
| Approx `white/60` on `neutral-950` | `#999999` | `#09090b` | `6.98` | Pass |
| Amber 700 on amber 50 | `#b45309` | `#fffbeb` | `4.84` | Pass |
| Emerald 700 on emerald 50 | `#047857` | `#ecfdf5` | `5.21` | Pass |

## Current Problems

| Problem | Why it exists | Impact |
| --- | --- | --- |
| Semantic type system and raw Tailwind text classes coexist | The repo evolved in phases and older components were never fully migrated | Inconsistent typography and weak hierarchy |
| Token layer exists but direct `text-neutral-*` and arbitrary values still appear | No strict lint or design enforcement in shared UI | Color and contrast drift |
| Duplicate style pathways | `theme-tokens.css`, `typography.css`, `custom-components.css`, and inline classes all own pieces of the same system | Hard to reason about and easy to regress |
| Shared shell components historically used local presentation classes | Fast implementation passes bypassed semantic extraction | Visible inconsistency in the header/footer/runtime shell |

## Remaining Hardcoded Hotspots

Top files by raw arbitrary text/tracking/color usage:

| File | Approx hotspot count | Notes |
| --- | --- | --- |
| [page.tsx](/e:/new-repo-20260306-235837/app/home-unused/page.tsx) | 30 | Internal review route, not customer-facing priority |
| [Navbar.tsx](/e:/new-repo-20260306-235837/components/layout/Navbar.tsx) | 16 | Legacy/non-live header layer |
| [quote-cart page](/e:/new-repo-20260306-235837/app/quote-cart/page.tsx) | 6 | Live route-level cleanup still open |
| [FilterGrid.tsx](/e:/new-repo-20260306-235837/app/products/[category]/FilterGrid.tsx) | 6 | Live route-level cleanup still open |
| [custom-components.css](/e:/new-repo-20260306-235837/app/custom-components.css) | 6 | Some component-level arbitrary surface values remain by design |
| [ProductViewer.tsx](/e:/new-repo-20260306-235837/app/products/[category]/[product]/ProductViewer.tsx) | 0 | Cleaned in this pass |
| [Simple2DConfigurator.tsx](/e:/new-repo-20260306-235837/components/configurator/Simple2DConfigurator.tsx) | 0 | Cleaned in this pass |

## Shell Status

Shared shell now being normalized:

| Component | Status |
| --- | --- |
| [Header.tsx](/e:/new-repo-20260306-235837/components/site/Header.tsx) | Cleaned onto named shell classes |
| [Footer.tsx](/e:/new-repo-20260306-235837/components/site/Footer.tsx) | Cleaned onto named shell classes |
| [MobileNavDrawer.tsx](/e:/new-repo-20260306-235837/components/site/MobileNavDrawer.tsx) | Cleaned onto named shell classes |
| [CookieConsentBar.tsx](/e:/new-repo-20260306-235837/components/site/CookieConsentBar.tsx) | Cleaned onto named shell classes |

Target rule:
- shared shell components should consume named semantic type/surface classes first
- route-level raw utilities can be cleaned in later passes, but shell drift should not remain
