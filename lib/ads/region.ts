// lib/ads/region.ts
export type Region = 'NA' | 'EU' | 'FE';

export function normalizeRegion(input?: string): Region {
  const r = (input || '').trim().toUpperCase();
  if (r === 'NA' || r === 'EU' || r === 'FE') return r;
  throw new Error(`Unsupported region: ${input ?? '(empty)'}`);
}

export function adsHost(region: Region): string {
  switch (region) {
    case 'NA': return 'https://advertising-api.amazon.com';
    case 'EU': return 'https://advertising-api-eu.amazon.com';
    case 'FE': return 'https://advertising-api-fe.amazon.com';
  }
}
