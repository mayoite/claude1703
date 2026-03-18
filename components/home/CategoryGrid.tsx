import Link from "next/link";
import { getCatalog } from "@/lib/getProducts";
import { CategoryImage } from "@/components/home/CategoryImage";
import { unstable_cache } from "next/cache";
import {
  buildRequestedCategoryCatalog,
  getCatalogCategoryHref,
  getCatalogCategoryLabel,
} from "@/lib/catalogCategories";
import { PRODUCTS_PAGE_COPY } from "@/data/site/routeCopy";

const getCachedCatalog = unstable_cache(
  async () => getCatalog(),
  ["home-category-grid-v2"],
  { revalidate: 3600, tags: ["catalog"] },
);

export async function CategoryGrid() {
  const requestedCatalog = buildRequestedCategoryCatalog(await getCachedCatalog());

  return (
    <section className="scheme-page w-full py-20 md:py-28">
      <div className="container px-6 2xl:px-0">
        {/* Section header */}
        <div className="mb-12 md:mb-16 max-w-2xl">
          <p className="typ-label scheme-text-muted mb-3">
            {PRODUCTS_PAGE_COPY.rangeKicker}
          </p>
          <h2 className="typ-section scheme-text-strong max-w-xl">
            {PRODUCTS_PAGE_COPY.rangeTitle}
          </h2>
        </div>

        {/* Uniform 3-col grid — 1 col mobile / 2 col tablet / 3 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-neutral-100">
          {requestedCatalog.map((category) => {
            const allProducts = category.series.flatMap((s) => s.products);
            const categoryName = getCatalogCategoryLabel(category.id, category.name);
            const categoryHref = getCatalogCategoryHref(category.id);
            const firstProductWithImage = allProducts.find(
              (p) => (p.images && p.images.length > 0) || p.flagshipImage,
            );
            const flagshipImage =
              firstProductWithImage?.images?.[0] ||
              firstProductWithImage?.flagshipImage ||
              "/images/hero/hero-1.webp";

            return (
              <Link
                key={category.id}
                href={categoryHref}
                className="group scheme-panel scheme-border relative block overflow-hidden rounded-[1.75rem] border transition-all duration-300 hover:-translate-y-1"
              >
                {/* Uniform square image */}
                <div className="scheme-section-soft scheme-border relative aspect-square overflow-hidden border-b">
                  <CategoryImage
                    src={flagshipImage}
                    alt=""
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors duration-500" />
                </div>

                {/* Card text */}
                <div className="flex items-center justify-between gap-4 px-5 py-5 md:px-6 md:py-6">
                  <div>
                    <h3 className="text-[clamp(1.8rem,2.4vw,2.5rem)] font-light leading-[0.95] text-neutral-900 transition-colors duration-200 group-hover:text-primary">
                      {categoryName}
                    </h3>
                    <p className="page-copy-sm scheme-text-body mt-1">
                      {allProducts.length} products
                    </p>
                  </div>
                  <svg
                    className="scheme-text-subtle w-4 h-4 shrink-0 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
