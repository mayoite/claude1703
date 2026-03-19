"use client";

import { HOMEPAGE_STATS_CONTENT } from "@/data/site/homepage";
import { Reveal } from "@/components/shared/Reveal";

const statsShellClass =
  "container relative z-20 px-6 2xl:px-0";

const statsGridClass =
  "grid grid-cols-2 gap-3 xl:grid-cols-4";

const statCardClass =
  "group relative overflow-hidden rounded-[1.4rem] border border-[color:color-mix(in_srgb,var(--color-brand-muted)_30%,white)] bg-white p-5 shadow-[0_28px_58px_-44px_color-mix(in_srgb,var(--surface-inverse)_20%,transparent)] transition-[transform,border-color,box-shadow,background] duration-[var(--motion-base)] [transition-timing-function:var(--ease-standard)] hover:-translate-y-1 hover:border-[color:color-mix(in_srgb,var(--color-primary)_38%,white)] hover:bg-(--surface-soft) hover:shadow-[0_34px_72px_-48px_color-mix(in_srgb,var(--surface-inverse)_22%,transparent)]";

export function HomepageStatsStrip() {
  return (
    <section className="relative z-20 -mt-12 pb-4 md:-mt-16 md:pb-8">
      <div className={statsShellClass}>
        <div className={statsGridClass}>
          {HOMEPAGE_STATS_CONTENT.map((item, index) => (
            <Reveal key={item.label} y={16} delay={0.05 + index * 0.06}>
              <article className={statCardClass}>
                <div className="relative z-10">
                  <p className="font-display text-[clamp(2rem,4vw,3rem)] font-[350] leading-[0.96] tracking-[-0.045em] text-(--text-heading)">
                    {item.value}
                  </p>
                  <p className="mt-3 text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-(--text-muted)">
                    {item.label}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
