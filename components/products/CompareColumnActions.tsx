"use client";

import Link from "next/link";
import { MessageSquare } from "lucide-react";

interface CompareColumnActionsProps {
  productName: string;
  productHref: string;
  viewLabel: string;
  addLabel: string;
}

export function CompareColumnActions({
  productName,
  productHref,
  viewLabel,
  addLabel,
}: CompareColumnActionsProps) {
  const enquiryHref = `/contact?intent=quote&source=compare&product=${encodeURIComponent(
    productName,
  )}&ref=${encodeURIComponent(productHref)}`;

  return (
    <div className="mt-4 grid gap-2">
      <Link
        href={productHref}
        className="inline-flex min-h-10 items-center justify-center rounded-xl border border-neutral-200 px-3 text-sm font-medium text-neutral-800 transition-colors hover:border-neutral-900"
      >
        {viewLabel}
      </Link>
      <Link
        href={enquiryHref}
        aria-label={`${addLabel} ${productName}`}
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-primary px-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
      >
        <MessageSquare className="h-4 w-4" />
        {addLabel}
      </Link>
    </div>
  );
}
