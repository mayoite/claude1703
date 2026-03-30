export type PlannerExportType = "pdf" | "json";

type PlannerPayload = Record<
  string,
  string | number | boolean | null | undefined
>;

function emitEvent(eventName: string, payload: PlannerPayload) {
  if (typeof window === "undefined") return;
  const track = window.va?.track;
  if (typeof track !== "function") return;
  track(eventName, payload);
}

export function trackPlannerSessionStarted(params: {
  entry: "planner";
  viewportWidth: number;
  viewportHeight: number;
}) {
  emitEvent("planner_session_started", params);
}

export function trackPlannerCatalogLoaded(params: {
  itemCount: number;
  phaseOneItemCount: number;
}) {
  emitEvent("planner_catalog_loaded", params);
}

export function trackPlannerCatalogFailed(params: { message: string }) {
  emitEvent("planner_catalog_failed", params);
}

export function trackPlannerItemAdded(params: {
  catalogId: string;
  category: string;
  method: "button";
}) {
  emitEvent("planner_item_added", params);
}

export function trackPlannerViewSwitched(params: { to: "2d" | "3d" }) {
  emitEvent("planner_view_switched", params);
}

export function trackPlannerExportStarted(params: { type: PlannerExportType }) {
  emitEvent("planner_export_started", params);
}

export function trackPlannerExportSucceeded(params: {
  type: PlannerExportType;
}) {
  emitEvent("planner_export_succeeded", params);
}

export function trackPlannerExportFailed(params: {
  type: PlannerExportType;
  message: string;
}) {
  emitEvent("planner_export_failed", params);
}

export function trackPlannerImportFailed(params: { message: string }) {
  emitEvent("planner_import_failed", params);
}
