"use client";

import { Grid3X3, Sparkles } from "lucide-react";

const MM_PER_FOOT = 304.8;

type RoomState = {
  widthMm: number;
  depthMm: number;
  clearanceMm: number;
};

type RoomSetupPanelProps = {
  room: RoomState;
  seatTarget: number;
  unitSystem: "metric" | "imperial";
  onUnitSystemChange: (value: "metric" | "imperial") => void;
  onWidthChange: (value: number) => void;
  onDepthChange: (value: number) => void;
  onClearanceChange: (value: number) => void;
  onSeatTargetChange: (value: number) => void;
  onSeedLayout: () => void;
};

function toDisplayValue(valueMm: number, unitSystem: "metric" | "imperial") {
  return unitSystem === "imperial"
    ? (valueMm / MM_PER_FOOT).toFixed(1)
    : (valueMm / 1000).toFixed(1);
}

function fromDisplayValue(value: string, unitSystem: "metric" | "imperial") {
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed)) return 0;

  return unitSystem === "imperial"
    ? Math.round(parsed * MM_PER_FOOT)
    : Math.round(parsed * 1000);
}

export function RoomSetupPanel({
  room,
  seatTarget,
  unitSystem,
  onUnitSystemChange,
  onWidthChange,
  onDepthChange,
  onClearanceChange,
  onSeatTargetChange,
  onSeedLayout,
}: RoomSetupPanelProps) {
  return (
    <div className="order-1 rounded-[1rem] border border-soft bg-panel p-2.5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium text-subtle">Room setup</p>
          <h3 className="mt-0.5 text-sm font-semibold text-strong">Room and units</h3>
        </div>
        <Grid3X3 className="h-4 w-4 text-subtle" />
      </div>
      <div className="mt-2.5 inline-flex rounded-full border border-soft bg-hover p-1">
        <button
          type="button"
          onClick={() => onUnitSystemChange("metric")}
          className={`rounded-full px-3 py-1 text-xs transition ${
            unitSystem === "metric" ? "bg-panel text-strong shadow-sm" : "text-muted"
          }`}
        >
          Metres
        </button>
        <button
          type="button"
          onClick={() => onUnitSystemChange("imperial")}
          className={`rounded-full px-3 py-1 text-xs transition ${
            unitSystem === "imperial" ? "bg-panel text-strong shadow-sm" : "text-muted"
          }`}
        >
          Feet
        </button>
      </div>
      <div className="mt-2.5 grid grid-cols-2 gap-2">
        <label className="space-y-1.5 text-sm text-body">
          <span className="text-[11px] font-medium text-subtle">Width</span>
          <input
            type="text"
            inputMode="decimal"
            value={toDisplayValue(room.widthMm, unitSystem)}
            onChange={(event) =>
              onWidthChange(fromDisplayValue(event.target.value, unitSystem) || room.widthMm)
            }
            className="h-10 w-full rounded-lg border border-soft bg-hover px-3 text-sm text-strong outline-none transition focus:border-primary"
          />
        </label>
        <label className="space-y-1.5 text-sm text-body">
          <span className="text-[11px] font-medium text-subtle">Depth</span>
          <input
            type="text"
            inputMode="decimal"
            value={toDisplayValue(room.depthMm, unitSystem)}
            onChange={(event) =>
              onDepthChange(fromDisplayValue(event.target.value, unitSystem) || room.depthMm)
            }
            className="h-10 w-full rounded-lg border border-soft bg-hover px-3 text-sm text-strong outline-none transition focus:border-primary"
          />
        </label>
        <label className="space-y-1.5 text-sm text-body">
          <span className="text-[11px] font-medium text-subtle">Clearance</span>
          <input
            type="text"
            inputMode="decimal"
            value={toDisplayValue(room.clearanceMm, unitSystem)}
            onChange={(event) =>
              onClearanceChange(
                fromDisplayValue(event.target.value, unitSystem) || room.clearanceMm,
              )
            }
            className="h-10 w-full rounded-lg border border-soft bg-hover px-3 text-sm text-strong outline-none transition focus:border-primary"
          />
        </label>
        <label className="space-y-1.5 text-sm text-body">
          <span className="text-[11px] font-medium text-subtle">Seat target</span>
          <input
            type="number"
            min={4}
            max={120}
            value={seatTarget}
            onChange={(event) =>
              onSeatTargetChange(Number(event.target.value) || seatTarget)
            }
            className="h-10 w-full rounded-lg border border-soft bg-hover px-3 text-sm text-strong outline-none transition focus:border-primary"
          />
        </label>
      </div>
      <div className="mt-2.5 flex items-center justify-between gap-2">
        <p className="text-[11px] text-muted">
          {unitSystem === "imperial" ? "Values shown in feet" : "Values shown in metres"}
        </p>
        <button
          type="button"
          onClick={onSeedLayout}
          className="inline-flex h-9 items-center gap-2 rounded-full border border-soft bg-hover px-3 text-sm text-strong transition hover:border-primary/40"
        >
          <Sparkles className="h-4 w-4" />
          Reset layout
        </button>
      </div>
    </div>
  );
}
