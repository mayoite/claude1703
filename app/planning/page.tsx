import { Hero } from "@/components/home/Hero";
import Link from "next/link";
import { ContactTeaser } from "@/components/shared/ContactTeaser";

const PLANNING_STEPS = [
  {
    title: "Discovery and brief alignment",
    detail:
      "We map team structure, workflow patterns, budget constraints, and approval checkpoints before design begins.",
  },
  {
    title: "Layout and specification",
    detail:
      "Our team develops 2D/3D concepts and furniture specifications tailored to headcount, zoning, and performance targets.",
  },
  {
    title: "Execution readiness",
    detail:
      "You receive BOQ-ready documentation, phased implementation options, and a clear handover plan for procurement and fit-out teams.",
  },
] as const;

const DELIVERABLES = [
  "Workplace planning workshop",
  "Space zoning and furniture layout",
  "Category-wise furniture recommendations",
  "Budget-aligned BOQ draft",
  "Implementation roadmap",
] as const;

export default function PlanningPage() {
  return (
    <section className="flex min-h-screen flex-col items-center bg-white">
      <Hero
        variant="small"
        title="Planning Service"
        subtitle="Workspace planning that balances workflow, budget, and execution timelines."
        showButton={false}
        backgroundImage="/hero/titan-hero.webp"
      />

      <section className="w-full bg-white py-18 md:py-22">
        <div className="container px-6 2xl:px-0">
          <div className="mb-12 max-w-3xl">
            <p className="typ-label mb-4 text-neutral-700">Planning workflow</p>
            <h2 className="typ-section text-neutral-950">From intent to implementation-ready plans.</h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {PLANNING_STEPS.map((step) => (
              <article key={step.title} className="rounded-xl border border-neutral-300 bg-neutral-50 p-6">
                <h3 className="text-2xl font-light tracking-tight text-neutral-950">{step.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-neutral-800">{step.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full border-y border-neutral-200 bg-neutral-50 py-18 md:py-22">
        <div className="container px-6 2xl:px-0">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="typ-label mb-4 text-neutral-700">What you receive</p>
              <h2 className="typ-section text-neutral-950">Clear deliverables your team can execute.</h2>
              <ul className="mt-6 space-y-3">
                {DELIVERABLES.map((item) => (
                  <li key={item} className="text-base text-neutral-800">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-neutral-300 bg-white p-6">
              <p className="typ-label mb-3 text-neutral-700">Best for</p>
              <p className="text-lg leading-relaxed text-neutral-800">
                New offices, floor expansions, workspace modernization, and enterprise fit-outs
                where planning quality directly impacts cost and timeline.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/contact" className="btn-primary">
                  Request planning call
                </Link>
                <Link
                  href="/products"
                  className="inline-flex min-h-12 items-center justify-center rounded-md border border-neutral-400 bg-white px-6 py-3 text-sm font-semibold tracking-[0.08em] text-neutral-900 transition-colors hover:border-neutral-900 hover:bg-neutral-50"
                >
                  View products
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

