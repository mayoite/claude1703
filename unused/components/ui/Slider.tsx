"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
    id: string | number;
    content: React.ReactNode;
}

interface SliderProps {
    slides: Slide[];
    slidesPerView?: number | "auto";
    spaceBetween?: number;
    autoplay?: boolean;
    className?: string;
}

export function Slider({
    slides,
    slidesPerView = 1,
    spaceBetween = 30,
    autoplay = false,
    className = "",
}: SliderProps) {
    return (
        <div className={`relative group ${className}`}>
            <Swiper
                modules={[Navigation, Pagination, Autoplay, A11y]}
                spaceBetween={spaceBetween}
                slidesPerView={slidesPerView}
                navigation={{
                    nextEl: ".swiper-button-next-custom",
                    prevEl: ".swiper-button-prev-custom",
                }}
                pagination={{ clickable: true, dynamicBullets: true }}
                autoplay={autoplay ? { delay: 5000, disableOnInteraction: false } : false}
                className="w-full h-full !pb-12"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id} className="h-auto">
                        {slide.content}
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom Navigation Buttons */}
            <button className="swiper-button-prev-custom absolute top-1/2 -translate-y-1/2 left-4 z-10 w-12 h-12 bg-white/90 hover:bg-white text-neutral-800 rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0">
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button className="swiper-button-next-custom absolute top-1/2 -translate-y-1/2 right-4 z-10 w-12 h-12 bg-white/90 hover:bg-white text-neutral-800 rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0">
                <ChevronRight className="w-6 h-6" />
            </button>
        </div>
    );
}
