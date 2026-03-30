import path from "node:path";
import { promises as fs } from "node:fs";

type Mismatch = {
  key: string;
  issues: string[];
  static: {
    id: string;
    name: string;
    plannerCategoryId: string;
    width?: number;
    depth?: number;
    height?: number;
  };
  supabase: {
    id: string;
    name: string;
    plannerCategoryId: string;
    width?: number;
    depth?: number;
    height?: number;
  };
};

type MismatchPayload = {
  mismatches?: Mismatch[];
};

function numeric(value: unknown): number {
  return typeof value === "number" ? value : Number(value);
}

function isVariantCompression(item: Mismatch): boolean {
  const widthDelta = Math.abs(numeric(item.static.width) - numeric(item.supabase.width));
  const depthDelta = Math.abs(numeric(item.static.depth) - numeric(item.supabase.depth));
  const numericNameHint = /\b\d{2,4}\b/.test(item.static.name);

  return (
    !item.issues.includes("plannerCategoryId") &&
    (numericNameHint || widthDelta >= 20 || depthDelta >= 20)
  );
}

function isCategoryConflict(item: Mismatch): boolean {
  return item.issues.includes("plannerCategoryId");
}

function isNamingDrift(item: Mismatch): boolean {
  return item.issues.includes("name") && !isVariantCompression(item) && !isCategoryConflict(item);
}

async function main() {
  const rootDir = process.cwd();
  const inputPath = path.join(rootDir, "output", "planner-shared-mismatches.json");
  const outputPath = path.join(rootDir, "output", "planner-shared-mismatch-actions.json");
  const payload = JSON.parse(await fs.readFile(inputPath, "utf8")) as MismatchPayload;
  const mismatches = Array.isArray(payload.mismatches) ? payload.mismatches : [];

  const categoryConflicts = mismatches.filter(isCategoryConflict);
  const variantCompression = mismatches.filter(
    (item) => !isCategoryConflict(item) && isVariantCompression(item),
  );
  const namingDrift = mismatches.filter(
    (item) => !isCategoryConflict(item) && !isVariantCompression(item) && isNamingDrift(item),
  );
  const other = mismatches.filter(
    (item) =>
      !isCategoryConflict(item) &&
      !isVariantCompression(item) &&
      !isNamingDrift(item),
  );

  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      mismatchCount: mismatches.length,
      categoryConflictCount: categoryConflicts.length,
      variantCompressionCount: variantCompression.length,
      namingDriftCount: namingDrift.length,
      otherCount: other.length,
    },
    actions: {
      categoryConflicts,
      variantCompression,
      namingDrift,
      other,
    },
  };

  await fs.writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(
    `Classified shared mismatches. Variant compression: ${variantCompression.length}. Category conflicts: ${categoryConflicts.length}.`,
  );
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[planner:catalog:mismatch-classify] ${message}`);
  process.exitCode = 1;
});
