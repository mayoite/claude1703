import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HOMEPAGE_PROJECTS_CONTENT } from "@/data/site/homepage";

export function PreviewProjects() {
  const [featured, leftSupport, rightSupport] = HOMEPAGE_PROJECTS_CONTENT.cards;
  const featuredOutcome =
    typeof (featured as { outcome?: unknown }).outcome === "string"
      ? (featured as { outcome?: string }).outcome
      : "";

  return (
    <section className="preview-projects">
      <div className="preview-shell">
        <div className="preview-section-heading">
          <div>
            <p className="preview-section-heading__eyebrow">Project proof</p>
            <h2 className="preview-section-heading__title">
              {HOMEPAGE_PROJECTS_CONTENT.titleLead}{" "}
              <span>{HOMEPAGE_PROJECTS_CONTENT.titleAccent}</span>
            </h2>
          </div>
          <p className="preview-section-heading__copy">
            More editorial, less catalog. The sample uses fewer cards, stronger crops, and
            harder contrast so delivery work carries real weight.
          </p>
        </div>

        <div className="preview-projects__grid">
          <Link href="/projects" className="preview-project-card preview-project-card--feature">
            <div className="preview-project-card__media">
              <Image
                src={featured.image}
                alt={featured.companyName}
                fill
                sizes="(max-width: 1024px) 100vw, 62vw"
                className="preview-project-card__image"
              />
              <div className="preview-project-card__overlay preview-project-card__overlay--feature" />
            </div>
            <div className="preview-project-card__body preview-project-card__body--feature">
              <p className="preview-project-card__meta">{featured.sector}</p>
              <h3 className="preview-project-card__title preview-project-card__title--feature">
                {featured.companyName}
              </h3>
              {featuredOutcome ? (
                <p className="preview-project-card__copy preview-project-card__copy--inverse">
                  {featuredOutcome}
                </p>
              ) : null}
              <span className="preview-inline-link preview-inline-link--inverse">
                Review project delivery
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>

          <div className="preview-projects__support">
            {[leftSupport, rightSupport].map((project) => (
              (() => {
                const projectOutcome =
                  typeof (project as { outcome?: unknown }).outcome === "string"
                    ? (project as { outcome?: string }).outcome
                    : "";

                return (
              <Link key={project.companyName} href="/projects" className="preview-project-card">
                <div className="preview-project-card__media preview-project-card__media--support">
                  <Image
                    src={project.image}
                    alt={project.companyName}
                    fill
                    sizes="(max-width: 1024px) 100vw, 28vw"
                    className="preview-project-card__image"
                  />
                  <div className="preview-project-card__overlay" />
                </div>
                <div className="preview-project-card__body">
                  <p className="preview-project-card__meta preview-project-card__meta--warm">
                    {project.sector}
                  </p>
                  <h3 className="preview-project-card__title">{project.companyName}</h3>
                  {projectOutcome ? (
                    <p className="preview-project-card__copy">{projectOutcome}</p>
                  ) : null}
                  <span className="preview-inline-link">
                    Open project story
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
                );
              })()
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
