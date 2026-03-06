"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const projects = [
  {
    client: "Titan",
    location: "Patna, Bihar",
    category: "Corporate Office",
    image: "/photos/Titan/hero.webp",
    slug: "titan-patna",
  },
  {
    client: "DMRC",
    location: "New Delhi",
    category: "Government Infrastructure",
    image: "/photos/DMRC/hero.webp",
    slug: "dmrc-delhi",
  },
  {
    client: "Usha International",
    location: "New Delhi",
    category: "Corporate Headquarters",
    image: "/photos/Usha/hero.webp",
    slug: "usha-delhi",
  },
];

export function Projects() {
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600 mb-6 block">
              Featured Work
            </span>
            <h2 className="text-5xl md:text-6xl font-medium tracking-tighter leading-[1.05] text-neutral-900">
              Spaces Designed For <br className="hidden md:block" />
              <span className="text-neutral-400 italic font-light">
                Excellence.
              </span>
            </h2>
          </div>
          <Link
            href="/gallery"
            className="group flex items-center gap-4 text-sm font-semibold uppercase tracking-widest text-neutral-900 hover:text-amber-600 transition-colors pb-2 border-b border-neutral-900 hover:border-amber-600"
          >
            View Complete Portfolio
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16 md:gap-x-8 lg:gap-x-12">
          {projects.map((project, idx) => (
            <div
              key={idx}
              className={`group flex flex-col ${idx === 0
                  ? "md:col-span-12 lg:col-span-8"
                  : idx === 1
                    ? "md:col-span-6 lg:col-span-4 lg:mt-32"
                    : "md:col-span-6 lg:col-span-6 lg:mt-[-100px]"
                }`}
            >
              <div className="relative aspect-4/3 w-full overflow-hidden bg-neutral-100 mb-6">
                <Image
                  src={project.image}
                  alt={`${project.client} - ${project.category}`}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                    {project.category}
                  </span>
                  <div className="h-px flex-1 bg-neutral-200"></div>
                </div>
                <h3 className="text-2xl font-medium text-neutral-900 mb-1">
                  {project.client}
                </h3>
                <p className="text-[15px] text-neutral-500 font-light">
                  {project.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
