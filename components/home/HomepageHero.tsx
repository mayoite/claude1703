"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/shared/Reveal";

export function HomepageHero() {
  return (
    <section className="relative min-h-[92vh] w-full overflow-hidden pt-24 md:pt-28">
      <div className="absolute inset-0">
        <Image
          src="/images/hero/titan-patna-hq.webp"
          alt="Ergonomic seating and workstations expertly installed at Titan Patna HQ by One and Only Furniture"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/30" />
      </div>

      <div className="container relative z-10 flex min-h-[calc(92vh-6rem)] items-end px-6 pb-14 2xl:px-0 md:pb-18">
        <div className="grid w-full gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="max-w-3xl">
            <Reveal y={28} delay={0.08}>
              <h1 className="typ-display mb-6 text-white leading-[1.02]">
                Spaces that
                <br />
                work as hard
                <br />
                as your team.
              </h1>
            </Reveal>
            <Reveal y={18} delay={0.16}>
              <p className="typ-lead mb-10 max-w-2xl text-white/90">
                Ergonomic seating, modular workstations, and storage systems planned and delivered
                with clear timelines, installation accountability, and after-sales support.
              </p>
            </Reveal>
            <Reveal y={12} delay={0.24}>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex min-h-12 items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-primary-hover"
                >
                  Get Project Quote
                </Link>
                <Link
                  href="/products"
                  className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/65 bg-transparent px-6 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-white/12"
                >
                  Browse Products
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal y={20} delay={0.3}>
            <aside className="max-w-md border border-white/35 bg-black/45 p-6 backdrop-blur-sm md:p-7 lg:ml-auto">
              <p className="typ-label mb-4 text-white/80">Delivery confidence</p>
              <ul className="space-y-3 text-sm leading-relaxed text-white">
                <li>Scope, BOQ, and timeline aligned before execution begins.</li>
                <li>Authorized products installed with handover and warranty documentation.</li>
                <li>One accountable partner from planning to after-sales support.</li>
              </ul>
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
