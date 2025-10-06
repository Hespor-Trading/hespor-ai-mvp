// app/api/ads/sync/entities/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { adsHostFor } from "@/lib/ads/hosts";
import { refreshAdsToken } from "@/lib/ads/tokens";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { user_id } = await req.json(); // call from dashboard on demand
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supa = createClient(url, key, { auth: { persistSession: false } });

  // 1) get creds
  const { data: cred } = await supa
    .from("amazon_ads_credentials")
    .select("access_token, refresh_token, region, profile_id, expires_at")
    .eq("user_id", user_id)
    .single();
  if (!cred) return NextResponse.json({ ok: false, error: "no_creds" }, { status: 400 });

  // 2) refresh if needed
  if (!cred.access_token || new Date(cred.expires_at) <= new Date()) {
    const t = await refreshAdsToken(cred.refresh_token);
    const expires_at = new Date(Date.now() + t.expires_in * 1000).toISOString();
    await supa.from("amazon_ads_credentials").update({ access_token: t.access_token, expires_at }).eq("user_id", user_id);
    cred.access_token = t.access_token;
  }

  const host = adsHostFor(cred.region || "na");
  const headers = {
    Authorization: `Bearer ${cred.access_token}`,
    "Amazon-Advertising-API-ClientId": process.env.ADS_LWA_CLIENT_ID || process.env.NEXT_PUBLIC_ADS_CLIENT_ID!,
    "Amazon-Advertising-API-Scope": cred.profile_id, // REQUIRED
    Accept: "application/json",
  };

  // 3) pull campaigns
  const camps = await fetch(`${host}/v2/sp/campaigns?stateFilter=enabled,paused,archived`, { headers });
  if (!camps.ok) return NextResponse.json({ ok: false, error: "camps_fetch" }, { status: 502 });
  const campaigns = await camps.json();

  // upsert
  await supa.from("ads_campaigns").upsert(
    campaigns.map((c: any) => ({
      user_id,
      profile_id: cred.profile_id,
      campaign_id: String(c.campaignId),
      name: c.name,
      state: c.state,
      targeting_type: c.targetingType,
      daily_budget: c.dailyBudget,
      start_date: c.startDate ? `${c.startDate.slice(0,4)}-${c.startDate.slice(4,6)}-${c.startDate.slice(6,8)}` : null,
      end_date: c.endDate ? `${c.endDate.slice(0,4)}-${c.endDate.slice(4,6)}-${c.endDate.slice(6,8)}` : null,
    })),
    { onConflict: "campaign_id" }
  );

  // repeat similarly for ad groups + keywords (endpoints: /v2/sp/adGroups, /v2/sp/keywords)

  return NextResponse.json({ ok: true, campaigns: campaigns.length });
}
