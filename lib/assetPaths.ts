export function normalizeAssetPath(path: string | null | undefined): string {
  if (!path) return "";
  const normalized = String(path).trim();
  const lower = normalized.toLowerCase();
  const hasImageExtension = /\.(webp|png|jpe?g|gif|avif|svg)$/i.test(normalized);

  // Legacy catalog exports referenced `/images/afc/*`; assets now live under `/images/catalog/*`.
  if (lower.startsWith("/images/afc/")) {
    return `/images/catalog/${normalized.slice("/images/afc/".length)}`;
  }

  // Legacy homepage content used `/products/*.webp` while static files are under `/images/products/*`.
  if (hasImageExtension && lower.startsWith("/products/")) {
    return `/images/products/${normalized.slice("/products/".length)}`;
  }

  return normalized;
}

export function normalizeAssetList(
  values: Array<string | null | undefined> | null | undefined,
): string[] {
  if (!Array.isArray(values)) return [];
  return values
    .map((value) => normalizeAssetPath(value))
    .filter(Boolean);
}

