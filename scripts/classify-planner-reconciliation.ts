import path from "node:path";
import { promises as fs } from "node:fs";

type ReconcileItem = {
  key: string;
  id: string;
  sourceSlug?: string;
  name: string;
  plannerCategoryId?: string;
};

type ReconciliationPayload = {
  onlyInStatic: ReconcileItem[];
  onlyInSupabase: ReconcileItem[];
};

function isUtilitySeed(item: ReconcileItem): boolean {
  return !item.sourceSlug;
}

function isLikelyVariantOrAlias(item: ReconcileItem): boolean {
  const key = `${item.key} ${item.id} ${item.name}`.toLowerCase();
  return (
    /\b\d{2,4}\b/.test(key) ||
    key.includes("executive") ||
    key.includes("meeting") ||
    key.includes("study") ||
    key.includes("conference") ||
    key.includes("l-shape") ||
    key.includes("seater") ||
    key.includes("task") ||
    key.includes("drawer")
  );
}

function isLikelyCategoryMappingIssue(item: ReconcileItem): boolean {
  return item.plannerCategoryId === "misc";
}

function summarize(items: ReconcileItem[]) {
  return items.reduce<Record<string, number>>((acc, item) => {
    const key = item.plannerCategoryId || "unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

async function main() {
  const rootDir = process.cwd();
  const inputPath = path.join(rootDir, "output", "planner-catalog-reconciliation.json");
  const outputPath = path.join(rootDir, "output", "planner-catalog-reconciliation-actions.json");
  const raw = await fs.readFile(inputPath, "utf8");
  const payload = JSON.parse(raw) as ReconciliationPayload;

  const staticUtilitySeeds = payload.onlyInStatic.filter(isUtilitySeed);
  const staticAfcBackedMissingFromSupabase = payload.onlyInStatic.filter(
    (item) => !isUtilitySeed(item),
  );
  const supabaseCategoryMappingIssues = payload.onlyInSupabase.filter(
    isLikelyCategoryMappingIssue,
  );
  const supabaseVariantsOrAliases = payload.onlyInSupabase.filter(
    (item) => !isLikelyCategoryMappingIssue(item) && isLikelyVariantOrAlias(item),
  );
  const supabaseNetNewCatalog = payload.onlyInSupabase.filter(
    (item) =>
      !isLikelyCategoryMappingIssue(item) && !isLikelyVariantOrAlias(item),
  );

  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      staticUtilitySeedsCount: staticUtilitySeeds.length,
      staticAfcBackedMissingFromSupabaseCount: staticAfcBackedMissingFromSupabase.length,
      supabaseCategoryMappingIssuesCount: supabaseCategoryMappingIssues.length,
      supabaseVariantsOrAliasesCount: supabaseVariantsOrAliases.length,
      supabaseNetNewCatalogCount: supabaseNetNewCatalog.length,
      staticCategoryBreakdown: summarize(payload.onlyInStatic),
      supabaseCategoryBreakdown: summarize(payload.onlyInSupabase),
    },
    actions: {
      staticUtilitySeeds,
      staticAfcBackedMissingFromSupabase,
      supabaseCategoryMappingIssues,
      supabaseVariantsOrAliases,
      supabaseNetNewCatalog,
    },
  };

  await fs.writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(
    `Classified reconciliation actions. Utility seeds: ${staticUtilitySeeds.length}. AFC-backed static gaps: ${staticAfcBackedMissingFromSupabase.length}.`,
  );
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[planner:catalog:classify] ${message}`);
  process.exitCode = 1;
});
