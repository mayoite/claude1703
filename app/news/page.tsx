import { Hero } from "@/components/home/Hero";
import Link from "next/link";
import { ContactTeaser } from "@/components/shared/ContactTeaser";

const NEWS_ITEMS = [
  {
    category: "Project update",
    title: "Expanded enterprise delivery capacity across North and East India",
    summary:
      "Operational capacity and partner network upgrades to support larger phased workspace rollouts.",
    date: "March 2026",
  },
  {
    category: "Product focus",
    title: "Ergonomic seating line updated with broader workstation compatibility",
    summary:
      "New configuration sets improve support for collaborative, executive, and task-based environments.",
    date: "February 2026",
  },
  {
    category: "Service update",
    title: "After-sales support workflow standardized for faster issue closure",
    summary:
      "Response routing and warranty handling updates now provide clearer communication timelines.",
    date: "January 2026",
  },
] as const;

export default function NewsPage() {
  return (
    <section className="flex min-h-screen flex-col items-center bg-white">
      <Hero
        variant="small"
        title="News & Updates"
        subtitle="Recent project, product, and service updates from One and Only Furniture."
        showButton={false}
        backgroundImage="/hero/dmrc-hero.webp"
      />

      <section className="w-full bg-white py-18 md:py-22">
        <div className="container px-6 2xl:px-0">
          <div className="mb-10">
            <p className="typ-label mb-4 text-neutral-700">Latest coverage</p>
            <h2 className="typ-section max-w-3xl text-neutral-950">
              Updates that matter to workspace decision-makers.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {NEWS_ITEMS.map((item) => (
              <article key={item.title} className="rounded-xl border border-neutral-300 bg-neutral-50 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
                  {item.category}
                </p>
                <h3 className="mt-3 text-2xl font-light leading-tight tracking-tight text-neutral-950">
                  {item.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-neutral-800">{item.summary}</p>
                <p className="mt-5 text-sm font-medium text-neutral-700">{item.date}</p>
              </article>
            ))}
          </div>

          <div className="mt-8">
            <Link href="/social" className="link-arrow">
              Follow on social channels
            </Link>
          </div>
        </div>
      </section>

      <ContactTeaser />
    </section>
  );
}

