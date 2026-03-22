"use client";

import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export function CollapsibleSection({
  title,
  collapsed,
  onToggle,
  children,
  summary,
}: {
  title: string;
  collapsed: boolean;
  onToggle: () => void;
  children: ReactNode;
  summary?: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-soft bg-panel p-4 shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <div>
          <h3 className="text-sm font-semibold text-strong">{title}</h3>
          {summary ? <p className="mt-1 text-sm text-muted">{summary}</p> : null}
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-subtle transition-transform ${collapsed ? "" : "rotate-180"}`}
        />
      </button>
      {!collapsed ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}
