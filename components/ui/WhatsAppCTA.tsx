"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Phone, X } from "lucide-react";

export function WhatsAppCTA() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        type="button"
        aria-label="Open WhatsApp quick contact"
        onClick={() => setOpen((prev) => !prev)}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.25 }}
        className="fixed bottom-20 right-3 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full border border-green-600 bg-green-600 text-white shadow-lg transition-colors hover:bg-green-700 sm:bottom-24 sm:right-6"
      >
        <MessageCircle className="h-6 w-6" />
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-36 right-3 z-50 w-[19rem] rounded-2xl border border-neutral-300 bg-white p-4 shadow-2xl sm:bottom-40 sm:right-6"
          >
            <div className="mb-3 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-neutral-950">Quick contact</p>
                <p className="text-xs text-neutral-700">Reach support and sales directly.</p>
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
              <a
                href="https://wa.me/919031022875?text=Hi,%20I%20need%20help%20with%20my%20workspace%20requirement."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-3 py-3 transition-colors hover:bg-green-100"
              >
                <MessageCircle className="h-5 w-5 text-green-700" />
                <div>
                  <p className="text-sm font-semibold text-green-900">WhatsApp chat</p>
                  <p className="text-xs text-green-800">Fast response from our team</p>
                </div>
              </a>

              <a
                href="tel:+919031022875"
                className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 px-3 py-3 transition-colors hover:bg-blue-100"
              >
                <Phone className="h-5 w-5 text-blue-700" />
                <div>
                  <p className="text-sm font-semibold text-blue-900">Call support</p>
                  <p className="text-xs text-blue-800">+91 90310 22875</p>
                </div>
              </a>

              <Link
                href="/contact"
                className="flex items-center gap-3 rounded-lg border border-neutral-300 bg-white px-3 py-3 transition-colors hover:bg-neutral-50"
                onClick={() => setOpen(false)}
              >
                <MessageCircle className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-neutral-950">Open contact form</p>
                  <p className="text-xs text-neutral-700">Share detailed requirements</p>
                </div>
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
