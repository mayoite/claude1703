import type { Opening } from "@/lib/planner/types";

export function getOpeningDefaultWidthMm(type: Opening["type"]) {
  if (type === "window") return 1800;
  if (type === "double-door") return 1800;
  return 1100;
}

export function getOpeningTitle(type: Opening["type"]) {
  if (type === "window") return "Window opening";
  if (type === "double-door") return "Double door";
  return "Single door";
}

export function isDoorOpening(type: Opening["type"]) {
  return type === "door" || type === "double-door";
}
