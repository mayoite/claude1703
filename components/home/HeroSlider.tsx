"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

const slides = [
  {
    id: 1,
    label: "Workstations",
    heading: "An office becomes\nmy office.",
    subheading: "Premium modular workstations — designed for India's modern workspace.",
    cta: { text: "Discover workstations", href: "/products?category=workstations" },
    image: "/images/products/DESKPRO 120D RENDER 4.webp",
  },
  {
    id: 2,
    label: "Seating",
    heading: "Better. Single.\nMore attractive.",
    subheading: "Ergonomic seating that adapts to every body and every workspace.",
    cta: { text: "Explore seating", href: "/products?category=seating" },
    image: "/images/products/chair-mesh-office.webp",
  },
  {
    id: 3,
    label: "Meeting Spaces",
    heading: "Space for\ncollaboration!",
    subheading: "Versatile conference and meeting furniture for modern teams.",
    cta: { text: "View meeting tables", href: "/products?category=conference" },
    image: "/images/products/meeting-table-8pax.webp",
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = (index: number) => {
    if (isTransitioning || index === current) return;
    if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    setIsTransitioning(true);
    transitionTimeoutRef.current = setTimeout(() => {
      setCurrent(index);
      setIsTransitioning(false);
    }, 400);
  };

  const next = () => goTo((current + 1) % slides.length);

  useEffect(() => {
    intervalRef.current = setInterval(next, 6000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const slide = slides[current];

  return (
    <section className="relative h-screen min-h-[600px] bg-neutral-900 overflow-hidden">
      {/* Background images — using Next.js Image for proper loading */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <Image
            src={s.image}
            alt={s.label}
            fill
            priority={i === 0}
            className="object-cover"
            sizes="100vw"
          />
        </div>
      ))}

      {/* Dark gradient overlay — stronger at bottom like OandO */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />

      {/* Content — bottom-left aligned like oando.co.in */}
      <div
        className="relative z-10 h-full flex flex-col justify-end"
        style={{ opacity: isTransitioning ? 0 : 1, transition: "opacity 0.4s ease" }}
      >
        <div className="container mx-auto px-6 lg:px-12 pb-20 md:pb-28">
          {/* Slide label */}
          <p className="text-sm tracking-[0.3em] uppercase text-white/60 mb-4">
            {slide.label}
          </p>

          {/* Main heading — Crimson Pro italic, large, white */}
          <h1
            className="font-slogan text-5xl md:text-6xl lg:text-7xl text-white mb-6 max-w-3xl"
            style={{ whiteSpace: "pre-line" }}
          >
            {slide.heading}
          </h1>

          {/* Subheading */}
          <p className="text-white/70 text-lg max-w-lg mb-8 leading-relaxed">
            {slide.subheading}
          </p>

          {/* CTA button — OandO style: outlined, sharp corners */}
          <Link
            href={slide.cta.href}
            className="inline-flex items-center gap-2 text-white text-base font-medium border border-white/60 px-8 py-3.5 rounded-none hover:bg-white hover:text-neutral-900 transition-all duration-300"
          >
            {slide.cta.text}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Slide indicators — bottom right */}
      <div className="absolute bottom-8 right-8 z-10 flex items-center gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          >
            <span
              className={`block rounded-none transition-all duration-300 ${i === current
                ? "w-8 h-1.5 bg-white"
                : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                }`}
            />
          </button>
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/50">
        <div className="w-5 h-8 border border-white/30 rounded-none flex items-start justify-center pt-1.5">
          <div className="w-0.5 h-2 bg-white/50 rounded-none animate-bounce" />
        </div>
      </div>
    </section>
  );
}
