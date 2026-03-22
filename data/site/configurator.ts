export type ProjectType = "workstations" | "storages";
export type WorkstationSeries =
  | "Desking Series"
  | "Panel Series"
  | "Height Adjustable Series";
export type LayoutId =
  | "linear-bench"
  | "double-bank"
  | "cluster-4"
  | "cluster-6"
  | "l-pod";
export type ScreenId = "none" | "acrylic" | "fabric" | "glass";
export type ModestyId = "none" | "metal" | "perforated" | "fabric";
export type RacewayId = "none" | "tray" | "spine" | "full-power-beam";
export type StorageModeId =
  | "none"
  | "shared-pedestal"
  | "individual-pedestal"
  | "overhead";
export type BudgetBandId = "under-3l" | "3l-8l" | "8l-20l" | "20l-plus" | "need-guidance";

export type WorkstationLayout = {
  id: LayoutId;
  label: string;
  description: string;
  seatPattern: number[][];
  supportedSeries: WorkstationSeries[];
};

export type OptionDefinition<T extends string> = {
  id: T;
  label: string;
  extraPerSeat: number;
};

export type SuggestedSystem = {
  name: string;
  hint: string;
  image: string;
  href: string;
};

export type BudgetBand = {
  id: BudgetBandId;
  label: string;
  hint: string;
};

export const WORKSTATION_SERIES: WorkstationSeries[] = [
  "Desking Series",
  "Panel Series",
  "Height Adjustable Series",
];

export const WORKSTATION_LAYOUTS: WorkstationLayout[] = [
  {
    id: "linear-bench",
    label: "Linear bench",
    description: "Straight benching modules for dense planning.",
    seatPattern: [[1], [1]],
    supportedSeries: ["Desking Series", "Panel Series", "Height Adjustable Series"],
  },
  {
    id: "double-bank",
    label: "Double bank",
    description: "Back-to-back desk banks with shared spine.",
    seatPattern: [
      [1, 1],
      [1, 1],
    ],
    supportedSeries: ["Desking Series", "Panel Series", "Height Adjustable Series"],
  },
  {
    id: "cluster-4",
    label: "Cluster of 4",
    description: "Compact 4-seat module for operations teams.",
    seatPattern: [
      [1, 1],
      [1, 1],
    ],
    supportedSeries: ["Desking Series", "Panel Series"],
  },
  {
    id: "cluster-6",
    label: "Cluster of 6",
    description: "High-density module for larger teams.",
    seatPattern: [
      [1, 1, 1],
      [1, 1, 1],
    ],
    supportedSeries: ["Desking Series", "Panel Series"],
  },
  {
    id: "l-pod",
    label: "L-shape pod",
    description: "Hybrid pod for task-plus-storage use.",
    seatPattern: [
      [1, 1],
      [1, 0],
    ],
    supportedSeries: ["Desking Series", "Panel Series", "Height Adjustable Series"],
  },
];

export const SCREEN_OPTIONS: OptionDefinition<ScreenId>[] = [
  { id: "none", label: "No screens", extraPerSeat: 0 },
  { id: "acrylic", label: "Acrylic screens", extraPerSeat: 1200 },
  { id: "fabric", label: "Fabric screens", extraPerSeat: 1800 },
  { id: "glass", label: "Glass-top screens", extraPerSeat: 2400 },
];

export const MODESTY_OPTIONS: OptionDefinition<ModestyId>[] = [
  { id: "none", label: "No modesty panel", extraPerSeat: 0 },
  { id: "metal", label: "Metal modesty panel", extraPerSeat: 900 },
  { id: "perforated", label: "Perforated modesty panel", extraPerSeat: 1100 },
  { id: "fabric", label: "Fabric modesty panel", extraPerSeat: 1400 },
];

export const RACEWAY_OPTIONS: OptionDefinition<RacewayId>[] = [
  { id: "none", label: "No raceway", extraPerSeat: 0 },
  { id: "tray", label: "Underdesk tray", extraPerSeat: 700 },
  { id: "spine", label: "Spine raceway", extraPerSeat: 1300 },
  { id: "full-power-beam", label: "Full power beam", extraPerSeat: 1900 },
];

export const STORAGE_MODE_OPTIONS: OptionDefinition<StorageModeId>[] = [
  { id: "none", label: "No pedestal", extraPerSeat: 0 },
  { id: "shared-pedestal", label: "Shared pedestal", extraPerSeat: 1100 },
  { id: "individual-pedestal", label: "Individual pedestal", extraPerSeat: 2200 },
  { id: "overhead", label: "Overhead storage", extraPerSeat: 1900 },
];

export const STORAGE_LAYOUT_OPTIONS = [
  "Wall run",
  "Dual aisle",
  "Compactor zone",
  "Locker bank",
] as const;

export const FINISH_OPTIONS = [
  "Warm Oak",
  "Light Maple",
  "Concrete Grey",
  "Matte White",
  "Matte Black",
  "Custom finish",
] as const;

export const BUDGET_BANDS: BudgetBand[] = [
  {
    id: "under-3l",
    label: "Under 3 lakh",
    hint: "Value-led planning and tighter option control.",
  },
  {
    id: "3l-8l",
    label: "3 to 8 lakh",
    hint: "Balanced fit for most compact offices and departments.",
  },
  {
    id: "8l-20l",
    label: "8 to 20 lakh",
    hint: "Broader ergonomic and finish choices.",
  },
  {
    id: "20l-plus",
    label: "20 lakh plus",
    hint: "Premium deployment with stronger customisation headroom.",
  },
  {
    id: "need-guidance",
    label: "Need guidance",
    hint: "Start with fit and use-case first, then align budget later.",
  },
] as const;

export const SERIES_BASE_SEAT_PRICE: Record<WorkstationSeries, number> = {
  "Desking Series": 18500,
  "Panel Series": 24500,
  "Height Adjustable Series": 41000,
};

export const STORAGE_BASE_UNIT_PRICE = 12000;

export const SERIES_SUGGESTIONS: Record<WorkstationSeries, SuggestedSystem[]> = {
  "Desking Series": [
    {
      name: "DeskPro",
      hint: "Modular desking for linear and cluster plans.",
      image: "/images/catalog/oando-workstations--deskpro/image-1.jpg",
      href: "/products/workstations",
    },
    {
      name: "Linear Workstation",
      hint: "Benching-oriented plan for high seat density.",
      image: "/images/products/linear-workstation-1.webp",
      href: "/products/workstations",
    },
  ],
  "Panel Series": [
    {
      name: "Panel Pro",
      hint: "Screen-integrated workstations with better zoning.",
      image: "/images/products/deskpro-workstation-1.webp",
      href: "/products/workstations",
    },
    {
      name: "Curvivo",
      hint: "Flexible panel modules for evolving floor plans.",
      image: "/images/products/60x30-workstation-1.webp",
      href: "/products/workstations",
    },
  ],
  "Height Adjustable Series": [
    {
      name: "Tectara",
      hint: "Sit-stand layouts for premium ergonomic deployment.",
      image: "/images/products/60x30-workstation-2.webp",
      href: "/products/workstations",
    },
    {
      name: "X-Bench",
      hint: "Collaborative modular system with adjustable options.",
      image: "/images/products/deskpro-workstation-2.webp",
      href: "/products/workstations",
    },
  ],
};

export const CONFIGURATOR_COPY = {
  quickModeLabel: "Quick estimate",
  quickModeDescription:
    "Answer the critical planning questions first, then review a practical estimate and shortlist.",
  technicalModeLabel: "Technical planner",
  technicalModeDescription:
    "Adjust layout logic, technical options, and project detail without losing the same snapshot.",
  quickEstimateTitle: "Get an indicative planning snapshot fast",
  quickEstimateDescription:
    "Choose project type, seat or unit count, room size, budget band, and location to get fit, budget, and matching product families immediately.",
  technicalPlannerTitle: "Refine the technical layout only when you need it",
  technicalPlannerDescription:
    "Advanced controls stay available, but grouped into smaller sections with a dedicated review step.",
  quickEstimateReviewTitle: "Estimate review",
  quickEstimateReviewDescription:
    "Use the live fit signal, budget range, and shortlist before you move into deeper technical planning.",
  reviewTitle: "Final review and submission",
  reviewDescription:
    "Confirm the planning snapshot, add project contacts, and send a quote-ready brief.",
  plannerSecondaryCta: "Guided Planner",
  matchingProductsCta: "View matching products",
  reviewCta: "Jump to review",
  quickNotesLabel: "More detail for the team",
  quickNotesDescription:
    "Add optional project nuance after the useful estimate appears, not before.",
  budgetBandLabel: "Budget band",
  cityLabel: "City / site",
  quickSeatsLabel: "Seats or units",
  modeSwitcherLabel: "Configurator mode",
  copilotKicker: "Configurator copilot",
  copilotTitle: "Ask for the next best move",
  copilotDescription:
    "Route-aware AI reads the current snapshot and suggests layout, fit, ergonomic, and catalog decisions without pretending to produce a final BOQ.",
  copilotPlaceholder:
    "Ask about fit tradeoffs, lower-budget alternatives, ergonomic upgrades, or matching systems...",
  copilotSubmit: "Ask copilot",
  copilotReset: "Start new question",
  copilotPrimaryPrompt: "Use current snapshot",
  copilotEmptyTitle: "Ask from the current planning state",
  copilotEmptyDescription:
    "Try a route-aware prompt instead of a blank general chatbot question.",
  copilotNextActionsTitle: "Next best actions",
  copilotWarningsTitle: "Watchouts",
  mobileReviewBar: "Review and submit",
  studioKicker: "Planning studio",
  workstationTitle: "Live workstation module map",
  storageTitle: "Live storage module map",
  studioDescription:
    "Rough drawing updates instantly as you change layout, room size, screens, modesty, and raceway selections.",
  totalLabel: "Total seats/units",
  footprintLabel: "Rough footprint",
  fitLabel: "Room fit check",
  budgetLabel: "Budget range",
  suggestedSystemsLabel: "Suggested workstation systems",
  setupKicker: "Configuration setup",
  setupTitle: "Full modular configurator",
  setupDescription:
    "Select module logic, add room and client context, then send a quote-ready requirement.",
  flowLabel: "5-stage flow",
  stageSystemLayout: "Stage 1: system and layout",
  stageRoomDimensions: "Stage 2: room dimensions",
  stageTechnicalOptions: "Stage 3: technical options",
  stageProjectContext: "Stage 4: project and client context",
  stageContactSubmission: "Stage 5: contact and submission",
  fitOverflow: "overflow",
} as const;

export const CONFIGURATOR_COPILOT_STARTERS = [
  "Reduce budget without breaking the current fit.",
  "Improve room fit using this current layout.",
  "Compare the current series with a more ergonomic option.",
  "Suggest matching products for this layout.",
] as const;

export const CONFIGURATOR_SVG_TONES = {
  workstationFill: "#102f71",
  workstationStroke: "#93c5fd",
  storageFill: "#0f766e",
  storageStroke: "#99f6e4",
  glassScreenStroke: "#e2e8f0",
  screenStroke: "#93c5fd",
  modestyStroke: "rgb(248, 250, 252)",
  canvasFill: "#111b31",
  fullPowerBeamStroke: "#d9d9d9",
  racewayStroke: "#38bdf8",
} as const;
