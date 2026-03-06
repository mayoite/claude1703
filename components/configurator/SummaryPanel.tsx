"use client";

import React, { useEffect, useRef, useState } from "react";
import { useConfigurator } from "./ConfiguratorContext";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function SummaryPanel() {
    const { getSummary } = useConfigurator();
    const [copied, setCopied] = useState(false);
    const copiedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const summary = getSummary();

    const whatsappUrl = `https://wa.me/919031022875?text=${encodeURIComponent(
        `Modular Furniture Configurator Request\n\n${summary}`
    )}`;

    const mailtoUrl = `mailto:sales@oando.co.in?subject=${encodeURIComponent(
        "Modular Furniture Configurator Request"
    )}&body=${encodeURIComponent(summary)}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(summary);
            setCopied(true);
            if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current);
            copiedTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false);
        }
    };

    useEffect(() => {
        return () => {
            if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current);
        };
    }, []);

    return (
        <div className="p-6 lg:p-8 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Summary</h3>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900"
                >
                    {copied ? (
                        <>
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span>Copied!</span>
                        </>
                    ) : (
                        <span>Copy Summary</span>
                    )}
                </button>
            </div>

            <div className="flex flex-wrap gap-4">
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 text-sm font-medium hover:bg-[#20bd5a] transition-colors"
                >
                    Send via WhatsApp
                    <ArrowRight className="w-4 h-4" />
                </a>
                <a
                    href={mailtoUrl}
                    className="flex items-center gap-2 border border-neutral-900 text-neutral-900 px-6 py-3 text-sm font-medium hover:bg-neutral-900 hover:text-white transition-colors"
                >
                    Send via Email
                    <ArrowRight className="w-4 h-4" />
                </a>
            </div>
        </div>
    );
}
