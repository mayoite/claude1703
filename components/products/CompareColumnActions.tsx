"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useQuoteCart } from "@/lib/store/quoteCart";

interface CompareColumnActionsProps {
  productId: string;
  productName: string;
  productHref: string;
  image: string;
  viewLabel: string;
  addLabel: string;
}

export function CompareColumnActions({
  productId,
  productName,
  productHref,
  image,
  viewLabel,
  addLabel,
}: CompareColumnActionsProps) {
  const addItem = useQuoteCart((state) => state.addItem);

  return (
    <div className="mt-4 grid gap-2">
      <Link
        href={productHref}
        className="inline-flex min-h-10 items-center justify-center rounded-xl border border-neutral-200 px-3 text-sm font-medium text-neutral-800 transition-colors hover:border-neutral-900"
      >
        {viewLabel}
      </Link>
      <button
        type="button"
        onClick={() =>
          addItem({
            id: `quote-${productId}`,
            name: productName,
            image,
            href: productHref,
            qty: 1,
          })
        }
        aria-label={`${addLabel} ${productName}`}
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-primary px-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
      >
        <ShoppingCart className="h-4 w-4" />
        {addLabel}
      </button>
    </div>
  );
}
