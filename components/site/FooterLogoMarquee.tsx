import Image from "next/image";
import { HOMEPAGE_TRUST_CONTENT } from "@/data/site/homepage";

export function FooterLogoMarquee() {
  const trackLogos = [...HOMEPAGE_TRUST_CONTENT.logos, ...HOMEPAGE_TRUST_CONTENT.logos];

  return (
    <section className="footer-logo-marquee group w-full border-y border-neutral-200 bg-neutral-50 py-6 md:py-8">
      <div className="relative overflow-hidden">
        <div
          className="footer-logo-marquee__track animate-marquee motion-reduce:animate-none"
          style={{ animationDuration: "70s" }}
        >
          {trackLogos.map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className="footer-logo-marquee__item flex h-16 w-40 shrink-0 items-center justify-center md:h-20 md:w-52"
            >
              <Image
                src={logo.src}
                alt={logo.name}
                width={208}
                height={72}
                className="h-12 w-auto object-contain opacity-55 grayscale transition-all duration-500 hover:scale-[1.5] hover:opacity-100 hover:grayscale-0 md:h-[3.75rem]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
