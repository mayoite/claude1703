"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HOMEPAGE_HERO_CONTENT } from "@/data/site/homepage";

const heroProofItems = [
  HOMEPAGE_HERO_CONTENT.proofItems[1],
  HOMEPAGE_HERO_CONTENT.proofItems[0],
  HOMEPAGE_HERO_CONTENT.proofItems[2],
];

export function PreviewHero() {
  const titleLines = HOMEPAGE_HERO_CONTENT.title.filter((line) => line.trim().length > 0);
  const description =
    "Planning-led office furniture delivery for teams that need ergonomic seating, scalable workstations, and a cleaner route from brief to installed floor.";

  function openGuidedPlanner() {
    window.dispatchEvent(new CustomEvent("oando-assistant:open"));
  }

  return (
    <section className="preview-hero">
      <div className="preview-hero__media">
        <Image
          src="/images/hero/titan-patna-hq.webp"
          alt="Editorial preview of ergonomic seating and workstations by One&Only"
          fill
          priority
          sizes="100vw"
          className="preview-hero__image"
        />
        <div className="preview-hero__veil" />
      </div>

      <div className="preview-shell preview-hero__shell">
        <div className="preview-hero__content">
          <p className="preview-hero__eyebrow">{HOMEPAGE_HERO_CONTENT.eyebrow}</p>
          <h1 className="preview-hero__title">
            {titleLines.map((line, index) => (
              <span
                key={line}
                className={
                  index === titleLines.length - 1
                    ? "preview-hero__line preview-hero__line--accent"
                    : "preview-hero__line"
                }
              >
                {line}
              </span>
            ))}
          </h1>
          <p className="preview-hero__copy">{description}</p>

          <div className="preview-hero__actions">
            <button
              type="button"
              onClick={openGuidedPlanner}
              className="preview-button preview-button--primary"
            >
              Open Guided Planner
            </button>
            <Link
              href={HOMEPAGE_HERO_CONTENT.secondaryCta.href}
              className="preview-button preview-button--secondary"
            >
              Review Recent Projects
            </Link>
          </div>

          <div className="preview-hero__proof">
            {heroProofItems.map((item) => (
              <article key={item.label} className="preview-proof-card">
                <p className="preview-proof-card__label">{item.label}</p>
                <p className="preview-proof-card__value">{item.value}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="preview-hero__aside">
          <p className="preview-hero__aside-label">Editorial sample</p>
          <p className="preview-hero__stat">{HOMEPAGE_HERO_CONTENT.sidePanel.stat}</p>
          <h2 className="preview-hero__aside-title">{HOMEPAGE_HERO_CONTENT.sidePanel.title}</h2>
          <p className="preview-hero__aside-copy">{HOMEPAGE_HERO_CONTENT.sidePanel.description}</p>
          <Link href="/products" className="preview-inline-link">
            Browse product categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </aside>
      </div>
    </section>
  );
}
