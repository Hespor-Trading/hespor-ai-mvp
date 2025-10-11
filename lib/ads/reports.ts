// lib/ads/reports.ts
type Region = 'NA' | 'EU' | 'FE'; // expand if you need
type ReportScope = { profileId: string };
type ReportStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';

const ADS_API_BY_REGION: Record<Region, string> = {
  NA: 'https://advertising-api.amazon.com',
  EU: 'https://advertising-api-eu.amazon.com',
  FE: 'https://advertising-api-fe.amazon.com',
};

export function baseUrlFor(region: Region) {
  const url = ADS_API_BY_REGION[region];
  if (!url) throw new Error(`Unsupported region: ${region}`);
  return url;
}

export async function createSearchTermReport(opts: {
  accessToken: string;
  clientId: string; // use ADS_LWA_CLIENT_ID
  region: Region;
  profileId: string;
  startDate: string; // YYYYMMDD
  endDate: string;   // YYYYMMDD
}) {
  const { accessToken, clientId, region, profileId, startDate, endDate } = opts;

  const url = `${baseUrlFor(region)}/v3/reports`;
  const body = {
    // Sponsored Products search terms (productAds / targets)
    name: 'spSearchTerm',
    configuration: {
      adProduct: 'SPONSORED_PRODUCTS',
      groupBy: ['searchTerm'],
      timeUnit: 'DAILY',
      columns: [
        'impressions',
        'clicks',
        'cost',
        'purchases14d',
        'sales14d',
        'attributedSales14d',
      ],
      reportTypeId: 'spSearchTerm',
      filters: [],
      dateRange: { startDate, endDate },
    },
    // Required since v3
    stateFilter: ['ENABLED', 'PAUSED', 'ARCHIVED'],
    format: 'GZIP_JSON',
    // optional: scope to the profile
    scope: { profileId } as ReportScope,
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Amazon-Advertising-API-ClientId': clientId,
      'Amazon-Advertising-API-Scope': profileId,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.reports.v3+json',
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  if (!res.ok) throw new Error(`create report failed: ${res.status} ${text}`);
  return JSON.parse(text) as { reportId: string };
}

export async function getReportStatus(opts: {
  accessToken: string;
  clientId: string;
  region: Region;
  profileId: string;
  reportId: string;
}) {
  const { accessToken, clientId, region, profileId, reportId } = opts;
  const url = `${baseUrlFor(region)}/v3/reports/${reportId}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Amazon-Advertising-API-ClientId': clientId,
      'Amazon-Advertising-API-Scope': profileId,
      Accept: 'application/vnd.reports.v3+json',
    },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`get report status failed: ${res.status} ${text}`);
  return JSON.parse(text) as { status: ReportStatus; url?: string };
}

export async function downloadReport(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download report failed: ${res.status}`);
  // v3 returns gzip JSON. If your runtime auto-decompresses, parse directly.
  // If not, add decompression.
  return (await res.json()) as Array<Record<string, unknown>>;
}
