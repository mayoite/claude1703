"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, Search, Sparkles } from "lucide-react";
import { OneAndOnlyLogo } from "@/components/ui/Logo";
import {
  NAV_CATEGORY_GROUP_ORDER,
  NAV_CATEGORY_GROUPS,
  groupCategories,
  type GroupedCategory,
} from "@/lib/navigation";
import { SITE_NAV_LINKS, SITE_CTA_LINKS } from "@/lib/siteNav";
import { MobileNavDrawer } from "@/components/site/MobileNavDrawer";
import { cn } from "@/lib/utils";

function prettify(id: string): string {
  return id
    .split("-")
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
}

const FALLBACK_CATEGORY_GROUPS: GroupedCategory[] = NAV_CATEGORY_GROUP_ORDER.map((groupId) => ({
  groupId,
  groupLabel: NAV_CATEGORY_GROUPS[groupId].label,
  items: NAV_CATEGORY_GROUPS[groupId].ids.map((id) => ({
    id,
    name: prettify(id),
    count: undefined,
    href: `/products/${id}`,
  })),
}));

interface NavSearchResult {
  id: string;
  title: string;
  href: string;
  type: "product" | "category" | "page";
  source: "ai" | "local";
}

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [groupedCategories, setGroupedCategories] = useState<GroupedCategory[]>(
    FALLBACK_CATEGORY_GROUPS,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<NavSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchSource, setSearchSource] = useState<"ai" | "local" | null>(null);
  const [showSearchPanel, setShowSearchPanel] = useState(false);

  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const searchPanelRef = useRef<HTMLDivElement>(null);

  // Fetch real product categories for mega menu
  useEffect(() => {
    fetch("/api/nav-categories/")
      .then((res) => res.json())
      .then((payload: { groups?: GroupedCategory[]; categories?: Array<{ id: string; name: string; count?: number }> }) => {
        if (Array.isArray(payload.groups) && payload.groups.length > 0) {
          setGroupedCategories(payload.groups);
          return;
        }
        if (Array.isArray(payload.categories) && payload.categories.length > 0) {
          setGroupedCategories(groupCategories(payload.categories));
          return;
        }
      })
      .catch(() => {});
  }, []);

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Esc closes mega menu
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveMega(null);
        setShowSearchPanel(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!searchPanelRef.current) return;
      if (!searchPanelRef.current.contains(event.target as Node)) {
        setShowSearchPanel(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  useEffect(() => {
    setShowSearchPanel(false);
  }, [pathname]);

  useEffect(() => {
    const query = searchQuery.trim();
    if (query.length < 2) {
      setSearchResults([]);
      setSearchSource(null);
      setSearchLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const response = await fetch("/api/nav-search/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, limit: 8, context: "header" }),
          signal: controller.signal,
        });
        const payload = (await response.json()) as {
          results?: NavSearchResult[];
          fallbackUsed?: boolean;
        };

        if (!response.ok) {
          setSearchResults([]);
          setSearchSource(null);
          return;
        }

        const results = Array.isArray(payload.results) ? payload.results : [];
        setSearchResults(results);
        setSearchSource(results[0]?.source || (payload.fallbackUsed ? "local" : null));
      } catch {
        setSearchResults([]);
        setSearchSource(null);
      } finally {
        setSearchLoading(false);
      }
    }, 260);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [searchQuery]);

  const searchSectionTitle = !searchQuery.trim()
    ? "Quick links"
    : searchLoading
      ? "Searching"
      : searchResults.length > 0
        ? "Results"
        : "No results";

  const onSearchResultClick = () => {
    setShowSearchPanel(false);
    setSearchQuery("");
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 z-50 w-full border-b border-neutral-200/70 bg-white/90 backdrop-blur-xl transition-shadow duration-300",
          scrolled
            ? "shadow-[0_8px_32px_-12px_rgba(0,0,0,0.25)]"
            : "shadow-none",
        )}
      >
        <div className="container-wide px-4 sm:px-6">
          <div
            className={cn(
              "hidden lg:flex items-center justify-between overflow-hidden border-b border-neutral-100 transition-[max-height,opacity,padding] duration-300",
              scrolled ? "max-h-0 opacity-0 py-0" : "max-h-10 opacity-100 py-2",
            )}
            aria-label="Utility navigation"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
              Workspace Furniture Specialist
            </p>
            <div className="flex items-center gap-5 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
              <Link href="/service" className="hover:text-primary transition-colors">
                Service
              </Link>
              <Link href="/showrooms" className="hover:text-primary transition-colors">
                Showrooms
              </Link>
              <Link href="/contact" className="hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
          </div>

          <div className="flex h-16 items-center justify-between gap-4">

            {/* Logo */}
            <Link
              href="/"
              aria-label="One and Only Furniture - home"
              className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
            >
              <OneAndOnlyLogo className="h-8 md:h-9" variant="orange" />
            </Link>

            {/* Center nav — desktop only */}
            <nav
              className="hidden lg:flex items-center gap-1"
              aria-label="Primary navigation"
            >
              {SITE_NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                const hasMega = "hasMega" in link && link.hasMega;

                if (hasMega) {
                  return (
                    <div
                      key={link.label}
                      className="relative"
                      onMouseEnter={() => setActiveMega(link.label)}
                      onMouseLeave={() => setActiveMega(null)}
                    >
                      <button
                        type="button"
                        aria-expanded={activeMega === link.label}
                        aria-controls="products-mega-menu"
                        onFocus={() => setActiveMega(link.label)}
                        className={cn(
                          "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                          isActive || activeMega === link.label
                            ? "text-primary"
                            : "text-neutral-700 hover:text-primary",
                        )}
                      >
                        {link.label}
                        <ChevronDown
                          className={cn(
                            "h-3.5 w-3.5 transition-transform",
                            activeMega === link.label && "rotate-180",
                          )}
                        />
                      </button>
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={cn(
                      "rounded-lg px-3 py-2 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      isActive
                        ? "text-primary"
                        : "text-neutral-700 hover:text-primary",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right CTAs */}
            <div className="flex items-center gap-2">
              <div ref={searchPanelRef} className="relative hidden xl:block">
                <label className="ai-search-shell flex h-11 items-center gap-2.5 rounded-full px-4">
                  <Search className="h-4 w-4 text-neutral-500" />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    onFocus={() => setShowSearchPanel(true)}
                    placeholder="AI search products..."
                    className="w-52 bg-transparent text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
                    aria-label="Search products with AI"
                  />
                  <Sparkles className="h-4 w-4 text-accent1" />
                </label>

                <AnimatePresence>
                  {showSearchPanel && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-[24rem] overflow-hidden rounded-3xl border border-neutral-200 bg-white p-4 shadow-[0_24px_55px_-30px_rgba(0,0,0,0.45)]"
                    >
                      <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                        <span>{searchSectionTitle}</span>
                        {searchSource && (
                          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px]">
                            {searchSource === "ai" ? "AI ranked" : "Local fallback"}
                          </span>
                        )}
                      </div>
                      {searchLoading ? (
                        <p className="py-6 text-sm text-neutral-500">Searching...</p>
                      ) : searchResults.length > 0 ? (
                        <ul className="space-y-1">
                          {searchResults.map((result) => (
                            <li key={result.id}>
                              <Link
                                href={result.href}
                                onClick={onSearchResultClick}
                                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
                              >
                                <span>{result.title}</span>
                                <span className="text-[10px] uppercase tracking-[0.14em] text-neutral-400">
                                  {result.type}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="space-y-1 py-2">
                          <Link
                            href="/products"
                            onClick={onSearchResultClick}
                            className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                          >
                            All Products
                          </Link>
                          <Link
                            href="/solutions"
                            onClick={onSearchResultClick}
                            className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                          >
                            Solutions
                          </Link>
                          <Link
                            href="/projects"
                            onClick={onSearchResultClick}
                            className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                          >
                            Projects
                          </Link>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {SITE_CTA_LINKS.map((cta) => (
                <Link
                  key={cta.label}
                  href={cta.href}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-bold uppercase tracking-[0.08em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                    cta.variant === "primary"
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "hidden md:inline-flex border border-neutral-300 text-neutral-700 hover:border-neutral-500 hover:text-neutral-900",
                  )}
                >
                  {cta.label}
                </Link>
              ))}

              {/* Hamburger — mobile only */}
              <button
                ref={hamburgerRef}
                type="button"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav-drawer"
                onClick={() => setMobileOpen((prev) => !prev)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Products mega menu */}
        <AnimatePresence>
          {activeMega === "Products" && (
            <motion.div
              id="products-mega-menu"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.15 }}
              onMouseEnter={() => setActiveMega("Products")}
              onMouseLeave={() => setActiveMega(null)}
              className="hidden lg:block border-t border-neutral-100 bg-white/95 backdrop-blur-xl"
            >
              <div className="container-wide px-6 py-8">
                <div className="grid grid-cols-6 gap-4">
                  {groupedCategories.map((group) => (
                    <div key={group.groupId}>
                      <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-neutral-400">
                        {group.groupLabel}
                      </p>
                      <ul className="space-y-1">
                        {group.items.map((item) => (
                          <li key={item.id}>
                            {item.name.trim().toLowerCase() !== group.groupLabel.trim().toLowerCase() && (
                              <Link
                                href={item.href}
                                onClick={() => setActiveMega(null)}
                                className="flex items-center justify-between rounded-lg px-2 py-1.5 text-base text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                              >
                                <span>{item.name}</span>
                                {typeof item.count === "number" && (
                                  <span className="text-xs text-neutral-400">
                                    {item.count}
                                  </span>
                                )}
                              </Link>
                            )}

                            {Array.isArray(item.subcategories) &&
                              item.subcategories.length > 0 && (
                              <ul className="ml-2 mt-1 space-y-0.5 border-l border-neutral-100 pl-2">
                                {item.subcategories.map((subcategory) => (
                                  <li key={`${item.id}-${subcategory.id}`}>
                                    <Link
                                      href={subcategory.href}
                                      onClick={() => setActiveMega(null)}
                                      className="flex items-center justify-between rounded-md px-2 py-1 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                    >
                                      <span>{subcategory.name}</span>
                                      {typeof subcategory.count === "number" && (
                                        <span className="text-xs text-neutral-400">
                                          {subcategory.count}
                                        </span>
                                      )}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                              )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  {/* View all link */}
                  <div className="flex items-start pt-5">
                    <Link
                      href="/products"
                      onClick={() => setActiveMega(null)}
                      className="text-base font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      All Products &gt;
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile drawer — rendered outside header to avoid z-index conflicts */}
      <MobileNavDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        closeButtonRef={hamburgerRef}
      />
    </>
  );
}
