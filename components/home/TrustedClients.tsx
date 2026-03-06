// Real client logos section — Titan, TVS, Usha, DMRC
// Add more logos here as SVG/image files become available

import Link from "next/link";

const CLIENTS = [
  { name: "Titan Company", abbr: "TITAN" },
  { name: "TVS Group", abbr: "TVS" },
  { name: "Usha International", abbr: "USHA" },
  { name: "DMRC", abbr: "DMRC" },
];

export function TrustedClients() {
  return (
    <section className="w-full bg-white border-t border-neutral-100 py-16 md:py-20">
      <div className="container px-6 2xl:px-0">
        <p className="text-xs tracking-[0.3em] uppercase text-neutral-400 mb-10 text-center">
          Trusted by India&apos;s leading corporations
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8">
          {CLIENTS.map((client) => (
            <div
              key={client.name}
              title={client.name}
              className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-200 hover:text-neutral-400 transition-colors duration-300 select-none"
            >
              {client.abbr}
            </div>
          ))}
        </div>

        {/* TODO: Replace text badges above with actual client logo SVG/PNG files
            when assets are provided. Suggested path: /images/clients/titan.svg etc. */}

        <div className="mt-12 text-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            View all projects
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
