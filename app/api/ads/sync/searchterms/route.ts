// app/api/ads/sync/searchterms/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/db';
import { getUserAdsCredentials, getLWAToken } from '@/lib/ads/auth';
import { createSearchTermReport } from '@/lib/ads/reports';

const CLIENT_ID = process.env.ADS_LWA_CLIENT_ID!;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id')!;
    const days = Number(searchParams.get('days') ?? '30');

    if (!userId) return NextResponse.json({ ok: false, reason: 'missing-user' }, { status: 400 });

    const creds = await getUserAdsCredentials(userId);
    if (!creds?.refresh_token) {
      return NextResponse.json({ ok: false, reason: 'no-refresh-token-for-user' }, { status: 400 });
    }
    if (!creds.profile_id) {
      return NextResponse.json({ ok: false, reason: 'no-profile-id' }, { status: 400 });
    }

    const region = (creds.region ?? 'NA') as 'NA' | 'EU' | 'FE';

    // date window (max 31 days per Amazon)
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - Math.min(Math.max(days, 1), 31));
    const fmt = (d: Date) =>
      `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
    const startDate = fmt(start);
    const endDate = fmt(end);

    const token = await getLWAToken(creds.refresh_token);

    const { reportId } = await createSearchTermReport({
      accessToken: token.access_token,
      clientId: CLIENT_ID,
      region,
      profileId: creds.profile_id,
      startDate,
      endDate,
    });

    // optional: store a pointer in DB (events table) for polling
    const db = createClient();
    await db.from('events').insert({
      user_id: userId,
      type: 'ads_searchterms_requested',
      payload: { reportId },
    });

    return NextResponse.json({ ok: true, reportId });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, reason: 'error', details: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}
