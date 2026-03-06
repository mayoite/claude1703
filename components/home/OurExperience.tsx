import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/shared/Reveal";
import { formatKpiValuePlus } from "@/lib/kpiFormat";

const FEATURED_CLIENTS = ["DMRC", "Tata Steel", "HDFC", "IndianOil", "L&T", "NTPC"] as const;

const PROJECT_ITEMS = [
  {
    title: "DMRC",
    subtitle: "Delhi Metro Rail Corporation",
    image: "/projects/DMRC/IMG_20200612_123416.webp",
    link: "/gallery",
  },
  {
    title: "Titan",
    subtitle: "Titan Company Limited",
    image: "/projects/Titan/27-06-2025 Image 05_edited_edited.webp",
    link: "/gallery",
  },
];

interface OurExperienceProps {
  clientCount: number;
}

export function OurExperience({ clientCount }: OurExperienceProps) {
  return (
    <section className="w-full bg-neutral-50 py-20 md:py-28">
      <div className="container px-6 2xl:px-0">
        <Reveal>
          <div className="mb-12 md:mb-14">
            <p className="typ-label mb-4 text-neutral-700">Our experience</p>
            <h2 className="typ-section max-w-2xl text-neutral-900">Execution strength at scale.</h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-800 md:text-lg">
              Trusted by {formatKpiValuePlus(clientCount)} organizations across public, private,
              and institutional projects.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-7 xl:grid-cols-[0.95fr_1.05fr]">
          <Reveal>
            <div className="rounded-2xl border border-neutral-300 bg-white p-6 md:p-8">
              <p className="typ-label mb-6 text-neutral-700">Trusted by</p>
              <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {FEATURED_CLIENTS.map((name) => (
                  <p
                    key={name}
                    className="rounded-md border border-neutral-300 bg-neutral-50 px-3 py-2 text-sm font-medium text-neutral-800"
                  >
                    {name}
                  </p>
                ))}
              </div>
              <Link
                href="/trusted-by"
                className="link-arrow"
              >
                View all clients
              </Link>
            </div>
          </Reveal>

          <div>
            <p className="typ-label mb-4 text-neutral-700">Recent deliveries</p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {PROJECT_ITEMS.map((item) => (
                <Reveal key={item.title} y={20}>
                  <Link
                    href={item.link}
                    className="group relative block aspect-[4/3] overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100"
                  >
                    <Image
                      src={item.image}
                      alt={item.subtitle}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 30vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 p-5">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/75">
                        Project
                      </p>
                      <p className="text-2xl font-light tracking-tight text-white">{item.title}</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
            <Link
              href="/portfolio"
              className="link-arrow mt-6"
            >
              View portfolio
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
