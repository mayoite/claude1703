import { Hero } from "@/components/home/Hero";
import { ContactTeaser } from "@/components/shared/ContactTeaser";
import { Newsletter } from "@/components/shared/Newsletter";
import Link from "next/link";
import { SUSTAINABILITY_PAGE_COPY } from "@/data/site/routeCopy";

export default function SustainabilityPage() {
  return (
    <section className="scheme-page flex min-h-screen flex-col items-center">
      <Hero
        variant="small"
        title={SUSTAINABILITY_PAGE_COPY.heroTitle}
        subtitle={SUSTAINABILITY_PAGE_COPY.heroSubtitle}
        showButton={false}
        backgroundImage="/images/products/imported/halo/image-1.webp"
      />

      <section className="container px-6 py-18 2xl:px-0 md:py-22">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <p className="typ-label scheme-text-body mb-4">{SUSTAINABILITY_PAGE_COPY.introKicker}</p>
            <h2 className="typ-section scheme-text-strong max-w-3xl">
              {SUSTAINABILITY_PAGE_COPY.introTitle}
            </h2>
            <p className="page-copy scheme-text-body mt-5 max-w-2xl">
              {SUSTAINABILITY_PAGE_COPY.introDescription}
            </p>
          </div>

          <div className="scheme-panel scheme-border rounded-[1.75rem] border p-6 md:p-8">
            <h3 className="typ-h3 scheme-text-strong">
              {SUSTAINABILITY_PAGE_COPY.introTitleLead}
              <span className="scheme-text-brand"> {SUSTAINABILITY_PAGE_COPY.introTitleEmphasis}</span>
            </h3>
            <ul className="mt-5 space-y-4">
              {SUSTAINABILITY_PAGE_COPY.introPoints.map((point) => (
                <li key={point} className="page-copy-sm scheme-text-body border-b border-(--border-soft) pb-4 last:border-b-0 last:pb-0">
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {SUSTAINABILITY_PAGE_COPY.pillars.map((pillar) => (
            <article key={pillar.title} className="scheme-panel scheme-border rounded-2xl border p-6">
              <h3 className="typ-h3 scheme-text-strong">{pillar.title}</h3>
              <p className="page-copy-sm scheme-text-body mt-3">{pillar.detail}</p>
            </article>
          ))}
        </div>

        <div className="mt-20 grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="typ-h2 scheme-text-heading mb-6">{SUSTAINABILITY_PAGE_COPY.ecoScoreTitle}</h2>
            <p className="page-copy scheme-text-body mb-6">
              {SUSTAINABILITY_PAGE_COPY.ecoScoreDescription}
            </p>
            <ul className="page-copy scheme-text-body space-y-4">
              {SUSTAINABILITY_PAGE_COPY.ecoScoreItems.map((item) => (
                <li key={item.index} className="flex gap-4">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-800">
                    {item.index}
                  </span>
                  <span>
                    <strong>{item.title}:</strong> {item.detail}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="scheme-panel-soft scheme-border space-y-8 rounded-2xl border p-10 md:p-12">
            {SUSTAINABILITY_PAGE_COPY.badges.map((badge, index) => (
              <div key={badge.title}>
                <h3 className="typ-h3 scheme-text-heading mb-2">{badge.title}</h3>
                <p className="page-copy-sm scheme-text-body">{badge.detail}</p>
                {index < SUSTAINABILITY_PAGE_COPY.badges.length - 1 ? (
                  <div className="scheme-border mt-8 h-px border-t" />
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <div className="mb-8 max-w-3xl">
            <p className="typ-label scheme-text-body mb-4">{SUSTAINABILITY_PAGE_COPY.commitmentsKicker}</p>
            <h2 className="typ-section scheme-text-strong">{SUSTAINABILITY_PAGE_COPY.commitmentsTitle}</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {SUSTAINABILITY_PAGE_COPY.commitments.map((commitment) => (
              <article
                key={commitment.title}
                className="scheme-panel-soft scheme-border rounded-2xl border p-6"
              >
                <h3 className="typ-h3 scheme-text-strong">{commitment.title}</h3>
                <p className="page-copy-sm scheme-text-body mt-3">{commitment.detail}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="scheme-panel-dark relative mt-20 overflow-hidden rounded-[2rem] p-12">
          <div className="absolute -mr-32 -mt-32 h-64 w-64 rounded-full bg-primary/10 blur-3xl right-0 top-0" />

          <div className="relative z-10 flex flex-col items-center justify-between gap-12 md:flex-row">
            <div className="max-w-xl">
              <h3 className="typ-h2 scheme-text-inverse mb-4">{SUSTAINABILITY_PAGE_COPY.verifiedTitle}</h3>
              <p className="page-copy scheme-text-inverse-muted">
                {SUSTAINABILITY_PAGE_COPY.verifiedDescription}
              </p>
            </div>
            <div className="flex items-center gap-8 rounded-2xl bg-white/5 p-8 backdrop-blur-sm">
              {SUSTAINABILITY_PAGE_COPY.verifiedLabels.map((label) => (
                <div
                  key={label}
                  className="scheme-text-inverse-body flex h-20 w-20 items-center justify-center rounded-full border border-white/20 text-center text-xs uppercase tracking-[0.12em]"
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="scheme-panel scheme-border mt-20 rounded-[2rem] border p-8 md:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-2xl">
              <h3 className="typ-section scheme-text-strong">
                {SUSTAINABILITY_PAGE_COPY.routeNoteTitle}
              </h3>
              <p className="page-copy scheme-text-body mt-4">
                {SUSTAINABILITY_PAGE_COPY.routeNoteDescription}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/downloads" className="btn-primary">
                {SUSTAINABILITY_PAGE_COPY.routeNotePrimaryCta}
              </Link>
              <Link href="/planning" className="btn-outline">
                {SUSTAINABILITY_PAGE_COPY.routeNoteSecondaryCta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Newsletter />
      <ContactTeaser />
    </section>
  );
}
