import Image from "next/image";
import { HOMEPAGE_TRUST_CONTENT } from "@/data/site/homepage";

export function FooterLogoMarquee() {
  const trackLogos = [...HOMEPAGE_TRUST_CONTENT.logos, ...HOMEPAGE_TRUST_CONTENT.logos];

  return (
    <section
      aria-hidden="true"
      className="footer-logo-marquee w-full border-y border-soft bg-panel py-4 md:py-5"
      style={{ ["--marquee-duration" as string]: "110s" }}
    >
      <div className="relative overflow-hidden">
        <div className="footer-logo-marquee__track">
          {trackLogos.map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className="footer-logo-marquee__item group h-12 w-34 shrink-0 md:h-16 md:w-44"
            >
              <Image
                src={logo.src}
                alt={logo.name}
                width={208}
                height={72}
                className="h-10 w-auto object-contain grayscale opacity-70 saturate-0 transition-[filter,opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.7] group-hover:grayscale-0 group-hover:opacity-100 group-hover:saturate-100 motion-reduce:transition-none motion-reduce:group-hover:scale-100 md:h-12"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
