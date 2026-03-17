"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  buildMailtoHref,
  buildWhatsAppHref,
  FOOTER_CONVERSION_PANEL,
  SITE_CONTACT,
  toTelHref,
} from "@/data/site/contact";
import {
  routeHasContactTeaser,
  routeSuppressesFooterConversionPanel,
} from "@/lib/contactSurfaces";

export function FooterConversionPanel() {
  const pathname = usePathname();

  if (routeHasContactTeaser(pathname) || routeSuppressesFooterConversionPanel(pathname)) {
    return null;
  }

  const footerWhatsAppHref = buildWhatsAppHref(FOOTER_CONVERSION_PANEL.whatsappPrompt);

  return (
    <div className="footer-conversion">
      <div className="container px-6 py-10 2xl:px-0 md:py-12">
        <div className="footer-conversion__panel">
          <div>
            <p className="typ-overline text-neutral-600">{FOOTER_CONVERSION_PANEL.eyebrow}</p>
            <h2 className="typ-section mt-3 max-w-xl text-neutral-950">
              {FOOTER_CONVERSION_PANEL.title}
            </h2>
            <p className="typ-body-sm mt-4 max-w-2xl text-neutral-700 md:text-base">
              {FOOTER_CONVERSION_PANEL.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {FOOTER_CONVERSION_PANEL.highlights.map((item) => (
                <span key={item} className="footer-conversion__chip">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="footer-conversion__actions">
            {FOOTER_CONVERSION_PANEL.actions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                prefetch={false}
                className={`footer-conversion__action ${
                  action.variant === "primary"
                    ? "footer-conversion__action--primary"
                    : "footer-conversion__action--secondary"
                }`}
              >
                <span>{action.label}</span>
                <span aria-hidden="true">-&gt;</span>
              </Link>
            ))}
            <div className="footer-conversion__contact">
              <p className="typ-body-sm font-semibold text-neutral-950">
                {FOOTER_CONVERSION_PANEL.responseLine}
              </p>
              <div className="footer-conversion__contact-links">
                <a
                  href={toTelHref(SITE_CONTACT.salesPhone)}
                  className="footer-conversion__contact-link"
                >
                  {SITE_CONTACT.salesPhone}
                </a>
                <a
                  href={footerWhatsAppHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-conversion__contact-link"
                >
                  WhatsApp support
                </a>
                <a
                  href={buildMailtoHref("Workspace enquiry")}
                  className="footer-conversion__contact-link"
                >
                  {SITE_CONTACT.salesEmail}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
