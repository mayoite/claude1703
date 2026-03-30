export const PLANNER_CATEGORY_ORDER = [
  "Workstations",
  "Seating",
  "Openings",
  "Tables",
  "Storage",
  "Screens & AV",
  "Kitchen",
  "Infrastructure",
  "Misc",
] as const;

export type PlannerCategoryLabel = (typeof PLANNER_CATEGORY_ORDER)[number];

export const PLANNER_CATEGORY_IDS_BY_LABEL: Record<PlannerCategoryLabel, string> = {
  Workstations: "workstations",
  Seating: "seating",
  Openings: "openings",
  Tables: "tables",
  Storage: "storage",
  "Screens & AV": "screens-av",
  Kitchen: "kitchen",
  Infrastructure: "infrastructure",
  Misc: "misc",
};

export const PLANNER_SUBCATEGORY_IDS_BY_LABEL: Record<string, string> = {
  "Desking Series": "desking",
  "Height Adjustable Series": "height-adjustable",
  "Panel Series": "panel-systems",
  "Cabin Tables": "cabin-tables",
  "Meeting Tables": "meeting-tables",
  Classroom: "classroom",
  "Training Tables": "training-tables",
  "Cafe Tables": "cafe-tables",
  "Mesh Chair": "mesh-chair",
  "Leather Chair": "leather-chair",
  "Training Chair": "training-chair",
  "Cafe Chair": "cafe-chair",
  Lounge: "lounge",
  Sofa: "sofa",
  "Occasional Tables": "occasional-tables",
  "Prelam Storage": "prelam-storage",
  "Metal Storage": "metal-storage",
  Locker: "locker",
  "Compactor Storage": "compactor-storage",
  Library: "library",
  Openings: "openings",
  Kitchen: "kitchen",
  Infrastructure: "infrastructure",
  Auditorium: "auditorium",
  Hostel: "hostel",
  "Screens & AV": "screens-av",
  Misc: "misc",
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

type RawPlannerItem = {
  category?: unknown;
  categoryLabel?: unknown;
  categoryId?: unknown;
  subcategoryLabel?: unknown;
  slug?: unknown;
  shape?: unknown;
  renderStyle?: unknown;
};

function toText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function routeExternalCategory(candidate: string, subcategoryLabel: string): PlannerCategoryLabel | null {
  if (candidate === "Soft Seating") return "Seating";

  if (candidate === "Educational") {
    if (subcategoryLabel === "Classroom") return "Tables";
    if (subcategoryLabel === "Auditorium") return "Seating";
    if (subcategoryLabel === "Library") return "Storage";
  }

  return null;
}

function routeCanonicalCategoryId(candidate: string): PlannerCategoryLabel | null {
  switch (candidate) {
    case "workstations":
      return "Workstations";
    case "seating":
      return "Seating";
    case "tables":
      return "Tables";
    case "storages":
    case "storage":
      return "Storage";
    case "soft-seating":
      return "Seating";
    case "education":
    case "educational":
      return null;
    default:
      return null;
  }
}

function routeSlugPattern(slug: string, subcategoryLabel: string): PlannerCategoryLabel | null {
  if (slug.startsWith("seating-")) return "Seating";
  if (slug.startsWith("storages-")) return "Storage";
  if (slug.startsWith("tables-")) return "Tables";
  if (slug.startsWith("soft-seating-")) return "Seating";
  if (slug.startsWith("education-") || slug.startsWith("educational-")) {
    return routeExternalCategory("Educational", subcategoryLabel);
  }
  return null;
}

export function getPlannerCategoryLabel(item: RawPlannerItem): PlannerCategoryLabel {
  const subcategoryLabel = toText(item.subcategoryLabel);
  const candidate = toText(item.categoryLabel) || toText(item.category);
  const routed = routeExternalCategory(candidate, subcategoryLabel);
  if (routed) return routed;
  const canonicalRouted = routeCanonicalCategoryId(toText(item.categoryId) || slugify(candidate));
  if (canonicalRouted) return canonicalRouted;
  const slugRouted = routeSlugPattern(toText(item.slug), subcategoryLabel);
  if (slugRouted) return slugRouted;
  return (PLANNER_CATEGORY_ORDER.includes(candidate as PlannerCategoryLabel)
    ? candidate
    : "Misc") as PlannerCategoryLabel;
}

export function getPlannerCategoryId(item: RawPlannerItem): string {
  return PLANNER_CATEGORY_IDS_BY_LABEL[getPlannerCategoryLabel(item)];
}

export function getPlannerCategoryOrder(item: RawPlannerItem): number {
  return PLANNER_CATEGORY_ORDER.indexOf(getPlannerCategoryLabel(item));
}

export function getPlannerSubcategoryId(item: RawPlannerItem): string {
  const subcategoryLabel = toText(item.subcategoryLabel);
  if (!subcategoryLabel) return "general";
  return PLANNER_SUBCATEGORY_IDS_BY_LABEL[subcategoryLabel] || slugify(subcategoryLabel);
}

export function getPlannerPhase(item: RawPlannerItem): "phase-1-office" | "extended" {
  return PHASE_ONE_CATEGORY_IDS.has(getPlannerCategoryId(item))
    ? "phase-1-office"
    : "extended";
}

export function getPlannerRenderStyle(item: RawPlannerItem): string {
  const renderStyle = toText(item.renderStyle);
  if (renderStyle) return renderStyle;

  const categoryId = getPlannerCategoryId(item);
  if (categoryId === "workstations") return "photographic-office";
  if (categoryId === "seating") return "photographic-seating";
  if (categoryId === "tables") return "photographic-table";
  if (categoryId === "storage") return "photographic-storage";
  return "utility";
}

export function getPlannerShape(item: RawPlannerItem): string {
  const shape = toText(item.shape);
  if (shape) return shape;

  const categoryId = getPlannerCategoryId(item);
  if (categoryId === "seating") return "chair";
  if (categoryId === "tables" || categoryId === "workstations") return "desk";
  if (categoryId === "storage") return "storage";
  return "utility";
}
