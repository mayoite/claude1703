import path from "node:path";
import { promises as fs } from "node:fs";
import dotenv from "dotenv";
import { createSupabaseAdminClient } from "../lib/supabaseAdmin";
import {
  PLANNER_CATEGORY_IDS_BY_LABEL,
  PLANNER_CATEGORY_ORDER,
  getPlannerCategoryId,
  getPlannerCategoryLabel,
  getPlannerCategoryOrder,
  getPlannerPhase,
  getPlannerRenderStyle,
  getPlannerShape,
  getPlannerSubcategoryId,
} from "../data/planner/afcPlannerNormalization";

type UnknownRecord = Record<string, unknown>;

type SupabaseProductRow = {
  id: string;
  name: string;
  slug?: string | null;
  description?: string | null;
  category_id?: string | null;
  category?: string | null;
  series_name?: string | null;
  flagship_image?: string | null;
  images?: string[] | null;
  scene_images?: string[] | null;
  variants?: Array<{ galleryImages?: string[] | null }> | null;
  specs?: UnknownRecord | null;
  detailed_info?: UnknownRecord | null;
  metadata?: UnknownRecord | null;
  alt_text?: string | null;
  sourceImages?: string[] | null;
  sourceDocs?: Array<string | UnknownRecord> | null;
  sourceCertifications?: string[] | null;
};

type PlannerBaselineItem = {
  id?: string;
  sourceSlug?: string;
  variant?: string;
  name?: string;
  category?: string;
  categoryLabel?: string;
  plannerCategoryId?: string;
  plannerSubcategoryId?: string;
  width?: number;
  depth?: number;
  height?: number;
  shape?: string;
  renderStyle?: string;
  topView?: string;
  color?: string;
};

type PlannerBaselinePayload = {
  items?: PlannerBaselineItem[];
};

type PlannerBaselineCollections = {
  itemMap: Map<string, PlannerBaselineItem>;
  variantsBySourceSlug: Map<string, PlannerBaselineItem[]>;
};

type AfcAuditLookup = Map<string, SupabaseProductRow>;

type PlannerDocEntry = {
  title?: string;
  url?: string;
};

type PlannerOverviewPair = {
  heading?: string;
  body?: string;
};

type PlannerSpecSection = {
  heading?: string;
  lines?: string[];
};

const PHASE_ONE_CATEGORY_IDS = new Set<string>([
  "workstations",
  "seating",
  "tables",
  "storage",
  "openings",
  "screens-av",
  "misc",
]);

const PLANNER_CATEGORY_LABEL_BY_ID = Object.fromEntries(
  Object.entries(PLANNER_CATEGORY_IDS_BY_LABEL).map(([label, id]) => [id, label]),
) as Record<string, string>;

const ACCESSORY_PATTERNS = [
  { label: "Cable management", pattern: /cable/i },
  { label: "Memory presets", pattern: /memory preset|controller/i },
  { label: "Safety stop", pattern: /safety/i },
  { label: "Acoustic divider", pattern: /divider/i },
  { label: "Planter box", pattern: /planter/i },
  { label: "Mobile pedestal", pattern: /pedestal/i },
  { label: "Storage tray", pattern: /storage|shelf|drawer/i },
  { label: "Levelling feet", pattern: /levelling feet|leveling feet|adjustable feet/i },
] as const;

function loadEnv() {
  dotenv.config({ path: ".env.local", override: false });
  dotenv.config({ path: ".env", override: false });
}

function toText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function toObject(value: unknown): UnknownRecord {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as UnknownRecord;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => toText(entry)).filter(Boolean);
}

function toUniqueStringArray(values: unknown[]): string[] {
  return [...new Set(values.map((value) => toText(value)).filter(Boolean))];
}

function toOverviewPairs(value: unknown): PlannerOverviewPair[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => {
      const item = toObject(entry);
      return {
        heading: toText(item.heading),
        body: toText(item.body),
      };
    })
    .filter((entry) => entry.heading || entry.body);
}

function toSpecSections(value: unknown): PlannerSpecSection[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => {
      const item = toObject(entry);
      return {
        heading: toText(item.heading),
        lines: toStringArray(item.lines),
      };
    })
    .filter((entry) => entry.heading || (entry.lines?.length ?? 0) > 0);
}

function toDocEntries(documents: unknown, titles?: unknown): PlannerDocEntry[] {
  const docList = Array.isArray(documents) ? documents : [];
  const titleList = toStringArray(titles);

  return docList
    .map((entry, index) => {
      if (typeof entry === "string") {
        const url = toText(entry);
        return {
          title: titleList[index],
          url,
        };
      }

      const item = toObject(entry);
      return {
        title: toText(item.title) || titleList[index],
        url: toText(item.url) || toText(item.href),
      };
    })
    .filter((entry) => entry.url);
}

function normalizeMeasurement(value: number): number {
  if (!Number.isFinite(value) || value <= 0) return 0;
  return value > 250 ? Number((value / 10).toFixed(1)) : Number(value.toFixed(1));
}

function extractNumbers(value: string): number[] {
  return [...value.matchAll(/\d+(?:\.\d+)?/g)].map((match) => Number(match[0]));
}

function pickDimensionFromLines(lines: string[], prefixes: string[]): number {
  for (const line of lines) {
    const normalizedLine = line.trim().toUpperCase();
    if (!prefixes.some((prefix) => normalizedLine.startsWith(prefix))) continue;
    const measurementSource =
      normalizedLine.includes("-")
        ? normalizedLine.split("-").slice(1).join("-")
        : normalizedLine.includes(":")
          ? normalizedLine.split(":").slice(1).join(":")
          : normalizedLine;
    const firstValue = extractNumbers(measurementSource)[0];
    if (Number.isFinite(firstValue) && firstValue > 0) {
      return normalizeMeasurement(firstValue);
    }
  }

  return 0;
}

function pickDimensionFromText(value: string, prefixes: string[]): number {
  const parts = value
    .split(/[;,]/)
    .map((entry) => entry.trim())
    .filter(Boolean);
  return pickDimensionFromLines(parts, prefixes);
}

function pickDimensionCandidates(lines: string[], prefixes: string[]): number[] {
  const values: number[] = [];

  for (const line of lines) {
    const normalizedLine = line.trim().toUpperCase();
    if (!prefixes.some((prefix) => normalizedLine.startsWith(prefix))) continue;
    const measurementSource =
      normalizedLine.includes("-")
        ? normalizedLine.split("-").slice(1).join("-")
        : normalizedLine.includes(":")
          ? normalizedLine.split(":").slice(1).join(":")
          : normalizedLine;
    values.push(
      ...extractNumbers(measurementSource)
        .map(normalizeMeasurement)
        .filter((value) => value > 0),
    );
  }

  return [...new Set(values)].sort((a, b) => a - b);
}

function matchesMeasurement(candidate: number, target: number): boolean {
  return Math.abs(candidate - target) <= 1;
}

function getSectionLines(section: PlannerSpecSection): string[] {
  return Array.isArray(section.lines) ? section.lines.map((line) => toText(line)).filter(Boolean) : [];
}

function getSectionDimensionCandidates(
  section: PlannerSpecSection,
  prefixes: string[],
): number[] {
  return pickDimensionCandidates(getSectionLines(section), prefixes);
}

function filterVariantSpecSections(
  sections: PlannerSpecSection[],
  width: number,
  depth: number,
): PlannerSpecSection[] {
  const exactMatches = sections.filter((section) => {
    const widths = getSectionDimensionCandidates(section, ["L1", "W"]);
    const depths = getSectionDimensionCandidates(section, ["D1", "D"]);
    const widthMatch = !widths.length || widths.some((value) => matchesMeasurement(value, width));
    const depthMatch = !depths.length || depths.some((value) => matchesMeasurement(value, depth));
    return widthMatch && depthMatch;
  });

  if (exactMatches.length) return exactMatches;

  const widthMatches = sections.filter((section) => {
    const widths = getSectionDimensionCandidates(section, ["L1", "W"]);
    return !widths.length || widths.some((value) => matchesMeasurement(value, width));
  });

  return widthMatches.length ? widthMatches : sections;
}

function resolveVariantDepth(
  sections: PlannerSpecSection[],
  width: number,
  fallbackDepth: number,
): number {
  const matchingSections = filterVariantSpecSections(sections, width, fallbackDepth);
  const depthCandidates = [
    ...new Set(
      matchingSections.flatMap((section) => getSectionDimensionCandidates(section, ["D1", "D"])),
    ),
  ].sort((left, right) => left - right);

  if (!depthCandidates.length) return fallbackDepth;
  if (depthCandidates.some((value) => matchesMeasurement(value, fallbackDepth))) {
    return fallbackDepth;
  }

  return depthCandidates[0] || fallbackDepth;
}

function extractAccessories(
  overviewPairs: PlannerOverviewPair[],
  features: string[],
): string[] {
  const sourceText = [
    ...features,
    ...overviewPairs.flatMap((pair) => [pair.heading, pair.body]),
  ]
    .join(" ")
    .trim();

  if (!sourceText) return [];

  return ACCESSORY_PATTERNS.filter(({ pattern }) => pattern.test(sourceText))
    .map(({ label }) => label)
    .slice(0, 6);
}

function deriveFootprint(row: SupabaseProductRow) {
  const specs = toObject(row.specs);
  const detailedInfo = toObject(row.detailed_info);
  const dimensionSections = Array.isArray(specs.dimension_sections)
    ? specs.dimension_sections
    : [];

  const sectionLines = dimensionSections.flatMap((section) => {
    if (!section || typeof section !== "object" || Array.isArray(section)) return [];
    const lines = (section as UnknownRecord).lines;
    return Array.isArray(lines) ? lines.map((line) => toText(line)).filter(Boolean) : [];
  });

  const dimensionText = toText(specs.dimensions) || toText(detailedInfo.dimensions);

  const width =
    pickDimensionFromLines(sectionLines, ["L1", "W"]) ||
    pickDimensionFromText(dimensionText, ["L1", "W"]) ||
    120;
  const depth =
    pickDimensionFromLines(sectionLines, ["D1", "D"]) ||
    pickDimensionFromText(dimensionText, ["D1", "D"]) ||
    60;
  const height =
    pickDimensionFromLines(sectionLines, ["HT", "H"]) ||
    pickDimensionFromText(dimensionText, ["HT", "H"]) ||
    75;

  return { width, depth, height };
}

function getDimensionSectionLines(row: SupabaseProductRow): string[] {
  const specs = toObject(row.specs);
  const dimensionSections = Array.isArray(specs.dimension_sections)
    ? specs.dimension_sections
    : [];

  return dimensionSections.flatMap((section) => {
    if (!section || typeof section !== "object" || Array.isArray(section)) return [];
    const lines = (section as UnknownRecord).lines;
    return Array.isArray(lines) ? lines.map((line) => toText(line)).filter(Boolean) : [];
  });
}

function getVariantWidthsAndDepths(row: SupabaseProductRow) {
  const lines = getDimensionSectionLines(row);
  const widths = pickDimensionCandidates(lines, ["L1", "W"]).filter((value) => value >= 90 && value <= 400);
  const depths = pickDimensionCandidates(lines, ["D1", "D"]).filter((value) => value >= 40 && value <= 200);
  return {
    widths,
    depths,
  };
}

function shouldGenerateSizeVariants(categoryId: string): boolean {
  return categoryId === "workstations" || categoryId === "tables";
}

function getSourceSlug(row: SupabaseProductRow): string {
  const slug = toText(row.slug);
  if (slug) {
    const slugTail = slug.split("--").pop() || slug;
    if (slugTail) return slugTail;
  }

  const metadata = toObject(row.metadata);
  const sourceSlug = toText(metadata.sourceSlug);
  if (sourceSlug) return sourceSlug;

  return row.id;
}

function getBaselineKey(item: { id?: string | null; sourceSlug?: string | null }): string {
  return toText(item.sourceSlug) || toText(item.id);
}

async function loadPlannerBaselineCollections(): Promise<PlannerBaselineCollections> {
  const baselinePath = path.join(
    process.cwd(),
    "public",
    "planner-app",
    "data",
    "planner-catalog.baseline.v1.json",
  );
  const baselineRaw = await fs.readFile(baselinePath, "utf8");
  const baselinePayload = JSON.parse(baselineRaw) as PlannerBaselinePayload;
  const baselineItems = Array.isArray(baselinePayload.items) ? baselinePayload.items : [];
  const itemMap = new Map<string, PlannerBaselineItem>();
  const variantsBySourceSlug = new Map<string, PlannerBaselineItem[]>();

  for (const item of baselineItems) {
    const key = getBaselineKey(item);
    if (!key) continue;
    itemMap.set(key, item);

    const sourceSlug = toText(item.sourceSlug);
    if (!sourceSlug) continue;
    const variants = variantsBySourceSlug.get(sourceSlug) || [];
    variants.push(item);
    variantsBySourceSlug.set(sourceSlug, variants);
  }

  return { itemMap, variantsBySourceSlug };
}

async function loadAfcAuditLookup(): Promise<AfcAuditLookup> {
  const lookup = new Map<string, SupabaseProductRow>();
  const auditPath = path.join(
    process.cwd(),
    "docs",
    "audit",
    "afc-sync-report-dry-run-offset-0-limit-all-2026-03-15.json",
  );

  try {
    const auditRaw = await fs.readFile(auditPath, "utf8");
    const auditPayload = JSON.parse(auditRaw) as {
      matched?: SupabaseProductRow[];
    };
    const auditRows = Array.isArray(auditPayload.matched) ? auditPayload.matched : [];

    for (const row of auditRows) {
      const slug = toText(row.slug);
      const sourceSlug = getSourceSlug(row);
      const slugTail = slug.split("--").pop() || slug;

      for (const key of [row.id, sourceSlug, slug, slugTail]) {
        const normalizedKey = toText(key);
        if (!normalizedKey) continue;
        lookup.set(normalizedKey, row);
      }
    }
  } catch {
    return lookup;
  }

  return lookup;
}

function toPlannerCategorySnapshot(categoryId: string, fallbackLabel: string) {
  const categoryLabel = PLANNER_CATEGORY_LABEL_BY_ID[categoryId] || fallbackLabel || "Misc";
  return {
    categoryId,
    categoryLabel,
    categoryOrder: Math.max(PLANNER_CATEGORY_ORDER.indexOf(categoryLabel as never), 0),
    phase: PHASE_ONE_CATEGORY_IDS.has(categoryId) ? "phase-1-office" : "extended",
  } as const;
}

function applyBaselineCompatibility(
  item: Record<string, unknown>,
  baseline: PlannerBaselineItem | undefined,
  options?: { preserveWidth?: boolean; preserveDepth?: boolean; preserveHeight?: boolean },
) {
  if (!baseline) return item;

  const baselineCategoryId = toText(baseline.plannerCategoryId) || toText(item.plannerCategoryId);
  const baselineCategoryLabel =
    toText(baseline.categoryLabel) || toText(baseline.category) || toText(item.categoryLabel);
  const categorySnapshot = toPlannerCategorySnapshot(baselineCategoryId, baselineCategoryLabel);

  return {
    ...item,
    name:
      toText(baseline.name) &&
      (!options?.preserveWidth || Number(item.width) === Number(baseline.width))
        ? baseline.name
        : item.name,
    category: categorySnapshot.categoryLabel,
    categoryLabel: categorySnapshot.categoryLabel,
    plannerCategoryId: categorySnapshot.categoryId,
    plannerCategoryOrder: categorySnapshot.categoryOrder,
    plannerPhase: categorySnapshot.phase,
    plannerSubcategoryId: toText(baseline.plannerSubcategoryId) || item.plannerSubcategoryId,
    shape: toText(baseline.shape) || item.shape,
    renderStyle: toText(baseline.renderStyle) || item.renderStyle,
    topView: toText(baseline.topView) || item.topView,
    color: toText(baseline.color) || item.color,
    width:
      options?.preserveWidth || !Number.isFinite(Number(baseline.width))
        ? item.width
        : baseline.width,
    depth:
      options?.preserveDepth || !Number.isFinite(Number(baseline.depth))
        ? item.depth
        : baseline.depth,
    height:
      options?.preserveHeight || !Number.isFinite(Number(baseline.height))
        ? item.height
        : baseline.height,
  };
}

function toPlannerPreviewItems(
  row: SupabaseProductRow,
  baselineCollections: PlannerBaselineCollections,
  afcAuditLookup: AfcAuditLookup,
) {
  const sourceSlug = getSourceSlug(row);
  const auditRow =
    afcAuditLookup.get(sourceSlug) ||
    afcAuditLookup.get(row.id) ||
    afcAuditLookup.get(toText(row.slug));
  const mergedRow = {
    ...auditRow,
    ...row,
    images:
      toStringArray(row.images).length > 0
        ? row.images
        : auditRow?.images,
    sourceImages:
      toStringArray(row.sourceImages).length > 0
        ? row.sourceImages
        : auditRow?.sourceImages,
    sourceDocs:
      Array.isArray(row.sourceDocs) && row.sourceDocs.length > 0
        ? row.sourceDocs
        : auditRow?.sourceDocs,
    sourceCertifications:
      toStringArray(row.sourceCertifications).length > 0
        ? row.sourceCertifications
        : auditRow?.sourceCertifications,
    specs: {
      ...toObject(auditRow?.specs),
      ...toObject(row.specs),
    },
    detailed_info: {
      ...toObject(auditRow?.detailed_info),
      ...toObject(row.detailed_info),
    },
    metadata: {
      ...toObject(auditRow?.metadata),
      ...toObject(row.metadata),
    },
  } satisfies SupabaseProductRow;
  const metadata = toObject(mergedRow.metadata);
  const specs = toObject(mergedRow.specs);
  const detailedInfo = toObject(mergedRow.detailed_info);
  const baseline =
    baselineCollections.itemMap.get(sourceSlug) || baselineCollections.itemMap.get(row.id);
  const plannerRaw = {
    category:
      toText(metadata.category) || toText(mergedRow.category) || toText(mergedRow.category_id),
    categoryLabel: toText(metadata.category) || toText(mergedRow.category),
    categoryId: toText(metadata.categoryIdCanonical) || toText(row.category_id),
    subcategoryLabel:
      toText(metadata.subcategoryLabel) ||
      toText(metadata.subcategory) ||
      toText(specs.subcategory) ||
      toText(mergedRow.series_name),
    slug: toText(mergedRow.slug),
    renderStyle: toText(metadata.renderStyle),
    shape: toText(metadata.shape),
  };
  const footprint = deriveFootprint(mergedRow);
  const plannerCategoryId = getPlannerCategoryId(plannerRaw);
  const overviewPairs = toOverviewPairs(specs.overview_sections);
  const allSpecSections = toSpecSections(specs.dimension_sections);
  const materialOptions = toUniqueStringArray([
    ...toStringArray(detailedInfo.materials),
    ...toStringArray(specs.materials),
    ...toStringArray(metadata.material),
  ]);
  const finishOptions = toUniqueStringArray(toStringArray(specs.finish_options));
  const docs = [
    ...toDocEntries(specs.documents, specs.document_titles),
    ...toDocEntries(mergedRow.sourceDocs),
  ].filter((entry, index, entries) => {
    const key = `${entry.url}::${entry.title || ""}`;
    return entries.findIndex((candidate) => `${candidate.url}::${candidate.title || ""}` === key) === index;
  });
  const certifications = toUniqueStringArray([
    ...toStringArray(specs.certifications),
    ...toStringArray(metadata.certifications),
    ...toStringArray(mergedRow.sourceCertifications),
  ]);
  const galleryImages = [
    ...toStringArray(mergedRow.images),
    ...toStringArray(mergedRow.scene_images),
    ...toStringArray(mergedRow.sourceImages),
    ...toStringArray(
      Array.isArray(row.variants)
        ? row.variants.flatMap((variant) => toStringArray(variant.galleryImages))
        : [],
    ),
  ];

  const baseItem = {
    id: sourceSlug,
    sourceProductId: row.id,
    name: row.name,
    family: row.name,
    category: getPlannerCategoryLabel(plannerRaw),
    categoryLabel: getPlannerCategoryLabel(plannerRaw),
    subcategoryLabel: toText(plannerRaw.subcategoryLabel) || "General",
    series: toText(mergedRow.series_name) || toText(plannerRaw.subcategoryLabel) || "General",
    variant: sourceSlug,
    sourceSlug,
    sourceUrl: `https://www.afcindia.in/products/${sourceSlug}`,
    imageUrl: toText(mergedRow.flagship_image) || galleryImages[0] || "",
    heroImageUrl: toText(mergedRow.flagship_image) || galleryImages[0] || "",
    galleryImages: [...new Set(galleryImages)].filter(Boolean),
    materials: materialOptions,
    accessories: extractAccessories(overviewPairs, toStringArray(specs.features)),
    finishOptions,
    certifications,
    docs,
    spec: toText(mergedRow.description),
    width: footprint.width,
    depth: footprint.depth,
    height: footprint.height,
    color: "#8a97a7",
    shape: getPlannerShape(plannerRaw),
    renderStyle: getPlannerRenderStyle(plannerRaw),
    topView: "rect",
    plannerCategoryId,
    plannerCategoryOrder: getPlannerCategoryOrder(plannerRaw),
    plannerSubcategoryId: getPlannerSubcategoryId(plannerRaw),
    plannerPhase: getPlannerPhase(plannerRaw),
    overviewPairs,
    specSections: allSpecSections,
    altText: toText(mergedRow.alt_text),
  };
  const compatibleBaseItem = applyBaselineCompatibility(baseItem, baseline);

  if (!shouldGenerateSizeVariants(plannerCategoryId)) {
    return [compatibleBaseItem];
  }

  const { widths, depths } = getVariantWidthsAndDepths(row);
  if (!widths.length) {
    return [compatibleBaseItem];
  }

  const fallbackDepth = Number(compatibleBaseItem.depth) || depths[0] || footprint.depth;
  const generatedItems = widths.slice(0, 8).map((width) =>
    {
      const variantDepth = resolveVariantDepth(allSpecSections, width, fallbackDepth);
      const variantSpecSections = filterVariantSpecSections(allSpecSections, width, variantDepth);
      return applyBaselineCompatibility(
        {
          ...compatibleBaseItem,
          id: `${sourceSlug}-${Math.round(width)}`,
          name: `${row.name} ${Math.round(width)}`,
          variant: `${sourceSlug}-${Math.round(width)}`,
          width,
          depth: variantDepth,
          specSections: variantSpecSections,
        },
        baseline,
        { preserveWidth: true, preserveDepth: true },
      );
    },
  );

  const existingWidths = new Set(
    generatedItems.map((item) => Number(item.width)).filter((value) => Number.isFinite(value)),
  );
  const baselineFallbackItems = (baselineCollections.variantsBySourceSlug.get(sourceSlug) || [])
    .filter((item) => item.id && item.id !== sourceSlug)
    .filter((item) => Number.isFinite(Number(item.width)))
    .filter((item) => !existingWidths.has(Number(item.width)))
    .map((item) =>
      applyBaselineCompatibility(
        {
          ...compatibleBaseItem,
          id: toText(item.id) || `${sourceSlug}-${Math.round(Number(item.width))}`,
          name: toText(item.name) || `${row.name} ${Math.round(Number(item.width))}`,
          variant: toText(item.variant) || toText(item.id) || `${sourceSlug}-${Math.round(Number(item.width))}`,
          width: Number(item.width),
          depth: Number(item.depth) || compatibleBaseItem.depth,
          height: Number(item.height) || compatibleBaseItem.height,
          specSections: filterVariantSpecSections(
            allSpecSections,
            Number(item.width) || Number(compatibleBaseItem.width) || footprint.width,
            Number(item.depth) || Number(compatibleBaseItem.depth) || footprint.depth,
          ),
        },
        item,
        { preserveWidth: true, preserveDepth: true },
      ),
    );

  return [...generatedItems, ...baselineFallbackItems].sort(
    (left, right) => Number(left.width) - Number(right.width),
  );
}

async function writeJson(filePath: string, payload: unknown) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

async function main() {
  loadEnv();
  const baselineCollections = await loadPlannerBaselineCollections();
  const afcAuditLookup = await loadAfcAuditLookup();
  const client = createSupabaseAdminClient();
  const { data, error } = await client
    .from("products")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []) as SupabaseProductRow[];
  const items = rows.flatMap((row) =>
    toPlannerPreviewItems(row, baselineCollections, afcAuditLookup),
  );
  const generatedAt = new Date().toISOString();
  const payload = {
    version: "supabase-preview-v1",
    generatedAt,
    source: "supabase.products",
    itemCount: items.length,
    phaseOneItemCount: items.filter((item) => item.plannerPhase === "phase-1-office").length,
    items,
  };

  const outputPath = path.join(
    process.cwd(),
    "output",
    "planner-supabase-preview.json",
  );

  await writeJson(outputPath, payload);
  console.log(
    `Exported ${items.length} planner preview items from Supabase to ${outputPath}.`,
  );
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[planner:catalog:supabase-preview] ${message}`);
  process.exitCode = 1;
});
