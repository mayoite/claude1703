"use client";

import { useState, useRef, useEffect } from "react";
import { Check, RotateCcw } from "lucide-react";
import { motion, useSpring } from "framer-motion";

type DecorColor = {
  id: string;
  name: string;
  hex: string;
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
];

const BASE_PRICE = 499;

export function ConfiguratorCSS() {
  const [decor, setDecor] = useState<DecorColor>(DECORS[0]);
  const frame = FRAMES[0];
  const [size, setSize] = useState<SizeOption>(SIZES[1]);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const rotateX = useSpring(20, { stiffness: 150, damping: 20 });
  const rotateY = useSpring(-30, { stiffness: 150, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const { movementX, movementY } = e;
      rotateY.set(rotateY.get() + movementX * 0.5);
      rotateX.set(Math.min(45, Math.max(5, rotateX.get() - movementY * 0.5)));
    };
    const handleMouseUp = () => setIsDragging(false);

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
  const widthScale = size.widthCm / 160;
  const depthScale = size.depthCm / 80;

  return (
    <div className="w-full flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
      <div
        ref={containerRef}
        className={`w-full lg:w-2/3 bg-neutral-100 h-[500px] md:h-[600px] flex items-center justify-center relative overflow-hidden cursor-move ${isDragging ? "cursor-grabbing" : ""}`}
        onMouseDown={() => setIsDragging(true)}
      >
        <div className="absolute inset-0 opacity-10 bg-size-[40px_40px] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]"></div>
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 text-neutral-400 text-xs uppercase tracking-widest font-bold">
          <RotateCcw className="w-4 h-4" /> Drag to rotate
        </div>

        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
            perspective: 1200,
            willChange: "transform",
          }}
          className="relative w-[300px] h-[200px]"
        >
          {/* Tabletop */}
          <motion.div
            className="absolute inset-0"
            style={{
              transformStyle: "preserve-3d",
              transform: "translateZ(30px)",
            }}
          >
            <div
              className="absolute inset-0 shadow-2xl transition-all duration-500"
              style={{
                backgroundColor: decor.hex,
                width: `${300 * widthScale}px`,
                height: `${150 * depthScale}px`,
                transform: `translate(-${(300 * widthScale - 300) / 2}px, -${(150 * depthScale - 150) / 2}px)`,
                borderRadius: "2px",
              }}
            >
              <div className="absolute inset-0 bg-linear-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none mix-blend-overlay"></div>
            </div>
          </motion.div>

          {/* Frame */}
          <motion.div
            className="absolute inset-0"
            style={{
              transformStyle: "preserve-3d",
              transform: "translateZ(0px)",
            }}
          >
            <div
              className="absolute top-0 left-4 w-4 h-[160px]"
              style={{
                backgroundColor: frame.hex,
                transform: `translateX(-${(300 * widthScale - 300) / 2}px) rotateX(90deg) translateZ(-80px)`,
              }}
            />
            <div
              className="absolute top-0 right-4 w-4 h-[160px]"
              style={{
                backgroundColor: frame.hex,
                transform: `translateX(${(300 * widthScale - 300) / 2}px) rotateX(90deg) translateZ(-80px)`,
              }}
            />
          </motion.div>
        </motion.div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest text-neutral-400 bg-white/80 px-4 py-2 backdrop-blur-md border border-neutral-200">
          Scale: {size.label}
        </div>
      </div>

      <div className="w-full lg:w-1/3 space-y-10">
        <div>
          <h2 className="text-3xl font-bold tracking-tighter uppercase mb-2">
            Configure Your Desk
          </h2>
          <p className="text-neutral-500 font-medium text-sm leading-relaxed">
            High-performance CSS-3D visualization for instant previews.
          </p>
          <div className="mt-8 text-4xl font-bold text-neutral-900">
            €{totalPrice}
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
              Dimensions
            </label>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSize(opt)}
                  className={`px-4 py-2 border text-[11px] font-bold uppercase tracking-widest transition-all ${
                    size.id === opt.id
                      ? "bg-neutral-900 text-white border-neutral-900"
                      : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-900"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
              Tabletop
            </label>
            <div className="flex flex-wrap gap-3">
              {DECORS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setDecor(opt)}
                  className={`w-12 h-12 border-2 transition-all ${decor.id === opt.id ? "border-neutral-900 scale-110 shadow-lg" : "border-transparent hover:border-neutral-200"}`}
                  style={{ backgroundColor: opt.hex }}
                  title={opt.name}
                >
                  {decor.id === opt.id && (
                    <Check className="w-5 h-5 mx-auto text-white/50 mix-blend-difference" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button className="w-full bg-neutral-900 text-white py-4 px-8 text-sm font-bold uppercase tracking-[0.25em] shadow-xl hover:bg-neutral-800 transition-all hover:-translate-y-1">
          Add to Selection
        </button>
      </div>
    </div>
  );
}
