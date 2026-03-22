import type {
  Opening,
  PlannerCategory,
  PlannerProduct,
  QueryAction,
  RoomPreset,
} from "@/lib/planner/types";

export const WORK_SURFACE_HEIGHT_MM = 750;
const WORK_SURFACE_CATEGORIES: PlannerCategory[] = ["workstations", "meeting-tables"];

export const CATEGORY_META: Record<
  PlannerCategory,
  { label: string; fill: string; stroke: string; route: string }
> = {
  workstations: {
    label: "Workstations",
    fill: "#F2DFA0",
    stroke: "#A07820",
    route: "/products/workstations",
  },
  "meeting-tables": {
    label: "Meeting Tables",
    fill: "#C8DDB8",
    stroke: "#5A8040",
    route: "/products/tables",
  },
  chairs: {
    label: "Seating",
    fill: "#8A8A8A",
    stroke: "#444444",
    route: "/products/seating",
  },
  storages: {
    label: "Storages",
    fill: "#D8D8D8",
    stroke: "#999999",
    route: "/products/storages",
  },
  "other-items": {
    label: "Other Items",
    fill: "#B8D4E8",
    stroke: "#5A8AAA",
    route: "/products",
  },
};

export const QUERY_ACTIONS: Array<{ id: QueryAction; label: string }> = [
  { id: "what-fits", label: "What fits here?" },
  { id: "increase-seats", label: "Increase seats" },
  { id: "reduce-footprint", label: "Reduce footprint" },
  { id: "premium", label: "Show premium options" },
  { id: "lower-budget", label: "Show lower-budget options" },
  { id: "compare-similar", label: "Compare similar" },
];

export const ROOM_PRESETS: RoomPreset[] = [
  {
    id: "compact-studio",
    title: "Starter Office",
    description: "An 8 x 6 starter office with one workstation pod and a compact collaboration zone.",
    room: {
      name: "Starter office",
      widthMm: 8000,
      depthMm: 6000,
      clearanceMm: 900,
    },
    seatTarget: 4,
    openings: [
      { id: "door-compact", type: "door", edge: "bottom", offsetMm: 1700, widthMm: 1100 },
      { id: "window-compact", type: "window", edge: "top", offsetMm: 1800, widthMm: 1800 },
    ],
  },
  {
    id: "client-floor",
    title: "Client Floor",
    description: "A broader planning floor for hybrid teams, meetings, and storage zones.",
    room: {
      name: "Client floor",
      widthMm: 14000,
      depthMm: 9000,
      clearanceMm: 1000,
    },
    seatTarget: 28,
    openings: [
      { id: "door-client", type: "door", edge: "left", offsetMm: 2500, widthMm: 1200 },
      { id: "window-client", type: "window", edge: "top", offsetMm: 7200, widthMm: 2600 },
    ],
  },
  {
    id: "boardroom-plus",
    title: "Boardroom Plus",
    description: "A leadership suite with a meeting table, touchdown points, and support storage.",
    room: {
      name: "Boardroom plus",
      widthMm: 11000,
      depthMm: 7500,
      clearanceMm: 950,
    },
    seatTarget: 14,
    openings: [
      { id: "door-board", type: "door", edge: "right", offsetMm: 2200, widthMm: 1000 },
      { id: "window-board", type: "window", edge: "top", offsetMm: 2200, widthMm: 2000 },
    ],
  },
];

export const LIBRARY: PlannerProduct[] = [
  // ── WORKSTATIONS ────────────────────────────────────────────────────────────
  {
    id: "linear-non-sharing",
    name: "Linear Workstation (Non-Sharing)",
    category: "workstations",
    family: "Linear",
    description: "Single-sided linear bench. Each seat has its own surface; no face-to-face sharing.",
    image: "/images/catalog/oando-workstations--panel-pro/image-1.jpg",
    href: "/products/workstations",
    finishes: ["Warm Oak", "Light Maple", "Matte White"],
    tags: ["Linear", "Non-sharing", "Bench"],
    variants: [
      // 1-seater
      { id: "lns-1-900-600",  label: "1 Seat / 900 × 600",  widthMm: 900,  depthMm: 600, heightMm: 750, footprintShape: "linear-non-sharing", seatCount: 1, priceInr: 38000, notes: "900 mm width, 600 mm depth single-user bench." },
      { id: "lns-1-900-750",  label: "1 Seat / 900 × 750",  widthMm: 900,  depthMm: 750, heightMm: 750, footprintShape: "linear-non-sharing", seatCount: 1, priceInr: 42000, notes: "900 mm width, deeper 750 mm worktop." },
      { id: "lns-1-1200-600", label: "1 Seat / 1200 × 600", widthMm: 1200, depthMm: 600, heightMm: 750, footprintShape: "linear-non-sharing", seatCount: 1, priceInr: 44000, notes: "1200 mm width, 600 mm depth standard bench." },
      { id: "lns-1-1200-750", label: "1 Seat / 1200 × 750", widthMm: 1200, depthMm: 750, heightMm: 750, footprintShape: "linear-non-sharing", seatCount: 1, priceInr: 49000, notes: "1200 mm width, deeper 750 mm worktop." },
      { id: "lns-1-1350-600", label: "1 Seat / 1350 × 600", widthMm: 1350, depthMm: 600, heightMm: 750, footprintShape: "linear-non-sharing", seatCount: 1, priceInr: 47000, notes: "1350 mm width, 600 mm depth." },
      { id: "lns-1-1350-750", label: "1 Seat / 1350 × 750", widthMm: 1350, depthMm: 750, heightMm: 750, footprintShape: "linear-non-sharing", seatCount: 1, priceInr: 52000, notes: "1350 mm width, deeper 750 mm worktop." },
      { id: "lns-1-1500-600", label: "1 Seat / 1500 × 600", widthMm: 1500, depthMm: 600, heightMm: 750, footprintShape: "linear-non-sharing", seatCount: 1, priceInr: 51000, notes: "1500 mm width, 600 mm depth." },
      { id: "lns-1-1500-750", label: "1 Seat / 1500 × 750", widthMm: 1500, depthMm: 750, heightMm: 750, footprintShape: "linear-non-sharing", seatCount: 1, priceInr: 56000, notes: "1500 mm width, deeper 750 mm worktop." },
      // 2-seater (side-by-side)
      { id: "lns-2-1800-600", label: "2 Seat / 1800 × 600", widthMm: 1800, depthMm: 600, heightMm: 750, footprintShape: "linear-non-sharing", seatCount: 2, priceInr: 68000, notes: "2 × 900 mm seats side-by-side, 600 mm depth." },
      { id: "lns-2-1800-750", label: "2 Seat / 1800 × 750", widthMm: 1800, depthMm: 750, heightMm: 750, footprintShape: "linear-non-sharing", seatCount: 2, priceInr: 75000, notes: "2 × 900 mm seats side-by-side, 750 mm depth." },
      { id: "lns-2-2400-600", label: "2 Seat / 2400 × 600", widthMm: 2400, depthMm: 600, heightMm: 750, footprintShape: "linear-non-sharing", seatCount: 2, priceInr: 76000, notes: "2 × 1200 mm seats side-by-side, 600 mm depth." },
      { id: "lns-2-2400-750", label: "2 Seat / 2400 × 750", widthMm: 2400, depthMm: 750, heightMm: 750, footprintShape: "linear-non-sharing", seatCount: 2, priceInr: 84000, notes: "2 × 1200 mm seats side-by-side, 750 mm depth." },
      { id: "lns-2-2700-600", label: "2 Seat / 2700 × 600", widthMm: 2700, depthMm: 600, heightMm: 750, footprintShape: "linear-non-sharing", seatCount: 2, priceInr: 82000, notes: "2 × 1350 mm seats side-by-side, 600 mm depth." },
      { id: "lns-2-3000-600", label: "2 Seat / 3000 × 600", widthMm: 3000, depthMm: 600, heightMm: 750, footprintShape: "linear-non-sharing", seatCount: 2, priceInr: 88000, notes: "2 × 1500 mm seats side-by-side, 600 mm depth." },
      // 4-seater (side-by-side run)
      { id: "lns-4-3600-600", label: "4 Seat / 3600 × 600", widthMm: 3600, depthMm: 600, heightMm: 750, footprintShape: "linear-non-sharing", seatCount: 4, priceInr: 132000, notes: "4 × 900 mm seats side-by-side, 600 mm depth." },
      { id: "lns-4-4800-600", label: "4 Seat / 4800 × 600", widthMm: 4800, depthMm: 600, heightMm: 750, footprintShape: "linear-non-sharing", seatCount: 4, priceInr: 148000, notes: "4 × 1200 mm seats side-by-side, 600 mm depth." },
      { id: "lns-4-6000-600", label: "4 Seat / 6000 × 600", widthMm: 6000, depthMm: 600, heightMm: 750, footprintShape: "linear-non-sharing", seatCount: 4, priceInr: 164000, notes: "4 × 1500 mm seats side-by-side, 600 mm depth." },
    ],
  },
  {
    id: "linear-sharing",
    name: "Linear Workstation (Sharing)",
    category: "workstations",
    family: "Linear",
    description: "Face-to-face bench: seats on both sides of a shared spine. 2-seat = 1 column, 4-seat = 2 columns.",
    image: "/images/catalog/oando-workstations--panel-pro/image-1.jpg",
    href: "/products/workstations",
    finishes: ["Warm Oak", "Light Maple", "Matte White"],
    tags: ["Linear", "Sharing", "Face-to-face"],
    variants: [
      // 2-seat: 1 seat each side, 1 column wide
      // Width = seat width, Depth = 2 × seat depth
      { id: "ls-2-900-1200",  label: "2 Seat / 900 × 1200",   widthMm: 900,  depthMm: 1200, heightMm: 750, footprintShape: "linear-shared", seatCount: 2, priceInr: 68000,  notes: "900 mm wide, 1 seat each side, 600 mm depth each side." },
      { id: "ls-2-900-1500",  label: "2 Seat / 900 × 1500",   widthMm: 900,  depthMm: 1500, heightMm: 750, footprintShape: "linear-shared", seatCount: 2, priceInr: 76000,  notes: "900 mm wide, 1 seat each side, 750 mm depth each side." },
      { id: "ls-2-1200-1200", label: "2 Seat / 1200 × 1200",  widthMm: 1200, depthMm: 1200, heightMm: 750, footprintShape: "linear-shared", seatCount: 2, priceInr: 78000,  notes: "1200 mm wide, 1 seat each side, 600 mm depth each side." },
      { id: "ls-2-1200-1500", label: "2 Seat / 1200 × 1500",  widthMm: 1200, depthMm: 1500, heightMm: 750, footprintShape: "linear-shared", seatCount: 2, priceInr: 88000,  notes: "1200 mm wide, 1 seat each side, 750 mm depth each side." },
      { id: "ls-2-1350-1200", label: "2 Seat / 1350 × 1200",  widthMm: 1350, depthMm: 1200, heightMm: 750, footprintShape: "linear-shared", seatCount: 2, priceInr: 84000,  notes: "1350 mm wide, 1 seat each side, 600 mm depth each side." },
      { id: "ls-2-1500-1200", label: "2 Seat / 1500 × 1200",  widthMm: 1500, depthMm: 1200, heightMm: 750, footprintShape: "linear-shared", seatCount: 2, priceInr: 92000,  notes: "1500 mm wide, 1 seat each side, 600 mm depth each side." },
      { id: "ls-2-1500-1500", label: "2 Seat / 1500 × 1500",  widthMm: 1500, depthMm: 1500, heightMm: 750, footprintShape: "linear-shared", seatCount: 2, priceInr: 102000, notes: "1500 mm wide, 1 seat each side, 750 mm depth each side." },
      // 4-seat: 2 seats each side, 2 columns wide
      // Width = 2 × seat width, Depth = 2 × seat depth
      { id: "ls-4-1800-1200", label: "4 Seat / 1800 × 1200",  widthMm: 1800, depthMm: 1200, heightMm: 750, footprintShape: "linear-shared", seatCount: 4, priceInr: 112000, notes: "2 × 900 mm wide, 600 mm depth each side." },
      { id: "ls-4-1800-1500", label: "4 Seat / 1800 × 1500",  widthMm: 1800, depthMm: 1500, heightMm: 750, footprintShape: "linear-shared", seatCount: 4, priceInr: 126000, notes: "2 × 900 mm wide, 750 mm depth each side." },
      { id: "ls-4-2400-1200", label: "4 Seat / 2400 × 1200",  widthMm: 2400, depthMm: 1200, heightMm: 750, footprintShape: "linear-shared", seatCount: 4, priceInr: 128000, notes: "2 × 1200 mm wide, 600 mm depth each side." },
      { id: "ls-4-2400-1500", label: "4 Seat / 2400 × 1500",  widthMm: 2400, depthMm: 1500, heightMm: 750, footprintShape: "linear-shared", seatCount: 4, priceInr: 144000, notes: "2 × 1200 mm wide, 750 mm depth each side." },
      { id: "ls-4-2700-1200", label: "4 Seat / 2700 × 1200",  widthMm: 2700, depthMm: 1200, heightMm: 750, footprintShape: "linear-shared", seatCount: 4, priceInr: 136000, notes: "2 × 1350 mm wide, 600 mm depth each side." },
      { id: "ls-4-3000-1200", label: "4 Seat / 3000 × 1200",  widthMm: 3000, depthMm: 1200, heightMm: 750, footprintShape: "linear-shared", seatCount: 4, priceInr: 144000, notes: "2 × 1500 mm wide, 600 mm depth each side." },
      { id: "ls-4-3000-1500", label: "4 Seat / 3000 × 1500",  widthMm: 3000, depthMm: 1500, heightMm: 750, footprintShape: "linear-shared", seatCount: 4, priceInr: 162000, notes: "2 × 1500 mm wide, 750 mm depth each side — matches 1500 × 1500 standard pod." },
    ],
  },
  {
    id: "l-shape-workstation",
    name: "L-Shape Workstation",
    category: "workstations",
    family: "L-Shape",
    description: "L-shaped workstation pod. Single units for corners; mirrored clusters for 2- and 4-seat pods.",
    image: "/images/catalog/oando-workstations--deskpro/image-1.jpg",
    href: "/products/workstations",
    finishes: ["Warm Oak", "Light Maple", "Matte White"],
    tags: ["L-shape", "Corner", "Pod", "Modular"],
    variants: [
      // ── 1-seat: single L unit ────────────────────────────────────────────
      // Each L arm = seat_size × seat_size. Bounding box = seat_size × seat_size.
      { id: "l1-1350", label: "1 Seat / 1350 × 1350", widthMm: 1350, depthMm: 1350, heightMm: 750, footprintShape: "l-shape", seatCount: 1, priceInr: 66000, notes: "Single L-shape: 1350 mm arms each way." },
      { id: "l1-1500", label: "1 Seat / 1500 × 1500", widthMm: 1500, depthMm: 1500, heightMm: 750, footprintShape: "l-shape", seatCount: 1, priceInr: 74000, notes: "Single L-shape: 1500 mm arms each way.", modelUrl: "/models/task4a/oando-workstations/oando-workstations--deskpro.glb" },
      // ── 2-seat: two L units mirrored side-by-side ───────────────────────
      // Width = 2 × seat_size, Depth = seat_size
      { id: "l2-1350", label: "2 Seat / 2700 × 1350", widthMm: 2700, depthMm: 1350, heightMm: 750, footprintShape: "l-shape", seatCount: 2, priceInr: 128000, notes: "2 × 1350 mm L units mirrored side-by-side." },
      { id: "l2-1500", label: "2 Seat / 3000 × 1500", widthMm: 3000, depthMm: 1500, heightMm: 750, footprintShape: "l-shape", seatCount: 2, priceInr: 146000, notes: "2 × 1500 mm L units mirrored side-by-side.", modelUrl: "/models/task4a/oando-workstations/oando-workstations--deskpro.glb" },
      // ── 4-seat: 2×2 mirrored cluster ────────────────────────────────────
      // Width = 2 × seat_size, Depth = 2 × seat_size
      { id: "l4-1350", label: "4 Seat / 2700 × 2700", widthMm: 2700, depthMm: 2700, heightMm: 750, footprintShape: "l-shape", seatCount: 4, priceInr: 248000, notes: "4 × 1350 mm L units in 2×2 mirrored cluster: 2700 × 2700 mm pod." },
      { id: "l4-1500", label: "4 Seat / 3000 × 3000", widthMm: 3000, depthMm: 3000, heightMm: 750, footprintShape: "l-shape", seatCount: 4, priceInr: 288000, notes: "4 × 1500 mm L units in 2×2 mirrored cluster: 3000 × 3000 mm pod.", modelUrl: "/models/task4a/oando-workstations/oando-workstations--deskpro.glb" },
    ],
  },
  // ── MEETING TABLES ──────────────────────────────────────────────────────────
  {
    id: "meeting-table",
    name: "Meeting Table",
    category: "meeting-tables",
    family: "Meeting",
    description: "Rectangular meeting tables from 4-person huddle to boardroom scale.",
    image: "/images/catalog/oando-tables--convene/image-1.jpg",
    href: "/products/tables",
    finishes: ["Warm Oak", "Matte White", "Concrete Grey"],
    tags: ["Meeting", "Conference", "Client-facing"],
    variants: [
      { id: "mt-1800-900",  label: "6 Seat / 1800 × 900",  widthMm: 1800, depthMm: 900,  heightMm: 750, seatCount: 6,  priceInr: 62000,  notes: "Compact 6-person meeting table." },
      { id: "mt-2400-1200", label: "8 Seat / 2400 × 1200", widthMm: 2400, depthMm: 1200, heightMm: 750, seatCount: 8,  priceInr: 98000,  notes: "Standard 8-person meeting table." },
      { id: "mt-3000-1200", label: "10 Seat / 3000 × 1200 (2-piece)", widthMm: 3000, depthMm: 1200, heightMm: 750, seatCount: 10, priceInr: 138000, notes: "10-person table supplied in 2 equal sections for site access." },
      { id: "mt-3600-1200", label: "12 Seat / 3600 × 1200 (2-piece)", widthMm: 3600, depthMm: 1200, heightMm: 750, seatCount: 12, priceInr: 164000, notes: "12-person conference table in 2 sections." },
      { id: "mt-4500-1200", label: "16 Seat / 4500 × 1200 (3-piece)", widthMm: 4500, depthMm: 1200, heightMm: 750, seatCount: 16, priceInr: 212000, notes: "Large boardroom table in 3 equal sections." },
    ],
  },
  // ── STORAGES ────────────────────────────────────────────────────────────────
  {
    id: "storage-unit",
    name: "Storage Unit",
    category: "storages",
    family: "Storage",
    description: "Prelam closed storage in varying widths and heights for open-plan and cabin use.",
    image: "/images/catalog/oando-storage--prelam-locker/image-1.jpg",
    href: "/products/storages",
    finishes: ["Light Maple", "Concrete Grey", "Matte White", "Warm Oak"],
    tags: ["Storage", "Prelam", "Closed"],
    variants: [
      { id: "st-900-750-h750",  label: "Low / 900 × 750 × H750",  widthMm: 900,  depthMm: 750, heightMm: 750,  unitCount: 1, priceInr: 34000, notes: "900 mm wide, 750 mm deep, 750 mm high — worktop-height credenza." },
      { id: "st-1050-750-h750", label: "Low / 1050 × 750 × H750", widthMm: 1050, depthMm: 750, heightMm: 750,  unitCount: 1, priceInr: 38000, notes: "1050 mm wide, 750 mm deep, 750 mm high." },
      { id: "st-900-750-h900",  label: "Mid / 900 × 750 × H900",  widthMm: 900,  depthMm: 750, heightMm: 900,  unitCount: 1, priceInr: 38000, notes: "900 mm wide, 750 mm deep, 900 mm high." },
      { id: "st-900-750-h1200", label: "Tall / 900 × 750 × H1200", widthMm: 900, depthMm: 750, heightMm: 1200, unitCount: 1, priceInr: 46000, notes: "900 mm wide, 750 mm deep, 1200 mm high." },
    ],
  },
  // ── SEATING ─────────────────────────────────────────────────────────────────
  {
    id: "task-chair",
    name: "Task Chair",
    category: "chairs",
    family: "Task",
    description: "Ergonomic mesh-backed task chair for workstation and meeting use.",
    image: "/images/catalog/oando-seating--fluid/image-1.jpg",
    href: "/products/seating",
    finishes: ["Graphite", "Warm Grey", "Jet Black"],
    tags: ["Ergonomic", "Task", "Daily use"],
    variants: [
      {
        id: "task-chair-standard",
        label: "Standard / 650 × 650",
        widthMm: 650,
        depthMm: 650,
        heightMm: 1080,
        seatCount: 1,
        priceInr: 18500,
        notes: "Mesh-backed ergonomic chair with compact 650 × 650 planning footprint.",
        modelUrl: "/models/task4a/oando-seating/oando-seating--arvo.glb",
      },
    ],
  },
  // ── OTHER ITEMS ─────────────────────────────────────────────────────────────
  {
    id: "other-items-suite",
    name: "Other Items",
    category: "other-items",
    family: "Support",
    description: "Supportive planning items for partitions, display, and space definition.",
    image: "/images/catalog/oando-storage--prelam-locker/image-1.jpg",
    href: "/products",
    finishes: ["Matte White", "Concrete Grey", "Graphite"],
    tags: ["Support", "Accessories", "Space planning"],
    variants: [
      { id: "partition-screen-1200", label: "Partition Screen / 1200 × 50", widthMm: 1200, depthMm: 50, heightMm: 1500, unitCount: 1, priceInr: 18000, notes: "Slim partition screen to define planning zones visually." },
      { id: "whiteboard-mobile-1200", label: "Mobile Whiteboard / 1200 × 500", widthMm: 1200, depthMm: 500, heightMm: 1800, unitCount: 1, priceInr: 34000, notes: "Mobile whiteboard for agile collaboration and briefing spaces." },
    ],
  },
];

const invalidSurfaceHeight = LIBRARY.flatMap((product) =>
  WORK_SURFACE_CATEGORIES.includes(product.category)
    ? product.variants
        .filter((variant) => variant.heightMm !== WORK_SURFACE_HEIGHT_MM)
        .map((variant) => `${product.name} / ${variant.label} = ${variant.heightMm}mm`)
    : [],
);

if (invalidSurfaceHeight.length > 0) {
  throw new Error(
    `Work surface height must be ${WORK_SURFACE_HEIGHT_MM}mm. Invalid variants: ${invalidSurfaceHeight.join(
      "; ",
    )}`,
  );
}

export function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createOpening(
  type: Opening["type"],
  edge: Opening["edge"],
  offsetMm: number,
  widthMm: number,
): Opening {
  return {
    id: createId(type),
    type,
    edge,
    offsetMm,
    widthMm,
  };
}
