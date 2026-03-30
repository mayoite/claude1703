import path from "node:path";
import vm from "node:vm";
import { promises as fs } from "node:fs";
import {
  getPlannerCategoryId,
  getPlannerCategoryLabel,
  getPlannerCategoryOrder,
  getPlannerPhase,
  getPlannerRenderStyle,
  getPlannerShape,
  getPlannerSubcategoryId,
} from "../data/planner/afcPlannerNormalization";

type UnknownRecord = Record<string, unknown>;

type PlannerDoc = {
  title: string;
  href: string;
};

type PlannerCatalogItem = UnknownRecord & {
  id: string;
  name: string;
  category: string;
  width: number;
  depth: number;
  height: number;
  galleryImages?: string[];
  materials?: string[];
  docs?: PlannerDoc[];
  keywords?: string[];
  certifications?: string[];
  optionTags?: string[];
};

function toText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function toNumber(value: unknown, fieldName: string, itemId: string): number {
  const numericValue =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : Number.NaN;

  if (!Number.isFinite(numericValue)) {
    throw new Error(`Invalid numeric field "${fieldName}" for planner item "${itemId}".`);
  }

  return numericValue;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => toText(entry)).filter(Boolean);
}

function toDocs(value: unknown): PlannerDoc[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((entry) => {
      if (!entry || typeof entry !== "object" || Array.isArray(entry)) return null;
      const doc = entry as UnknownRecord;
      const title = toText(doc.title);
      const href = toText(doc.href);
      if (!title || !href) return null;
      return { title, href };
    })
    .filter((entry): entry is PlannerDoc => Boolean(entry));
}

function normalizeItem(entry: unknown, index: number): PlannerCatalogItem {
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
    throw new Error(`Planner catalog entry ${index + 1} is not an object.`);
  }

  const raw = entry as UnknownRecord;
  const id = toText(raw.id);
  const name = toText(raw.name);
  const category = toText(raw.category);

  if (!id || !name || !category) {
    throw new Error(`Planner catalog entry ${index + 1} is missing id, name, or category.`);
  }

  return {
    ...raw,
    id,
    name,
    category: getPlannerCategoryLabel(raw),
    width: toNumber(raw.width, "width", id),
    depth: toNumber(raw.depth, "depth", id),
    height: toNumber(raw.height, "height", id),
    galleryImages: toStringArray(raw.galleryImages),
    materials: toStringArray(raw.materials),
    docs: toDocs(raw.docs),
    keywords: toStringArray(raw.keywords),
    certifications: toStringArray(raw.certifications),
    optionTags: toStringArray(raw.optionTags),
    plannerCategoryId: getPlannerCategoryId(raw),
    plannerCategoryOrder: getPlannerCategoryOrder(raw),
    plannerSubcategoryId: getPlannerSubcategoryId(raw),
    plannerPhase: getPlannerPhase(raw),
    renderStyle: getPlannerRenderStyle(raw),
    shape: getPlannerShape(raw),
  };
}

async function loadPlannerCatalog(sourcePath: string): Promise<PlannerCatalogItem[]> {
  const sourceCode = await fs.readFile(sourcePath, "utf8");
  const sandbox: { window: { furnitureLibrary?: unknown } } = { window: {} };

  vm.createContext(sandbox);
  vm.runInContext(sourceCode, sandbox, { filename: sourcePath });

  const rawCatalog = sandbox.window.furnitureLibrary;
  if (!Array.isArray(rawCatalog)) {
    throw new Error("Planner source did not assign an array to window.furnitureLibrary.");
  }

  const normalized = rawCatalog.map(normalizeItem);
  const uniqueIds = new Set<string>();

  for (const item of normalized) {
    if (uniqueIds.has(item.id)) {
      throw new Error(`Duplicate planner item id found: "${item.id}".`);
    }
    uniqueIds.add(item.id);
  }

  return normalized;
}

async function writeFile(filePath: string, contents: string) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, contents, "utf8");
}

async function main() {
  const rootDir = process.cwd();
  const sourcePath = path.join(rootDir, "public", "planner-app", "furniture-library.js");
  const generatedJsPath = path.join(
    rootDir,
    "public",
    "planner-app",
    "planner-catalog.baseline.generated.js",
  );
  const generatedJsonPath = path.join(
    rootDir,
    "public",
    "planner-app",
    "data",
    "planner-catalog.baseline.v1.json",
  );
  const manifestPath = path.join(
    rootDir,
    "public",
    "planner-app",
    "data",
    "planner-catalog.baseline.manifest.json",
  );

  const items = await loadPlannerCatalog(sourcePath);
  const generatedAt = new Date().toISOString();
  const manifest = {
    version: "v1",
    generatedAt,
    source: "public/planner-app/furniture-library.js",
    itemCount: items.length,
    categoryCount: [...new Set(items.map((item) => item.category))].length,
    phaseOneItemCount: items.filter((item) => item.plannerPhase === "phase-1-office").length,
  };

  await writeFile(
    generatedJsonPath,
    `${JSON.stringify({ ...manifest, items }, null, 2)}\n`,
  );

  await writeFile(
    manifestPath,
    `${JSON.stringify(manifest, null, 2)}\n`,
  );

  await writeFile(
    generatedJsPath,
    `// Generated by scripts/build-planner-catalog-export.ts\n(function () {\n  window.furnitureLibrary = ${JSON.stringify(items, null, 2)};\n  window.furnitureLibraryMeta = ${JSON.stringify(manifest, null, 2)};\n})();\n`,
  );

  console.log(
    `Generated planner catalog baseline with ${items.length} items across ${manifest.categoryCount} categories.`,
  );
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[planner:catalog:build] ${message}`);
  process.exitCode = 1;
});
