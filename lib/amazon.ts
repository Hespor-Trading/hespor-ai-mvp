// lib/amazon.ts

/**
 * Returns the tenant/brand from URL query.
 * Accepts either a URLSearchParams OR a raw "?a=1&b=2" string.
 * Defaults to DECOGAR for MVP.
 */
export function brandFromQuery(input: string | URLSearchParams): string {
  const params = typeof input === "string" ? new URLSearchParams(input) : input;

  const brand =
    params.get("brand") ||
    params.get("state") || // OAuth "state" often carries brand
    "DECOGAR";

  return String(brand).trim();
}
