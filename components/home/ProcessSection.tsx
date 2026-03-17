"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HOMEPAGE_PROCESS_CONTENT } from "@/data/site/homepage";

interface ProcessSectionProps {
  embedded?: boolean;
}

export function ProcessSection({ embedded = false }: ProcessSectionProps) {
  const hasDescription = HOMEPAGE_PROCESS_CONTENT.description.trim().length > 0;
  const content = (
    <>
      <div className="mb-10 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="home-heading scheme-text-strong max-w-3xl">
            {HOMEPAGE_PROCESS_CONTENT.titleLead}{" "}
            <span className="home-heading__accent">{HOMEPAGE_PROCESS_CONTENT.titleAccent}</span>
          </h2>
          {hasDescription ? (
            <p className="scheme-text-body mt-4 max-w-2xl text-lg leading-relaxed">
              {HOMEPAGE_PROCESS_CONTENT.description}
            </p>
          ) : null}
        </div>
        <Link href={HOMEPAGE_PROCESS_CONTENT.cta.href} className="btn-primary self-start md:self-auto">
          {HOMEPAGE_PROCESS_CONTENT.cta.label} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {HOMEPAGE_PROCESS_CONTENT.steps.map((step, index) => (
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
          </motion.div>
        ))}
      </div>
    </>
  );

  if (embedded) {
    return content;
  }

  return (
    <section className="home-section home-section--sand py-10 md:py-12">
      <div className="home-shell">
        <div className="home-frame home-frame--standard">
          {content}
        </div>
      </div>
    </section>
  );
}
