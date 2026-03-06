import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import postgres from "postgres";

type ProductRow = {
  id: string;
  category_id: string;
  series: string | null;
  name: string;
  slug: string;
  description: string | null;
  images: unknown;
  flagship_image: string | null;
  map_layout: string | null;
  features: unknown;
  finishes: unknown;
  metadata: unknown;
  specs: unknown;
  series_id: string | null;
  series_name: string | null;
  created_at: string | null;
  alt_text: string | null;
};

type BusinessStatsRow = {
  id: string;
  projects_delivered: number;
  client_organisations: number;
  sectors_served: number;
  locations_served: number;
  years_experience: number;
  as_of_date: string;
  is_active: boolean;
  updated_at: string | null;
};

const PAGE_SIZE = 1000;
const MAX_RETRIES = 5;
const BASE_RETRY_DELAY_MS = 800;

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

async function fetchAllRows<T>(
  supabase: ReturnType<typeof createClient>,
  table: string,
): Promise<T[]> {
  const rows: T[] = [];
  for (let offset = 0; ; offset += PAGE_SIZE) {
    let data: T[] | null = null;
    let lastError: string | null = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
      const response = await supabase
        .from(table)
        .select("*")
        .range(offset, offset + PAGE_SIZE - 1);

      if (!response.error) {
        data = (response.data ?? []) as T[];
        lastError = null;
        break;
      }

      lastError = response.error.message;
      const normalized = lastError.toLowerCase();
      const transient =
        normalized.includes("ssl handshake failed") ||
        normalized.includes("error code 525") ||
        normalized.includes("cloudflare") ||
        normalized.includes("<!doctype html") ||
        normalized.includes("fetch failed") ||
        normalized.includes("timeout");

      if (!transient || attempt >= MAX_RETRIES) {
        break;
      }

      const waitMs = BASE_RETRY_DELAY_MS * 2 ** (attempt - 1);
      console.warn(
        `[supabase:${table}] transient error at offset=${offset}, retry ${attempt}/${MAX_RETRIES} in ${waitMs}ms`,
      );
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }

    if (lastError) {
      throw new Error(`[supabase:${table}] ${lastError}`);
    }

    const page = data ?? [];
    rows.push(...page);
    if (page.length < PAGE_SIZE) break;
  }

  return rows;
}

async function verifyNhostGraphql() {
  const endpoint =
    process.env.NHOST_GRAPHQL_ENDPOINT?.trim() ||
    process.env.NHOST_GRAPHQL_URL?.trim();
  const adminSecret =
    process.env.NHOST_ADMIN_SECRET?.trim() ||
    process.env.NHOST_SERVICE_ROLE_KEY?.trim();

  if (!endpoint || !adminSecret) {
    console.warn("[verify] skipped GraphQL verification (missing endpoint/admin secret)");
    return;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hasura-admin-secret": adminSecret,
    },
    body: JSON.stringify({
      query: `
        query VerifyBackup {
          products(limit: 1) { id slug }
          business_stats_current(limit: 1) { as_of_date is_active }
        }
      `,
    }),
    cache: "no-store",
  });

  const payload = (await response.json()) as {
    errors?: Array<{ message?: string }>;
    data?: {
      products?: Array<{ id: string; slug: string }>;
      business_stats_current?: Array<{ as_of_date: string; is_active: boolean }>;
    };
  };

  if (Array.isArray(payload.errors) && payload.errors.length > 0) {
    throw new Error(`[nhost:graphql] ${payload.errors[0]?.message || "unknown error"}`);
  }

  const productsCount = payload.data?.products?.length ?? 0;
  const statsCount = payload.data?.business_stats_current?.length ?? 0;
  console.log(`[verify] GraphQL products=${productsCount} business_stats_current=${statsCount}`);
}

async function main() {
  config({ path: ".env.local" });

  const supabaseUrl = requiredEnv("NEXT_PUBLIC_SUPABASE_URL");
  const supabaseKey = requiredEnv("SUPABASE_SERVICE_ROLE_KEY");
  const nhostDbUrl = requiredEnv("NHOST_DATABASE_URL");

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const sql = postgres(nhostDbUrl, {
    ssl: "require",
    max: 1,
    connect_timeout: 15,
    idle_timeout: 20,
  });

  try {
    console.log("[sync] fetching rows from Supabase...");
    const [products, stats] = await Promise.all([
      fetchAllRows<ProductRow>(supabase, "products"),
      fetchAllRows<BusinessStatsRow>(supabase, "business_stats_current"),
    ]);
    console.log(`[sync] products=${products.length} business_stats_current=${stats.length}`);

    const productPayload = products.map((row) => ({
      id: row.id,
      category_id: row.category_id,
      series: row.series ?? null,
      name: row.name,
      slug: row.slug,
      description: row.description ?? null,
      images: row.images ?? [],
      flagship_image: row.flagship_image ?? null,
      map_layout: row.map_layout ?? null,
      features: row.features ?? [],
      finishes: row.finishes ?? [],
      metadata: row.metadata ?? {},
      specs: row.specs ?? {},
      series_id: row.series_id ?? null,
      series_name: row.series_name ?? null,
      created_at: row.created_at ?? new Date().toISOString(),
      alt_text: row.alt_text ?? null,
    }));

    const statsPayload = stats.map((row) => ({
      id: row.id,
      projects_delivered: Number(row.projects_delivered) || 0,
      client_organisations: Number(row.client_organisations) || 0,
      sectors_served: Number(row.sectors_served) || 0,
      locations_served: Number(row.locations_served) || 0,
      years_experience: Number(row.years_experience) || 0,
      as_of_date: row.as_of_date,
      is_active: Boolean(row.is_active),
      updated_at: row.updated_at ?? null,
    }));

    await sql.begin(async (tx) => {
      await tx`
        create extension if not exists pgcrypto;
      `;

      await tx`
        create table if not exists public.products (
          id uuid primary key default gen_random_uuid(),
          category_id text not null,
          series text,
          name text not null,
          slug text not null unique,
          description text,
          images jsonb not null default '[]'::jsonb,
          flagship_image text,
          map_layout text,
          features jsonb not null default '[]'::jsonb,
          finishes jsonb not null default '[]'::jsonb,
          metadata jsonb not null default '{}'::jsonb,
          specs jsonb not null default '{}'::jsonb,
          series_id text,
          series_name text,
          created_at timestamptz not null default now(),
          alt_text text
        );
      `;

      await tx`
        create index if not exists idx_products_category_id on public.products(category_id);
      `;
      await tx`
        create index if not exists idx_products_name on public.products(name);
      `;

      await tx`
        create table if not exists public.business_stats_current (
          id uuid primary key default gen_random_uuid(),
          projects_delivered int not null default 0,
          client_organisations int not null default 0,
          sectors_served int not null default 0,
          locations_served int not null default 0,
          years_experience int not null default 0,
          as_of_date date not null,
          is_active boolean not null default true,
          updated_at timestamptz not null default now()
        );
      `;

      await tx`
        create unique index if not exists ux_business_stats_active_true
        on public.business_stats_current ((is_active))
        where is_active = true;
      `;

      await tx`truncate table public.products;`;
      if (productPayload.length > 0) {
        await tx`
          insert into public.products ${tx(productPayload, [
            "id",
            "category_id",
            "series",
            "name",
            "slug",
            "description",
            "images",
            "flagship_image",
            "map_layout",
            "features",
            "finishes",
            "metadata",
            "specs",
            "series_id",
            "series_name",
            "created_at",
            "alt_text",
          ])};
        `;
      }

      await tx`truncate table public.business_stats_current;`;
      if (statsPayload.length > 0) {
        await tx`
          insert into public.business_stats_current ${tx(statsPayload, [
            "id",
            "projects_delivered",
            "client_organisations",
            "sectors_served",
            "locations_served",
            "years_experience",
            "as_of_date",
            "is_active",
            "updated_at",
          ])};
        `;
      }
    });

    const productCountResult =
      await sql`select count(*)::int as count from public.products;`;
    const statsCountResult =
      await sql`select count(*)::int as count from public.business_stats_current;`;
    const nhostProducts = productCountResult[0]?.count ?? 0;
    const nhostStats = statsCountResult[0]?.count ?? 0;
    console.log(`[sync] Nhost rows products=${nhostProducts} business_stats_current=${nhostStats}`);

    await verifyNhostGraphql();
    console.log("[sync] completed successfully");
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
