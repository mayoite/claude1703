import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { ContactTeaser } from "@/components/shared/ContactTeaser";
import {
  PLANNING_PAGE_COPY,
  PLANNING_PAGE_DELIVERABLES,
  PLANNING_PAGE_STEPS,
} from "@/data/site/routeCopy";
import { buildPageMetadata } from "@/data/site/seo";
import { SITE_URL } from "@/lib/siteUrl";

export const metadata: Metadata = buildPageMetadata(SITE_URL, {
  title: "Planning Service",
  description:
    "A structured approach for planning, procurement alignment, execution, and support.",
  path: "/planning",
});

export default function PlanningPage() {
  return (
    <section className="scheme-page flex min-h-screen flex-col items-center">
      <Hero
        variant="small"
        title={PLANNING_PAGE_COPY.heroTitle}
        subtitle={PLANNING_PAGE_COPY.heroSubtitle}
        showButton={false}
        backgroundImage="/hero/titan-hero.webp"
      />

      <section className="w-full py-18 md:py-22">
        <div className="container px-6 2xl:px-0">
          <div className="mb-12 max-w-3xl">
            <p className="typ-label scheme-text-body mb-4">{PLANNING_PAGE_COPY.workflowKicker}</p>
            <h2 className="typ-section scheme-text-strong">{PLANNING_PAGE_COPY.workflowTitle}</h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {PLANNING_PAGE_STEPS.map((step) => (
              <article
                key={step.title}
                className="scheme-panel scheme-border rounded-3xl border p-6"
              >
                <h3 className="text-2xl font-light tracking-tight text-strong">{step.title}</h3>
                <p className="page-copy scheme-text-body mt-3">{step.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="scheme-section-soft scheme-border w-full border-y py-18 md:py-22">
        <div className="container px-6 2xl:px-0">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="typ-label scheme-text-body mb-4">{PLANNING_PAGE_COPY.deliverablesKicker}</p>
              <h2 className="typ-section scheme-text-strong">{PLANNING_PAGE_COPY.deliverablesTitle}</h2>
              <ul className="mt-6 space-y-3">
                {PLANNING_PAGE_DELIVERABLES.map((item) => (
                  <li key={item} className="page-copy scheme-text-body flex gap-3">
                    <span className="mt-2 h-2.5 w-2.5 rounded-full bg-primary" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="scheme-panel scheme-border rounded-3xl border p-6">
              <p className="typ-label scheme-text-body mb-3">{PLANNING_PAGE_COPY.bestForKicker}</p>
              <p className="page-copy scheme-text-body">
                {PLANNING_PAGE_COPY.bestForDescription}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/contact" className="btn-primary">
                  {PLANNING_PAGE_COPY.primaryCta}
                </Link>
                <Link href="/products" className="btn-outline">
                  {PLANNING_PAGE_COPY.secondaryCta}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-6 md:py-10">
        <div className="container px-6 2xl:px-0">
          <div className="scheme-panel-dark rounded-4xl p-8 md:p-10">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="typ-label scheme-text-inverse-muted">{PLANNING_PAGE_COPY.deskKicker}</p>
                <h2 className="typ-section mt-4 text-inverse">{PLANNING_PAGE_COPY.deskTitle}</h2>
                <p className="page-copy scheme-text-inverse-body mt-4 max-w-2xl">
                  {PLANNING_PAGE_COPY.deskDescription}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/contact" className="home-btn-primary">
                  {PLANNING_PAGE_COPY.primaryCta}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactTeaser />
    </section>
  );
}

