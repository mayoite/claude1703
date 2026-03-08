export function sanitizeDisplayText(value: string): string {
  return String(value || "")
    .replace(/[�]+/g, "")
    .replace(/Ã¢â‚¬â€|â€”|—/g, "-")
    .replace(/Ã¢â‚¬â€œ|â€“|–/g, "-")
    .replace(/Ã¢â‚¬Ëœ|Ã¢â‚¬â„¢|â€˜|â€™|’/g, "'")
    .replace(/Ã¢â‚¬Å“|Ã¢â‚¬\u009d|Ã¢â‚¬"|â€œ|â€\u009d|â€"|“|”/g, "\"")
    .replace(/â€¦|…/g, "...")
    .replace(/(?:â‚¹|₹)\s*/g, "Rs. ")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
