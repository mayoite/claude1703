"use client";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  Copy,
  FileDown,
  Grid2X2,
  Grid3X3,
  Move,
  PanelsTopLeft,
  PenTool,
  RotateCcw,
  RotateCw,
  Save,
  Sparkles,
  SplitSquareVertical,
  StretchHorizontal,
  Trash2,
  ClipboardList,
} from "lucide-react";

interface PlannerToolbarProps {
  currentView: "2.5d" | "3d";
  activeTool: "draw" | "move";
  canUndo: boolean;
  canRedo: boolean;
  showGrid: boolean;
  selectionLabel: string;
  selectedItemPosition?: { x: number; z: number } | null;
  selectedItemRotationDeg?: number | null;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onSwitchView: () => void;
  onDrawMode: () => void;
  onMoveMode: () => void;
  onToggleGrid: () => void;
  onExportPdf: () => void;
  onPrepareWallEditing: () => void;
  onRotateSelectedItem: (deltaDeg: number) => void;
  onDuplicateSelectedItem: () => void;
  onDeleteSelectedItem: () => void;
  isInspectorOpen: boolean;
  isClientBarOpen: boolean;
  isAiPanelOpen: boolean;
  onToggleInspector: () => void;
  onToggleClientBar: () => void;
  onToggleAiPanel: () => void;
}

function Sep() {
  return <div className="mx-1.5 h-5 w-px bg-[var(--planner-toolbar-border)]" />;
}

export function PlannerToolbar({
  currentView,
  activeTool,
  canUndo,
  canRedo,
  showGrid,
  selectionLabel,
  selectedItemPosition,
  selectedItemRotationDeg,
  onUndo,
  onRedo,
  onSave,
  onSwitchView,
  onDrawMode,
  onMoveMode,
  onToggleGrid,
  onExportPdf,
  onPrepareWallEditing,
  onRotateSelectedItem,
  onDuplicateSelectedItem,
  onDeleteSelectedItem,
  isInspectorOpen,
  isClientBarOpen,
  isAiPanelOpen,
  onToggleInspector,
  onToggleClientBar,
  onToggleAiPanel,
}: PlannerToolbarProps) {
  const itemPosition = selectedItemPosition ?? null;
  const itemRotation =
    typeof selectedItemRotationDeg === "number" ? selectedItemRotationDeg : null;
  const hasSelectedItem =
    Boolean(itemPosition) &&
    itemRotation !== null &&
    selectionLabel !== "No selection";
  const roundedX = itemPosition ? Math.round(itemPosition.x) : null;
  const roundedZ = itemPosition ? Math.round(itemPosition.z) : null;

  return (
    <div className="z-20 flex w-full max-w-[768px] flex-wrap items-center gap-x-2 gap-y-2 border-b border-[var(--planner-toolbar-border)] bg-transparent px-0 py-1.5">
      <div className="flex items-center gap-1 rounded-[12px] border border-[var(--planner-toolbar-border)] bg-[var(--planner-toolbar-surface)] p-1">
        <Button
          size="sm"
          variant="ghost"
          className={cn(
            "h-8 gap-1.5 rounded-[9px] px-3 text-[11px] font-semibold tracking-[0.02em] transition-all",
            activeTool === "draw"
              ? "bg-[var(--planner-accent)] text-black hover:bg-[var(--planner-accent-hover)]"
              : "text-[var(--text-inverse-muted)] hover:bg-white/8 hover:text-white",
          )}
          onClick={onDrawMode}
          title="Draw Walls (D)"
          aria-label="Draw Mode"
        >
          <PenTool className="h-4 w-4" />
          Draw
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className={cn(
            "h-8 gap-1.5 rounded-[9px] px-3 text-[11px] font-semibold tracking-[0.02em] transition-all",
            activeTool === "move"
              ? "border border-white/14 bg-white/10 text-white hover:bg-white/12"
              : "text-[var(--text-inverse-muted)] hover:bg-white/8 hover:text-white",
          )}
          onClick={onMoveMode}
          title="Move Items (V)"
          aria-label="Move Mode"
        >
          <Move className="h-4 w-4" />
          Move
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className={cn(
            "h-8 gap-1.5 rounded-[9px] px-3 text-[11px] font-semibold tracking-[0.02em] transition-all",
            "text-[var(--text-inverse-muted)] hover:bg-white/8 hover:text-white",
          )}
          onClick={onPrepareWallEditing}
          title="Resize Room (S)"
          aria-label="Resize Room"
        >
          <StretchHorizontal className="h-4 w-4" />
          Resize
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-1 rounded-[12px] border border-[var(--planner-toolbar-border)] bg-[var(--planner-toolbar-surface)] p-1 shadow-theme-soft">
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 rounded-[9px] p-0 text-[var(--text-inverse-muted)] hover:bg-white/8 hover:text-white"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 rounded-[9px] p-0 text-[var(--text-inverse-muted)] hover:bg-white/8 hover:text-white"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo"
        >
          <RotateCw className="h-4 w-4" />
        </Button>
        <Sep />
        <Button
          size="sm"
          variant="ghost"
          className="h-8 gap-2 rounded-[9px] px-3 text-[11px] font-semibold tracking-[0.03em] text-white hover:bg-white/8"
          onClick={onSwitchView}
        >
          <SplitSquareVertical className="h-4 w-4 text-[var(--planner-accent)]" />
          {currentView === "2.5d" ? "3D" : "2D"}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className={cn(
            "h-8 w-8 rounded-[9px] p-0 transition-colors hover:bg-hover",
            showGrid ? "text-[var(--planner-accent)]" : "text-[var(--text-inverse-muted)]",
          )}
          onClick={onToggleGrid}
          title="Toggle Grid"
          aria-label="Toggle Grid"
        >
          {showGrid ? (
            <Grid3X3 className="h-5 w-5" />
          ) : (
            <Grid2X2 className="h-5 w-5" />
          )}
        </Button>
        <Sep />
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 rounded-[9px] p-0 text-[var(--text-inverse-muted)] hover:bg-white/8 hover:text-white"
          onClick={onSave}
          title="Save"
        >
          <Save className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          className="h-8 rounded-[9px] bg-[var(--planner-accent)] px-3 text-[11px] font-semibold tracking-[0.04em] text-black shadow-[var(--planner-shadow-accent)] transition-all hover:bg-[var(--planner-accent-hover)]"
          onClick={onExportPdf}
        >
          <FileDown className="mr-1.5 h-4 w-4" />
          Export
        </Button>
        <Sep />
        <Button
          size="sm"
          variant="ghost"
          className={cn(
            "h-8 w-8 rounded-[9px] p-0 hover:bg-white/8",
            isInspectorOpen ? "text-white" : "text-[var(--text-inverse-muted)]",
          )}
          onClick={onToggleInspector}
          title="Toggle inspector"
        >
          <PanelsTopLeft className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className={cn(
            "h-8 w-8 rounded-[9px] p-0 hover:bg-white/8",
            isClientBarOpen ? "text-white" : "text-[var(--text-inverse-muted)]",
          )}
          onClick={onToggleClientBar}
          title="Toggle details"
        >
          <ClipboardList className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className={cn(
            "h-8 w-8 rounded-[9px] p-0 hover:bg-white/8",
            isAiPanelOpen ? "text-white" : "text-[var(--text-inverse-muted)]",
          )}
          onClick={onToggleAiPanel}
          title="Toggle advisor"
        >
          <Sparkles className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex w-full items-center justify-between gap-2 lg:ml-auto lg:w-auto lg:justify-normal">
        <div className="flex flex-wrap items-center gap-2">
          {selectionLabel && selectionLabel !== "No selection" ? (
            <div className="flex items-center gap-2 rounded-full border border-[var(--planner-accent-soft-border)] bg-[var(--planner-accent-soft-bg)] px-3 py-1.5">
              <span className="truncate text-[10px] font-semibold tracking-[0.04em] text-white">
                {selectionLabel}
              </span>
            </div>
          ) : null}

          {hasSelectedItem ? (
            <div className="flex flex-wrap items-center gap-1 rounded-[12px] border border-[var(--planner-toolbar-border)] bg-[var(--planner-toolbar-surface)] p-1 shadow-theme-soft">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 rounded-[9px] p-0 text-white hover:bg-white/8"
                onClick={() => onRotateSelectedItem(-15)}
                title="Rotate counter-clockwise"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 rounded-[9px] p-0 text-white hover:bg-white/8"
                onClick={() => onRotateSelectedItem(15)}
                title="Rotate clockwise"
              >
                <RotateCw className="h-4 w-4" />
              </Button>
              <Sep />
              <Button
                size="sm"
                variant="ghost"
                className="h-8 gap-1.5 rounded-[9px] px-3 text-[10px] font-semibold tracking-[0.03em] text-white hover:bg-white/8"
                onClick={onDuplicateSelectedItem}
              >
                <Copy className="h-4 w-4" />
                Copy
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 gap-1.5 rounded-[9px] border border-rose-500/20 bg-rose-500/10 px-3 text-[10px] font-semibold tracking-[0.03em] text-rose-400 hover:bg-rose-500/20"
                onClick={onDeleteSelectedItem}
              >
                <Trash2 className="h-4 w-4" />
                Del
              </Button>
              <Sep />
              <div className="px-2 py-0.5 text-right">
                <div className="text-[10px] font-semibold text-[var(--text-inverse-muted)]">
                  {itemPosition ? `${roundedX} x ${roundedZ}` : "-"}
                </div>
                <div className="text-[10px] font-semibold text-[var(--planner-selection)]">
                  {itemRotation ?? 0} deg
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
