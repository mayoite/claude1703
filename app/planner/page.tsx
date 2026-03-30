import type { Metadata } from "next";

import { BlueprintPlanner } from "@/components/planner/BlueprintPlanner";
import { PlannerErrorBoundary } from "@/components/planner/PlannerErrorBoundary";

export const metadata: Metadata = {
  title: "Workspace Planner | One&Only",
  description:
    "Design your workspace with a React-based planner for room layouts, furniture placement, and 3D review.",
};

export default function PlannerPage() {
  return (
    <div className="planner-shell relative z-10 h-full isolate pointer-events-auto">
      <PlannerErrorBoundary>
        <BlueprintPlanner />
      </PlannerErrorBoundary>
    </div>
  );
}
