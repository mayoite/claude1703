import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type JsonObject = Record<string, unknown>;

type CanonicalCategory =
  | "seating"
  | "workstations"
  | "tables"
  | "storages"
  | "soft-seating"
  | "education";

type ProductRow = {
  id: string;
  slug: string | null;
  name: string | null;
  category_id: string | null;
  category: string | null;
  metadata: JsonObject | null;
};

type CategoryRow = {
  id: string;
  name: string;
  description: string | null;
};

type ProductBackup = {
  id: string;
  slug: string | null;
  oldCategoryId: string | null;
  newCategoryId: CanonicalCategory;
  oldCategory: string | null;
  newCategory: CanonicalCategory;
  oldMetadata: JsonObject;
  newMetadata: JsonObject;
};

type BackupPayload = {
  migrationId: string;
  createdAt: string;
  source: "supabase-category-canonical-v1";
  categorySnapshot: CategoryRow[];
  totalScanned: number;
  totalChanged: number;
  products: ProductBackup[];
};

const LEGACY_TO_CANONICAL: Record<string, CanonicalCategory> = {
  seating: "seating",
  "oando-seating": "seating",
  "oando-chairs": "seating",
  "oando-other-seating": "seating",
  "chairs-mesh": "seating",
  "chairs-others": "seating",
  "cafe-seating": "seating",
  "others-2": "seating",

  workstations: "workstations",
  "oando-workstations": "workstations",

  tables: "tables",
  "oando-tables": "tables",
  "desks-cabin-tables": "tables",
  "meeting-conference-tables": "tables",

  storages: "storages",
  storage: "storages",
  "oando-storage": "storages",

  "soft-seating": "soft-seating",
  collaborative: "soft-seating",
  "oando-soft-seating": "soft-seating",
  "oando-collaborative": "soft-seating",
  "others-1": "soft-seating",

  education: "education",
  educational: "education",
  "oando-educational": "education",
};

const CATEGORY_LABELS: Record<CanonicalCategory, string> = {
  seating: "Seating",
  workstations: "Workstations",
  tables: "Tables",
  storages: "Storages",
  "soft-seating": "Soft Seating",
  education: "Education",
};

const CATEGORY_DESCRIPTIONS: Record<CanonicalCategory, string> = {
  seating: "Task, visitor, and executive seating collections.",
  workstations: "Panel and desking workstation systems.",
  tables: "Meeting, cabin, and cafe table collections.",
  storages: "Metal, prelam, and compactor storage systems.",
  "soft-seating": "Lounge and collaborative soft seating.",
  education: "Classroom, library, hostel, and auditorium furniture.",
};

const CANONICAL_ORDER: CanonicalCategory[] = [
  "seating",
  "workstations",
  "tables",
  "storages",
  "soft-seating",
  "education",
];

function normalizeKey(input: unknown): string {
  return String(input ?? "")
    .trim()
    .toLowerCase();
}

function toMetadata(input: unknown): JsonObject {
  if (!input || typeof input !== "object" || Array.isArray(input)) return {};
  return { ...(input as JsonObject) };
}

function migrationId(): string {
  const now = new Date();
  const stamp = now
    .toISOString()
    .replace(/[-:.TZ]/g, "")
    .slice(0, 14);
  return `category-canonical-${stamp}`;
}

function getCanonicalCategory(row: ProductRow): CanonicalCategory {
  const direct = LEGACY_TO_CANONICAL[normalizeKey(row.category_id)];
  if (direct) return direct;

  const fallback = LEGACY_TO_CANONICAL[normalizeKey(row.category)];
  if (fallback) return fallback;

  const metaCategory = LEGACY_TO_CANONICAL[normalizeKey(row.metadata?.category)];
  if (metaCategory) return metaCategory;

  return "seating";
}

async function readAllProducts(supabase: SupabaseClient): Promise<ProductRow[]> {
  const pageSize = 1000;
  const rows: ProductRow[] = [];

  for (let from = 0; ; from += pageSize) {
    const to = from + pageSize - 1;
    const { data, error } = await supabase
      .from("products")
      .select("id, slug, name, category_id, category, metadata")
      .range(from, to);

    if (error) {
      throw new Error(`Failed reading products range ${from}-${to}: ${error.message}`);
    }

    if (!data || data.length === 0) break;
    rows.push(...(data as ProductRow[]));
    if (data.length < pageSize) break;
  }

  return rows;
}

async function readCategories(supabase: SupabaseClient): Promise<CategoryRow[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, description")
    .order("id");

  if (error) {
    throw new Error(`Failed reading categories: ${error.message}`);
  }

  return (data ?? []) as CategoryRow[];
}

async function upsertCanonicalCategories(supabase: SupabaseClient) {
  const payload = CANONICAL_ORDER.map((id) => ({
    id,
    name: CATEGORY_LABELS[id],
    description: CATEGORY_DESCRIPTIONS[id],
  }));

  const { error } = await supabase.from("categories").upsert(payload, { onConflict: "id" });
  if (error) {
    throw new Error(`Failed upserting canonical categories: ${error.message}`);
  }
}

async function removeNonCanonicalCategories(supabase: SupabaseClient) {
  const categories = await readCategories(supabase);
  const ids = categories
    .map((row) => row.id)
    .filter((id): id is string => Boolean(id) && !CANONICAL_ORDER.includes(id as CanonicalCategory));
  if (ids.length === 0) return;

  const { error: deleteError } = await supabase.from("categories").delete().in("id", ids);
  if (deleteError) {
    throw new Error(`Failed deleting non-canonical categories: ${deleteError.message}`);
  }
}

async function applyMigration(dryRun = false) {
  dotenv.config({ path: ".env.local" });
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const [products, categorySnapshot] = await Promise.all([
    readAllProducts(supabase),
    readCategories(supabase),
  ]);

  const changedProducts: ProductBackup[] = [];

  for (const row of products) {
    const canonical = getCanonicalCategory(row);
    const oldMetadata = toMetadata(row.metadata);
    const newMetadata: JsonObject = {
      ...oldMetadata,
      category: CATEGORY_LABELS[canonical],
    };

    const needsUpdate =
      row.category_id !== canonical ||
      row.category !== canonical ||
      oldMetadata.category !== newMetadata.category;

    if (!needsUpdate) continue;

    changedProducts.push({
      id: row.id,
      slug: row.slug,
      oldCategoryId: row.category_id,
      newCategoryId: canonical,
      oldCategory: row.category,
      newCategory: canonical,
      oldMetadata,
      newMetadata,
    });
  }

  const backup: BackupPayload = {
    migrationId: migrationId(),
    createdAt: new Date().toISOString(),
    source: "supabase-category-canonical-v1",
    categorySnapshot,
    totalScanned: products.length,
    totalChanged: changedProducts.length,
    products: changedProducts,
  };

  const backupDir = path.join(process.cwd(), "docs", "migrations", "backups");
  fs.mkdirSync(backupDir, { recursive: true });
  const backupPath = path.join(backupDir, `${backup.migrationId}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2), "utf8");

  if (dryRun) {
    console.log(`DRY RUN complete. Scanned=${products.length} Changed=${changedProducts.length}`);
    console.log(`Backup written: ${backupPath}`);
    return;
  }

  await upsertCanonicalCategories(supabase);

  let updated = 0;
  for (const record of changedProducts) {
    const { error } = await supabase
      .from("products")
      .update({
        category_id: record.newCategoryId,
        category: record.newCategory,
        metadata: record.newMetadata,
      })
      .eq("id", record.id);

    if (error) {
      throw new Error(`Failed updating product ${record.id} (${record.slug}): ${error.message}`);
    }

    updated += 1;
  }

  await removeNonCanonicalCategories(supabase);

  console.log(`Migration applied. Scanned=${products.length} Updated=${updated}`);
  console.log(`Backup written: ${backupPath}`);
}

function usage() {
  console.log("Usage:");
  console.log("  npx tsx scripts/redo_supabase_categories.ts --apply [--dry-run]");
}

async function main() {
  const args = process.argv.slice(2);
  const apply = args.includes("--apply");
  const dryRun = args.includes("--dry-run");

  if (!apply) {
    usage();
    throw new Error("Missing --apply");
  }

  await applyMigration(dryRun);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
