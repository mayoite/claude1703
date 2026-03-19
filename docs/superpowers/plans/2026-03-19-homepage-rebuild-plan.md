# Replan: Homepage Rebuild, Visual System Reset, and Two-Chat Split

## Why The Earlier Plan Was Not Enough

The previous plan was directionally right but too dull and too abstract. It did not lock:

- a stronger visual direction
- a real typography reset
- a real color reset
- a real motion reset
- component standardization targets
- safe ownership boundaries for two parallel chats

Current homepage work is already partway done, but the system still feels mixed. The main problems are not just layout. They are system problems:

- color is too blunt and too dark in the wrong places
- typography is thin but not intentional enough
- animation is repetitive and template-like
- hover behavior is overused and inconsistent
- section structures are too similar
- the same jobs are solved with too many patterns

This replan fixes that.

---

## Target Direction

Homepage should feel:

- enterprise and premium, not startup-generic
- lighter and more editorial, not black-heavy
- calm and deliberate, not over-animated
- proof-driven, not decorative
- modular, but not repetitive

Reference intent:

- dark only where it creates authority or contrast
- blue used as a restrained brand accent, not everywhere
- typography carries hierarchy more than borders and effects
- motion supports reading order, not "look at me" behavior

---

## Non-Negotiables

- Keep `/products/*` routing intact.
- Homepage must start with the brand promise.
- No user-visible debug or fallback text.
- Keep hero media performant. No heavy video hero.
- Preserve keyboard navigation, focus states, and semantic landmarks.
- Do not push to remote unless explicitly asked.

---

## Phase 1: Standardization Reset

### Goal

Remove mixed patterns before more visual polish is added.

### 1. Shared homepage primitives

Standardize these and stop inventing one-off variants:

- [ ] `SectionShell`: width, horizontal padding, vertical rhythm
- [ ] `SectionHeader`: kicker, title, description, action alignment
- [ ] `DisplayHeading`: hero and large editorial heading rules
- [ ] `SurfaceCard`: one base card surface with controlled variants
- [ ] `MediaFrame`: shared image shell, aspect ratio, overlay, hover response
- [ ] `ActionRow`: primary/secondary CTA alignment and spacing

### 2. Standardize section jobs

Each homepage section gets one job only:

- [ ] Hero: promise + primary conversion
- [ ] Authority band: franchise proof + operating credibility
- [ ] Trust marquee: names/logos only, no repeated explanation
- [ ] Solutions: start from requirement, not products
- [ ] Projects: editorial proof
- [ ] Collections: direct category browse
- [ ] Process: how delivery works
- [ ] Testimonials: client voice only
- [ ] Closing CTA: fast conversion

### 3. Standardize copy containers

- [ ] One kicker style
- [ ] One large section-heading style
- [ ] One lead paragraph style
- [ ] One micro/meta style
- [ ] Reduce uppercase overuse
- [ ] Remove sections that repeat the same message in different wording

### 4. Standardize helper ownership

- [ ] canonical motion helpers in `lib/helpers/motion.ts`
- [ ] canonical SEO helpers in `data/site/seo.ts`
- [ ] canonical image helpers in `lib/helpers/images.ts` if needed
- [ ] no parallel scroll-animation systems left active

Exit condition:

- [ ] homepage reads like one system, not several merged experiments

---

## Phase 2: Typography Reset

### Goal

Make the current font stack feel intentional instead of merely light.

### Direction

- `Cisco Sans` stays the display voice.
- `Helvetica Neue` stays the body voice.
- The improvement comes from hierarchy, weight discipline, spacing, and usage rules.

### Required changes

- [ ] Tighten display usage to hero, major section headings, and stat moments only
- [ ] Stop using very light display text everywhere
- [ ] Raise body-text confidence with slightly firmer contrast and cleaner line lengths
- [ ] Reduce decorative accent treatment on headings
- [ ] Make section headings feel contemporary instead of 2018 landing-page style
- [ ] Normalize title widths so headings do not break awkwardly
- [ ] Reduce dependency on uppercase labels for hierarchy

### Standardization rules

- [ ] one hero display scale
- [ ] one section title scale
- [ ] one card title scale
- [ ] one lead/body scale
- [ ] one meta/eyebrow scale
- [ ] one stat scale

### Files most likely involved

- [ ] [lib/fonts.ts](/d:/Claude1703/lib/fonts.ts)
- [ ] [app/theme-tokens.css](/d:/Claude1703/app/theme-tokens.css)
- [ ] [app/typography.css](/d:/Claude1703/app/typography.css)
- [ ] [app/homepage.css](/d:/Claude1703/app/homepage.css)

Exit condition:

- [ ] typography feels premium, current, and controlled without becoming loud

---

## Phase 3: Color Reset

### Goal

Move from dull and black-heavy to restrained, premium, and legible.

### Direction

- page background should feel lighter and cleaner
- dark surfaces should be concentrated in hero, footer, and specific contrast moments
- blue should feel quieter and more premium
- borders should guide structure, not dominate it
- text hierarchy should do more work than hard contrast blocks

### Required semantic token cleanup

- [ ] `surface-page`
- [ ] `surface-panel`
- [ ] `surface-muted`
- [ ] `surface-inverse`
- [ ] `border-soft`
- [ ] `border-strong`
- [ ] `text-heading`
- [ ] `text-body`
- [ ] `text-muted`
- [ ] `text-brand`
- [ ] `text-inverse`
- [ ] `surface-hover`
- [ ] `surface-active`

### Specific fixes

- [ ] reduce muddy gray-blue feeling in light sections
- [ ] reduce overuse of deep navy outside hero/footer
- [ ] make card surfaces cleaner and brighter
- [ ] make muted text more readable
- [ ] make link color distinct from plain informational text
- [ ] improve section-to-section contrast without looking patchy

### Files most likely involved

- [ ] [app/theme-tokens.css](/d:/Claude1703/app/theme-tokens.css)
- [ ] [app/color-contrast.css](/d:/Claude1703/app/color-contrast.css)
- [ ] [app/homepage.css](/d:/Claude1703/app/homepage.css)

Exit condition:

- [ ] homepage no longer feels dull, flat, or heavy-handed

---

## Phase 4: Motion And Hover Reset

### Goal

Replace the current reveal spam and generic lift behavior with a smaller, sharper motion language.

### Current problems to remove

- [ ] too many entrance patterns: `Reveal`, `SectionReveal`, `fadeUp`, `useScrollAnimation`
- [ ] too much vertical lift reused on cards, stats, logos, quotes, and process panels
- [ ] hero ambient animation feels ornamental instead of purposeful
- [ ] scroll reveals are becoming the default answer to everything
- [ ] hover effects are similar everywhere, so nothing feels special

### Motion policy

- [ ] keep one shared entrance system
- [ ] keep one hover timing/easing policy
- [ ] use ambient motion only in 1-2 places max
- [ ] use stagger only where it improves reading order
- [ ] respect `prefers-reduced-motion` consistently

### Required animation changes

- [ ] remove duplicate reveal wrappers or make them delegate to one system
- [ ] tone down hero drift/breathe effects
- [ ] stop lifting every card on hover
- [ ] make project cards feel more editorial than floaty
- [ ] make CTA hover sharper, not glowier
- [ ] make marquee motion calmer and visually integrated
- [ ] reduce movement distance across the board

### Hover standardization

- [ ] one link hover pattern
- [ ] one button hover pattern
- [ ] one standard card hover pattern
- [ ] one image-card hover pattern
- [ ] one inverse-surface hover pattern

### Files most likely involved

- [ ] [components/shared/Reveal.tsx](/d:/Claude1703/components/shared/Reveal.tsx)
- [ ] [components/shared/SectionReveal.tsx](/d:/Claude1703/components/shared/SectionReveal.tsx)
- [ ] [lib/helpers/motion.ts](/d:/Claude1703/lib/helpers/motion.ts)
- [ ] [hooks/useScrollAnimation.ts](/d:/Claude1703/hooks/useScrollAnimation.ts)
- [ ] [app/homepage.css](/d:/Claude1703/app/homepage.css)

Exit condition:

- [ ] homepage feels deliberate and premium, not animated for its own sake

---

## Phase 5: Homepage Section Rebuild

### 1. Hero

- [ ] keep headline first and dominant
- [ ] improve type rhythm and line breaks
- [ ] make proof/authority content more immediate
- [ ] make side content useful, not decorative filler
- [ ] refine CTA hierarchy
- [ ] reduce template-like glassmorphism feel

### 2. Authority Band

- [ ] make franchise proof cleaner and more confident
- [ ] remove any visual clutter around partner badge/logo
- [ ] ensure this reads as credibility, not another hero clone

### 3. Trust Marquee

- [ ] bring trust section back as a deliberate proof band
- [ ] choose one mode: strong wordmark marquee or restrained logo wall, not both
- [ ] improve spacing, speed, and fade behavior
- [ ] ensure it does not feel like generic SaaS social proof

### 4. Solutions

- [ ] keep requirement-first framing
- [ ] improve card differentiation
- [ ] make imagery more useful and less repetitive
- [ ] make CTA path clearer

### 5. Projects

- [ ] rebuild as the editorial center of the page
- [ ] improve composition rhythm between large and small cards
- [ ] reduce sameness in overlay treatment
- [ ] make proof lines sharper and more specific
- [ ] make hover feel controlled, not float-card boilerplate

### 6. Collections

- [ ] simplify into a direct browse block
- [ ] tighten card density
- [ ] improve portrait image treatment
- [ ] make category labels cleaner and less repetitive

### 7. Process

- [ ] make the delivery system feel operational and credible
- [ ] improve step hierarchy and pacing
- [ ] reduce "four equal boxes" monotony

### 8. Testimonials

- [ ] make testimonials calmer and more premium
- [ ] improve quote rhythm and attribution hierarchy
- [ ] stop using the same card language as every other section

### 9. Closing CTA

- [ ] sharpen conversion language
- [ ] make direct-contact options feel faster and more decisive
- [ ] simplify the visual density of the brief form
- [ ] keep it credible, not salesy

---

## Phase 6: Two-Chat Split

### Why this split

The main collision risks are:

- [app/homepage.css](/d:/Claude1703/app/homepage.css)
- [app/theme-tokens.css](/d:/Claude1703/app/theme-tokens.css)
- [app/typography.css](/d:/Claude1703/app/typography.css)
- [data/site/homepage.ts](/d:/Claude1703/data/site/homepage.ts)
- [app/page.tsx](/d:/Claude1703/app/page.tsx)

One chat must own the shared visual system. The other must stay inside isolated homepage sections.

### Chat A: Visual System + Top/Bottom Funnel

Owns:

- [app/theme-tokens.css](/d:/Claude1703/app/theme-tokens.css)
- [app/typography.css](/d:/Claude1703/app/typography.css)
- [app/homepage.css](/d:/Claude1703/app/homepage.css)
- [data/site/homepage.ts](/d:/Claude1703/data/site/homepage.ts)
- [components/shared/Reveal.tsx](/d:/Claude1703/components/shared/Reveal.tsx)
- [components/shared/SectionReveal.tsx](/d:/Claude1703/components/shared/SectionReveal.tsx)
- [lib/helpers/motion.ts](/d:/Claude1703/lib/helpers/motion.ts)
- [hooks/useScrollAnimation.ts](/d:/Claude1703/hooks/useScrollAnimation.ts)
- [components/home/HomepageHero.tsx](/d:/Claude1703/components/home/HomepageHero.tsx)
- [components/home/HomepageStatsStrip.tsx](/d:/Claude1703/components/home/HomepageStatsStrip.tsx)
- [components/home/PartnershipBanner.tsx](/d:/Claude1703/components/home/PartnershipBanner.tsx)
- [components/home/ClientMarquee.tsx](/d:/Claude1703/components/home/ClientMarquee.tsx)
- [components/shared/ContactTeaser.tsx](/d:/Claude1703/components/shared/ContactTeaser.tsx)

Mission:

- own color, type, motion, and hover reset
- fix hero, authority, trust, and closing conversion
- define the standard classes/patterns the rest of the page should follow

Hard rule:

- Chat A is the only chat allowed to edit shared visual system files

### Chat B: Mid-Page Editorial Sections

Owns:

- [components/home/SolutionsShowcase.tsx](/d:/Claude1703/components/home/SolutionsShowcase.tsx)
- [components/home/Projects.tsx](/d:/Claude1703/components/home/Projects.tsx)
- [components/home/Collections.tsx](/d:/Claude1703/components/home/Collections.tsx)
- [components/home/ProcessSection.tsx](/d:/Claude1703/components/home/ProcessSection.tsx)
- [components/home/TestimonialsStrip.tsx](/d:/Claude1703/components/home/TestimonialsStrip.tsx)

Mission:

- rebuild the middle of the homepage into a stronger editorial narrative
- improve section hierarchy, composition, and proof flow
- use existing tokens/classes or local Tailwind utilities
- avoid touching shared system files unless the lead agent later asks for a merge adjustment

Hard rules:

- do not edit `app/homepage.css`
- do not edit `app/theme-tokens.css`
- do not edit `app/typography.css`
- do not edit `data/site/homepage.ts`
- do not edit `app/page.tsx`

### Lead Merge Owner

After both chats finish, one lead agent merges and validates:

- [ ] reconcile any visual mismatches
- [ ] update [app/page.tsx](/d:/Claude1703/app/page.tsx) only if section order or imports need adjustment
- [ ] do final polish in shared files
- [ ] run checks
- [ ] resolve regressions before handoff

---

## Paste-Ready Handoffs

### Chat A prompt

You own the homepage visual system reset. Work only in these files unless absolutely necessary: `app/theme-tokens.css`, `app/typography.css`, `app/homepage.css`, `data/site/homepage.ts`, `components/shared/Reveal.tsx`, `components/shared/SectionReveal.tsx`, `lib/helpers/motion.ts`, `hooks/useScrollAnimation.ts`, `components/home/HomepageHero.tsx`, `components/home/HomepageStatsStrip.tsx`, `components/home/PartnershipBanner.tsx`, `components/home/ClientMarquee.tsx`, `components/shared/ContactTeaser.tsx`. Fix the color system, font hierarchy, hover language, and animation language. The current site feels dull, black-heavy in the wrong places, and over-animated with too many reveal/lift patterns. Standardize the homepage visual primitives and make hero, authority, trust, and closing CTA feel premium, restrained, and current. Do not touch `/products/*` routing. Do not push. Run `npm run lint`, `npm run build`, and `npm run test:a11y` if your changes touch interactive behavior.

### Chat B prompt

You own the mid-page homepage rebuild. Work only in these files: `components/home/SolutionsShowcase.tsx`, `components/home/Projects.tsx`, `components/home/Collections.tsx`, `components/home/ProcessSection.tsx`, `components/home/TestimonialsStrip.tsx`. Improve section hierarchy, composition, pacing, and proof flow so the middle of the homepage feels editorial and premium instead of repetitive. Use existing tokens/classes or local Tailwind utilities inside these components. Do not edit `app/homepage.css`, `app/theme-tokens.css`, `app/typography.css`, `data/site/homepage.ts`, or `app/page.tsx`. Do not push. Run `npm run lint` and `npm run build` if possible.

---

## Validation

### Required checks

- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] `npm run test:a11y`
- [ ] homepage browser QA on desktop
- [ ] homepage browser QA on mobile

### Visual acceptance

- [ ] color feels lighter, cleaner, and less dull
- [ ] typography feels more intentional and more premium
- [ ] animation feels calmer and more deliberate
- [ ] hover behavior is consistent without repeating the same lift effect everywhere
- [ ] homepage sections feel distinct but still part of one system
- [ ] projects section feels like the editorial center of the page
- [ ] trust and authority read as real proof, not decoration
- [ ] closing CTA feels fast and credible
- [ ] `/products/*` remains intact

---

## Assumptions

- [x] This plan replaces the previous homepage rebuild plan.
- [x] The work is both structural and visual.
- [x] The user wants stronger design direction, not maintenance polish.
- [x] Standardization is part of the work, not a side task.
- [x] Motion quality is a primary problem, not a secondary cleanup item.
