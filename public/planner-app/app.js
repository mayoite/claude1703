(function () {
  const svg = document.getElementById("planner-canvas");
  const stage = document.getElementById("canvas-stage");
  const catalogList = document.getElementById("catalog-list");
  const searchInput = document.getElementById("catalog-search");
  const roomWidthInput = document.getElementById("room-width");
  const roomDepthInput = document.getElementById("room-depth");
  const selectionPanel = document.getElementById("selection-panel");
  const selectionTitle = document.getElementById("selection-title");
  const selectionBadge = document.getElementById("selection-badge");
  const selectionContent = document.getElementById("selection-content");
  const noSelection = document.getElementById("no-selection");
  const statusText = document.getElementById("status-text");
  const statusRoom = document.getElementById("status-room");
  const statusItems = document.getElementById("status-items");
  const dropHint = document.getElementById("drop-hint");
  const loadInput = document.getElementById("load-input");
  const zoomLevel = document.getElementById("zoom-level");
  const hudTitle = document.getElementById("hud-title");
  const hudMeta = document.getElementById("hud-meta");
  const catalogCountTotal = document.getElementById("catalog-count-total");
  const summaryProductCount = document.getElementById("summary-product-count");
  const summaryCategoryCount = document.getElementById("summary-category-count");
  const summaryViewMode = document.getElementById("summary-view-mode");
  const summaryLayoutName = document.getElementById("summary-layout-name");
  const summaryRoomArea = document.getElementById("summary-room-area");
  const hudBadgeView = document.getElementById("hud-badge-view");
  const hudBadgeTool = document.getElementById("hud-badge-tool");
  const hudBadgeSnap = document.getElementById("hud-badge-snap");
  const roomSummaryLayout = document.getElementById("room-summary-layout");
  const roomSummaryArea = document.getElementById("room-summary-area");
  const roomSummaryItems = document.getElementById("room-summary-items");
  const roomSummarySelection = document.getElementById("room-summary-selection");

  const CATEGORY_META = {
    "Workstations": { color: "#c9b18d" },
    "Seating": { color: "#8194af" },
    "Openings": { color: "#83b9ff" },
    "Tables": { color: "#b08968" },
    "Storage": { color: "#7f91a7" },
    "Screens & AV": { color: "#61728e" },
    "Kitchen": { color: "#7ea07d" },
    "Infrastructure": { color: "#a4b1c3" },
    "Misc": { color: "#8a97a7" }
  };

  const CATEGORY_ORDER = Object.keys(CATEGORY_META);

  const ASSET_LIBRARY = {
    workstationSingle: "./assets/2d/workstation-single.svg",
    workstationL: "./assets/2d/workstation-l.svg",
    cornerDesk: "./assets/2d/corner-desk.svg",
    meetingChair: "./assets/2d/meeting-chair.svg",
    executiveChair: "./assets/2d/chair-1.svg",
    loungeChair: "./assets/2d/lounge-chair.svg",
    armchair: "./assets/2d/armchair.svg",
    loveseat: "./assets/2d/loveseat.svg",
    sofa2: "./assets/2d/sofa-2.svg",
    sofa3: "./assets/2d/sofa-3.svg",
    roundTable4: "./assets/2d/round-table-4.svg",
    roundTable6: "./assets/2d/round-table-6.svg",
    rectTable6: "./assets/2d/rect-table-6.svg",
    rectTable8: "./assets/2d/rect-table-8.svg",
    boardroomTable: "./assets/2d/boardroom-table.svg",
    pedestal: "./assets/2d/pedestal.svg",
    filingCabinet: "./assets/2d/filing-cabinet.svg",
    lowStorage: "./assets/2d/low-storage.svg",
    lockerUnit: "./assets/2d/locker-unit.svg",
    monitor: "./assets/2d/computer-monitor.svg",
    tv: "./assets/2d/televizor.svg",
    whiteboard: "./assets/2d/whiteboard.svg",
    receptionDesk: "./assets/2d/reception-desk.svg",
    barCounter: "./assets/2d/bar-counter.svg",
    kitchenFridge: "./assets/2d/kitchenFridge.svg",
    door: "./assets/2d/door.svg",
    window: "./assets/2d/window.svg",
    plant: "./assets/2d/plant.svg",
    generic: "./assets/2d/generic-object.svg"
  };

  const LAYOUT_PRESETS = {
    focus: {
      label: "Focus Studio",
      room: { width: 1010, depth: 600 },
      walls: [
        { x1: 170, y1: 256, x2: 455, y2: 256, thickness: 15 },
        { x1: 530, y1: 318, x2: 820, y2: 318, thickness: 15 }
      ],
      items: [
        { name: "DeskPro 150", x: 110, y: 94 },
        { name: "Adaptable 150 (H-Adj)", x: 290, y: 94 },
        { name: "Panel Pro 150", x: 470, y: 94 },
        { name: "Myel", x: 145, y: 178 },
        { name: "Myel", x: 205, y: 178 },
        { name: "Phoenix", x: 325, y: 178 },
        { name: "Phoenix", x: 385, y: 178 },
        { name: "Convesso 240", x: 575, y: 170 },
        { name: "Rock", x: 590, y: 88 },
        { name: "Rock", x: 680, y: 88 },
        { name: "Rock", x: 770, y: 88 },
        { name: "Large Screen 85", x: 700, y: 62 },
        { name: "Metal Locker 4-Door", x: 852, y: 86, rotation: 90 },
        { name: "Como 2-Seater", x: 120, y: 372 },
        { name: "Nook Coffee Table 75", x: 258, y: 406 },
        { name: "Planter", x: 342, y: 420 },
        { name: "Mobile Whiteboard", x: 846, y: 246, rotation: 90 }
      ]
    },
    team: {
      label: "Team Bench",
      room: { width: 1200, depth: 800 },
      walls: [{ x1: 220, y1: 330, x2: 980, y2: 330, thickness: 15 }],
      items: [
        { name: "DeskPro 150", x: 120, y: 110 },
        { name: "DeskPro 150", x: 300, y: 110 },
        { name: "DeskPro 150", x: 480, y: 110 },
        { name: "DeskPro 150", x: 660, y: 110 },
        { name: "Panel Pro 150", x: 840, y: 110 },
        { name: "Adaptable 180 (H-Adj)", x: 180, y: 420 },
        { name: "Adaptable 180 (H-Adj)", x: 390, y: 420 },
        { name: "Adaptable 180 (H-Adj)", x: 600, y: 420 },
        { name: "Adaptable 180 (H-Adj)", x: 810, y: 420 },
        { name: "Myel", x: 160, y: 198 },
        { name: "Myel", x: 340, y: 198 },
        { name: "Myel", x: 520, y: 198 },
        { name: "Myel", x: 700, y: 198 },
        { name: "Myel", x: 900, y: 198 },
        { name: "Myel", x: 220, y: 508 },
        { name: "Myel", x: 430, y: 508 },
        { name: "Myel", x: 640, y: 508 },
        { name: "Myel", x: 850, y: 508 },
        { name: "Metal Locker 6-Door", x: 1020, y: 108, rotation: 90 },
        { name: "Monitor Station", x: 1050, y: 428, rotation: 90 }
      ]
    },
    boardroom: {
      label: "Boardroom",
      room: { width: 1200, depth: 760 },
      walls: [
        { x1: 190, y1: 185, x2: 1010, y2: 185, thickness: 15 },
        { x1: 190, y1: 560, x2: 1010, y2: 560, thickness: 15 }
      ],
      items: [
        { name: "Convesso 360", x: 340, y: 258 },
        { name: "Rock", x: 355, y: 176 },
        { name: "Rock", x: 445, y: 176 },
        { name: "Rock", x: 535, y: 176 },
        { name: "Rock", x: 625, y: 176 },
        { name: "Rock", x: 715, y: 176 },
        { name: "Rock", x: 805, y: 176 },
        { name: "Rock", x: 355, y: 400, rotation: 180 },
        { name: "Rock", x: 445, y: 400, rotation: 180 },
        { name: "Rock", x: 535, y: 400, rotation: 180 },
        { name: "Rock", x: 625, y: 400, rotation: 180 },
        { name: "Rock", x: 715, y: 400, rotation: 180 },
        { name: "Rock", x: 805, y: 400, rotation: 180 },
        { name: "Large Screen 85", x: 515, y: 84 },
        { name: "Video Bar", x: 678, y: 126 },
        { name: "Mobile Whiteboard", x: 922, y: 250, rotation: 90 },
        { name: "Planter", x: 212, y: 228 },
        { name: "Planter", x: 212, y: 450 }
      ]
    },
    reception: {
      label: "Reception Lounge",
      room: { width: 1010, depth: 600 },
      walls: [{ x1: 492, y1: 180, x2: 860, y2: 180, thickness: 15 }],
      items: [
        { name: "Armora 2-Seater", x: 112, y: 156 },
        { name: "Como 1-Seater", x: 120, y: 318 },
        { name: "Accent Lounge", x: 286, y: 318 },
        { name: "Nook Coffee Table 75", x: 250, y: 230 },
        { name: "Planter", x: 390, y: 222 },
        { name: "Planter", x: 390, y: 372 },
        { name: "Hydration Unit", x: 554, y: 232 },
        { name: "Coffee Counter", x: 650, y: 214 },
        { name: "Metal Locker 2-Door", x: 884, y: 208, rotation: 90 },
        { name: "Large Screen 65", x: 620, y: 90 },
        { name: "Wayfinding Totem", x: 826, y: 322 },
        { name: "Planter", x: 884, y: 458 },
        { name: "Metal Pedestal", x: 588, y: 454 }
      ]
    }
  };

  const state = {
    room: { width: 1010, depth: 600 },
    items: [],
    walls: [],
    selectedItemId: null,
    selectedWallId: null,
    hoveredItemId: null,
    selectedLayoutKey: "focus",
    tool: "select",
    labels: false,
    dims: false,
    snap: true,
    view: "2.5d",
    scale: 1,
    wallDraftStart: null,
    previewPoint: null,
    dragState: null,
    history: [],
    future: [],
    search: "",
    searchTimer: null,
    catalogDirty: true,
    openCategories: {
      "Workstations": true,
      "Seating": true,
      "Openings": false,
      "Tables": true,
      "Storage": true,
      "Screens & AV": false,
      "Kitchen": false,
      "Infrastructure": false,
      "Misc": false
    }
  };

  const catalogState = {
    items: [],
    byId: new Map(),
    version: null,
    error: null
  };

  const PRESET_ITEM_ALIASES = {
    "Adaptable 150 (H-Adj)": { family: "adaptable", width: 150 },
    "Adaptable 180 (H-Adj)": { family: "adaptable", width: 180 },
    "Convesso 240": { family: "convesso", width: 240 },
    "Convesso 360": { family: "convesso", width: 360 },
    "Metal Locker 4-Door": { family: "metal-locker" },
    "Metal Locker 6-Door": { family: "metal-locker" },
    "Metal Locker 2-Door": { family: "metal-locker" },
    "Como 2-Seater": { family: "como" },
    "Como 1-Seater": { family: "como" },
    "Armora 2-Seater": { family: "armora" },
    "Accent Lounge": { family: "accent" },
    "Nook Coffee Table 75": { family: "nook" }
  };

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const uid = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const snapValue = (value) => (state.snap ? Math.round(value / 10) * 10 : value);
  const distance = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);
  const getSelectedItem = () => state.items.find((item) => item.id === state.selectedItemId) || null;
  const getSelectedWall = () => state.walls.find((wall) => wall.id === state.selectedWallId) || null;

  function isValidCatalogItem(item) {
    return item &&
      typeof item === "object" &&
      typeof item.id === "string" &&
      typeof item.name === "string" &&
      typeof item.category === "string" &&
      Number.isFinite(Number(item.width)) &&
      Number.isFinite(Number(item.depth)) &&
      Number.isFinite(Number(item.height));
  }

  function loadCatalog() {
    if (catalogState.version === window.furnitureLibrary && catalogState.items.length) return catalogState.items;

    catalogState.error = window.__plannerCatalogLoadError || null;
    if (catalogState.error) {
      catalogState.items = [];
      catalogState.byId = new Map();
      return [];
    }

    if (!Array.isArray(window.furnitureLibrary)) {
      catalogState.error = "Planner catalog is unavailable.";
      catalogState.items = [];
      catalogState.byId = new Map();
      return [];
    }

    const invalidItem = window.furnitureLibrary.find((item) => !isValidCatalogItem(item));
    if (invalidItem) {
      catalogState.error = `Planner catalog is malformed for item "${invalidItem && invalidItem.id ? invalidItem.id : "unknown"}".`;
      catalogState.items = [];
      catalogState.byId = new Map();
      return [];
    }

    catalogState.items = window.furnitureLibrary;
    catalogState.byId = new Map(catalogState.items.map((item) => [item.id, item]));
    catalogState.version = window.furnitureLibrary;
    catalogState.error = null;
    return catalogState.items;
  }

  function getCatalogItems() {
    return loadCatalog();
  }

  function getCatalogItemById(id) {
    loadCatalog();
    return catalogState.byId.get(id) || null;
  }

  function setCatalogError(message) {
    catalogList.innerHTML = `<div class="catalog-empty-state"><strong>Catalog unavailable</strong><span>${escapeXml(message)}</span></div>`;
    catalogCountTotal.textContent = "0";
  }

  function normalizePresetName(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/\(h-adj\)/g, "")
      .replace(/\b\d+\s*-\s*door\b/g, "")
      .replace(/\b\d+\s*-\s*seater\b/g, "")
      .replace(/\bcoffee table\b/g, "")
      .replace(/\blounge\b/g, "")
      .replace(/[^\w\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function escapeXml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;");
  }

  function rgba(hex, alpha) {
    const clean = (hex || "#64748b").replace("#", "");
    const normalized = clean.length === 3 ? clean.split("").map((char) => char + char).join("") : clean;
    const num = parseInt(normalized, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function shade(hex, amount) {
    const clean = (hex || "#64748b").replace("#", "");
    const normalized = clean.length === 3 ? clean.split("").map((char) => char + char).join("") : clean;
    const num = parseInt(normalized, 16);
    const r = clamp((num >> 16) + amount, 0, 255);
    const g = clamp(((num >> 8) & 255) + amount, 0, 255);
    const b = clamp((num & 255) + amount, 0, 255);
    return `#${[r, g, b].map((channel) => Math.round(channel).toString(16).padStart(2, "0")).join("")}`;
  }

  function pushHistory() {
    state.history.push(clone({ room: state.room, items: state.items, walls: state.walls, selectedLayoutKey: state.selectedLayoutKey }));
    if (state.history.length > 80) state.history.shift();
    state.future = [];
    syncUndoRedo();
  }

  function restoreSnapshot(snapshot) {
    state.room = clone(snapshot.room);
    state.items = clone(snapshot.items);
    state.walls = clone(snapshot.walls);
    state.selectedLayoutKey = snapshot.selectedLayoutKey || "focus";
    state.selectedItemId = null;
    state.selectedWallId = null;
    state.hoveredItemId = null;
    state.wallDraftStart = null;
    state.previewPoint = null;
    roomWidthInput.value = String(state.room.width);
    roomDepthInput.value = String(state.room.depth);
  }

  function undo() {
    if (!state.history.length) return;
    state.future.push(clone({ room: state.room, items: state.items, walls: state.walls, selectedLayoutKey: state.selectedLayoutKey }));
    restoreSnapshot(state.history.pop());
    renderAll();
  }

  function redo() {
    if (!state.future.length) return;
    state.history.push(clone({ room: state.room, items: state.items, walls: state.walls, selectedLayoutKey: state.selectedLayoutKey }));
    restoreSnapshot(state.future.pop());
    renderAll();
  }

  function syncUndoRedo() {
    document.getElementById("btn-undo").disabled = state.history.length === 0;
    document.getElementById("btn-redo").disabled = state.future.length === 0;
  }

  function setStatus(message) {
    statusText.textContent = message;
    statusRoom.textContent = `Room: ${state.room.width} x ${state.room.depth} cm`;
    statusItems.textContent = `${state.items.length} items`;
  }

  function updateHud() {
    const catalogItems = getCatalogItems();
    const activeLayout = LAYOUT_PRESETS[state.selectedLayoutKey];
    const area = (state.room.width * state.room.depth / 10000).toFixed(1);
    const selectedItem = getSelectedItem();
    const selectedWall = getSelectedWall();
    const selectionLabel = selectedItem ? selectedItem.name : selectedWall ? "Wall" : "None";
    hudTitle.textContent = activeLayout ? activeLayout.label : "Custom Layout";
    hudMeta.textContent = `${state.view === "2.5d" ? "2.5D presentation" : "2D planning"} · ${state.items.length} products · ${area} sq.m`;
    summaryProductCount.textContent = String(catalogItems.length);
    summaryCategoryCount.textContent = String(CATEGORY_ORDER.filter((category) => catalogItems.some((item) => item.category === category)).length);
    summaryViewMode.textContent = state.view === "2.5d" ? "2.5D" : "2D";
    if (summaryLayoutName) summaryLayoutName.textContent = activeLayout ? activeLayout.label : "Custom";
    if (summaryRoomArea) summaryRoomArea.textContent = `${area} sq.m`;
    if (hudBadgeView) hudBadgeView.textContent = state.view === "2.5d" ? "2.5D" : "2D";
    if (hudBadgeTool) hudBadgeTool.textContent = state.tool === "wall" ? "Wall" : "Select";
    if (hudBadgeSnap) hudBadgeSnap.textContent = state.snap ? "Snap On" : "Snap Off";
    if (roomSummaryLayout) roomSummaryLayout.textContent = activeLayout ? activeLayout.label : "Custom";
    if (roomSummaryArea) roomSummaryArea.textContent = `${area} sq.m`;
    if (roomSummaryItems) roomSummaryItems.textContent = `${state.items.length} placed`;
    if (roomSummarySelection) roomSummarySelection.textContent = selectionLabel;
    if (!catalogState.error) catalogCountTotal.textContent = String(catalogItems.length);
    zoomLevel.textContent = `${Math.round(state.scale * 100)}%`;
  }

  function getWorldPoint(event) {
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    return point.matrixTransform(svg.getScreenCTM().inverse());
  }

  function buildViewBox() {
    const margin = 44;
    const stageRatio = stage.clientWidth / Math.max(stage.clientHeight, 1);
    const roomRatio = (state.room.width + margin * 2) / Math.max(state.room.depth + margin * 2, 1);
    let width = state.room.width + margin * 2;
    let height = state.room.depth + margin * 2;
    if (roomRatio > stageRatio) height = width / stageRatio; else width = height * stageRatio;
    width = width / state.scale;
    height = height / state.scale;
    const centerX = state.room.width / 2;
    const centerY = state.room.depth / 2;
    return { x: centerX - width / 2, y: centerY - height / 2, width, height };
  }

  function rotatePoint(px, py, cx, cy, rotation) {
    const radians = rotation * Math.PI / 180;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const dx = px - cx;
    const dy = py - cy;
    return { x: cx + dx * cos - dy * sin, y: cy + dx * sin + dy * cos };
  }

  function pointsToString(points) {
    return points.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");
  }

  function getFamily(item) {
    return item.family || item.series || item.category || "Product";
  }

  function getChipValues(item) {
    return [item.variant, item.finish, item.series, item.topView, item.renderStyle].filter(Boolean).slice(0, 3);
  }

  function getSymbolAsset(item) {
    const name = (item.name || "").toLowerCase();
    const family = (item.family || "").toLowerCase();
    const category = (item.category || "").toLowerCase();
    const shape = (item.shape || "").toLowerCase();

    if (item.topViewAsset) return item.topViewAsset;

    if (category === "workstations") {
      if (family.includes("curvivo") || shape.includes("curved")) return ASSET_LIBRARY.cornerDesk;
      if (family.includes("panel")) return ASSET_LIBRARY.workstationL;
      if (family.includes("trio") && item.width >= 170) return ASSET_LIBRARY.receptionDesk;
      return item.width >= item.depth * 2.35 ? ASSET_LIBRARY.workstationSingle : ASSET_LIBRARY.workstationL;
    }

    if (category === "seating") {
      if (shape === "sofa") {
        if (item.width >= 200) return ASSET_LIBRARY.sofa3;
        if (item.width >= 150) return ASSET_LIBRARY.sofa2;
        return ASSET_LIBRARY.loveseat;
      }
      if (shape === "lounge") return ASSET_LIBRARY.loungeChair;
      if (family.includes("rock") || family.includes("myel") || family.includes("sway") || family.includes("phoenix")) return ASSET_LIBRARY.executiveChair;
      if (family.includes("armora") || family.includes("accent")) return ASSET_LIBRARY.armchair;
      return ASSET_LIBRARY.meetingChair;
    }

    if (category === "tables") {
      if (shape === "round-table") return item.width >= 110 ? ASSET_LIBRARY.roundTable6 : ASSET_LIBRARY.roundTable4;
      if (item.width >= 300 || family.includes("convesso")) return ASSET_LIBRARY.boardroomTable;
      if (item.width >= 220) return ASSET_LIBRARY.rectTable8;
      return ASSET_LIBRARY.rectTable6;
    }

    if (category === "storage") {
      if (name.includes("locker")) return ASSET_LIBRARY.lockerUnit;
      if (name.includes("pedestal")) return ASSET_LIBRARY.pedestal;
      if (item.height >= 140) return ASSET_LIBRARY.filingCabinet;
      return ASSET_LIBRARY.lowStorage;
    }

    if (category === "screens & av") {
      if (name.includes("whiteboard")) return ASSET_LIBRARY.whiteboard;
      if (name.includes("monitor")) return ASSET_LIBRARY.monitor;
      return ASSET_LIBRARY.tv;
    }

    if (category === "kitchen") {
      if (name.includes("fridge")) return ASSET_LIBRARY.kitchenFridge;
      return ASSET_LIBRARY.barCounter;
    }

    if (category === "openings") return shape === "window" ? ASSET_LIBRARY.window : "";
    if (category === "misc" && shape === "plant") return ASSET_LIBRARY.plant;
    return ASSET_LIBRARY.generic;
  }

  function getDisplayImage(item) {
    return item.heroImageUrl || item.imageUrl || getSymbolAsset(item);
  }

  function getCanvasAsset(item) {
    return state.view === "2.5d" && item.category !== "Openings" ? getDisplayImage(item) : getSymbolAsset(item);
  }

  function getSelectionPreviewImage(item) {
    return item.heroImageUrl || item.imageUrl || getSymbolAsset(item) || ASSET_LIBRARY.generic;
  }

  function getSelectionPreviewFallback(item) {
    return getSymbolAsset(item) || ASSET_LIBRARY.generic;
  }

  function shouldShowLabel(item, selected, hovered) {
    return selected || hovered || (state.labels && state.scale >= 0.9);
  }

  function shouldShowDims(item, selected) {
    return selected || (state.dims && state.scale >= 1.1 && item.category !== "Misc");
  }

  function renderAssetImage(item, assetPath) {
    if (!assetPath) return "";
    const insetX = Math.max(4, item.width * 0.05);
    const insetY = Math.max(4, item.depth * 0.08);
    const width = Math.max(10, item.width - insetX * 2);
    const height = Math.max(10, item.depth - insetY * 2);
    return `<image href="${assetPath}" x="${item.x + insetX}" y="${item.y + insetY}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet" opacity="0.95"></image>`;
  }

  function renderFallbackOverlay(item) {
    const cx = item.x + item.width / 2;
    const cy = item.y + item.depth / 2;
    if (item.category === "Openings") {
      const name = (item.name || "").toLowerCase();
      if (name.includes("window")) {
        return `<g>
          <rect x="${item.x + 6}" y="${item.y + 6}" width="${Math.max(10, item.width - 12)}" height="${Math.max(10, item.depth - 12)}" rx="10" fill="rgba(131, 185, 255, 0.18)" stroke="#4f87c8" stroke-width="2"></rect>
          <line x1="${cx}" y1="${item.y + 8}" x2="${cx}" y2="${item.y + item.depth - 8}" stroke="#4f87c8" stroke-width="2" opacity="0.65"></line>
        </g>`;
      }
      if (name.includes("sliding")) {
        return `<g>
          <line x1="${item.x + 10}" y1="${cy - 8}" x2="${item.x + item.width - 10}" y2="${cy - 8}" stroke="#294567" stroke-width="2.5" opacity="0.55"></line>
          <line x1="${item.x + 10}" y1="${cy + 8}" x2="${item.x + item.width - 10}" y2="${cy + 8}" stroke="#294567" stroke-width="2.5" opacity="0.55"></line>
          <path d="M ${item.x + item.width * 0.35} ${cy - 16} l 12 8 -12 8" fill="none" stroke="#294567" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path>
          <path d="M ${item.x + item.width * 0.65} ${cy + 16} l -12 -8 12 -8" fill="none" stroke="#294567" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path>
        </g>`;
      }
      if (name.includes("double")) {
        return `<g>
          <line x1="${cx}" y1="${item.y + 8}" x2="${cx}" y2="${item.y + item.depth - 8}" stroke="#294567" stroke-width="2.2" opacity="0.35"></line>
          <path d="M ${cx} ${cy} m -28 0 a 28 28 0 0 1 28 -28" fill="none" stroke="#294567" stroke-width="2.4"></path>
          <path d="M ${cx} ${cy} m 28 0 a 28 28 0 0 0 -28 -28" fill="none" stroke="#294567" stroke-width="2.4"></path>
        </g>`;
      }
      return `<g>
        <line x1="${item.x + 10}" y1="${cy}" x2="${item.x + item.width - 10}" y2="${cy}" stroke="#294567" stroke-width="2.5" opacity="0.45"></line>
        <path d="M ${item.x + 18} ${cy} a 26 26 0 0 1 26 -26" fill="none" stroke="#294567" stroke-width="2.4"></path>
      </g>`;
    }
    if (item.shape === "chair") return `<ellipse cx="${cx}" cy="${cy}" rx="${item.width * 0.18}" ry="${item.depth * 0.18}" fill="${rgba(item.color, 0.18)}"></ellipse>`;
    if (item.shape === "sofa" || item.shape === "lounge") return `<rect x="${item.x + item.width * 0.08}" y="${item.y + item.depth * 0.18}" width="${item.width * 0.84}" height="${item.depth * 0.64}" rx="10" fill="${rgba(item.color, 0.16)}"></rect>`;
    if (item.shape === "screen") return `<rect x="${item.x + item.width * 0.12}" y="${item.y + item.depth * 0.18}" width="${item.width * 0.76}" height="${item.depth * 0.48}" rx="8" fill="${rgba("#0f172a", 0.32)}"></rect>`;
    return `<rect x="${item.x + item.width * 0.08}" y="${item.y + item.depth * 0.12}" width="${item.width * 0.84}" height="${item.depth * 0.76}" rx="10" fill="${rgba(item.color, 0.08)}"></rect>`;
  }

  function renderRectItem(item, selected, hovered, assetPath) {
    const lift = state.view === "2.5d" && item.category !== "Openings" ? clamp(Math.min(item.width, item.depth) * 0.12, 7, 15) : 0;
    const radius = clamp(Math.min(item.width, item.depth) * 0.14, 8, 20);
    const shadowOffsetX = lift > 0 ? lift * 0.78 : 8;
    const shadowOffsetY = lift > 0 ? lift * 0.72 : 8;
    const stroke = selected ? "#2f6df6" : hovered ? shade(item.color, -10) : rgba("#28415f", 0.55);
    const strokeWidth = selected ? 3.5 : hovered ? 2.4 : 1.8;
    let markup = "";
    markup += `<rect x="${item.x + shadowOffsetX}" y="${item.y + shadowOffsetY}" width="${item.width}" height="${item.depth}" rx="${radius}" fill="${rgba(item.color, state.view === "2.5d" ? 0.2 : 0.12)}" filter="url(#softBlur)"></rect>`;
    if (lift > 0) {
      markup += `<polygon points="${pointsToString([{ x: item.x + item.width, y: item.y }, { x: item.x + item.width + lift, y: item.y + lift * 0.62 }, { x: item.x + item.width + lift, y: item.y + item.depth + lift * 0.62 }, { x: item.x + item.width, y: item.y + item.depth }])}" fill="${rgba(shade(item.color, -18), 0.3)}"></polygon>`;
      markup += `<polygon points="${pointsToString([{ x: item.x, y: item.y + item.depth }, { x: item.x + item.width, y: item.y + item.depth }, { x: item.x + item.width + lift, y: item.y + item.depth + lift * 0.62 }, { x: item.x + lift, y: item.y + item.depth + lift * 0.62 }])}" fill="${rgba(shade(item.color, -8), 0.24)}"></polygon>`;
    }
    markup += `<rect x="${item.x}" y="${item.y}" width="${item.width}" height="${item.depth}" rx="${radius}" fill="#ffffff" stroke="${stroke}" stroke-width="${strokeWidth}"></rect>`;
    markup += `<rect x="${item.x + 2}" y="${item.y + 2}" width="${Math.max(4, item.width - 4)}" height="${Math.max(4, item.depth - 4)}" rx="${Math.max(6, radius - 3)}" fill="${rgba(item.color, 0.08)}"></rect>`;
    markup += assetPath ? renderAssetImage(item, assetPath) : renderFallbackOverlay(item);
    if (selected || hovered) {
      markup += `<rect x="${item.x - 4}" y="${item.y - 4}" width="${item.width + 8}" height="${item.depth + 8}" rx="${radius + 4}" fill="none" stroke="${selected ? rgba("#2f6df6", 0.6) : rgba(item.color, 0.5)}" stroke-width="1.5" ${selected ? "" : "stroke-dasharray=\"8 6\""}></rect>`;
    }
    return markup;
  }

  function renderRoundItem(item, selected, hovered, assetPath) {
    const cx = item.x + item.width / 2;
    const cy = item.y + item.depth / 2;
    const rx = item.width / 2;
    const ry = item.depth / 2;
    const lift = state.view === "2.5d" && item.category !== "Openings" ? clamp(Math.min(item.width, item.depth) * 0.08, 6, 12) : 0;
    const stroke = selected ? "#2f6df6" : hovered ? shade(item.color, -10) : rgba("#28415f", 0.55);
    const strokeWidth = selected ? 3.5 : hovered ? 2.4 : 1.8;
    let markup = "";
    markup += `<ellipse cx="${cx + 10}" cy="${cy + 9 + lift}" rx="${rx}" ry="${ry}" fill="${rgba(item.color, 0.18)}" filter="url(#softBlur)"></ellipse>`;
    if (lift > 0) {
      markup += `<ellipse cx="${cx + lift * 0.45}" cy="${cy + lift * 0.42}" rx="${rx}" ry="${ry}" fill="${rgba(shade(item.color, -12), 0.16)}"></ellipse>`;
    }
    markup += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#ffffff" stroke="${stroke}" stroke-width="${strokeWidth}"></ellipse>`;
    markup += `<ellipse cx="${cx}" cy="${cy}" rx="${Math.max(4, rx - 3)}" ry="${Math.max(4, ry - 3)}" fill="${rgba(item.color, 0.08)}"></ellipse>`;
    markup += assetPath ? renderAssetImage(item, assetPath) : renderFallbackOverlay(item);
    if (selected || hovered) markup += `<ellipse cx="${cx}" cy="${cy}" rx="${rx + 5}" ry="${ry + 5}" fill="none" stroke="${selected ? rgba("#2f6df6", 0.5) : rgba(item.color, 0.45)}" stroke-width="1.5"></ellipse>`;
    return markup;
  }

  function renderWall(wall) {
    const selected = wall.id === state.selectedWallId;
    const length = Math.round(distance(wall.x1, wall.y1, wall.x2, wall.y2));
    const cx = (wall.x1 + wall.x2) / 2;
    const cy = (wall.y1 + wall.y2) / 2;
    const isRaised = state.view === "2.5d";
    const shadowDx = isRaised ? 8 : 0;
    const shadowDy = isRaised ? 7 : 0;
    const highlightDx = isRaised ? -2 : 0;
    const highlightDy = isRaised ? -2 : 0;
    return `
      <g data-wall-id="${wall.id}">
        <line x1="${wall.x1 + shadowDx}" y1="${wall.y1 + shadowDy}" x2="${wall.x2 + shadowDx}" y2="${wall.y2 + shadowDy}" stroke="${selected ? rgba("#2f6df6", 0.24) : rgba("#41536d", isRaised ? 0.26 : 0.18)}" stroke-width="${Math.max(wall.thickness + 2, 8)}" stroke-linecap="round" opacity="${isRaised ? 1 : 0.9}"></line>
        <line x1="${wall.x1}" y1="${wall.y1}" x2="${wall.x2}" y2="${wall.y2}" stroke="${selected ? "#2f6df6" : "#94a3b8"}" stroke-width="${Math.max(wall.thickness, 6)}" stroke-linecap="round"></line>
        ${isRaised ? `<line x1="${wall.x1 + highlightDx}" y1="${wall.y1 + highlightDy}" x2="${wall.x2 + highlightDx}" y2="${wall.y2 + highlightDy}" stroke="${selected ? rgba("#bfdbfe", 0.75) : rgba("#e2e8f0", 0.6)}" stroke-width="${Math.max(wall.thickness * 0.28, 2)}" stroke-linecap="round"></line>` : ""}
        <circle cx="${wall.x1}" cy="${wall.y1}" r="${selected ? 5.5 : 4.2}" fill="${selected ? "#2f6df6" : "#64748b"}"></circle>
        <circle cx="${wall.x2}" cy="${wall.y2}" r="${selected ? 5.5 : 4.2}" fill="${selected ? "#2f6df6" : "#64748b"}"></circle>
        ${selected || state.dims ? `<text x="${cx}" y="${cy - 12}" class="canvas-dim" text-anchor="middle">Wall ${length} cm</text>` : ""}
      </g>`;
  }

  function renderItem(item) {
    const selected = item.id === state.selectedItemId;
    const hovered = item.id === state.hoveredItemId;
    const cx = item.x + item.width / 2;
    const cy = item.y + item.depth / 2;
    const assetPath = getCanvasAsset(item);
    const shouldDrawRound = item.shape === "round-table" || item.shape === "column" || item.shape === "plant";
    let markup = `<g data-item-id="${item.id}" transform="rotate(${item.rotation} ${cx} ${cy})">`;
    markup += shouldDrawRound ? renderRoundItem(item, selected, hovered, assetPath) : renderRectItem(item, selected, hovered, assetPath);
    if (shouldShowLabel(item, selected, hovered)) markup += `<text x="${cx}" y="${item.y + item.depth + 22}" class="canvas-label" text-anchor="middle">${escapeXml(item.name)}</text>`;
    if (shouldShowDims(item, selected)) markup += `<text x="${cx}" y="${item.y - 12}" class="canvas-dim" text-anchor="middle">${item.width} x ${item.depth} cm</text>`;
    markup += `</g>`;
    return markup;
  }

  function renderCanvas() {
    const viewBox = buildViewBox();
    const area = (state.room.width * state.room.depth / 10000).toFixed(1);
    svg.setAttribute("viewBox", `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);
    let markup = `
      <defs>
        <pattern id="minor-grid" width="25" height="25" patternUnits="userSpaceOnUse"><path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(80, 101, 133, 0.07)" stroke-width="1"></path></pattern>
        <pattern id="major-grid" width="100" height="100" patternUnits="userSpaceOnUse"><rect width="100" height="100" fill="url(#minor-grid)"></rect><path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(80, 101, 133, 0.16)" stroke-width="1.2"></path></pattern>
        <filter id="softBlur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"></feGaussianBlur></filter>
      </defs>
      <rect x="${viewBox.x}" y="${viewBox.y}" width="${viewBox.width}" height="${viewBox.height}" fill="url(#minor-grid)"></rect>
      <rect x="8" y="10" width="${state.room.width}" height="${state.room.depth}" rx="26" fill="rgba(43, 65, 95, 0.18)" filter="url(#softBlur)"></rect>
      <rect x="0" y="0" width="${state.room.width}" height="${state.room.depth}" rx="26" fill="#faf8f3" stroke="#51657f" stroke-width="4"></rect>
      <rect x="20" y="18" width="${Math.max(0, state.room.width - 40)}" height="${Math.max(0, state.room.depth - 36)}" rx="18" fill="url(#major-grid)" opacity="0.92"></rect>
      <text x="${state.room.width / 2}" y="-16" class="canvas-room-title" text-anchor="middle">${state.room.width} cm</text>
      <text x="-18" y="${state.room.depth / 2}" class="canvas-room-title" text-anchor="middle" transform="rotate(-90 -18 ${state.room.depth / 2})">${state.room.depth} cm</text>
      <text x="${state.room.width - 14}" y="${state.room.depth + 26}" class="canvas-dim" text-anchor="end">${area} sq.m</text>`;
    state.walls.forEach((wall) => { markup += renderWall(wall); });
    state.items.forEach((item) => { markup += renderItem(item); });
    if (state.tool === "wall" && state.wallDraftStart && state.previewPoint) markup += `<line x1="${state.wallDraftStart.x}" y1="${state.wallDraftStart.y}" x2="${state.previewPoint.x}" y2="${state.previewPoint.y}" stroke="#2f6df6" stroke-width="8" stroke-dasharray="10 8" stroke-linecap="round" opacity="0.72"></line>`;
    svg.innerHTML = markup;
  }

  function fieldNumber(id, label, value) {
    return `
      <label class="selection-field">
        <span class="selection-muted-label">${label}</span>
        <input id="${id}" class="selection-input" type="number" value="${Math.round(value)}">
      </label>`;
  }

  function toColorInput(color) {
    return color && color.startsWith("#") ? color : "#64748b";
  }

  function bindItemInputs(itemId) {
    const selected = state.items.find((item) => item.id === itemId);
    if (!selected) return;
    [["sel-x", "x"], ["sel-y", "y"], ["sel-w", "width"], ["sel-d", "depth"], ["sel-h", "height"], ["sel-r", "rotation"]].forEach(([id, key]) => {
      document.getElementById(id).addEventListener("change", (event) => {
        pushHistory();
        selected[key] = Number(event.target.value) || 0;
        if (key === "x") selected.x = clamp(selected.x, 0, state.room.width - selected.width);
        if (key === "y") selected.y = clamp(selected.y, 0, state.room.depth - selected.depth);
        if (key === "width") selected.width = Math.max(10, selected.width);
        if (key === "depth") selected.depth = Math.max(10, selected.depth);
        renderAll({ catalog: false });
      });
    });
    document.getElementById("sel-color").addEventListener("input", (event) => {
      selected.color = event.target.value;
      renderCanvas();
    });
    document.getElementById("btn-duplicate-selection").addEventListener("click", duplicateSelectedItem);
    document.getElementById("btn-rotate-selection").addEventListener("click", () => {
      pushHistory();
      selected.rotation = (selected.rotation + 90) % 360;
      renderAll({ catalog: false });
    });
    document.getElementById("btn-delete-selection").addEventListener("click", deleteSelected);
  }

  function bindWallInputs(wallId) {
    const selected = state.walls.find((wall) => wall.id === wallId);
    if (!selected) return;
    [["wall-x1", "x1"], ["wall-y1", "y1"], ["wall-x2", "x2"], ["wall-y2", "y2"], ["wall-thickness", "thickness"]].forEach(([id, key]) => {
      document.getElementById(id).addEventListener("change", (event) => {
        pushHistory();
        selected[key] = Number(event.target.value) || 0;
        if (key === "thickness") selected.thickness = clamp(selected.thickness, 5, 60);
        renderAll({ catalog: false });
      });
    });
    document.getElementById("btn-delete-selection").addEventListener("click", deleteSelected);
  }

  function renderSelectionPanel() {
    const item = getSelectedItem();
    const wall = getSelectedWall();
    if (!item && !wall) {
      selectionPanel.classList.add("hidden");
      noSelection.classList.remove("hidden");
      return;
    }
    selectionPanel.classList.remove("hidden");
    noSelection.classList.add("hidden");

    if (item) {
      const photoUrl = getSelectionPreviewImage(item);
      const fallbackPhotoUrl = getSelectionPreviewFallback(item);
      const chips = [`${item.width} x ${item.depth} x ${item.height} cm`, getFamily(item), item.spec, item.finish, item.materials, item.seats ? `${item.seats} seats` : null].filter(Boolean).slice(0, 6);
      selectionTitle.textContent = item.name;
      selectionBadge.textContent = item.category;
      selectionContent.innerHTML = `
        <div class="selection-body">
          <div class="selection-photo">
            <img src="${escapeXml(photoUrl)}" alt="${escapeXml(item.name)}" data-fallback="${escapeXml(fallbackPhotoUrl)}" onerror="const fallback = this.dataset.fallback || '${ASSET_LIBRARY.generic}'; if (!this.dataset.fallbackApplied) { this.dataset.fallbackApplied = 'true'; this.src = fallback; this.classList.add('is-fallback'); return; } this.onerror = null; this.src = '${ASSET_LIBRARY.generic}'; this.classList.add('is-fallback');">
            <span class="selection-photo-badge">${escapeXml(getFamily(item))}</span>
          </div>
          <div class="selection-title">
            <strong>${escapeXml(item.name)}</strong>
            <span>${escapeXml(item.description || item.spec || "AFC office product placed in the live workspace.")}</span>
          </div>
          <div class="selection-chip-row">${chips.map((chip) => `<span class="selection-spec">${escapeXml(chip)}</span>`).join("")}</div>
          <div class="selection-group"><span class="selection-group-title">Placement</span><div class="selection-grid">${fieldNumber("sel-x", "X (cm)", item.x)}${fieldNumber("sel-y", "Y (cm)", item.y)}${fieldNumber("sel-r", "Rotation (deg)", item.rotation)}${fieldNumber("sel-h", "Height (cm)", item.height)}</div></div>
          <div class="selection-group"><span class="selection-group-title">Footprint</span><div class="selection-grid">${fieldNumber("sel-w", "Width (cm)", item.width)}${fieldNumber("sel-d", "Depth (cm)", item.depth)}</div></div>
          <div class="selection-group"><span class="selection-group-title">Finish</span><label class="selection-field"><span class="selection-muted-label">Color</span><input id="sel-color" class="selection-color" type="color" value="${toColorInput(item.color)}"></label></div>
          <div class="selection-link-row">${item.sourceUrl ? `<a class="selection-link" href="${item.sourceUrl}" target="_blank" rel="noreferrer">AFC product page</a>` : ""}${item.specSheetUrl ? `<a class="selection-link" href="${item.specSheetUrl}" target="_blank" rel="noreferrer">Spec sheet</a>` : ""}</div>
          <div class="selection-button-row"><button class="selection-button" id="btn-duplicate-selection">Duplicate</button><button class="selection-button" id="btn-rotate-selection">Rotate 90</button><button class="selection-button" id="btn-delete-selection">Delete</button></div>
        </div>`;
      bindItemInputs(item.id);
      return;
    }

    if (wall) {
      const length = Math.round(distance(wall.x1, wall.y1, wall.x2, wall.y2));
      selectionTitle.textContent = "Wall";
      selectionBadge.textContent = "Structure";
      selectionContent.innerHTML = `
        <div class="selection-body">
          <div class="selection-chip-row"><span class="selection-spec">Length ${length} cm</span><span class="selection-spec">Thickness ${wall.thickness} cm</span></div>
          <div class="selection-grid">${fieldNumber("wall-x1", "X1", wall.x1)}${fieldNumber("wall-y1", "Y1", wall.y1)}${fieldNumber("wall-x2", "X2", wall.x2)}${fieldNumber("wall-y2", "Y2", wall.y2)}${fieldNumber("wall-thickness", "Thickness (cm)", wall.thickness)}</div>
          <div class="selection-button-row"><button class="selection-button" id="btn-delete-selection">Delete wall</button></div>
        </div>`;
      bindWallInputs(wall.id);
    }
  }

  function renderCatalog() {
    const catalogItems = getCatalogItems();
    if (catalogState.error) {
      setCatalogError(catalogState.error);
      state.catalogDirty = false;
      return;
    }

    const query = state.search.trim().toLowerCase();
    const groups = catalogItems.reduce((accumulator, item) => {
      accumulator[item.category] = accumulator[item.category] || [];
      accumulator[item.category].push(item);
      return accumulator;
    }, {});
    let totalVisible = 0;
    let markup = "";

    CATEGORY_ORDER.forEach((category) => {
      const items = (groups[category] || []).filter((item) => !query || [item.name, item.family, item.category, item.spec, item.variant, item.finish].filter(Boolean).join(" ").toLowerCase().includes(query));
      if (!items.length) return;
      totalVisible += items.length;
      const open = !!state.openCategories[category];
      markup += `<section class="catalog-category ${open ? "is-open" : ""}"><button class="category-header" data-category="${category}"><span class="category-dot" style="background:${CATEGORY_META[category].color}"></span><span class="category-name">${category.toUpperCase()}</span><span class="category-count">${items.length}</span><span class="material-symbols-outlined">${open ? "expand_more" : "chevron_right"}</span></button>`;
      if (open) {
        markup += `<div class="category-items">`;
        items.forEach((item) => {
          const imageUrl = getDisplayImage(item);
          const chips = getChipValues(item).slice(0, 2);
          markup += `<button class="catalog-card" draggable="true" data-item-id="${item.id}"><span class="catalog-thumb">${imageUrl ? `<img src="${imageUrl}" alt="${escapeXml(item.name)}" loading="lazy" referrerpolicy="no-referrer">` : `<span class="material-symbols-outlined">${item.icon || "inventory_2"}</span>`}<span class="catalog-thumb-label">${escapeXml(getFamily(item))}</span></span><span class="catalog-meta"><span class="catalog-name-row"><span class="catalog-name">${escapeXml(item.name)}</span><span class="catalog-action">Add</span></span><span class="catalog-family">${escapeXml(item.category)}</span><span class="catalog-dims">${item.width} x ${item.depth} x ${item.height} cm</span>${item.spec ? `<span class="catalog-spec">${escapeXml(item.spec)}</span>` : ""}<span class="catalog-badge-row">${chips.map((chip) => `<span class="catalog-badge">${escapeXml(chip)}</span>`).join("")}</span></span></button>`;
        });
        markup += `</div>`;
      }
      markup += `</section>`;
    });

    catalogList.innerHTML = markup || `<div class="catalog-empty-state"><strong>No products found</strong><span>Adjust search terms or reopen more categories.</span></div>`;
    catalogCountTotal.textContent = String(totalVisible);
    state.catalogDirty = false;
  }

  function toggleButton(id, active) {
    document.getElementById(id).classList.toggle("active", active);
  }

  function updateToolButtons() {
    toggleButton("btn-tool-select", state.tool === "select");
    toggleButton("btn-tool-wall", state.tool === "wall");
    toggleButton("btn-snap", state.snap);
    toggleButton("btn-labels", state.labels);
    toggleButton("btn-dims", state.dims);
    toggleButton("btn-view-2d", state.view === "2d");
    toggleButton("btn-view-3d", state.view === "2.5d");
  }

  function syncRoomInputs() {
    roomWidthInput.value = String(state.room.width);
    roomDepthInput.value = String(state.room.depth);
  }

  function renderAll(options = {}) {
    const { catalog = state.catalogDirty, canvas = true, selection = true } = options;
    if (catalog) renderCatalog();
    if (canvas) renderCanvas();
    if (selection) renderSelectionPanel();
    syncUndoRedo();
    updateToolButtons();
    syncRoomInputs();
    updateHud();
    setStatus(statusText.textContent);
  }

  function addItem(item, position) {
    if (!item) return;
    pushHistory();
    const x = clamp(snapValue(position.x - item.width / 2), 0, state.room.width - item.width);
    const y = clamp(snapValue(position.y - item.depth / 2), 0, state.room.depth - item.depth);
    state.items.push({ ...clone(item), id: uid("item"), x, y, rotation: item.rotation || 0, color: item.color });
    state.selectedItemId = state.items[state.items.length - 1].id;
    state.selectedWallId = null;
    setStatus(`Added ${item.name}`);
    renderAll({ catalog: false });
  }

  function duplicateSelectedItem() {
    const selected = getSelectedItem();
    if (!selected) return;
    pushHistory();
    const duplicate = clone(selected);
    duplicate.id = uid("item");
    duplicate.x = clamp(selected.x + 26, 0, state.room.width - selected.width);
    duplicate.y = clamp(selected.y + 26, 0, state.room.depth - selected.depth);
    state.items.push(duplicate);
    state.selectedItemId = duplicate.id;
    setStatus(`Duplicated ${duplicate.name}`);
    renderAll({ catalog: false });
  }

  function deleteSelected() {
    const item = getSelectedItem();
    const wall = getSelectedWall();
    if (!item && !wall) return;
    pushHistory();
    if (item) {
      state.items = state.items.filter((entry) => entry.id !== item.id);
      state.selectedItemId = null;
    }
    if (wall) {
      state.walls = state.walls.filter((entry) => entry.id !== wall.id);
      state.selectedWallId = null;
    }
    setStatus(item ? `Deleted ${item.name}` : "Deleted wall");
    renderAll({ catalog: false });
  }

  function addWall(start, end) {
    pushHistory();
    state.walls.push({ id: uid("wall"), x1: snapValue(start.x), y1: snapValue(start.y), x2: snapValue(end.x), y2: snapValue(end.y), thickness: 15 });
    state.selectedWallId = state.walls[state.walls.length - 1].id;
    state.selectedItemId = null;
    setStatus("Wall added");
    renderAll({ catalog: false });
  }

  function fitView() {
    state.scale = 1;
  }

  function findLibraryItem(name) {
    const catalogItems = getCatalogItems();
    const alias = PRESET_ITEM_ALIASES[name] || {};
    const requestedWidth = alias.width || Number((String(name).match(/\b(\d{2,4})\b/) || [])[1]);
    const familyCandidate = normalizePresetName(alias.family || normalizePresetName(name).split(" ").slice(0, 2).join(" "));
    const exact = catalogItems.find((entry) => entry.name === name);
    if (exact) return exact;

    const familyMatches = catalogItems.filter((entry) => {
      const haystack = normalizePresetName([entry.name, entry.family, entry.sourceSlug, entry.variant].filter(Boolean).join(" "));
      return haystack.includes(familyCandidate);
    });

    if (!familyMatches.length) return null;
    if (!requestedWidth) return familyMatches[0];

    let best = familyMatches[0];
    let bestDiff = Math.abs(Number(best.width) - requestedWidth);
    familyMatches.forEach((entry) => {
      const diff = Math.abs(Number(entry.width) - requestedWidth);
      if (diff < bestDiff) {
        best = entry;
        bestDiff = diff;
      }
    });
    return best;
  }

  function applyLayoutPreset(key, options = {}) {
    const layout = LAYOUT_PRESETS[key];
    if (!layout) return;
    if (!options.skipHistory) pushHistory();
    state.selectedLayoutKey = key;
    state.room = clone(layout.room);
    state.items = [];
    state.walls = layout.walls.map((wall) => ({ ...wall, id: uid("wall") }));
    let missingSeeds = 0;
    layout.items.forEach((seed) => {
      const base = findLibraryItem(seed.name);
      if (!base) {
        missingSeeds += 1;
        return;
      }
      state.items.push({ ...clone(base), id: uid("item"), x: seed.x, y: seed.y, rotation: seed.rotation || 0, color: seed.color || base.color });
    });
    state.selectedItemId = null;
    state.selectedWallId = null;
    state.hoveredItemId = null;
    state.wallDraftStart = null;
    state.previewPoint = null;
    fitView();
    setStatus(missingSeeds ? `${layout.label} loaded with ${missingSeeds} skipped items` : `${layout.label} loaded`);
    renderAll();
  }

  function savePlan() {
    const payload = { version: "planner-app-3", room: state.room, items: state.items, walls: state.walls, selectedLayoutKey: state.selectedLayoutKey, savedAt: new Date().toISOString() };
    localStorage.setItem("oneonly-planner-save", JSON.stringify(payload));
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "workspace-plan.json";
    link.click();
    URL.revokeObjectURL(url);
    setStatus("Plan saved");
  }

  function loadPlan(payloadText) {
    const parsed = JSON.parse(payloadText);
    if (!parsed || !parsed.room || !Array.isArray(parsed.items) || !Array.isArray(parsed.walls)) throw new Error("Invalid planner file.");
    pushHistory();
    state.room = clone(parsed.room);
    state.items = clone(parsed.items);
    state.walls = clone(parsed.walls);
    state.selectedLayoutKey = parsed.selectedLayoutKey || "focus";
    state.selectedItemId = null;
    state.selectedWallId = null;
    state.hoveredItemId = null;
    fitView();
    setStatus("Plan loaded");
    renderAll();
  }

  function exportPng() {
    const exportSvg = svg.cloneNode(true);
    exportSvg.querySelectorAll("image").forEach((image) => {
      const href = image.getAttribute("href") || image.getAttributeNS("http://www.w3.org/1999/xlink", "href");
      if (href && !/^https?:/i.test(href)) image.setAttribute("href", new URL(href, window.location.href).href);
    });
    const blob = new Blob([exportSvg.outerHTML], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = stage.clientWidth * 2;
      canvas.height = stage.clientHeight * 2;
      const context = canvas.getContext("2d");
      context.fillStyle = "#d4deed";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const link = document.createElement("a");
      link.download = "workspace-plan.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      setStatus("PNG exported");
    };
    image.src = url;
  }

  function bindCanvasEvents() {
    svg.addEventListener("pointerdown", (event) => {
      const itemElement = event.target.closest("[data-item-id]");
      const wallElement = event.target.closest("[data-wall-id]");
      const point = getWorldPoint(event);

      if (state.tool === "wall") {
        if (!state.wallDraftStart) {
          state.wallDraftStart = { x: clamp(snapValue(point.x), 0, state.room.width), y: clamp(snapValue(point.y), 0, state.room.depth) };
          state.previewPoint = state.wallDraftStart;
          setStatus("Wall start placed");
          renderCanvas();
          return;
        }
        const end = { x: clamp(snapValue(point.x), 0, state.room.width), y: clamp(snapValue(point.y), 0, state.room.depth) };
        if (distance(state.wallDraftStart.x, state.wallDraftStart.y, end.x, end.y) > 5) {
          addWall(state.wallDraftStart, end);
          state.wallDraftStart = end;
          state.previewPoint = end;
        }
        return;
      }

      if (itemElement) {
        state.selectedItemId = itemElement.getAttribute("data-item-id");
        state.selectedWallId = null;
        const item = getSelectedItem();
        pushHistory();
        state.dragState = { type: "item", id: item.id, dx: point.x - item.x, dy: point.y - item.y };
        renderAll({ catalog: false });
        return;
      }

      if (wallElement) {
        state.selectedWallId = wallElement.getAttribute("data-wall-id");
        state.selectedItemId = null;
        renderAll({ catalog: false });
        return;
      }

      state.selectedItemId = null;
      state.selectedWallId = null;
      renderAll({ catalog: false });
    });

    svg.addEventListener("pointermove", (event) => {
      const point = getWorldPoint(event);
      const itemElement = event.target.closest("[data-item-id]");
      const hoveredItemId = itemElement ? itemElement.getAttribute("data-item-id") : null;
      if (hoveredItemId !== state.hoveredItemId && !state.dragState) {
        state.hoveredItemId = hoveredItemId;
        renderCanvas();
      }
      if (state.tool === "wall" && state.wallDraftStart) {
        state.previewPoint = { x: clamp(snapValue(point.x), 0, state.room.width), y: clamp(snapValue(point.y), 0, state.room.depth) };
        renderCanvas();
      }
      if (state.dragState && state.dragState.type === "item") {
        const item = getSelectedItem();
        if (!item) return;
        item.x = clamp(snapValue(point.x - state.dragState.dx), 0, state.room.width - item.width);
        item.y = clamp(snapValue(point.y - state.dragState.dy), 0, state.room.depth - item.depth);
        renderCanvas();
      }
    });

    svg.addEventListener("pointerleave", () => {
      if (!state.dragState && state.hoveredItemId) {
        state.hoveredItemId = null;
        renderCanvas();
      }
    });

    window.addEventListener("pointerup", () => {
      if (state.dragState && state.dragState.type === "item") {
        state.dragState = null;
        renderSelectionPanel();
      }
    });

    stage.addEventListener("dragover", (event) => {
      event.preventDefault();
      dropHint.classList.remove("hidden");
    });

    stage.addEventListener("dragleave", () => {
      dropHint.classList.add("hidden");
    });

    stage.addEventListener("drop", (event) => {
      event.preventDefault();
      dropHint.classList.add("hidden");
      const itemId = event.dataTransfer.getData("text/planner-item");
      const item = getCatalogItemById(itemId);
      if (!item) return;
      addItem(item, getWorldPoint(event));
    });
  }

  function bindUi() {
    catalogList.addEventListener("click", (event) => {
      const categoryButton = event.target.closest("[data-category]");
      if (categoryButton) {
        const category = categoryButton.getAttribute("data-category");
        state.openCategories[category] = !state.openCategories[category];
        state.catalogDirty = true;
        renderCatalog();
        return;
      }

      const itemButton = event.target.closest("[data-item-id]");
      if (!itemButton) return;
      const item = getCatalogItemById(itemButton.getAttribute("data-item-id"));
      addItem(item, { x: state.room.width / 2, y: state.room.depth / 2 });
    });

    catalogList.addEventListener("dragstart", (event) => {
      const itemButton = event.target.closest("[data-item-id]");
      if (!itemButton) return;
      const item = getCatalogItemById(itemButton.getAttribute("data-item-id"));
      if (!item) return;
      itemButton.classList.add("dragging");
      event.dataTransfer.setData("text/planner-item", item.id);
      dropHint.classList.remove("hidden");
    });

    catalogList.addEventListener("dragend", (event) => {
      const itemButton = event.target.closest("[data-item-id]");
      if (!itemButton) return;
      itemButton.classList.remove("dragging");
      dropHint.classList.add("hidden");
    });

    searchInput.addEventListener("input", () => {
      clearTimeout(state.searchTimer);
      state.searchTimer = window.setTimeout(() => {
        state.search = searchInput.value;
        state.catalogDirty = true;
        renderCatalog();
      }, 80);
    });

    roomWidthInput.addEventListener("change", () => {
      pushHistory();
      state.room.width = clamp(Number(roomWidthInput.value) || 1010, 200, 5000);
      fitView();
      setStatus("Room width updated");
      renderAll({ catalog: false });
    });

    roomDepthInput.addEventListener("change", () => {
      pushHistory();
      state.room.depth = clamp(Number(roomDepthInput.value) || 600, 200, 5000);
      fitView();
      setStatus("Room depth updated");
      renderAll({ catalog: false });
    });

    document.querySelectorAll("[data-room-preset]").forEach((button) => button.addEventListener("click", () => {
      const parts = button.getAttribute("data-room-preset").split("x").map(Number);
      pushHistory();
      state.room.width = parts[0];
      state.room.depth = parts[1];
      state.selectedLayoutKey = "focus";
      fitView();
      setStatus("Room preset applied");
      renderAll({ catalog: false });
    }));

    document.querySelectorAll("[data-layout]").forEach((button) => button.addEventListener("click", () => applyLayoutPreset(button.getAttribute("data-layout"))));

    document.getElementById("btn-new").addEventListener("click", () => {
      pushHistory();
      state.items = [];
      state.walls = [];
      state.selectedItemId = null;
      state.selectedWallId = null;
      state.hoveredItemId = null;
      state.selectedLayoutKey = "focus";
      state.wallDraftStart = null;
      state.previewPoint = null;
      fitView();
      setStatus("New plan started");
      renderAll({ catalog: false });
    });

    document.getElementById("btn-tool-select").addEventListener("click", () => {
      state.tool = "select";
      state.wallDraftStart = null;
      state.previewPoint = null;
      renderAll({ catalog: false });
    });

    document.getElementById("btn-tool-wall").addEventListener("click", () => {
      state.tool = "wall";
      state.selectedItemId = null;
      state.selectedWallId = null;
      setStatus("Wall tool active");
      renderAll({ catalog: false });
    });

    document.getElementById("btn-undo").addEventListener("click", undo);
    document.getElementById("btn-redo").addEventListener("click", redo);
    document.getElementById("btn-snap").addEventListener("click", () => { state.snap = !state.snap; renderAll({ catalog: false }); });
    document.getElementById("btn-labels").addEventListener("click", () => { state.labels = !state.labels; renderAll({ catalog: false }); });
    document.getElementById("btn-dims").addEventListener("click", () => { state.dims = !state.dims; renderAll({ catalog: false }); });
    document.getElementById("btn-view-2d").addEventListener("click", () => { state.view = "2d"; renderAll({ catalog: false }); });
    document.getElementById("btn-view-3d").addEventListener("click", () => { state.view = "2.5d"; renderAll({ catalog: false }); });
    document.getElementById("btn-zoom-in").addEventListener("click", () => { state.scale = clamp(Number((state.scale + 0.1).toFixed(2)), 0.6, 2.6); renderCanvas(); updateHud(); });
    document.getElementById("btn-zoom-out").addEventListener("click", () => { state.scale = clamp(Number((state.scale - 0.1).toFixed(2)), 0.6, 2.6); renderCanvas(); updateHud(); });
    document.getElementById("btn-zoom-fit").addEventListener("click", () => { fitView(); renderCanvas(); updateHud(); });
    document.getElementById("btn-save").addEventListener("click", savePlan);
    document.getElementById("btn-load").addEventListener("click", () => loadInput.click());
    document.getElementById("btn-export").addEventListener("click", exportPng);

    loadInput.addEventListener("change", () => {
      const file = loadInput.files && loadInput.files[0];
      if (!file) return;
      file.text().then(loadPlan).catch((error) => setStatus(error.message || "Could not load plan")).finally(() => { loadInput.value = ""; });
    });

    window.addEventListener("keydown", (event) => {
      const modifier = event.ctrlKey || event.metaKey;
      const activeTag = document.activeElement ? document.activeElement.tagName : "";
      const typing = activeTag === "INPUT" || activeTag === "TEXTAREA";
      if (modifier && event.key.toLowerCase() === "z") { event.preventDefault(); undo(); return; }
      if (modifier && event.key.toLowerCase() === "y") { event.preventDefault(); redo(); return; }
      if (modifier && event.key.toLowerCase() === "d") { event.preventDefault(); duplicateSelectedItem(); return; }
      if (modifier && event.key.toLowerCase() === "s") { event.preventDefault(); savePlan(); return; }
      if (typing) return;
      if (event.key === "Delete" || event.key === "Backspace") { event.preventDefault(); deleteSelected(); return; }
      if (event.key.toLowerCase() === "r" && getSelectedItem()) { event.preventDefault(); pushHistory(); getSelectedItem().rotation = (getSelectedItem().rotation + 90) % 360; renderAll({ catalog: false }); return; }
      if (event.key.toLowerCase() === "w") { state.tool = "wall"; renderAll({ catalog: false }); return; }
      if (event.key.toLowerCase() === "s") { state.tool = "select"; state.wallDraftStart = null; state.previewPoint = null; renderAll({ catalog: false }); return; }
      if (event.key === "Escape") { state.tool = "select"; state.wallDraftStart = null; state.previewPoint = null; state.selectedItemId = null; state.selectedWallId = null; renderAll({ catalog: false }); }
    });

    window.addEventListener("resize", () => {
      renderCanvas();
      updateHud();
    });
  }

  bindUi();
  bindCanvasEvents();
  applyLayoutPreset("focus", { skipHistory: true });
  syncUndoRedo();
})();

