"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

interface SafeImageProps extends Omit<ImageProps, "src" | "alt"> {
  src?: string | null;
  alt: string;
  fallbackSrc?: string;
}

export function SafeImage({
  src,
  alt,
  fallbackSrc = "/images/products/60x30-workstation-1.webp",
  ...props
}: SafeImageProps) {
  const [error, setError] = useState(false);
  const imgSrc = error || !src ? fallbackSrc : src;

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      sizes={props.sizes ?? "100vw"}
      onError={() => setError(true)}
    />
  );
}
