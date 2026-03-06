"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/shared/Reveal";

type ProjectItem = {
  title: string;
  images: string[];
  link: string;
  offset?: number;
};

const PROJECT_ITEMS: ProjectItem[] = [
  {
    title: "DMRC",
    images: [
      "/projects/DMRC/IMG_20200612_123416.webp",
      "/projects/DMRC/IMG_20200612_140613.webp",
      "/projects/DMRC/IMG_20200612_175502.webp",
      "/projects/DMRC/IMG_20200612_185405.webp",
    ],
    link: "/gallery",
    offset: 0,
  },
  {
    title: "TVS",
    images: [
      "/projects/TVS/27-06-2025 Image 01.webp",
      "/projects/TVS/27-06-2025 Image 02.webp",
      "/projects/TVS/27-06-2025 Image 03.webp",
      "/projects/TVS/27-06-2025 Image 04.webp",
    ],
    link: "/gallery",
    offset: 1,
  },
  {
    title: "Titan",
    images: [
      "/projects/Titan/27-06-2025 Image 05_edited_edited.webp",
      "/projects/Titan/snapedit_1688104539759_edited.webp",
      "/projects/Titan/snapedit_1688105524557 (1).webp",
    ],
    link: "/gallery",
    offset: 2,
  },
  {
    title: "Usha",
    images: [
      "/projects/Usha/DSCN0741.webp",
      "/projects/Usha/DSC_0077_edited.webp",
      "/projects/Usha/DSC_0080.webp",
      "/projects/Usha/DSC_0111.webp",
    ],
    link: "/gallery",
    offset: 3,
  },
];

export function ServiceSection() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTick((t) => t + 1);
    }, 5000);
    return () => clearInterval(id);
  }, []);
  return (
    <section className="w-full border-y border-neutral-200/50 bg-neutral-50/70 py-14 md:py-20">
      <div className="container px-6 2xl:px-0">
        <div className="mb-16 flex min-h-[72px] items-center text-left">
          <Reveal>
            <h2 className="typ-h1 text-neutral-900">
              Recent project deliveries
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PROJECT_ITEMS.map((item, index) => {
            const images = item.images.length > 0 ? item.images : [""];
            const currentImage =
              images[(tick + (item.offset ?? 0)) % images.length];

            return (
              <Reveal
                key={index}
                delay={index * 0.1}
                width="100%"
              >
                <Link
                  href={item.link}
                  className="group relative block w-full aspect-[16/10] overflow-hidden rounded-sm"
                >
                  {/* Image */}
                  <Image
                    src={currentImage}
                    alt={item.title}
                    fill
                    sizes="100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-neutral-900/10 group-hover:bg-neutral-900/20 transition-colors duration-500" />

                  {/* Pill Button */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-neutral-900 text-sm font-medium tracking-wide shadow-lg transition-transform duration-300 group-hover:scale-105">
                      {item.title}
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
