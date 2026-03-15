"use client";
import { ReactNode } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export function ScrollAnimate({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useScrollAnimation();
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
