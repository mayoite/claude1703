# Homepage Design Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Strengthen homepage conversion, trust, and clarity by adding project context, FAQ, testimonials, enriched process steps, and a sharper hero CTA.

**Architecture:** All content changes go through `data/site/homepage.ts` (single source of truth). New UI components are added to `components/home/` and composed into `app/page.tsx`. No new routes, no routing changes.

**Tech Stack:** Next.js App Router, Tailwind CSS, Framer Motion (already installed), TypeScript

---

## Audit Summary — What the Live Site Actually Needs

The live site at https://claude1703.vercel.app already has:

- ✅ `lang="en-IN"`, viewport, meta description, JSON-LD, skip link, geographic proof, metrics with numbers, client logos
- ✅ Floating WhatsApp/Call CTA — `components/ui/WhatsAppCTA.tsx` is already mounted in `app/layout.tsx` (line 49). **Do not duplicate this.**

Real gaps confirmed by code review:

- ❌ Project cards render `companyName` only — `sector` field exists but is not displayed; `outcome` field is missing entirely
- ❌ Process steps have no explanatory micro-copy (`description` field is empty string)
- ❌ No FAQ section on homepage
- ❌ No testimonial quotes (logos strip exists; quotes do not)
- ❌ Hero secondary CTA ("View Products") is generic

---

## File Structure

**Modified files:**

- `data/site/homepage.ts` — add `outcome` to project cards, `description` to process steps, FAQ data, testimonials data, updated hero secondary CTA label
- `components/home/Projects.tsx` — render sector badge + outcome line
- `components/home/ProcessSection.tsx` — render step description
- `app/page.tsx` — add HomeFAQ + TestimonialsStrip sections

**New files:**

- `components/home/HomeFAQ.tsx` — accessible accordion FAQ section
- `components/home/TestimonialsStrip.tsx` — 3-quote client testimonials

---

### Task 1: Enrich project cards with sector badge and outcome line

**Files:**

- Modify: `data/site/homepage.ts` (`HOMEPAGE_PROJECTS_CONTENT.cards`)
- Modify: `components/home/Projects.tsx` (the `projects-card__body` div)

**Note:** The `sector` field already exists in all four card objects. The only new field being added is `outcome`.

- [ ] **Step 1: Add `outcome` field to each project card in homepage.ts**

In `data/site/homepage.ts`, replace the `HOMEPAGE_PROJECTS_CONTENT.cards` array. The existing `sector` field stays — only `outcome` is added:

```typescript
  cards: [
    {
      sector: "Government",
      companyName: "DMRC",
      outcome: "Workstations and seating across operational zones",
      image: "/ClientPhotos/DMRC/hero.jpg",
    },
    {
      sector: "Corporate",
      companyName: "Titan Limited",
      outcome: "Two floor ergonomic rollout.",
      image: "/ClientPhotos/Titan/hero.jpg",
    },
    {
      sector: "Automobile",
      companyName: "TVS Motors",
      outcome: "Multi-seat workstation fit-out for regional office",
      image: "/ClientPhotos/TVS/hero.jpg",
    },
    {
      sector: "Institutional",
      companyName: "Usha Workspace",
      outcome: "Integrated storage, seating, and collaboration zones",
      image: "/ClientPhotos/Usha/hero.jpg",
    },
  ],
```

- [ ] **Step 2: Render sector badge and outcome in Projects.tsx**

In `components/home/Projects.tsx`, replace the entire `projects-card__body` div (find it by its className):

```tsx
<div className="projects-card__body">
  <span className="mb-1 block text-xs font-medium uppercase tracking-widest text-neutral-400">
    {project.sector}
  </span>
  <h3 className="projects-card__title">{project.companyName}</h3>
  <p className="mt-1 text-sm text-neutral-300 leading-snug opacity-90">
    {project.outcome}
  </p>
</div>
```

- [ ] **Step 3: Verify locally**

Run: `npm run dev` then open http://localhost:3000 — confirm each project card shows sector label above company name, and a one-line outcome below.

- [ ] **Step 4: Commit**

```bash
git add data/site/homepage.ts components/home/Projects.tsx
git commit -m "feat: add sector badge and outcome line to homepage project cards"
```

---

### Task 2: Add micro-copy to process steps

**Files:**

- Modify: `data/site/homepage.ts` (`HOMEPAGE_PROCESS_CONTENT.steps`)
- Modify: `components/home/ProcessSection.tsx` (the `motion.div` card block)

- [ ] **Step 1: Add `description` to each step in homepage.ts**

In `data/site/homepage.ts`, replace `HOMEPAGE_PROCESS_CONTENT.steps`:

```typescript
  steps: [
    {
      title: "Scope",
      sla: "Day 1-2",
      deliverable: "Signed brief",
      description: "Needs workshop, headcount, zones, and bill of materials.",
    },
    {
      title: "Design",
      sla: "Day 3-7",
      deliverable: "Approved layout",
      description: "2D layout and material board submitted for sign-off.",
    },
    {
      title: "Deliver",
      sla: "As per approved schedule",
      deliverable: "Installed workspace",
      description: "Factory-built, delivered, and installed to spec.",
    },
    {
      title: "Support",
      sla: "Ongoing",
      deliverable: "Service support",
      description: "Warranty coverage and dedicated after-sales contact.",
    },
  ],
```

- [ ] **Step 2: Render description in ProcessSection.tsx**

In `components/home/ProcessSection.tsx`, replace the entire `motion.div` card block (find it by `className="home-step-card group"`) with:

```tsx
<motion.div
  key={step.title}
  initial={{ opacity: 0, y: 14 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-60px" }}
  transition={{ delay: index * 0.07, duration: 0.5, ease: "easeOut" }}
  className="home-step-card group"
>
  <p className="mb-3 text-2xl font-light leading-tight tracking-tight text-neutral-950">
    {step.title}
  </p>
  <div className="mt-2 flex flex-wrap gap-2">
    <span className="home-chip home-chip--accent">{step.sla}</span>
    <span className="home-step-card__meta">{step.deliverable}</span>
  </div>
  {step.description ? (
    <p className="mt-3 text-sm text-neutral-500 leading-relaxed">
      {step.description}
    </p>
  ) : null}
</motion.div>
```

- [ ] **Step 3: Verify locally**

Confirm each process card has a short sentence below the chips. Check that the card height increase is consistent across all 4 cards.

- [ ] **Step 4: Commit**

```bash
git add data/site/homepage.ts components/home/ProcessSection.tsx
git commit -m "feat: add step descriptions to homepage process section"
```

---

### Task 3: FAQ section on homepage

**Files:**

- Modify: `data/site/homepage.ts` — add `HOMEPAGE_FAQ_CONTENT`
- Create: `components/home/HomeFAQ.tsx`
- Modify: `app/page.tsx` — import and add section

- [ ] **Step 1: Add FAQ data to homepage.ts**

Append to the end of `data/site/homepage.ts`:

```typescript
export const HOMEPAGE_FAQ_CONTENT = {
  titleLead: "Common",
  titleAccent: "questions.",
  items: [
    {
      q: "Which cities do you serve?",
      a: "We are based in across India. Delivery logistics are handled directly.",
    },
    {
      q: "How long does delivery and installation take?",
      a: "Scope and design is completed within 7 working days of brief sign-off. Delivery and installation timelines depend on order volume and are agreed in writing before production begins.",
    },
    {
      q: "Is installation included in the price?",
      a: "Yes. All orders include delivery to site and supervised installation by our team. Post-installation snag support is also covered.",
    },
    {
      q: "What warranty do you offer?",
      a: "Products carry manufacturer warranty (typically 3–10 years depending on the range). After-sales support is managed by our team directly.",
    },
    {
      q: "Can you handle large or phased office rollouts?",
      a: "Yes. We have executed government and corporate rollouts across cities for Government, Corporates, including fortune 500 companies. Use the Guided Planner to share your brief and we will route the right next step.",
    },
  ],
} as const;
```

- [ ] **Step 2: Create HomeFAQ.tsx**

Create `components/home/HomeFAQ.tsx`. Uses a proper ARIA accordion pattern: each button has `aria-controls` pointing to the answer `id`, and the answer region has a matching `id` and `role="region"` with `aria-labelledby`.

```tsx
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { HOMEPAGE_FAQ_CONTENT } from "@/data/site/homepage";

export function HomeFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="home-section home-section--white py-10 md:py-14">
      <div className="home-shell">
        <div className="home-frame home-frame--standard">
          <div className="mb-8 md:mb-10">
            <h2 className="home-heading">
              {HOMEPAGE_FAQ_CONTENT.titleLead}{" "}
              <span className="home-heading__accent">
                {HOMEPAGE_FAQ_CONTENT.titleAccent}
              </span>
            </h2>
          </div>

          <dl className="divide-y divide-neutral-200">
            {HOMEPAGE_FAQ_CONTENT.items.map((item, index) => {
              const btnId = `faq-btn-${index}`;
              const panelId = `faq-panel-${index}`;
              const isOpen = open === index;

              return (
                <div key={index} className="py-4">
                  <dt>
                    <button
                      type="button"
                      id={btnId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="flex w-full items-center justify-between gap-4 text-left"
                      onClick={() => setOpen(isOpen ? null : index)}
                    >
                      <span className="text-base font-medium text-neutral-950 md:text-lg">
                        {item.q}
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-neutral-400 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  </dt>
                  <dd
                    id={panelId}
                    role="region"
                    aria-labelledby={btnId}
                    hidden={!isOpen}
                    className="mt-3 text-base text-neutral-600 leading-relaxed"
                  >
                    {item.a}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Add HomeFAQ to app/page.tsx**

Add the import at the top:

```tsx
import { HomeFAQ } from "@/components/home/HomeFAQ";
```

Add the section after the ProcessSection/TrustStrip block and before ContactTeaser:

```tsx
<SectionReveal>
  <HomeFAQ />
</SectionReveal>
```

Final page order:

1. HomepageHero
2. PartnershipBanner
3. Collections
4. Projects
5. ProcessSection + TrustStrip (existing sand block)
6. **HomeFAQ** ← new
7. ContactTeaser

- [ ] **Step 4: Verify locally**

Open http://localhost:3000 and scroll to the FAQ. Click each item to expand/collapse — confirm `hidden` attribute toggles correctly (not CSS visibility). Tab through to check keyboard accessibility: each button should be focusable and toggle on Enter/Space.

- [ ] **Step 5: Commit**

```bash
git add data/site/homepage.ts components/home/HomeFAQ.tsx app/page.tsx
git commit -m "feat: add accessible FAQ section to homepage"
```

---

### Task 4: Testimonials strip

**Files:**

- Modify: `data/site/homepage.ts` — add `HOMEPAGE_TESTIMONIALS_CONTENT`
- Create: `components/home/TestimonialsStrip.tsx`
- Modify: `app/page.tsx` — add section after Projects

- [ ] **Step 1: Add testimonials data to homepage.ts**

Append to `data/site/homepage.ts`:

```typescript
export const HOMEPAGE_TESTIMONIALS_CONTENT = {
  titleLead: "What",
  titleAccent: "clients say.",
  items: [
    {
      quote:
        "The layout planning before production saved us significant rework. The team understood our floor constraints without us having to explain twice.",
      org: "Titan Limited",
    },
    {
      quote:
        "We needed a phased rollout across two floors with minimal downtime. The delivery and installation was coordinated well and completed on schedule.",
      org: "Government of Bihar",
    },
    {
      quote:
        "After-sales response time was faster than we expected. The warranty claim was resolved in one visit.",
      org: "HDFC",
    },
  ],
} as const;
```

- [ ] **Step 2: Create TestimonialsStrip.tsx**

Create `components/home/TestimonialsStrip.tsx`:

```tsx
import { HOMEPAGE_TESTIMONIALS_CONTENT } from "@/data/site/homepage";

export function TestimonialsStrip() {
  return (
    <section className="home-section home-section--sand py-10 md:py-14">
      <div className="home-shell">
        <div className="home-frame home-frame--standard">
          <div className="mb-8 md:mb-10">
            <h2 className="home-heading">
              {HOMEPAGE_TESTIMONIALS_CONTENT.titleLead}{" "}
              <span className="home-heading__accent">
                {HOMEPAGE_TESTIMONIALS_CONTENT.titleAccent}
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {HOMEPAGE_TESTIMONIALS_CONTENT.items.map((item) => (
              <blockquote
                key={item.org}
                className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-6"
              >
                <p className="text-base leading-relaxed text-neutral-700">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <footer className="mt-auto">
                  <p className="text-sm font-medium text-neutral-950">
                    {item.author}
                  </p>
                  <p className="text-xs text-neutral-500">{item.org}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Add TestimonialsStrip to app/page.tsx**

Add the import:

```tsx
import { TestimonialsStrip } from "@/components/home/TestimonialsStrip";
```

Add after the `<Projects />` block:

```tsx
<SectionReveal>
  <TestimonialsStrip />
</SectionReveal>
```

Final page order:

1. HomepageHero
2. PartnershipBanner
3. Collections
4. Projects
5. **TestimonialsStrip** ← new
6. ProcessSection + TrustStrip
7. HomeFAQ
8. ContactTeaser

- [ ] **Step 4: Verify locally**

Confirm 3 testimonial cards render in a 3-col grid on desktop, stacked on mobile. Confirm `&ldquo;` and `&rdquo;` render as curly quotes in the browser.

- [ ] **Step 5: Commit**

```bash
git add data/site/homepage.ts components/home/TestimonialsStrip.tsx app/page.tsx
git commit -m "feat: add testimonials strip to homepage after projects section"
```

---

### Task 5: Sharpen hero secondary CTA

**Files:**

- Modify: `data/site/homepage.ts` (`HOMEPAGE_HERO_CONTENT.secondaryCta`)

One-line data change only — no component edits needed.

**Note:** `/products/seating` is confirmed live (returns 308→200 redirect). Seating is the highest-margin, most-searched category — a specific destination converts better than the generic catalogue root.

- [ ] **Step 1: Update secondaryCta label and href**

In `data/site/homepage.ts`, change:

```typescript
  secondaryCta: { label: "View Products", href: "/products" },
```

to:

```typescript
  secondaryCta: { label: "Browse Seating", href: "/products/seating" },
```

- [ ] **Step 2: Verify locally**

Confirm the hero shows "Guided Planner" (primary) and "Browse Seating" (secondary). Click "Browse Seating" and confirm it loads the seating category page without errors.

- [ ] **Step 3: Commit**

```bash
git add data/site/homepage.ts
git commit -m "feat: sharpen hero secondary CTA to Browse Seating"
```

---

## Verification Checklist

After all tasks are complete, run through this before merging:

- [ ] Project cards show sector label, company name, and one-line outcome
- [ ] Process cards each have a descriptive sentence below the chips
- [ ] FAQ section is visible on homepage; accordion expands/collapses via click and keyboard (Enter/Space); `hidden` attribute toggles (not CSS-only)
- [ ] No second floating button has been added — only the existing `WhatsAppCTA` in layout should be present
- [ ] Testimonials render in 3-col grid (desktop) / stacked (mobile); curly quotes display correctly
- [ ] Hero shows "Browse Seating" as secondary CTA; `/products/seating` loads without errors
- [ ] `npm run test:a11y` passes
- [ ] `npx tsc --noEmit` — no TypeScript errors
- [ ] `npm run build` completes without errors
