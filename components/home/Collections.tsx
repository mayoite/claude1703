"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";

const collections = [
  {
    name: "Seating",
    image: "/products/seating-myel-1.webp",
    href: "/products?category=seating",
  },
  {
    name: "Workstations",
    image: "/products/deskpro-workstation-1.webp",
    href: "/products?category=workstations",
  },
  {
    name: "Conference",
    image: "/products/meeting-table-10pax.webp",
    href: "/products?category=conference",
  },
  {
    name: "Storage",
    image: "/products/cabin electrical render .webp",
    href: "/products?category=storage",
  },
  {
    name: "Reception",
    image: "/products/softseating-solace-1.webp",
    href: "/products?category=reception-lounge",
  },
  {
    name: "Accessories",
    image: "/products/dauble paper tray.webp",
    href: "/products?category=accessories",
  },
];

export function Collections() {
  return (
    <section className="py-24 bg-white border-b border-neutral-100">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <h2 className="text-3xl md:text-4xl text-neutral-900">
            Our{" "}
            <span className="font-bold border-b-4 border-amber-600/20">
              Collections
            </span>
          </h2>

          <div className="flex gap-4">
            <button
              aria-label="Previous slide"
              className="swiper-button-prev-custom w-12 h-12 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-900 hover:text-white transition-all disabled:opacity-50"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              aria-label="Next slide"
              className="swiper-button-next-custom w-12 h-12 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-900 hover:text-white transition-all disabled:opacity-50"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation={{
            prevEl: ".swiper-button-prev-custom",
            nextEl: ".swiper-button-next-custom",
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className="pb-12"
        >
          {collections.map((item) => (
            <SwiperSlide key={item.name}>
              <Link
                href={item.href}
                className="group block relative aspect-[3/4] overflow-hidden rounded-2xl bg-neutral-100"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col items-center text-center">
                  <h3 className="text-2xl font-bold text-white mb-2 translate-y-4 group-hover:-translate-y-2 transition-transform duration-500">
                    {item.name}
                  </h3>
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-neutral-900 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
