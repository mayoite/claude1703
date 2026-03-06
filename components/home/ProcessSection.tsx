"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const STEPS = [
  {
    title: "Scope and align",
    detail:
      "Capture requirement scope, budget range, timeline, and approval checkpoints before design starts.",
  },
  {
    title: "Design and validate",
    detail:
      "Prepare 2D/3D layouts and BOQ options so internal teams can review and approve quickly.",
  },
  {
    title: "Supply and install",
    detail:
      "Coordinate production windows, dispatch schedules, and on-site installation with minimum disruption.",
  },
  {
    title: "Support after handover",
    detail:
      "Manage warranty registration, issue response, and after-sales support through one accountable team.",
  },
] as const;

export function ProcessSection() {
  return (
    <section className="w-full bg-neutral-950 py-18 md:py-24">
      <div className="container px-6 2xl:px-0">
        <div className="mb-10 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="typ-label mb-4 text-white/60">How we work</p>
            <h2 className="typ-section max-w-3xl text-white">
              A clear four-step delivery system.
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/75">
              Each project follows a transparent sequence so procurement, facilities, and leadership
              teams stay aligned from day one.
            </p>
          </div>
          <Link href="/contact" className="btn-primary self-start md:self-auto">
            Start your project brief <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {STEPS.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: index * 0.07, duration: 0.5, ease: "easeOut" }}
              className="group rounded-xl border border-white/20 bg-white/5 p-6 transition-colors hover:border-primary/60"
            >
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                Step {index + 1}
              </p>
              <p className="mb-3 text-2xl font-light leading-tight tracking-tight text-white transition-colors duration-300 group-hover:text-white">
                {step.title}
              </p>
              <p className="text-base leading-relaxed text-white/75">{step.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
