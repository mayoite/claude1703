"use client";

import { useMemo, useState } from "react";
import {
  Bookmark,
  FolderOpen,
  LayoutPanelLeft,
  Loader2,
  PanelLeftClose,
  Search,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

import { PlannerCatalogImage } from "./PlannerCatalogImage";
import type { PlannerCatalogItem } from "./types";

type RailSection = "library" | "collections" | "recent" | "saved";
type SupportFilter = "all" | "docs" | "specs" | "core";

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

function getDimensionLabel(item: PlannerCatalogItem) {
  const values = [item.width, item.depth, item.height]
    .map((value) => Math.round(value ?? 0))
    .filter((value) => value > 0);

  return values.length > 0 ? `${values.join(" x ")} cm` : "Dimensions pending";
}

function getSupportBadge(item: PlannerCatalogItem) {
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
  const [activeSection, setActiveSection] = useState<RailSection>("library");
  const [supportFilter, setSupportFilter] = useState<SupportFilter>("all");
  const catalogCount = catalogSummary.phaseOneItemCount || catalogSummary.itemCount || 0;
  const filteredCatalog = useMemo(
    () =>
      visibleCatalog.filter((item) => {
        const badge = getSupportBadge(item);
        if (supportFilter === "docs") {
          return badge === "Docs ready";
        }
        if (supportFilter === "specs") {
          return badge === "Specs ready";
        }
        if (supportFilter === "core") {
          return badge === "Core data";
        }
        return true;
      }),
    [supportFilter, visibleCatalog],
  );
  const featuredCollections = useMemo(
    () =>
      categories.slice(0, 6).map((category, index) => {
        const featuredItem =
          filteredCatalog.find(
            (item) => (item.categoryLabel ?? item.category) === category,
          ) ?? filteredCatalog[index] ?? visibleCatalog[index] ?? null;

        return {
          category,
          featuredItem,
          tone: index % 2 === 0 ? "from-white/10 to-white/4" : "from-[var(--planner-accent-soft-bg)] to-white/4",
        };
      }),
    [categories, filteredCatalog, visibleCatalog],
  );
  const railTitle =
    activeSection === "library"
      ? "Product library"
      : activeSection === "collections"
        ? "Curated collections"
        : activeSection === "recent"
          ? "Recent activity"
          : "Saved views";

  const railIntro =
    activeSection === "library"
      ? "Search, stage, then place a product with live dimensions."
      : activeSection === "collections"
        ? "Jump into grouped planning flows instead of browsing generic inventory."
        : activeSection === "recent"
          ? "Keep orientation on the items and categories you just reviewed."
          : "Reserved for reusable planner setups and pinned product groups.";

  const navItems: Array<{
    id: RailSection;
    label: string;
    icon: typeof LayoutPanelLeft;
  }> = [
    { id: "library", label: "Library", icon: LayoutPanelLeft },
    { id: "collections", label: "Sets", icon: Sparkles },
    { id: "recent", label: "Recent", icon: FolderOpen },
    { id: "saved", label: "Saved", icon: Bookmark },
  ];

  return (
    <aside
      className={cn(
        "flex min-h-0 w-full min-w-0 shrink-0 bg-transparent text-body",
        className,
      )}
    >
      <div className="grid min-h-0 w-full grid-cols-[64px_minmax(0,1fr)]">
        <div className="flex min-h-0 flex-col items-center gap-2 border-r border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] px-2 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
                className={cn(
                  "flex w-full flex-col items-center gap-1 rounded-[14px] border px-1.5 py-2 text-center transition-all",
                  isActive
                    ? "border-[var(--planner-accent-soft-border)] bg-[var(--planner-accent-soft-bg)] text-white shadow-[var(--planner-shadow-accent)]"
                    : "border-white/8 bg-white/5 text-[var(--planner-shell-muted)] hover:border-white/14 hover:bg-white/8 hover:text-white",
                )}
                title={item.label}
              >
                <Icon className="h-4 w-4" />
                <span className="text-[8px] font-semibold tracking-[0.04em]">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex min-h-0 flex-col">
          <div className="shrink-0 space-y-2.5 border-b border-white/10 px-3.5 py-3 text-[var(--planner-shell-text)]">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <p className="text-[11px] font-semibold tracking-[0.24em] text-[var(--planner-shell-muted)] uppercase">
                  {railTitle}
                </p>
                <div className="flex flex-wrap items-center gap-1">
                  <span className="planner-shell-chip rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.04em]">
                    {filteredCatalog.length} visible
                  </span>
                  <span className="planner-shell-chip rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.04em]">
                    {catalogCount} curated
                  </span>
                  {activeCategory ? (
                    <span className="planner-shell-chip rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.04em]">
                      {activeCategory}
                    </span>
                  ) : null}
                </div>
                <p className="max-w-sm text-[11px] leading-4.5 text-[var(--planner-shell-muted)]">
                  {railIntro}
                </p>
              </div>
              {onCollapse ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 rounded-full border border-white/10 bg-white/5 p-0 text-[var(--planner-shell-muted)] hover:bg-white/10 hover:text-white"
                  onClick={onCollapse}
                  title="Collapse Catalog"
                >
                  <PanelLeftClose className="h-4 w-4" />
                </Button>
              ) : null}
            </div>

            {activeSection === "library" ? (
              <>
                <div className="planner-rail-section transition-focus-within flex items-center gap-2 rounded-xl px-3 py-2 focus-within:border-white/30">
                  <Search className="h-3.5 w-3.5 shrink-0 text-[var(--planner-shell-muted)]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Search workstations, seating, tables..."
                    className="w-full bg-transparent text-[13px] font-medium text-white outline-none placeholder:text-[var(--planner-shell-muted)]"
                  />
                </div>

                <div className="flex gap-1.5 overflow-x-auto pb-0.5">
                  <button
                    type="button"
                    onClick={() => onCategoryChange("")}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-[0.03em] whitespace-nowrap transition-all",
                      activeCategory.length === 0
                        ? "border-[var(--planner-accent-soft-border)] bg-[var(--planner-accent-soft-bg)] text-white"
                        : "border-white/10 bg-white/5 text-[var(--planner-shell-muted)] hover:border-white/16 hover:text-white",
                    )}
                  >
                    All
                  </button>
                  {categories.slice(0, 8).map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => onCategoryChange(category)}
                      className={cn(
                        "rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-[0.03em] whitespace-nowrap transition-all",
                        activeCategory === category
                          ? "border-[var(--planner-accent-soft-border)] bg-[var(--planner-accent-soft-bg)] text-white"
                          : "border-white/10 bg-white/5 text-[var(--planner-shell-muted)] hover:border-white/16 hover:text-white",
                      )}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <div className="flex gap-1.5 overflow-x-auto pb-0.5">
                  {[
                    { id: "all" as const, label: "All data" },
                    { id: "docs" as const, label: "Docs ready" },
                    { id: "specs" as const, label: "Specs ready" },
                    { id: "core" as const, label: "Core data" },
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSupportFilter(option.id)}
                      className={cn(
                        "rounded-full border px-2.5 py-1 text-[9px] font-semibold tracking-[0.06em] whitespace-nowrap transition-all",
                        supportFilter === option.id
                          ? "border-[var(--planner-accent-soft-border)] bg-white/12 text-white"
                          : "border-white/8 bg-black/10 text-[var(--planner-shell-muted)] hover:border-white/14 hover:text-white",
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            ) : null}
          </div>

          <div className="shrink-0 border-b border-white/10 bg-white/5 p-3">
            {activeSection === "library" ? (
              <>
                <p className="mb-2 text-[10px] font-semibold tracking-[0.14em] text-[var(--planner-shell-muted)] uppercase">
                  {selectedItem ? "Staged product" : "Select a product"}
                </p>
                {selectedItem ? (
                  <div className="planner-rail-section rounded-[20px] p-2.5 text-[var(--planner-shell-text)]">
                    <div className="flex items-start gap-3">
                      <div className="relative h-14 w-18 shrink-0 overflow-hidden rounded-[16px] border border-white/10 bg-white shadow-theme-soft">
                        <PlannerCatalogImage
                          item={selectedItem}
                          alt={selectedItem.name}
                          sizes="96px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-[13px] font-semibold tracking-[0.01em] text-white">
                            {selectedItem.name}
                          </h3>
                          <span className="rounded-full border border-white/10 bg-white/8 px-2 py-0.5 text-[10px] font-semibold tracking-[0.03em] text-[var(--planner-shell-muted)]">
                            {getSupportBadge(selectedItem)}
                          </span>
                        </div>
                        <p className="mt-0.5 truncate text-[11px] font-medium tracking-[0.03em] text-[var(--planner-shell-muted)]">
                          {selectedItem.family || selectedItem.categoryLabel || selectedItem.category}
                        </p>
                        <p className="truncate text-[11px] font-medium tracking-[0.02em] text-[var(--planner-shell-muted)]">
                          {selectedItem.subcategoryLabel ?? selectedItem.categoryLabel ?? selectedItem.category}
                        </p>
                        <p className="mt-1 text-[11px] font-semibold tracking-[0.02em] text-white/90">
                          {getDimensionLabel(selectedItem)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] font-semibold tracking-[0.03em] text-[var(--planner-shell-muted)]">
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
                    <Button
                      size="sm"
                      className="mt-2.5 h-9 w-full rounded-xl bg-[var(--planner-accent)] px-3 text-[11px] font-semibold tracking-[0.02em] text-[var(--planner-accent-contrast)] shadow-[var(--planner-shadow-accent)] hover:bg-[var(--planner-accent-hover)]"
                      onClick={() => onAddCatalogItem(selectedItem)}
                    >
                      Add item to canvas
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-[24px] border border-dashed border-white/14 bg-white/6 px-4 py-5 text-[var(--planner-shell-text)]">
                    <p className="text-[13px] font-semibold text-white">
                      Browse, compare, then stage one product.
                    </p>
                    <p className="mt-1 text-[12px] leading-5 text-[var(--planner-shell-muted)]">
                      Search or filter the catalog, then stage a product before adding it to the canvas.
                    </p>
                  </div>
                )}
              </>
            ) : activeSection === "collections" ? (
              <div className="space-y-3">
                <p className="text-[11px] font-semibold tracking-[0.16em] text-[var(--planner-shell-muted)] uppercase">
                  Plan by collection
                </p>
                <div className="grid gap-3">
                  {featuredCollections.map((collection) => (
                    <button
                      key={collection.category}
                      type="button"
                      onClick={() => {
                        setActiveSection("library");
                        onCategoryChange(collection.category);
                      }}
                      className={cn(
                        "overflow-hidden rounded-[24px] border p-4 text-left transition-all",
                        activeCategory === collection.category
                          ? "border-[var(--planner-accent-soft-border)] bg-[var(--planner-accent-soft-bg)] shadow-[var(--planner-shadow-accent)]"
                          : "border-white/10 bg-white/6 hover:border-white/18 hover:bg-white/10",
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br text-[11px] font-semibold tracking-[0.08em] text-white",
                            collection.tone,
                          )}
                        >
                          {collection.category.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[14px] font-semibold tracking-[0.01em] text-white">
                            {collection.category}
                          </p>
                          <p className="mt-1 text-[12px] leading-5 text-[var(--planner-shell-muted)]">
                            {collection.featuredItem
                              ? `Start from ${collection.featuredItem.name}`
                              : "Open this collection in the library drawer."}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-[24px] border border-dashed border-white/14 bg-white/6 px-4 py-5 text-[var(--planner-shell-text)]">
                <p className="text-[13px] font-semibold text-white">
                  {activeSection === "recent" ? "Recent review is coming next." : "Saved planner sets are not wired yet."}
                </p>
                <p className="mt-1 text-[12px] leading-5 text-[var(--planner-shell-muted)]">
                  {selectedItem
                    ? `Current staged item: ${selectedItem.name}.`
                    : "Use the library or collections rail to keep the placement flow moving."}
                </p>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {catalogLoading ? (
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
            ) : null}

            {catalogError ? (
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
            ) : null}

            {!catalogLoading && !catalogError && filteredCatalog.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-[var(--planner-shell-muted)]">
                <Search className="mb-4 h-12 w-12" />
                <p className="text-center text-[12px] font-semibold tracking-[0.04em]">
                  No matches found
                </p>
                <p className="mt-2 text-center text-[12px] leading-5 text-[var(--planner-shell-muted)]">
                  Try clearing the search, switching categories, or selecting a collection.
                </p>
              </div>
            ) : null}

            {!catalogLoading && !catalogError ? (
              <div className="grid grid-cols-1 gap-2.5 px-3.5 pt-3.5 pb-10">
                {filteredCatalog.map((item) => {
                  const isSelected = item.id === selectedItem?.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelectItem(item.id)}
                      className={cn(
                        "group flex w-full items-center gap-3 rounded-[18px] border px-3 py-3 text-left transition-all",
                        isSelected
                          ? "border-[var(--planner-accent-soft-border)] bg-[var(--planner-accent-soft-bg)] shadow-[var(--planner-shadow-accent)]"
                          : "border-white/8 bg-white/6 hover:border-white/16 hover:bg-white/10",
                      )}
                    >
                      <div
                        className={cn(
                          "relative h-14 w-16 shrink-0 overflow-hidden rounded-[14px] border transition-colors",
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
                              isSelected ? "text-[var(--text-heading)]" : "text-white",
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
                    </button>
                  );
                })}
              </div>
            ) : null}

            {canShowMore && supportFilter === "all" && !catalogLoading && !catalogError ? (
              <div className="px-4 pb-12">
                <Button
                  variant="outline"
                  className="w-full rounded-2xl border-white/10 bg-white/6 py-6 text-[12px] font-semibold tracking-[0.05em] text-[var(--planner-shell-muted)] hover:bg-white/10 hover:text-white"
                  onClick={onShowMore}
                >
                  Show {totalVisibleCount - displayedCount} more products
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </aside>
  );
}
