const CATEGORY_SLUG_SEGMENTS: Record<string, string> = {
  seating: "seating",
  "oando-seating": "seating",
  "oando-chairs": "seating",
  "oando-other-seating": "seating",
  workstations: "workstations",
  "oando-workstations": "workstations",
  tables: "tables",
  "oando-tables": "tables",
  storages: "storage",
  storage: "storage",
  "oando-storage": "storage",
  "soft-seating": "soft-seating",
  collaborative: "collaborative",
  "oando-soft-seating": "soft-seating",
  "oando-collaborative": "collaborative",
  education: "educational",
  educational: "educational",
  "oando-educational": "educational",
};

function normalize(input: unknown): string {
  return String(input || "").trim().toLowerCase();
}

export function slugifyProductName(name: unknown): string {
  return String(name || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/×/g, "x")
    .replace(/&/g, " and ")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-")
    .toLowerCase();
}

export function categorySlugSegment(categoryId: unknown): string {
  const normalized = normalize(categoryId);
  return CATEGORY_SLUG_SEGMENTS[normalized] || normalized.replace(/^oando-/, "") || "products";
}

export function buildCanonicalProductSlug(categoryId: unknown, name: unknown): string {
  const segment = categorySlugSegment(categoryId);
  const productNameSlug = slugifyProductName(name);
  if (!productNameSlug) return "";
  return `oando-${segment}--${productNameSlug}`;
}

export function repairProductSlug(input: {
  slug?: unknown;
  categoryId?: unknown;
  name?: unknown;
}): string {
  const existing = normalize(input.slug);
  if (existing) return existing;
  return buildCanonicalProductSlug(input.categoryId, input.name);
}
