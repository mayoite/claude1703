import path from "node:path";
import { promises as fs } from "node:fs";
import { AFC_PLANNER_GAP_ALIAS_MAP } from "../data/planner/afcPlannerGapResolutions";

type PlannerItem = {
  id?: string;
  name?: string;
  sourceSlug?: string;
  plannerCategoryId?: string;
};

type CatalogPayload = {
  items?: PlannerItem[];
};

async function readJson<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

function toKey(item: PlannerItem): string {
  return item.sourceSlug || item.id || "";
}

function toSummary(item: PlannerItem) {
  return {
    key: toKey(item),
    id: item.id || "",
    sourceSlug: item.sourceSlug || "",
    name: item.name || "",
    plannerCategoryId: item.plannerCategoryId || "",
  };
}

function resolveKey(key: string): string {
  return AFC_PLANNER_GAP_ALIAS_MAP[key] || key;
}

async function main() {
  const rootDir = process.cwd();
  const staticPath = path.join(
    rootDir,
    "public",
    "planner-app",
    "data",
    "planner-catalog.baseline.v1.json",
  );
  const supabasePath = path.join(rootDir, "output", "planner-supabase-preview.json");
  const outputPath = path.join(rootDir, "output", "planner-catalog-reconciliation.json");

  const staticCatalog = await readJson<CatalogPayload>(staticPath);
  const supabaseCatalog = await readJson<CatalogPayload>(supabasePath);
  const staticItems = Array.isArray(staticCatalog.items) ? staticCatalog.items : [];
  const supabaseItems = Array.isArray(supabaseCatalog.items) ? supabaseCatalog.items : [];

  const staticMap = new Map(staticItems.map((item) => [toKey(item), item]).filter(([key]) => key));
  const supabaseMap = new Map(supabaseItems.map((item) => [toKey(item), item]).filter(([key]) => key));

  const onlyInStatic = [...staticMap.keys()]
    .filter((key) => !supabaseMap.has(key) && !supabaseMap.has(resolveKey(key)))
    .map((key) => toSummary(staticMap.get(key)!))
    .sort((a, b) => a.key.localeCompare(b.key));

  const onlyInSupabase = [...supabaseMap.keys()]
    .filter((key) => !staticMap.has(key))
    .map((key) => toSummary(supabaseMap.get(key)!))
    .sort((a, b) => a.key.localeCompare(b.key));

  const shared = [...staticMap.keys()].filter((key) => supabaseMap.has(key)).length;

  const payload = {
    generatedAt: new Date().toISOString(),
    staticItemCount: staticItems.length,
    supabaseItemCount: supabaseItems.length,
    sharedItemCount: shared,
    onlyInStaticCount: onlyInStatic.length,
    onlyInSupabaseCount: onlyInSupabase.length,
    onlyInStatic,
    onlyInSupabase,
  };

  await fs.writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(
    `Reconciled planner catalogs. Static-only: ${onlyInStatic.length}. Supabase-only: ${onlyInSupabase.length}.`,
  );
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[planner:catalog:reconcile] ${message}`);
  process.exitCode = 1;
});
