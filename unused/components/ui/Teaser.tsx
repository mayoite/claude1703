"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface TeaserProps {
    imageSrc: string;
    title: string;
    description: string;
    href: string;
    badge?: string;
}

export function Teaser({ imageSrc, title, description, href, badge }: TeaserProps) {
    return (
        <Link href={href} className="group block h-full">
            <div className="relative overflow-hidden w-full aspect-[4/3] mb-6">
                <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {badge && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold uppercase tracking-wider text-neutral-900">
                        {badge}
                    </div>
                )}
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
            </div>

            <div className="space-y-3">
                <h3 className="text-2xl font-light text-neutral-900 group-hover:text-primary transition-colors">
                    {title}
                </h3>
                <p className="text-neutral-500 font-light leading-relaxed line-clamp-3">
                    {description}
                </p>
                <div className="flex items-center gap-2 text-primary font-medium text-sm uppercase tracking-wide opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    Read more <ArrowRight className="w-4 h-4" />
                </div>
            </div>
        </Link>
    );
}
