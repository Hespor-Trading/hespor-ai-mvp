// lib/amazon.ts

/**
 * Returns the tenant/brand from URL query.
 * We accept ?brand=... OR use OAuth ?state=... fallback.
 * Defaults to DECOGAR for MVP.
 */
export function brandFromQuery(searchParams: URLSearchParams): string {
  const brand =
    searchParams.get("brand") ||
    searchParams.get("state") || // OAuth "state" carries brand in your flow
    "DECOGAR";
  return String(brand).trim();
}
