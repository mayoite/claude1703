import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Clock3, ShieldCheck } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ContactTeaser } from "@/components/shared/ContactTeaser";
import { PRODUCTS_PAGE_COPY } from "@/data/site/routeCopy";
import { buildPageJsonLd, buildPageMetadata } from "@/data/site/seo";
import { SITE_URL } from "@/lib/siteUrl";

const PILLAR_ICONS = {
  "check-circle": CheckCircle2,
  clock: Clock3,
  shield: ShieldCheck,
} as const;

export const metadata: Metadata = buildPageMetadata(SITE_URL, {
  title: "Workspace products | One and Only Furniture",
  description: PRODUCTS_PAGE_COPY.heroSubtitle,
  path: "/products",
  image: "/images/catalog/oando-workstations--deskpro/image-1.webp",
});

export default function ProductsPage() {
  const productsJsonLd = buildPageJsonLd(SITE_URL, {
    path: "/products",
    title: "Workspace products | One and Only Furniture",
    description: PRODUCTS_PAGE_COPY.heroSubtitle,
    pageType: "CollectionPage",
  });

  return (
    <section className="scheme-page flex min-h-screen flex-col items-center">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productsJsonLd) }}
      />
      <Hero
        variant="small"
        title={PRODUCTS_PAGE_COPY.heroTitle}
        subtitle={PRODUCTS_PAGE_COPY.heroSubtitle}
        showButton={false}
        backgroundImage="/images/products/60x30-workstation-1.webp"
      />

      <section className="container px-6 py-18 2xl:px-0 md:py-22">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="typ-label scheme-text-body mb-4">{PRODUCTS_PAGE_COPY.strategyKicker}</p>
            <h2 className="typ-section scheme-text-strong max-w-3xl">
              {PRODUCTS_PAGE_COPY.strategyTitle}
            </h2>
            <p className="page-copy scheme-text-body mt-4 max-w-2xl">
              {PRODUCTS_PAGE_COPY.strategyDescription}
            </p>
            <div className="mt-6 space-y-3">
              {PRODUCTS_PAGE_COPY.featureBullets.map((item) => (
                <p key={item} className="page-copy-sm scheme-text-body">
                  - {item}
                </p>
              ))}
            </div>
          </div>

          <div className="scheme-border relative aspect-[4/3] overflow-hidden rounded-2xl border">
            <Image
              src="/images/catalog/oando-workstations--deskpro/image-1.webp"
              alt="Workspace product category showcase"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <CategoryGrid />

      <section className="scheme-section-soft scheme-border w-full border-y py-18 md:py-22">
        <div className="container px-6 2xl:px-0">
          <div className="mb-10 max-w-3xl">
            <p className="typ-label scheme-text-body mb-4">{PRODUCTS_PAGE_COPY.whyKicker}</p>
            <h2 className="typ-section scheme-text-strong">{PRODUCTS_PAGE_COPY.whyTitle}</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {PRODUCTS_PAGE_COPY.pillars.map((pillar) => {
              const Icon = PILLAR_ICONS[pillar.icon];
              return (
              <article key={pillar.title} className="scheme-panel scheme-border rounded-xl border p-6">
                <Icon className="h-6 w-6 text-primary" />
                <h3 className="typ-h3 scheme-text-strong mt-4">{pillar.title}</h3>
                <p className="page-copy-sm scheme-text-body mt-3">{pillar.detail}</p>
              </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="w-full py-16">
        <div className="container px-6 2xl:px-0">
          <div className="scheme-panel scheme-border rounded-2xl border p-8 md:p-10">
            <p className="typ-label scheme-text-body mb-4">{PRODUCTS_PAGE_COPY.consultKicker}</p>
            <h2 className="typ-section scheme-text-strong max-w-3xl">
              {PRODUCTS_PAGE_COPY.consultTitle}
            </h2>
            <p className="page-copy scheme-text-body mt-4 max-w-3xl">
              {PRODUCTS_PAGE_COPY.consultDescription}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary">
                {PRODUCTS_PAGE_COPY.consultPrimaryCta}
              </Link>
              <Link href="/planning" className="btn-outline">
                {PRODUCTS_PAGE_COPY.consultSecondaryCta}
              </Link>
              <Link href="/downloads" className="btn-outline">
                {PRODUCTS_PAGE_COPY.consultTertiaryCta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="scheme-section-soft scheme-border w-full border-y py-14">
        <div className="container px-6 2xl:px-0">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="typ-label scheme-text-body">{PRODUCTS_PAGE_COPY.confidenceKicker}</p>
            <Link href="/compare" className="link-arrow">
              {PRODUCTS_PAGE_COPY.confidenceCta}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
            {PRODUCTS_PAGE_COPY.clients.map((client) => (
              <p
                key={client}
                className="scheme-panel scheme-border rounded-md border px-3 py-2 text-center text-sm font-medium scheme-text-strong"
              >
                {client}
              </p>
            ))}
          </div>
        </div>
      </section>

      <ContactTeaser />
    </section>
  );
}
