import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HOMEPAGE_PARTNERSHIP_CONTENT } from "@/data/site/homepage";

export function PartnershipBanner() {
  return (
    <section className="home-section home-section--soft py-10 md:py-12">
      <div className="home-shell">
        <div className="home-frame home-frame--roomy flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="shrink-0 md:pl-2">
            <Image
              src={HOMEPAGE_PARTNERSHIP_CONTENT.image.src}
              alt={HOMEPAGE_PARTNERSHIP_CONTENT.image.alt}
              width={224}
              height={153}
              sizes="(max-width: 768px) 154px, 224px"
              quality={100}
              className="h-auto w-[154px] md:w-[224px]"
            />
          </div>

          <div className="max-w-2xl">
            <h2 className="home-heading scheme-text-strong mb-4">
              {HOMEPAGE_PARTNERSHIP_CONTENT.title[0]}{" "}
              <span className="home-heading__accent">
                {HOMEPAGE_PARTNERSHIP_CONTENT.title[1]}
              </span>
            </h2>
            <p className="scheme-text-body mb-6 max-w-lg text-base">
              {HOMEPAGE_PARTNERSHIP_CONTENT.description}
            </p>
            <Link href={HOMEPAGE_PARTNERSHIP_CONTENT.cta.href} className="link-arrow typ-label">
              {HOMEPAGE_PARTNERSHIP_CONTENT.cta.label} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
