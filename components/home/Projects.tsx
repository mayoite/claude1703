"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { HOMEPAGE_PROJECTS_CONTENT } from "@/data/site/homepage";

export function Projects() {
  const layouts = ["primary", "secondary", "tertiary", "quaternary"] as const;

  return (
    <section className="projects-section">
      <div className="projects-section__shell">
        <div className="projects-section__header">
          <div className="max-w-3xl">
            <h2 className="home-heading">
              {HOMEPAGE_PROJECTS_CONTENT.titleLead}{" "}
              <span className="home-heading__accent">
                {HOMEPAGE_PROJECTS_CONTENT.titleAccent}
              </span>
            </h2>
          </div>
          <Link
            href={HOMEPAGE_PROJECTS_CONTENT.cta.href}
            className="projects-section__cta group"
          >
            {HOMEPAGE_PROJECTS_CONTENT.cta.label}
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="projects-grid">
          {HOMEPAGE_PROJECTS_CONTENT.cards.map((project, index) => (
            <div
              key={project.companyName}
              className={`projects-card projects-card--${layouts[index] ?? "quaternary"} group`}
            >
              <div className="projects-card__media">
                <Image
                  src={project.image}
                  alt={project.companyName}
                  fill
                  className="projects-card__image"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="projects-card__body">
                <h3 className="projects-card__title">{project.companyName}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
