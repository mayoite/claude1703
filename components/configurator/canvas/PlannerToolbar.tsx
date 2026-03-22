"use client";

import { LayoutGrid } from "lucide-react";
import { PLANNER_TOOL_HINT, PLANNER_TOOL_ITEMS } from "@/components/configurator/canvas/tooling";
import type { PlannerTool } from "@/components/configurator/canvas/types";

type PlannerToolbarProps = {
  activeTool: PlannerTool;
  showGrid: boolean;
  onToolChange: (tool: PlannerTool) => void;
  onGridToggle: () => void;
};

export function PlannerToolbar({
  activeTool,
  showGrid,
  onToolChange,
  onGridToggle,
}: PlannerToolbarProps) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-2 border-b border-soft px-4 py-2">
        {PLANNER_TOOL_ITEMS.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;

          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => onToolChange(tool.id)}
              className={`inline-flex h-8 items-center gap-2 rounded-full border px-3 text-sm transition ${
                isActive
                  ? "border-primary bg-hover text-strong"
                  : "border-soft bg-panel text-muted hover:border-primary/40 hover:text-strong"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tool.label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={onGridToggle}
          className={`ml-auto inline-flex h-8 items-center gap-2 rounded-full border px-3 text-sm transition ${
            showGrid
              ? "border-primary bg-hover text-strong"
              : "border-soft bg-panel text-muted hover:border-primary/40 hover:text-strong"
          }`}
        >
          <LayoutGrid className="h-4 w-4" />
          Grid {showGrid ? "on" : "off"}
        </button>
      </div>
      <div className="border-b border-soft px-4 py-2 text-sm text-muted">
        {PLANNER_TOOL_HINT[activeTool]}
      </div>
    </>
  );
}

