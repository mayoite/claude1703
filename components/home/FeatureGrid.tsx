"use client";

import { motion } from "framer-motion";
import {
    Zap,
    ShieldCheck,
    Leaf,
    Users,
    Clock,
    Settings,
    Layout,
    Gem
} from "lucide-react";

const FEATURES = [
    {
        icon: Layout,
        title: "Modular Systems",
        description: "Flexible furniture that grows and adapts to your changing office requirements."
    },
    {
        icon: ShieldCheck,
        title: "Proven Quality",
        description: "Certificates and awards guarantee the highest standards in manufacturing."
    },
    {
        icon: Leaf,
        title: "Sustainability",
        description: "Resource-saving production and durable products for a better future."
    },
    {
        icon: Users,
        title: "Consulting",
        description: "Holistic planning from day one with our experienced office experts."
    },
    {
        icon: Zap,
        title: "Fast Delivery",
        description: "Reliable logistics and quick response times for your project success."
    },
    {
        icon: Settings,
        title: "Custom Solutions",
        description: "Bespoke modifications and custom-made items for your unique brand identity."
    },
    {
        icon: Clock,
        title: "Longevity",
        description: "High-quality materials and timeless design ensure use for many years."
    },
    {
        icon: Gem,
        title: "Aesthetics",
        description: "Clear forms and sophisticated colors that inspire and motivate every day."
    }
];

export function FeatureGrid() {
    return (
        <section className="w-full py-24 bg-white">
            <div className="container px-6 2xl:px-0">
                <div className="mb-20 space-y-4">
                    <h2 className="text-3xl md:text-4xl text-neutral-900 tracking-tight">
                        Our Competence. <br />
                        <span className="text-primary">Your Advantage.</span>
                    </h2>
                    <div className="h-1 w-20 bg-primary" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16">
                    {FEATURES.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05, duration: 0.5 }}
                            className="group space-y-6"
                        >
                            <div className="w-14 h-14 bg-neutral-50 rounded-2xl flex items-center justify-center text-neutral-400 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                                <feature.icon className="w-7 h-7" />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-xl font-medium text-neutral-900 group-hover:text-primary transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-neutral-500 font-light leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
