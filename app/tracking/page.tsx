"use client";

import { useEffect, useRef, useState } from "react";
import { Package, Truck, CheckCircle, FileText, Home } from "lucide-react";
import { motion } from "framer-motion";
import { Hero } from "@/components/home/Hero";
import { ContactTeaser } from "@/components/shared/ContactTeaser";

export default function TrackingPage() {
    const [orderId, setOrderId] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "found" | "error">("idle");
    const trackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (trackTimeoutRef.current) clearTimeout(trackTimeoutRef.current);
        };
    }, []);

    const handleTrack = (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderId) return;

        setStatus("loading");
        if (trackTimeoutRef.current) clearTimeout(trackTimeoutRef.current);

        // Simulate API call
        trackTimeoutRef.current = setTimeout(() => {
            if (orderId.toUpperCase().startsWith("DE")) {
                setStatus("found");
            } else {
                setStatus("error");
            }
        }, 1500);
    };

    const STEPS = [
        { label: "Order Received", date: "Feb 15, 2026", completed: true, icon: FileText },
        { label: "In Production", date: "Feb 17, 2026", completed: true, icon: Package },
        { label: "Quality Check", date: "Feb 18, 2026", completed: true, icon: CheckCircle },
        { label: "Shipped", date: "Estimated Feb 20", completed: false, active: true, icon: Truck },
        { label: "Delivered", date: "-", completed: false, icon: Home },
    ];

    return (
        <section className="flex min-h-screen flex-col items-center bg-white">
            <Hero
                variant="small"
                title="Track Your Order"
                subtitle="Enter your order ID to check the status"
                showButton={false}
                backgroundImage="/hero/titan-hero.webp"
            />

            <section className="container px-6 2xl:px-0 py-20">
                <p className="text-xl font-light text-neutral-600 text-center mb-12">
                    Enter your order number (e.g., DE-2024-8892) to see current status.
                </p>

                {/* Search Form */}
                <form onSubmit={handleTrack} className="w-full flex gap-4 mb-16">
                    <input
                        type="text"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        placeholder="Order Number (Try 'DE-123')"
                        className="flex-1 p-4 bg-neutral-50 border border-neutral-200 focus:border-primary outline-none transition-colors text-lg"
                    />
                    <button
                        type="submit"
                        disabled={status === "loading"}
                        className="bg-neutral-900 text-white px-8 md:px-12 py-4 uppercase tracking-wide font-medium hover:bg-black transition-colors disabled:opacity-50"
                    >
                        {status === "loading" ? "Checking..." : "Track"}
                    </button>
                </form>

                {/* Results Area */}
                {status === "error" && (
                    <div className="p-6 bg-red-50 border border-red-100 text-red-600 text-center">
                        Order not found. Please check your number and try again.
                    </div>
                )}

                {status === "found" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full bg-neutral-50 border border-neutral-100 p-8 md:p-12"
                    >
                        <div className="flex justify-between items-end mb-12 border-b border-neutral-200 pb-6">
                            <div>
                                <h3 className="text-2xl font-light text-neutral-900">Order #{orderId.toUpperCase()}</h3>
                                <p className="text-neutral-500 font-light mt-1">WINEA PRO Desk System (Custom)</p>
                            </div>
                            <div className="text-right hidden md:block">
                                <p className="text-sm uppercase tracking-wide text-neutral-400">Estimated Delivery</p>
                                <p className="text-xl font-medium text-neutral-900">Feb 24, 2026</p>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="relative">
                            {/* Vertical Line */}
                            <div className="absolute left-6 top-4 bottom-4 w-px bg-neutral-200" />

                            <div className="space-y-12">
                                {STEPS.map((step, idx) => {
                                    const Icon = step.icon;
                                    return (
                                        <div key={idx} className="relative flex items-start gap-8 group">
                                            {/* Dot / Icon */}
                                            <div className={`relative z-10 w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors ${step.completed ? "bg-primary border-primary text-white" :
                                                step.active ? "bg-white border-primary text-primary" :
                                                    "bg-white border-neutral-200 text-neutral-300"
                                                }`}>
                                                <Icon className="w-5 h-5" />
                                            </div>

                                            {/* Text */}
                                            <div className={`${step.completed || step.active ? "opacity-100" : "opacity-40"}`}>
                                                <h4 className="text-lg font-medium text-neutral-900">{step.label}</h4>
                                                <p className="text-sm font-light text-neutral-500 mt-1">{step.date}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </section>
            <ContactTeaser />
        </section>
    );
}



