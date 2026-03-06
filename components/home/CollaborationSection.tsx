import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CollaborationSection() {
  return (
    <section className="w-full py-0">
      {/* Full-bleed editorial layout: Image left, text right */}
      <div className="flex flex-col lg:flex-row min-h-[520px]">

        {/* Image panel — full-bleed, no container padding */}
        <div className="relative w-full lg:w-[55%] aspect-[16/10] lg:aspect-auto overflow-hidden bg-neutral-200">
          <Image
            src="/images/hero/tvs-patna-hq.webp"
            alt="Collaborative office workspace designed by One and Only Furniture"
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover"
          />
        </div>

        {/* Text panel */}
        <div className="w-full lg:w-[45%] bg-[#040C18] flex flex-col justify-center px-8 md:px-16 py-16 lg:py-20">
          <p className="typ-label mb-6 text-cyan-300/60">Workspace Solutions</p>
          <h2 className="typ-section text-white mb-6 leading-tight">
            Space for{" "}
            <em className="italic text-cyan-200/80">collaboration.</em>
          </h2>
          <p className="text-base leading-relaxed text-white/60 font-light max-w-sm mb-10">
            Plan breakout, meeting and lounge zones that help teams connect,
            discuss and decide faster — without leaving the building.
          </p>
          <Link
            href="/solutions"
            className="typ-label inline-flex items-center gap-3 text-white border-b border-white/20 pb-2 hover:border-white/60 transition-colors w-fit"
          >
            Explore workspace solutions <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
