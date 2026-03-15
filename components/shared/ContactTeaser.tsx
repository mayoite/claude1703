"use client";

import { ArrowUpRight, MessageSquareText, Phone } from "lucide-react";
import { buildWhatsAppHref, SITE_CONTACT, toTelHref } from "@/data/site/contact";
import { HOMEPAGE_CONTACT_CONTENT } from "@/data/site/homepage";

export function ContactTeaser() {
  const directActions = HOMEPAGE_CONTACT_CONTENT.directActions.map((action) => ({
    ...action,
    href:
      action.type === "whatsapp"
        ? buildWhatsAppHref("Need a direct workspace response for my project brief.")
        : toTelHref(SITE_CONTACT.supportPhone),
    icon: Phone,
    external: action.type === "whatsapp",
  }));

  function openGuidedPlanner() {
    window.dispatchEvent(new CustomEvent("oando-assistant:open"));
  }

  return (
    <section className="home-section home-section--soft scheme-border border-t py-16 md:py-22">
      <div className="home-shell">
        <div className="contact-teaser home-frame home-frame--standard">
          <div className="contact-teaser__layout grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="contact-teaser__primary">
              <p className="typ-label scheme-text-body mb-4">
                {HOMEPAGE_CONTACT_CONTENT.eyebrow}
              </p>
              <h2 className="typ-section scheme-text-strong mb-4 max-w-xl">
                {HOMEPAGE_CONTACT_CONTENT.titleLead}{" "}
                <span className="home-heading__accent">{HOMEPAGE_CONTACT_CONTENT.titleAccent}</span>
              </h2>
              <p className="page-copy scheme-text-body max-w-xl">
                {HOMEPAGE_CONTACT_CONTENT.description}
              </p>

              <div className="contact-teaser__brief-points mt-6 flex flex-wrap gap-2.5">
                {HOMEPAGE_CONTACT_CONTENT.plannerPoints.map((item) => (
                  <span key={item} className="contact-teaser__brief-chip">
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={openGuidedPlanner}
                  aria-label="Open guided planner"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
                >
                  <MessageSquareText className="h-4 w-4" />
                  {HOMEPAGE_CONTACT_CONTENT.plannerCta}
                </button>
              </div>
            </div>

            <div className="contact-teaser__secondary scheme-border grid gap-5 border-t pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              <div>
                <p className="typ-label scheme-text-body mb-3">
                  {HOMEPAGE_CONTACT_CONTENT.directTitle}
                </p>
                <p className="page-copy-sm scheme-text-body max-w-md">
                  {HOMEPAGE_CONTACT_CONTENT.directDescription}
                </p>
              </div>
              <div className="grid gap-3">
                {directActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <a
                      key={action.label}
                      href={action.href}
                      target={action.external ? "_blank" : undefined}
                      rel={action.external ? "noopener noreferrer" : undefined}
                      className="contact-teaser__action"
                    >
                      <span className="contact-teaser__action-icon">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="contact-teaser__action-copy">
                        <span className="contact-teaser__action-label">{action.label}</span>
                        <span className="contact-teaser__action-detail">{action.detail}</span>
                      </span>
                      <ArrowUpRight className="contact-teaser__action-arrow h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
