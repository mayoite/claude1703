"use client";

import { Bot, MessageSquareText, Phone } from "lucide-react";

export function ContactTeaser() {
  function openGuidedPlanner() {
    window.dispatchEvent(new CustomEvent("oando-assistant:open"));
  }

  function openChatbot() {
    window.dispatchEvent(new CustomEvent("oando-chatbot:open"));
  }

  return (
    <section className="w-full border-t border-neutral-100 bg-white py-20 md:py-28">
      <div className="container px-6 2xl:px-0">
        <div className="mb-10 max-w-3xl">
          <p className="typ-label mb-4 text-neutral-700">Get in touch</p>
          <h2 className="typ-section mb-4 text-neutral-950">
            Choose how you want to start.
          </h2>
          <p className="typ-lead text-neutral-800">
            Use guided planning for structured intake and lead capture, or open the AI chatbot for
            quick recommendations. Human support is available any time.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <article className="rounded-2xl border border-primary/25 bg-primary/[0.04] p-6 md:p-8">
            <p className="typ-label mb-3 text-neutral-700">Guided planner</p>
            <h3 className="text-3xl font-light tracking-tight text-neutral-950">
              Structured project intake
            </h3>
            <p className="mt-3 text-base leading-relaxed text-neutral-800">
              Share seats, timeline, and city in a few guided steps. We save your requirement and
              respond with next actions.
            </p>
            <button
              type="button"
              onClick={openGuidedPlanner}
              className="btn-primary mt-6"
            >
              <MessageSquareText className="h-4 w-4" />
              Open Guided Planner
            </button>
          </article>

          <article className="rounded-2xl border border-neutral-300 bg-neutral-50 p-6 md:p-8">
            <p className="typ-label mb-3 text-neutral-700">AI chatbot</p>
            <h3 className="text-3xl font-light tracking-tight text-neutral-950">
              Ask, explore, compare
            </h3>
            <p className="mt-3 text-base leading-relaxed text-neutral-800">
              Describe your requirement and get practical product recommendations instantly. Shift
              to guided planning whenever you are ready.
            </p>
            <button
              type="button"
              onClick={openChatbot}
              className="btn-outline mt-6"
            >
              <Bot className="h-4 w-4" />
              Open AI Chatbot
            </button>
          </article>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-5 rounded-xl border border-neutral-200 bg-white px-5 py-4 text-sm text-neutral-700">
          <span className="inline-flex items-center gap-2">
            <Phone className="h-4 w-4 text-primary" />
            Need direct support? +91 90310 22875
          </span>
          <a href="mailto:sales@oando.co.in" className="link-arrow">
            sales@oando.co.in
          </a>
        </div>
      </div>
    </section>
  );
}
