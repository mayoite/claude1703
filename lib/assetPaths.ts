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

export function normalizeAssetPath(path: string | null | undefined): string {
  if (!path) return "";
  const normalized = String(path).trim();
  if (!normalized) return "";
  if (hasAbsoluteUrl(normalized)) return normalized;
  const lower = normalized.toLowerCase();
  const hasImageExtension = /\.(webp|png|jpe?g|gif|avif|svg)$/i.test(normalized);

  // Legacy catalog exports referenced `/images/afc/*`; assets now live under `/images/catalog/*`.
  if (lower.startsWith("/images/afc/")) {
    return applyAssetBase(`/images/catalog/${normalized.slice("/images/afc/".length)}`);
  }

  // Legacy homepage content used `/products/*.webp` while static files are under `/images/products/*`.
  if (hasImageExtension && lower.startsWith("/products/")) {
    return applyAssetBase(`/images/products/${normalized.slice("/products/".length)}`);
  }

  // Phoenix seating assets are currently repo-backed as JPG files only.
  // Map stale WEBP references to valid local JPG paths and drop non-existent overflow indices.
  if (lower.startsWith("/images/catalog/oando-seating--phoenix/image-") && lower.endsWith(".webp")) {
    const match = lower.match(/image-(\d+)\.webp$/);
    const imageIndex = match ? Number.parseInt(match[1], 10) : Number.NaN;
    if (Number.isNaN(imageIndex) || imageIndex < 1 || imageIndex > 3) return "";
    return applyAssetBase(`/images/catalog/oando-seating--phoenix/image-${imageIndex}.jpg`);
  }

  return applyAssetBase(normalized);
}

export function normalizeAssetList(
  values: Array<string | null | undefined> | null | undefined,
): string[] {
  if (!Array.isArray(values)) return [];
  return values
    .map((value) => normalizeAssetPath(value))
    .filter(Boolean);
}

