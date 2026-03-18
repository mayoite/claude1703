import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Clock3, ShieldCheck } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ContactTeaser } from "@/components/shared/ContactTeaser";
import { PRODUCTS_PAGE_COPY } from "@/data/site/routeCopy";
import { buildBreadcrumbJsonLd, buildPageJsonLd, buildPageMetadata } from "@/data/site/seo";
import { SITE_URL } from "@/lib/siteUrl";

const PILLAR_ICONS = {
  "check-circle": CheckCircle2,
  clock: Clock3,
  shield: ShieldCheck,
} as const;

const CATEGORY_ITEMS = [
  { name: "Seating", url: "/products/seating" },
  { name: "Workstations", url: "/products/workstations" },
  { name: "Tables", url: "/products/tables" },
  { name: "Storage", url: "/products/storages" },
  { name: "Soft Seating", url: "/products/soft-seating" },
  { name: "Education", url: "/products/education" },
];

export const metadata: Metadata = buildPageMetadata(SITE_URL, {
  title: "Workspace Products",
  description: PRODUCTS_PAGE_COPY.heroSubtitle,
  path: "/products",
  image: "/images/catalog/oando-workstations--deskpro/image-1.jpg",
  keywords: [
    "office furniture Patna",
    "office furniture Bihar",
    "office furniture Jharkhand",
    "workspace furniture India",
    "ergonomic chairs Patna",
    "modular workstations Bihar",
    "meeting tables Jharkhand",
  ],
});

export default function ProductsPage() {
  const productsJsonLd = buildPageJsonLd(SITE_URL, {
    path: "/products",
    title: "Workspace Products",
    description: PRODUCTS_PAGE_COPY.heroSubtitle,
    pageType: "CollectionPage",
  });

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(SITE_URL, [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
  ]);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Workspace Product Categories",
    itemListElement: CATEGORY_ITEMS.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: new URL(item.url, SITE_URL).toString(),
    })),
  };

  return (
    <section className="scheme-page flex min-h-screen flex-col items-center">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productsJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <Hero
        variant="small"
        title={PRODUCTS_PAGE_COPY.heroTitle}
        subtitle={PRODUCTS_PAGE_COPY.heroSubtitle}
        showButton={true}
        buttonText="Browse Categories"
        buttonLink="#categories"
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
            <ul className="mt-6 space-y-3 list-none pl-0">
              {PRODUCTS_PAGE_COPY.featureBullets.map((item) => (
                <li key={item} className="page-copy-sm scheme-text-body flex items-start gap-2">
                  <span aria-hidden="true" className="shrink-0 select-none">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="scheme-border relative aspect-[4/3] overflow-hidden rounded-2xl border">
            <Image
              src="/images/catalog/oando-workstations--deskpro/image-1.jpg"
              alt="Deskpro workstation setup used as category planning preview"
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
              const headingId = `pillar-${pillar.title.replace(/\s+/g, "-").toLowerCase()}`;
              return (
              <article key={pillar.title} aria-labelledby={headingId} className="scheme-panel scheme-border rounded-xl border p-6">
                <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                <h3 id={headingId} className="typ-h3 scheme-text-strong mt-4">{pillar.title}</h3>
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
          <p className="typ-label scheme-text-body mb-5">{PRODUCTS_PAGE_COPY.confidenceKicker}</p>
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
          <div className="mt-5">
            <Link href="/compare" className="link-arrow">
              {PRODUCTS_PAGE_COPY.confidenceCta}
            </Link>
          </div>
        </div>
      </section>

      <ContactTeaser />
    </section>
  );
}
