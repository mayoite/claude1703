export type PlannerCategory =
  | "workstations"
  | "meeting-tables"
  | "chairs"
  | "storages"
  | "other-items";

export type QueryAction =
  | "what-fits"
  | "increase-seats"
  | "reduce-footprint"
  | "premium"
  | "lower-budget"
  | "compare-similar";

export type VariantDefinition = {
  id: string;
  label: string;
  widthMm: number;
  depthMm: number;
  heightMm: number;
  footprintShape?:
    | "rectangle"
    | "l-shape"
    | "linear-shared"
    | "linear-non-sharing"
    | "sofa";
  seatCount?: number;
  unitCount?: number;
  priceInr: number;
  notes: string;
  modelUrl?: string;
};

export type PlannerProduct = {
  id: string;
  name: string;
  category: PlannerCategory;
  family: string;
  description: string;
  image: string;
  href: string;
  finishes: string[];
  tags: string[];
  variants: VariantDefinition[];
};

export type PlannerItem = {
  id: string;
  productId: string;
  variantId: string;
  finish: string;
  xMm: number;
  yMm: number;
  rotation: 0 | 90;
  mirrored?: boolean;
};

export type Opening = {
  id: string;
  type: "door" | "double-door" | "window";
  edge: "top" | "right" | "bottom" | "left";
  offsetMm: number;
  widthMm: number;
  hinge?: "start" | "end";
};

export type RoomState = {
  name: string;
  widthMm: number;
  depthMm: number;
  clearanceMm: number;
};

export type RoomPreset = {
  id: string;
  title: string;
  description: string;
  room: RoomState;
  seatTarget: number;
  openings: Opening[];
};

export type QuerySuggestion = {
  productId: string;
  variantId: string;
  badge: string;
  reason: string;
  canFit: boolean;
};
