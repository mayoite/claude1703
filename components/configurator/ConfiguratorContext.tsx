"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type FurnitureType = "desking" | "cabin" | "meeting";
export type SeatingType = "shared" | "non-shared";
export type LayoutType =
    | "linear"
    | "cluster-4"
    | "cluster-6"
    | "l-shape"
    | "u-shape"
    | "private-cabins"
    | "hybrid-mix";

export interface ConfigState {
    furnitureType: FurnitureType;
    seatingType: SeatingType;
    seatingCount: number;
    hasReturnPartition: boolean;
    layout: LayoutType | "";
    partitionHeight: string;
    topFinish: string;
    edgeFinish: string;
    legType: string;
    powerModules: string;
    dataPorts: string;
    cableManagement: string;
    storage: string;
    accessories: string[];
    acoustic: string;
    area: string;
    timeline: string;
    city: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    notes: string;
    fileFolder: string;
}

interface ConfigContextType {
    config: ConfigState;
    updateConfig: (updates: Partial<ConfigState>) => void;
    currentStep: number;
    setCurrentStep: (step: number) => void;
    getSummary: () => string;
}

const ConfiguratorContext = createContext<ConfigContextType | undefined>(
    undefined
);

const initialState: ConfigState = {
    furnitureType: "desking",
    seatingType: "shared",
    seatingCount: 4,
    hasReturnPartition: false,
    layout: "",
    partitionHeight: "",
    topFinish: "",
    edgeFinish: "",
    legType: "",
    powerModules: "",
    dataPorts: "",
    cableManagement: "",
    storage: "",
    accessories: [],
    acoustic: "",
    area: "",
    timeline: "",
    city: "",
    name: "",
    email: "",
    phone: "",
    company: "",
    notes: "",
    fileFolder: "",
};

export function ConfiguratorProvider({ children }: { children: ReactNode }) {
    const [config, setConfig] = useState<ConfigState>(initialState);
    const [currentStep, setCurrentStep] = useState(0);

    const updateConfig = (updates: Partial<ConfigState>) => {
        setConfig((prev) => ({ ...prev, ...updates }));
    };

    const getSummary = () => {
        const lines = [
            `Furniture Type: ${config.furnitureType}`,
            `Seating Configuration: ${config.seatingType} ${config.seatingCount}-seater`,
            `Return Partition: ${config.hasReturnPartition ? "Yes" : "No"}`,
            `Layout: ${config.layout || "Not selected"}`,
            `Partition Height: ${config.partitionHeight || "Not selected"}`,
            `Top Finish: ${config.topFinish || "Not selected"}`,
            `Edge Finish: ${config.edgeFinish || "Not selected"}`,
            `Leg Type: ${config.legType || "Not selected"}`,
            `Power Modules: ${config.powerModules || "Not selected"}`,
            `Data Ports: ${config.dataPorts || "Not selected"}`,
            `Cable Management: ${config.cableManagement || "Not selected"}`,
            `Storage: ${config.storage || "Not selected"}`,
            `Accessories: ${config.accessories.length > 0 ? config.accessories.join(", ") : "None"}`,
            `Acoustic: ${config.acoustic || "Not selected"}`,
            `Area: ${config.area || "Not provided"}`,
            `Timeline: ${config.timeline || "Not provided"}`,
            `City: ${config.city || "Not provided"}`,
            `Contact: ${[config.name, config.company, config.email, config.phone].filter(Boolean).join(" | ") || "Not provided"}`,
            `Notes: ${config.notes || "None"}`,
            `File Folder: ${config.fileFolder || "Not provided"}`,
        ];
        return lines.join("\n");
    };

    return (
        <ConfiguratorContext.Provider
            value={{
                config,
                updateConfig,
                currentStep,
                setCurrentStep,
                getSummary,
            }}
        >
            {children}
        </ConfiguratorContext.Provider>
    );
}

export function useConfigurator() {
    const context = useContext(ConfiguratorContext);
    if (!context) {
        throw new Error(
            "useConfigurator must be used within ConfiguratorProvider"
        );
    }
    return context;
}
