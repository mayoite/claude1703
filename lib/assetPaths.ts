import fs from "node:fs";
import path from "node:path";

const configuredAssetBaseUrl = (
  process.env.NEXT_PUBLIC_ASSET_BASE_URL ||
  process.env.ASSET_BASE_URL ||
  ""
)
  .trim()
  .replace(/\/+$/, "");

function hasAbsoluteUrl(value: string): boolean {
  return /^(?:https?:)?\/\//i.test(value) || /^[a-z][a-z0-9+.-]*:/i.test(value);
}

function applyAssetBase(value: string): string {
  if (!configuredAssetBaseUrl) return value;
  if (!value.startsWith("/")) return value;
  return `${configuredAssetBaseUrl}${value}`;
}

function toPublicFsPath(assetPath: string): string {
  const normalized = assetPath.replace(/^\/+/, "").split("/").join(path.sep);
  return path.join(process.cwd(), "public", normalized);
}

function localAssetExists(assetPath: string): boolean {
  if (!assetPath.startsWith("/")) return false;
  try {
    return fs.existsSync(toPublicFsPath(assetPath));
  } catch {
    return false;
  }
}

function resolveLocalImageVariant(assetPath: string): string {
  if (localAssetExists(assetPath)) return assetPath;

  if (assetPath.toLowerCase().endsWith(".webp")) {
    const jpgCandidate = assetPath.replace(/\.webp$/i, ".jpg");
    if (localAssetExists(jpgCandidate)) return jpgCandidate;
    const jpegCandidate = assetPath.replace(/\.webp$/i, ".jpeg");
    if (localAssetExists(jpegCandidate)) return jpegCandidate;
    const pngCandidate = assetPath.replace(/\.webp$/i, ".png");
    if (localAssetExists(pngCandidate)) return pngCandidate;
  }

  return "";
}

export function normalizeAssetPath(path: string | null | undefined): string {
  if (!path) return "";
  const normalized = String(path).trim();
  if (!normalized) return "";
  if (hasAbsoluteUrl(normalized)) return normalized;
  const hasImageExtension = /\.(webp|png|jpe?g|gif|avif|svg)$/i.test(normalized);
  let candidatePath = normalized;
  let candidateLower = candidatePath.toLowerCase();

  // Legacy catalog exports referenced `/images/afc/*`; assets now live under `/images/catalog/*`.
  if (candidateLower.startsWith("/images/afc/")) {
    candidatePath = `/images/catalog/${candidatePath.slice("/images/afc/".length)}`;
    candidateLower = candidatePath.toLowerCase();
  }

  // Legacy homepage content used `/products/*.webp` while static files are under `/images/products/*`.
  if (hasImageExtension && candidateLower.startsWith("/products/")) {
    candidatePath = `/images/products/${candidatePath.slice("/products/".length)}`;
    candidateLower = candidatePath.toLowerCase();
  }

  // Phoenix seating assets are currently repo-backed as JPG files only.
  // Map stale WEBP references to valid local JPG paths and drop non-existent overflow indices.
  if (
    candidateLower.startsWith("/images/catalog/oando-seating--phoenix/image-") &&
    candidateLower.endsWith(".webp")
  ) {
    const match = candidateLower.match(/image-(\d+)\.webp$/);
    const imageIndex = match ? Number.parseInt(match[1], 10) : Number.NaN;
    if (Number.isNaN(imageIndex) || imageIndex < 1 || imageIndex > 3) return "";
    return applyAssetBase(`/images/catalog/oando-seating--phoenix/image-${imageIndex}.jpg`);
  }

  // Catalog rows still contain stale WEBP references while repo assets are JPG-only for many products.
  // Resolve to an existing local variant when possible and drop unresolved local image paths.
  if (candidatePath.startsWith("/images/") && hasImageExtension) {
    const resolvedVariant = resolveLocalImageVariant(candidatePath);
    if (!resolvedVariant) return "";
    return applyAssetBase(resolvedVariant);
  }

  return applyAssetBase(candidatePath);
}

export function normalizeAssetList(
  values: Array<string | null | undefined> | null | undefined,
): string[] {
  if (!Array.isArray(values)) return [];
  return values
    .map((value) => normalizeAssetPath(value))
    .filter(Boolean);
}

