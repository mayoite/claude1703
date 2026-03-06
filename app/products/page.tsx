import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Clock3, ShieldCheck } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ContactTeaser } from "@/components/shared/ContactTeaser";

const PILLARS = [
  {
    title: "Specification-led guidance",
    detail:
      "We map headcount, usage patterns, and budget so product choices are practical from day one.",
    icon: CheckCircle2,
  },
  {
    title: "Reliable timelines",
    detail:
      "Modular categories and structured planning help teams move from approval to installation with control.",
    icon: Clock3,
  },
  {
    title: "After-sales confidence",
    detail:
      "Warranty coverage and service support are built into every proposal, not handled as an afterthought.",
    icon: ShieldCheck,
  },
] as const;

const FEATURE_BULLETS = [
  "Ergonomic seating for task, executive, and visitor zones.",
  "Modular workstations for scalable team layouts.",
  "Meeting and collaboration furniture for shared spaces.",
  "Storage systems and accessories for organized operations.",
] as const;

const CLIENTS = [
  "DMRC",
  "Tata Steel",
  "IndianOil",
  "HDFC",
  "NTPC",
  "L&T",
] as const;

export default function ProductsPage() {
  return (
    <section className="flex min-h-screen flex-col items-center bg-white">
      <Hero
        variant="small"
        title="Workspace products"
        subtitle="Furniture categories built for real office workflows, long-term durability, and scalable growth."
        showButton={false}
        backgroundImage="/images/products/60x30-workstation-1.webp"
      />

      <section className="container px-6 py-18 2xl:px-0 md:py-22">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="typ-label mb-4 text-neutral-700">Product strategy</p>
            <h2 className="typ-section max-w-3xl text-neutral-950">
              Products selected for performance, not just presentation.
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-neutral-800">
              We help teams choose categories and specifications that support productivity,
              maintenance, and long-term value across different departments and work modes.
            </p>
            <div className="mt-6 space-y-3">
              {FEATURE_BULLETS.map((item) => (
                <p key={item} className="text-base text-neutral-800">
                  - {item}
                </p>
              ))}
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-neutral-300">
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

      <section className="w-full border-y border-neutral-200 bg-neutral-50 py-18 md:py-22">
        <div className="container px-6 2xl:px-0">
          <div className="mb-10 max-w-3xl">
            <p className="typ-label mb-4 text-neutral-700">Why teams choose us</p>
            <h2 className="typ-section text-neutral-950">A practical product-led delivery model.</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {PILLARS.map((pillar) => (
              <article key={pillar.title} className="rounded-xl border border-neutral-300 bg-white p-6">
                <pillar.icon className="h-6 w-6 text-primary" />
                <h3 className="mt-4 text-2xl font-light tracking-tight text-neutral-950">{pillar.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-neutral-800">{pillar.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-white py-16">
        <div className="container px-6 2xl:px-0">
          <div className="rounded-2xl border border-neutral-300 bg-neutral-50 p-8 md:p-10">
            <p className="typ-label mb-4 text-neutral-700">Need recommendations?</p>
            <h2 className="typ-section max-w-3xl text-neutral-950">
              Share your brief and we will suggest the right category mix.
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-neutral-800">
              Tell us your team size, workspace type, and timeline. We will respond with practical
              product options and implementation guidance.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary">
                Request product consultation
              </Link>
              <Link href="/configurator" className="btn-outline">
                Open 2D configurator
              </Link>
              <Link href="/planning" className="btn-outline">
                Explore planning service
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full border-y border-neutral-200 bg-neutral-50 py-14">
        <div className="container px-6 2xl:px-0">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="typ-label text-neutral-700">Client confidence</p>
            <Link href="/compare" className="link-arrow">
              Compare selected products
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
            {CLIENTS.map((client) => (
              <p
                key={client}
                className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-center text-sm font-medium text-neutral-800"
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
