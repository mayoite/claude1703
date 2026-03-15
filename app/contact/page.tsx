import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { CustomerQueryForm } from "@/components/contact/CustomerQueryForm";
import { SITE_CONTACT } from "@/data/site/contact";
import { CONTACT_PAGE_COPY } from "@/data/site/routeCopy";
import { buildPageJsonLd, buildPageMetadata } from "@/data/site/seo";
import { SITE_URL } from "@/lib/siteUrl";

export const metadata: Metadata = buildPageMetadata(SITE_URL, {
  title: "Contact us | One and Only Furniture",
  description: CONTACT_PAGE_COPY.heroSubtitle,
  path: "/contact",
  image: "/images/hero/tvs-patna-enhanced.webp",
});

function firstValue(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value[0] || null;
  return value || null;
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const intent = firstValue(resolvedSearchParams.intent);
  const source = firstValue(resolvedSearchParams.source);
  const contactJsonLd = buildPageJsonLd(SITE_URL, {
    path: "/contact",
    title: "Contact us | One and Only Furniture",
    description: CONTACT_PAGE_COPY.heroSubtitle,
    pageType: "ContactPage",
  });

  return (
    <section className="scheme-page flex min-h-screen flex-col items-center">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
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
            <h2 className="typ-section mt-3 text-neutral-950">{CONTACT_PAGE_COPY.introTitle}</h2>
            <p className="contact-summary__copy">
              {CONTACT_PAGE_COPY.introDescription}
            </p>
            <p className="mt-4 text-sm leading-7 text-neutral-700">
              {CONTACT_PAGE_COPY.resourceDeskLead}{" "}
              <Link href="/downloads" className="font-semibold text-primary transition-colors hover:text-primary-hover">
                {CONTACT_PAGE_COPY.resourceDeskCta}
              </Link>{" "}
              {CONTACT_PAGE_COPY.resourceDeskTail}
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
          <div className="scheme-panel-dark mb-6 rounded-[1.5rem] p-6">
            <p className="typ-label scheme-text-inverse-muted">{CONTACT_PAGE_COPY.quickDeskKicker}</p>
            <h2 className="typ-section mt-3 text-white">{CONTACT_PAGE_COPY.quickDeskTitle}</h2>
            <p className="page-copy scheme-text-inverse-body mt-3">{CONTACT_PAGE_COPY.quickDeskDescription}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/downloads" className="home-btn-secondary">
                {CONTACT_PAGE_COPY.quickDeskPrimaryCta}
              </Link>
              <Link href="/planning" className="home-btn-primary">
                {CONTACT_PAGE_COPY.quickDeskSecondaryCta}
              </Link>
            </div>
          </div>
          <CustomerQueryForm intent={intent} source={source} />
        </div>
      </section>
    </section>
  );
}
