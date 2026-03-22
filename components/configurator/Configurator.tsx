"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Arc, Circle, Group, Layer, Line, Rect, Stage, Text } from "react-konva";
import {
  ArrowRight,
  DoorOpen,
  FlipHorizontal,
  Layers3,
  Plus,
  Redo2,
  RotateCw,
  Search,
  Square,
  Sparkles,
  SquareStack,
  Trash2,
  Undo2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  GRID_STEP_MM,
  INTERACTION_PADDING_MM,
  SNAP_STEP_MM,
} from "@/components/configurator/canvas/constants";
import type { InteriorWall, PlannerColumn, PlannerNote } from "@/components/configurator/canvas/domain";
import { getOpeningDefaultWidthMm, getOpeningTitle, isDoorOpening } from "@/components/configurator/canvas/openings";
import { PlannerToolbar } from "@/components/configurator/canvas/PlannerToolbar";
import type { PlannerTool } from "@/components/configurator/canvas/types";
import { RoomSetupPanel } from "@/components/configurator/panels/RoomSetupPanel";
import { CollapsibleSection } from "@/components/configurator/ui/CollapsibleSection";
import ThreeViewer from "@/components/ThreeViewer";
import {
  CATEGORY_META,
  LIBRARY,
} from "@/lib/planner/catalog";
import type {
  Opening,
  PlannerCategory,
  PlannerItem,
  QueryAction,
  QuerySuggestion,
  VariantDefinition,
} from "@/lib/planner/types";
import {
  INR,
  buildSeededWorkstations,
  clamp,
  createPlannerItem,
  createSceneFromPreset,
  formatDimension,
  getItemDimensions,
  getProduct,
  getVariant,
  getVariantArea,
  rectanglesOverlap,
} from "@/lib/planner/utils";
import { clearStoredScene, writeStoredScene } from "@/lib/planner/sceneStorage";

export function Configurator() {
  const initialScene = useMemo(() => createSceneFromPreset("compact-studio"), []);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const contextMenuRef = useRef<HTMLDivElement | null>(null);
  const importSceneRef = useRef<HTMLInputElement | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">("metric");
  const [activePreset, setActivePreset] = useState("compact-studio");
  const [room, setRoom] = useState(initialScene.room);
  const [seatTarget, setSeatTarget] = useState(initialScene.seatTarget);
  const [openings, setOpenings] = useState(initialScene.openings);
  const [items, setItems] = useState<PlannerItem[]>(initialScene.items);
  const [activeCategory, setActiveCategory] = useState<PlannerCategory>("workstations");
  const [catalogProductId, setCatalogProductId] = useState<string | null>(null);
  const [catalogSeatValue, setCatalogSeatValue] = useState<string>("all");
  const [catalogVariantId, setCatalogVariantId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(initialScene.items[0]?.id ?? null);
  const [selectedOpeningId, setSelectedOpeningId] = useState<string | null>(null);
  const [queryAction, setQueryAction] = useState<QueryAction>("what-fits");
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [showThreeD, setShowThreeD] = useState(false);
  const [activeTool, setActiveTool] = useState<PlannerTool>("select");
  const [showGrid, setShowGrid] = useState(true);
  const [snapGuide, setSnapGuide] = useState<{ xMm: number; yMm: number } | null>(null);
  const [wallDraftStart, setWallDraftStart] = useState<{ xMm: number; yMm: number } | null>(null);
  const [contextMenu, setContextMenu] = useState<{ open: boolean; x: number; y: number }>({
    open: false,
    x: 16,
    y: 16,
  });
  const [dragGuides, setDragGuides] = useState<{ xMm: number | null; yMm: number | null }>({
    xMm: null,
    yMm: null,
  });
  const [zoomLevel, setZoomLevel] = useState(1);

  /* ── AI Query Engine ─────────────────────────────────────── */
  const [aiQuery, setAiQuery] = useState("");
  const [aiThoughts, setAiThoughts] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<QuerySuggestion[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  type SceneState = {
    items: PlannerItem[];
    openings: Opening[];
    interiorWalls: InteriorWall[];
    columns: PlannerColumn[];
    notes: PlannerNote[];
  };
  const historyRef = useRef<SceneState[]>([]);
  const futureRef = useRef<SceneState[]>([]);
  const isUndoRedoRef = useRef(false);
  const [interiorWalls, setInteriorWalls] = useState<InteriorWall[]>([]);
  const [columns, setColumns] = useState<PlannerColumn[]>([]);
  const [notes, setNotes] = useState<PlannerNote[]>([]);

  /* ── Undo / Redo ─────────────────────────────────────────── */
  const prevItemsRef = useRef(items);
  const prevOpeningsRef = useRef(openings);
  const prevWallsRef = useRef(interiorWalls);
  const prevColumnsRef = useRef(columns);
  const prevNotesRef = useRef(notes);

  useEffect(() => {
    if (isUndoRedoRef.current) {
      isUndoRedoRef.current = false;
      prevItemsRef.current = items;
      prevOpeningsRef.current = openings;
      prevWallsRef.current = interiorWalls;
      prevColumnsRef.current = columns;
      prevNotesRef.current = notes;
      return;
    }
    const changed =
      items !== prevItemsRef.current ||
      openings !== prevOpeningsRef.current ||
      interiorWalls !== prevWallsRef.current ||
      columns !== prevColumnsRef.current ||
      notes !== prevNotesRef.current;
    if (changed) {
      historyRef.current = [
        ...historyRef.current,
        {
          items: prevItemsRef.current,
          openings: prevOpeningsRef.current,
          interiorWalls: prevWallsRef.current,
          columns: prevColumnsRef.current,
          notes: prevNotesRef.current,
        },
      ];
      futureRef.current = [];
      prevItemsRef.current = items;
      prevOpeningsRef.current = openings;
      prevWallsRef.current = interiorWalls;
      prevColumnsRef.current = columns;
      prevNotesRef.current = notes;
    }
  }, [items, openings, interiorWalls, columns, notes]);

  function undo() {
    const prev = historyRef.current.pop();
    if (!prev) return;
    futureRef.current.push({
      items,
      openings,
      interiorWalls,
      columns,
      notes,
    });
    isUndoRedoRef.current = true;
    setItems(prev.items);
    setOpenings(prev.openings);
    setInteriorWalls(prev.interiorWalls);
    setColumns(prev.columns);
    setNotes(prev.notes);
  }

  function redo() {
    const next = futureRef.current.pop();
    if (!next) return;
    historyRef.current.push({
      items,
      openings,
      interiorWalls,
      columns,
      notes,
    });
    isUndoRedoRef.current = true;
    setItems(next.items);
    setOpenings(next.openings);
    setInteriorWalls(next.interiorWalls);
    setColumns(next.columns);
    setNotes(next.notes);
  }

  const [collapsedSections, setCollapsedSections] = useState({
    quickStart: true,
    openings: true,
    queryTools: true,
    openingDetails: true,
    details: true,
    variants: true,
    finishes: true,
    planningNote: true,
    threeD: true,
    nextMove: true,
  });

  useEffect(() => {
    if (!canvasRef.current) return undefined;

    const observer = new ResizeObserver(([entry]) => {
      setCanvasSize({
        width: Math.max(entry.contentRect.width, 720),
        height: clamp(entry.contentRect.height, 400, 900),
      });
    });

    observer.observe(canvasRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    canvasRef.current.style.cursor = activeTool === "select" ? "grab" : "crosshair";
  }, [activeTool]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const snapshot = {
      room,
      seatTarget,
      openings,
      items,
      interiorWalls,
      columns,
      notes,
      activePreset,
      selectedItemId,
      shortlist,
      savedAt: Date.now(),
    };

    writeStoredScene(snapshot);
  }, [
    room,
    seatTarget,
    openings,
    items,
    interiorWalls,
    columns,
    notes,
    activePreset,
    selectedItemId,
    shortlist,
  ]);

  const canvasMetrics = useMemo(() => {
    const width = Math.max(canvasSize.width, 720);
    const height = Math.max(canvasSize.height, 560);
    const gutter = 56;
    const fitScale = Math.min(
      (width - gutter - 22) / room.widthMm,
      (height - gutter - 22) / room.depthMm,
    );
    const scale = fitScale * zoomLevel;
    const roomPxWidth = room.widthMm * scale;
    const roomPxDepth = room.depthMm * scale;

    return {
      width,
      height,
      scale,
      roomX: gutter,
      roomY: gutter,
      roomPxWidth,
      roomPxDepth,
    };
  }, [canvasSize.height, canvasSize.width, room.depthMm, room.widthMm, zoomLevel]);

  const interactionPaddingMm = INTERACTION_PADDING_MM;
  const gridStepMm = GRID_STEP_MM;
  const snapStepMm = SNAP_STEP_MM;
  const rulerStepsX = useMemo(
    () =>
      Array.from({ length: Math.floor(room.widthMm / 1000) + 1 }, (_, index) => index * 1000),
    [room.widthMm],
  );
  const rulerStepsY = useMemo(
    () =>
      Array.from({ length: Math.floor(room.depthMm / 1000) + 1 }, (_, index) => index * 1000),
    [room.depthMm],
  );

  function snapMm(valueMm: number, stepMm = snapStepMm) {
    return Math.round(valueMm / stepMm) * stepMm;
  }

  function clampAndSnap(valueMm: number, minMm: number, maxMm: number, stepMm = snapStepMm) {
    return clamp(snapMm(valueMm, stepMm), minMm, maxMm);
  }

  const ALIGN_THRESHOLD_MM = 60;

  function computeAlignGuides(
    draggedId: string,
    dragXMm: number,
    dragYMm: number,
    dragWidthMm: number,
    dragDepthMm: number,
  ) {
    let bestDx = Infinity;
    let bestDy = Infinity;
    let guideXMm: number | null = null;
    let guideYMm: number | null = null;

    const dragEdges = {
      left: dragXMm,
      right: dragXMm + dragWidthMm,
      centerX: dragXMm + dragWidthMm / 2,
      top: dragYMm,
      bottom: dragYMm + dragDepthMm,
      centerY: dragYMm + dragDepthMm / 2,
    };

    for (const other of placedItems) {
      if (other.id === draggedId) continue;
      const oLeft = other.xMm;
      const oRight = other.xMm + other.dimensions.widthMm;
      const oCenterX = other.xMm + other.dimensions.widthMm / 2;
      const oTop = other.yMm;
      const oBottom = other.yMm + other.dimensions.depthMm;
      const oCenterY = other.yMm + other.dimensions.depthMm / 2;

      for (const de of [dragEdges.left, dragEdges.right, dragEdges.centerX]) {
        for (const oe of [oLeft, oRight, oCenterX]) {
          const d = Math.abs(de - oe);
          if (d < ALIGN_THRESHOLD_MM && d < bestDx) {
            bestDx = d;
            guideXMm = oe;
          }
        }
      }

      for (const de of [dragEdges.top, dragEdges.bottom, dragEdges.centerY]) {
        for (const oe of [oTop, oBottom, oCenterY]) {
          const d = Math.abs(de - oe);
          if (d < ALIGN_THRESHOLD_MM && d < bestDy) {
            bestDy = d;
            guideYMm = oe;
          }
        }
      }
    }

    return { xMm: guideXMm, yMm: guideYMm };
  }

  const placedItems = useMemo(
    () =>
      items
        .map((item) => {
          const product = getProduct(item.productId);
          const variant = getVariant(item.productId, item.variantId);

          if (!product || !variant) return null;

          return {
            ...item,
            product,
            variant,
            dimensions: getItemDimensions(item),
          };
        })
        .filter(Boolean) as Array<
        PlannerItem & {
          product: NonNullable<ReturnType<typeof getProduct>>;
          variant: VariantDefinition;
          dimensions: ReturnType<typeof getItemDimensions>;
        }
      >,
    [items],
  );

  const selectedItem = items.find((item) => item.id === selectedItemId) ?? null;
  const selectedOpening = openings.find((opening) => opening.id === selectedOpeningId) ?? null;
  const selectedProduct = selectedItem ? getProduct(selectedItem.productId) ?? null : null;
  const selectedVariant = selectedItem
    ? getVariant(selectedItem.productId, selectedItem.variantId) ?? null
    : null;
  const selectedDimensions = selectedItem ? getItemDimensions(selectedItem) : null;

  const findItemIdAtClientPoint = useCallback(
    (clientPoint: { x: number; y: number }) => {
      if (!canvasRef.current) return null;
      const rect = canvasRef.current.getBoundingClientRect();
      const stageX = clientPoint.x - rect.left;
      const stageY = clientPoint.y - rect.top;
      const xMm = (stageX - canvasMetrics.roomX) / canvasMetrics.scale;
      const yMm = (stageY - canvasMetrics.roomY) / canvasMetrics.scale;

      if (xMm < 0 || yMm < 0 || xMm > room.widthMm || yMm > room.depthMm) {
        return null;
      }

      for (let index = placedItems.length - 1; index >= 0; index -= 1) {
        const item = placedItems[index];
        if (
          xMm >= item.xMm &&
          xMm <= item.xMm + item.dimensions.widthMm &&
          yMm >= item.yMm &&
          yMm <= item.yMm + item.dimensions.depthMm
        ) {
          return item.id;
        }
      }

      return null;
    },
    [canvasMetrics.roomX, canvasMetrics.roomY, canvasMetrics.scale, room.widthMm, room.depthMm, placedItems],
  );

  const findOpeningIdAtClientPoint = useCallback(
    (clientPoint: { x: number; y: number }) => {
      if (!canvasRef.current) return null;
      const rect = canvasRef.current.getBoundingClientRect();
      const stageX = clientPoint.x - rect.left;
      const stageY = clientPoint.y - rect.top;

      for (let index = openings.length - 1; index >= 0; index -= 1) {
        const opening = openings[index];
        const openingX =
          opening.edge === "top" || opening.edge === "bottom"
            ? canvasMetrics.roomX + opening.offsetMm * canvasMetrics.scale
            : opening.edge === "left"
              ? canvasMetrics.roomX
              : canvasMetrics.roomX + canvasMetrics.roomPxWidth;
        const openingY =
          opening.edge === "left" || opening.edge === "right"
            ? canvasMetrics.roomY + opening.offsetMm * canvasMetrics.scale
            : opening.edge === "top"
              ? canvasMetrics.roomY
              : canvasMetrics.roomY + canvasMetrics.roomPxDepth;
        const isHorizontal = opening.edge === "top" || opening.edge === "bottom";
        const spanPx = opening.widthMm * canvasMetrics.scale;
        // For doors, include the swing arc area (opening.widthMm deep into the room).
        // For windows, just a wall-edge strip.
        const arcDepthPx = isDoorOpening(opening.type) ? spanPx : 18;

        if (isHorizontal) {
          const withinX = stageX >= openingX - 12 && stageX <= openingX + spanPx + 12;
          const inward =
            opening.edge === "top"
              ? stageY >= openingY - 14 && stageY <= openingY + arcDepthPx
              : stageY >= openingY - arcDepthPx && stageY <= openingY + 14;
          if (withinX && inward) return opening.id;
          continue;
        }

        const withinY = stageY >= openingY - 12 && stageY <= openingY + spanPx + 12;
        const inward =
          opening.edge === "left"
            ? stageX >= openingX - 14 && stageX <= openingX + arcDepthPx
            : stageX >= openingX - arcDepthPx && stageX <= openingX + 14;
        if (withinY && inward) return opening.id;
      }

      return null;
    },
    [
      canvasMetrics.roomX,
      canvasMetrics.roomY,
      canvasMetrics.roomPxWidth,
      canvasMetrics.roomPxDepth,
      canvasMetrics.scale,
      openings,
    ],
  );

  const seatCount = placedItems.reduce((total, item) => total + (item.variant.seatCount ?? 0), 0);
  const totalValue = placedItems.reduce((total, item) => total + item.variant.priceInr, 0);
  const collisions = useMemo(() => {
    const overlaps = new Set<string>();

    for (let first = 0; first < placedItems.length; first += 1) {
      for (let second = first + 1; second < placedItems.length; second += 1) {
        const itemA = placedItems[first];
        const itemB = placedItems[second];

        if (
          rectanglesOverlap(
            {
              xMm: itemA.xMm,
              yMm: itemA.yMm,
              widthMm: itemA.dimensions.widthMm,
              depthMm: itemA.dimensions.depthMm,
            },
            {
              xMm: itemB.xMm,
              yMm: itemB.yMm,
              widthMm: itemB.dimensions.widthMm,
              depthMm: itemB.dimensions.depthMm,
            },
            120,
          )
        ) {
          overlaps.add(itemA.id);
          overlaps.add(itemB.id);
        }
      }
    }

    return overlaps;
  }, [placedItems]);
  const activeProducts = LIBRARY.filter((product) => product.category === activeCategory);
  const catalogProduct =
    activeProducts.find((product) => product.id === catalogProductId) ?? activeProducts[0] ?? null;
  const seatOptions = catalogProduct
    ? Array.from(
        new Set(
          catalogProduct.variants.map((variant) =>
            String(variant.seatCount ?? variant.unitCount ?? 1),
          ),
        ),
      )
    : [];
  const filteredCatalogVariants = catalogProduct
    ? catalogProduct.variants.filter((variant) =>
        catalogSeatValue === "all"
          ? true
          : String(variant.seatCount ?? variant.unitCount ?? 1) === catalogSeatValue,
      )
    : [];
  const catalogVariant =
    filteredCatalogVariants.find((variant) => variant.id === catalogVariantId) ??
    filteredCatalogVariants[0] ??
    catalogProduct?.variants[0] ??
    null;

  const querySuggestions = (() => {
    const usableWidth = room.widthMm - interactionPaddingMm * 2;
    const usableDepth = room.depthMm - interactionPaddingMm * 2;
    const selectedArea = selectedVariant ? getVariantArea(selectedVariant) : null;

    const candidates = LIBRARY.flatMap((product) =>
      product.variants.map((variant) => ({
        product,
        variant,
        area: getVariantArea(variant),
        density: (variant.seatCount ?? 0) / Math.max(getVariantArea(variant), 1),
        canFit:
          (variant.widthMm <= usableWidth && variant.depthMm <= usableDepth) ||
          (variant.depthMm <= usableWidth && variant.widthMm <= usableDepth),
      })),
    );

    if (queryAction === "what-fits") {
      return candidates
        .filter((candidate) => candidate.canFit)
        .sort((a, b) => b.density - a.density || a.area - b.area)
        .slice(0, 3)
        .map<QuerySuggestion>((candidate) => ({
          productId: candidate.product.id,
          variantId: candidate.variant.id,
          badge: "Fits room envelope",
          reason: `${candidate.product.name} fits the room shell and still leaves planning flexibility.`,
          canFit: true,
        }));
    }

    if (queryAction === "increase-seats") {
      return candidates
        .filter((candidate) => candidate.canFit && (candidate.variant.seatCount ?? 0) > 0)
        .sort((a, b) => b.density - a.density)
        .slice(0, 3)
        .map<QuerySuggestion>((candidate) => ({
          productId: candidate.product.id,
          variantId: candidate.variant.id,
          badge: `+${candidate.variant.seatCount ?? 0} seats`,
          reason: `${candidate.product.name} is one of the strongest seat-yield moves for this room size.`,
          canFit: true,
        }));
    }

    if (queryAction === "reduce-footprint" && selectedProduct && selectedArea) {
      return candidates
        .filter((candidate) => candidate.product.category === selectedProduct.category)
        .filter((candidate) => candidate.area < selectedArea)
        .sort((a, b) => a.area - b.area)
        .slice(0, 3)
        .map<QuerySuggestion>((candidate) => ({
          productId: candidate.product.id,
          variantId: candidate.variant.id,
          badge: "Smaller footprint",
          reason: `${candidate.product.name} reduces occupied area while keeping the room useful.`,
          canFit: candidate.canFit,
        }));
    }

    if (queryAction === "premium") {
      return candidates
        .filter((candidate) => candidate.canFit)
        .sort((a, b) => b.variant.priceInr - a.variant.priceInr)
        .slice(0, 3)
        .map<QuerySuggestion>((candidate) => ({
          productId: candidate.product.id,
          variantId: candidate.variant.id,
          badge: "Premium move",
          reason: `${candidate.product.name} lifts the spec and client-facing quality of the room.`,
          canFit: true,
        }));
    }

    if (queryAction === "lower-budget") {
      return candidates
        .filter((candidate) => candidate.canFit)
        .sort((a, b) => a.variant.priceInr - b.variant.priceInr)
        .slice(0, 3)
        .map<QuerySuggestion>((candidate) => ({
          productId: candidate.product.id,
          variantId: candidate.variant.id,
          badge: "Budget-friendly",
          reason: `${candidate.product.name} keeps the plan moving with less budget pressure.`,
          canFit: true,
        }));
    }

    return candidates
      .filter((candidate) =>
        selectedProduct ? candidate.product.category === selectedProduct.category : true,
      )
      .slice(0, 3)
      .map<QuerySuggestion>((candidate) => ({
        productId: candidate.product.id,
        variantId: candidate.variant.id,
        badge: "Compare side-by-side",
        reason: `${candidate.product.name} is a useful comparison point for the current selection.`,
        canFit: candidate.canFit,
      }));
  })();

  function buildSceneSnapshot() {
    return {
      room,
      seatTarget,
      openings,
      items,
      interiorWalls,
      columns,
      notes,
      activePreset,
      selectedItemId,
      shortlist,
      savedAt: Date.now(),
    };
  }

  function downloadScene() {
    if (typeof window === "undefined") return;
    const snapshot = buildSceneSnapshot();
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `planner-scene-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function applySceneSnapshot(snapshot: {
    room?: typeof room;
    seatTarget?: number;
    openings?: Opening[];
    items?: PlannerItem[];
    interiorWalls?: InteriorWall[];
    columns?: PlannerColumn[];
    notes?: PlannerNote[];
    activePreset?: string;
    selectedItemId?: string | null;
    shortlist?: string[];
  }) {
    if (snapshot.room) setRoom(snapshot.room);
    if (typeof snapshot.seatTarget === "number") setSeatTarget(snapshot.seatTarget);
    if (Array.isArray(snapshot.openings)) setOpenings(snapshot.openings);
    if (Array.isArray(snapshot.items)) setItems(snapshot.items);
    if (Array.isArray(snapshot.interiorWalls)) setInteriorWalls(snapshot.interiorWalls);
    if (Array.isArray(snapshot.columns)) setColumns(snapshot.columns);
    if (Array.isArray(snapshot.notes)) setNotes(snapshot.notes);
    if (typeof snapshot.activePreset === "string") setActivePreset(snapshot.activePreset);
    if (typeof snapshot.selectedItemId === "string" || snapshot.selectedItemId === null) {
      setSelectedItemId(snapshot.selectedItemId);
    } else if (Array.isArray(snapshot.items)) {
      setSelectedItemId(snapshot.items[0]?.id ?? null);
    }
    setSelectedOpeningId(null);
    if (Array.isArray(snapshot.shortlist)) setShortlist(snapshot.shortlist);
  }

  function loadSceneFromFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const snapshot = JSON.parse(String(reader.result ?? "")) as {
          room?: typeof room;
          seatTarget?: number;
          openings?: Opening[];
          items?: PlannerItem[];
          interiorWalls?: InteriorWall[];
          columns?: PlannerColumn[];
          notes?: PlannerNote[];
          activePreset?: string;
          selectedItemId?: string | null;
          shortlist?: string[];
        };
        applySceneSnapshot(snapshot);
      } catch {
        // Ignore malformed files; keep current scene.
      }
    };
    reader.readAsText(file);
  }

  function resetCanvas() {
    const nextScene = createSceneFromPreset("compact-studio");
    historyRef.current = [];
    futureRef.current = [];
    isUndoRedoRef.current = true;
    setRoom(nextScene.room);
    setSeatTarget(nextScene.seatTarget);
    setOpenings(nextScene.openings);
    setItems(nextScene.items);
    setSelectedItemId(nextScene.items[0]?.id ?? null);
    setSelectedOpeningId(null);
    setInteriorWalls([]);
    setColumns([]);
    setNotes([]);
    setShortlist([]);
    setShowThreeD(false);
    setActiveTool("select");
    setSnapGuide(null);
    setWallDraftStart(null);
    clearStoredScene();
  }

  function addProduct(productId: string, variantId?: string) {
    const product = getProduct(productId);
    const variant = getVariant(productId, variantId ?? product?.variants[0].id ?? "");
    if (!product || !variant) return;

    const nextItem = createPlannerItem(
      product.id,
      variant.id,
      clamp(
        interactionPaddingMm + 500 + items.length * 80,
        interactionPaddingMm,
        room.widthMm - variant.widthMm - interactionPaddingMm,
      ),
      clamp(
        interactionPaddingMm + 600 + items.length * 50,
        interactionPaddingMm,
        room.depthMm - variant.depthMm - interactionPaddingMm,
      ),
      product.finishes[0],
    );

    setItems((current) => [...current, nextItem]);
    setSelectedItemId(nextItem.id);
    setSelectedOpeningId(null);
  }

  function updateSelectedItem(patch: Partial<PlannerItem>) {
    if (!selectedItem) return;
    setItems((current) =>
      current.map((item) => (item.id === selectedItem.id ? { ...item, ...patch } : item)),
    );
  }

  function rotateSelectedItem() {
    if (!selectedItem || !selectedVariant) return;
    const nextRotation = selectedItem.rotation === 90 ? 0 : 90;
    const rotatedWidth = nextRotation === 90 ? selectedVariant.depthMm : selectedVariant.widthMm;
    const rotatedDepth = nextRotation === 90 ? selectedVariant.widthMm : selectedVariant.depthMm;

    updateSelectedItem({
      rotation: nextRotation,
      xMm: clamp(selectedItem.xMm, 0, Math.max(0, room.widthMm - rotatedWidth)),
      yMm: clamp(selectedItem.yMm, 0, Math.max(0, room.depthMm - rotatedDepth)),
    });
  }

  function flipSelectedItem() {
    if (!selectedItem) return;
    updateSelectedItem({ mirrored: !selectedItem.mirrored });
  }

  function deleteSelectedItem() {
    if (!selectedItem) return;
    setItems((current) => current.filter((item) => item.id !== selectedItem.id));
    setSelectedItemId(null);
    setShowThreeD(false);
  }

  function duplicateSelectedItem() {
    if (!selectedItem) return;
    const duplicate = createPlannerItem(
      selectedItem.productId,
      selectedItem.variantId,
      clampAndSnap(
        selectedItem.xMm + 250,
        interactionPaddingMm,
        room.widthMm - interactionPaddingMm - getItemDimensions(selectedItem).widthMm,
      ),
      clampAndSnap(
        selectedItem.yMm + 250,
        interactionPaddingMm,
        room.depthMm - interactionPaddingMm - getItemDimensions(selectedItem).depthMm,
      ),
      selectedItem.finish,
      selectedItem.rotation,
      selectedItem.mirrored ?? false,
    );
    setItems((current) => [...current, duplicate]);
    setSelectedItemId(duplicate.id);
    setSelectedOpeningId(null);
  }

  function rotateSelectedOpening() {
    if (!selectedOpening) return;
    // Cycle through wall edges: top → right → bottom → left → top (90° steps)
    const edgeCycle: Array<Opening["edge"]> = ["top", "right", "bottom", "left"];
    const currentIndex = edgeCycle.indexOf(selectedOpening.edge);
    const nextEdge = edgeCycle[(currentIndex + 1) % 4];
    // Clamp offset to the new edge's wall span
    const newSpanMm = nextEdge === "top" || nextEdge === "bottom" ? room.widthMm : room.depthMm;
    const nextOffsetMm = clamp(selectedOpening.offsetMm, 150, Math.max(150, newSpanMm - selectedOpening.widthMm - 150));
    setOpenings((current) =>
      current.map((opening) =>
        opening.id === selectedOpening.id ? { ...opening, edge: nextEdge, offsetMm: nextOffsetMm } : opening,
      ),
    );
  }

  function flipSelectedOpening() {
    if (!selectedOpening) return;
    const spanMm =
      selectedOpening.edge === "top" || selectedOpening.edge === "bottom"
        ? room.widthMm
        : room.depthMm;
    const nextOffsetMm = clamp(
      spanMm - selectedOpening.widthMm - selectedOpening.offsetMm,
      150,
      Math.max(150, spanMm - selectedOpening.widthMm - 150),
    );
    setOpenings((current) =>
      current.map((opening) =>
        opening.id === selectedOpening.id ? { ...opening, offsetMm: nextOffsetMm } : opening,
      ),
    );
  }

  function deleteSelectedOpening() {
    if (!selectedOpening) return;
    setOpenings((current) => current.filter((opening) => opening.id !== selectedOpening.id));
    setSelectedOpeningId(null);
  }

  function rotateSelectedEntity() {
    if (selectedItem) {
      rotateSelectedItem();
      return;
    }
    if (selectedOpening) {
      rotateSelectedOpening();
    }
  }

  function flipSelectedEntity() {
    if (selectedItem) {
      flipSelectedItem();
      return;
    }
    if (selectedOpening) {
      flipSelectedOpening();
    }
  }

  function deleteSelectedEntity() {
    if (selectedItem) {
      deleteSelectedItem();
      return;
    }
    if (selectedOpening) {
      deleteSelectedOpening();
    }
  }

  async function runAiQuery() {
    const q = aiQuery.trim();
    if (!q || aiLoading) return;
    setAiLoading(true);
    setAiError(null);
    setAiThoughts(null);
    setAiSuggestions([]);

    try {
      const res = await fetch("/api/planner/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: q,
          roomWidthMm: room.widthMm,
          roomDepthMm: room.depthMm,
          seatTarget,
          currentItemCount: items.length,
        }),
      });

      if (!res.ok || !res.body) {
        setAiError("Could not reach the AI engine. Check ANTHROPIC_API_KEY.");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
      }

      const json = JSON.parse(accumulated.trim()) as {
        thoughts?: string;
        suggestions?: Array<{
          productId: string;
          variantId: string;
          badge: string;
          reason: string;
          xMm?: number | null;
          yMm?: number | null;
          rotation?: 0 | 90;
        }>;
      };

      setAiThoughts(json.thoughts ?? null);
      const validated: QuerySuggestion[] = (json.suggestions ?? [])
        .filter(
          (s) =>
            LIBRARY.find((p) => p.id === s.productId)?.variants.find((v) => v.id === s.variantId),
        )
        .map((s) => {
          const usableWidth = room.widthMm - interactionPaddingMm * 2;
          const usableDepth = room.depthMm - interactionPaddingMm * 2;
          const variant = LIBRARY.find((p) => p.id === s.productId)!.variants.find(
            (v) => v.id === s.variantId,
          )!;
          const canFit =
            (variant.widthMm <= usableWidth && variant.depthMm <= usableDepth) ||
            (variant.depthMm <= usableWidth && variant.widthMm <= usableDepth);
          return { productId: s.productId, variantId: s.variantId, badge: s.badge, reason: s.reason, canFit };
        });
      setAiSuggestions(validated);
    } catch {
      setAiError("Failed to parse AI response. Try again.");
    } finally {
      setAiLoading(false);
    }
  }

  function toggleSection(section: keyof typeof collapsedSections) {
    setCollapsedSections((current) => ({
      ...current,
      [section]: !current[section],
    }));
  }

  function setPlannerTool(tool: PlannerTool) {
    setActiveTool(tool);
    if (tool !== "wall" && wallDraftStart) {
      setWallDraftStart(null);
    }
  }

  const handleCanvasRightClick = useCallback((clientPoint?: { x: number; y: number }) => {
    // CAD-like escape action: never wipe scene, only clear active draw intent.
    setSnapGuide(null);
    setWallDraftStart(null);
    if (activeTool !== "select") {
      setActiveTool("select");
    }
    if (clientPoint && canvasRef.current) {
      const hitItemId = findItemIdAtClientPoint(clientPoint);
      const hitOpeningId = hitItemId ? null : findOpeningIdAtClientPoint(clientPoint);
      setSelectedItemId(hitItemId);
      setSelectedOpeningId(hitOpeningId);

      const rect = canvasRef.current.getBoundingClientRect();
      const menuWidth = 200;
      const menuHeight = 220;
      const x = clamp(
        clientPoint.x - rect.left,
        8,
        Math.max(8, rect.width - menuWidth - 8),
      );
      const y = clamp(
        clientPoint.y - rect.top,
        8,
        Math.max(8, rect.height - menuHeight - 8),
      );
      setContextMenu({ open: true, x, y });
    }
  }, [activeTool, findItemIdAtClientPoint, findOpeningIdAtClientPoint]);

  function closeContextMenu() {
    setContextMenu((current) => (current.open ? { ...current, open: false } : current));
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleCanvasRightClick();
        closeContextMenu();
        return;
      }
      if ((event.ctrlKey || event.metaKey) && event.key === "z" && !event.shiftKey) {
        event.preventDefault();
        undo();
        return;
      }
      if (
        ((event.ctrlKey || event.metaKey) && event.key === "y") ||
        ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === "z")
      ) {
        event.preventDefault();
        redo();
        return;
      }
      if (event.key === "Delete" || event.key === "Backspace") {
        if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "SELECT" || document.activeElement?.tagName === "TEXTAREA") return;
        deleteSelectedEntity();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleCanvasRightClick]);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!contextMenu.open) return;
      const target = event.target as Node | null;
      if (!target) return;
      if (contextMenuRef.current?.contains(target)) return;
      closeContextMenu();
    }

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [contextMenu.open]);

  useEffect(() => {
    function onCanvasContextMenu(event: MouseEvent) {
      const target = event.target as Node | null;
      if (!canvasRef.current || !target) return;
      if (!canvasRef.current.contains(target)) return;
      event.preventDefault();
      handleCanvasRightClick({ x: event.clientX, y: event.clientY });
    }

    window.addEventListener("contextmenu", onCanvasContextMenu, { capture: true });
    return () => window.removeEventListener("contextmenu", onCanvasContextMenu, { capture: true });
  }, [handleCanvasRightClick]);

  function addOpening(type: "door" | "double-door" | "window") {
    setOpenings((current) => [
      ...current,
      {
        id: `${type}-${Date.now()}`,
        type,
        edge: type === "window" ? "top" : "bottom",
        offsetMm: 1800,
        widthMm: getOpeningDefaultWidthMm(type),
        hinge: "start",
      },
    ]);
  }

  function getNearestEdge(xMm: number, yMm: number): Opening["edge"] {
    const distances = [
      { edge: "top" as const, value: yMm },
      { edge: "bottom" as const, value: Math.abs(room.depthMm - yMm) },
      { edge: "left" as const, value: xMm },
      { edge: "right" as const, value: Math.abs(room.widthMm - xMm) },
    ];

    return distances.sort((a, b) => a.value - b.value)[0].edge;
  }

  function addOpeningAtPoint(type: "door" | "double-door" | "window", xMm: number, yMm: number) {
    const edge = getNearestEdge(xMm, yMm);
    const widthMm = getOpeningDefaultWidthMm(type);
    const offsetMm =
      edge === "top" || edge === "bottom"
        ? clamp(xMm - widthMm / 2, 150, room.widthMm - widthMm - 150)
        : clamp(yMm - widthMm / 2, 150, room.depthMm - widthMm - 150);

    setOpenings((current) => [
      ...current,
      {
        id: `${type}-${Date.now()}`,
        type,
        edge,
        offsetMm,
        widthMm,
        hinge: "start",
      },
    ]);
  }

  function handleCanvasAction(xMm: number, yMm: number) {
    const snappedXMm = snapMm(xMm);
    const snappedYMm = snapMm(yMm);

    if (activeTool === "wall") {
      if (!wallDraftStart) {
        setWallDraftStart({
          xMm: clampAndSnap(snappedXMm, interactionPaddingMm, room.widthMm - interactionPaddingMm),
          yMm: clampAndSnap(snappedYMm, interactionPaddingMm, room.depthMm - interactionPaddingMm),
        });
        return;
      }

      const nextX2 = clampAndSnap(
        snappedXMm,
        interactionPaddingMm,
        room.widthMm - interactionPaddingMm,
      );
      const nextY2 = clampAndSnap(
        snappedYMm,
        interactionPaddingMm,
        room.depthMm - interactionPaddingMm,
      );

      if (nextX2 === wallDraftStart.xMm && nextY2 === wallDraftStart.yMm) {
        return;
      }

      setInteriorWalls((current) => [
        ...current,
        {
          id: `wall-${Date.now()}`,
          x1Mm: wallDraftStart.xMm,
          y1Mm: wallDraftStart.yMm,
          x2Mm: nextX2,
          y2Mm: nextY2,
        },
      ]);
      setWallDraftStart({ xMm: nextX2, yMm: nextY2 });
      return;
    }

    if (activeTool === "column") {
      setColumns((current) => [
        ...current,
        {
          id: `column-${Date.now()}`,
          xMm: clampAndSnap(
            snappedXMm - 225,
            interactionPaddingMm,
            room.widthMm - interactionPaddingMm - 450,
          ),
          yMm: clampAndSnap(
            snappedYMm - 225,
            interactionPaddingMm,
            room.depthMm - interactionPaddingMm - 450,
          ),
          widthMm: 450,
          depthMm: 450,
        },
      ]);
      setActiveTool("select");
      return;
    }

    if (activeTool === "note") {
      setNotes((current) => [
        ...current,
        {
          id: `note-${Date.now()}`,
          xMm: clampAndSnap(
            snappedXMm,
            interactionPaddingMm,
            room.widthMm - interactionPaddingMm - 1000,
          ),
          yMm: clampAndSnap(
            snappedYMm,
            interactionPaddingMm,
            room.depthMm - interactionPaddingMm - 300,
          ),
          text: "Planning note",
        },
      ]);
      setActiveTool("select");
      return;
    }

    if (activeTool === "door" || activeTool === "window") {
      addOpeningAtPoint(activeTool, xMm, yMm);
      setActiveTool("select");
      return;
    }

    if (activeTool === "product" && catalogProduct && catalogVariant) {
      const nextItem = createPlannerItem(
        catalogProduct.id,
        catalogVariant.id,
        clampAndSnap(
          snappedXMm - catalogVariant.widthMm / 2,
          interactionPaddingMm,
          room.widthMm - interactionPaddingMm - catalogVariant.widthMm,
        ),
        clampAndSnap(
          snappedYMm - catalogVariant.depthMm / 2,
          interactionPaddingMm,
          room.depthMm - interactionPaddingMm - catalogVariant.depthMm,
        ),
        catalogProduct.finishes[0],
      );
      setItems((current) => [...current, nextItem]);
      setSelectedItemId(nextItem.id);
      setSelectedOpeningId(null);
      setActiveTool("select");
    }
  }

  const leftRail = (
    <aside className="space-y-3">
      <RoomSetupPanel
        room={room}
        seatTarget={seatTarget}
        unitSystem={unitSystem}
        onUnitSystemChange={setUnitSystem}
        onWidthChange={(value) =>
          setRoom((current) => ({
            ...current,
            widthMm: clamp(value, 5000, 30000),
          }))
        }
        onDepthChange={(value) =>
          setRoom((current) => ({
            ...current,
            depthMm: clamp(value, 4000, 24000),
          }))
        }
        onClearanceChange={(value) =>
          setRoom((current) => ({
            ...current,
            clearanceMm: clamp(value, 600, 1500),
          }))
        }
        onSeatTargetChange={(value) => setSeatTarget(clamp(value, 4, 120))}
        onSeedLayout={() => {
          const seeded = buildSeededWorkstations(seatTarget);
          setItems(seeded);
          setSelectedItemId(seeded[0]?.id ?? null);
          setSelectedOpeningId(null);
        }}
      />

      <div className="rounded-[1rem] border border-soft bg-panel p-2.5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-strong">Add product</p>
          </div>
          <Layers3 className="h-4 w-4 text-subtle" />
        </div>
        <label className="mt-2.5 block space-y-1.5">
          <span className="text-[11px] font-medium text-subtle">Category</span>
          <select
            value={activeCategory}
            onChange={(event) => {
              const category = event.target.value as PlannerCategory;
              const nextProducts = LIBRARY.filter((product) => product.category === category);
              setActiveCategory(category);
              setCatalogProductId(nextProducts[0]?.id ?? null);
              setCatalogSeatValue("all");
              setCatalogVariantId(nextProducts[0]?.variants[0]?.id ?? null);
            }}
            className="h-10 w-full rounded-lg border border-soft bg-hover px-3 text-sm text-strong outline-none transition focus:border-primary"
          >
            {(Object.keys(CATEGORY_META) as PlannerCategory[]).map((category) => (
              <option key={category} value={category}>
                {CATEGORY_META[category].label}
              </option>
            ))}
          </select>
        </label>
        {catalogProduct ? (
          <div className="mt-2.5 space-y-2">
            <div className="space-y-2 rounded-[0.9rem] border border-soft bg-hover p-2.5">
              <label className="block space-y-1.5">
                <span className="text-[11px] font-medium text-subtle">Product</span>
                <select
                  value={catalogProduct.id}
                  onChange={(event) => {
                    const nextProduct =
                      activeProducts.find((product) => product.id === event.target.value) ?? null;
                    setCatalogProductId(nextProduct?.id ?? null);
                    setCatalogSeatValue("all");
                    setCatalogVariantId(nextProduct?.variants[0]?.id ?? null);
                  }}
                  className="h-10 w-full rounded-lg border border-soft bg-panel px-3 text-sm text-strong outline-none transition focus:border-primary"
                >
                  {activeProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block space-y-1.5">
                <span className="text-[11px] font-medium text-subtle">Capacity</span>
                <select
                  value={catalogSeatValue}
                  onChange={(event) => {
                    const nextSeatValue = event.target.value;
                    const nextVariants = catalogProduct.variants.filter((variant) =>
                      nextSeatValue === "all"
                        ? true
                        : String(variant.seatCount ?? variant.unitCount ?? 1) === nextSeatValue,
                    );
                    setCatalogSeatValue(nextSeatValue);
                    setCatalogVariantId(nextVariants[0]?.id ?? catalogProduct.variants[0]?.id ?? null);
                  }}
                  className="h-10 w-full rounded-lg border border-soft bg-panel px-3 text-sm text-strong outline-none transition focus:border-primary"
                >
                  <option value="all">All options</option>
                  {seatOptions.map((value) => (
                    <option key={value} value={value}>
                      {value} {activeCategory === "storages" ? "units" : "seats"}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block space-y-1.5">
                <span className="text-[11px] font-medium text-subtle">Size</span>
                <select
                  value={catalogVariant?.id ?? ""}
                  onChange={(event) => setCatalogVariantId(event.target.value)}
                  className="h-10 w-full rounded-lg border border-soft bg-panel px-3 text-sm text-strong outline-none transition focus:border-primary"
                >
                  {filteredCatalogVariants.map((variant) => (
                    <option key={variant.id} value={variant.id}>
                      {variant.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {catalogVariant ? (
              <div className="rounded-[1rem] border border-soft bg-hover p-3">
                <p className="text-sm font-medium text-strong">{catalogProduct.name}</p>
                <p className="mt-1 text-sm text-muted">
                  {catalogVariant.seatCount
                    ? `${catalogVariant.seatCount} seats`
                    : `${catalogVariant.unitCount ?? 1} units`}{" "}
                   -  {formatDimension(catalogVariant.widthMm, unitSystem)} x {formatDimension(catalogVariant.depthMm, unitSystem)}
                </p>
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => {
                if (!catalogProduct || !catalogVariant) return;
                addProduct(catalogProduct.id, catalogVariant.id);
              }}
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border border-soft bg-panel text-sm font-medium text-strong transition hover:border-primary/40"
            >
              <Plus className="h-4 w-4" />
              Add to plan
            </button>
          </div>
        ) : null}
      </div>

      <div className="rounded-[1rem] border border-soft bg-panel p-2.5 shadow-sm">
        <p className="text-sm font-semibold text-strong">Active product</p>
        {selectedProduct && selectedVariant ? (
          <div className="mt-2.5 rounded-[0.9rem] border border-soft bg-hover p-2.5">
            <div className="relative mb-3 overflow-hidden rounded-[0.9rem] border border-soft bg-panel">
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.name}
                width={240}
                height={180}
                sizes="180px"
                className="mx-auto h-auto w-auto max-h-[148px] max-w-full object-cover"
              />
            </div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-strong">{selectedProduct.name}</p>
                <p className="mt-1 text-sm text-muted">{selectedVariant.label}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCatalogProductId(selectedProduct.id);
                  setCatalogSeatValue(
                    String(selectedVariant.seatCount ?? selectedVariant.unitCount ?? 1),
                  );
                  setCatalogVariantId(selectedVariant.id);
                  setActiveCategory(selectedProduct.category);
                }}
                className="inline-flex h-8 items-center rounded-full border border-soft px-2.5 text-xs text-strong transition hover:border-primary/40"
              >
                Use in catalog
              </button>
            </div>
            <p className="mt-2 text-sm text-muted">
              {selectedVariant.seatCount
                ? `${selectedVariant.seatCount} seats`
                : `${selectedVariant.unitCount ?? 1} units`}{" "}
               -  {formatDimension(selectedVariant.widthMm, unitSystem)} x {formatDimension(selectedVariant.depthMm, unitSystem)}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" onClick={rotateSelectedItem} className="inline-flex min-h-9 items-center justify-center gap-2 rounded-full border border-soft bg-panel px-3 text-sm text-strong transition hover:border-primary/40"><RotateCw className="h-4 w-4" />Rotate</button>
              <button type="button" onClick={flipSelectedItem} className="inline-flex min-h-9 items-center justify-center gap-2 rounded-full border border-soft bg-panel px-3 text-sm text-strong transition hover:border-primary/40"><FlipHorizontal className="h-4 w-4" />Flip</button>
              <button type="button" onClick={duplicateSelectedItem} className="inline-flex min-h-9 items-center justify-center gap-2 rounded-full border border-soft bg-panel px-3 text-sm text-strong transition hover:border-primary/40"><SquareStack className="h-4 w-4" />Duplicate</button>
              <button type="button" onClick={() => setShortlist((current) => current.includes(selectedProduct.id) ? current.filter((item) => item !== selectedProduct.id) : [...current, selectedProduct.id])} className="inline-flex min-h-9 items-center justify-center gap-2 rounded-full border border-soft bg-panel px-3 text-sm text-strong transition hover:border-primary/40"><Sparkles className="h-4 w-4" />{shortlist.includes(selectedProduct.id) ? "Saved" : "Shortlist"}</button>
              <button type="button" onClick={deleteSelectedItem} className="inline-flex min-h-9 items-center justify-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 text-sm text-rose-700 transition hover:border-rose-300"><Trash2 className="h-4 w-4" />Delete</button>
            </div>
          </div>
        ) : (
          <div className="mt-3 rounded-[1rem] border border-dashed border-soft bg-hover p-3 text-sm text-muted">
            Select an item on the planner to keep its details active here.
          </div>
        )}
      </div>
    </aside>
  );

  const canvasPanel = (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 flex-col overflow-hidden border-b border-soft bg-panel">
        <PlannerToolbar
          activeTool={activeTool}
          showGrid={showGrid}
          onToolChange={setPlannerTool}
          onGridToggle={() => setShowGrid((current) => !current)}
        />

        <div
          ref={canvasRef}
          onContextMenu={(event) => { event.preventDefault(); }}
          className="relative flex flex-1 w-full items-center justify-center overflow-hidden bg-[#e8e8e8]"
        >
          {canvasSize.width > 0 ? (
            <Stage
              width={canvasMetrics.width}
              height={canvasMetrics.height}
              onMouseMove={(event) => {
                if (activeTool === "select") {
                  if (snapGuide) setSnapGuide(null);
                  return;
                }
                const pointer = event.target.getStage()?.getPointerPosition();
                if (!pointer) return;
                const xMm = Math.round(
                  (pointer.x - canvasMetrics.roomX) / canvasMetrics.scale,
                );
                const yMm = Math.round(
                  (pointer.y - canvasMetrics.roomY) / canvasMetrics.scale,
                );
                if (xMm < 0 || yMm < 0 || xMm > room.widthMm || yMm > room.depthMm) {
                  if (snapGuide) setSnapGuide(null);
                  return;
                }
                setSnapGuide({ xMm: snapMm(xMm), yMm: snapMm(yMm) });
              }}
              onMouseLeave={() => {
                if (snapGuide) setSnapGuide(null);
              }}
              onMouseDown={(event) => {
                if (event.evt.button === 2) {
                  event.evt.preventDefault();
                  handleCanvasRightClick({ x: event.evt.clientX, y: event.evt.clientY });
                  return;
                }
                closeContextMenu();
                const hitOpeningId = findOpeningIdAtClientPoint({
                  x: event.evt.clientX,
                  y: event.evt.clientY,
                });
                if (hitOpeningId) {
                  setSelectedOpeningId(hitOpeningId);
                  setSelectedItemId(null);
                  return;
                }
                if (activeTool === "select") return;
                const pointer = event.target.getStage()?.getPointerPosition();
                if (!pointer) return;

                const xMm = Math.round(
                  (pointer.x - canvasMetrics.roomX) / canvasMetrics.scale,
                );
                const yMm = Math.round(
                  (pointer.y - canvasMetrics.roomY) / canvasMetrics.scale,
                );

                if (xMm < 0 || yMm < 0 || xMm > room.widthMm || yMm > room.depthMm) return;

                handleCanvasAction(xMm, yMm);
              }}
              onContextMenu={(event) => {
                event.evt.preventDefault();
                handleCanvasRightClick({ x: event.evt.clientX, y: event.evt.clientY });
              }}
            >
              <Layer>
                {/* Room background — drawn first so grid lines appear on top */}
                <Rect
                  x={canvasMetrics.roomX}
                  y={canvasMetrics.roomY}
                  width={canvasMetrics.roomPxWidth}
                  height={canvasMetrics.roomPxDepth}
                  fill="#ffffff"
                  stroke="#111111"
                  strokeWidth={4}
                  cornerRadius={0}
                />

                {/* Grid lines — drawn after room fill so they show */}
                {showGrid
                  ? Array.from({ length: Math.floor(room.widthMm / gridStepMm) + 1 }).map(
                      (_, index) => (
                        <Line
                          key={`grid-x-${index}`}
                          points={[
                            canvasMetrics.roomX + index * gridStepMm * canvasMetrics.scale,
                            canvasMetrics.roomY,
                            canvasMetrics.roomX + index * gridStepMm * canvasMetrics.scale,
                            canvasMetrics.roomY + canvasMetrics.roomPxDepth,
                          ]}
                          stroke="rgba(20, 50, 90, 0.35)"
                          strokeWidth={1}
                          dash={[4, 6]}
                        />
                      ),
                    )
                  : null}
                {showGrid
                  ? Array.from({ length: Math.floor(room.depthMm / gridStepMm) + 1 }).map(
                      (_, index) => (
                        <Line
                          key={`grid-y-${index}`}
                          points={[
                            canvasMetrics.roomX,
                            canvasMetrics.roomY + index * gridStepMm * canvasMetrics.scale,
                            canvasMetrics.roomX + canvasMetrics.roomPxWidth,
                            canvasMetrics.roomY + index * gridStepMm * canvasMetrics.scale,
                          ]}
                          stroke="rgba(20, 50, 90, 0.35)"
                          strokeWidth={1}
                          dash={[4, 6]}
                        />
                      ),
                    )
                  : null}
                <Text
                  x={canvasMetrics.roomX + 18}
                  y={canvasMetrics.roomY + 18}
                  text={`${room.name}  -  planning boundary`}
                  fontSize={14}
                  fill="#334155"
                />
                <Group
                  x={canvasMetrics.roomX + canvasMetrics.roomPxWidth - 176}
                  y={canvasMetrics.roomY + 14}
                >
                  <Rect
                    width={162}
                    height={86}
                    fill="rgba(255,255,255,0.9)"
                    stroke="rgba(51,65,85,0.2)"
                    strokeWidth={1}
                    cornerRadius={10}
                  />
                  <Line points={[10, 20, 34, 20]} stroke="#1e293b" strokeWidth={5} lineCap="round" />
                  <Text x={42} y={14} text="Wall" fontSize={11} fill="#334155" />
                  <Line points={[10, 36, 34, 36]} stroke="#14532d" strokeWidth={5} lineCap="round" />
                  <Arc
                    x={10}
                    y={36}
                    innerRadius={16}
                    outerRadius={16.1}
                    angle={90}
                    rotation={0}
                    stroke="rgba(20,83,45,0.62)"
                    strokeWidth={1.5}
                    dash={[4, 4]}
                  />
                  <Text x={42} y={30} text="Door" fontSize={11} fill="#334155" />
                  <Line points={[10, 52, 34, 52]} stroke="#1d4ed8" strokeWidth={4} lineCap="round" />
                  <Line points={[10, 47, 34, 47]} stroke="rgba(29,78,216,0.72)" strokeWidth={2} lineCap="round" />
                  <Text x={42} y={46} text="Window" fontSize={11} fill="#334155" />
                  <Circle x={22} y={70} radius={4} fill="#f8fafc" stroke="#334155" strokeWidth={1.2} />
                  <Text x={42} y={64} text="Seat marker" fontSize={11} fill="#334155" />
                </Group>
                {activeTool === "wall" && wallDraftStart && snapGuide ? (
                  <Line
                    points={[
                      canvasMetrics.roomX + wallDraftStart.xMm * canvasMetrics.scale,
                      canvasMetrics.roomY + wallDraftStart.yMm * canvasMetrics.scale,
                      canvasMetrics.roomX + snapGuide.xMm * canvasMetrics.scale,
                      canvasMetrics.roomY + snapGuide.yMm * canvasMetrics.scale,
                    ]}
                    stroke="rgba(30, 41, 59, 0.7)"
                    strokeWidth={6}
                    dash={[10, 6]}
                    lineCap="round"
                  />
                ) : null}
                <Line
                  points={[
                    canvasMetrics.roomX,
                    canvasMetrics.roomY - 18,
                    canvasMetrics.roomX + canvasMetrics.roomPxWidth,
                    canvasMetrics.roomY - 18,
                  ]}
                  stroke="rgba(51, 65, 85, 0.24)"
                  strokeWidth={2}
                />
                {rulerStepsX.map((step) => (
                  <Group key={`ruler-x-${step}`}>
                    <Line
                      points={[
                        canvasMetrics.roomX + step * canvasMetrics.scale,
                        canvasMetrics.roomY - 26,
                        canvasMetrics.roomX + step * canvasMetrics.scale,
                        canvasMetrics.roomY - 10,
                      ]}
                      stroke="rgba(71, 85, 105, 0.42)"
                      strokeWidth={step === 0 || step === room.widthMm ? 2 : 1}
                    />
                    {step < room.widthMm ? (
                      <Text
                        x={canvasMetrics.roomX + step * canvasMetrics.scale + 6}
                        y={canvasMetrics.roomY - 38}
                        text={formatDimension(step, unitSystem)}
                        fontSize={11}
                        fill="#334155"
                      />
                    ) : null}
                  </Group>
                ))}
                <Line
                  points={[
                    canvasMetrics.roomX - 18,
                    canvasMetrics.roomY,
                    canvasMetrics.roomX - 18,
                    canvasMetrics.roomY + canvasMetrics.roomPxDepth,
                  ]}
                  stroke="rgba(51, 65, 85, 0.24)"
                  strokeWidth={2}
                />
                {rulerStepsY.map((step) => (
                  <Group key={`ruler-y-${step}`}>
                    <Line
                      points={[
                        canvasMetrics.roomX - 26,
                        canvasMetrics.roomY + step * canvasMetrics.scale,
                        canvasMetrics.roomX - 10,
                        canvasMetrics.roomY + step * canvasMetrics.scale,
                      ]}
                      stroke="rgba(71, 85, 105, 0.42)"
                      strokeWidth={step === 0 || step === room.depthMm ? 2 : 1}
                    />
                    {step < room.depthMm ? (
                      <Text
                        x={canvasMetrics.roomX - 52}
                        y={canvasMetrics.roomY + step * canvasMetrics.scale + 4}
                        text={formatDimension(step, unitSystem)}
                        fontSize={11}
                        fill="#334155"
                      />
                    ) : null}
                  </Group>
                ))}
                <Group
                  x={canvasMetrics.roomX + canvasMetrics.roomPxWidth / 2 - 64}
                  y={canvasMetrics.roomY - 48}
                >
                  <Rect
                    width={128}
                    height={24}
                    fill="rgba(255,255,255,0.92)"
                    stroke="rgba(51, 65, 85, 0.18)"
                    strokeWidth={1}
                    cornerRadius={999}
                  />
                  <Text
                    x={0}
                    y={6}
                    width={128}
                    align="center"
                    text={`W ${formatDimension(room.widthMm, unitSystem)}`}
                    fontSize={11}
                    fontStyle="bold"
                    fill="#0f172a"
                  />
                </Group>
                <Group
                  x={canvasMetrics.roomX - 40}
                  y={canvasMetrics.roomY + canvasMetrics.roomPxDepth / 2 - 12}
                >
                  <Rect
                    width={24}
                    height={118}
                    fill="rgba(255,255,255,0.92)"
                    stroke="rgba(51, 65, 85, 0.18)"
                    strokeWidth={1}
                    cornerRadius={999}
                  />
                  <Text
                    x={0}
                    y={10}
                    width={24}
                    align="center"
                    text={`D\n${formatDimension(room.depthMm, unitSystem)}`}
                    fontSize={10}
                    fontStyle="bold"
                    fill="#0f172a"
                  />
                </Group>
                <Rect
                  x={canvasMetrics.roomX + canvasMetrics.roomPxWidth - 10}
                  y={canvasMetrics.roomY + canvasMetrics.roomPxDepth / 2 - 24}
                  width={16}
                  height={48}
                  fill="rgba(30, 41, 59, 0.78)"
                  cornerRadius={999}
                  shadowBlur={8}
                  shadowColor="rgba(30, 41, 59, 0.2)"
                  draggable
                  dragBoundFunc={(position) => ({
                    x: clamp(
                      position.x,
                      canvasMetrics.roomX + 5000 * canvasMetrics.scale - 10,
                      canvasMetrics.roomX + 30000 * canvasMetrics.scale - 10,
                    ),
                    y: canvasMetrics.roomY + canvasMetrics.roomPxDepth / 2 - 24,
                  })}
                  onMouseEnter={() => {
                    if (canvasRef.current) canvasRef.current.style.cursor = "ew-resize";
                  }}
                  onMouseLeave={() => {
                    if (canvasRef.current) {
                      canvasRef.current.style.cursor =
                        activeTool === "select" ? "grab" : "crosshair";
                    }
                  }}
                  onDragMove={(event) => {
                    const nextWidthMm = clampAndSnap(
                      Math.round(
                        (event.target.x() + 10 - canvasMetrics.roomX) / canvasMetrics.scale,
                      ),
                      5000,
                      30000,
                      100,
                    );
                    setRoom((current) => ({ ...current, widthMm: nextWidthMm }));
                  }}
                />
                <Rect
                  x={canvasMetrics.roomX + canvasMetrics.roomPxWidth / 2 - 24}
                  y={canvasMetrics.roomY + canvasMetrics.roomPxDepth - 8}
                  width={48}
                  height={16}
                  fill="rgba(30, 41, 59, 0.78)"
                  cornerRadius={999}
                  shadowBlur={8}
                  shadowColor="rgba(30, 41, 59, 0.2)"
                  draggable
                  dragBoundFunc={(position) => ({
                    x: canvasMetrics.roomX + canvasMetrics.roomPxWidth / 2 - 24,
                    y: clamp(
                      position.y,
                      canvasMetrics.roomY + 4000 * canvasMetrics.scale - 10,
                      canvasMetrics.roomY + 24000 * canvasMetrics.scale - 10,
                    ),
                  })}
                  onMouseEnter={() => {
                    if (canvasRef.current) canvasRef.current.style.cursor = "ns-resize";
                  }}
                  onMouseLeave={() => {
                    if (canvasRef.current) {
                      canvasRef.current.style.cursor =
                        activeTool === "select" ? "grab" : "crosshair";
                    }
                  }}
                  onDragMove={(event) => {
                    const nextDepthMm = clampAndSnap(
                      Math.round(
                        (event.target.y() + 10 - canvasMetrics.roomY) / canvasMetrics.scale,
                      ),
                      4000,
                      24000,
                      100,
                    );
                    setRoom((current) => ({ ...current, depthMm: nextDepthMm }));
                  }}
                />
                {snapGuide && activeTool !== "select" ? (
                  <Group>
                    <Line
                      points={[
                        canvasMetrics.roomX + snapGuide.xMm * canvasMetrics.scale,
                        canvasMetrics.roomY,
                        canvasMetrics.roomX + snapGuide.xMm * canvasMetrics.scale,
                        canvasMetrics.roomY + canvasMetrics.roomPxDepth,
                      ]}
                      stroke="rgba(37, 99, 235, 0.45)"
                      dash={[6, 6]}
                      strokeWidth={2}
                    />
                    <Line
                      points={[
                        canvasMetrics.roomX,
                        canvasMetrics.roomY + snapGuide.yMm * canvasMetrics.scale,
                        canvasMetrics.roomX + canvasMetrics.roomPxWidth,
                        canvasMetrics.roomY + snapGuide.yMm * canvasMetrics.scale,
                      ]}
                      stroke="rgba(37, 99, 235, 0.45)"
                      dash={[6, 6]}
                      strokeWidth={2}
                    />
                  </Group>
                ) : null}

                {interiorWalls.map((wall) => (
                  <Line
                    key={wall.id}
                    points={[
                      canvasMetrics.roomX + wall.x1Mm * canvasMetrics.scale,
                      canvasMetrics.roomY + wall.y1Mm * canvasMetrics.scale,
                      canvasMetrics.roomX + wall.x2Mm * canvasMetrics.scale,
                      canvasMetrics.roomY + wall.y2Mm * canvasMetrics.scale,
                    ]}
                    stroke="#1e293b"
                    strokeWidth={8}
                    lineCap="round"
                    draggable={activeTool === "select"}
                    dragBoundFunc={(position) => {
                      const minX = Math.min(wall.x1Mm, wall.x2Mm) * canvasMetrics.scale;
                      const maxX = Math.max(wall.x1Mm, wall.x2Mm) * canvasMetrics.scale;
                      const minY = Math.min(wall.y1Mm, wall.y2Mm) * canvasMetrics.scale;
                      const maxY = Math.max(wall.y1Mm, wall.y2Mm) * canvasMetrics.scale;

                      return {
                        x: clamp(
                          position.x,
                          interactionPaddingMm * canvasMetrics.scale - minX,
                          canvasMetrics.roomPxWidth -
                            interactionPaddingMm * canvasMetrics.scale -
                            maxX,
                        ),
                        y: clamp(
                          position.y,
                          interactionPaddingMm * canvasMetrics.scale - minY,
                          canvasMetrics.roomPxDepth -
                            interactionPaddingMm * canvasMetrics.scale -
                            maxY,
                        ),
                      };
                    }}
                    onDragEnd={(event) => {
                      const deltaXMm = snapMm(
                        Math.round(event.target.x() / canvasMetrics.scale),
                      );
                      const deltaYMm = snapMm(
                        Math.round(event.target.y() / canvasMetrics.scale),
                      );
                      setInteriorWalls((current) =>
                        current.map((entry) =>
                          entry.id === wall.id
                            ? {
                                ...entry,
                                x1Mm: clampAndSnap(
                                  entry.x1Mm + deltaXMm,
                                  interactionPaddingMm,
                                  room.widthMm - interactionPaddingMm,
                                ),
                                y1Mm: clampAndSnap(
                                  entry.y1Mm + deltaYMm,
                                  interactionPaddingMm,
                                  room.depthMm - interactionPaddingMm,
                                ),
                                x2Mm: clampAndSnap(
                                  entry.x2Mm + deltaXMm,
                                  interactionPaddingMm,
                                  room.widthMm - interactionPaddingMm,
                                ),
                                y2Mm: clampAndSnap(
                                  entry.y2Mm + deltaYMm,
                                  interactionPaddingMm,
                                  room.depthMm - interactionPaddingMm,
                                ),
                              }
                            : entry,
                        ),
                      );
                      event.target.position({ x: 0, y: 0 });
                    }}
                  />
                ))}

                {openings.map((opening) => {
                  const openingX =
                    opening.edge === "top" || opening.edge === "bottom"
                      ? canvasMetrics.roomX + opening.offsetMm * canvasMetrics.scale
                      : opening.edge === "left"
                        ? canvasMetrics.roomX
                        : canvasMetrics.roomX + canvasMetrics.roomPxWidth;
                  const openingY =
                    opening.edge === "left" || opening.edge === "right"
                      ? canvasMetrics.roomY + opening.offsetMm * canvasMetrics.scale
                      : opening.edge === "top"
                        ? canvasMetrics.roomY
                        : canvasMetrics.roomY + canvasMetrics.roomPxDepth;
                  const points =
                    opening.edge === "top" || opening.edge === "bottom"
                      ? [
                          openingX,
                          openingY,
                          openingX + opening.widthMm * canvasMetrics.scale,
                          openingY,
                        ]
                      : [
                          openingX,
                          openingY,
                          openingX,
                          openingY + opening.widthMm * canvasMetrics.scale,
                        ];
                  const isHorizontal = opening.edge === "top" || opening.edge === "bottom";
                  const openingSpanPx = opening.widthMm * canvasMetrics.scale;
                  const startPoint = { x: points[0], y: points[1] };
                  const endPoint = { x: points[2], y: points[3] };
                  const axis = isHorizontal ? { x: 1, y: 0 } : { x: 0, y: 1 };
                  const hinge = opening.hinge ?? "start";
                  const inwardNormal =
                    opening.edge === "top"
                      ? { x: 0, y: 1 }
                      : opening.edge === "bottom"
                        ? { x: 0, y: -1 }
                        : opening.edge === "left"
                          ? { x: 1, y: 0 }
                          : { x: -1, y: 0 };
                  const quarterArcPoints = (
                    hinge: { x: number; y: number },
                    alongAxis: { x: number; y: number },
                    radius: number,
                  ) => {
                    const arc: number[] = [];
                    for (let step = 0; step <= 16; step += 1) {
                      const t = (Math.PI / 2) * (step / 16);
                      arc.push(
                        hinge.x + (alongAxis.x * Math.cos(t) + inwardNormal.x * Math.sin(t)) * radius,
                        hinge.y + (alongAxis.y * Math.cos(t) + inwardNormal.y * Math.sin(t)) * radius,
                      );
                    }
                    return arc;
                  };
                  const canEditOpenings =
                    activeTool === "select" || activeTool === "door" || activeTool === "window";
                  const isSelectedOpening = selectedOpeningId === opening.id;
                  const hitThickness = Math.max(28, Math.min(140, openingSpanPx * 0.6));
                  const hitRect = isHorizontal
                    ? {
                        x: openingX,
                        y: opening.edge === "top" ? openingY : openingY - hitThickness,
                        width: openingSpanPx,
                        height: hitThickness,
                      }
                    : {
                        x: opening.edge === "left" ? openingX : openingX - hitThickness,
                        y: openingY,
                        width: hitThickness,
                        height: openingSpanPx,
                      };

                  if (isDoorOpening(opening.type)) {
                    const leafStroke = "rgba(234, 179, 8, 0.95)";
                    const jambStroke = "rgba(234, 179, 8, 0.92)";
                    const arcStroke = "rgba(250, 204, 21, 0.78)";
                    const jambDepth = Math.max(8, 38 * canvasMetrics.scale);
                    const leafSpan =
                      opening.type === "double-door" ? openingSpanPx / 2 : openingSpanPx;
                    const center = {
                      x: (startPoint.x + endPoint.x) / 2,
                      y: (startPoint.y + endPoint.y) / 2,
                    };
                    const leftArc = quarterArcPoints(startPoint, axis, leafSpan);
                    const rightArc = quarterArcPoints(
                      endPoint,
                      { x: -axis.x, y: -axis.y },
                      leafSpan,
                    );

                    return (
                      <Group
                        key={opening.id}
                        onClick={() => {
                          setSelectedOpeningId(opening.id);
                          setSelectedItemId(null);
                        }}
                        onTap={() => {
                          setSelectedOpeningId(opening.id);
                          setSelectedItemId(null);
                        }}
                        onContextMenu={(event) => {
                          event.evt.preventDefault();
                          event.cancelBubble = true;
                          setSelectedOpeningId(opening.id);
                          setSelectedItemId(null);
                          handleCanvasRightClick({ x: event.evt.clientX, y: event.evt.clientY });
                        }}
                      >
                        <Rect
                          x={hitRect.x}
                          y={hitRect.y}
                          width={hitRect.width}
                          height={hitRect.height}
                          fill="rgba(0,0,0,0.001)"
                          onMouseDown={(event) => {
                            event.cancelBubble = true;
                            setSelectedOpeningId(opening.id);
                            setSelectedItemId(null);
                            setActiveTool("select");
                          }}
                          onContextMenu={(event) => {
                            event.evt.preventDefault();
                            event.cancelBubble = true;
                            setSelectedOpeningId(opening.id);
                            setSelectedItemId(null);
                            handleCanvasRightClick({
                              x: event.evt.clientX,
                              y: event.evt.clientY,
                            });
                          }}
                        />
                        <Line
                          points={points}
                          stroke={jambStroke}
                          strokeWidth={isSelectedOpening ? 4 : 3}
                          lineCap="round"
                        />
                        <Line
                          points={[
                            startPoint.x,
                            startPoint.y,
                            startPoint.x + inwardNormal.x * jambDepth,
                            startPoint.y + inwardNormal.y * jambDepth,
                          ]}
                          stroke={jambStroke}
                          strokeWidth={2}
                        />
                        <Line
                          points={[
                            endPoint.x,
                            endPoint.y,
                            endPoint.x + inwardNormal.x * jambDepth,
                            endPoint.y + inwardNormal.y * jambDepth,
                          ]}
                          stroke={jambStroke}
                          strokeWidth={2}
                        />
                        {opening.type === "door" ? (
                          <>
                            {hinge === "start" ? (
                              <>
                                <Line
                                  points={[
                                    startPoint.x,
                                    startPoint.y,
                                    startPoint.x + axis.x * openingSpanPx,
                                    startPoint.y + axis.y * openingSpanPx,
                                  ]}
                                  stroke={leafStroke}
                                  strokeWidth={2}
                                />
                                <Line points={leftArc} stroke={arcStroke} strokeWidth={1.8} />
                              </>
                            ) : (
                              <>
                                <Line
                                  points={[
                                    endPoint.x,
                                    endPoint.y,
                                    endPoint.x - axis.x * openingSpanPx,
                                    endPoint.y - axis.y * openingSpanPx,
                                  ]}
                                  stroke={leafStroke}
                                  strokeWidth={2}
                                />
                                <Line points={rightArc} stroke={arcStroke} strokeWidth={1.8} />
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            <Line
                              points={[startPoint.x, startPoint.y, center.x, center.y]}
                              stroke={leafStroke}
                              strokeWidth={2}
                            />
                            <Line
                              points={[endPoint.x, endPoint.y, center.x, center.y]}
                              stroke={leafStroke}
                              strokeWidth={2}
                            />
                            <Line points={leftArc} stroke={arcStroke} strokeWidth={1.8} />
                            <Line points={rightArc} stroke={arcStroke} strokeWidth={1.8} />
                            <Rect
                              x={center.x - (isHorizontal ? 5 : 3)}
                              y={center.y - (isHorizontal ? 3 : 5)}
                              width={isHorizontal ? 10 : 6}
                              height={isHorizontal ? 6 : 10}
                              fill="rgba(234, 179, 8, 0.95)"
                            />
                          </>
                        )}
                        <Line
                          points={points}
                          stroke="rgba(0,0,0,0.001)"
                          strokeWidth={24}
                          lineCap="round"
                          draggable={canEditOpenings}
                          onMouseDown={(event) => {
                            event.cancelBubble = true;
                            setSelectedOpeningId(opening.id);
                            setSelectedItemId(null);
                            setActiveTool("select");
                          }}
                          onTouchStart={(event) => {
                            event.cancelBubble = true;
                            setSelectedOpeningId(opening.id);
                            setSelectedItemId(null);
                            setActiveTool("select");
                          }}
                          onDragStart={() => {
                            setSelectedOpeningId(opening.id);
                            setSelectedItemId(null);
                          }}
                          dragBoundFunc={(position) => {
                            if (isHorizontal) {
                              return {
                                x: clamp(
                                  position.x,
                                  canvasMetrics.roomX + (opening.widthMm * canvasMetrics.scale) / 2,
                                  canvasMetrics.roomX +
                                    canvasMetrics.roomPxWidth -
                                    (opening.widthMm * canvasMetrics.scale) / 2,
                                ),
                                y: openingY,
                              };
                            }
                            return {
                              x: openingX,
                              y: clamp(
                                position.y,
                                canvasMetrics.roomY + (opening.widthMm * canvasMetrics.scale) / 2,
                                canvasMetrics.roomY +
                                  canvasMetrics.roomPxDepth -
                                  (opening.widthMm * canvasMetrics.scale) / 2,
                              ),
                            };
                          }}
                          onDragMove={(event) => {
                            const nextOffsetMm = clampAndSnap(
                              isHorizontal
                                ? (event.target.x() - canvasMetrics.roomX) / canvasMetrics.scale -
                                    opening.widthMm / 2
                                : (event.target.y() - canvasMetrics.roomY) / canvasMetrics.scale -
                                    opening.widthMm / 2,
                              150,
                              (isHorizontal ? room.widthMm : room.depthMm) - opening.widthMm - 150,
                              50,
                            );
                            setOpenings((current) =>
                              current.map((entry) =>
                                entry.id === opening.id ? { ...entry, offsetMm: nextOffsetMm } : entry,
                              ),
                            );
                          }}
                        />
                        <Circle
                          x={
                            isHorizontal
                              ? openingX + (opening.widthMm * canvasMetrics.scale) / 2
                              : openingX
                          }
                          y={
                            isHorizontal
                              ? openingY
                              : openingY + (opening.widthMm * canvasMetrics.scale) / 2
                          }
                          radius={8}
                          fill="#fde68a"
                          stroke="#b45309"
                          strokeWidth={1.5}
                          draggable={canEditOpenings}
                          onMouseDown={(event) => {
                            event.cancelBubble = true;
                            setSelectedOpeningId(opening.id);
                            setSelectedItemId(null);
                            setActiveTool("select");
                          }}
                          onTouchStart={(event) => {
                            event.cancelBubble = true;
                            setSelectedOpeningId(opening.id);
                            setSelectedItemId(null);
                            setActiveTool("select");
                          }}
                          onDragStart={() => {
                            setSelectedOpeningId(opening.id);
                            setSelectedItemId(null);
                          }}
                          dragBoundFunc={(position) => {
                            if (isHorizontal) {
                              return {
                                x: clamp(
                                  position.x,
                                  canvasMetrics.roomX + (opening.widthMm * canvasMetrics.scale) / 2,
                                  canvasMetrics.roomX +
                                    canvasMetrics.roomPxWidth -
                                    (opening.widthMm * canvasMetrics.scale) / 2,
                                ),
                                y: openingY,
                              };
                            }
                            return {
                              x: openingX,
                              y: clamp(
                                position.y,
                                canvasMetrics.roomY + (opening.widthMm * canvasMetrics.scale) / 2,
                                canvasMetrics.roomY +
                                  canvasMetrics.roomPxDepth -
                                  (opening.widthMm * canvasMetrics.scale) / 2,
                              ),
                            };
                          }}
                          onMouseEnter={() => {
                            if (canvasRef.current) {
                              canvasRef.current.style.cursor = isHorizontal ? "ew-resize" : "ns-resize";
                            }
                          }}
                          onMouseLeave={() => {
                            if (canvasRef.current) {
                              canvasRef.current.style.cursor =
                                activeTool === "select" ? "grab" : "crosshair";
                            }
                          }}
                          onDragMove={(event) => {
                            const nextOffsetMm = clampAndSnap(
                              isHorizontal
                                ? (event.target.x() - canvasMetrics.roomX) / canvasMetrics.scale -
                                    opening.widthMm / 2
                                : (event.target.y() - canvasMetrics.roomY) / canvasMetrics.scale -
                                    opening.widthMm / 2,
                              150,
                              (isHorizontal ? room.widthMm : room.depthMm) - opening.widthMm - 150,
                              50,
                            );
                            setOpenings((current) =>
                              current.map((entry) =>
                                entry.id === opening.id ? { ...entry, offsetMm: nextOffsetMm } : entry,
                              ),
                            );
                          }}
                        />
                        <Circle
                          x={isHorizontal ? openingX + opening.widthMm * canvasMetrics.scale : openingX}
                          y={isHorizontal ? openingY : openingY + opening.widthMm * canvasMetrics.scale}
                          radius={8}
                          fill="#fef3c7"
                          stroke="#92400e"
                          strokeWidth={1.5}
                          draggable={canEditOpenings}
                          onMouseDown={(event) => {
                            event.cancelBubble = true;
                            setSelectedOpeningId(opening.id);
                            setSelectedItemId(null);
                            setActiveTool("select");
                          }}
                          onTouchStart={(event) => {
                            event.cancelBubble = true;
                            setSelectedOpeningId(opening.id);
                            setSelectedItemId(null);
                            setActiveTool("select");
                          }}
                          onDragStart={() => {
                            setSelectedOpeningId(opening.id);
                            setSelectedItemId(null);
                          }}
                          dragBoundFunc={(position) => {
                            if (isHorizontal) {
                              return {
                                x: clamp(
                                  position.x,
                                  openingX + 600 * canvasMetrics.scale,
                                  canvasMetrics.roomX + canvasMetrics.roomPxWidth - 120,
                                ),
                                y: openingY,
                              };
                            }
                            return {
                              x: openingX,
                              y: clamp(
                                position.y,
                                openingY + 600 * canvasMetrics.scale,
                                canvasMetrics.roomY + canvasMetrics.roomPxDepth - 120,
                              ),
                            };
                          }}
                          onMouseEnter={() => {
                            if (canvasRef.current) {
                              canvasRef.current.style.cursor = isHorizontal ? "ew-resize" : "ns-resize";
                            }
                          }}
                          onMouseLeave={() => {
                            if (canvasRef.current) {
                              canvasRef.current.style.cursor =
                                activeTool === "select" ? "grab" : "crosshair";
                            }
                          }}
                          onDragMove={(event) => {
                            const nextWidthMm = clampAndSnap(
                              isHorizontal
                                ? (event.target.x() - openingX) / canvasMetrics.scale
                                : (event.target.y() - openingY) / canvasMetrics.scale,
                              600,
                              3200,
                              100,
                            );
                            setOpenings((current) =>
                              current.map((entry) =>
                                entry.id === opening.id ? { ...entry, widthMm: nextWidthMm } : entry,
                              ),
                            );
                          }}
                        />
                      </Group>
                    );
                  }

                    return (
                      <Group
                        key={opening.id}
                        onClick={() => {
                          setSelectedOpeningId(opening.id);
                          setSelectedItemId(null);
                        }}
                        onTap={() => {
                          setSelectedOpeningId(opening.id);
                          setSelectedItemId(null);
                        }}
                        onContextMenu={(event) => {
                          event.evt.preventDefault();
                          event.cancelBubble = true;
                          setSelectedOpeningId(opening.id);
                          setSelectedItemId(null);
                          handleCanvasRightClick({ x: event.evt.clientX, y: event.evt.clientY });
                        }}
                      >
                        <Rect
                          x={hitRect.x}
                          y={hitRect.y}
                          width={hitRect.width}
                          height={hitRect.height}
                          fill="rgba(0,0,0,0.001)"
                          onMouseDown={(event) => {
                            event.cancelBubble = true;
                            setSelectedOpeningId(opening.id);
                            setSelectedItemId(null);
                            setActiveTool("select");
                          }}
                          onContextMenu={(event) => {
                            event.evt.preventDefault();
                            event.cancelBubble = true;
                            setSelectedOpeningId(opening.id);
                            setSelectedItemId(null);
                            handleCanvasRightClick({
                              x: event.evt.clientX,
                              y: event.evt.clientY,
                            });
                          }}
                        />
                        <Line
                          points={points}
                          stroke={isSelectedOpening ? "#1e3a8a" : "#1d4ed8"}
                          strokeWidth={isSelectedOpening ? 5 : 4}
                        lineCap="round"
                      />
                      <Line
                        points={points}
                        stroke="rgba(0,0,0,0.001)"
                        strokeWidth={22}
                        lineCap="round"
                        draggable={canEditOpenings}
                        onMouseDown={(event) => {
                          event.cancelBubble = true;
                          setSelectedOpeningId(opening.id);
                          setSelectedItemId(null);
                          setActiveTool("select");
                        }}
                        onTouchStart={(event) => {
                          event.cancelBubble = true;
                          setSelectedOpeningId(opening.id);
                          setSelectedItemId(null);
                          setActiveTool("select");
                        }}
                        onDragStart={() => {
                          setSelectedOpeningId(opening.id);
                          setSelectedItemId(null);
                        }}
                        dragBoundFunc={(position) => {
                          if (isHorizontal) {
                            return {
                              x: clamp(
                                position.x,
                                canvasMetrics.roomX + (opening.widthMm * canvasMetrics.scale) / 2,
                                canvasMetrics.roomX +
                                  canvasMetrics.roomPxWidth -
                                  (opening.widthMm * canvasMetrics.scale) / 2,
                              ),
                              y: openingY,
                            };
                          }
                          return {
                            x: openingX,
                            y: clamp(
                              position.y,
                              canvasMetrics.roomY + (opening.widthMm * canvasMetrics.scale) / 2,
                              canvasMetrics.roomY +
                                canvasMetrics.roomPxDepth -
                                (opening.widthMm * canvasMetrics.scale) / 2,
                            ),
                          };
                        }}
                        onDragMove={(event) => {
                          const nextOffsetMm = clampAndSnap(
                            isHorizontal
                              ? (event.target.x() - canvasMetrics.roomX) / canvasMetrics.scale -
                                  opening.widthMm / 2
                              : (event.target.y() - canvasMetrics.roomY) / canvasMetrics.scale -
                                  opening.widthMm / 2,
                            150,
                            (isHorizontal ? room.widthMm : room.depthMm) - opening.widthMm - 150,
                            50,
                          );
                          setOpenings((current) =>
                            current.map((entry) =>
                              entry.id === opening.id ? { ...entry, offsetMm: nextOffsetMm } : entry,
                            ),
                          );
                        }}
                      />
                      <Line
                        points={
                          isHorizontal
                            ? [
                                openingX,
                                openingY - 5,
                                openingX + opening.widthMm * canvasMetrics.scale,
                                openingY - 5,
                              ]
                            : [
                                openingX - 5,
                                openingY,
                                openingX - 5,
                                openingY + opening.widthMm * canvasMetrics.scale,
                              ]
                        }
                        stroke="rgba(29,78,216,0.72)"
                        strokeWidth={2}
                        lineCap="round"
                      />
                      <Circle
                        x={
                          isHorizontal
                            ? openingX + (opening.widthMm * canvasMetrics.scale) / 2
                            : openingX
                        }
                        y={
                          isHorizontal
                            ? openingY
                            : openingY + (opening.widthMm * canvasMetrics.scale) / 2
                        }
                        radius={8}
                        fill="#e0f2fe"
                        stroke="#0f766e"
                        strokeWidth={1.5}
                        draggable={canEditOpenings}
                        onMouseDown={(event) => {
                          event.cancelBubble = true;
                          setSelectedOpeningId(opening.id);
                          setSelectedItemId(null);
                          setActiveTool("select");
                        }}
                        onTouchStart={(event) => {
                          event.cancelBubble = true;
                          setSelectedOpeningId(opening.id);
                          setSelectedItemId(null);
                          setActiveTool("select");
                        }}
                        onDragStart={() => {
                          setSelectedOpeningId(opening.id);
                          setSelectedItemId(null);
                        }}
                        dragBoundFunc={(position) => {
                          if (isHorizontal) {
                            return {
                              x: clamp(
                                position.x,
                                canvasMetrics.roomX + (opening.widthMm * canvasMetrics.scale) / 2,
                                canvasMetrics.roomX +
                                  canvasMetrics.roomPxWidth -
                                  (opening.widthMm * canvasMetrics.scale) / 2,
                              ),
                              y: openingY,
                            };
                          }
                          return {
                            x: openingX,
                            y: clamp(
                              position.y,
                              canvasMetrics.roomY + (opening.widthMm * canvasMetrics.scale) / 2,
                              canvasMetrics.roomY +
                                canvasMetrics.roomPxDepth -
                                (opening.widthMm * canvasMetrics.scale) / 2,
                            ),
                          };
                        }}
                        onMouseEnter={() => {
                          if (canvasRef.current) {
                            canvasRef.current.style.cursor = isHorizontal ? "ew-resize" : "ns-resize";
                          }
                        }}
                        onMouseLeave={() => {
                          if (canvasRef.current) {
                            canvasRef.current.style.cursor =
                              activeTool === "select" ? "grab" : "crosshair";
                          }
                        }}
                        onDragMove={(event) => {
                          const nextOffsetMm = clampAndSnap(
                            isHorizontal
                              ? (event.target.x() - canvasMetrics.roomX) / canvasMetrics.scale -
                                  opening.widthMm / 2
                              : (event.target.y() - canvasMetrics.roomY) / canvasMetrics.scale -
                                  opening.widthMm / 2,
                            150,
                            (isHorizontal ? room.widthMm : room.depthMm) - opening.widthMm - 150,
                            50,
                          );
                          setOpenings((current) =>
                            current.map((entry) =>
                              entry.id === opening.id ? { ...entry, offsetMm: nextOffsetMm } : entry,
                            ),
                          );
                        }}
                      />
                      <Circle
                        x={
                          isHorizontal
                            ? openingX + opening.widthMm * canvasMetrics.scale
                            : openingX
                        }
                        y={
                          isHorizontal
                            ? openingY
                            : openingY + opening.widthMm * canvasMetrics.scale
                        }
                        radius={8}
                        fill="#dbeafe"
                        stroke="#1d4ed8"
                        strokeWidth={1.5}
                        draggable={canEditOpenings}
                        onMouseDown={(event) => {
                          event.cancelBubble = true;
                          setSelectedOpeningId(opening.id);
                          setSelectedItemId(null);
                          setActiveTool("select");
                        }}
                        onTouchStart={(event) => {
                          event.cancelBubble = true;
                          setSelectedOpeningId(opening.id);
                          setSelectedItemId(null);
                          setActiveTool("select");
                        }}
                        onDragStart={() => {
                          setSelectedOpeningId(opening.id);
                          setSelectedItemId(null);
                        }}
                        dragBoundFunc={(position) => {
                          if (isHorizontal) {
                            return {
                              x: clamp(
                                position.x,
                                openingX + 600 * canvasMetrics.scale,
                                canvasMetrics.roomX + canvasMetrics.roomPxWidth - 120,
                              ),
                              y: openingY,
                            };
                          }
                          return {
                            x: openingX,
                            y: clamp(
                              position.y,
                              openingY + 600 * canvasMetrics.scale,
                              canvasMetrics.roomY + canvasMetrics.roomPxDepth - 120,
                            ),
                          };
                        }}
                        onMouseEnter={() => {
                          if (canvasRef.current) {
                            canvasRef.current.style.cursor = isHorizontal
                              ? "ew-resize"
                              : "ns-resize";
                          }
                        }}
                        onMouseLeave={() => {
                          if (canvasRef.current) {
                            canvasRef.current.style.cursor =
                              activeTool === "select" ? "grab" : "crosshair";
                          }
                        }}
                        onDragMove={(event) => {
                          const nextWidthMm = clampAndSnap(
                            isHorizontal
                              ? (event.target.x() - openingX) / canvasMetrics.scale
                              : (event.target.y() - openingY) / canvasMetrics.scale,
                            600,
                            3200,
                            100,
                          );
                          setOpenings((current) =>
                            current.map((entry) =>
                              entry.id === opening.id
                                ? { ...entry, widthMm: nextWidthMm }
                                : entry,
                            ),
                          );
                        }}
                      />
                    </Group>
                  );
                })}

                {columns.map((column) => (
                  <Group key={column.id}>
                    <Rect
                      x={canvasMetrics.roomX + column.xMm * canvasMetrics.scale}
                      y={canvasMetrics.roomY + column.yMm * canvasMetrics.scale}
                      width={column.widthMm * canvasMetrics.scale}
                      height={column.depthMm * canvasMetrics.scale}
                      fill="rgba(148, 163, 184, 0.68)"
                      stroke="rgba(51, 65, 85, 0.9)"
                      strokeWidth={2}
                      cornerRadius={8}
                      draggable={activeTool === "select"}
                      dragBoundFunc={(position) => ({
                        x: clamp(
                          position.x,
                          canvasMetrics.roomX + interactionPaddingMm * canvasMetrics.scale,
                          canvasMetrics.roomX +
                            canvasMetrics.roomPxWidth -
                            column.widthMm * canvasMetrics.scale -
                            interactionPaddingMm * canvasMetrics.scale,
                        ),
                        y: clamp(
                          position.y,
                          canvasMetrics.roomY + interactionPaddingMm * canvasMetrics.scale,
                          canvasMetrics.roomY +
                            canvasMetrics.roomPxDepth -
                            column.depthMm * canvasMetrics.scale -
                            interactionPaddingMm * canvasMetrics.scale,
                        ),
                      })}
                      onDragEnd={(event) => {
                        const xMm = clampAndSnap(
                          (event.target.x() - canvasMetrics.roomX) / canvasMetrics.scale,
                          interactionPaddingMm,
                          room.widthMm - interactionPaddingMm - column.widthMm,
                        );
                        const yMm = clampAndSnap(
                          (event.target.y() - canvasMetrics.roomY) / canvasMetrics.scale,
                          interactionPaddingMm,
                          room.depthMm - interactionPaddingMm - column.depthMm,
                        );
                        setColumns((current) =>
                          current.map((entry) =>
                            entry.id === column.id ? { ...entry, xMm, yMm } : entry,
                          ),
                        );
                      }}
                    />
                    <Circle
                      x={
                        canvasMetrics.roomX +
                        (column.xMm + column.widthMm) * canvasMetrics.scale
                      }
                      y={
                        canvasMetrics.roomY +
                        (column.yMm + column.depthMm) * canvasMetrics.scale
                      }
                      radius={6}
                      fill="#e2e8f0"
                      stroke="#334155"
                      strokeWidth={1.5}
                      draggable={activeTool === "select"}
                      dragBoundFunc={(position) => ({
                        x: clamp(
                          position.x,
                          canvasMetrics.roomX + (column.xMm + 300) * canvasMetrics.scale,
                          canvasMetrics.roomX +
                            (room.widthMm - interactionPaddingMm) * canvasMetrics.scale,
                        ),
                        y: clamp(
                          position.y,
                          canvasMetrics.roomY + (column.yMm + 300) * canvasMetrics.scale,
                          canvasMetrics.roomY +
                            (room.depthMm - interactionPaddingMm) * canvasMetrics.scale,
                        ),
                      })}
                      onMouseEnter={() => {
                        if (canvasRef.current) canvasRef.current.style.cursor = "nwse-resize";
                      }}
                      onMouseLeave={() => {
                        if (canvasRef.current) {
                          canvasRef.current.style.cursor =
                            activeTool === "select" ? "grab" : "crosshair";
                        }
                      }}
                      onDragMove={(event) => {
                        const nextWidthMm = clampAndSnap(
                          (event.target.x() - canvasMetrics.roomX) / canvasMetrics.scale -
                            column.xMm,
                          300,
                          room.widthMm - column.xMm,
                          50,
                        );
                        const nextDepthMm = clampAndSnap(
                          (event.target.y() - canvasMetrics.roomY) / canvasMetrics.scale -
                            column.yMm,
                          300,
                          room.depthMm - column.yMm,
                          50,
                        );
                        setColumns((current) =>
                          current.map((entry) =>
                            entry.id === column.id
                              ? { ...entry, widthMm: nextWidthMm, depthMm: nextDepthMm }
                              : entry,
                          ),
                        );
                      }}
                    />
                  </Group>
                ))}

                {placedItems.map((item) => {
                  const width = item.dimensions.widthMm * canvasMetrics.scale;
                  const depth = item.dimensions.depthMm * canvasMetrics.scale;
                  const x = canvasMetrics.roomX + item.xMm * canvasMetrics.scale;
                  const y = canvasMetrics.roomY + item.yMm * canvasMetrics.scale;
                  const meta = CATEGORY_META[item.product.category];
                  const isLShape = item.variant.footprintShape === "l-shape";
                  const itemFill = isLShape ? "#B8CEE8" : meta.fill;
                  const itemStroke = isLShape ? "#3A6A9A" : meta.stroke;

                  return (
                    <Rect
                      key={item.id}
                      x={x}
                      y={y}
                      width={width}
                      height={depth}
                      fill={itemFill}
                      stroke={collisions.has(item.id) ? "#ef4444" : itemStroke}
                      strokeWidth={item.id === selectedItemId ? 2.5 : 1.5}
                      cornerRadius={0}
                      opacity={1}
                      shadowBlur={item.id === selectedItemId ? 10 : 4}
                      shadowColor="rgba(0,0,0,0.28)"
                      shadowOffsetX={2}
                      shadowOffsetY={2}
                      listening={false}
                    />
                  );
                })}

                {placedItems.map((item) => {
                  // Only render the chair CAD symbol for the chairs category
                  if (item.product.category !== "chairs") return null;

                  const width = item.dimensions.widthMm * canvasMetrics.scale;
                  const depth = item.dimensions.depthMm * canvasMetrics.scale;
                  const x = canvasMetrics.roomX + item.xMm * canvasMetrics.scale;
                  const y = canvasMetrics.roomY + item.yMm * canvasMetrics.scale;

                  // CAD chair: backrest bar at top, seat body in middle, arc at front
                  const backrestH = Math.max(5, depth * 0.18);
                  const arcH = Math.max(5, depth * 0.16);
                  const seatY = y + backrestH;
                  const seatH = depth - backrestH - arcH;
                  const inset = Math.max(3, width * 0.06);
                  const stroke = "#2A2A2A";
                  const fill = "#5A5A5A";

                  return (
                    <Group key={`${item.id}-chair-cad`} listening={false}>
                      {/* Backrest */}
                      <Rect
                        x={x + inset}
                        y={y}
                        width={width - inset * 2}
                        height={backrestH}
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={1.5}
                        cornerRadius={0}
                      />
                      {/* Seat body */}
                      <Rect
                        x={x}
                        y={seatY}
                        width={width}
                        height={seatH}
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={1.5}
                        cornerRadius={0}
                      />
                      {/* Front arc — curved front edge of seat */}
                      <Arc
                        x={x + width / 2}
                        y={y + depth - arcH}
                        innerRadius={0}
                        outerRadius={width / 2}
                        angle={180}
                        rotation={0}
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={1.5}
                      />
                    </Group>
                  );
                })}

                {placedItems.map((item) => {
                  if (
                    item.variant.footprintShape !== "linear-shared" &&
                    item.variant.footprintShape !== "linear-non-sharing"
                  ) {
                    return null;
                  }

                  const isSharing = item.variant.footprintShape === "linear-shared";
                  const width = item.dimensions.widthMm * canvasMetrics.scale;
                  const depth = item.dimensions.depthMm * canvasMetrics.scale;
                  const x = canvasMetrics.roomX + item.xMm * canvasMetrics.scale;
                  const y = canvasMetrics.roomY + item.yMm * canvasMetrics.scale;
                  const seatCount = Math.max(1, item.variant.seatCount ?? 0);
                  // For non-sharing: all seats on one side (top backrest at y)
                  // For sharing: seats on both sides (top half and bottom half)
                  const seatsPerSide = isSharing ? Math.max(1, Math.ceil(seatCount / 2)) : seatCount;
                  // Backrest thickness — fixed 8% of depth, clamped
                  const backrestH = Math.max(6, Math.min(14, depth * 0.08));
                  // Seat divider lines (vertical lines splitting seats)
                  const seatW = width / seatsPerSide;

                  const dividerLines: number[][] = [];
                  for (let i = 1; i < seatsPerSide; i++) {
                    dividerLines.push([x + seatW * i, y + backrestH, x + seatW * i, isSharing ? y + depth / 2 : y + depth]);
                  }

                  return (
                    <Group key={`${item.id}-linear-footprint`}>
                      {/* Top backrest strip */}
                      <Rect
                        x={x + 1}
                        y={y + 1}
                        width={width - 2}
                        height={backrestH}
                        fill="rgba(100,70,10,0.25)"
                        stroke="rgba(100,70,10,0.6)"
                        strokeWidth={1}
                      />
                      {/* For sharing: bottom backrest strip */}
                      {isSharing && (
                        <Rect
                          x={x + 1}
                          y={y + depth - backrestH - 1}
                          width={width - 2}
                          height={backrestH}
                          fill="rgba(100,70,10,0.25)"
                          stroke="rgba(100,70,10,0.6)"
                          strokeWidth={1}
                        />
                      )}
                      {/* Centre spine line for sharing */}
                      {isSharing && (
                        <Line
                          points={[x + 4, y + depth / 2, x + width - 4, y + depth / 2]}
                          stroke="rgba(100,70,10,0.5)"
                          strokeWidth={1}
                          dash={[4, 4]}
                        />
                      )}
                      {/* Seat divider lines */}
                      {dividerLines.map((pts, i) => (
                        <Line
                          key={`${item.id}-div-${i}`}
                          points={pts}
                          stroke="rgba(100,70,10,0.5)"
                          strokeWidth={1}
                        />
                      ))}
                      {/* Mirror divider lines for sharing bottom half */}
                      {isSharing && dividerLines.map((pts, i) => (
                        <Line
                          key={`${item.id}-div-bot-${i}`}
                          points={[pts[0], y + depth / 2, pts[2], y + depth - backrestH - 1]}
                          stroke="rgba(100,70,10,0.5)"
                          strokeWidth={1}
                        />
                      ))}
                    </Group>
                  );
                })}

                {placedItems.map((item) => {
                  if (item.variant.footprintShape !== "sofa") {
                    return null;
                  }

                  const width = item.dimensions.widthMm * canvasMetrics.scale;
                  const depth = item.dimensions.depthMm * canvasMetrics.scale;
                  const x = canvasMetrics.roomX + item.xMm * canvasMetrics.scale;
                  const y = canvasMetrics.roomY + item.yMm * canvasMetrics.scale;
                  const seatCountForItem = Math.max(1, item.variant.seatCount ?? 1);
                  const armWidth = Math.max(8, Math.min(16, width * 0.08));
                  const railHeight = Math.max(8, Math.min(14, depth * 0.14));
                  const cushionInsetX = Math.max(10, width * 0.09);
                  const cushionInsetY = Math.max(10, depth * 0.12);
                  const cushionWidth = Math.max(28, width - cushionInsetX * 2);
                  const cushionHeight = Math.max(24, depth - cushionInsetY * 2);

                  return (
                    <Group key={`${item.id}-sofa-footprint`}>
                      <Rect
                        x={x + 2}
                        y={y + 2}
                        width={width - 4}
                        height={depth - 4}
                        stroke="rgba(255,201,127,0.9)"
                        strokeWidth={2}
                        cornerRadius={Math.max(10, Math.min(22, Math.min(width, depth) * 0.16))}
                      />
                      <Rect
                        x={x + armWidth}
                        y={y + railHeight}
                        width={Math.max(20, width - armWidth * 2)}
                        height={Math.max(14, depth - railHeight * 2)}
                        stroke="rgba(255,201,127,0.82)"
                        strokeWidth={1.4}
                        cornerRadius={Math.max(8, Math.min(18, Math.min(width, depth) * 0.14))}
                      />
                      <Rect
                        x={x + cushionInsetX}
                        y={y + cushionInsetY}
                        width={cushionWidth}
                        height={cushionHeight}
                        stroke="rgba(255,201,127,0.74)"
                        strokeWidth={1.2}
                        cornerRadius={Math.max(8, Math.min(16, Math.min(width, depth) * 0.12))}
                      />
                      {seatCountForItem >= 3 ? (
                        <>
                          <Line
                            points={[
                              x + width / 3,
                              y + cushionInsetY + 4,
                              x + width / 3,
                              y + depth - cushionInsetY - 4,
                            ]}
                            stroke="rgba(255,201,127,0.72)"
                            strokeWidth={1.1}
                          />
                          <Line
                            points={[
                              x + (2 * width) / 3,
                              y + cushionInsetY + 4,
                              x + (2 * width) / 3,
                              y + depth - cushionInsetY - 4,
                            ]}
                            stroke="rgba(255,201,127,0.72)"
                            strokeWidth={1.1}
                          />
                        </>
                      ) : null}
                    </Group>
                  );
                })}

                {placedItems.map((item) => {
                  if (item.product.category !== "workstations") return null;
                  if (
                    item.variant.footprintShape === "linear-shared" ||
                    item.variant.footprintShape === "linear-non-sharing"
                  ) {
                    return null;
                  }

                  const width = item.dimensions.widthMm * canvasMetrics.scale;
                  const depth = item.dimensions.depthMm * canvasMetrics.scale;
                  const x = canvasMetrics.roomX + item.xMm * canvasMetrics.scale;
                  const y = canvasMetrics.roomY + item.yMm * canvasMetrics.scale;
                  const pedestalWidth = Math.max(14, Math.min(28, width * 0.12));
                  const pedestalHeight = Math.max(12, Math.min(22, depth * 0.18));
                  const pedestalCount = (item.variant.seatCount ?? 0) >= 4 ? 2 : 1;

                  return Array.from({ length: pedestalCount }).map((_, index) => {
                    const progress = pedestalCount === 1 ? 0.5 : index / (pedestalCount - 1);
                    const pedestalX =
                      x + 18 + progress * Math.max(0, width - pedestalWidth - 36);

                    return (
                      <Rect
                        key={`${item.id}-pedestal-${index}`}
                        x={pedestalX}
                        y={y + depth - pedestalHeight - 12}
                        width={pedestalWidth}
                        height={pedestalHeight}
                        fill="rgba(15,23,42,0.55)"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth={1}
                        cornerRadius={0}
                      />
                    );
                  });
                })}

                {placedItems.map((item) => (
                  <Text
                    key={`${item.id}-label`}
                    x={canvasMetrics.roomX + item.xMm * canvasMetrics.scale + 10}
                    y={canvasMetrics.roomY + item.yMm * canvasMetrics.scale + 10}
                    width={Math.max(80, item.dimensions.widthMm * canvasMetrics.scale - 20)}
                    text={
                      item.variant.seatCount
                        ? `${item.product.family}  -  ${item.variant.seatCount} seats`
                        : `${item.product.family}  -  ${item.variant.unitCount ?? 1} units`
                    }
                    fontSize={12}
                    fill="#f8fafc"
                    listening={false}
                  />
                ))}

                {placedItems.map((item) => {
                  const width = item.dimensions.widthMm * canvasMetrics.scale;
                  const depth = item.dimensions.depthMm * canvasMetrics.scale;
                  const x = canvasMetrics.roomX + item.xMm * canvasMetrics.scale;
                  const y = canvasMetrics.roomY + item.yMm * canvasMetrics.scale;

                  return (
                    <Rect
                      key={`${item.id}-interaction-hit`}
                      x={x}
                      y={y}
                      width={width}
                      height={depth}
                      fill="rgba(15,23,42,0.001)"
                      draggable={activeTool === "select"}
                      dragBoundFunc={(position) => ({
                        x: clamp(
                          position.x,
                          canvasMetrics.roomX + interactionPaddingMm * canvasMetrics.scale,
                          canvasMetrics.roomX +
                            canvasMetrics.roomPxWidth -
                            width -
                            interactionPaddingMm * canvasMetrics.scale,
                        ),
                        y: clamp(
                          position.y,
                          canvasMetrics.roomY + interactionPaddingMm * canvasMetrics.scale,
                          canvasMetrics.roomY +
                            canvasMetrics.roomPxDepth -
                            depth -
                            interactionPaddingMm * canvasMetrics.scale,
                        ),
                      })}
                      onClick={() => {
                        setSelectedItemId(item.id);
                        setSelectedOpeningId(null);
                      }}
                      onTap={() => {
                        setSelectedItemId(item.id);
                        setSelectedOpeningId(null);
                      }}
                      onContextMenu={(event) => {
                        event.evt.preventDefault();
                        event.cancelBubble = true;
                        setSelectedItemId(item.id);
                        setSelectedOpeningId(null);
                        handleCanvasRightClick({ x: event.evt.clientX, y: event.evt.clientY });
                      }}
                      onDragStart={() => {
                        setSelectedItemId(item.id);
                        setSelectedOpeningId(null);
                        closeContextMenu();
                      }}
                      onDragMove={(event) => {
                        const curXMm =
                          (event.target.x() - canvasMetrics.roomX) / canvasMetrics.scale;
                        const curYMm =
                          (event.target.y() - canvasMetrics.roomY) / canvasMetrics.scale;
                        const guides = computeAlignGuides(
                          item.id,
                          curXMm,
                          curYMm,
                          item.dimensions.widthMm,
                          item.dimensions.depthMm,
                        );
                        setDragGuides(guides);
                      }}
                      onDragEnd={(event) => {
                        let rawXMm =
                          (event.target.x() - canvasMetrics.roomX) / canvasMetrics.scale;
                        let rawYMm =
                          (event.target.y() - canvasMetrics.roomY) / canvasMetrics.scale;

                        if (dragGuides.xMm !== null) {
                          const left = dragGuides.xMm;
                          const right = dragGuides.xMm - item.dimensions.widthMm;
                          const center = dragGuides.xMm - item.dimensions.widthMm / 2;
                          const candidates = [left, right, center];
                          let bestDist = Infinity;
                          for (const c of candidates) {
                            const dist = Math.abs(rawXMm - c);
                            if (dist < bestDist) {
                              bestDist = dist;
                              rawXMm = c;
                            }
                          }
                        }
                        if (dragGuides.yMm !== null) {
                          const top = dragGuides.yMm;
                          const bottom = dragGuides.yMm - item.dimensions.depthMm;
                          const center = dragGuides.yMm - item.dimensions.depthMm / 2;
                          const candidates = [top, bottom, center];
                          let bestDist = Infinity;
                          for (const c of candidates) {
                            const dist = Math.abs(rawYMm - c);
                            if (dist < bestDist) {
                              bestDist = dist;
                              rawYMm = c;
                            }
                          }
                        }

                        const xMm = clampAndSnap(
                          rawXMm,
                          interactionPaddingMm,
                          room.widthMm - interactionPaddingMm - item.dimensions.widthMm,
                        );
                        const yMm = clampAndSnap(
                          rawYMm,
                          interactionPaddingMm,
                          room.depthMm - interactionPaddingMm - item.dimensions.depthMm,
                        );
                        setItems((current) =>
                          current.map((entry) =>
                            entry.id === item.id ? { ...entry, xMm, yMm } : entry,
                          ),
                        );
                        setDragGuides({ xMm: null, yMm: null });
                      }}
                    />
                  );
                })}
                {dragGuides.xMm !== null ? (
                  <Line
                    points={[
                      canvasMetrics.roomX + dragGuides.xMm * canvasMetrics.scale,
                      canvasMetrics.roomY,
                      canvasMetrics.roomX + dragGuides.xMm * canvasMetrics.scale,
                      canvasMetrics.roomY + canvasMetrics.roomPxDepth,
                    ]}
                    stroke="rgba(239, 68, 68, 0.6)"
                    strokeWidth={1.5}
                    dash={[6, 4]}
                  />
                ) : null}
                {dragGuides.yMm !== null ? (
                  <Line
                    points={[
                      canvasMetrics.roomX,
                      canvasMetrics.roomY + dragGuides.yMm * canvasMetrics.scale,
                      canvasMetrics.roomX + canvasMetrics.roomPxWidth,
                      canvasMetrics.roomY + dragGuides.yMm * canvasMetrics.scale,
                    ]}
                    stroke="rgba(239, 68, 68, 0.6)"
                    strokeWidth={1.5}
                    dash={[6, 4]}
                  />
                ) : null}

                {notes.map((note) => (
                  <Group
                    key={note.id}
                    x={canvasMetrics.roomX + note.xMm * canvasMetrics.scale}
                    y={canvasMetrics.roomY + note.yMm * canvasMetrics.scale}
                    draggable={activeTool === "select"}
                    dragBoundFunc={(position) => ({
                      x: clamp(
                        position.x,
                        canvasMetrics.roomX + interactionPaddingMm * canvasMetrics.scale,
                        canvasMetrics.roomX +
                          canvasMetrics.roomPxWidth -
                          180 -
                          interactionPaddingMm * canvasMetrics.scale,
                      ),
                      y: clamp(
                        position.y,
                        canvasMetrics.roomY + interactionPaddingMm * canvasMetrics.scale,
                        canvasMetrics.roomY +
                          canvasMetrics.roomPxDepth -
                          52 -
                          interactionPaddingMm * canvasMetrics.scale,
                      ),
                    })}
                    onDragEnd={(event) => {
                      const xMm = clampAndSnap(
                        (event.target.x() - canvasMetrics.roomX) / canvasMetrics.scale,
                        interactionPaddingMm,
                        room.widthMm - interactionPaddingMm - 1000,
                      );
                      const yMm = clampAndSnap(
                        (event.target.y() - canvasMetrics.roomY) / canvasMetrics.scale,
                        interactionPaddingMm,
                        room.depthMm - interactionPaddingMm - 300,
                      );
                      setNotes((current) =>
                        current.map((entry) =>
                          entry.id === note.id ? { ...entry, xMm, yMm } : entry,
                        ),
                      );
                    }}
                  >
                    <Rect
                      width={180}
                      height={52}
                      fill="rgba(255, 248, 196, 0.96)"
                      stroke="rgba(161, 98, 7, 0.35)"
                      strokeWidth={1.5}
                      cornerRadius={10}
                    />
                    <Text
                      x={12}
                      y={12}
                      width={156}
                      text={note.text}
                      fontSize={13}
                      fill="#854d0e"
                    />
                  </Group>
                ))}
              </Layer>
            </Stage>
          ) : null}
          {contextMenu.open ? (
            <div
              ref={contextMenuRef}
              className="absolute z-30 w-48 rounded-xl border border-soft bg-panel p-2 shadow-xl"
              style={{ left: contextMenu.x, top: contextMenu.y }}
              onMouseDown={(event) => event.stopPropagation()}
              onContextMenu={(event) => event.preventDefault()}
            >
              <button
                type="button"
                onClick={() => {
                  setPlannerTool("select");
                  closeContextMenu();
                }}
                className="flex w-full items-center justify-start rounded-md px-2 py-1.5 text-sm text-strong hover:bg-hover"
              >
                Select
              </button>
              <button
                type="button"
                disabled={!selectedItem && !selectedOpening}
                onClick={() => {
                  rotateSelectedEntity();
                  closeContextMenu();
                }}
                className="flex w-full items-center justify-start rounded-md px-2 py-1.5 text-sm text-strong hover:bg-hover disabled:cursor-not-allowed disabled:opacity-40"
              >
                Rotate
              </button>
              <button
                type="button"
                disabled={!selectedItem && !selectedOpening}
                onClick={() => {
                  flipSelectedEntity();
                  closeContextMenu();
                }}
                className="flex w-full items-center justify-start rounded-md px-2 py-1.5 text-sm text-strong hover:bg-hover disabled:cursor-not-allowed disabled:opacity-40"
              >
                Flip
              </button>
              <button
                type="button"
                disabled={!selectedItem}
                onClick={() => {
                  duplicateSelectedItem();
                  closeContextMenu();
                }}
                className="flex w-full items-center justify-start rounded-md px-2 py-1.5 text-sm text-strong hover:bg-hover disabled:cursor-not-allowed disabled:opacity-40"
              >
                Duplicate
              </button>
              <button
                type="button"
                disabled={!selectedItem && !selectedOpening}
                onClick={() => {
                  deleteSelectedEntity();
                  closeContextMenu();
                }}
                className="flex w-full items-center justify-start rounded-md px-2 py-1.5 text-sm text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Delete
              </button>
            </div>
          ) : null}
        </div>
      </div>

    </div>
  );

  const inspectorPanel = (
    <div className="space-y-3">
      {selectedOpening ? (
        <CollapsibleSection
          title="Opening details"
          collapsed={collapsedSections.openingDetails}
          onToggle={() => toggleSection("openingDetails")}
          summary={`${getOpeningTitle(selectedOpening.type)} • ${selectedOpening.edge}`}
        >
          <div className="mt-4 space-y-4 rounded-[1.1rem] border border-soft bg-panel p-3 shadow-sm">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-soft bg-hover p-2.5">
                <p className="text-[11px] font-medium text-subtle">Type</p>
                <p className="mt-2 text-sm font-semibold text-strong">
                  {getOpeningTitle(selectedOpening.type)}
                </p>
              </div>
              <div className="rounded-xl border border-soft bg-hover p-2.5">
                <p className="text-[11px] font-medium text-subtle">Edge</p>
                <p className="mt-2 text-sm font-semibold text-strong">
                  {selectedOpening.edge}
                </p>
              </div>
              <div className="rounded-xl border border-soft bg-hover p-2.5">
                <p className="text-[11px] font-medium text-subtle">Width</p>
                <p className="mt-2 text-sm font-semibold text-strong">
                  {formatDimension(selectedOpening.widthMm, unitSystem)}
                </p>
              </div>
              <div className="rounded-xl border border-soft bg-hover p-2.5">
                <p className="text-[11px] font-medium text-subtle">Offset</p>
                <p className="mt-2 text-sm font-semibold text-strong">
                  {formatDimension(selectedOpening.offsetMm, unitSystem)}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={rotateSelectedOpening}
                className="inline-flex min-h-9 items-center justify-center gap-2 rounded-full border border-soft bg-panel px-3 text-sm text-strong transition hover:border-primary/40"
              >
                <RotateCw className="h-4 w-4" />
                Rotate edge
              </button>
              <button
                type="button"
                onClick={flipSelectedOpening}
                className="inline-flex min-h-9 items-center justify-center gap-2 rounded-full border border-soft bg-panel px-3 text-sm text-strong transition hover:border-primary/40"
              >
                <FlipHorizontal className="h-4 w-4" />
                Flip along edge
              </button>
              <button
                type="button"
                onClick={deleteSelectedOpening}
                className="inline-flex min-h-9 items-center justify-center gap-2 rounded-full border border-rose-200/70 bg-rose-50 px-3 text-sm text-rose-700 transition hover:border-rose-300"
              >
                <Trash2 className="h-4 w-4" />
                Delete opening
              </button>
            </div>
          </div>
        </CollapsibleSection>
      ) : null}
      <CollapsibleSection
        title="Product details"
        collapsed={collapsedSections.details}
        onToggle={() => toggleSection("details")}
        summary={selectedProduct ? selectedProduct.name : "Select a product"}
      >
        {selectedProduct && selectedVariant && selectedDimensions ? (
          <div className="mt-4 space-y-4 rounded-[1.1rem] border border-soft bg-panel p-3 shadow-sm">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-soft bg-hover p-2.5">
                <p className="text-[11px] font-medium text-subtle">Selection</p>
                <p className="mt-2 text-sm font-semibold text-strong">{selectedVariant.label}</p>
              </div>
              <div className="rounded-xl border border-soft bg-hover p-2.5">
                <p className="text-[11px] font-medium text-subtle">Finish</p>
                <p className="mt-2 text-sm font-semibold text-strong">{selectedItem?.finish}</p>
              </div>
              <div className="rounded-xl border border-soft bg-hover p-2.5">
                <p className="text-[11px] font-medium text-subtle">Width</p>
                <p className="mt-2 text-sm font-semibold text-strong">{formatDimension(selectedDimensions.widthMm, unitSystem)}</p>
              </div>
              <div className="rounded-xl border border-soft bg-hover p-2.5">
                <p className="text-[11px] font-medium text-subtle">Depth</p>
                <p className="mt-2 text-sm font-semibold text-strong">{formatDimension(selectedDimensions.depthMm, unitSystem)}</p>
              </div>
            </div>
            <p className="text-sm leading-6 text-body">{selectedProduct.description}</p>
            <CollapsibleSection
              title="Sizes and options"
              collapsed={collapsedSections.variants}
              onToggle={() => toggleSection("variants")}
              summary={selectedVariant.label}
            >
              <div className="flex flex-wrap gap-2">
                {selectedProduct.variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => updateSelectedItem({ variantId: variant.id })}
                    className={`rounded-full border px-3 py-2 text-xs uppercase tracking-[0.2em] transition ${
                      selectedVariant.id === variant.id
                        ? "border-primary bg-hover text-strong"
                        : "border-soft text-muted hover:border-primary/40 hover:text-strong"
                    }`}
                  >
                    {variant.label}
                  </button>
                ))}
              </div>
            </CollapsibleSection>
            <CollapsibleSection
              title="Finish palette"
              collapsed={collapsedSections.finishes}
              onToggle={() => toggleSection("finishes")}
              summary={selectedItem?.finish}
            >
              <div className="flex flex-wrap gap-2">
                {selectedProduct.finishes.map((finish) => (
                  <button
                    key={finish}
                    type="button"
                    onClick={() => updateSelectedItem({ finish })}
                    className={`rounded-full border px-3 py-2 text-xs uppercase tracking-[0.2em] transition ${
                      selectedItem?.finish === finish
                        ? "border-primary bg-hover text-strong"
                        : "border-soft text-muted hover:border-primary/40 hover:text-strong"
                    }`}
                  >
                    {finish}
                  </button>
                ))}
              </div>
            </CollapsibleSection>
            <CollapsibleSection
              title="Why this item works"
              collapsed={collapsedSections.planningNote}
              onToggle={() => toggleSection("planningNote")}
              summary="Fit rationale"
            >
              <p className="text-sm leading-7 text-body">{selectedVariant.notes}</p>
            </CollapsibleSection>
            {selectedVariant.modelUrl ? (
              <CollapsibleSection
                title="Optional model view"
                collapsed={collapsedSections.threeD}
                onToggle={() => toggleSection("threeD")}
                summary="Available for this item"
              >
                <div className="space-y-3">
                  <button type="button" onClick={() => setShowThreeD((current) => !current)} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-soft bg-panel px-4 text-sm text-strong transition hover:border-primary/40">{showThreeD ? "Hide 3D" : "View in 3D"}</button>
                  {showThreeD ? <div className="h-[320px] overflow-hidden rounded-2xl border border-soft bg-panel"><ThreeViewer modelUrl={selectedVariant.modelUrl} /></div> : null}
                </div>
              </CollapsibleSection>
            ) : null}
            <Link href={selectedProduct.href} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-inverse px-4 text-sm text-inverse transition hover:bg-primary">
              View product family
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="mt-4 rounded-[1rem] border border-dashed border-soft bg-hover p-4 text-sm leading-6 text-body">
            Select any object in the room to see its sample image, dimensions, finishes, and optional 3D preview here.
          </div>
        )}
      </CollapsibleSection>

    </div>
  );

  const actionBar = (
    <section className="rounded-[1rem] border border-soft bg-panel px-4 py-3 ml-10">
      <input
        ref={importSceneRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          loadSceneFromFile(file);
          event.target.value = "";
        }}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <p className="text-sm font-semibold text-strong">{seatCount} seats</p>
          <p className="text-sm text-muted">{INR.format(totalValue)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={undo} title="Undo (Ctrl+Z)" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-soft bg-hover text-strong transition hover:border-primary/40">
            <Undo2 className="h-4 w-4" />
          </button>
          <button type="button" onClick={redo} title="Redo (Ctrl+Y)" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-soft bg-hover text-strong transition hover:border-primary/40">
            <Redo2 className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 2.5))} title="Zoom in" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-soft bg-hover text-strong transition hover:border-primary/40">
            <ZoomIn className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.5))} title="Zoom out" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-soft bg-hover text-strong transition hover:border-primary/40">
            <ZoomOut className="h-4 w-4" />
          </button>
          <button type="button" onClick={downloadScene} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-soft bg-hover px-4 text-sm text-strong transition hover:border-primary/40">
            Save plan
          </button>
          <button
            type="button"
            onClick={() => importSceneRef.current?.click()}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-soft bg-hover px-4 text-sm text-strong transition hover:border-primary/40"
          >
            Load plan
          </button>
          <button type="button" onClick={resetCanvas} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-soft bg-hover px-4 text-sm text-strong transition hover:border-primary/40">
            Reset canvas
          </button>
          <button type="button" onClick={() => setQueryAction("what-fits")} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-soft bg-hover px-4 text-sm text-strong transition hover:border-primary/40"><Search className="h-4 w-4" />What fits</button>
          <Link href="/contact?source=configurator" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-inverse px-5 text-sm text-inverse transition hover:bg-primary">
            Request quote
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );

  return (
    <div className="flex min-h-[640px] flex-col xl:flex-row">

      {/* Left rail — room setup + catalog */}
      <aside className="hidden w-[400px] shrink-0 flex-col overflow-y-auto border-r border-soft bg-panel xl:flex xl:h-[calc(100vh-48px)] xl:sticky xl:top-0">
        <div className="space-y-3 p-4">
          {leftRail}
        </div>
      </aside>

      {/* Centre — canvas + action bar + panels below */}
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <div className="flex h-[calc(100vh-48px)] min-h-[580px] flex-col">
          <div className="flex-1 overflow-hidden">
            {canvasPanel}
          </div>
          {actionBar}
        </div>
        <div className="border-t border-soft bg-panel px-4 py-3 overflow-x-auto">
          <div className="flex gap-3 min-w-max">
            <div className="w-[320px] shrink-0">{inspectorPanel}</div>
            <div className="w-[360px] shrink-0">
              <CollapsibleSection
                title="Ask the plan"
                collapsed={collapsedSections.queryTools}
                onToggle={() => toggleSection("queryTools")}
                summary={aiSuggestions.length > 0 ? `${aiSuggestions.length} AI suggestions` : "Ask in plain English"}
              >
                {/* Natural-language input */}
                <form
                  className="mt-4 flex gap-2"
                  onSubmit={(e) => { e.preventDefault(); void runAiQuery(); }}
                >
                  <input
                    type="text"
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    placeholder="e.g. add a meeting table for 8 people near the window"
                    disabled={aiLoading}
                    className="min-w-0 flex-1 rounded-xl border border-soft bg-hover px-4 py-2.5 text-sm text-strong placeholder:text-muted focus:border-primary/60 focus:outline-none disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={aiLoading || !aiQuery.trim()}
                    className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-soft bg-hover px-4 text-sm text-strong transition hover:border-primary/40 disabled:opacity-40"
                  >
                    {aiLoading ? (
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    {aiLoading ? "Thinking…" : "Ask AI"}
                  </button>
                </form>
                {!aiLoading && aiSuggestions.length === 0 && !aiError && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["What workstations fit best?", "Add a meeting table for 8", "Suggest storage for this room", "Premium seating options"].map((chip) => (
                      <button key={chip} type="button" onClick={() => { setAiQuery(chip); }} className="rounded-full border border-soft px-3 py-1 text-xs text-muted transition hover:border-primary/40 hover:text-strong">{chip}</button>
                    ))}
                  </div>
                )}
                {aiThoughts && <p className="mt-4 text-sm text-muted italic">{aiThoughts}</p>}
                {aiError && <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{aiError}</p>}
                {aiSuggestions.length > 0 && (
                  <div className="mt-4 grid gap-3">
                    {aiSuggestions.map((suggestion) => {
                      const product = getProduct(suggestion.productId);
                      const variant = getVariant(suggestion.productId, suggestion.variantId);
                      if (!product || !variant) return null;
                      return (
                        <button key={`${suggestion.productId}-${suggestion.variantId}`} type="button" onClick={() => addProduct(product.id, variant.id)} className="w-full rounded-2xl border border-soft bg-hover p-4 text-left transition hover:border-primary/40">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-strong">{product.name}</p>
                              <p className="mt-1 text-xs uppercase tracking-[0.24em] text-subtle">{suggestion.badge}</p>
                            </div>
                            <span className={`shrink-0 rounded-full border px-2 py-1 text-[11px] uppercase tracking-[0.24em] ${suggestion.canFit ? "border-emerald-300/50 text-emerald-700" : "border-amber-300/50 text-amber-700"}`}>{suggestion.canFit ? "Fits" : "Needs check"}</span>
                          </div>
                          <p className="mt-2 text-sm text-body">{suggestion.reason}</p>
                          <p className="mt-1 text-xs text-subtle">{variant.label} · {variant.widthMm / 1000}m × {variant.depthMm / 1000}m</p>
                        </button>
                      );
                    })}
                    <button type="button" onClick={() => { setAiSuggestions([]); setAiThoughts(null); setAiQuery(""); }} className="text-xs text-muted underline underline-offset-2 hover:text-strong">Clear suggestions</button>
                  </div>
                )}
                {aiSuggestions.length === 0 && !aiLoading && !aiError && (
                  <div className="mt-4 grid gap-3">
                    {querySuggestions.map((suggestion) => {
                      const product = getProduct(suggestion.productId);
                      const variant = getVariant(suggestion.productId, suggestion.variantId);
                      if (!product || !variant) return null;
                      return (
                        <button key={`${suggestion.productId}-${suggestion.variantId}`} type="button" onClick={() => addProduct(product.id, variant.id)} className="w-full rounded-2xl border border-soft bg-hover p-4 text-left transition hover:border-primary/40">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-strong">{product.name}</p>
                              <p className="mt-1 text-xs uppercase tracking-[0.24em] text-subtle">{suggestion.badge}</p>
                            </div>
                            <span className={`shrink-0 rounded-full border px-2 py-1 text-[11px] uppercase tracking-[0.24em] ${suggestion.canFit ? "border-emerald-300/50 text-emerald-700" : "border-amber-300/50 text-amber-700"}`}>{suggestion.canFit ? "Fits" : "Needs check"}</span>
                          </div>
                          <p className="mt-2 text-sm text-body">{suggestion.reason}</p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </CollapsibleSection>
            </div>
            <div className="w-[320px] shrink-0">
              <CollapsibleSection
                title="Doors and windows"
                collapsed={collapsedSections.openings}
                onToggle={() => toggleSection("openings")}
                summary={`${openings.length} opening${openings.length === 1 ? "" : "s"}`}
              >
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" onClick={() => addOpening("door")} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-soft bg-hover px-4 text-sm text-strong transition hover:border-primary/40"><DoorOpen className="h-4 w-4" />Add single door</button>
                  <button type="button" onClick={() => addOpening("double-door")} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-soft bg-hover px-4 text-sm text-strong transition hover:border-primary/40"><DoorOpen className="h-4 w-4" />Add double door</button>
                  <button type="button" onClick={() => addOpening("window")} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-soft bg-hover px-4 text-sm text-strong transition hover:border-primary/40"><Square className="h-4 w-4" />Add window</button>
                </div>
                <div className="mt-4 space-y-3">
                  {openings.map((opening) => (
                    <div key={opening.id} className="rounded-2xl border border-soft bg-hover p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-strong">{getOpeningTitle(opening.type)}</p>
                        <button type="button" onClick={() => setOpenings((current) => current.filter((item) => item.id !== opening.id))} className="text-xs uppercase tracking-[0.24em] text-muted transition hover:text-danger">Remove</button>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-medium uppercase tracking-wider text-subtle">Type</label>
                          <select value={opening.type} onChange={(event) => setOpenings((current) => current.map((item) => item.id === opening.id ? (() => { const nextType = event.target.value as Opening["type"]; return { ...item, type: nextType, widthMm: nextType === item.type ? item.widthMm : getOpeningDefaultWidthMm(nextType) }; })() : item))} className="w-full rounded-lg border border-soft bg-panel px-2 py-1.5 text-xs text-strong outline-none transition focus:border-primary">
                            <option value="door">Single door</option>
                            <option value="double-door">Double door</option>
                            <option value="window">Window</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-medium uppercase tracking-wider text-subtle">Wall</label>
                          <select value={opening.edge} onChange={(event) => setOpenings((current) => current.map((item) => item.id === opening.id ? { ...item, edge: event.target.value as Opening["edge"] } : item))} className="w-full rounded-lg border border-soft bg-panel px-2 py-1.5 text-xs text-strong outline-none transition focus:border-primary">
                            <option value="top">Top</option>
                            <option value="right">Right</option>
                            <option value="bottom">Bottom</option>
                            <option value="left">Left</option>
                          </select>
                        </div>
                        <div className="col-span-2 flex flex-col gap-1">
                          <label className="whitespace-nowrap text-[10px] font-medium uppercase tracking-wider text-subtle">Offset mm</label>
                          <input type="number" min={150} max={Math.max(150, (opening.edge === "top" || opening.edge === "bottom" ? room.widthMm : room.depthMm) - opening.widthMm - 150)} value={opening.offsetMm} onChange={(event) => setOpenings((current) => current.map((item) => { if (item.id !== opening.id) return item; const spanLimit = item.edge === "top" || item.edge === "bottom" ? room.widthMm : room.depthMm; return { ...item, offsetMm: clamp(Number(event.target.value) || item.offsetMm, 150, Math.max(150, spanLimit - item.widthMm - 150)) }; }))} className="w-full rounded-lg border border-soft bg-panel px-2 py-1.5 text-xs text-strong outline-none transition focus:border-primary" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>
            </div>
            <div className="w-[280px] shrink-0">
              <CollapsibleSection
                title="Next move"
                collapsed={collapsedSections.nextMove}
                onToggle={() => toggleSection("nextMove")}
                summary={`${shortlist.length} shortlisted`}
              >
                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl border border-soft bg-hover p-4">
                    <p className="text-sm font-medium text-strong">{shortlist.length} families shortlisted</p>
                    <p className="mt-2 text-sm text-body">Carry the room logic into the quote conversation.</p>
                  </div>
                  <Link href="/contact?source=configurator" className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-inverse transition hover:bg-inverse">
                    Request quote
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </CollapsibleSection>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: full-width stacked below (shown only on < xl) */}
      <div className="block border-t border-soft xl:hidden">
        <div className="grid gap-3 p-4 sm:grid-cols-2">
          <div className="space-y-3">{leftRail}</div>
          <div className="space-y-3">{inspectorPanel}</div>
        </div>
      </div>

    </div>
  );
}


