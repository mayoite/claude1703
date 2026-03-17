"use client";

import { useState, useRef, useEffect } from "react";
import { Check, RotateCcw } from "lucide-react";
import { motion, useSpring } from "framer-motion";

type DecorColor = {
  id: string;
  name: string;
  hex: string;
  texture?: string; // Optional texture URL
  priceMod: number;
};

type SizeOption = {
  id: string;
  label: string;
  widthCm: number;
  depthCm: number;
  priceMod: number;
};

const DECORS: DecorColor[] = [
  { id: "white", name: "Crystal White", hex: "#f5f5f5", priceMod: 0 },
  { id: "oak", name: "Light Oak", hex: "#e6d0b3", priceMod: 50 },
  { id: "walnut", name: "Walnut", hex: "#5d4037", priceMod: 80 },
  { id: "black", name: "Graphite Black", hex: "#262626", priceMod: 20 },
];

const FRAMES: DecorColor[] = [
  { id: "silver", name: "Silver", hex: "#e5e7eb", priceMod: 0 },
  { id: "white", name: "White", hex: "#ffffff", priceMod: 0 },
  { id: "black", name: "Black", hex: "#171717", priceMod: 0 },
  { id: "chrome", name: "Chrome", hex: "#a3a3a3", priceMod: 100 },
];

const SIZES: SizeOption[] = [
  { id: "s", label: "120 x 80 cm", widthCm: 120, depthCm: 80, priceMod: 0 },
  { id: "m", label: "160 x 80 cm", widthCm: 160, depthCm: 80, priceMod: 150 },
  { id: "l", label: "180 x 80 cm", widthCm: 180, depthCm: 80, priceMod: 200 },
  {
    id: "xl",
    label: "200 x 100 cm",
    widthCm: 200,
    depthCm: 100,
    priceMod: 350,
  },
];

const BASE_PRICE = 499;

export function Configurator() {
  const [decor, setDecor] = useState<DecorColor>(DECORS[0]);
  const [frame, setFrame] = useState<DecorColor>(FRAMES[0]);
  const [size, setSize] = useState<SizeOption>(SIZES[1]);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Rotation State
  const rotateX = useSpring(20, { stiffness: 150, damping: 20 });
  const rotateY = useSpring(-30, { stiffness: 150, damping: 20 });

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const { movementX, movementY } = e;
      const currentX = rotateY.get();
      const currentY = rotateX.get();

      rotateY.set(currentX + movementX * 0.5);
      rotateX.set(Math.min(45, Math.max(5, currentY - movementY * 0.5))); // Clamp pitch
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, rotateX, rotateY]);

  const totalPrice =
    BASE_PRICE + decor.priceMod + frame.priceMod + size.priceMod;
  const widthScale = size.widthCm / 160; // Normalize around 160cm
  const depthScale = size.depthCm / 80;

  return (
    <div className="w-full flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
      {/* LEFT: 3D Scene */}
      <div
        ref={containerRef}
        className={`w-full lg:w-2/3 bg-neutral-100 h-[500px] md:h-[600px] flex items-center justify-center relative overflow-hidden cursor-move ${isDragging ? "cursor-grabbing" : ""}`}
        onMouseDown={handleMouseDown}
      >
        {/* Background Grid */}
        <div className="absolute inset-0 bg-neutral-100/50 bg-size-[40px_40px] bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] transform-3d perspective-[1000px] flex items-center justify-center pointer-events-none"></div>

        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 text-neutral-400 text-sm">
          <RotateCcw className="w-4 h-4" /> Drag to rotate
        </div>

        {/* THE 3D DESK */}
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
            perspective: 1200,
            willChange: "transform",
          }}
          className="relative w-[300px] h-[200px] motion-gpu"
        >
          {/* TABLETOP GROUP */}
          <motion.div
            className="absolute inset-0"
            style={{
              transformStyle: "preserve-3d",
              transform: "translateZ(30px)", // Lift tabletop
            }}
          >
            {/* Top Surface */}
            <div
              className="absolute inset-0 shadow-xl transition-all duration-300"
              style={{
                backgroundColor: decor.hex,
                width: `${300 * widthScale}px`,
                height: `${150 * depthScale}px`,
                transform: `translate(-${(300 * widthScale - 300) / 2}px, -${(150 * depthScale - 150) / 2}px)`,
                borderRadius: "4px",
              }}
            >
              <div className="absolute inset-0 bg-linear-to-tr from-neutral-200 to-transparent opacity-50 pointer-events-none mix-blend-overlay"></div>
            </div>

            {/* Thickness (Sides) - Simplified for performance */}
            <div
              className="absolute top-full left-0 w-full h-4 transition-colors duration-300 origin-top brightness-75"
              style={{
                backgroundColor: decor.hex,
                width: `${300 * widthScale}px`,
                transform: `translate(-${(300 * widthScale - 300) / 2}px, -${(150 * depthScale - 150) / 2}px) rotateX(-90deg)`,
              }}
            />
            <div
              className="absolute top-0 right-0 h-full w-4 transition-colors duration-300 origin-right brightness-90"
              style={{
                backgroundColor: decor.hex,
                height: `${150 * depthScale}px`,
                transform: `translate(-${(300 * widthScale - 300) / 2}px, -${(150 * depthScale - 150) / 2}px) rotateY(-90deg)`,
              }}
            />
          </motion.div>

          {/* FRAME GROUP */}
          <motion.div
            className="absolute inset-0"
            style={{
              transformStyle: "preserve-3d",
              transform: "translateZ(0px)",
            }}
          >
            {/* Left Leg */}
            <div
              className="absolute top-0 left-4 w-4 h-full shadow-sm transition-colors duration-300"
              style={{
                backgroundColor: frame.hex,
                transform: `translateX(-${(300 * widthScale - 300) / 2}px) rotateX(90deg) translateZ(-80px)`,
                height: "160px",
                width: "15px",
              }}
            />
            {/* Right Leg */}
            <div
              className="absolute top-0 right-4 w-4 h-full shadow-sm transition-colors duration-300"
              style={{
                backgroundColor: frame.hex,
                transform: `translateX(${(300 * widthScale - 300) / 2}px) rotateX(90deg) translateZ(-80px)`,
                height: "160px",
                width: "15px",
              }}
            />

            {/* Crossbar */}
            <div
              className="absolute top-1/2 left-0 w-full h-2 transition-colors duration-300"
              style={{
                backgroundColor: frame.hex,
                width: `${300 * widthScale - 40}px`,
                transform: `translate(-${(300 * widthScale - 300) / 2 - 20}px) translateZ(-80px) translateY(80px)`,
              }}
            />

            {/* Feet */}
            <div
              className="absolute bottom-0 left-0 w-16 h-2 transition-colors duration-300"
              style={{
                backgroundColor: frame.hex,
                transform: `translateX(-${(300 * widthScale - 300) / 2}px) translateZ(-160px) translateX(0px)`,
              }}
            />
            <div
              className="absolute bottom-0 right-0 w-16 h-2 transition-colors duration-300"
              style={{
                backgroundColor: frame.hex,
                transform: `translateX(${(300 * widthScale - 300) / 2}px) translateZ(-160px) translateX(-0px)`,
              }}
            />
          </motion.div>
        </motion.div>

        {/* Dimensions Label Overlay */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-neutral-500 text-xs tracking-widest bg-white/90 px-4 py-2 backdrop-blur-sm border border-neutral-200">
          W: {size.widthCm} | D: {size.depthCm}
        </div>
      </div>

      {/* RIGHT: Controls */}
      <div className="w-full lg:w-1/3 space-y-10">
        <div>
          <h2 className="text-4xl font-light mb-2">WINEA PRO</h2>
          <p className="text-neutral-500 font-light">
            Ergonomic individual desk system
          </p>
          <div className="mt-6 text-5xl font-light text-primary">
            €{totalPrice}
          </div>
        </div>

        {/* Controls Section */}
        <div className="space-y-8">
          {/* Size Selector */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">
              Dimensions
            </label>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSize(opt)}
                  className={`px-4 py-3 border text-sm transition-all duration-300 ${
                    size.id === opt.id
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 hover:border-neutral-900 text-neutral-700 bg-white"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Decor Selector */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">
              Tabletop Decor
            </label>
            <div className="flex flex-wrap gap-3">
              {DECORS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setDecor(opt)}
                  className={`w-14 h-14 relative border transition-all duration-300 ${
                    decor.id === opt.id
                      ? "border-neutral-900 scale-110 shadow-lg"
                      : "border-neutral-200 hover:border-neutral-400"
                  }`}
                  style={{ backgroundColor: opt.hex }}
                  title={opt.name}
                >
                  {decor.id === opt.id && (
                    <span className="absolute inset-0 flex items-center justify-center text-white/50 mix-blend-difference">
                      <Check className="w-6 h-6 stroke-2" />
                    </span>
                  )}
                </button>
              ))}
            </div>
            <p className="text-sm text-neutral-600 italic">{decor.name}</p>
          </div>

          {/* Frame Selector */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">
              Frame Color
            </label>
            <div className="flex flex-wrap gap-3">
              {FRAMES.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setFrame(opt)}
                  className={`w-14 h-14 relative border transition-all duration-300 ${
                    frame.id === opt.id
                      ? "border-neutral-900 scale-110 shadow-lg"
                      : "border-neutral-200 hover:border-neutral-400"
                  }`}
                  style={{ backgroundColor: opt.hex }}
                  title={opt.name}
                >
                  {frame.id === opt.id && (
                    <span className="absolute inset-0 flex items-center justify-center text-white/50 mix-blend-difference">
                      <Check className="w-6 h-6 stroke-2" />
                    </span>
                  )}
                </button>
              ))}
            </div>
            <p className="text-sm text-neutral-600 italic">{frame.name}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-8 border-t border-neutral-100 space-y-4">
          <button className="w-full bg-primary text-white py-5 px-6 text-lg font-medium hover:bg-neutral-900 transition-colors uppercase tracking-widest shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300">
            Request Quote
          </button>
          <div className="flex justify-between text-xs text-neutral-500 font-medium uppercase tracking-wide">
            <span>Delivery: 4-6 Weeks</span>
            <span>Made in Germany</span>
          </div>
        </div>
      </div>
    </div>
  );
}

