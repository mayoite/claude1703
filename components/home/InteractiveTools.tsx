"use client";

import Link from "next/link";
import { ArrowRight, Box, Monitor, DraftingCompass } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/helpers/motion";

const tools = [
  {
    title: "Workspace Planner",
    description: "Build office layouts, place products, and review the room in 2D and 3D from one planner shell.",
    href: "/planner",
    icon: DraftingCompass,
    badge: "New",
  },
  {
    title: "Planning Service",
    description: "Move from brief to BOQ-ready planning when the project still needs structure, zoning, and rollout logic.",
    href: "/planning",
    icon: Box,
  },
  {
    title: "Partner Portal",
    description: "Sign in to manage and review enterprise projects, access specialized pricing, and manage tracking.",
    href: "/login",
    icon: Monitor,
  },
];

export function InteractiveTools() {
  return (
    <section className="home-section py-16 md:py-24 border-y scheme-border bg-hover/30">
      <div className="home-shell">
        <motion.div className="mb-12 max-w-2xl" {...fadeUp(14, 0.03)}>
          <p className="typ-label mb-3 text-primary">Digital Workspace</p>
          <h2 className="typ-h2 text-strong">Planning tools that actually move the project forward</h2>
          <p className="typ-lead mt-4 text-body">
            Use the live planner for layout work, the planning desk for structured project intake, and the partner portal when the project is already in motion.
          </p>
        </motion.div>

        <motion.div
          className="grid gap-6 md:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.16 }}
        >
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <motion.div key={tool.title} variants={staggerItem}>
                <Link
                  href={tool.href}
                  className="group flex flex-col rounded-4xl border scheme-border bg-panel p-8 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <motion.div
                      className="flex h-12 w-12 items-center justify-center rounded-2xl scheme-accent-wash text-primary"
                      whileHover={{ rotate: -6, scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon className="h-6 w-6 stroke-[1.5]" />
                    </motion.div>
                    {tool.badge && (
                      <span className="rounded-full border scheme-border bg-hover px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted">
                        {tool.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="typ-h3 text-strong group-hover:text-primary transition-colors">
                    {tool.title}
                  </h3>

                  <p className="mt-4 flex-1 text-sm leading-6 text-body">
                    {tool.description}
                  </p>

                  <div className="mt-8 flex items-center text-sm font-semibold text-primary transition-transform group-hover:translate-x-1">
                    Launch tool
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
