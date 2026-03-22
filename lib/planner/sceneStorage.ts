import type { InteriorWall, PlannerColumn, PlannerNote } from "@/components/configurator/canvas/domain";
import type { Opening, PlannerItem, RoomState } from "@/lib/planner/types";

export const SCENE_STORAGE_KEY = "planner-scene-v1";

export type StoredPlannerScene = {
  room?: RoomState;
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

export function readStoredScene(): StoredPlannerScene | null {
  if (typeof window === "undefined") return null;
  try {
    const rawScene = window.localStorage.getItem(SCENE_STORAGE_KEY);
    if (!rawScene) return null;
    return JSON.parse(rawScene) as StoredPlannerScene;
  } catch {
    return null;
  }
}

export function writeStoredScene(snapshot: StoredPlannerScene & { savedAt?: number }) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SCENE_STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // Ignore storage failures in private browsing / strict policies.
  }
}

export function clearStoredScene() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(SCENE_STORAGE_KEY);
  } catch {
    // Ignore storage policy failures.
  }
}
