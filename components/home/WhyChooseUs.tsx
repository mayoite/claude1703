"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, Leaf, Activity } from "lucide-react";
import { useScrollAnimation } from "@/lib/hooks/useScrollAnimation";

const features = [
  {
    icon: Activity,
    title: "Performance-Graded Components",
    description:
      "Every system is rated for sustained enterprise use — tested for load, cycle, and ergonomic compliance.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise-Grade Durability",
    description:
      "Built for institutions that demand reliability. BIFMA-compliant structures with a 5-year performance warranty.",
  },
  {
    icon: Leaf,
    title: "Sustainable Engineering",
    description:
      "Low-emission materials, recycled substrates, and responsible supply chains — engineered for a net-positive future.",
  },
  {
    icon: Zap,
    title: "Scalable System Design",
    description:
      "Modular by design. Configure for 5 or 500 workpoints without retrofitting — engineered to scale with you.",
  },
];

export function WhyChooseUs() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div
          ref={ref}
          className={`mb-16 max-w-3xl reveal-on-scroll ${isVisible ? "visible" : ""}`}
        >
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-neutral-400 mb-4">
            Why One &amp; Only
          </p>
          <h2 className="text-3xl md:text-4xl text-neutral-900 tracking-tight mb-6">
            We engineer workspace systems
            <br />
            <span className="italic text-primary">not just furniture.</span>
          </h2>
          <p className="text-lg text-neutral-500 leading-relaxed">
            We engineer workspace systems that improve productivity, health, and
            scalability — trusted by corporate, government, and institutional
            clients across Bihar and beyond.
          </p>
          <ul className="mt-8 flex flex-wrap gap-4">
            {[
              "Performance-graded components",
              "Enterprise-grade durability",
              "Sustainable engineering",
            ].map((bullet) => (
              <li
                key={bullet}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-full text-sm text-neutral-700 font-medium"
              >
                <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                {bullet}
              </li>
            ))}
          </ul>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-neutral-200">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="p-8 border-b lg:border-b-0 lg:border-r border-neutral-200 hover:bg-neutral-50 transition-colors last:border-r-0 group"
            >
              <div className="mb-6 text-neutral-900 group-hover:text-primary transition-colors">
                <feature.icon className="w-8 h-8" strokeWidth={1} />
              </div>
              <h3 className="text-xl font-medium text-neutral-900 mb-3 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-[15px] text-neutral-500 leading-relaxed font-light">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
