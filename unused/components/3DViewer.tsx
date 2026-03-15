"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";

interface ThreeDViewerProps {
  src: string;
  fallbackImage: string;
}

export function ThreeDViewer({ src, fallbackImage }: ThreeDViewerProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    import("@google/model-viewer").catch(console.error);
  }, []);

  if (!isClient) return <div className="animate-pulse bg-neutral-100" />;

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing bg-neutral-100 group">
      {/* @ts-expect-error - model-viewer is a custom element */}
      <model-viewer
        src={src}
        alt="3D model of the product"
        ar="true"
        ar-modes="webxr scene-viewer quick-look"
        camera-controls="true"
        auto-rotate="true"
        shadow-intensity="1"
        className="w-full h-full"
      >
        <div
          slot="poster"
          className="absolute inset-0 flex items-center justify-center bg-neutral-50"
        >
          <Image
            src={fallbackImage}
            alt="Fallback"
            fill
            sizes="100vw"
            className="object-cover opacity-50"
          />
          <Loader2 className="w-8 h-8 text-neutral-300 animate-spin z-10" />
        </div>
        {/* @ts-expect-error - closing tag for custom element */}
      </model-viewer>
    </div>
  );
}
