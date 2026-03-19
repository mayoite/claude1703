"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, MessageCircle, MessageSquareText, Phone } from "lucide-react";
import { buildWhatsAppHref, SITE_CONTACT, toTelHref } from "@/data/site/contact";
import { HOMEPAGE_CONTACT_CONTENT } from "@/data/site/homepage";

export function PreviewContactClose() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [contact, setContact] = useState("");
  const [brief, setBrief] = useState("");
  const [timeline, setTimeline] = useState("Within 1-3 months");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<{
    type: "idle" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });

  const directActions = HOMEPAGE_CONTACT_CONTENT.directActions.map((action) => ({
    ...action,
    href:
      action.type === "whatsapp"
        ? buildWhatsAppHref("Need a direct workspace response for my project brief.")
        : toTelHref(SITE_CONTACT.supportPhone),
    icon: action.type === "whatsapp" ? MessageCircle : Phone,
    external: action.type === "whatsapp",
  }));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const trimmedContact = contact.trim();
    const isEmail = trimmedContact.includes("@");
    const payload = {
      name: name.trim(),
      email: isEmail ? trimmedContact : "",
      phone: isEmail ? "" : trimmedContact,
      message: `${brief.trim()}\nCity: ${city.trim()}`,
      requirement: "Workspace planning",
      timeline: timeline.trim(),
      preferredContact: isEmail ? "email" : "phone",
      source: "homepage-editorial-preview",
      sourcePath: window.location.pathname,
    };

    setIsSubmitting(true);
    setFormStatus({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/customer-queries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(result.error || "Unable to submit now.");
      }

      setName("");
      setCity("");
      setContact("");
      setBrief("");
      setTimeline("Within 1-3 months");
      setFormStatus({
        type: "success",
        message: "Brief received. The team will follow up shortly.",
      });
    } catch (error) {
      setFormStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Unable to submit now.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function openGuidedPlanner() {
    window.dispatchEvent(new CustomEvent("oando-assistant:open"));
  }

  return (
    <section className="preview-contact">
      <div className="preview-shell">
        <div className="preview-contact__panel">
          <div className="preview-contact__intro">
            <p className="preview-section-heading__eyebrow">Closing conversion</p>
            <h2 className="preview-section-heading__title">
              {HOMEPAGE_CONTACT_CONTENT.titleLead}{" "}
              <span>{HOMEPAGE_CONTACT_CONTENT.titleAccent}</span>
            </h2>
            <p className="preview-contact__copy">
              Share the site, scope, and timing. This version strips back the chrome so the
              handoff feels more deliberate and less like a stock enquiry panel.
            </p>

            <div className="preview-contact__actions">
              {directActions.map((action) => {
                const Icon = action.icon;

                return (
                  <a
                    key={action.label}
                    href={action.href}
                    target={action.external ? "_blank" : undefined}
                    rel={action.external ? "noopener noreferrer" : undefined}
                    className="preview-contact-action"
                  >
                    <span className="preview-contact-action__icon">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="preview-contact-action__text">
                      <span className="preview-contact-action__label">{action.label}</span>
                      <span className="preview-contact-action__detail">{action.detail}</span>
                    </span>
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                );
              })}
            </div>

            <div className="preview-contact__notes">
              {HOMEPAGE_CONTACT_CONTENT.plannerPoints.map((item) => (
                <span key={item} className="preview-contact__note">
                  {item}
                </span>
              ))}
            </div>

            <p className="preview-contact__region">
              Patna-based team supporting Bihar, Jharkhand, and multi-city rollout briefs.
            </p>
          </div>

          <form
            aria-label="Editorial preview project brief"
            className="preview-contact-form"
            onSubmit={handleSubmit}
          >
            <div className="preview-contact-form__header">
              <p className="preview-contact-form__eyebrow">Quick brief</p>
              <p className="preview-contact-form__title">Tell us what the floor needs next.</p>
            </div>

            <div className="preview-contact-form__grid">
              <label className="preview-contact-form__field">
                <span className="preview-contact-form__label">Name</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="preview-contact-form__input"
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={180}
                  placeholder="Your name"
                />
              </label>

              <label className="preview-contact-form__field">
                <span className="preview-contact-form__label">City</span>
                <input
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  className="preview-contact-form__input"
                  type="text"
                  autoComplete="address-level2"
                  required
                  maxLength={120}
                  placeholder="Project city"
                />
              </label>

              <label className="preview-contact-form__field">
                <span className="preview-contact-form__label">Phone or Email</span>
                <input
                  value={contact}
                  onChange={(event) => setContact(event.target.value)}
                  className="preview-contact-form__input"
                  type="text"
                  autoComplete="off"
                  required
                  maxLength={180}
                  placeholder="Phone or email"
                />
              </label>

              <label className="preview-contact-form__field">
                <span className="preview-contact-form__label">Timeline</span>
                <select
                  value={timeline}
                  onChange={(event) => setTimeline(event.target.value)}
                  className="preview-contact-form__input"
                >
                  <option>Immediate</option>
                  <option>Within 1-3 months</option>
                  <option>Within 3-6 months</option>
                  <option>Exploring</option>
                </select>
              </label>
            </div>

            <label className="preview-contact-form__field">
              <div className="preview-contact-form__label-row">
                <span className="preview-contact-form__label">Brief</span>
                <span
                  className="preview-contact-form__count"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {brief.length}/5000
                </span>
              </div>
              <textarea
                value={brief}
                onChange={(event) => setBrief(event.target.value)}
                className="preview-contact-form__input preview-contact-form__input--textarea"
                rows={4}
                required
                maxLength={5000}
                placeholder="Share team size, categories, or operational needs."
              />
            </label>

            <div className="preview-contact-form__footer">
              <button
                type="submit"
                disabled={isSubmitting}
                className="preview-button preview-button--primary"
              >
                <MessageSquareText className="h-4 w-4" />
                {isSubmitting ? "Sending..." : "Send Project Brief"}
              </button>
              <button
                type="button"
                className="preview-button preview-button--ghost"
                onClick={openGuidedPlanner}
              >
                Guided Planner
              </button>
              <Link href="/downloads" className="preview-button preview-button--ghost">
                Resource Desk
              </Link>
            </div>

            {formStatus.type !== "idle" ? (
              <p
                className={`preview-contact-form__status preview-contact-form__status--${formStatus.type}`}
                role="status"
              >
                {formStatus.message}
              </p>
            ) : null}
          </form>
        </div>
      </div>
    </section>
  );
}
