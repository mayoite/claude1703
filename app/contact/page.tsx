import { MapPin, Phone, Mail } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { CustomerQueryForm } from "@/components/contact/CustomerQueryForm";
import { SITE_CONTACT } from "@/data/site/contact";
import { CONTACT_PAGE_COPY } from "@/data/site/routeCopy";

export default function ContactPage() {
  return (
    <section className="flex min-h-screen flex-col items-center bg-white">
      <Hero
        variant="small"
        title={CONTACT_PAGE_COPY.heroTitle}
        subtitle={CONTACT_PAGE_COPY.heroSubtitle}
        showButton={false}
        backgroundImage="/images/hero/tvs-patna-enhanced.webp"
      />
      <section className="contact-shell">
        <div className="contact-summary">
          <div className="contact-summary__intro section-divider">
            <p className="contact-summary__eyebrow">{CONTACT_PAGE_COPY.sectionTitle}</p>
            <h2 className="typ-section mt-3 text-neutral-950">Start with the right team.</h2>
            <p className="contact-summary__copy">
              Share your requirement, timeline, or category mix. We will route it to the right
              planning or sales contact and respond with practical next steps.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {CONTACT_PAGE_COPY.offices.map((office) => (
              <div key={office.title} className="contact-card">
                <p className="contact-card__title">{office.title}</p>
                <div className="contact-card__value">
                  {office.lines.map((line) => (
                    <p key={`${office.title}-${line}`}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="contact-card">
            <div className="contact-channel">
              <MapPin className="contact-channel__icon" />
              <div>
                <p className="contact-channel__label">Service region</p>
                <p className="contact-card__meta">{SITE_CONTACT.regionLine}</p>
              </div>
            </div>
            <div className="contact-channel">
              <Phone className="contact-channel__icon" />
              <div>
                <p className="contact-channel__label">Quotes and planning</p>
                <a
                  href={`tel:${SITE_CONTACT.salesPhone.replace(/\s+/g, "")}`}
                  className="contact-channel__link"
                >
                  {SITE_CONTACT.salesPhone}
                </a>
              </div>
            </div>
            <div className="contact-channel">
              <Phone className="contact-channel__icon" />
              <div>
                <p className="contact-channel__label">Support and enquiries</p>
                <a
                  href={`tel:${SITE_CONTACT.supportPhone.replace(/\s+/g, "")}`}
                  className="contact-channel__link"
                >
                  {SITE_CONTACT.supportPhone}
                </a>
              </div>
            </div>
            <div className="contact-channel">
              <Mail className="contact-channel__icon" />
              <div>
                <p className="contact-channel__label">Email</p>
                <a href={`mailto:${SITE_CONTACT.salesEmail}`} className="contact-channel__link">
                  {SITE_CONTACT.salesEmail}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form-panel">
          <CustomerQueryForm />
        </div>
      </section>
    </section>
  );
}
