import { ClientBadge } from "@/components/ClientBadge";
import { Hero } from "@/components/home/Hero";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { ContactTeaser } from "@/components/shared/ContactTeaser";
import { TRUSTED_BY_CLIENTS, TRUSTED_BY_STATS } from "@/data/site/proof";
import { TRUSTED_BY_PAGE_COPY } from "@/data/site/routeCopy";

export default function TrustedByPage() {
  const sectors = Array.from(new Set(TRUSTED_BY_CLIENTS.map((client) => client.sector)));

  return (
    <section className="scheme-page flex min-h-screen flex-col items-center">
      <Hero
        variant="small"
        title={TRUSTED_BY_PAGE_COPY.heroTitle}
        subtitle={TRUSTED_BY_PAGE_COPY.heroSubtitle}
        showButton={false}
        backgroundImage="/hero/franklin-hero.webp"
      />

      <section className="container px-6 py-18 2xl:px-0 md:py-22">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="typ-label scheme-text-body mb-4">{TRUSTED_BY_PAGE_COPY.overviewKicker}</p>
            <h2 className="typ-section scheme-text-strong max-w-3xl">
              {TRUSTED_BY_PAGE_COPY.overviewTitle}
            </h2>
            <p className="page-copy scheme-text-body mt-5 max-w-2xl">
              {TRUSTED_BY_PAGE_COPY.overviewDescription}
            </p>
          </div>

          <div className="scheme-panel scheme-border rounded-[1.75rem] border p-6 md:p-8">
            <p className="typ-label scheme-text-body mb-4">{TRUSTED_BY_PAGE_COPY.statsKicker}</p>
            <div className="grid grid-cols-2 gap-4">
              {TRUSTED_BY_STATS.map((item) => (
                <div
                  key={item.label}
                  className="scheme-panel-soft scheme-border rounded-2xl border p-5"
                >
                  <p className="typ-stat text-primary">{item.value}</p>
                  <p className="stats-block__label mt-2">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-6">
        <div className="container px-6 2xl:px-0">
          <div className="scheme-panel-dark relative overflow-hidden rounded-[2rem] p-8 md:p-10">
            <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(13,45,180,0.24),transparent_58%)]" />
            <div className="relative z-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="typ-label scheme-text-inverse-muted">{TRUSTED_BY_PAGE_COPY.sectorsKicker}</p>
                <h2 className="typ-section mt-4 text-white">{TRUSTED_BY_PAGE_COPY.sectorsTitle}</h2>
                <p className="page-copy scheme-text-inverse-body mt-4 max-w-xl">
                  {TRUSTED_BY_PAGE_COPY.sectorsDescription}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 self-start lg:justify-end">
                {sectors.map((sector) => (
                  <span
                    key={sector}
                    className="inline-flex min-h-11 items-center rounded-full border border-white/15 bg-white/7 px-5 text-sm font-medium tracking-[0.06em] text-white/88 backdrop-blur-sm"
                  >
                    {sector}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <WhyChooseUs />

      <section className="container px-6 py-18 2xl:px-0 md:py-22">
        <div className="mb-8 max-w-3xl">
          <p className="typ-label scheme-text-body mb-4">{TRUSTED_BY_PAGE_COPY.rosterKicker}</p>
          <h2 className="typ-section scheme-text-strong">{TRUSTED_BY_PAGE_COPY.rosterTitle}</h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TRUSTED_BY_CLIENTS.map((client) => (
            <ClientBadge key={client.name} {...client} />
          ))}
        </div>
      </section>

      <ContactTeaser />
    </section>
  );
}
