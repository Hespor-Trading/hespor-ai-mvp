// app/api/ads/report/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/db';
import { getUserAdsCredentials, getLWAToken } from '@/lib/ads/auth';
import { getReportStatus, downloadReport } from '@/lib/ads/reports';

const CLIENT_ID = process.env.ADS_LWA_CLIENT_ID!;

type Row = {
  day?: string;
  searchTerm?: string;
  keywordText?: string;
  campaignId?: string;
  adGroupId?: string;
  impressions?: number;
  clicks?: number;
  cost?: number;
  purchases14d?: number;
  sales14d?: number;
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id')!;
    const reportId = searchParams.get('report_id')!;
    if (!userId || !reportId)
      return NextResponse.json({ ok: false, reason: 'missing-params' }, { status: 400 });

    const creds = await getUserAdsCredentials(userId);
    if (!creds?.refresh_token || !creds?.profile_id)
      return NextResponse.json({ ok: false, reason: 'missing-creds' }, { status: 400 });

    const region = (creds.region ?? 'NA') as 'NA' | 'EU' | 'FE';
    const token = await getLWAToken(creds.refresh_token);

    const status = await getReportStatus({
      accessToken: token.access_token,
      clientId: CLIENT_ID,
      region,
      profileId: creds.profile_id,
      reportId,
    });

    if (status.status !== 'COMPLETED') {
      return NextResponse.json({ ok: false, status: status.status, reportId });
    }

    if (!status.url) return NextResponse.json({ ok: false, reason: 'no-url' }, { status: 500 });

    const raw = await downloadReport(status.url);

    // map & keep valid rows only
    const rows: Row[] = (raw as any[]).map((r: any) => ({
      day: r.date,
      searchTerm: r.searchTerm,
      keywordText: r.keywordText,
      campaignId: r.campaignId,
      adGroupId: r.adGroupId,
      impressions: Number(r.impressions ?? 0),
      clicks: Number(r.clicks ?? 0),
      cost: Number(r.cost ?? 0),
      purchases14d: Number(r.purchases14d ?? 0),
      sales14d: Number(r.sales14d ?? 0),
    })).filter((r: Row) =>
      r.day && r.searchTerm && r.keywordText && r.campaignId && r.adGroupId
    );

    // upsert into ads_search_terms
    const db = createClient();
    if (rows.length) {
      const payload = rows.map((r) => ({
        user_id: userId,
        profile_id: creds.profile_id,
        day: r.day,
        campaign_id: r.campaignId,
        ad_group_id: r.adGroupId,
        keyword_text: r.keywordText,
        search_term: r.searchTerm,
        impressions: r.impressions ?? 0,
        clicks: r.clicks ?? 0,
        cost: r.cost ?? 0,
        orders: r.purchases14d ?? 0,
        sales: r.sales14d ?? 0,
      }));
      await db.from('ads_search_terms').upsert(payload, {
        onConflict: 'user_id,profile_id,day,campaign_id,ad_group_id,keyword_text,search_term',
        ignoreDuplicates: false,
      });
    }

    return NextResponse.json({ ok: true, rows: rows.length, reportId });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, reason: 'error', details: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}
