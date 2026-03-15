"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ContentBlockProps {
    title: string;
    subtitle?: string;
    description: string;
    imageSrc: string;
    imageAlt?: string;
    align?: "left" | "right";
    linkText?: string;
    linkHref?: string;
}

export function ContentBlock({
    title,
    subtitle,
    description,
    imageSrc,
    imageAlt = "OandO Office Solution",
    align = "left",
    linkText,
    linkHref
}: ContentBlockProps) {
    const isRight = align === "right";

    return (
        <section className="w-full py-24 md:py-32 bg-white overflow-hidden">
            <div className="container px-6 2xl:px-0">
                <div className={`flex flex-col md:flex-row items-center gap-12 md:gap-24 ${isRight ? "md:flex-row-reverse" : ""}`}>

                    {/* Image Side */}
                    <motion.div
                        initial={{ opacity: 0, x: isRight ? 50 : -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="w-full md:w-1/2"
                    >
                        <div className="relative aspect-[4/3] overflow-hidden group">
                            <div className="absolute inset-0 bg-neutral-900/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                            <Image
                                src={imageSrc}
                                alt={imageAlt}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                        </div>
                    </motion.div>

                    {/* Text Side */}
                    <div className="w-full md:w-1/2 space-y-6 md:space-y-8">
                        {subtitle && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="inline-block px-3 py-1 border border-neutral-200 text-xs font-bold uppercase tracking-widest text-neutral-500"
                            >
                                {subtitle}
                            </motion.div>
                        )}

                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-slogan leading-[0.95] tracking-tight text-neutral-900"
                        >
                            {title.split(" ").map((word, i) => (
                                <span key={i} className={i % 2 !== 0 ? "text-primary italic" : ""}>{word} </span>
                            ))}
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-lg md:text-xl text-neutral-500 font-light leading-relaxed max-w-xl"
                        >
                            {description}
                        </motion.p>

                        {linkText && linkHref && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <Link href={linkHref} className="inline-flex items-center gap-2 text-neutral-900 border-b border-neutral-900 pb-1 hover:text-primary hover:border-primary transition-colors text-lg uppercase tracking-widest mt-4 group">
                                    {linkText} <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
