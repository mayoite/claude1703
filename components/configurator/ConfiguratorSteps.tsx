"use client";

import React from "react";
import { useConfigurator, LayoutType } from "./ConfiguratorContext";
import { cn } from "@/lib/utils";

const layoutOptions: { value: LayoutType; label: string; description: string }[] = [
    { value: "linear", label: "Linear Bench", description: "Straight desk arrangement" },
    { value: "cluster-4", label: "Cluster of 4", description: "4-person workstation cluster" },
    { value: "cluster-6", label: "Cluster of 6", description: "6-person workspace" },
    { value: "l-shape", label: "L-Shape", description: "L-shaped desk configuration" },
    { value: "u-shape", label: "U-Shape", description: "U-shaped workspace" },
    { value: "private-cabins", label: "Private Cabins", description: "Enclosed workspaces" },
    { value: "hybrid-mix", label: "Hybrid Mix", description: "Combined open and enclosed" },
];

const finishOptions = [
    "Warm Oak",
    "Walnut",
    "Light Maple",
    "Concrete Grey",
    "Matte Black",
    "Custom Laminate",
];

const accessoryOptions = [
    "Monitor Arms",
    "Desk Dividers",
    "Cable Trays",
    "CPU Holders",
    "Bag Hooks",
    "Task Lighting",
];

export function ConfiguratorSteps() {
    const { config, updateConfig, currentStep, setCurrentStep } = useConfigurator();

    const steps = [
        { id: 0, title: "Furniture Type", complete: !!config.furnitureType },
        { id: 1, title: "Seating", complete: config.seatingCount > 0 },
        { id: 2, title: "Layout", complete: !!config.layout },
        { id: 3, title: "Partitions", complete: config.partitionHeight !== "" },
        { id: 4, title: "Finishes", complete: !!config.topFinish },
        { id: 5, title: "Accessories", complete: config.accessories.length > 0 },
    ];

    return (
        <div className="space-y-8">
            {/* Step Indicator */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {steps.map((step, index) => (
                    <button
                        key={step.id}
                        onClick={() => setCurrentStep(step.id)}
                        className={cn(
                            "flex-shrink-0 px-4 py-2 text-sm font-medium transition-colors border",
                            currentStep === step.id
                                ? "bg-primary text-white border-primary"
                                : step.complete
                                    ? "bg-neutral-100 text-neutral-900 border-neutral-200"
                                    : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
                        )}
                    >
                        {index + 1}. {step.title}
                    </button>
                ))}
            </div>

            {/* Step Content */}
            <div className="border border-neutral-200 p-6 lg:p-8 min-h-[400px]">
                {currentStep === 0 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-light">Select Furniture Type</h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            {(["desking", "cabin", "meeting"] as const).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => {
                                        updateConfig({ furnitureType: type });
                                        setCurrentStep(1);
                                    }}
                                    className={cn(
                                        "p-6 border-2 text-left transition-all hover:shadow-md",
                                        config.furnitureType === type
                                            ? "border-primary bg-primary/5"
                                            : "border-neutral-200 hover:border-neutral-300"
                                    )}
                                >
                                    <h3 className="text-lg font-medium capitalize">{type} Workstation</h3>
                                    <p className="text-sm text-neutral-600 mt-2">
                                        {type === "desking"
                                            ? "Shared and non-shared workstations"
                                            : type === "cabin"
                                                ? "Executive cabin tables"
                                                : "Conference and meeting tables"}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {currentStep === 1 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-light">Seating Configuration</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-3">Type</label>
                                <div className="space-y-2">
                                    {(["shared", "non-shared"] as const).map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => updateConfig({ seatingType: type })}
                                            className={cn(
                                                "w-full p-4 border-2 text-left",
                                                config.seatingType === type
                                                    ? "border-primary bg-primary/5"
                                                    : "border-neutral-200"
                                            )}
                                        >
                                            <span className="capitalize">{type.replace("-", " ")}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-3">Number of Seats</label>
                                <select
                                    value={config.seatingCount}
                                    onChange={(e) => updateConfig({ seatingCount: parseInt(e.target.value) })}
                                    className="w-full px-4 py-3 border border-neutral-200 bg-white focus:outline-none focus:border-primary"
                                >
                                    {[1, 2, 3, 4, 6, 8, 12].map((num) => (
                                        <option key={num} value={num}>
                                            {num} Seater
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={config.hasReturnPartition}
                                        onChange={(e) => updateConfig({ hasReturnPartition: e.target.checked })}
                                        className="w-5 h-5 border-neutral-300"
                                    />
                                    <span className="text-sm">Include Return Partition</span>
                                </label>
                            </div>
                        </div>
                        <button
                            onClick={() => setCurrentStep(2)}
                            className="bg-primary text-white px-6 py-3 hover:bg-primary/90 transition-colors"
                        >
                            Next Step
                        </button>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-light">Choose Layout</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {layoutOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        updateConfig({ layout: option.value });
                                        setCurrentStep(3);
                                    }}
                                    className={cn(
                                        "p-6 border-2 text-left transition-all hover:shadow-md",
                                        config.layout === option.value
                                            ? "border-primary bg-primary/5"
                                            : "border-neutral-200"
                                    )}
                                >
                                    <h3 className="text-lg font-medium">{option.label}</h3>
                                    <p className="text-sm text-neutral-600 mt-1">{option.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-light">Partition Options</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-3">Partition Height</label>
                                <select
                                    value={config.partitionHeight}
                                    onChange={(e) => updateConfig({ partitionHeight: e.target.value })}
                                    className="w-full px-4 py-3 border border-neutral-200 bg-white focus:outline-none focus:border-primary"
                                >
                                    <option value="">Select height</option>
                                    <option value="1000 mm">1000 mm</option>
                                    <option value="1200 mm">1200 mm</option>
                                    <option value="1500 mm">1500 mm</option>
                                    <option value="1800 mm">1800 mm</option>
                                    <option value="Glass top mixed">Glass top mixed</option>
                                </select>
                            </div>
                        </div>
                        <button
                            onClick={() => setCurrentStep(4)}
                            className="bg-primary text-white px-6 py-3 hover:bg-primary/90 transition-colors"
                        >
                            Next Step
                        </button>
                    </div>
                )}

                {currentStep === 4 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-light">Select Finishes</h2>
                        <div>
                            <label className="block text-sm font-medium mb-3">Top Finish</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {finishOptions.map((finish) => (
                                    <button
                                        key={finish}
                                        onClick={() => updateConfig({ topFinish: finish })}
                                        className={cn(
                                            "p-4 border-2 text-sm",
                                            config.topFinish === finish
                                                ? "border-primary bg-primary/5"
                                                : "border-neutral-200"
                                        )}
                                    >
                                        {finish}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-3">Leg Type</label>
                                <select
                                    value={config.legType}
                                    onChange={(e) => updateConfig({ legType: e.target.value })}
                                    className="w-full px-4 py-3 border border-neutral-200 bg-white focus:outline-none focus:border-primary"
                                >
                                    <option value="">Select leg type</option>
                                    <option value="Powder coated steel">Powder coated steel</option>
                                    <option value="Loop legs">Loop legs</option>
                                    <option value="Panel legs">Panel legs</option>
                                    <option value="Height adjustable">Height adjustable</option>
                                </select>
                            </div>
                        </div>
                        <button
                            onClick={() => setCurrentStep(5)}
                            className="bg-primary text-white px-6 py-3 hover:bg-primary/90 transition-colors"
                        >
                            Next Step
                        </button>
                    </div>
                )}

                {currentStep === 5 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-light">Accessories & Add-ons</h2>
                        <div>
                            <label className="block text-sm font-medium mb-3">Select Accessories</label>
                            <div className="grid md:grid-cols-2 gap-3">
                                {accessoryOptions.map((accessory) => (
                                    <label key={accessory} className="flex items-center gap-3 p-4 border border-neutral-200 cursor-pointer hover:bg-neutral-50">
                                        <input
                                            type="checkbox"
                                            checked={config.accessories.includes(accessory)}
                                            onChange={(e) => {
                                                const newAccessories = e.target.checked
                                                    ? [...config.accessories, accessory]
                                                    : config.accessories.filter((a) => a !== accessory);
                                                updateConfig({ accessories: newAccessories });
                                            }}
                                            className="w-5 h-5"
                                        />
                                        <span className="text-sm">{accessory}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-3">Cable Management</label>
                            <select
                                value={config.cableManagement}
                                onChange={(e) => updateConfig({ cableManagement: e.target.value })}
                                className="w-full px-4 py-3 border border-neutral-200 bg-white focus:outline-none focus:border-primary"
                            >
                                <option value="">Select option</option>
                                <option value="Tray only">Tray only</option>
                                <option value="Tray + grommet">Tray + grommet</option>
                                <option value="Spine raceway">Spine raceway</option>
                                <option value="Full under desk trunking">Full under desk trunking</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
                <button
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                    className="px-6 py-3 border border-neutral-300 text-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50"
                >
                    Previous
                </button>
                {currentStep < 5 && (
                    <button
                        onClick={() => setCurrentStep(currentStep + 1)}
                        className="px-6 py-3 bg-neutral-900 text-white hover:bg-neutral-800"
                    >
                        Skip to Next
                    </button>
                )}
            </div>
        </div>
    );
}
