"use client";

import {
  ChevronDown,
  Loader2,
  Search,
  PanelLeftClose,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

import { PlannerCatalogImage } from "./PlannerCatalogImage";
import type { PlannerCatalogItem } from "./types";

interface PlannerCatalogGridProps {
  className?: string;
  catalogSummary: { itemCount: number; phaseOneItemCount: number };
  totalVisibleCount: number;
  displayedCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  catalogLoading: boolean;
  catalogError: string | null;
  visibleCatalog: PlannerCatalogItem[];
  selectedItem: PlannerCatalogItem | null;
  onSelectItem: (id: string) => void;
  onAddCatalogItem: (item: PlannerCatalogItem) => void;
  canShowMore: boolean;
  onShowMore: () => void;
  onRetryCatalog?: () => void;
  onCollapse?: () => void;
}

export function PlannerCatalogGrid({
  className,
  catalogSummary,
  totalVisibleCount,
  displayedCount,
  searchQuery,
  onSearchChange,
  categories,
  activeCategory,
  onCategoryChange,
  catalogLoading,
  catalogError,
  visibleCatalog,
  selectedItem,
  onSelectItem,
  onAddCatalogItem,
  canShowMore,
  onShowMore,
  onRetryCatalog,
  onCollapse,
}: PlannerCatalogGridProps) {
  const catalogCount = catalogSummary.phaseOneItemCount || catalogSummary.itemCount || 0;
  const getDimensionLabel = (item: PlannerCatalogItem) => {
    const values = [item.width, item.depth, item.height]
      .map((value) => Math.round(value ?? 0))
      .filter((value) => value > 0);
    return values.length > 0 ? `${values.join("×")} cm` : "Dimensions pending";
  };

  const getSupportBadge = (item: PlannerCatalogItem) => {
    const hasDocs = (item.docs?.length ?? 0) > 0;
    const hasSpecs =
      Boolean(item.spec?.trim()) ||
      (item.specSections?.length ?? 0) > 0 ||
      (item.overviewPairs?.length ?? 0) > 0;

    if (hasDocs) {
      return "Docs ready";
    }

    if (hasSpecs) {
      return "Specs ready";
    }

    return "Core data";
  };

  return (
    <aside
      className={cn(
        "flex min-h-0 w-full min-w-0 shrink-0 flex-col bg-transparent text-body",
        className,
      )}
    >
      <div className="shrink-0 space-y-4 border-b border-white/10 px-5 py-5 text-[var(--planner-shell-text)]">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--planner-shell-muted)]">
              Product Library
            </p>
            <div className="flex items-center gap-2">
              <span className="planner-shell-chip rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.04em]">
                {displayedCount} visible
              </span>
              <span className="planner-shell-chip rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.04em]">
                {catalogCount} curated
              </span>
            </div>
            <p className="max-w-sm text-[13px] leading-5 text-[var(--planner-shell-muted)]">
              Search the live planner catalog, stage one item, then place it with real dimensions.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="planner-shell-chip rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.04em]">
              {activeCategory || "All categories"}
            </span>
            {onCollapse && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-full border border-white/10 bg-white/5 p-0 text-[var(--planner-shell-muted)] hover:bg-white/10 hover:text-white"
                onClick={onCollapse}
                title="Collapse Catalog (C)"
              >
                <PanelLeftClose className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="planner-rail-section flex items-center gap-2 rounded-2xl px-3 py-3 transition-focus-within focus-within:border-white/30">
          <Search className="h-3.5 w-3.5 shrink-0 text-[var(--planner-shell-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search workstations, seating, tables..."
            className="w-full bg-transparent text-[13px] font-medium text-white outline-none placeholder:text-[var(--planner-shell-muted)]"
          />
        </div>

        <div className="relative group">
          <label htmlFor="catalog-category-select" className="sr-only">
            Filter by category
          </label>
          <select
            id="catalog-category-select"
            value={activeCategory}
            onChange={(event) => onCategoryChange(event.target.value)}
            className="planner-rail-section w-full appearance-none rounded-2xl py-3 pl-3 pr-8 text-[13px] font-medium tracking-[0.02em] text-white outline-none transition-colors hover:bg-white/10"
          >
            <option value="">ALL CATEGORIES</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--planner-shell-muted)] transition-colors group-hover:text-white" />
        </div>
      </div>

      <div className="shrink-0 border-b border-white/10 bg-white/5 p-4">
        <p className="mb-3 text-[11px] font-semibold tracking-[0.16em] text-[var(--planner-shell-muted)] uppercase">
          {selectedItem ? "Staged product" : "Select a product"}
        </p>
        {selectedItem ? (
          <>
            <div className="planner-rail-section rounded-[24px] p-3 text-[var(--planner-shell-text)]">
              <div className="flex items-start gap-3">
                <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-[20px] border border-white/10 bg-white shadow-theme-soft">
                  <PlannerCatalogImage
                    item={selectedItem}
                    alt={selectedItem.name}
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-base font-semibold tracking-[0.01em] text-white">
                      {selectedItem.name}
                    </h3>
                    <span className="rounded-full border border-white/10 bg-white/8 px-2 py-0.5 text-[10px] font-semibold tracking-[0.03em] text-[var(--planner-shell-muted)]">
                      {getSupportBadge(selectedItem)}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-[12px] font-medium tracking-[0.03em] text-[var(--planner-shell-muted)]">
                    {selectedItem.family || selectedItem.categoryLabel || selectedItem.category}
                  </p>
                  <p className="truncate text-[12px] font-medium tracking-[0.02em] text-[var(--planner-shell-muted)]">
                    {selectedItem.subcategoryLabel ?? selectedItem.categoryLabel ?? selectedItem.category}
                  </p>
                  <p className="mt-2 text-[12px] font-semibold tracking-[0.02em] text-white/90">
                    {getDimensionLabel(selectedItem)}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold tracking-[0.03em] text-[var(--planner-shell-muted)]">
                {selectedItem.materials?.[0] ? (
                  <span className="rounded-full border border-white/10 bg-white/8 px-2.5 py-1">
                    {selectedItem.materials[0]}
                  </span>
                ) : null}
                {selectedItem.shape ? (
                  <span className="rounded-full border border-white/10 bg-white/8 px-2.5 py-1">
                    {selectedItem.shape}
                  </span>
                ) : null}
              </div>
              <div className="mt-3">
                <Button
                  size="sm"
                  className="h-10 w-full rounded-2xl bg-[var(--planner-accent)] px-3 text-[12px] font-semibold tracking-[0.02em] text-[var(--planner-accent-contrast)] shadow-[var(--planner-shadow-accent)] hover:bg-[var(--planner-accent-hover)]"
                  onClick={() => onAddCatalogItem(selectedItem)}
                >
                  Add item to canvas
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-[24px] border border-dashed border-white/14 bg-white/6 px-4 py-5 text-[var(--planner-shell-text)]">
            <p className="text-[13px] font-semibold text-white">
              Browse, compare, then stage one product.
            </p>
            <p className="mt-1 text-[12px] leading-5 text-[var(--planner-shell-muted)]">
              Use search or category filters to narrow the list, then select a product to review details before placing it on the canvas.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold tracking-[0.03em] text-[var(--planner-shell-muted)]">
              <span className="rounded-full border border-white/10 bg-white/8 px-2.5 py-1">
                {catalogCount} catalog items
              </span>
              <span className="rounded-full border border-white/10 bg-white/8 px-2.5 py-1">
                Search + filter ready
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Product List */}
      <div className="flex-1 overflow-y-auto">
        {catalogLoading && (
          <div className="space-y-3 p-4">
            <div className="flex items-center gap-2 text-[var(--planner-shell-muted)]">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-[12px] font-semibold tracking-[0.05em]">
                Updating inventory
              </span>
            </div>
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={`catalog-skeleton-${index}`}
                className="animate-pulse rounded-[22px] border border-white/8 bg-white/6 px-3 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="h-16 w-20 rounded-[18px] bg-white/10" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-3 w-2/3 rounded-full bg-white/10" />
                    <div className="h-3 w-1/2 rounded-full bg-white/10" />
                    <div className="h-3 w-1/3 rounded-full bg-white/10" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {catalogError && (
          <div className="mx-4 my-6 rounded-2xl border border-rose-400/20 bg-rose-500/8 px-5 py-5 text-xs text-rose-100">
            <p className="mb-1 font-bold">DATA ERROR</p>
            {catalogError}
            {onRetryCatalog ? (
              <div className="mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-rose-500/30 bg-transparent text-rose-200 hover:bg-rose-500/10"
                  onClick={onRetryCatalog}
                >
                  Retry
                </Button>
              </div>
            ) : null}
          </div>
        )}

        {!catalogLoading && !catalogError && visibleCatalog.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 text-[var(--planner-shell-muted)]">
            <Search className="mb-4 h-12 w-12" />
            <p className="text-center text-[12px] font-semibold tracking-[0.04em]">
              No matches found
            </p>
            <p className="mt-2 text-center text-[12px] leading-5 text-[var(--planner-shell-muted)]">
              Try clearing the search, switching to all categories, or using a broader product term.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 px-4 pb-12 pt-4">
          {visibleCatalog.map((item) => {
            const isSelected = item.id === selectedItem?.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectItem(item.id)}
                className={cn(
                  "group flex w-full items-start gap-4 rounded-[24px] border px-4 py-4 text-left transition-all",
                  isSelected
                    ? "border-[var(--planner-accent-soft-border)] bg-[var(--planner-accent-soft-bg)] shadow-[var(--planner-shadow-accent)]"
                    : "border-white/8 bg-white/6 hover:border-white/16 hover:bg-white/10",
                )}
              >
                <div
                  className={cn(
                    "relative h-16 w-20 shrink-0 overflow-hidden rounded-[18px] border transition-colors",
                    isSelected
                      ? "border-white/40 bg-white"
                      : "border-white/10 bg-white group-hover:border-white/25",
                  )}
                >
                  <PlannerCatalogImage
                    item={item}
                    alt={item.name}
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p
                      className={cn(
                        "truncate text-[13px] font-semibold tracking-[0.01em] transition-colors",
                        isSelected
                          ? "text-[var(--text-heading)]"
                          : "text-white group-hover:text-white",
                      )}
                    >
                      {item.name}
                    </p>
                    <span className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[10px] font-semibold tracking-[0.03em] text-[var(--planner-shell-muted)]">
                      {getSupportBadge(item)}
                    </span>
                  </div>
                  <p className="truncate text-[12px] font-medium tracking-[0.02em] text-[var(--planner-shell-muted)]">
                    {item.family || item.categoryLabel || "General"}
                  </p>
                  <p className="truncate text-[12px] font-medium tracking-[0.02em] text-[var(--planner-shell-muted)]">
                    {item.subcategoryLabel ?? item.categoryLabel ?? item.category ?? "General"}
                  </p>
                  <p
                    className={cn(
                      "truncate text-[12px] font-medium tracking-[0.01em] transition-colors",
                      isSelected
                        ? "text-[var(--text-heading)]/80"
                        : "text-[var(--planner-shell-muted)] group-hover:text-white/85",
                    )}
                  >
                    {getDimensionLabel(item)}
                  </p>
                </div>
                {isSelected && (
                  <div className="h-4 w-4 shrink-0 flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-[var(--planner-selection)]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {canShowMore && (
          <div className="px-4 pb-12">
            <Button
              variant="outline"
              className="w-full rounded-2xl border-white/10 bg-white/6 py-6 text-[12px] font-semibold tracking-[0.05em] text-[var(--planner-shell-muted)] hover:bg-white/10 hover:text-white"
              onClick={onShowMore}
            >
              Show {totalVisibleCount - displayedCount} more products
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}
