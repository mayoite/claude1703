"use client";

import React from "react";
import Image from "next/image";
import { useConfigurator } from "./ConfiguratorContext";

const layoutImages: Record<string, string> = {
  linear: "/images/products/linear-workstation-1.webp",
  "cluster-4": "/images/products/deskpro-workstation-1.webp",
  "cluster-6": "/images/products/deskpro-workstation-2.webp",
  "l-shape": "/images/products/60x30-workstation-1.webp",
  "u-shape": "/images/products/60x30-workstation-2.webp",
  "private-cabins": "/images/products/cabin electrical render .webp",
  "hybrid-mix": "/images/products/deskpro-workstation-3.webp",
};

export function ConfiguratorPreview() {
  const { config } = useConfigurator();

  const previewImage =
    config.layout && layoutImages[config.layout]
      ? layoutImages[config.layout]
      : "/images/products/deskpro-workstation-1.webp";

  return (
    <div className="w-full max-w-2xl space-y-6">
      {/* Preview Image */}
      <div className="relative aspect-[4/3] bg-white border border-neutral-200 overflow-hidden">
        <Image
          src={previewImage}
          alt="Workstation Preview"
          fill
          sizes="100vw"
          className="object-contain p-4"
        />
        {/* Overlay Info */}
        {config.layout && (
          <div className="absolute bottom-0 left-0 right-0 bg-neutral-900/90 backdrop-blur-sm text-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-neutral-400">
                  Selected Layout
                </p>
                <p className="text-sm font-medium">
                  {config.layout.replace("-", " ").toUpperCase()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-neutral-400">
                  Capacity
                </p>
                <p className="text-sm font-medium">
                  {config.seatingCount} Seats
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Configuration Summary */}
      <div className="bg-white border border-neutral-200 p-6 space-y-3">
        <h3 className="text-sm font-medium uppercase tracking-wide text-neutral-400">
          Current Selection
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-600">Type:</span>
            <span className="font-medium capitalize">
              {config.furnitureType}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-600">Seating:</span>
            <span className="font-medium capitalize">
              {config.seatingType} {config.seatingCount}-seater
            </span>
          </div>
          {config.topFinish && (
            <div className="flex justify-between">
              <span className="text-neutral-600">Finish:</span>
              <span className="font-medium">{config.topFinish}</span>
            </div>
          )}
          {config.hasReturnPartition && (
            <div className="flex justify-between">
              <span className="text-neutral-600">Return Partition:</span>
              <span className="font-medium">Yes</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
