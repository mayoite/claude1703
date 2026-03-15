"use client";

import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    name: "Workstations",
    description: "High-quality design, clear design language and technical innovation",
    image: "/images/products/deskpro-workstation-1.webp",
    href: "/products?category=workstations",
  },
  {
    name: "Office Chairs",
    description: "Ergonomic task & executive seating for every workspace",
    image: "/images/products/chair-mesh-office.webp",
    href: "/products?category=seating",
  },
  {
    name: "Soft Seating",
    description: "Lounge & collaborative seating for modern offices",
    image: "/images/products/softseating-solace-1.webp",
    href: "/products?category=seating",
  },
  {
    name: "Cafeteria",
    description: "Break room & dining furniture for every team",
    image: "/images/products/chair-cafeteria.webp",
    href: "/products?category=seating",
  },
  {
    name: "Meeting Tables",
    description: "Conference & collaboration tables for modern teams",
    image: "/images/products/meeting-table-8pax.webp",
    href: "/products?category=conference",
  },
  {
    name: "Storage",
    description: "Pedestals, cabinets & shelving — plenty of space",
    image: "/images/products/cabin drawer close up render.webp",
    href: "/products?category=storage",
  },
];

export function ProductCategories() {
  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section header — OandO style */}
        <div className="mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-neutral-400 mb-4">
            Our range
          </p>
          <h2 className="font-heading mb-0">
            Discover office furniture
          </h2>
        </div>

        {/* OandO-style grid: full-image cards with hover overlay text */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px bg-neutral-200">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group relative block aspect-[3/4] overflow-hidden bg-white"
            >
              {/* Full-bleed image */}
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Gradient overlay — always visible at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              {/* Text — bottom of card */}
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                <h3 className="text-white text-lg font-medium mb-1 not-italic">
                  {category.name}
                </h3>
                <p className="text-white/70 text-base leading-snug mb-0 max-h-0 overflow-hidden group-hover:max-h-20 transition-all duration-500">
                  {category.description}
                </p>
              </div>

              {/* Hover: red accent line at top */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Link>
          ))}
        </div>

        {/* Show all link */}
        <div className="mt-10 flex justify-start">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-base font-medium text-neutral-900 border border-neutral-300 px-7 py-3 rounded-none hover:border-primary hover:text-primary transition-colors"
          >
            Show all products
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
