import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { FeaturedCarousel } from "@/components/home/FeaturedCarousel";
import { BrandStatement } from "@/components/home/BrandStatement";
import { CollaborationSection } from "@/components/home/CollaborationSection";
import { ClientQuote } from "@/components/home/ClientQuote";
import { Teaser } from "@/components/home/Teaser";
import { ContactTeaser } from "@/components/shared/ContactTeaser";
import { getBusinessStats } from "@/lib/businessStats";
import { formatKpiAsOf, formatKpiValuePlus } from "@/lib/kpiFormat";

const CLIENTS = [
  "DMRC",
  "Tata Steel",
  "HDFC",
  "IndianOil",
  "L&T",
  "NTPC",
  "Titan",
  "Bihar Tourism",
] as const;

const HIGHLIGHTS = [
  {
    title: "DMRC Offices",
    detail: "Workspace systems delivered with phase-wise planning and installation handover.",
  },
  {
    title: "Titan Patna HQ",
    detail: "Ergonomic seating and workstation deployment aligned to team-level needs.",
  },
  {
    title: "Enterprise Fit-outs",
    detail: "Turnkey planning, supply, and execution for large office and institutional spaces.",
  },
] as const;

export default async function ShowroomsPage() {
  const { stats } = await getBusinessStats();
  const asOfLabel = formatKpiAsOf(stats.asOfDate);

  return (
    <section className="flex min-h-screen flex-col items-center bg-white">
      <Hero
        variant="small"
        title="Showrooms, journey, and client delivery."
        subtitle="A closer look at our execution model, project footprint, and the teams who trust us."
        showButton={false}
        backgroundImage="/images/hero/dmrc-hero.webp"
      />

      <section className="w-full border-y border-neutral-200 bg-white py-16 md:py-20">
        <div className="container px-6 2xl:px-0">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <p className="typ-label text-neutral-700">Trusted at a glance</p>
            <p className="typ-label text-neutral-700">{asOfLabel}</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-neutral-300 bg-neutral-50 px-6 py-5">
              <p className="typ-stat text-neutral-950">{formatKpiValuePlus(stats.clientOrganisations)}</p>
              <p className="mt-2 text-sm font-medium text-neutral-800">Client organisations</p>
            </div>
            <div className="rounded-xl border border-neutral-300 bg-neutral-50 px-6 py-5">
              <p className="typ-stat text-neutral-950">{formatKpiValuePlus(stats.projectsDelivered)}</p>
              <p className="mt-2 text-sm font-medium text-neutral-800">Projects delivered</p>
            </div>
            <div className="rounded-xl border border-neutral-300 bg-neutral-50 px-6 py-5">
              <p className="typ-stat text-neutral-950">{formatKpiValuePlus(stats.sectorsServed)}</p>
              <p className="mt-2 text-sm font-medium text-neutral-800">Sectors served</p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-white py-18 md:py-22">
        <div className="container px-6 2xl:px-0">
          <div className="mb-10">
            <p className="typ-label mb-3 text-neutral-700">About us</p>
            <h2 className="typ-section max-w-3xl text-neutral-950">
              Building workspaces with clear planning, reliable supply, and accountable delivery.
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-neutral-800">
              We started with regional office projects and expanded into multi-city execution. Our
              operating model remains consistent: defined scope, practical timelines, and strong
              after-sales support.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full border-y border-neutral-200 bg-neutral-50 py-18 md:py-22">
        <div className="container px-6 2xl:px-0">
          <p className="typ-label mb-5 text-neutral-700">Clients we have served</p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {CLIENTS.map((client) => (
              <div
                key={client}
                className="rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm font-semibold text-neutral-800"
              >
                {client}
              </div>
            ))}
          </div>
          <Link
            href="/trusted-by"
            className="link-arrow mt-6"
          >
            View full client list
          </Link>
        </div>
      </section>

      <section className="w-full bg-white py-18 md:py-22">
        <div className="container px-6 2xl:px-0">
          <p className="typ-label mb-5 text-neutral-700">Signature deliveries</p>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {HIGHLIGHTS.map((item) => (
              <article key={item.title} className="rounded-xl border border-neutral-300 bg-neutral-50 p-6">
                <h3 className="text-2xl font-light tracking-tight text-neutral-950">{item.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-neutral-800">{item.detail}</p>
              </article>
            ))}
          </div>
          <Link
            href="/portfolio"
            className="link-arrow mt-6"
          >
            Explore portfolio
          </Link>
        </div>
      </section>

      <FeaturedCarousel />
      <BrandStatement />
      <CollaborationSection />
      <Teaser
        title="Designed responsibly, delivered practically."
        subtitle="Sustainability"
        description="From material choices to long-life product planning, we focus on workspace systems that reduce waste and improve lifecycle value."
        linkText="Read sustainability commitments"
        linkUrl="/sustainability"
        imageSrc="/projects/OMC-Porbandar/IMG_3498.webp"
        imageAlt="Sustainable office furniture project"
        lightMode
      />
      <ClientQuote />

      <ContactTeaser />
    </section>
  );
}

