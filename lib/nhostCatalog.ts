import "server-only";

import type { Product, ProductMetadata } from "@/lib/getProducts";
import { normalizeAssetList, normalizeAssetPath } from "@/lib/assetPaths";

type NhostProductRow = {
  id?: string | null;
  category_id?: string | null;
  series?: string | null;
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  images?: unknown;
  flagship_image?: string | null;
  map_layout?: string | null;
  features?: unknown;
  finishes?: unknown;
  metadata?: ProductMetadata | null;
  specs?: unknown;
  series_id?: string | null;
  series_name?: string | null;
  created_at?: string | null;
  alt_text?: string | null;
};

type NhostProductsResponse = {
  data?: {
    products?: NhostProductRow[];
  };
  errors?: Array<{ message?: string }>;
};

let loggedNhostCatalogError = false;

function isEnabled(): boolean {
  return process.env.NHOST_BACKUP_ENABLED === "true";
}

function buildEndpointCandidates(rawEndpoint: string): string[] {
  const trimmed = rawEndpoint.trim().replace(/\/+$/, "");
  if (!trimmed) return [];
  if (trimmed.endsWith("/v1/graphql")) {
    const v1 = trimmed.replace(/\/v1\/graphql$/, "/v1");
    return [trimmed, v1];
  }
  if (trimmed.endsWith("/v1")) {
    return [`${trimmed}/graphql`, trimmed];
  }
  return [`${trimmed}/v1/graphql`, `${trimmed}/v1`, trimmed];
}

function isSchemaUnavailable(errors: Array<{ message?: string }>): boolean {
  const text = errors
    .map((error) => String(error.message || "").toLowerCase())
    .join(" ");
  return (
    text.includes("no_queries_available") ||
    (text.includes("field") && text.includes("not found"))
  );
}

function toStringArray(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input.map((value) => String(value).trim()).filter(Boolean);
}

function toAssetArray(input: unknown): Array<string | null | undefined> {
  if (!Array.isArray(input)) return [];
  return input.map((value) =>
    value == null ? null : typeof value === "string" ? value : String(value),
  );
}

function toSpecs(input: unknown): Product["specs"] {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { dimensions: "", materials: [], features: [] };
  }
  const source = input as Record<string, unknown>;
  return {
    dimensions:
      typeof source.dimensions === "string" ? source.dimensions.trim() : "",
    materials: toStringArray(source.materials),
    features: toStringArray(source.features),
    sustainability_score:
      typeof source.sustainability_score === "number"
        ? source.sustainability_score
        : undefined,
  };
}

function toProduct(row: NhostProductRow): Product | null {
  if (!row.id || !row.slug || !row.name || !row.category_id) return null;
  return {
    id: row.id,
    category_id: row.category_id,
    series: row.series || row.series_name || "",
    name: row.name,
    slug: row.slug,
    description: row.description || "",
    images: normalizeAssetList(toAssetArray(row.images)),
    flagship_image: normalizeAssetPath(row.flagship_image),
    map_layout: row.map_layout || undefined,
    features: toStringArray(row.features),
    finishes: toStringArray(row.finishes),
    "3d_model": undefined,
    metadata: row.metadata || undefined,
    specs: toSpecs(row.specs),
    series_id: row.series_id || `${row.category_id}-series`,
    series_name: row.series_name || "Series",
    created_at: row.created_at || new Date().toISOString(),
    alt_text: row.alt_text || undefined,
  };
}

export async function fetchNhostProducts(options?: {
  categoryId?: string;
  productUrlKey?: string;
}): Promise<Product[] | null> {
  if (!isEnabled()) return null;

  const rawEndpoint =
    process.env.NHOST_GRAPHQL_URL?.trim() ||
    process.env.NHOST_GRAPHQL_ENDPOINT?.trim();
  const credential =
    process.env.NHOST_ADMIN_SECRET?.trim() ||
    process.env.NHOST_SERVICE_ROLE_KEY?.trim();
  if (!rawEndpoint || !credential) return null;
  const endpoints = buildEndpointCandidates(rawEndpoint);
  if (endpoints.length === 0) return null;

  const where: Record<string, unknown> = {};
  if (options?.categoryId) where.category_id = { _eq: options.categoryId };
  if (options?.productUrlKey) where.slug = { _eq: options.productUrlKey };

  const query = `
    query CatalogProducts($where: products_bool_exp) {
      products(where: $where, order_by: { name: asc }) {
        id
        category_id
        series
        name
        slug
        description
        images
        flagship_image
        map_layout
        features
        finishes
        metadata
        specs
        series_id
        series_name
        created_at
        alt_text
      }
    }
  `;

  const headerCandidates: Array<Record<string, string>> = credential.includes(".")
    ? [
        { "Content-Type": "application/json", Authorization: `Bearer ${credential}` },
        { "Content-Type": "application/json", "x-hasura-admin-secret": credential },
      ]
    : [
        { "Content-Type": "application/json", "x-hasura-admin-secret": credential },
        { "Content-Type": "application/json", Authorization: `Bearer ${credential}` },
      ];

  try {
    for (const endpoint of endpoints) {
      for (const headers of headerCandidates) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);
        try {
          const response = await fetch(endpoint, {
            method: "POST",
            headers,
            body: JSON.stringify({ query, variables: { where } }),
            cache: "no-store",
            signal: controller.signal,
          });

          if (!response.ok) continue;

          const payload = (await response.json()) as NhostProductsResponse;
          if (Array.isArray(payload.errors) && payload.errors.length > 0) {
            const denied = payload.errors.some((err) =>
              String(err.message || "").toLowerCase().includes("access-denied"),
            );
            if (denied) continue;
            if (isSchemaUnavailable(payload.errors)) continue;
            return null;
          }

          const rows = payload.data?.products || [];
          const products = rows.map(toProduct).filter((p): p is Product => Boolean(p));
          return products;
        } finally {
          clearTimeout(timeoutId);
        }
      }
    }

    return null;
  } catch (error) {
    if (!loggedNhostCatalogError) {
      loggedNhostCatalogError = true;
      const reason = error instanceof Error ? error.message : String(error);
      console.error(`[nhost-catalog] fallback fetch failed: ${reason}`);
    }
    return null;
  }
}
