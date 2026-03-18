import { HOMEPAGE_TESTIMONIALS_CONTENT } from "@/data/site/homepage";

export function TestimonialsStrip() {
  return (
    <section className="home-section home-section--sand py-10 md:py-14">
      <div className="home-shell">
        <div className="home-frame home-frame--standard">
          <div className="mb-8 md:mb-10">
            <h2 className="home-heading">
              {HOMEPAGE_TESTIMONIALS_CONTENT.titleLead}{" "}
              <span className="home-heading__accent">
                {HOMEPAGE_TESTIMONIALS_CONTENT.titleAccent}
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {HOMEPAGE_TESTIMONIALS_CONTENT.items.map((item) => (
              <blockquote
                key={item.org}
                className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-6"
              >
                <p className="text-base leading-relaxed text-neutral-700">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <footer className="mt-auto">
                  <p className="text-sm font-medium text-neutral-950">
                    {item.author}
                  </p>
                  <p className="text-xs text-neutral-500">{item.org}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
