import Image from "next/image";
import { HOMEPAGE_TRUST_CONTENT } from "@/data/site/homepage";

export function FooterLogoMarquee() {
  const trackLogos = [...HOMEPAGE_TRUST_CONTENT.logos, ...HOMEPAGE_TRUST_CONTENT.logos];

  return (
    <section className="footer-logo-marquee w-full border-y border-neutral-200 bg-neutral-50 py-6 md:py-8">
      <div className="relative overflow-hidden">
        <div
          className="footer-logo-marquee__track animate-marquee motion-reduce:animate-none"
          style={{ animationDuration: "48s" }}
        >
          {trackLogos.map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className="footer-logo-marquee__item flex h-12 w-36 shrink-0 items-center justify-center md:h-14 md:w-44"
            >
              <Image
                src={logo.src}
                alt={logo.name}
                width={160}
                height={52}
                className="h-8 w-auto object-contain opacity-55 grayscale md:h-10"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
