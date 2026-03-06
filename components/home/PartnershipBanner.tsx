import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function PartnershipBanner() {
  return (
    <section className="border-y border-neutral-200 bg-white py-12 md:py-14">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* AFC Logo */}
          <div className="shrink-0">
            <Image
              src="/catalog-logo-sharp.webp"
              alt="AFC – Authorized Franchise Partner"
              width={224}
              height={153}
              sizes="(max-width: 768px) 154px, 224px"
              quality={100}
              className="h-auto w-[154px] md:w-[224px]"
            />
          </div>

          {/* Text Side */}
          <div className="max-w-2xl text-center md:text-right">
            <span className="typ-label mb-4 block text-neutral-700">
              Official Strategic Partnership
            </span>
            <h2 className="typ-section mb-6 text-neutral-950">
              Authorized Franchise <br className="hidden md:block" /> Partner
            </h2>
            <p className="mb-8 max-w-lg text-base text-neutral-800 md:ml-auto">
              Bringing world-class manufacturing excellence and sustainable
              furniture solutions to your workspace.
            </p>
            <Link
              href="/about"
              className="link-arrow typ-label"
            >
              Partner Profile <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
