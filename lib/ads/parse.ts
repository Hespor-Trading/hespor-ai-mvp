// lib/ads/parse.ts
export async function downloadAndParseReport(url: string) {
  const res = await fetch(url); // if gzip, Vercel/Node usually auto-decompresses; if not, add gunzip
  if (!res.ok) throw new Error(`download failed: ${res.status}`);
  const data = await res.json(); // array of rows
  return data as Array<{
    date: string;
    searchTerm: string;
    keywordText: string;
    matchType: string;
    campaignId: string;
    adGroupId: string;
    impressions: number;
    clicks: number;
    cost: number;
    purchases14d?: number;
    sales14d?: number;
  }>;
}

export function toDbRows(raw: any[], user_id: string, profile_id: string) {
  return raw
    .map((r) => ({
      user_id,
      profile_id,
      day: r.date,
      campaign_id: String(r.campaignId ?? ''),
      ad_group_id: String(r.adGroupId ?? ''),
      keyword_text: String(r.keywordText ?? ''),
      search_term: String(r.searchTerm ?? ''),
      match_type: String(r.matchType ?? ''),
      impressions: Number(r.impressions ?? 0),
      clicks: Number(r.clicks ?? 0),
      cost: Number(r.cost ?? 0),
      orders: Number(r.purchases14d ?? 0),
      sales: Number(r.sales14d ?? 0),
    }))
    .filter(r =>
      r.day && r.search_term && r.keyword_text && r.campaign_id && r.ad_group_id
    );
}
