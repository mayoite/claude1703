"use client";

import { Bot, MessageSquareText, Phone } from "lucide-react";
import { SITE_CONTACT } from "@/data/site/contact";
import { HOMEPAGE_CONTACT_CONTENT } from "@/data/site/homepage";

export function ContactTeaser() {
  function openGuidedPlanner() {
    window.dispatchEvent(new CustomEvent("oando-assistant:open"));
  }

  function openChatbot() {
    window.dispatchEvent(new CustomEvent("oando-chatbot:open"));
  }

  return (
    <section className="home-section home-section--soft border-t border-neutral-200 py-20 md:py-28">
      <div className="home-shell">
        <div className="overflow-hidden border border-neutral-300 bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="border-b border-neutral-200 px-6 py-10 md:px-10 lg:border-b-0 lg:border-r">
              <p className="typ-label mb-4 text-neutral-700">{HOMEPAGE_CONTACT_CONTENT.kicker}</p>
              <h2 className="typ-section mb-4 max-w-xl text-neutral-950">
                {HOMEPAGE_CONTACT_CONTENT.title}
              </h2>
              <p className="max-w-xl text-base leading-relaxed text-neutral-700 md:text-lg">
                {HOMEPAGE_CONTACT_CONTENT.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={openGuidedPlanner}
                  aria-label="Open guided planner"
                  className="btn-primary"
                >
                  <MessageSquareText className="h-4 w-4" />
                  {HOMEPAGE_CONTACT_CONTENT.primary.cta}
                </button>
                <button
                  type="button"
                  onClick={openChatbot}
                  aria-label="Open AI chatbot"
                  className="btn-outline"
                >
                  <Bot className="h-4 w-4" />
                  {HOMEPAGE_CONTACT_CONTENT.secondary.cta}
                </button>
              </div>
            </div>

            <div className="bg-neutral-950 px-6 py-10 md:px-10">
              <p className="typ-label mb-4 text-white/58">{HOMEPAGE_CONTACT_CONTENT.kicker}</p>
              <h3 className="text-[2rem] tracking-tight text-white">
                {HOMEPAGE_CONTACT_CONTENT.direct.title}
              </h3>
              <p className="mt-3 max-w-md text-base leading-relaxed text-white/70">
                {HOMEPAGE_CONTACT_CONTENT.direct.description}
              </p>

              <div className="mt-8 space-y-4 border-t border-white/10 pt-6">
                <div className="border-b border-white/10 pb-4">
                  <span className="inline-flex items-center gap-2 text-sm text-white/56">
                    <Phone className="h-4 w-4 text-white/70" />
                    Call or WhatsApp
                  </span>
                  <p className="mt-2 text-2xl tracking-tight text-white">{SITE_CONTACT.supportPhone}</p>
                </div>
                <div>
                  <span className="inline-flex items-center gap-2 text-sm text-white/56">
                    <MessageSquareText className="h-4 w-4 text-white/70" />
                    Email
                  </span>
                  <a href={`mailto:${SITE_CONTACT.salesEmail}`} className="mt-2 block text-xl tracking-tight text-white transition-colors hover:text-white/80">
                    {SITE_CONTACT.salesEmail}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
