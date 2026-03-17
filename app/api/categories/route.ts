import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { fetchNhostProducts } from "@/lib/nhostCatalog";
import {
  Catalog_CATEGORY_LABELS,
  Catalog_CATEGORY_ORDER,
  normalizeRequestedCategoryId,
} from "@/lib/catalogCategories";

type CategoryCount = {
  id: string;
  name: string;
  count: number;
};

function createCatalogClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ??
    process.env.SUPABASE_URL?.trim() ??
    "";
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ??
    process.env.SUPABASE_ANON_KEY?.trim() ??
    process.env.SUPABASE_PUBLISHABLE_KEY?.trim() ??
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ??
    "";

  if (!supabaseUrl || !supabaseKey) return null;

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

async function fetchCategoryCounts(): Promise<CategoryCount[]> {
  const client = createCatalogClient();
  if (!client) {
    const nhostProducts = await fetchNhostProducts();
    const counts = new Map<string, number>();
    for (const product of nhostProducts || []) {
      const categoryId = normalizeRequestedCategoryId(product.category_id || "");
      if (!categoryId) continue;
      counts.set(categoryId, (counts.get(categoryId) ?? 0) + 1);
    }
    return Catalog_CATEGORY_ORDER.map((id) => ({
      id,
      name: Catalog_CATEGORY_LABELS[id],
      count: counts.get(id) ?? 0,
    }));
  }

  const { data, error } = await client
    .from("products")
    .select("category_id");

  if (error) {
    const nhostProducts = await fetchNhostProducts();
    if (!nhostProducts || nhostProducts.length === 0) {
      throw new Error(error.message);
    }
    const counts = new Map<string, number>();
    for (const product of nhostProducts) {
      const categoryId = normalizeRequestedCategoryId(product.category_id || "");
      if (!categoryId) continue;
      counts.set(categoryId, (counts.get(categoryId) ?? 0) + 1);
    }
    return Catalog_CATEGORY_ORDER.map((id) => ({
      id,
      name: Catalog_CATEGORY_LABELS[id],
      count: counts.get(id) ?? 0,
    }));
  }

  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    const rawId =
      typeof row?.category_id === "string" ? row.category_id : "";
    const categoryId = normalizeRequestedCategoryId(rawId);
    if (!categoryId) continue;
    counts.set(categoryId, (counts.get(categoryId) ?? 0) + 1);
  }

  return Catalog_CATEGORY_ORDER.map((id) => ({
    id,
    name: Catalog_CATEGORY_LABELS[id],
    count: counts.get(id) ?? 0,
  }));
}

export async function GET() {
  try {
    const categories = await fetchCategoryCounts();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Category fetch failed" },
      { status: 500 },
    );
  }
}
