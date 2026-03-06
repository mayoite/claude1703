"use client";

import Image from "next/image";

const PARTNERS = [
  { name: "TVS", src: "/photos/TVS/hero.webp" },
  { name: "Titan", src: "/photos/Titan/hero.webp" },
  { name: "DMRC", src: "/photos/DMRC/hero.webp" },
  { name: "Usha", src: "/photos/Usha/hero.webp" },
  { name: "SBI", src: "/photos/SBI/hero.webp" },
  {
    name: "Government of Bihar",
    src: "/photos/Govenment/government-hero.webp",
  },
];

export function Partners() {
  return (
    <section className="py-24 bg-neutral-900 border-y border-neutral-800">
      <div className="container mx-auto px-6 2xl:px-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div className="max-w-md">
            <h2 className="text-3xl md:text-4xl font-light text-white tracking-tight mb-4">
              Trusted Partners
            </h2>
            <p className="text-neutral-400 text-[15px] leading-relaxed font-light">
              Collaborating with industry leaders to deliver exceptional
              workspace environments across India.
            </p>
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Selected Clients
          </p>
        </div>

        <div className="relative flex w-full overflow-hidden">
          {/* Fade edges */}
          <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-neutral-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-neutral-900 to-transparent z-10 pointer-events-none" />

          <div className="flex min-w-full items-center gap-20 md:gap-32 animate-marquee whitespace-nowrap">
            {[...PARTNERS, ...PARTNERS].map((client, index) => (
              <div
                key={`${client.name}-${index}`}
                className="flex items-center justify-center h-20 w-40 shrink-0 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              >
                <Image
                  src={client.src}
                  alt={client.name}
                  width={160}
                  height={80}
                  className="object-contain h-full w-full mix-blend-screen"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
