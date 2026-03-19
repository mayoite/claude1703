import Image from "next/image";
import { HOMEPAGE_TRUST_CONTENT } from "@/data/site/homepage";

export function FooterLogoMarquee() {
  const trackLogos = [...HOMEPAGE_TRUST_CONTENT.logos, ...HOMEPAGE_TRUST_CONTENT.logos];

  return (
    <section aria-hidden="true" className="footer-logo-marquee w-full border-y border-neutral-200 bg-neutral-50 py-4 md:py-5">
      <div className="relative overflow-hidden">
        <div
          className="footer-logo-marquee__track animate-marquee motion-reduce:animate-none"
          style={{ animationDuration: "110s" }}
        >
          {trackLogos.map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className="footer-logo-marquee__item flex h-12 w-34 shrink-0 items-center justify-center md:h-16 md:w-44"
            >
              <Image
                src={logo.src}
                alt={logo.name}
                width={208}
                height={72}
                className="h-10 w-auto object-contain opacity-38 grayscale transition-opacity duration-500 hover:opacity-56 md:h-12"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
