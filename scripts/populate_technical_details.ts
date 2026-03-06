import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

type JsonRecord = Record<string, unknown>;

type ProductRow = {
  id: string;
  slug: string | null;
  specs: JsonRecord | null;
  metadata: JsonRecord | null;
};

function toRecord(input: unknown): JsonRecord {
  if (!input || typeof input !== "object" || Array.isArray(input)) return {};
  return { ...(input as JsonRecord) };
}

function isBlank(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "string") return value.trim() === "";
  return false;
}

function setIfMissing(target: JsonRecord, key: string, value: unknown) {
  if (isBlank(value)) return;
  if (!isBlank(target[key])) return;
  target[key] = value;
}

function normalizeArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => String(item || "").trim())
    .filter(Boolean);
}

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !serviceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY/NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase
    .from("products")
    .select("id, slug, specs, metadata");
  if (error) throw new Error(`Read failed: ${error.message}`);

  const rows = (data ?? []) as ProductRow[];
  let updated = 0;

  for (const row of rows) {
    const specs = toRecord(row.specs);
    const metadata = toRecord(row.metadata);

    const useCases = normalizeArray(metadata.useCase);
    const materials = normalizeArray(metadata.material);
    const tags = normalizeArray(metadata.tags);

    setIfMissing(specs, "subcategory", metadata.subcategory);
    setIfMissing(specs, "category", metadata.category);
    setIfMissing(specs, "warranty_years", metadata.warrantyYears);
    setIfMissing(specs, "price_range", metadata.priceRange);
    setIfMissing(specs, "use_case", useCases.length > 0 ? useCases : undefined);
    setIfMissing(specs, "material_options", materials.length > 0 ? materials : undefined);
    setIfMissing(specs, "bifma_certified", metadata.bifmaCertified);
    setIfMissing(specs, "source", metadata.source);
    setIfMissing(specs, "tags", tags.length > 0 ? tags : undefined);

    const changed =
      JSON.stringify(specs) !== JSON.stringify(toRecord(row.specs));
    if (!changed) continue;

    const { error: updateError } = await supabase
      .from("products")
      .update({ specs })
      .eq("id", row.id);
    if (updateError) {
      throw new Error(
        `Update failed for id=${row.id} slug=${row.slug}: ${updateError.message}`,
      );
    }
    updated += 1;
  }

  console.log(`Products scanned=${rows.length} updated=${updated}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
