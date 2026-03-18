"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { HOMEPAGE_FAQ_CONTENT } from "@/data/site/homepage";

export function HomeFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="home-section home-section--white py-10 md:py-14">
      <div className="home-shell">
        <div className="home-frame home-frame--standard">
          <div className="mb-8 md:mb-10">
            <h2 className="home-heading">
              {HOMEPAGE_FAQ_CONTENT.titleLead}{" "}
              <span className="home-heading__accent">
                {HOMEPAGE_FAQ_CONTENT.titleAccent}
              </span>
            </h2>
          </div>

          <dl className="divide-y divide-neutral-200">
            {HOMEPAGE_FAQ_CONTENT.items.map((item, index) => {
              const btnId = `faq-btn-${index}`;
              const panelId = `faq-panel-${index}`;
              const isOpen = open === index;

              return (
                <div key={index} className="py-4">
                  <dt>
                    <button
                      type="button"
                      id={btnId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="flex w-full items-center justify-between gap-4 text-left"
                      onClick={() => setOpen(isOpen ? null : index)}
                    >
                      <span className="text-base font-medium text-neutral-950 md:text-lg">
                        {item.q}
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-neutral-400 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  </dt>
                  <dd
                    id={panelId}
                    role="region"
                    aria-labelledby={btnId}
                    hidden={!isOpen}
                    className="mt-3 text-base text-neutral-600 leading-relaxed"
                  >
                    {item.a}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}
