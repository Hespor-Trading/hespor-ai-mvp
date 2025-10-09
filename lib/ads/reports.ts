// lib/ads/reports.ts
import { adsApiBaseByRegion } from '@/lib/ads/auth';

type Region = 'na' | 'eu' | 'fe';

export async function createSpSearchTermReport(params: {
  accessToken: string;
  region: Region;
  profileId: string;
  startDate: string; // YYYYMMDD
  endDate: string;   // YYYYMMDD
}) {
  const base = adsApiBaseByRegion(params.region);
  const res = await fetch(`${base}/reporting/reports`, {
    method: 'POST',
    headers: {
      'Amazon-Advertising-API-ClientId': process.env.AMAZON_ADS_CLIENT_ID!,
      'Amazon-Advertising-API-Scope': params.profileId,
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      name: 'sp-search-terms',
      startDate: params.startDate,
      endDate: params.endDate,
      configuration: {
        adProduct: 'SPONSORED_PRODUCTS',
        reportTypeId: 'spSearchTerm',
        groupBy: ['searchTerm'],
        columns: [
          'keywordText','searchTerm','matchType',
          'impressions','clicks','cost','purchases14d','sales14d','attributedUnitsOrdered14d','attributedSales14d'
        ],
        timeUnit: 'DAILY',
        format: 'GZIP_JSON'
      }
    }),
    cache: 'no-store',
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`create report failed: ${res.status} ${t}`);
  }
  return (await res.json()) as { reportId: string };
}

export async function getReportStatus(params: {
  accessToken: string;
  region: Region;
  reportId: string;
}) {
  const base = adsApiBaseByRegion(params.region);
  const res = await fetch(`${base}/reporting/reports/${params.reportId}`, {
    headers: {
      'Amazon-Advertising-API-ClientId': process.env.AMAZON_ADS_CLIENT_ID!,
      Authorization: `Bearer ${params.accessToken}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  });
  const json = await res.json();
  return json as { status: 'PENDING'|'CANCELLED'|'FAILURE'|'COMPLETED'; location?: string };
}

export async function downloadReport(url: string) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`download failed: ${res.status}`);
  // Amazon returns gzip-json; Vercel/Next automatically ungzips for you in fetch.
  const text = await res.text();
  // each line is a JSON row
  const rows = text.trim().split('\n').map(l => JSON.parse(l));
  return rows as any[];
}
