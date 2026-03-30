import path from "node:path";
import { promises as fs } from "node:fs";

type PlannerItem = {
  id?: string;
  sourceSlug?: string;
  name?: string;
  plannerCategoryId?: string;
  width?: number;
  depth?: number;
  height?: number;
};

type CatalogPayload = {
  items?: PlannerItem[];
};

function toKey(item: PlannerItem): string {
  return item.sourceSlug || item.id || "";
}

function numericValue(value: unknown): number {
  return typeof value === "number" ? value : Number(value);
}

function numericDiff(a: unknown, b: unknown): number {
  const left = numericValue(a);
  const right = numericValue(b);
  if (!Number.isFinite(left) || !Number.isFinite(right)) return Number.NaN;
  return Math.abs(left - right);
}

function scoreCandidate(staticItem: PlannerItem, supabaseItem: PlannerItem): number {
  const widthDiff = numericDiff(staticItem.width, supabaseItem.width);
  const depthDiff = numericDiff(staticItem.depth, supabaseItem.depth);
  const heightDiff = numericDiff(staticItem.height, supabaseItem.height);
  const categoryPenalty =
    (staticItem.plannerCategoryId || "") === (supabaseItem.plannerCategoryId || "") ? 0 : 500;
  const namePenalty = (staticItem.name || "") === (supabaseItem.name || "") ? 0 : 50;

  return (
    categoryPenalty +
    namePenalty +
    (Number.isFinite(widthDiff) ? widthDiff : 100) +
    (Number.isFinite(depthDiff) ? depthDiff : 100) +
    (Number.isFinite(heightDiff) ? heightDiff : 100)
  );
}

function pickBestSupabaseCandidate(staticItem: PlannerItem, candidates: PlannerItem[]): PlannerItem {
  return candidates.reduce((best, candidate) =>
    scoreCandidate(staticItem, candidate) < scoreCandidate(staticItem, best) ? candidate : best,
  );
}

async function readJson<T>(filePath: string): Promise<T> {
  return JSON.parse(await fs.readFile(filePath, "utf8")) as T;
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
  const outputPath = path.join(rootDir, "output", "planner-shared-mismatches.json");

  const staticCatalog = await readJson<CatalogPayload>(staticPath);
  const supabaseCatalog = await readJson<CatalogPayload>(supabasePath);
  const staticMap = new Map(
    (Array.isArray(staticCatalog.items) ? staticCatalog.items : [])
      .map((item) => [toKey(item), item])
      .filter(([key]) => key),
  );
  const supabaseBuckets = (Array.isArray(supabaseCatalog.items) ? supabaseCatalog.items : []).reduce(
    (bucketMap, item) => {
      const key = toKey(item);
      if (!key) return bucketMap;
      const current = bucketMap.get(key) || [];
      current.push(item);
      bucketMap.set(key, current);
      return bucketMap;
    },
    new Map<string, PlannerItem[]>(),
  );

  const mismatches = [...staticMap.keys()]
    .filter((key) => supabaseBuckets.has(key))
    .map((key) => {
      const staticItem = staticMap.get(key)!;
      const supabaseItem = pickBestSupabaseCandidate(staticItem, supabaseBuckets.get(key)!);
      const issues: string[] = [];

      if ((staticItem.plannerCategoryId || "") !== (supabaseItem.plannerCategoryId || "")) {
        issues.push("plannerCategoryId");
      }
      if ((staticItem.name || "") !== (supabaseItem.name || "")) {
        issues.push("name");
      }
      if (numericDiff(staticItem.width, supabaseItem.width) > 20) {
        issues.push("width");
      }
      if (numericDiff(staticItem.depth, supabaseItem.depth) > 20) {
        issues.push("depth");
      }
      if (numericDiff(staticItem.height, supabaseItem.height) > 20) {
        issues.push("height");
      }

      if (!issues.length) return null;

      return {
        key,
        issues,
        static: {
          id: staticItem.id || "",
          name: staticItem.name || "",
          plannerCategoryId: staticItem.plannerCategoryId || "",
          width: staticItem.width,
          depth: staticItem.depth,
          height: staticItem.height,
        },
        supabase: {
          id: supabaseItem.id || "",
          name: supabaseItem.name || "",
          plannerCategoryId: supabaseItem.plannerCategoryId || "",
          width: supabaseItem.width,
          depth: supabaseItem.depth,
          height: supabaseItem.height,
        },
      };
    })
    .filter(Boolean);

  const payload = {
    generatedAt: new Date().toISOString(),
    mismatchCount: mismatches.length,
    mismatches,
  };

  await fs.writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`Reported ${mismatches.length} shared planner mismatches.`);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[planner:catalog:mismatches] ${message}`);
  process.exitCode = 1;
});
