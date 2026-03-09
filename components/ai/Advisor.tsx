"use client";

import { useEffect, useRef, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Bot, ExternalLink, Loader2, Send, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { getCatalogProductHref } from "@/lib/catalogCategories";
import { AI_ADVISOR_COPY, AI_ADVISOR_SAMPLE_QUERIES } from "@/data/site/assistant";

interface Recommendation {
  productUrlKey?: string;
  productId: string;
  productName: string;
  category: string;
  why: string;
  budgetEstimate: string;
}

interface AdvisorResult {
  recommendations: Recommendation[];
  totalBudget: string;
  summary: string;
}

export function AIAdvisor() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AdvisorResult | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const focusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (focusTimeoutRef.current) clearTimeout(focusTimeoutRef.current);
    if (open) {
      focusTimeoutRef.current = setTimeout(() => inputRef.current?.focus(), 100);
    }
    return () => {
      if (focusTimeoutRef.current) clearTimeout(focusTimeoutRef.current);
    };
  }, [open]);

  async function handleSubmit(e?: React.FormEvent, prefill?: string) {
    e?.preventDefault();
    const nextQuery = prefill ?? query;
    if (!nextQuery.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/ai-advisor/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: nextQuery }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Something went wrong");
      }

      setResult(data);
      if (prefill) setQuery(prefill);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to get recommendations";
      toast.error(message, {
        duration: 4000,
        style: {
          background: "#1a1a1a",
          color: "#fff",
          borderLeft: "4px solid #ef4444",
          borderRadius: "4px",
        },
      });
    } finally {
      setLoading(false);
    }
  }

  function recommendationHref(rec: Recommendation) {
    const productUrlKey = rec.productUrlKey || rec.productId || "";
    return getCatalogProductHref(
      String(rec.category || "").trim().toLowerCase(),
      productUrlKey,
    );
  }

  return (
    <>
      <Toaster position="bottom-right" />

      <button
        id="ai-advisor-trigger"
        onClick={() => setOpen(true)}
        aria-label="Open AI Workspace Advisor"
        className={`fixed bottom-4 right-3 z-50 flex items-center gap-2 rounded-full bg-neutral-900 px-3.5 py-2.5 text-white shadow-2xl shadow-black/30 transition-all duration-300 group hover:bg-primary sm:bottom-6 sm:right-6 sm:px-5 sm:py-3.5 ${
          open ? "pointer-events-none scale-90 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <Sparkles className="h-4 w-4 text-primary transition-colors group-hover:text-white" />
        <span className="hidden text-sm font-bold tracking-wide sm:inline">AI Advisor</span>
        <span className="text-xs font-bold tracking-wide sm:hidden">AI</span>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:justify-end sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="AI Workspace Advisor"
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <div className="relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-h-[85vh] sm:w-[480px] sm:rounded-2xl">
            <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold leading-none text-neutral-900">
                    AI Workspace Consultant
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-400">{AI_ADVISOR_COPY.subtitle}</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 transition-colors hover:bg-neutral-200"
                aria-label="Close advisor"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
              {!result && !loading ? (
                <>
                  <p className="text-sm leading-relaxed text-neutral-500">{AI_ADVISOR_COPY.intro}</p>

                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                      {AI_ADVISOR_COPY.surpriseLabel}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {AI_ADVISOR_SAMPLE_QUERIES.map((sample) => (
                        <button
                          key={sample}
                          onClick={() => handleSubmit(undefined, sample)}
                          className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs text-neutral-700 transition-colors hover:bg-neutral-900 hover:text-white"
                        >
                          {sample}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}

              {loading ? (
                <div className="flex flex-col items-center justify-center gap-4 py-12 text-neutral-500">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm">{AI_ADVISOR_COPY.loading}</p>
                </div>
              ) : null}

              {result ? (
                <div className="space-y-4">
                  <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                    <p className="mb-2 text-xs font-bold uppercase tracking-widest text-neutral-400">
                      Consultant Summary
                    </p>
                    <p className="text-sm leading-relaxed text-neutral-700">{result.summary}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs text-neutral-400">Estimated project total:</span>
                      <span className="text-sm font-bold text-neutral-900">{result.totalBudget}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                      Recommended Systems ({result.recommendations?.length ?? 0})
                    </p>
                    {result.recommendations?.map((rec, index) => (
                      <div
                        key={`${rec.productId}-${index}`}
                        className="group rounded-xl border border-neutral-200 p-4 transition-colors hover:border-neutral-400"
                      >
                        <div className="mb-2 flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold leading-tight text-neutral-900">
                            {rec.productName}
                          </h4>
                          <Link
                            href={recommendationHref(rec)}
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-100 transition-colors group-hover:bg-neutral-900 group-hover:text-white"
                            aria-label={`View ${rec.productName}`}
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                        <p className="mb-3 text-xs leading-relaxed text-neutral-500">{rec.why}</p>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-600">
                            {rec.category?.replace("oando-", "").replace(/-/g, " ")}
                          </span>
                          <span className="text-xs font-semibold text-primary">
                            {rec.budgetEstimate}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setResult(null);
                      setQuery("");
                    }}
                    className="text-xs text-neutral-400 underline transition-colors hover:text-neutral-900"
                  >
                    Start a new query
                  </button>
                </div>
              ) : null}
            </div>

            {!result ? (
              <form onSubmit={handleSubmit} className="border-t border-neutral-100 bg-white px-6 py-4">
                <div className="flex items-end gap-3">
                  <textarea
                    ref={inputRef}
                    id="ai-advisor-input"
                    rows={2}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        void handleSubmit();
                      }
                    }}
                    placeholder={AI_ADVISOR_COPY.placeholder}
                    className="flex-1 resize-none rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !query.trim()}
                    id="ai-advisor-submit"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-white transition-colors hover:bg-primary disabled:opacity-40"
                    aria-label="Send query"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </form>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
