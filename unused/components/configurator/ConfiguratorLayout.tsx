"use client";

import React from "react";
import { ConfiguratorPreview } from "./ConfiguratorPreview";
import { ConfiguratorSteps } from "./ConfiguratorSteps";
import { SummaryPanel } from "./SummaryPanel";

export function ConfiguratorLayout() {
    return (
        <div className="min-h-screen bg-white">
            <div className="grid lg:grid-cols-[1.2fr_1fr] gap-0">
                {/* Left Panel - Preview (Sticky) */}
                <div className="relative lg:sticky lg:top-24 h-screen lg:h-[calc(100vh-6rem)] bg-neutral-50 flex items-center justify-center p-8 lg:p-12">
                    <ConfiguratorPreview />
                </div>

                {/* Right Panel - Controls (Scrollable) */}
                <div className="bg-white">
                    <div className="p-6 lg:p-12 space-y-8">
                        <div className="space-y-4">
                            <p className="text-xs tracking-[0.3em] uppercase text-neutral-400">
                                Modular Furniture
                            </p>
                            <h1>
                                Configurator
                            </h1>
                            <p className="text-neutral-600">
                                Build your custom workstation with our step-by-step
                                configurator. Select from shared or non-shared seating,
                                partition options, finishes, and accessories.
                            </p>
                        </div>

                        <ConfiguratorSteps />
                    </div>

                    {/* Sticky Summary Panel */}
                    <div className="lg:sticky lg:bottom-0 bg-white border-t border-neutral-200">
                        <SummaryPanel />
                    </div>
                </div>
            </div>
        </div>
    );
}
