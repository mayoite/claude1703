"use client";

import { motion, useReducedMotion } from "framer-motion";

interface SectionRevealProps {
  children: React.ReactNode;
  delay?: number;
}

export function SectionReveal({ children, delay = 0 }: SectionRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

