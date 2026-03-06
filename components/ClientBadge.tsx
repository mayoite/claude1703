import clsx from "clsx";

export interface ClientBadgeData {
  name: string;
  sector: string;
  location?: string;
}

interface ClientBadgeProps extends ClientBadgeData {
  featured?: boolean;
}

const SECTOR_COLORS: Record<string, string> = {
  Government: "bg-blue-50 text-blue-700 border-blue-100",
  Finance: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Manufacturing: "bg-amber-50 text-amber-700 border-amber-100",
  Energy: "bg-orange-50 text-orange-700 border-orange-100",
  FMCG: "bg-purple-50 text-purple-700 border-purple-100",
  Automotive: "bg-sky-50 text-sky-700 border-sky-100",
  "NGO / UN": "bg-teal-50 text-teal-700 border-teal-100",
  Education: "bg-indigo-50 text-indigo-700 border-indigo-100",
  Technology: "bg-violet-50 text-violet-700 border-violet-100",
  Telecom: "bg-rose-50 text-rose-700 border-rose-100",
  Corporate: "bg-neutral-100 text-neutral-600 border-neutral-200",
};

export function ClientBadge({
  name,
  sector,
  location,
  featured = false,
}: ClientBadgeProps) {
  const sectorStyle =
    SECTOR_COLORS[sector] ?? "bg-neutral-100 text-neutral-600 border-neutral-200";

  return (
    <div
      className={clsx(
        "flex flex-col justify-between p-5 border border-neutral-200 bg-white",
        "hover:border-neutral-400 hover:shadow-sm transition-all duration-200 group",
        featured && "border-neutral-300",
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-4">
        <span
          className={clsx(
            "inline-block text-[10px] font-bold uppercase tracking-[0.15em] px-2 py-1 rounded-sm border",
            sectorStyle,
          )}
        >
          {sector}
        </span>
      </div>
      <div>
        <h3 className="text-base font-semibold text-neutral-900 group-hover:text-neutral-700 transition-colors leading-tight">
          {name}
        </h3>
        {location && (
          <p className="text-xs text-neutral-400 mt-1 font-medium">{location}</p>
        )}
      </div>
    </div>
  );
}
