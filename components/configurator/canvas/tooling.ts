import {
  Columns2,
  DoorOpen,
  LayoutGrid,
  MessageSquareText,
  Plus,
  Search,
  Square,
} from "lucide-react";
import type { PlannerTool } from "@/components/configurator/canvas/types";

export const PLANNER_TOOL_ITEMS: Array<{
  id: PlannerTool;
  label: string;
  icon: typeof Search;
}> = [
  { id: "select", label: "Select", icon: Search },
  { id: "product", label: "Product", icon: Plus },
  { id: "wall", label: "Wall", icon: Square },
  { id: "door", label: "Door", icon: DoorOpen },
  { id: "window", label: "Window", icon: LayoutGrid },
  { id: "column", label: "Column", icon: Columns2 },
  { id: "note", label: "Note", icon: MessageSquareText },
];

export const PLANNER_TOOL_HINT: Record<PlannerTool, string> = {
  select: "Select and move placed items, columns, and notes.",
  product: "Click inside the room to place the current product.",
  wall: "Click to start, keep clicking to extend wall points, right-click to finish.",
  door: "Click near the room edge to place a door.",
  window: "Click near the room edge to place a window.",
  column: "Click inside the room to place a column.",
  note: "Click inside the room to add a planning note.",
};
