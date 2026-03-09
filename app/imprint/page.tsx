import { LEGAL_PAGE_COPY } from "@/data/site/routeCopy";

export default function ImprintPage() {
  return (
    <section className="flex min-h-screen flex-col items-center bg-white pt-24">
      <section className="container px-6 py-12 2xl:px-0">
        <h1 className="mb-12 font-slogan text-5xl text-neutral-900 md:text-6xl">
          {LEGAL_PAGE_COPY.imprint.title}
        </h1>
        <div className="space-y-6 font-light text-neutral-600">
          {LEGAL_PAGE_COPY.imprint.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="text-xl font-medium text-neutral-900">{section.heading}</h2>
              <p className="mt-2">
                {section.lines.map((line) => (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
