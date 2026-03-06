import { Hero } from "@/components/home/Hero";
import Link from "next/link";
import { ContactTeaser } from "@/components/shared/ContactTeaser";

const SERVICE_PILLARS = [
  {
    title: "Installation and commissioning",
    detail:
      "On-site assembly, placement, and functional checks coordinated with your facility and project teams.",
  },
  {
    title: "Warranty and issue management",
    detail:
      "Structured support for warranty claims, replacements, and corrective service actions with clear tracking.",
  },
  {
    title: "Preventive care",
    detail:
      "Periodic inspection and maintenance guidance to preserve ergonomics, finish quality, and long-term performance.",
  },
] as const;

const SERVICE_CHANNELS = [
  { label: "Phone support", value: "+91 90310 22875", href: "tel:+919031022875" },
  { label: "Email support", value: "sales@oando.co.in", href: "mailto:sales@oando.co.in" },
  {
    label: "WhatsApp support",
    value: "Start chat",
    href: "https://wa.me/919031022875?text=Hi,%20I%20need%20support%20for%20an%20installed%20workspace%20project.",
  },
] as const;

export default function ServicePage() {
  return (
    <section className="flex min-h-screen flex-col items-center bg-white">
      <Hero
        variant="small"
        title="Service & Support"
        subtitle="After-sales support designed for reliability, accountability, and long-term performance."
        showButton={false}
        backgroundImage="/hero/usha-hero.webp"
      />

      <section className="w-full bg-white py-18 md:py-22">
        <div className="container px-6 2xl:px-0">
          <div className="mb-12 max-w-3xl">
            <p className="typ-label mb-4 text-neutral-700">Support framework</p>
            <h2 className="typ-section text-neutral-950">
              One service partner from installation through after-sales support.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {SERVICE_PILLARS.map((item) => (
              <article key={item.title} className="rounded-xl border border-neutral-300 bg-neutral-50 p-6">
                <h3 className="text-2xl font-light tracking-tight text-neutral-950">{item.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-neutral-800">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full border-y border-neutral-200 bg-neutral-50 py-18 md:py-22">
        <div className="container px-6 2xl:px-0">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1fr]">
            <div>
              <p className="typ-label mb-4 text-neutral-700">Service channels</p>
              <h2 className="typ-section text-neutral-950">Reach our support team directly.</h2>
              <div className="mt-6 space-y-4">
                {SERVICE_CHANNELS.map((channel) => (
                  <a
                    key={channel.label}
                    href={channel.href}
                    target={channel.href.startsWith("http") ? "_blank" : undefined}
                    rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="block rounded-lg border border-neutral-300 bg-white px-5 py-4 transition-colors hover:border-primary/50"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-700">
                      {channel.label}
                    </p>
                    <p className="mt-1 text-lg text-neutral-900">{channel.value}</p>
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-neutral-300 bg-white p-6">
              <p className="typ-label mb-3 text-neutral-700">Need immediate support?</p>
              <p className="text-lg leading-relaxed text-neutral-800">
                Share your project or service reference number and issue summary. Our support team
                will route it to the right specialist and respond with next steps.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/contact" className="btn-primary">
                  Raise a support request
                </Link>
                <Link
                  href="/tracking"
                  className="inline-flex min-h-12 items-center justify-center rounded-md border border-neutral-400 bg-white px-6 py-3 text-sm font-semibold tracking-[0.08em] text-neutral-900 transition-colors hover:border-neutral-900 hover:bg-neutral-50"
                >
                  Track order
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactTeaser />
    </section>
  );
}

