import { LIBRARY, ROOM_PRESETS, createId } from "@/lib/planner/catalog";
import type {
  PlannerItem,
  PlannerProduct,
  RoomPreset,
  VariantDefinition,
} from "@/lib/planner/types";

export const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function formatDimension(value: number, unitSystem: "metric" | "imperial" = "metric") {
  if (unitSystem === "imperial") {
    return `${(value / 304.8).toFixed(1)} ft`;
  }

  return `${(value / 1000).toFixed(1)} m`;
}

export function getProduct(productId: string) {
  return LIBRARY.find((item) => item.id === productId);
}

export function getVariant(productId: string, variantId: string) {
  return getProduct(productId)?.variants.find((variant) => variant.id === variantId);
}

export function getVariantArea(variant: VariantDefinition) {
  return variant.widthMm * variant.depthMm;
}

export function getItemDimensions(item: PlannerItem) {
  const variant = getVariant(item.productId, item.variantId);

  if (!variant) {
    return { widthMm: 0, depthMm: 0, heightMm: 0, seatCount: 0, unitCount: 0 };
  }

  const widthMm = item.rotation === 90 ? variant.depthMm : variant.widthMm;
  const depthMm = item.rotation === 90 ? variant.widthMm : variant.depthMm;

  return {
    widthMm,
    depthMm,
    heightMm: variant.heightMm,
    seatCount: variant.seatCount ?? 0,
    unitCount: variant.unitCount ?? 0,
  };
}

export function rectanglesOverlap(
  a: { xMm: number; yMm: number; widthMm: number; depthMm: number },
  b: { xMm: number; yMm: number; widthMm: number; depthMm: number },
  paddingMm = 0,
) {
  return !(
    a.xMm + a.widthMm + paddingMm <= b.xMm ||
    b.xMm + b.widthMm + paddingMm <= a.xMm ||
    a.yMm + a.depthMm + paddingMm <= b.yMm ||
    b.yMm + b.depthMm + paddingMm <= a.yMm
  );
}

export function createPlannerItem(
  productId: string,
  variantId: string,
  xMm: number,
  yMm: number,
  finish: string,
  rotation: 0 | 90 = 0,
  mirrored = false,
): PlannerItem {
  return {
    id: createId(productId),
    productId,
    variantId,
    finish,
    xMm,
    yMm,
    rotation,
    mirrored,
  };
}

export function buildSeededWorkstations(targetSeats: number) {
  const benches = Math.max(1, Math.ceil(targetSeats / 4));
  const items: PlannerItem[] = [];

  for (let index = 0; index < benches; index += 1) {
    const column = index % 2;
    const row = Math.floor(index / 2);
    items.push(
      createPlannerItem(
        "linear-sharing",
        "ls-4-2400-1200",
        1000 + column * 2600,
        900 + row * 1400,
        "Warm Oak",
      ), // 2400 × 1200 — 4-seat sharing pod
    );
  }

  return items;
}

export function createSceneFromPreset(presetId: string) {
  const preset = ROOM_PRESETS.find((item) => item.id === presetId) ?? ROOM_PRESETS[0];
  const items = buildSeededWorkstations(preset.seatTarget);

  if (presetId === "compact-studio") {
    items.splice(0, items.length);
    items.push(createPlannerItem("linear-sharing", "ls-4-2400-1200", 900, 950, "Warm Oak"));
    items.push(createPlannerItem("meeting-table", "mt-1800-900", 4700, 1200, "Light Maple"));
    items.push(createPlannerItem("storage-unit", "st-900-750-h1200", 6100, 3600, "Matte White", 90));
  }

  if (presetId === "client-floor") {
    items.push(createPlannerItem("meeting-table", "mt-2400-1200", 8100, 2200, "Warm Oak", 90));
    items.push(createPlannerItem("storage-unit", "st-1050-750-h750", 10400, 600, "Light Maple"));
    items.push(createPlannerItem("meeting-table", "mt-1800-900", 8000, 5400, "Matte White"));
  }

  if (presetId === "boardroom-plus") {
    items.splice(0, items.length);
    items.push(createPlannerItem("meeting-table", "mt-3600-1200", 2900, 2100, "Warm Oak"));
    items.push(createPlannerItem("storage-unit", "st-900-750-h1200", 7600, 1200, "Light Maple", 90));
    items.push(createPlannerItem("linear-non-sharing", "lns-2-2400-750", 1100, 4700, "Matte White"));
  }

  return {
    room: preset.room,
    openings: preset.openings,
    items,
    seatTarget: preset.seatTarget,
  };
}

export function getPreset(presetId: string): RoomPreset {
  return ROOM_PRESETS.find((item) => item.id === presetId) ?? ROOM_PRESETS[0];
}

export function getActiveProducts(category: PlannerProduct["category"]) {
  return LIBRARY.filter((product) => product.category === category);
}
