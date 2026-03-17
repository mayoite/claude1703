import "server-only";

import { unstable_cache } from "next/cache";
import { supabase } from "@/lib/db";
import { fetchNhostProducts } from "@/lib/nhostCatalog";
import {
  Catalog_CATEGORY_ORDER,
  Catalog_CATEGORY_LABELS,
  getCatalogCategoryDescription,
  getCatalogCategoryLabel,
  normalizeRequestedCategoryId,
} from "@/lib/catalogCategories";
import { normalizeAssetList, normalizeAssetPath } from "@/lib/assetPaths";
import { CATALOG_REVALIDATE_SECONDS } from "@/data/site/fallbacks";

export type ApiCatalogProduct = {
  id: string;
  slug?: string;
  name: string;
  description: string;
  flagshipImage: string;
  sceneImages: string[];
  variants: Array<{ id: string; variantName: string; galleryImages: string[]; threeDModelUrl?: string }>;
  detailedInfo: { overview: string; features: string[]; dimensions: string; materials: string[] };
  metadata: ApiCatalogMetadata;
  images?: string[];
  altText?: string;
  specs?: Record<string, unknown>;
};

export type ApiCatalogMetadata = Record<string, unknown> & {
  source?: string;
  category?: string;
  subcategory?: string;
  tags?: string[];
  useCase?: string[];
  material?: string[];
  priceRange?: "budget" | "mid" | "premium" | "luxury";
  isHeightAdjustable?: boolean;
  bifmaCertified?: boolean;
  isStackable?: boolean;
  sustainabilityScore?: number;
};

export type ApiCatalogSeries = {
  id: string;
  name: string;
  description: string;
  products: ApiCatalogProduct[];
};

export type ApiCatalogCategory = {
  id: string;
  name: string;
  description: string;
  series: ApiCatalogSeries[];
};

type ProductRow = {
  id: string | null;
  slug: string | null;
  name: string | null;
  description: string | null;
  category_id: string | null;
  series_id: string | null;
  series_name: string | null;
  images: unknown;
  flagship_image: string | null;
  metadata: Record<string, unknown> | null;
  specs: Record<string, unknown> | null;
  alt_text: string | null;
};

type NhostProduct = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  category_id: string;
  series_id?: string;
  series_name?: string;
  images?: string[];
  flagship_image?: string;
  metadata?: Record<string, unknown>;
  specs?: Record<string, unknown>;
  alt_text?: string;
};

function toText(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim();
}

function toTextList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item || "").trim()).filter(Boolean);
}

function toBoolean(value: unknown): boolean | undefined {
  if (typeof value === "boolean") return value;
  return undefined;
}

function toNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  return undefined;
}

function toRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as Record<string, unknown>;
}

function toApiProduct(row: ProductRow): ApiCatalogProduct | null {
  const id = toText(row.id);
  const name = toText(row.name);
  if (!id || !name) return null;

  const specs = toRecord(row.specs);
  const metadataRaw = toRecord(row.metadata);
  const metadata: ApiCatalogMetadata = {
    ...metadataRaw,
    source: toText(metadataRaw.source) || undefined,
    category: toText(metadataRaw.category) || undefined,
    subcategory: toText(metadataRaw.subcategory) || undefined,
    tags: toTextList(metadataRaw.tags),
    useCase: toTextList(metadataRaw.useCase),
    material: toTextList(metadataRaw.material),
    priceRange: (() => {
      const value = toText(metadataRaw.priceRange);
      if (value === "budget" || value === "mid" || value === "premium" || value === "luxury") return value;
      return undefined;
    })(),
    isHeightAdjustable: toBoolean(metadataRaw.isHeightAdjustable),
    bifmaCertified: toBoolean(metadataRaw.bifmaCertified),
    isStackable: toBoolean(metadataRaw.isStackable),
    sustainabilityScore: toNumber(metadataRaw.sustainabilityScore),
  };
  const dimensions = toText(specs.dimensions);
  const materials = toTextList(specs.materials);
  const features = toTextList(specs.features);
  const images = normalizeAssetList(Array.isArray(row.images) ? (row.images as Array<string | null | undefined>) : []);
  const flagshipImage = normalizeAssetPath(row.flagship_image);
  const altText =
    toText(row.alt_text) ||
    toText(metadata.ai_alt_text) ||
    toText(metadata.aiAltText) ||
    `${name} product image`;

  return {
    id,
    slug: toText(row.slug) || id,
    name,
    description: toText(row.description),
    flagshipImage,
    sceneImages: [],
    variants: [],
    detailedInfo: {
      overview: toText(row.description),
      features,
      dimensions,
      materials,
    },
    metadata,
    images,
    altText: altText.replace(/\s+/g, " ").trim().slice(0, 140),
    specs,
  };
}

function toProductRowFromNhostProduct(product: NhostProduct): ProductRow {
  return {
    id: product.id || null,
    slug: product.slug || null,
    name: product.name || null,
    description: product.description || null,
    category_id: product.category_id || null,
    series_id: product.series_id || null,
    series_name: product.series_name || null,
    images: Array.isArray(product.images) ? product.images : [],
    flagship_image: product.flagship_image || null,
    metadata:
      product.metadata && typeof product.metadata === "object" && !Array.isArray(product.metadata)
        ? product.metadata
        : null,
    specs:
      product.specs && typeof product.specs === "object" && !Array.isArray(product.specs)
        ? product.specs
        : null,
    alt_text: product.alt_text || null,
  };
}

async function fetchCatalogRowsLive(): Promise<ProductRow[]> {
  const { data, error } = await supabase
    .from("products")
    .select("id, slug, name, description, category_id, series_id, series_name, images, flagship_image, metadata, specs, alt_text")
    .order("name", { ascending: true });

  if (error) {
    console.error("[catalog-api-data] products fetch failed:", error.message);
    const nhostProducts = await fetchNhostProducts();
    return (nhostProducts || []).map((product) =>
      toProductRowFromNhostProduct(product as unknown as NhostProduct),
    );
  }

  const rows = (data ?? []) as ProductRow[];
  if (rows.length > 0) return rows;

  const nhostProducts = await fetchNhostProducts();
  return (nhostProducts || []).map((product) =>
    toProductRowFromNhostProduct(product as unknown as NhostProduct),
  );
}

const getCachedCatalogRows = unstable_cache(fetchCatalogRowsLive, ["catalog-api-rows"], {
  revalidate: CATALOG_REVALIDATE_SECONDS,
  tags: ["catalog", "catalog-products"],
});

export async function fetchCatalogRows(): Promise<ProductRow[]> {
  return getCachedCatalogRows();
}

export async function fetchCompatCatalogForApi(): Promise<ApiCatalogCategory[]> {
  const rows = await fetchCatalogRows();
  if (rows.length === 0) return [];

  const byCategory = new Map<string, Map<string, ApiCatalogProduct[]>>();

  for (const row of rows) {
    const rawCategory = toText(row.category_id);
    const normalizedCategory = normalizeRequestedCategoryId(rawCategory);
    if (!normalizedCategory) continue;

    const seriesId = toText(row.series_id) || `${normalizedCategory}-series`;
    const product = toApiProduct(row);
    if (!product) continue;

    if (!byCategory.has(normalizedCategory)) {
      byCategory.set(normalizedCategory, new Map<string, ApiCatalogProduct[]>());
    }
    const seriesMap = byCategory.get(normalizedCategory)!;
    if (!seriesMap.has(seriesId)) {
      seriesMap.set(seriesId, []);
    }
    seriesMap.get(seriesId)!.push(product);
  }

  const categories: ApiCatalogCategory[] = [];
  for (const categoryId of Catalog_CATEGORY_ORDER) {
    const seriesMap = byCategory.get(categoryId);
    if (!seriesMap || seriesMap.size === 0) continue;

    const series: ApiCatalogSeries[] = [];
    for (const [seriesId, products] of seriesMap.entries()) {
      const seriesName = toText(rows.find((row) => toText(row.series_id) === seriesId)?.series_name) || "Series";
      series.push({
        id: seriesId,
        name: seriesName,
        description: `Premium ${Catalog_CATEGORY_LABELS[categoryId].toLowerCase()} solutions`,
        products,
      });
    }

    categories.push({
      id: categoryId,
      name: getCatalogCategoryLabel(categoryId, categoryId),
      description: getCatalogCategoryDescription(categoryId, categoryId),
      series,
    });
  }

  return categories;
}
