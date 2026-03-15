"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Mail, MessageCircle, Phone, X } from "lucide-react";
import { hasConsentChoice } from "@/lib/consent";
import { buildMailtoHref, buildWhatsAppHref, SITE_CONTACT, toTelHref } from "@/data/site/contact";
import { routeSuppressesFloatingQuickContact } from "@/lib/contactSurfaces";

export function WhatsAppCTA() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const consentSettled = useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") return () => {};
      const handler = () => onStoreChange();
      window.addEventListener("oando-cookie-consent", handler as EventListener);
      return () => window.removeEventListener("oando-cookie-consent", handler as EventListener);
    },
    () => hasConsentChoice(),
    () => false,
  );

  if (!isHydrated || routeSuppressesFloatingQuickContact(pathname)) return null;

  const buttonOffset = consentSettled ? "bottom-4 sm:bottom-5" : "bottom-36 sm:bottom-5";
  const panelOffset = consentSettled ? "bottom-20 sm:bottom-20" : "bottom-52 sm:bottom-20";
  const whatsappHref = buildWhatsAppHref("Hi, I need help with my workspace requirement.");
  const quickActions = [
    {
      href: whatsappHref,
      label: "WhatsApp now",
      detail: "Fastest response",
      icon: MessageCircle,
      external: true,
    },
    {
      href: toTelHref(SITE_CONTACT.supportPhone),
      label: "Call team",
      detail: "Talk to support",
      icon: Phone,
      external: false,
    },
    {
      href: buildMailtoHref("Workspace enquiry"),
      label: "Email us",
      detail: "Send the brief",
      icon: Mail,
      external: false,
    },
  ] as const;

  return (
    <>
      <motion.button
        type="button"
        aria-label="Open WhatsApp quick contact"
        onClick={() => setOpen((prev) => !prev)}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.25 }}
        className={`quick-contact-fab fixed right-3 z-40 inline-flex h-12 min-w-12 items-center justify-center rounded-full sm:right-5 ${buttonOffset}`}
      >
        <span className="quick-contact-fab__icon">
          <MessageCircle className="h-5 w-5" />
        </span>
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className={`quick-contact-panel fixed right-3 z-40 w-[19rem] sm:right-5 ${panelOffset}`}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-neutral-950">Quick contact</p>
                <p className="text-xs text-neutral-700">Reach the team directly.</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close WhatsApp quick contact"
                className="rounded-full bg-neutral-100 p-1.5 text-neutral-700 transition-colors hover:bg-neutral-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {quickActions.map((action) => {
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

              <Link
                href="/contact"
                className="quick-contact-panel__footer-link"
                onClick={() => setOpen(false)}
              >
                Open full contact page
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
