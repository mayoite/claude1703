"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/shared/Reveal";
import { HOMEPAGE_HERO_CONTENT } from "@/data/site/homepage";

export function HomepageHero() {
  const hasDescription = HOMEPAGE_HERO_CONTENT.description.trim().length > 0;
  const titleLines = HOMEPAGE_HERO_CONTENT.title.filter((line) => line.trim().length > 0);
  const hasDeliveryTitle = HOMEPAGE_HERO_CONTENT.deliverySummary.title.trim().length > 0;
  const hasDeliveryDescription = HOMEPAGE_HERO_CONTENT.deliverySummary.description.trim().length > 0;

  function openGuidedPlanner() {
    window.dispatchEvent(new CustomEvent("oando-assistant:open"));
  }

  return (
    <section className="relative min-h-[84vh] w-full overflow-hidden bg-neutral-950 pt-20 md:min-h-[88vh] md:pt-24">
      <div className="absolute inset-0">
        <Image
          src="/images/hero/titan-patna-hq.webp"
          alt="Ergonomic seating and workstations expertly installed at Titan Patna HQ by One and Only Furniture"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(8,12,20,0.9)_0%,rgba(8,12,20,0.76)_36%,rgba(8,12,20,0.24)_72%,rgba(8,12,20,0.1)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
      </div>

      <div className="container relative z-10 flex min-h-[calc(84vh-5rem)] items-center px-6 py-12 2xl:px-0 md:min-h-[calc(88vh-5rem)] md:py-16">
        <div className="grid w-full gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-end lg:gap-12">
          <div className="max-w-3xl">
            <Reveal y={12} delay={0.04}>
              <div className="mb-4">
                <span className="typ-label text-white/72">
                  {HOMEPAGE_HERO_CONTENT.eyebrowSecondary}
                </span>
              </div>
            </Reveal>
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
                <p className="typ-lead mb-8 max-w-2xl text-white/86 md:mb-10">
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
            <Reveal y={10} delay={0.3}>
              <div className="mt-6 grid max-w-xl grid-cols-1 gap-2.5 sm:grid-cols-2">
                {HOMEPAGE_HERO_CONTENT.proofCards.map((card) => (
                  <div key={card.label} className="home-proof-card home-proof-card--dark">
                    <p className="home-proof-card__label home-proof-card__label--dark">{card.label}</p>
                    <p className="home-proof-card__value home-proof-card__value--dark">{card.value}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal y={20} delay={0.3}>
            <aside className="home-panel home-panel--dark max-w-md lg:ml-auto">
              <p className="home-panel__kicker home-panel__kicker--dark">
                {HOMEPAGE_HERO_CONTENT.deliverySummary.kicker}
              </p>
              {hasDeliveryTitle ? (
                <h2 className="typ-section mt-3 text-white">
                  {HOMEPAGE_HERO_CONTENT.deliverySummary.title}
                </h2>
              ) : null}
              {hasDeliveryDescription ? (
                <p className="home-panel__copy--dark">
                  {HOMEPAGE_HERO_CONTENT.deliverySummary.description}
                </p>
              ) : null}
              <div className="mt-5 space-y-4 border-t border-white/10 pt-4">
                {HOMEPAGE_HERO_CONTENT.deliveryRows.map((row) => (
                  <p key={row.label} className="text-base leading-relaxed text-white/86">
                    {row.value}
                  </p>
                ))}
              </div>
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
