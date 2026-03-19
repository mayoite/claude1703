"use client";

import Image from "next/image";
import Link from "next/link";
import { HOMEPAGE_HERO_CONTENT } from "@/data/site/homepage";

export function HomepageHero() {
  const hasDescription = HOMEPAGE_HERO_CONTENT.description.trim().length > 0;
  const titleLines = HOMEPAGE_HERO_CONTENT.title.filter((line) => line.trim().length > 0);

  function openGuidedPlanner() {
    window.dispatchEvent(new CustomEvent("oando-assistant:open"));
  }

  return (
    <section className="relative min-h-[74vh] w-full overflow-hidden bg-neutral-950 pt-24 md:min-h-[90vh] md:pt-28">
      <div className="absolute inset-0">
        <Image
          src="/images/hero/titan-patna-hq.webp"
          alt="Ergonomic seating and workstations installed at Titan Patna HQ by One&Only"
          fill
          priority
          sizes="100vw"
          className="animate-hero-pan object-cover object-[62%_center] md:object-[58%_42%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(8,14,22,0.48)_0%,rgba(8,14,22,0.3)_34%,rgba(8,14,22,0.12)_62%,rgba(8,14,22,0.02)_100%)] md:bg-[linear-gradient(96deg,rgba(8,14,22,0.62)_0%,rgba(8,14,22,0.42)_28%,rgba(8,14,22,0.18)_54%,rgba(8,14,22,0.05)_76%,rgba(8,14,22,0.01)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/48 via-black/16 to-transparent md:from-black/52 md:via-black/14" />
      </div>

      <div className="container-wide relative z-10 flex min-h-[calc(74vh-5rem)] items-center px-4 py-12 sm:px-6 md:min-h-[calc(90vh-5rem)] md:py-16">
        <div className="w-full">
          <div className="max-w-[38rem]">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/74">
              {HOMEPAGE_HERO_CONTENT.eyebrow}
            </p>
            <h1 className="typ-display mb-5 max-w-[11ch] text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.16)] max-md:text-[clamp(3.25rem,14vw,4.3rem)] md:mb-6">
              {titleLines.map((line) => (
                <span key={line} className="block md:whitespace-nowrap">
                  {line}
                </span>
              ))}
            </h1>
            {hasDescription ? (
              <p className="typ-lead scheme-text-inverse-body mb-8 max-w-2xl md:mb-10">
                {HOMEPAGE_HERO_CONTENT.description}
              </p>
            ) : null}
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
          </div>
        </div>
      </div>
    </section>
  );
}
