import { Hero } from "@/components/home/Hero";
import { LEGAL_PAGE_COPY } from "@/data/site/routeCopy";

export const metadata = {
  title: `${LEGAL_PAGE_COPY.refund.metadataTitle} | One and Only Furniture`,
  description: LEGAL_PAGE_COPY.refund.metadataDescription,
};

export default function RefundAndReturnPolicyPage() {
  return (
    <section className="flex min-h-screen flex-col items-center bg-white">
      <Hero
        variant="small"
        title={LEGAL_PAGE_COPY.refund.heroTitle}
        subtitle={LEGAL_PAGE_COPY.refund.heroSubtitle}
        showButton={false}
        backgroundImage="/images/hero/hero-3.webp"
      />

      <section className="container px-6 py-16 2xl:px-0">
        <div className="mx-auto max-w-5xl space-y-10">
          {LEGAL_PAGE_COPY.refund.sections.map((section) => (
            <article
              key={section.title}
              className={`rounded-2xl border border-neutral-200 p-8 md:p-10 ${
                section.tone === "soft" ? "bg-neutral-50" : "bg-white"
              }`}
            >
              <h2 className="typ-h3 text-neutral-900">{section.title}</h2>
              {section.items.length > 0 ? (
                <ul className="mt-4 list-disc space-y-3 pl-5 text-base leading-relaxed text-neutral-700">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
              {"contactLines" in section && section.contactLines ? (
                <div className="mt-4 space-y-2 text-base text-neutral-800">
                  {section.contactLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
