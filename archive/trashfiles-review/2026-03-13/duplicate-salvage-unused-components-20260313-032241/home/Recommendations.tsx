"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useRecommendations } from "@/hooks/useRecommendations";

/**
 * Popular Picks — shows trending/popular products from the catalog API.
 * Silently renders nothing on error or empty response.
 * No personalization claims are made.
 */
export function Recommendations() {
  // Always enabled — no gate/opt-in required
  const { data, isLoading, error } = useRecommendations(true);

  if (isLoading) {
    return (
      <div
        className="flex h-40 items-center justify-center"
        aria-label="Loading popular picks"
        aria-busy="true"
      >
        <Loader2 className="h-7 w-7 animate-spin text-neutral-300" />
      </div>
    );
  }

  // Silently hide on error or no data — no fallback copy shown to users
  if (error || !data?.recommendations?.length) {
    return null;
  }

  return (
    <section
      className="border-y border-neutral-100 bg-neutral-50 py-14 md:py-16"
      aria-labelledby="popular-picks-heading"
    >
      <div className="container px-6 2xl:px-0">
        <div className="mb-12 max-w-xl">
          <h2
            id="popular-picks-heading"
            className="typ-h2 mb-4 text-neutral-900"
          >
            Popular Picks
          </h2>
          {data.summary && (
            <p className="typ-h3 font-normal text-neutral-700">{data.summary}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data.recommendations.map((rec, idx) => (
            <Link
              key={`${rec.productId}-${idx}`}
              href={rec.href}
              className="group flex h-full flex-col border border-neutral-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-900 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  {rec.category}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-neutral-900">
                  {rec.productName}
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-neutral-500">
                  {rec.why}
                </p>
              </div>

              <div className="mt-auto flex items-center justify-between border-t border-neutral-100 pt-4 text-xs">
                <span className="font-medium text-neutral-900">
                  {rec.budgetEstimate}
                </span>
                <span className="font-medium text-neutral-400 transition-colors group-hover:text-neutral-900">
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
