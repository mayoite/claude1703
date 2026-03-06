# Revamp Plan — Cisco-Style Enterprise IA
**One and Only Furniture · Next.js + Tailwind + Supabase**
_Status: Planning only — no TSX/CSS changed yet_

---

## 1. Route Inventory

### App Router Pages (`/app/**`)

| Route | File | Current Purpose |
|-------|------|-----------------|
| `/` | `app/page.tsx` | Homepage — hero carousel (project shots), KPI stats, partnership badge, featured products, recommendations, category grid, video, process, sustainability teaser, projects grid, client badges, client marquee, contact teaser |
| `/about` | `app/about/page.tsx` | Company story, team, values |
| `/career` | `app/career/page.tsx` | Job listings |
| `/catalog` | `app/catalog/page.tsx` | Full product catalog browser |
| `/configurator` | `app/configurator/page.tsx` | 3D workstation configurator |
| `/contact` | `app/contact/page.tsx` | Contact form, address, WhatsApp CTA |
| `/downloads` | `app/downloads/page.tsx` | Brochure / spec-sheet downloads |
| `/gallery` | `app/gallery/page.tsx` | Project photography gallery |
| `/imprint` | `app/imprint/page.tsx` | Legal imprint |
| `/news` | `app/news/page.tsx` | News / press |
| `/planning` | `app/planning/page.tsx` | Space-planning service page |
| `/privacy` | `app/privacy/page.tsx` | Privacy policy |
| `/products` | `app/products/page.tsx` | All-products listing |
| `/products/[category]` | `app/products/[category]/page.tsx` | Category listing with live filters (URL-shareable) |
| `/products/[category]/[slug]` | `app/products/[category]/[slug]/page.tsx` | Product detail page with 3D viewer |
| `/products/oando-chairs` | `app/products/oando-chairs/page.tsx` | Legacy chairs alias (redirect target) |
| `/products/oando-chairs/[slug]` | `app/products/oando-chairs/[slug]/page.tsx` | Legacy slug alias |
| `/products/oando-other-seating` | `app/products/oando-other-seating/page.tsx` | Legacy seating alias |
| `/products/oando-other-seating/[slug]` | — | Legacy slug alias |
| `/projects` | `app/projects/page.tsx` | Completed projects showcase |
| `/quote-cart` | `app/quote-cart/page.tsx` | Quote basket / RFQ |
| `/service` | `app/service/page.tsx` | After-sales, installation, warranty |
| `/showrooms` | `app/showrooms/page.tsx` | Showroom locator |
| `/social` | `app/social/page.tsx` | Social media hub |
| `/solutions` | `app/solutions/page.tsx` | Solutions by sector/use-case landing |
| `/solutions/[category]` | `app/solutions/[category]/page.tsx` | Sector-specific solution pages |
| `/support-ivr` | `app/support-ivr/page.tsx` | Visual IVR / support routing |
| `/sustainability` | `app/sustainability/page.tsx` | ESG / materials story |
| `/terms` | `app/terms/page.tsx` | Terms of service |
| `/tracking` | `app/tracking/page.tsx` | Order / delivery tracking |
| `/workstations/configurator` | `app/workstations/configurator/page.tsx` | Configurator alias route |

### API Routes (`/app/api/**`)

| Endpoint | Purpose |
|----------|---------|
| `GET /api/business-stats` | Returns live KPI stats (Supabase → stale-cache → safe-default) |
| `POST /api/nav-search` | AI-powered nav search (OpenRouter) |
| `GET /api/nav-categories` | Category list for mega menu |
| `GET /api/products/filter` | Product filter with URL-shareable params |
| `GET /api/categories` | Category metadata |
| `GET /api/filter` | Generic filter fallback |
| `POST /api/ai-advisor` | AI workspace advisor chat |
| `POST /api/generate-alt` | OpenAI alt-text generation for product images |
| `POST /api/tracking` | KPI event sink |

---

## 2. Current Homepage — Component Order

```
app/page.tsx
│
├── <GsapAnimations />           — invisible GSAP scroll rig
├── <KpiIntegrityMonitor />      — invisible audit layer (emits events)
│
└── [max-w-1900 wrapper]
    ├── 1. <HeroCarousel />          components/HeroCarousel.tsx
    │       • 92vh full-bleed image carousel (Embla + Autoplay 6s)
    │       • 2 slides: Titan Patna project, TVS Patna project
    │       • CTAs: "Configure in 3D" / "Download Brochure"
    │       ⚠ PROBLEM: Opens with client project photos, not brand promise
    │
    ├── 2. <StatsBlock />            components/home/StatsBlock.tsx
    │       • 4 KPIs: 15+ yrs, 259+ projects, 120+ clients, 20+ locations
    │       • Renders stats.sourceNote if present
    │       ⚠ PROBLEM: Exposes "Safe default while stats service is unavailable."
    │
    ├── 3. <PartnershipSection />    components/home/PartnershipSection.tsx
    │       • Catalog India franchise badge + link
    │       ⚠ PROBLEM: Third section on homepage is a vendor logo, not value
    │
    ├── 4. <FeaturedCarousel />      components/home/FeaturedCarousel.tsx
    │       • 3-product editorial grid (Fluid X, DeskPro, Cocoon Pod)
    │       • Static data — no live product link validation
    │
    ├── 5. <Recommendations />       components/home/Recommendations.tsx
    │       • "Recommended for You" heading
    │       • Default: static preview items + "Load Recommendations" button
    │       • When enabled: calls useRecommendations hook → API
    │       ⚠ PROBLEM: Claims personalization before any signal exists
    │       ⚠ PROBLEM: Static fallback misleadingly uses personalization copy
    │
    ├── 6. <CategoryGrid />          components/home/CategoryGrid.tsx
    │       • Async server component; 1-hr cache
    │       • Seating, Workstations, Tables, Storage, etc.
    │
    ├── 7. <VideoSection />          components/home/VideoSection.tsx
    │       • "Space for collaboration." editorial image section
    │       • No actual video — uses poster image with animate-pulse fallback
    │
    ├── 8. <ProcessSection />        components/home/ProcessSection.tsx
    │       • 4-step: Consultation → Space Planning → Selection → Installation
    │
    ├── 9. <Teaser /> (Sustainability) components/home/Teaser.tsx
    │       • "Sustainability at the core." — recycled wood, low-emission
    │
    ├── 10. <ServiceSection />       components/home/ServiceSection.tsx
    │        • Named "ServiceSection" but renders "Featured Projects" grid
    │        • 4 project cards (DMRC, TVS, Titan, Usha) with image ticker
    │        ⚠ PROBLEM: Misleading component name; duplicates hero project theme
    │
    ├── 11. <OurWork />              components/home/OurWork.tsx
    │        • 16 featured client badges (Titan, DMRC, Tata, HDFC, NTPC…)
    │        • Footer: "{n}+ clients across Government, Finance, Energy…"
    │
    ├── 12. <ContactTeaser />        components/shared/ContactTeaser.tsx
    │        • CTA to contact page
    │
    └── 13. <ClientMarquee />        components/home/ClientMarquee.tsx
             • 60+ clients in two scrolling marquee rows (dark bg)
```

---

## 3. Current Problems

### 3.1 UX / Information Architecture

| # | Problem | Evidence |
|---|---------|----------|
| P1 | **Hero opens on client projects, not brand promise.** A first-time visitor sees "Titan Patna Collaborative Office Design" before they know who One and Only Furniture is. | `HeroCarousel` slides are project spotlights |
| P2 | **Section ordering has no persuasion logic.** Stats appear before the visitor knows what the brand does. Partnership badge appears before product value. | `app/page.tsx` section order |
| P3 | **"Recommended for You" is dishonest copy.** Before any interaction, the section shows static products under a personalization promise. | `Recommendations.tsx` lines 39–50 |
| P4 | **ServiceSection is misnamed and duplicates the hero.** It renders "Featured Projects" — a third project-spotlight section (hero, video, projects grid). | `ServiceSection.tsx` renders PROJECT_ITEMS |
| P5 | **No clear primary CTA above the fold.** Hero buttons are "Configure in 3D" and "Download Brochure" — both conversion actions for late-stage visitors, not explorers. | `HeroCarousel.tsx` CTAs |
| P6 | **PartnershipSection placed at #3.** Showing the franchise logo before products trains visitors to associate the brand with someone else's brand. | `app/page.tsx` line 33 |
| P7 | **CategoryGrid buried at #6.** The primary navigation to products — the core commercial action — is six sections down. | `app/page.tsx` line 36–40 |

### 3.2 Credibility / Debug Leakage

| # | Problem | Evidence |
|---|---------|----------|
| C1 | **"Safe default while stats service is unavailable."** renders to end-users when Supabase is unreachable. | `businessStats.ts:27`, `StatsBlock.tsx:68-70` |
| C2 | **sourceNote is passed through to the UI unconditionally.** Any string in the `source_note` DB column (or the hardcoded safe-default note) is displayed publicly. | `StatsBlock.tsx:68-70` |
| C3 | **No visual differentiation between live and fallback KPI data.** Visitors cannot tell if stats are current. | `StatsBlock.tsx` — no staleness indicator |

### 3.3 Performance

| # | Problem | Evidence |
|---|---------|----------|
| F1 | **Hero is 92vh full-bleed image carousel.** LCP image is a large project photograph. Both slides are `priority` loaded. | `HeroCarousel.tsx` lines 117–118 |
| F2 | **GSAP + Framer Motion + Embla + Fancybox all loaded on homepage.** Heavy JS budget for animations. | `app/page.tsx`, `VideoSection.tsx` |
| F3 | **VideoSection has animate-pulse placeholder** when no video/poster — a paint with no content. | `VideoSection.tsx:92-94` |

### 3.4 Accessibility

| # | Problem | Evidence |
|---|---------|----------|
| A1 | **HeroCarousel h1 is a project name, not the site's primary heading.** Screen-reader users hear "Titan Patna Collaborative Office Design" as the page title. | `HeroCarousel.tsx:141` |
| A2 | **Carousel auto-rotates without user consent.** WCAG 2.2 SC 2.2.2 requires ability to pause moving content. Hover-pause exists but is not keyboard-accessible. | `HeroCarousel.tsx:103` |
| A3 | **ClientMarquee has no pause mechanism for keyboard users.** `hover:[animation-play-state:paused]` only works on pointer devices. | `ClientMarquee.tsx:80,99` |

---

## 4. Proposed Homepage Section Order (Cisco-Style)

```
PROPOSED HOMEPAGE — persuasion arc: Aware → Interested → Evaluate → Act

1. NavBar                 (sticky, logo + Products mega + Search + Quote)
   ─────────────────────────────────────────────────────────────────────
2. HERO — Brand Promise   NEW component: HomepageHero
   • Full-width, text-forward (no heavy image carousel)
   • H1: "Premium Office Systems for India's Leading Organisations."
   • Sub: "15+ years · 259+ projects · Bihar & beyond"
   • Primary CTA: "Explore Products →"  → /products
   • Secondary CTA: "Request a Quote"   → /contact
   • Background: single optimised WebP or subtle gradient — NO carousel
   ─────────────────────────────────────────────────────────────────────
3. STATS BAR              StatsBlock (refactored)
   • 4 KPIs inline, borderless strip
   • Remove sourceNote render; suppress debug strings at source
   ─────────────────────────────────────────────────────────────────────
4. PRODUCT CATEGORIES     CategoryGrid (promote from #6 → #4)
   • "Browse by Category" — first commercial touchpoint
   • Seating / Workstations / Tables / Storage / Soft Seating / Education
   ─────────────────────────────────────────────────────────────────────
5. FEATURED SYSTEMS       FeaturedCarousel (refactored label)
   • "Signature Systems" editorial 8/4 grid
   • Fluid X · DeskPro · Cocoon Pod
   ─────────────────────────────────────────────────────────────────────
6. TRUSTED CLIENTS        OurWork (promote from #11 → #6)
   • Social proof before deep product discovery
   • 16 badges + marquee strip (ClientMarquee merged or immediately after)
   ─────────────────────────────────────────────────────────────────────
7. PROCESS                ProcessSection
   • "Seamless from Start to Finish" — 4 steps
   • Cisco-style: numbered columns, not serif scroll
   ─────────────────────────────────────────────────────────────────────
8. FEATURED PROJECTS      ServiceSection (rename: ProjectsHighlight)
   • Move from #10 → #8; rename component to ProjectsHighlight
   • 4 project cards (DMRC, TVS, Titan, Usha)
   ─────────────────────────────────────────────────────────────────────
9. SUSTAINABILITY TEASER  Teaser
   • "Sustainability at the core."
   ─────────────────────────────────────────────────────────────────────
10. PARTNERSHIP BADGE     PartnershipSection (demote from #3 → #10)
    • "Authorized Catalog Franchise Partner" — supporting detail, not lead
    ─────────────────────────────────────────────────────────────────────
11. CONTACT CTA           ContactTeaser
    • "Talk to our team" full-width strip
    ─────────────────────────────────────────────────────────────────────
[REMOVED from homepage]
  • Recommendations section — replace with "Popular Categories" (static,
    honest) OR implement real sessionStorage-based browsing history first
  • VideoSection — removed until a real video asset exists; poster-only
    with animate-pulse is poor UX and wastes LCP budget
```

---

## 5. Proposed Cisco-Style IA

### 5.1 Header Navigation

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  [Logo]   Products ▾   Solutions ▾   Projects   About   [🔍 Search]  [Cart 0] │
│                                                    [Request a Quote →]         │
└──────────────────────────────────────────────────────────────────────────────┘

Products mega-menu:
┌─────────────────────────────────────────────────────────────┐
│  SEATING          WORKSTATIONS      COLLABORATIVE            │
│  · Office Chairs  · Open Plan       · Soft Seating           │
│  · Task Chairs    · Height-Adjust   · Acoustic Pods          │
│  · Mesh Chairs    · Benching        · Lounge Systems         │
│                                                              │
│  TABLES           STORAGE           EDUCATION                │
│  · Meeting        · Pedestals        · School Furniture      │
│  · Training       · Cabinets         · Library Systems       │
│  · Café/Breakout  · Shelving                                 │
│                                                              │
│  ┌───────────────┐  Featured: Fluid X  →  "Configure in 3D" │
│  │ [All Products]│  New: DeskPro Slim  →  [View →]          │
│  └───────────────┘                                          │
└─────────────────────────────────────────────────────────────┘

Solutions mega-menu:
┌─────────────────────────────────────────────────────────────┐
│  BY SECTOR           BY SPACE            SERVICES            │
│  · Corporate         · Open Office       · Space Planning    │
│  · Government        · Meeting Rooms     · 3D Configurator   │
│  · Education         · Focus Pods        · Installation      │
│  · Healthcare        · Breakout Areas    · After-Sales       │
│  · Banking/Finance   · Executive Suites  · Downloads         │
└─────────────────────────────────────────────────────────────┘
```

**Top-level links (5):** Products · Solutions · Projects · About · Contact
**Utility links:** Search · Quote Cart · Request a Quote (CTA button)

### 5.2 Footer Structure

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  [Logo]                                                                        │
│  One and Only Furniture                                                        │
│  Authorized Catalog Franchise Partner                                          │
│                                                                                │
│  PRODUCTS          SOLUTIONS           COMPANY          SUPPORT                │
│  All Products      Corporate Offices   About Us         Service & Warranty     │
│  Seating           Government          Projects         Showrooms              │
│  Workstations      Education           Sustainability   Downloads              │
│  Tables            Healthcare          Careers          Contact Us             │
│  Storage           Banking             News             Request a Quote        │
│  Soft Seating      Space Planning      Imprint          WhatsApp →             │
│                    3D Configurator                                             │
│                                                                                │
├──────────────────────────────────────────────────────────────────────────────┤
│  📞 +91 90310 22875   ✉ info@oando.co.in   📍 Patna, Bihar, India             │
├──────────────────────────────────────────────────────────────────────────────┤
│  © 2025 One and Only Furniture. All rights reserved.                          │
│  Privacy Policy · Terms of Service · Imprint                                  │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Footer columns (4):** Products · Solutions · Company · Support
**Legal row:** © · Privacy · Terms · Imprint

---

## 6. Design Principles (Cisco-Style)

### 6.1 Spacing System
- **Base unit:** 4px (Tailwind default)
- **Section vertical rhythm:** `py-20 md:py-28` (80px / 112px) — consistent across all homepage sections
- **Container:** `max-w-7xl mx-auto px-6 lg:px-12` — replace inconsistent `container`, `container-wide`, `max-w-[1900px]`
- **Grid:** 12-column base; editorial sections use 8+4 or 6+6 splits

### 6.2 Typography
- **Display / H1:** Inter, 56–80px, weight 300–400, tracking -0.03em, line-height 1.05
- **H2 sections:** Inter or Playfair, 36–48px, weight 400, tracking -0.02em
- **Body:** Inter, 16–18px, weight 300–400, line-height 1.65
- **Labels / eyebrow text:** Inter, 11px, weight 600, tracking 0.2em, uppercase
- **CTA buttons:** Inter, 12–13px, weight 600, tracking 0.08–0.12em, uppercase
- **Rule:** Playfair Display (serif) used only for editorial pull-quotes and section headers where brand voice is expressive — NOT for UI copy

### 6.3 Color
- **Primary action:** `#1434CB` (Cisco-style enterprise blue)
- **Accent / highlight:** `#fdbb0a` (yellow — used sparingly, KPI numbers + primary button)
- **Backgrounds:** white (`#fff`) and `neutral-50` (`#fafafa`) alternating — no heavy dark sections until footer
- **Text:** `neutral-900` primary, `neutral-600` secondary, `neutral-400` meta
- **Borders:** `neutral-100` or `neutral-200` — fine, not heavy

### 6.4 Layout Grid
- **Full-bleed sections:** client marquee, hero, dark CTA strip
- **Contained sections:** all product/feature/stats content → `max-w-7xl`
- **Card grids:** 1 col mobile → 2 col tablet → 3–4 col desktop
- **No max-w-[1900px]** — remove the custom mega-container; use Tailwind's `max-w-7xl` or `max-w-screen-2xl`

### 6.5 Motion
- **Principle:** motion reinforces hierarchy, not decoration
- Replace GSAP-on-homepage with CSS-based scroll animations (`@starting-style` or `IntersectionObserver` with Tailwind `transition`)
- Preserve Framer Motion only where interaction-driven animation is required
- All animations must respect `prefers-reduced-motion`

---

## 7. Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| **Breaking `/products/*` routing** during IA restructure | High | No route file renames; all changes are component-level only. Test with `npm run test:e2e:nav` |
| **KPI sourceNote leaking debug strings** after refactor | High | Null-coerce `sourceNote` in `StatsBlock` — render only if value exists AND does not match `/safe default/i`. Add unit test. |
| **Recommendations section removal breaks A/B test** or analytics events | Medium | Confirm with team. Fallback: keep section but rename heading to "Popular Products" and remove personalization copy |
| **LCP regression** from new hero design | Medium | New hero must use a single optimised WebP ≤ 150kb with `priority` + `fetchpriority="high"`. Run Lighthouse before/after |
| **ClientMarquee a11y WCAG 2.2.2** (no keyboard pause) | Medium | Add `aria-label="pause"` button; toggle `animation-play-state` via JS state |
| **PartnershipSection demotion** breaking franchise contractual display requirement | Low | Confirm with business owner. Keep it on homepage but at position #10, or move to /about |
| **ServiceSection rename** to ProjectsHighlight breaking any direct import references | Low | Grep all import sites before rename; update 1-for-1 |
| **Supabase env var missing in staging** causes silent safe-default fallback | Medium | Add `NEXT_PUBLIC_STATS_SOURCE` indicator to admin panel (not user-facing) |

### Required Env Vars
```
NEXT_PUBLIC_SUPABASE_URL        — Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY   — Supabase anonymous read key
OPENROUTER_API_KEY              — AI search + advisor (nav-search, ai-advisor routes)
```

**Failure modes:**
- `SUPABASE_*` missing → stats fall to `safe-default`; KPI numbers still render but are static. Debug string currently leaks. **Fix:** strip `sourceNote` from user-facing render.
- `OPENROUTER_API_KEY` missing → nav-search returns `source: "local"`; UI shows "Local Fallback" badge — acceptable degradation.

---

## 8. Implementation File Checklist

> Files expected to be touched in the implementation phase. No changes made yet.

### Phase 1 — Critical fixes (non-negotiables)
- [ ] `lib/businessStats.ts` — strip `sourceNote` from `SAFE_DEFAULT_STATS` or set to `null`
- [ ] `components/home/StatsBlock.tsx` — guard `sourceNote` render: never display if contains "unavailable" or "safe default"
- [ ] `components/home/Recommendations.tsx` — rename heading to "Popular Products" OR implement real signal; remove "Recommended for You" without real logic

### Phase 2 — Homepage restructure
- [ ] `app/page.tsx` — reorder sections per §4 proposal
- [ ] `components/HeroCarousel.tsx` → **replace** with new `components/home/HomepageHero.tsx` (text-forward, single image, brand promise H1)
- [ ] `components/home/ServiceSection.tsx` — rename to `ProjectsHighlight.tsx`; update import in `app/page.tsx`
- [ ] `components/home/VideoSection.tsx` — remove from homepage until real video asset exists
- [ ] `components/home/PartnershipSection.tsx` — move to position #10 in page order

### Phase 3 — Design system normalisation
- [ ] `app/globals.css` — audit and consolidate container classes (`container`, `container-wide`, `max-w-[1900px]`)
- [ ] `tailwind.config.ts` — add `maxWidth: { '7xl': '80rem' }` if not already present; remove bespoke max-w values
- [ ] `components/layout/Navbar.tsx` — update `NAV_PRIMARY_LINKS` to match §5.1 structure (add Solutions dropdown)
- [ ] `components/layout/Footer.tsx` — restructure to 4-column layout per §5.2
- [ ] `components/home/CategoryGrid.tsx` — promote to position #4, typography pass

### Phase 4 — Accessibility
- [ ] `components/HeroCarousel.tsx` / `components/home/HomepageHero.tsx` — ensure H1 is brand promise, not project name
- [ ] `components/home/ClientMarquee.tsx` — add keyboard-accessible pause button
- [ ] All animated sections — audit for `prefers-reduced-motion` compliance
- [ ] Run `npm run test:a11y` — fix all critical/serious violations before merge

### Phase 5 — Tests & validation
- [ ] `tests/navigation-smoke.spec.ts` — verify all routes still resolve after restructure
- [ ] `tests/stats-consistency.spec.ts` — verify sourceNote never appears in user-visible DOM
- [ ] `tests/accessibility.spec.ts` — full axe-core pass on homepage
- [ ] Manual: LCP ≤ 2.5s on simulated 4G (Lighthouse)

---

_Last updated: 2026-03-01. No code has been modified. This document is the planning artifact only._
