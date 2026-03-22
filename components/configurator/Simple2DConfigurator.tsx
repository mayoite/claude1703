"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  Bot,
  ChevronDown,
  ChevronUp,
  Grid3X3,
  Layers3,
  Loader2,
  Send,
  Wand2,
} from "lucide-react";
import {
  BUDGET_BANDS,
  CONFIGURATOR_COPY,
  CONFIGURATOR_COPILOT_STARTERS,
  CONFIGURATOR_SVG_TONES,
  FINISH_OPTIONS,
  MODESTY_OPTIONS,
  RACEWAY_OPTIONS,
  SCREEN_OPTIONS,
  SERIES_BASE_SEAT_PRICE,
  SERIES_SUGGESTIONS,
  STORAGE_BASE_UNIT_PRICE,
  STORAGE_LAYOUT_OPTIONS,
  STORAGE_MODE_OPTIONS,
  WORKSTATION_LAYOUTS,
  WORKSTATION_SERIES,
  type BudgetBandId,
  type LayoutId,
  type ModestyId,
  type ProjectType,
  type RacewayId,
  type ScreenId,
  type StorageModeId,
  type WorkstationSeries,
} from "@/data/site/configurator";
import { type AdvisorResult, type ConfiguratorAdvisorContext } from "@/lib/aiAdvisor";
import { getCatalogProductHref } from "@/lib/catalogCategories";

type ConfiguratorMode = "quick-estimate" | "technical-planner";

type ConfigForm = {
  projectType: ProjectType;
  workstationSeries: WorkstationSeries;
  layoutId: LayoutId;
  moduleCount: number;
  modulesPerRow: number;
  deskWidth: number;
  deskDepth: number;
  aisleWidth: number;
  screen: ScreenId;
  screenHeight: number;
  modesty: ModestyId;
  raceway: RacewayId;
  powerPerSeat: number;
  dataPerSeat: number;
  storageMode: StorageModeId;
  storageLayout: string;
  storageRows: number;
  storageColumns: number;
  storageUnits: number;
  finish: string;
  roomWidth: number;
  roomLength: number;
  roomClearance: number;
  budgetBand: BudgetBandId;
  clientName: string;
  projectName: string;
  siteLocation: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  notes: string;
};

type SubmitState = {
  loading: boolean;
  error: string;
  queryId: string;
};

type CopilotState = {
  loading: boolean;
  error: string;
  result: AdvisorResult | null;
};

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function clampInteger(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.max(min, Math.min(max, Math.round(value)));
}

function optionExtra<T extends string>(
  options: Array<{ id: T; extraPerSeat: number }>,
  id: T,
): number {
  return options.find((option) => option.id === id)?.extraPerSeat ?? 0;
}

function countSeats(pattern: number[][]): number {
  return pattern.reduce(
    (total, row) => total + row.reduce((rowTotal, slot) => rowTotal + (slot ? 1 : 0), 0),
    0,
  );
}

function normalizePatternWidth(pattern: number[][]): number {
  return pattern.reduce((max, row) => Math.max(max, row.length), 0);
}

function ratingFromCoverage(planCoveragePercent: number) {
  if (planCoveragePercent > 70) return "Dense plan";
  if (planCoveragePercent > 45) return "Balanced plan";
  return "Breathing room";
}

export function Simple2DConfigurator({
  defaultType = "workstations",
}: {
  defaultType?: ProjectType;
}) {
  const pathname = usePathname();
  const reviewRef = useRef<HTMLDivElement | null>(null);
  const [mode, setMode] = useState<ConfiguratorMode>("quick-estimate");
  const [showQuickNotes, setShowQuickNotes] = useState(false);
  const [copilotQuery, setCopilotQuery] = useState("");
  const [copilot, setCopilot] = useState<CopilotState>({
    loading: false,
    error: "",
    result: null,
  });
  const [form, setForm] = useState<ConfigForm>({
    projectType: defaultType,
    workstationSeries: "Desking Series",
    layoutId: "linear-bench",
    moduleCount: 6,
    modulesPerRow: 3,
    deskWidth: 1200,
    deskDepth: 600,
    aisleWidth: 1050,
    screen: "acrylic",
    screenHeight: 450,
    modesty: "metal",
    raceway: "spine",
    powerPerSeat: 1,
    dataPerSeat: 1,
    storageMode: "shared-pedestal",
    storageLayout: "Wall run",
    storageRows: 4,
    storageColumns: 4,
    storageUnits: 10,
    finish: "Warm Oak",
    roomWidth: 9000,
    roomLength: 14000,
    roomClearance: 450,
    budgetBand: "3l-8l",
    clientName: "",
    projectName: "",
    siteLocation: "",
    name: "",
    email: "",
    phone: "",
    company: "",
    notes: "",
  });
  const [submit, setSubmit] = useState<SubmitState>({
    loading: false,
    error: "",
    queryId: "",
  });

  const layoutOptions = useMemo(
    () =>
      WORKSTATION_LAYOUTS.filter((layout) => layout.supportedSeries.includes(form.workstationSeries)),
    [form.workstationSeries],
  );
  const activeLayout = useMemo(
    () => layoutOptions.find((layout) => layout.id === form.layoutId) ?? layoutOptions[0],
    [form.layoutId, layoutOptions],
  );

  const moduleCount = clampInteger(form.moduleCount, 1, 80);
  const modulesPerRow = clampInteger(form.modulesPerRow, 1, 10);
  const storageRows = clampInteger(form.storageRows, 1, 12);
  const storageColumns = clampInteger(form.storageColumns, 1, 12);
  const storageTotalCells = clampInteger(storageRows * storageColumns, 1, 144);
  const storageUnits = clampInteger(form.storageUnits, 1, storageTotalCells);
  const modulePatternRows = activeLayout?.seatPattern.length ?? 1;
  const modulePatternCols = activeLayout ? normalizePatternWidth(activeLayout.seatPattern) : 1;
  const seatsPerModule = activeLayout ? countSeats(activeLayout.seatPattern) : 1;
  const totalWorkstationSeats = moduleCount * seatsPerModule;
  const totalSeatsOrUnits =
    form.projectType === "workstations" ? totalWorkstationSeats : storageUnits;
  const moduleRows = Math.ceil(moduleCount / modulesPerRow);

  const roughWidthMm =
    form.projectType === "workstations"
      ? modulesPerRow * modulePatternCols * form.deskWidth + (modulesPerRow - 1) * form.aisleWidth
      : storageColumns * 900;
  const roughDepthMm =
    form.projectType === "workstations"
      ? moduleRows * modulePatternRows * form.deskDepth + (moduleRows - 1) * form.aisleWidth
      : storageRows * 600;

  const roomWidthMm = clampInteger(form.roomWidth, 3000, 50000);
  const roomLengthMm = clampInteger(form.roomLength, 3000, 50000);
  const roomClearanceMm = clampInteger(form.roomClearance, 0, 1500);
  const usableRoomWidthMm = Math.max(0, roomWidthMm - roomClearanceMm * 2);
  const usableRoomLengthMm = Math.max(0, roomLengthMm - roomClearanceMm * 2);
  const fitsAsDrawn = roughWidthMm <= usableRoomWidthMm && roughDepthMm <= usableRoomLengthMm;
  const fitsRotated = roughDepthMm <= usableRoomWidthMm && roughWidthMm <= usableRoomLengthMm;
  const fitOrientation = fitsAsDrawn ? "as-drawn" : fitsRotated ? "rotated" : "overflow";
  const fitWidthLimit = fitOrientation === "rotated" ? usableRoomLengthMm : usableRoomWidthMm;
  const fitDepthLimit = fitOrientation === "rotated" ? usableRoomWidthMm : usableRoomLengthMm;
  const overflowWidthMm = Math.max(0, roughWidthMm - fitWidthLimit);
  const overflowDepthMm = Math.max(0, roughDepthMm - fitDepthLimit);
  const roomAreaSqm = (roomWidthMm * roomLengthMm) / 1_000_000;
  const planAreaSqm = (roughWidthMm * roughDepthMm) / 1_000_000;
  const planCoveragePercent = roomAreaSqm > 0 ? Math.min(999, (planAreaSqm / roomAreaSqm) * 100) : 0;
  const areaPerSeatOrUnit = totalSeatsOrUnits > 0 ? roomAreaSqm / totalSeatsOrUnits : 0;

  const pricing = useMemo(() => {
    if (form.projectType === "storages") {
      const total = storageUnits * STORAGE_BASE_UNIT_PRICE;
      return { low: Math.round(total * 0.9), high: Math.round(total * 1.1) };
    }

    const perSeat =
      SERIES_BASE_SEAT_PRICE[form.workstationSeries] +
      optionExtra(SCREEN_OPTIONS, form.screen) +
      optionExtra(MODESTY_OPTIONS, form.modesty) +
      optionExtra(RACEWAY_OPTIONS, form.raceway) +
      optionExtra(STORAGE_MODE_OPTIONS, form.storageMode) +
      form.powerPerSeat * 650 +
      form.dataPerSeat * 450;
    const total = totalWorkstationSeats * perSeat;
    return { low: Math.round(total * 0.9), high: Math.round(total * 1.12) };
  }, [
    form.dataPerSeat,
    form.modesty,
    form.powerPerSeat,
    form.projectType,
    form.raceway,
    form.screen,
    form.storageMode,
    form.workstationSeries,
    storageUnits,
    totalWorkstationSeats,
  ]);

  const drawing = useMemo(() => {
    if (form.projectType === "storages") {
      const cells = Array.from({ length: storageTotalCells }, (_, index) => ({
        x: index % storageColumns,
        y: Math.floor(index / storageColumns),
        active: index < storageUnits,
      }));
      return { cells, gridRows: storageRows, gridCols: storageColumns, racewayCenters: [] as number[] };
    }

    if (!activeLayout) {
      return { cells: [] as Array<{ x: number; y: number; active: boolean }>, gridRows: 1, gridCols: 1, racewayCenters: [] as number[] };
    }

    const pattern = activeLayout.seatPattern;
    const patternRows = pattern.length;
    const patternCols = normalizePatternWidth(pattern);
    const cells: Array<{ x: number; y: number; active: boolean }> = [];

    for (let moduleIndex = 0; moduleIndex < moduleCount; moduleIndex += 1) {
      const moduleRow = Math.floor(moduleIndex / modulesPerRow);
      const moduleCol = moduleIndex % modulesPerRow;
      const originY = moduleRow * (patternRows + 1);
      const originX = moduleCol * (patternCols + 1);

      for (let row = 0; row < patternRows; row += 1) {
        for (let col = 0; col < patternCols; col += 1) {
          if (!pattern[row]?.[col]) continue;
          cells.push({ x: originX + col, y: originY + row, active: true });
        }
      }
    }

    const racewayCenters: number[] = [];
    if (form.raceway !== "none") {
      for (let row = 0; row < moduleRows; row += 1) {
        racewayCenters.push(row * (patternRows + 1) + Math.floor(patternRows / 2));
      }
    }

    return {
      cells,
      gridRows: moduleRows * patternRows + Math.max(0, moduleRows - 1),
      gridCols: modulesPerRow * patternCols + Math.max(0, modulesPerRow - 1),
      racewayCenters,
    };
  }, [
    activeLayout,
    form.projectType,
    form.raceway,
    moduleCount,
    moduleRows,
    modulesPerRow,
    storageColumns,
    storageRows,
    storageTotalCells,
    storageUnits,
  ]);

  const screenLabel = SCREEN_OPTIONS.find((option) => option.id === form.screen)?.label ?? "No screens";
  const modestyLabel =
    MODESTY_OPTIONS.find((option) => option.id === form.modesty)?.label ?? "No modesty panel";
  const racewayLabel =
    RACEWAY_OPTIONS.find((option) => option.id === form.raceway)?.label ?? "No raceway";
  const storageModeLabel =
    STORAGE_MODE_OPTIONS.find((option) => option.id === form.storageMode)?.label ?? "No pedestal";
  const fitStatusText =
    fitOrientation === "overflow"
      ? `Over by ${Math.round(overflowWidthMm / 10) / 100}m x ${Math.round(overflowDepthMm / 10) / 100}m`
      : fitOrientation === "rotated"
        ? "Fits after rotating layout"
        : "Fits within room";
  const fitStatusTone =
    fitOrientation === "overflow"
      ? "configurator-visual__fit-chip configurator-visual__fit-chip--bad"
      : "configurator-visual__fit-chip configurator-visual__fit-chip--ok";
  const budgetBandLabel =
    BUDGET_BANDS.find((band) => band.id === form.budgetBand)?.label ?? "Need guidance";
  const budgetRangeText = `${CURRENCY_FORMATTER.format(pricing.low)} - ${CURRENCY_FORMATTER.format(
    pricing.high,
  )}`;
  const fitSummary =
    fitOrientation === "overflow"
      ? `Needs ${Math.ceil((overflowWidthMm + overflowDepthMm) / 1000)}m more planning allowance.`
      : fitOrientation === "rotated"
        ? "Layout works if the room orientation flips at installation stage."
        : "Current arrangement fits with the selected planning allowance.";
  const reviewChecklist = [
    `${totalSeatsOrUnits} ${form.projectType === "workstations" ? "seats" : "units"}`,
    fitStatusText,
    `${ratingFromCoverage(planCoveragePercent)} at ${Math.round(planCoveragePercent)}% coverage`,
  ];
  const selectedOptionSummary =
    form.projectType === "workstations"
      ? [screenLabel, modestyLabel, racewayLabel, storageModeLabel, form.finish]
      : [form.storageLayout, form.finish];
  const advisorContext: ConfiguratorAdvisorContext = {
    source: "configurator",
    mode,
    sourcePath: pathname,
    projectType: form.projectType,
    seatOrUnitCount: totalSeatsOrUnits,
    moduleCount: form.projectType === "workstations" ? moduleCount : undefined,
    modulesPerRow: form.projectType === "workstations" ? modulesPerRow : undefined,
    workstationSeries: form.projectType === "workstations" ? form.workstationSeries : undefined,
    layoutLabel:
      form.projectType === "workstations" ? activeLayout?.label || form.layoutId : undefined,
    storageLayout: form.projectType === "storages" ? form.storageLayout : undefined,
    roomWidthMm,
    roomLengthMm,
    roomClearanceMm,
    fitStatus: fitStatusText,
    budgetBand: budgetBandLabel,
    siteLocation: form.siteLocation.trim() || undefined,
    estimatedBudget: budgetRangeText,
    keyOptions: selectedOptionSummary,
  };
  const canSubmit = Boolean(form.name.trim() && form.email.trim());
  const cellSize = 28;
  const svgWidth = Math.max(1, drawing.gridCols) * cellSize;
  const svgHeight = Math.max(1, drawing.gridRows) * cellSize;

  function setQuickSeatOrUnitCount(value: number) {
    if (form.projectType === "workstations") {
      const seatsRequested = clampInteger(value, seatsPerModule, 480);
      setForm((prev) => ({
        ...prev,
        moduleCount: clampInteger(Math.ceil(seatsRequested / seatsPerModule), 1, 80),
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      storageUnits: clampInteger(value, 1, storageTotalCells),
    }));
  }

  function openGuidedPlanner() {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new CustomEvent("oando-assistant:open", { detail: { tab: "guided" } }));
  }

  function jumpToReview() {
    reviewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function buildSubmissionSummary() {
    const lines = [
      form.projectType === "workstations"
        ? "Configurator dual-mode workstation brief"
        : "Configurator dual-mode storage brief",
      `Mode: ${mode}`,
      `Budget band: ${budgetBandLabel}`,
      `Site location: ${form.siteLocation.trim() || "Not specified"}`,
      `Room size: ${roomWidthMm} x ${roomLengthMm} mm`,
      `Perimeter clearance: ${roomClearanceMm} mm`,
      `Usable planning zone: ${usableRoomWidthMm} x ${usableRoomLengthMm} mm`,
      `Fit check: ${fitStatusText}`,
      `Rough footprint: ${roughWidthMm} x ${roughDepthMm} mm`,
      `Estimated budget: ${budgetRangeText}`,
    ];

    if (form.projectType === "workstations") {
      lines.push(
        `Series: ${form.workstationSeries}`,
        `Layout: ${activeLayout?.label || form.layoutId}`,
        `Module count: ${moduleCount}`,
        `Modules per row: ${modulesPerRow}`,
        `Seats per module: ${seatsPerModule}`,
        `Total seats: ${totalWorkstationSeats}`,
        `Desk size: ${form.deskWidth} x ${form.deskDepth} mm`,
        `Aisle width: ${form.aisleWidth} mm`,
        `Screen: ${screenLabel} (${form.screenHeight} mm)`,
        `Modesty: ${modestyLabel}`,
        `Raceway: ${racewayLabel}`,
        `Power points per seat: ${form.powerPerSeat}`,
        `Data points per seat: ${form.dataPerSeat}`,
        `Storage add-on: ${storageModeLabel}`,
      );
    } else {
      lines.push(
        `Storage layout: ${form.storageLayout}`,
        `Rows x columns: ${storageRows} x ${storageColumns}`,
        `Units: ${storageUnits}`,
      );
    }

    lines.push(`Finish: ${form.finish}`);
    lines.push(`Coverage: ${Math.round(planCoveragePercent)}%`);
    lines.push(
      `Area per ${form.projectType === "workstations" ? "seat" : "unit"}: ${areaPerSeatOrUnit.toFixed(
        2,
      )} sq m`,
    );

    if (form.clientName.trim()) lines.push(`End client: ${form.clientName.trim()}`);
    if (form.projectName.trim()) lines.push(`Project name: ${form.projectName.trim()}`);
    if (form.company.trim()) lines.push(`Company: ${form.company.trim()}`);
    if (form.notes.trim()) lines.push(`Notes: ${form.notes.trim()}`);

    return lines.join("\n");
  }

  async function submitEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) {
      setSubmit({
        loading: false,
        error: "Please add name and email to submit this configuration.",
        queryId: "",
      });
      return;
    }

    setSubmit({ loading: true, error: "", queryId: "" });

    try {
      const response = await fetch("/api/customer-queries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          company: form.company || undefined,
          message: buildSubmissionSummary(),
          requirement:
            form.projectType === "workstations"
              ? "Configurator workstation estimate"
              : "Configurator storage estimate",
          preferredContact: form.phone.trim() ? "phone" : "email",
          source:
            form.projectType === "workstations"
              ? "configurator-workstation-module"
              : "configurator-2d",
          sourcePath: pathname,
        }),
      });

      const json = (await response.json()) as { queryId?: string; error?: string };
      if (!response.ok || !json.queryId) {
        setSubmit({
          loading: false,
          error: json.error || "Unable to submit this configuration right now.",
          queryId: "",
        });
        return;
      }

      setSubmit({ loading: false, error: "", queryId: json.queryId });
    } catch {
      setSubmit({
        loading: false,
        error: "Network error while sending your enquiry.",
        queryId: "",
      });
    }
  }

  async function submitCopilotQuery(input: string) {
    const query = input.trim();
    if (!query || copilot.loading) return;

    setCopilot({ loading: true, error: "", result: null });
    setCopilotQuery(query);

    try {
      const response = await fetch("/api/ai-advisor/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, context: advisorContext }),
      });

      const json = (await response.json()) as AdvisorResult & { error?: string };
      if (!response.ok || !json.recommendations) {
        setCopilot({
          loading: false,
          error: json.error || "Unable to generate configurator guidance right now.",
          result: null,
        });
        return;
      }

      setCopilot({ loading: false, error: "", result: json });
    } catch {
      setCopilot({
        loading: false,
        error: "Network error while reaching the configurator copilot.",
        result: null,
      });
    }
  }

  const copilotPrompt =
    copilotQuery ||
    `Use the current ${form.projectType === "workstations" ? "workstation" : "storage"} snapshot`;

  return (
    <div className="configurator-shell">
      <div className="configurator-shell__main">
        <aside className="configurator-sidebar">
          <section className="configurator-visual lg:sticky lg:top-24">
            <div className="configurator-visual__glow" />
            <div className="configurator-visual__grid" />

            <div className="configurator-visual__header">
              <div>
                <p className="typ-label scheme-text-inverse-muted mb-2">{CONFIGURATOR_COPY.studioKicker}</p>
                <h2 className="text-2xl font-light tracking-tight text-inverse">
                  {form.projectType === "workstations"
                    ? CONFIGURATOR_COPY.workstationTitle
                    : CONFIGURATOR_COPY.storageTitle}
                </h2>
                <p className="scheme-text-inverse-body mt-2 text-sm">{CONFIGURATOR_COPY.studioDescription}</p>
              </div>
              <span className="configurator-visual__seat-chip">
                {totalSeatsOrUnits} {form.projectType === "workstations" ? "seats" : "units"}
              </span>
            </div>

            <div className="configurator-visual__canvas">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="h-auto w-full"
                role="img"
                aria-label={
                  form.projectType === "workstations"
                    ? "Rough workstation drawing"
                    : "Rough storage drawing"
                }
              >
                <rect x={0} y={0} width={svgWidth} height={svgHeight} fill={CONFIGURATOR_SVG_TONES.canvasFill} />
                {drawing.racewayCenters.map((rowCenter, index) => {
                  const y = rowCenter * cellSize + cellSize / 2;
                  return (
                    <line
                      key={`raceway-${index}`}
                      x1={2}
                      y1={y}
                      x2={svgWidth - 2}
                      y2={y}
                      stroke={
                        form.raceway === "full-power-beam"
                          ? CONFIGURATOR_SVG_TONES.fullPowerBeamStroke
                          : CONFIGURATOR_SVG_TONES.racewayStroke
                      }
                      strokeWidth={form.raceway === "full-power-beam" ? 4 : 2}
                      strokeDasharray={form.raceway === "tray" ? "6 4" : "0"}
                      opacity={0.85}
                    />
                  );
                })}

                {drawing.cells.map((cell, index) => {
                  const x = cell.x * cellSize + 2;
                  const y = cell.y * cellSize + 2;
                  const width = cellSize - 4;
                  const height = cellSize - 4;

                  return (
                    <g key={`${cell.x}-${cell.y}-${index}`}>
                      <rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        rx={5}
                        fill={
                          form.projectType === "workstations"
                            ? CONFIGURATOR_SVG_TONES.workstationFill
                            : CONFIGURATOR_SVG_TONES.storageFill
                        }
                        stroke={
                          form.projectType === "workstations"
                            ? CONFIGURATOR_SVG_TONES.workstationStroke
                            : CONFIGURATOR_SVG_TONES.storageStroke
                        }
                        strokeWidth={1.2}
                      />
                      {form.projectType === "workstations" && form.screen !== "none" ? (
                        <line
                          x1={x + 3}
                          y1={y + 4}
                          x2={x + width - 3}
                          y2={y + 4}
                          stroke={
                            form.screen === "glass"
                              ? CONFIGURATOR_SVG_TONES.glassScreenStroke
                              : CONFIGURATOR_SVG_TONES.screenStroke
                          }
                          strokeWidth={form.screenHeight >= 530 ? 3 : 2}
                          opacity={0.92}
                        />
                      ) : null}
                      {form.projectType === "workstations" && form.modesty !== "none" ? (
                        <line
                          x1={x + 3}
                          y1={y + height - 4}
                          x2={x + width - 3}
                          y2={y + height - 4}
                          stroke={CONFIGURATOR_SVG_TONES.modestyStroke}
                          strokeWidth={2}
                          opacity={0.75}
                        />
                      ) : null}
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="configurator-visual__stats">
              <div className="configurator-visual__stat">
                <p className="configurator-visual__stat-label">{CONFIGURATOR_COPY.totalLabel}</p>
                <p className="mt-1 text-2xl font-light text-inverse">{totalSeatsOrUnits}</p>
              </div>
              <div className="configurator-visual__stat">
                <p className="configurator-visual__stat-label">{CONFIGURATOR_COPY.footprintLabel}</p>
                <p className="mt-1 text-2xl font-light text-inverse">
                  {Math.round(roughWidthMm / 1000)}m x {Math.round(roughDepthMm / 1000)}m
                </p>
              </div>
              <div className="configurator-visual__stat">
                <p className="configurator-visual__stat-label">{CONFIGURATOR_COPY.fitLabel}</p>
                <p className="mt-1 text-sm font-semibold text-inverse">{fitStatusText}</p>
                <p className="scheme-text-inverse-muted mt-1 text-xs">
                  Room {Math.round(roomWidthMm / 1000)}m x {Math.round(roomLengthMm / 1000)}m
                </p>
              </div>
              <div className="configurator-visual__stat">
                <p className="configurator-visual__stat-label">{CONFIGURATOR_COPY.budgetLabel}</p>
                <p className="mt-1 text-lg font-medium text-inverse">{budgetRangeText}</p>
              </div>
            </div>

            <div className="relative z-10 mt-3 flex flex-wrap gap-2">
              <span className={fitStatusTone}>{fitStatusText}</span>
              <span className="configurator-visual__meta-chip">
                Coverage {Math.round(planCoveragePercent)}%
              </span>
              <span className="configurator-visual__meta-chip">
                {areaPerSeatOrUnit.toFixed(2)} sq m /{" "}
                {form.projectType === "workstations" ? "seat" : "unit"}
              </span>
            </div>

            <div className="relative z-10 mt-4 rounded-2xl border border-inverse bg-[color:var(--overlay-panel-08)] p-4">
              <p className="text-sm font-semibold text-inverse">Decision snapshot</p>
              <p className="scheme-text-inverse-body mt-2 text-sm">{fitSummary}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedOptionSummary.map((option) => (
                  <span key={option} className="configurator-visual__option-chip">
                    {option}
                  </span>
                ))}
              </div>
            </div>

            {form.projectType === "workstations" ? (
              <div className="configurator-visual__suggestions">
                <p className="typ-label scheme-text-inverse-muted mb-3">
                  {CONFIGURATOR_COPY.suggestedSystemsLabel}
                </p>
                <div className="configurator-visual__suggestion-grid">
                  {SERIES_SUGGESTIONS[form.workstationSeries].map((system) => (
                    <Link key={system.name} href={system.href} className="group configurator-visual__suggestion">
                      <div className="relative aspect-[16/10] bg-inverse">
                        <Image
                          src={system.image}
                          alt={system.name}
                          fill
                          sizes="(max-width: 1024px) 100vw, 30vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </div>
                      <div className="p-3">
                        <p className="text-base font-medium text-inverse">{system.name}</p>
                        <p className="scheme-text-inverse-body mt-1 text-sm leading-relaxed">{system.hint}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        </aside>

        <div className="configurator-content">
          <section className="configurator-form">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="typ-label mb-2 text-body">{CONFIGURATOR_COPY.setupKicker}</p>
                <h3 className="text-2xl font-light tracking-tight text-strong">
                  {CONFIGURATOR_COPY.setupTitle}
                </h3>
                <p className="mt-2 max-w-2xl text-sm text-muted">
                  {mode === "quick-estimate"
                    ? CONFIGURATOR_COPY.quickEstimateDescription
                    : CONFIGURATOR_COPY.technicalPlannerDescription}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={openGuidedPlanner}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-muted px-4 text-sm text-body transition-colors hover:border-strong hover:text-strong"
                >
                  <Bot className="h-4 w-4" />
                  {CONFIGURATOR_COPY.plannerSecondaryCta}
                </button>
                <button
                  type="button"
                  onClick={jumpToReview}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-inverse px-4 text-sm text-inverse transition-colors hover:bg-primary"
                >
                  {CONFIGURATOR_COPY.reviewCta}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-6">
              <p className="typ-overline mb-2 text-muted">
                {CONFIGURATOR_COPY.modeSwitcherLabel}
              </p>
              <div className="configurator-mode-switcher">
                <button
                  type="button"
                  onClick={() => setMode("quick-estimate")}
                  aria-pressed={mode === "quick-estimate"}
                  className={`configurator-mode-switcher__button ${
                    mode === "quick-estimate"
                      ? "configurator-mode-switcher__button--active"
                      : "configurator-mode-switcher__button--idle"
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold">{CONFIGURATOR_COPY.quickModeLabel}</p>
                    <p className="mt-1 text-xs text-muted">
                      {CONFIGURATOR_COPY.quickModeDescription}
                    </p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setMode("technical-planner")}
                  aria-pressed={mode === "technical-planner"}
                  className={`configurator-mode-switcher__button ${
                    mode === "technical-planner"
                      ? "configurator-mode-switcher__button--active"
                      : "configurator-mode-switcher__button--idle"
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold">{CONFIGURATOR_COPY.technicalModeLabel}</p>
                    <p className="mt-1 text-xs text-muted">
                      {CONFIGURATOR_COPY.technicalModeDescription}
                    </p>
                  </div>
                </button>
              </div>
            </div>

            <div className="mt-6 configurator-form__toggle-shell">
              {(["workstations", "storages"] as ProjectType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, projectType: type }))}
                  className={`configurator-form__toggle ${
                    form.projectType === type
                      ? "configurator-form__toggle--active"
                      : "configurator-form__toggle--idle"
                  }`}
                >
                  {type === "workstations" ? <Grid3X3 className="h-4 w-4" /> : <Layers3 className="h-4 w-4" />}
                  {type}
                </button>
              ))}
            </div>

            {mode === "quick-estimate" ? (
              <div className="mt-6 space-y-5">
                <div className="configurator-form__stage">
                  <p className="configurator-form__stage-title">{CONFIGURATOR_COPY.quickEstimateTitle}</p>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {form.projectType === "workstations" ? (
                      <>
                        <label className="configurator-form__field">
                          <span>Series</span>
                          <select
                            value={form.workstationSeries}
                            onChange={(event) =>
                              setForm((prev) => {
                                const workstationSeries = event.target.value as WorkstationSeries;
                                const nextLayoutOptions = WORKSTATION_LAYOUTS.filter((layout) =>
                                  layout.supportedSeries.includes(workstationSeries),
                                );
                                const layoutId = nextLayoutOptions.some((layout) => layout.id === prev.layoutId)
                                  ? prev.layoutId
                                  : (nextLayoutOptions[0]?.id ?? prev.layoutId);
                                return { ...prev, workstationSeries, layoutId };
                              })
                            }
                            className="configurator-form__input"
                          >
                            {WORKSTATION_SERIES.map((series) => (
                              <option key={series} value={series}>
                                {series}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="configurator-form__field">
                          <span>Layout</span>
                          <select
                            value={activeLayout?.id || form.layoutId}
                            onChange={(event) =>
                              setForm((prev) => ({ ...prev, layoutId: event.target.value as LayoutId }))
                            }
                            className="configurator-form__input"
                          >
                            {layoutOptions.map((layout) => (
                              <option key={layout.id} value={layout.id}>
                                {layout.label}
                              </option>
                            ))}
                          </select>
                        </label>
                      </>
                    ) : (
                      <label className="configurator-form__field md:col-span-2">
                        <span>Storage layout</span>
                        <select
                          value={form.storageLayout}
                          onChange={(event) =>
                            setForm((prev) => ({ ...prev, storageLayout: event.target.value }))
                          }
                          className="configurator-form__input"
                        >
                          {STORAGE_LAYOUT_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </label>
                    )}

                    <label className="configurator-form__field">
                      <span>{CONFIGURATOR_COPY.quickSeatsLabel}</span>
                      <input
                        type="number"
                        min={1}
                        max={form.projectType === "workstations" ? 480 : storageTotalCells}
                        value={totalSeatsOrUnits}
                        onChange={(event) => setQuickSeatOrUnitCount(Number(event.target.value))}
                        className="configurator-form__input"
                      />
                    </label>
                    <label className="configurator-form__field">
                      <span>{CONFIGURATOR_COPY.cityLabel}</span>
                      <input
                        type="text"
                        value={form.siteLocation}
                        onChange={(event) => setForm((prev) => ({ ...prev, siteLocation: event.target.value }))}
                        placeholder="Patna, Bihar"
                        className="configurator-form__input"
                      />
                    </label>
                    <label className="configurator-form__field">
                      <span>Room width (mm)</span>
                      <input
                        type="number"
                        min={3000}
                        max={50000}
                        value={roomWidthMm}
                        onChange={(event) =>
                          setForm((prev) => ({
                            ...prev,
                            roomWidth: clampInteger(Number(event.target.value), 3000, 50000),
                          }))
                        }
                        className="configurator-form__input"
                      />
                    </label>
                    <label className="configurator-form__field">
                      <span>Room length (mm)</span>
                      <input
                        type="number"
                        min={3000}
                        max={50000}
                        value={roomLengthMm}
                        onChange={(event) =>
                          setForm((prev) => ({
                            ...prev,
                            roomLength: clampInteger(Number(event.target.value), 3000, 50000),
                          }))
                        }
                        className="configurator-form__input"
                      />
                    </label>
                  </div>

                  <div className="mt-4">
                    <p className="mb-3 text-sm font-medium text-strong">
                      {CONFIGURATOR_COPY.budgetBandLabel}
                    </p>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      {BUDGET_BANDS.map((band) => (
                        <button
                          key={band.id}
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, budgetBand: band.id }))}
                          className={`configurator-budget-band ${
                            form.budgetBand === band.id
                              ? "configurator-budget-band--active"
                              : "configurator-budget-band--idle"
                          }`}
                        >
                          <span className="block text-sm font-semibold">{band.label}</span>
                          <span className="mt-1 block text-xs text-muted">{band.hint}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowQuickNotes((prev) => !prev)}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-body"
                  >
                    {showQuickNotes ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    {CONFIGURATOR_COPY.quickNotesLabel}
                  </button>

                  {showQuickNotes ? (
                    <div className="mt-3 rounded-2xl border border-soft bg-panel p-4">
                      <p className="text-sm text-muted">{CONFIGURATOR_COPY.quickNotesDescription}</p>
                      <textarea
                        rows={4}
                        value={form.notes}
                        onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
                        placeholder="Tell us about user mix, timelines, power/data constraints, or expected finishes."
                        className="configurator-form__input mt-3 min-h-28 resize-none"
                      />
                    </div>
                  ) : null}
                </div>

                <div className="configurator-review-inline">
                  <div>
                    <p className="text-sm font-semibold text-strong">
                      {CONFIGURATOR_COPY.quickEstimateReviewTitle}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {CONFIGURATOR_COPY.quickEstimateReviewDescription}
                    </p>
                  </div>
                  <div className="configurator-review-inline__facts">
                    {reviewChecklist.map((item) => (
                      <span key={item} className="configurator-review-inline__fact">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 space-y-5">
                {form.projectType === "workstations" ? (
                  <>
                    <div className="configurator-form__stage">
                      <p className="configurator-form__stage-title">{CONFIGURATOR_COPY.stageSystemLayout}</p>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <label className="configurator-form__field">
                          <span>Series</span>
                          <select
                            value={form.workstationSeries}
                            onChange={(event) =>
                              setForm((prev) => {
                                const workstationSeries = event.target.value as WorkstationSeries;
                                const nextLayoutOptions = WORKSTATION_LAYOUTS.filter((layout) =>
                                  layout.supportedSeries.includes(workstationSeries),
                                );
                                const layoutId = nextLayoutOptions.some((layout) => layout.id === prev.layoutId)
                                  ? prev.layoutId
                                  : (nextLayoutOptions[0]?.id ?? prev.layoutId);
                                return { ...prev, workstationSeries, layoutId };
                              })
                            }
                            className="configurator-form__input"
                          >
                            {WORKSTATION_SERIES.map((series) => (
                              <option key={series} value={series}>
                                {series}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="configurator-form__field">
                          <span>Layout</span>
                          <select
                            value={activeLayout?.id || form.layoutId}
                            onChange={(event) =>
                              setForm((prev) => ({ ...prev, layoutId: event.target.value as LayoutId }))
                            }
                            className="configurator-form__input"
                          >
                            {layoutOptions.map((layout) => (
                              <option key={layout.id} value={layout.id}>
                                {layout.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="configurator-form__field">
                          <span>Module count</span>
                          <input
                            type="number"
                            min={1}
                            max={80}
                            value={moduleCount}
                            onChange={(event) =>
                              setForm((prev) => ({
                                ...prev,
                                moduleCount: clampInteger(Number(event.target.value), 1, 80),
                              }))
                            }
                            className="configurator-form__input"
                          />
                        </label>
                        <label className="configurator-form__field">
                          <span>Modules per row</span>
                          <input
                            type="number"
                            min={1}
                            max={10}
                            value={modulesPerRow}
                            onChange={(event) =>
                              setForm((prev) => ({
                                ...prev,
                                modulesPerRow: clampInteger(Number(event.target.value), 1, 10),
                              }))
                            }
                            className="configurator-form__input"
                          />
                        </label>
                        <label className="configurator-form__field">
                          <span>Aisle width (mm)</span>
                          <select
                            value={form.aisleWidth}
                            onChange={(event) =>
                              setForm((prev) => ({ ...prev, aisleWidth: Number(event.target.value) }))
                            }
                            className="configurator-form__input"
                          >
                            {[900, 1050, 1200].map((value) => (
                              <option key={value} value={value}>
                                {value}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="configurator-form__field">
                          <span>Finish</span>
                          <select
                            value={form.finish}
                            onChange={(event) => setForm((prev) => ({ ...prev, finish: event.target.value }))}
                            className="configurator-form__input"
                          >
                            {FINISH_OPTIONS.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                    </div>

                    <div className="configurator-form__stage">
                      <p className="configurator-form__stage-title">Dimensions and fit</p>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <label className="configurator-form__field">
                          <span>Desk width (mm)</span>
                          <select
                            value={form.deskWidth}
                            onChange={(event) => setForm((prev) => ({ ...prev, deskWidth: Number(event.target.value) }))}
                            className="configurator-form__input"
                          >
                            {[1200, 1350, 1500].map((value) => (
                              <option key={value} value={value}>
                                {value}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="configurator-form__field">
                          <span>Desk depth (mm)</span>
                          <select
                            value={form.deskDepth}
                            onChange={(event) => setForm((prev) => ({ ...prev, deskDepth: Number(event.target.value) }))}
                            className="configurator-form__input"
                          >
                            {[600, 750].map((value) => (
                              <option key={value} value={value}>
                                {value}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="configurator-form__field">
                          <span>Room width (mm)</span>
                          <input
                            type="number"
                            min={3000}
                            max={50000}
                            value={roomWidthMm}
                            onChange={(event) =>
                              setForm((prev) => ({
                                ...prev,
                                roomWidth: clampInteger(Number(event.target.value), 3000, 50000),
                              }))
                            }
                            className="configurator-form__input"
                          />
                        </label>
                        <label className="configurator-form__field">
                          <span>Room length (mm)</span>
                          <input
                            type="number"
                            min={3000}
                            max={50000}
                            value={roomLengthMm}
                            onChange={(event) =>
                              setForm((prev) => ({
                                ...prev,
                                roomLength: clampInteger(Number(event.target.value), 3000, 50000),
                              }))
                            }
                            className="configurator-form__input"
                          />
                        </label>
                        <label className="configurator-form__field">
                          <span>Perimeter clearance (mm)</span>
                          <select
                            value={roomClearanceMm}
                            onChange={(event) => setForm((prev) => ({ ...prev, roomClearance: Number(event.target.value) }))}
                            className="configurator-form__input"
                          >
                            {[0, 300, 450, 600, 750, 900].map((value) => (
                              <option key={value} value={value}>
                                {value}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="configurator-form__field">
                          <span>Budget band</span>
                          <select
                            value={form.budgetBand}
                            onChange={(event) =>
                              setForm((prev) => ({ ...prev, budgetBand: event.target.value as BudgetBandId }))
                            }
                            className="configurator-form__input"
                          >
                            {BUDGET_BANDS.map((band) => (
                              <option key={band.id} value={band.id}>
                                {band.label}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                    </div>

                    <div className="configurator-form__stage">
                      <p className="configurator-form__stage-title">{CONFIGURATOR_COPY.stageTechnicalOptions}</p>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <label className="configurator-form__field">
                          <span>Screens</span>
                          <select
                            value={form.screen}
                            onChange={(event) => setForm((prev) => ({ ...prev, screen: event.target.value as ScreenId }))}
                            className="configurator-form__input"
                          >
                            {SCREEN_OPTIONS.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="configurator-form__field">
                          <span>Screen height (mm)</span>
                          <select
                            value={form.screenHeight}
                            onChange={(event) => setForm((prev) => ({ ...prev, screenHeight: Number(event.target.value) }))}
                            className="configurator-form__input"
                            disabled={form.screen === "none"}
                          >
                            {[300, 450, 530, 600].map((value) => (
                              <option key={value} value={value}>
                                {value}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="configurator-form__field">
                          <span>Modesty panel</span>
                          <select
                            value={form.modesty}
                            onChange={(event) => setForm((prev) => ({ ...prev, modesty: event.target.value as ModestyId }))}
                            className="configurator-form__input"
                          >
                            {MODESTY_OPTIONS.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="configurator-form__field">
                          <span>Raceway</span>
                          <select
                            value={form.raceway}
                            onChange={(event) => setForm((prev) => ({ ...prev, raceway: event.target.value as RacewayId }))}
                            className="configurator-form__input"
                          >
                            {RACEWAY_OPTIONS.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="configurator-form__field">
                          <span>Power points per seat</span>
                          <input
                            type="number"
                            min={0}
                            max={4}
                            value={form.powerPerSeat}
                            onChange={(event) =>
                              setForm((prev) => ({ ...prev, powerPerSeat: clampInteger(Number(event.target.value), 0, 4) }))
                            }
                            className="configurator-form__input"
                          />
                        </label>
                        <label className="configurator-form__field">
                          <span>Data points per seat</span>
                          <input
                            type="number"
                            min={0}
                            max={4}
                            value={form.dataPerSeat}
                            onChange={(event) =>
                              setForm((prev) => ({ ...prev, dataPerSeat: clampInteger(Number(event.target.value), 0, 4) }))
                            }
                            className="configurator-form__input"
                          />
                        </label>
                        <label className="configurator-form__field md:col-span-3">
                          <span>Storage add-on</span>
                          <select
                            value={form.storageMode}
                            onChange={(event) => setForm((prev) => ({ ...prev, storageMode: event.target.value as StorageModeId }))}
                            className="configurator-form__input"
                          >
                            {STORAGE_MODE_OPTIONS.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="configurator-form__stage">
                      <p className="configurator-form__stage-title">Storage module setup</p>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <label className="configurator-form__field">
                          <span>Layout style</span>
                          <select
                            value={form.storageLayout}
                            onChange={(event) => setForm((prev) => ({ ...prev, storageLayout: event.target.value }))}
                            className="configurator-form__input"
                          >
                            {STORAGE_LAYOUT_OPTIONS.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="configurator-form__field">
                          <span>Finish</span>
                          <select
                            value={form.finish}
                            onChange={(event) => setForm((prev) => ({ ...prev, finish: event.target.value }))}
                            className="configurator-form__input"
                          >
                            {FINISH_OPTIONS.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="configurator-form__field">
                          <span>Rows</span>
                          <input
                            type="number"
                            min={1}
                            max={12}
                            value={storageRows}
                            onChange={(event) => setForm((prev) => ({ ...prev, storageRows: clampInteger(Number(event.target.value), 1, 12) }))}
                            className="configurator-form__input"
                          />
                        </label>
                        <label className="configurator-form__field">
                          <span>Columns</span>
                          <input
                            type="number"
                            min={1}
                            max={12}
                            value={storageColumns}
                            onChange={(event) => setForm((prev) => ({ ...prev, storageColumns: clampInteger(Number(event.target.value), 1, 12) }))}
                            className="configurator-form__input"
                          />
                        </label>
                        <label className="configurator-form__field md:col-span-2">
                          <span>Units</span>
                          <input
                            type="number"
                            min={1}
                            max={storageTotalCells}
                            value={storageUnits}
                            onChange={(event) => setForm((prev) => ({ ...prev, storageUnits: clampInteger(Number(event.target.value), 1, storageTotalCells) }))}
                            className="configurator-form__input"
                          />
                        </label>
                      </div>
                    </div>
                    <div className="configurator-form__stage">
                      <p className="configurator-form__stage-title">Dimensions and fit</p>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <label className="configurator-form__field">
                          <span>Room width (mm)</span>
                          <input type="number" min={3000} max={50000} value={roomWidthMm} onChange={(event) => setForm((prev) => ({ ...prev, roomWidth: clampInteger(Number(event.target.value), 3000, 50000) }))} className="configurator-form__input" />
                        </label>
                        <label className="configurator-form__field">
                          <span>Room length (mm)</span>
                          <input type="number" min={3000} max={50000} value={roomLengthMm} onChange={(event) => setForm((prev) => ({ ...prev, roomLength: clampInteger(Number(event.target.value), 3000, 50000) }))} className="configurator-form__input" />
                        </label>
                        <label className="configurator-form__field">
                          <span>Perimeter clearance (mm)</span>
                          <select value={roomClearanceMm} onChange={(event) => setForm((prev) => ({ ...prev, roomClearance: Number(event.target.value) }))} className="configurator-form__input">
                            {[0, 300, 450, 600, 750, 900].map((value) => (
                              <option key={value} value={value}>
                                {value}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="configurator-form__field">
                          <span>Budget band</span>
                          <select value={form.budgetBand} onChange={(event) => setForm((prev) => ({ ...prev, budgetBand: event.target.value as BudgetBandId }))} className="configurator-form__input">
                            {BUDGET_BANDS.map((band) => (
                              <option key={band.id} value={band.id}>
                                {band.label}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </section>

          <section className="configurator-copilot">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="typ-label mb-2 text-body">{CONFIGURATOR_COPY.copilotKicker}</p>
                <h3 className="text-2xl font-light tracking-tight text-strong">
                  {CONFIGURATOR_COPY.copilotTitle}
                </h3>
                <p className="mt-2 max-w-2xl text-sm text-muted">
                  {CONFIGURATOR_COPY.copilotDescription}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCopilot({ loading: false, error: "", result: null })}
                className="text-sm text-muted underline"
              >
                {CONFIGURATOR_COPY.copilotReset}
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {CONFIGURATOR_COPILOT_STARTERS.map((starter) => (
                <button
                  key={starter}
                  type="button"
                  onClick={() => void submitCopilotQuery(starter)}
                  className="rounded-full border border-muted bg-panel px-3 py-1.5 text-xs text-body transition-colors hover:border-primary/50 hover:text-primary"
                >
                  {starter}
                </button>
              ))}
              <button
                type="button"
                onClick={() => void submitCopilotQuery(copilotPrompt)}
                className="inline-flex items-center gap-1.5 rounded-full border border-muted bg-panel px-3 py-1.5 text-xs text-body transition-colors hover:border-primary/50 hover:text-primary"
              >
                <Wand2 className="h-3.5 w-3.5" />
                {CONFIGURATOR_COPY.copilotPrimaryPrompt}
              </button>
            </div>

            <div className="mt-5">
              <div className="flex items-end gap-3">
                <textarea
                  rows={3}
                  value={copilotQuery}
                  onChange={(event) => setCopilotQuery(event.target.value)}
                  placeholder={CONFIGURATOR_COPY.copilotPlaceholder}
                  className="configurator-form__input min-h-24 resize-none"
                />
                <button
                  type="button"
                  onClick={() => void submitCopilotQuery(copilotQuery)}
                  disabled={!copilotQuery.trim() || copilot.loading}
                  className="typ-chip inline-flex min-h-11 items-center gap-2 rounded-xl bg-inverse px-4 text-inverse transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {copilot.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {CONFIGURATOR_COPY.copilotSubmit}
                </button>
              </div>
              {copilot.error ? <p className="mt-2 text-xs text-danger">{copilot.error}</p> : null}
            </div>

            {!copilot.result && !copilot.loading ? (
              <div className="mt-5 rounded-2xl border border-dashed border-muted bg-hover p-5">
                <p className="text-sm font-semibold text-strong">{CONFIGURATOR_COPY.copilotEmptyTitle}</p>
                <p className="mt-2 text-sm text-muted">{CONFIGURATOR_COPY.copilotEmptyDescription}</p>
              </div>
            ) : null}

            {copilot.loading ? (
              <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-soft bg-hover px-4 py-3 text-sm text-body">
                <Loader2 className="h-4 w-4 animate-spin" />
                Thinking through this planning snapshot...
              </div>
            ) : null}

            {copilot.result ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-soft bg-hover p-4">
                  <p className="text-sm font-semibold text-strong">{copilot.result.summary}</p>
                  <p className="mt-2 text-sm text-muted">
                    Indicative budget: {copilot.result.totalBudget}
                  </p>
                </div>
                {copilot.result.warnings?.length ? (
                  <div className="rounded-2xl border border-warning bg-warning-soft p-4">
                    <p className="text-sm font-semibold text-warning">
                      {CONFIGURATOR_COPY.copilotWarningsTitle}
                    </p>
                    <ul className="mt-2 space-y-2 text-sm text-warning">
                      {copilot.result.warnings.map((warning) => (
                        <li key={warning}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {copilot.result.nextActions?.length ? (
                  <div className="rounded-2xl border border-soft bg-panel p-4">
                    <p className="text-sm font-semibold text-strong">
                      {CONFIGURATOR_COPY.copilotNextActionsTitle}
                    </p>
                    <ul className="mt-2 space-y-2 text-sm text-body">
                      {copilot.result.nextActions.map((action) => (
                        <li key={action}>{action}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {copilot.result.recommendations.map((item) => (
                    <div key={`${item.productId}-${item.productName}`} className="rounded-2xl border border-soft bg-panel p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-strong">{item.productName}</p>
                          <p className="typ-chip mt-1 text-muted">
                            {item.category}
                          </p>
                        </div>
                        <Link
                          href={getCatalogProductHref(item.category, item.productUrlKey || item.productId)}
                          className="typ-chip text-primary underline"
                        >
                          View
                        </Link>
                      </div>
                      <p className="mt-3 text-sm text-body">{item.why}</p>
                      <p className="mt-3 text-sm font-medium text-strong">{item.budgetEstimate}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </section>

          <section ref={reviewRef} className="configurator-form configurator-review">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="typ-label mb-2 text-body">{CONFIGURATOR_COPY.reviewTitle}</p>
                <h3 className="text-2xl font-light tracking-tight text-strong">
                  {CONFIGURATOR_COPY.reviewDescription}
                </h3>
              </div>
              <div className="typ-chip rounded-full border border-soft bg-hover px-3 py-1 text-muted">
                {mode === "quick-estimate"
                  ? CONFIGURATOR_COPY.quickModeLabel
                  : CONFIGURATOR_COPY.technicalModeLabel}
              </div>
            </div>

            <form className="mt-6 space-y-5" onSubmit={submitEnquiry}>
              <div className="configurator-review__snapshot">
                <div className="configurator-review__summary">
                  <p className="text-sm font-semibold text-strong">Planning snapshot</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {reviewChecklist.map((item) => (
                      <span key={item} className="configurator-review-inline__fact">
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="rounded-2xl border border-soft bg-hover p-4">
                      <p className="typ-chip text-muted">
                        {CONFIGURATOR_COPY.budgetLabel}
                      </p>
                      <p className="mt-2 text-lg font-medium text-strong">{budgetRangeText}</p>
                      <p className="mt-1 text-sm text-muted">{budgetBandLabel}</p>
                    </div>
                    <div className="rounded-2xl border border-soft bg-hover p-4">
                      <p className="typ-chip text-muted">Fit and density</p>
                      <p className="mt-2 text-lg font-medium text-strong">{fitStatusText}</p>
                      <p className="mt-1 text-sm text-muted">
                        {ratingFromCoverage(planCoveragePercent)} with {areaPerSeatOrUnit.toFixed(2)} sq m /{" "}
                        {form.projectType === "workstations" ? "seat" : "unit"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="configurator-form__stage">
                <p className="configurator-form__stage-title">{CONFIGURATOR_COPY.stageProjectContext}</p>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <input type="text" placeholder="End client (optional)" value={form.clientName} onChange={(event) => setForm((prev) => ({ ...prev, clientName: event.target.value }))} className="configurator-form__input" />
                  <input type="text" placeholder="Project name (optional)" value={form.projectName} onChange={(event) => setForm((prev) => ({ ...prev, projectName: event.target.value }))} className="configurator-form__input" />
                  <input type="text" placeholder="Site location (city/state)" value={form.siteLocation} onChange={(event) => setForm((prev) => ({ ...prev, siteLocation: event.target.value }))} className="configurator-form__input" />
                  <input type="text" placeholder="Company (optional)" value={form.company} onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))} className="configurator-form__input" />
                </div>
              </div>

              <div className="configurator-form__stage">
                <p className="configurator-form__stage-title">{CONFIGURATOR_COPY.stageContactSubmission}</p>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <input type="text" placeholder="Your name" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} className="configurator-form__input" />
                  <input type="email" placeholder="Work email" value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} className="configurator-form__input" />
                  <input type="tel" placeholder="Phone (optional)" value={form.phone} onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))} className="configurator-form__input" />
                  <textarea rows={4} placeholder="Notes (optional)" value={form.notes} onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))} className="configurator-form__input min-h-28 resize-none md:col-span-2" />
                </div>
              </div>

              {submit.error ? <p className="text-sm text-danger">{submit.error}</p> : null}
              {submit.queryId ? (
                <p className="rounded-lg border border-success bg-success-soft px-3 py-2 text-sm text-success">
                  Configuration sent. Reference: <span className="font-semibold">{submit.queryId}</span>
                </p>
              ) : null}

              <div className="flex flex-wrap items-center gap-3">
                <button type="submit" disabled={submit.loading || !canSubmit} className="btn-primary disabled:cursor-not-allowed disabled:opacity-50">
                  {submit.loading ? "Sending..." : "Submit configuration"}
                  <ArrowRight className="h-4 w-4" />
                </button>
                <Link href={form.projectType === "workstations" ? "/products/workstations" : "/products/storages"} className="btn-outline">
                  {CONFIGURATOR_COPY.matchingProductsCta}
                </Link>
              </div>
            </form>
          </section>
        </div>
      </div>

      <div className="configurator-mobile-review">
        <div>
          <p className="typ-overline text-muted">{fitStatusText}</p>
          <p className="text-sm font-semibold text-strong">{budgetRangeText}</p>
        </div>
        <button
          type="button"
          onClick={jumpToReview}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-inverse px-4 text-sm text-inverse"
        >
          {CONFIGURATOR_COPY.mobileReviewBar}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

