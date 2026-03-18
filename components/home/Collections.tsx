"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { HOMEPAGE_COLLECTIONS_CONTENT } from "@/data/site/homepage";

import "swiper/css";
import "swiper/css/navigation";

export function Collections() {
  return (
    <section className="bg-white py-10 md:py-12">
      <div className="home-shell">
        <div className="home-frame home-frame--standard">
          <div className="mb-12 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <h2 className="home-heading">
                {HOMEPAGE_COLLECTIONS_CONTENT.titleLead}{" "}
                <span className="home-heading__accent">
                  {HOMEPAGE_COLLECTIONS_CONTENT.titleAccent}
                </span>
              </h2>
            </div>

            <div className="flex gap-4">
              <button
                aria-label="Previous slide"
                className="swiper-button-prev-custom inline-flex h-12 w-12 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition-all hover:border-neutral-900 hover:bg-neutral-900 hover:text-white disabled:opacity-50"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                aria-label="Next slide"
                className="swiper-button-next-custom inline-flex h-12 w-12 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition-all hover:border-neutral-900 hover:bg-neutral-900 hover:text-white disabled:opacity-50"
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
            className="pb-4"
          >
            {HOMEPAGE_COLLECTIONS_CONTENT.items.map((item) => (
              <SwiperSlide key={item.name}>
                <Link
                  href={item.href}
                  className="group block relative aspect-[3/4] overflow-hidden rounded-[1.75rem] border border-neutral-200 bg-neutral-100"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/18 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-82" />

                  <div className="absolute inset-x-0 bottom-0 flex flex-col items-center p-8 text-center">
                    <h3 className="mb-2 translate-y-3 text-2xl font-light text-white transition-transform duration-500 group-hover:-translate-y-1">
                      {item.name}
                    </h3>
                    <div aria-hidden="true" className="flex h-12 w-12 translate-y-10 items-center justify-center rounded-full border border-white/20 bg-white/92 text-neutral-900 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
