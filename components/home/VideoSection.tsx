"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { Play } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

interface VideoSectionProps {
  videoSrc?: string;
  posterSrc?: string;
  title: ReactNode;
  description: string;
  lightMode?: boolean; // If true, use dark text on light background, else white text on dark/video
  buttonText?: string;
  buttonLink?: string;
}

export function VideoSection({
  videoSrc,
  posterSrc,
  title,
  description,
  lightMode = false,
  buttonText = "Discover More",
  buttonLink = "/products",
}: VideoSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      Fancybox.bind(container, "[data-fancybox]", {});
    }

    return () => {
      if (container) {
        Fancybox.unbind(container);
        Fancybox.close();
      }
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className={`relative w-full py-16 md:py-20 overflow-hidden ${lightMode ? "bg-neutral-100" : "bg-neutral-900"}`}
    >
      {/* Background Video or Image */}
      <div className="absolute inset-0 z-0">
        {videoSrc ? (
          <>
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-60 pointer-events-none"
              poster={posterSrc}
            >
              <source src={videoSrc} type="video/mp4" />
            </video>

            {/* Lightbox Trigger Overlay */}
            <a
              href={videoSrc}
              data-fancybox
              className="absolute inset-0 z-20 flex items-center justify-center group cursor-pointer"
              aria-label="Play Video"
            >
              <div
                className={`w-20 h-20 flex items-center justify-center rounded-full border-2 transition-all duration-300 transform group-hover:scale-110 ${lightMode ? "border-neutral-900 bg-white/20 hover:bg-neutral-900 text-neutral-900 hover:text-white" : "border-white bg-white/20 hover:bg-white text-white hover:text-neutral-900"}`}
              >
                <Play className="w-8 h-8 fill-current" />
              </div>
            </a>
          </>
        ) : posterSrc ? (
          <Image
            src={posterSrc}
            alt="Workspace collaboration"
            fill
            priority={false}
            sizes="100vw"
            className="w-full h-full object-cover"
          />
        ) : (
          /* Fallback generic background if no video is provided yet */
          <div
            className={`w-full h-full ${lightMode ? "bg-neutral-200" : "bg-neutral-800"} animate-pulse`}
          />
        )}
        {/* Overlay Gradient */}
        <div
          className={`absolute inset-0 ${lightMode ? "bg-white/45" : "bg-black/40"}`}
        />
      </div>

      <div className="container relative z-10 px-6 2xl:px-0 h-full flex flex-col justify-center pt-10 md:pt-6 pointer-events-none">
        <div className="max-w-4xl space-y-6 pointer-events-auto">
          <h2
            className={`text-ui-36 md:text-ui-48 lg:text-ui-58 font-light leading-ui-108 tracking-tight text-balance ${lightMode ? "text-neutral-900" : "text-white"}`}
          >
            {title}
          </h2>
          <p
            className={`text-ui-18 font-light leading-relaxed max-w-2xl ${lightMode ? "text-neutral-700" : "text-neutral-200"}`}
          >
            {description}
          </p>

          <div className="pt-8">
            <Link
              href={buttonLink}
              className={`group inline-flex items-center gap-4 pb-2 border-b transition-colors ${lightMode
                  ? "text-neutral-900 border-neutral-900 hover:text-primary hover:border-primary-hover"
                  : "text-white border-white hover:text-primary hover:border-primary-hover"
                }`}
            >
              <span className="text-ui-13 font-semibold uppercase tracking-ui-020">
                {buttonText}
              </span>
              <span className="text-lg transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
