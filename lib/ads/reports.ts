// lib/ads/reports.ts
import { adsHost, normalizeRegion } from './region';

type CreateReportResponse = { reportId: string };

export async function createSearchTermsReport(params: {
  accessToken: string;
  clientId: string;
  profileId: string;
  region: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}) {
  const host = adsHost(normalizeRegion(params.region));
  // Path below is the Ads Reporting 3.0 route; if your code already has a constant, reuse it.
  const url = `${host}/reporting/reports`;

  // Minimum config that works across regions
  const body = {
    name: 'spSearchTerm',
    configuration: {
      adProduct: 'SPONSORED_PRODUCTS',
      groupBy: ['searchTerm'],
      columns: [
        'searchTerm',
        'keywordText',
        'matchType',
        'campaignId',
        'adGroupId',
        'impressions',
        'clicks',
        'cost',
        'purchases14d',
        'sales14d'
      ],
      reportTypeId: 'spSearchTerm',   // current ID for SP Search Terms
      timeUnit: 'DAILY',
      format: 'GZIP_JSON',           // compact; use JSON if you prefer
      startDate: params.startDate,
      endDate: params.endDate,
    }
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${params.accessToken}`,
      'Amazon-Advertising-API-ClientId': params.clientId,
      'Amazon-Advertising-API-Scope': params.profileId,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`create report failed: ${res.status} ${t}`);
  }
  return (await res.json()) as CreateReportResponse;
}

export async function getReportStatus(params: {
  accessToken: string;
  clientId: string;
  profileId: string;
  region: string;
  reportId: string;
}) {
  const host = adsHost(normalizeRegion(params.region));
  const res = await fetch(`${host}/reporting/reports/${params.reportId}`, {
    headers: {
      'Authorization': `Bearer ${params.accessToken}`,
      'Amazon-Advertising-API-ClientId': params.clientId,
      'Amazon-Advertising-API-Scope': params.profileId,
    },
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`get report failed: ${res.status} ${t}`);
  }
  return await res.json(); // { status: 'PENDING'|'COMPLETED'|'FAILURE', url?: string }
}
