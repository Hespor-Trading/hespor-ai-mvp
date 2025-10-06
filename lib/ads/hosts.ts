// lib/ads/hosts.ts
export function adsHostFor(region: string) {
  switch ((region || "na").toLowerCase()) {
    case "eu": return "https://advertising-api-eu.amazon.com";
    case "fe": return "https://advertising-api-fe.amazon.com";
    default:   return "https://advertising-api.amazon.com"; // NA
  }
}
