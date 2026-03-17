"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/shared/Reveal";
import { HOMEPAGE_HERO_CONTENT } from "@/data/site/homepage";

export function HomepageHero() {
  const hasDescription = HOMEPAGE_HERO_CONTENT.description.trim().length > 0;
  const titleLines = HOMEPAGE_HERO_CONTENT.title.filter((line) => line.trim().length > 0);

  function openGuidedPlanner() {
    window.dispatchEvent(new CustomEvent("oando-assistant:open"));
  }

  return (
    <section className="relative min-h-[72vh] w-full overflow-hidden bg-neutral-950 pt-20 md:min-h-[78vh] md:pt-24">
      <div className="absolute inset-0">
        <Image
          src="/images/hero/titan-patna-hq.webp"
          alt="Ergonomic seating and workstations installed at Titan Patna HQ by One&Only"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(8,12,20,0.9)_0%,rgba(8,12,20,0.76)_36%,rgba(8,12,20,0.24)_72%,rgba(8,12,20,0.1)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
      </div>

      <div className="container relative z-10 flex min-h-[calc(72vh-5rem)] items-center px-6 py-12 2xl:px-0 md:min-h-[calc(78vh-5rem)] md:py-16">
        <div className="w-full">
          <div className="max-w-4xl">
            <Reveal y={28} delay={0.08}>
              <h1 className="typ-display mb-5 max-w-[14ch] text-white md:mb-6">
                {titleLines.map((line, index) => (
                  <span key={line} className="block">
                    {line}
                    {index < titleLines.length - 1 ? <br /> : null}
                  </span>
                ))}
              </h1>
            </Reveal>
            {hasDescription ? (
              <Reveal y={18} delay={0.16}>
                <p className="typ-lead scheme-text-inverse-body mb-8 max-w-2xl md:mb-10">
                  {HOMEPAGE_HERO_CONTENT.description}
                </p>
              </Reveal>
            ) : null}
            <Reveal y={12} delay={0.24}>
              <div className="home-actions">
                <button
                  type="button"
                  onClick={openGuidedPlanner}
                  className="btn-hero-primary"
                >
                  {HOMEPAGE_HERO_CONTENT.primaryCta.label}
                </button>
                <Link
                  href={HOMEPAGE_HERO_CONTENT.secondaryCta.href}
                  className="btn-hero-secondary"
                >
                  {HOMEPAGE_HERO_CONTENT.secondaryCta.label}
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
