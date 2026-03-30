import path from "node:path";
import { promises as fs } from "node:fs";

type PlannerItem = {
  id?: string;
  sourceSlug?: string;
  name?: string;
  plannerCategoryId?: string;
};

type CatalogPayload = {
  items?: PlannerItem[];
};

type ActionPayload = {
  actions?: {
    staticUtilitySeeds?: PlannerItem[];
    staticAfcBackedMissingFromSupabase?: PlannerItem[];
  };
};

function toKey(item: PlannerItem): string {
  return item.id || item.sourceSlug || "";
}

async function readJson<T>(filePath: string): Promise<T> {
  return JSON.parse(await fs.readFile(filePath, "utf8")) as T;
}

async function main() {
  const rootDir = process.cwd();
  const staticCatalogPath = path.join(
    rootDir,
    "public",
    "planner-app",
    "data",
    "planner-catalog.baseline.v1.json",
  );
  const supabasePreviewPath = path.join(rootDir, "output", "planner-supabase-preview.json");
  const actionsPath = path.join(rootDir, "output", "planner-catalog-reconciliation-actions.json");
  const outputPath = path.join(rootDir, "output", "planner-runtime-candidate.json");

  const staticCatalog = await readJson<CatalogPayload>(staticCatalogPath);
  const supabasePreview = await readJson<CatalogPayload>(supabasePreviewPath);
  const actions = await readJson<ActionPayload>(actionsPath);

  const staticItems = Array.isArray(staticCatalog.items) ? staticCatalog.items : [];
  const supabaseItems = Array.isArray(supabasePreview.items) ? supabasePreview.items : [];
  const utilityKeys = new Set(
    (actions.actions?.staticUtilitySeeds || []).map((item) => toKey(item)).filter(Boolean),
  );
  const staticAfcGapKeys = new Set(
    (actions.actions?.staticAfcBackedMissingFromSupabase || [])
      .map((item) => toKey(item))
      .filter(Boolean),
  );

  const utilitySeedItems = staticItems.filter((item) => utilityKeys.has(toKey(item)));
  const mergedItems = [...supabaseItems, ...utilitySeedItems];
  const uniqueMergedItems = Array.from(
    new Map(mergedItems.map((item) => [toKey(item), item]).filter(([key]) => key)).values(),
  );

  const payload = {
    generatedAt: new Date().toISOString(),
    source: {
      supabasePreview: "output/planner-supabase-preview.json",
      staticCatalog: "public/planner-app/data/planner-catalog.baseline.v1.json",
      actions: "output/planner-catalog-reconciliation-actions.json",
    },
    counts: {
      supabaseItems: supabaseItems.length,
      utilitySeedItems: utilitySeedItems.length,
      mergedCandidateItems: uniqueMergedItems.length,
      remainingStaticAfcGapItems: staticAfcGapKeys.size,
    },
    remainingStaticAfcGapKeys: [...staticAfcGapKeys].sort(),
    items: uniqueMergedItems,
  };

  await fs.writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(
    `Built planner runtime candidate with ${uniqueMergedItems.length} items (${utilitySeedItems.length} utility seeds + ${supabaseItems.length} Supabase items).`,
  );
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[planner:runtime:candidate] ${message}`);
  process.exitCode = 1;
});
