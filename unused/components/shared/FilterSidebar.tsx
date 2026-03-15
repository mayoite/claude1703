"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterOption {
    id: string;
    label: string;
}

interface FilterGroup {
    id: string;
    title: string;
    options: FilterOption[];
}

interface FilterSidebarProps {
    filters: FilterGroup[];
    selectedFilters: Record<string, string[]>;
    onFilterChange: (groupId: string, optionId: string, isChecked: boolean) => void;
    className?: string;
}

export function FilterSidebar({ filters, selectedFilters, onFilterChange, className }: FilterSidebarProps) {
    // Keep track of which sections are open (default all open)
    const [openSections, setOpenSections] = useState<Record<string, boolean>>(
        Object.fromEntries(filters.map((f) => [f.id, true]))
    );

    const toggleSection = (id: string) => {
        setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <aside className={cn("w-full md:w-64 flex-shrink-0", className)}>
            <div className="sticky top-24 space-y-8">
                <div className="flex items-center justify-between md:hidden">
                    <span className="text-lg font-medium">Filters</span>
                    {/* Mobile filter toggle could go here */}
                </div>

                {filters.map((group) => (
                    <div key={group.id} className="border-b border-neutral-200 pb-6 last:border-0">
                        <button
                            onClick={() => toggleSection(group.id)}
                            className="flex items-center justify-between w-full text-left mb-4 group"
                        >
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 group-hover:text-primary transition-colors">
                                {group.title}
                            </h3>
                            {openSections[group.id] ? (
                                <ChevronUp className="w-4 h-4 text-neutral-400" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-neutral-400" />
                            )}
                        </button>

                        <div
                            className={cn(
                                "space-y-3 overflow-hidden transition-all duration-300 ease-in-out",
                                openSections[group.id] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                            )}
                        >
                            {group.options.map((option) => {
                                const isSelected = selectedFilters[group.id]?.includes(option.id);
                                return (
                                    <label
                                        key={option.id}
                                        className="flex items-start gap-3 cursor-pointer group/item select-none"
                                    >
                                        <div className="relative flex items-center justify-center mt-0.5">
                                            <input
                                                type="checkbox"
                                                className="peer sr-only"
                                                checked={isSelected}
                                                onChange={(e) =>
                                                    onFilterChange(group.id, option.id, e.target.checked)
                                                }
                                            />
                                            <div className="w-4 h-4 border border-neutral-300 bg-white transition-all duration-200 peer-checked:bg-primary peer-checked:border-primary peer-checked:shadow-sm rounded-[2px] group-hover/item:border-neutral-400"></div>
                                            <Check className="w-3 h-3 text-white absolute inset-0 m-auto opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none" />
                                        </div>
                                        <span
                                            className={cn(
                                                "text-sm font-light text-neutral-600 transition-colors duration-200 group-hover/item:text-neutral-900",
                                                isSelected && "text-neutral-900 font-normal"
                                            )}
                                        >
                                            {option.label}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
}
