// app/api/ads/sync/entities/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { adsHostFor } from "@/lib/ads/hosts";
import { refreshAdsToken } from "@/lib/ads/tokens";
import { getSupabaseServer } from "@/lib/supabaseServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Cred = {
  access_token: string | null;
  refresh_token: string;
  region: string | null;
  profile_id: string;
  expires_at: string | null;
};

function toISODate(yyyymmdd?: string | null) {
  if (!yyyymmdd || yyyymmdd.length !== 8) return null;
  return `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`;
}

export async function POST(req: Request) {
  try {
    // 1) Resolve user (cookie OR headless body/query)
    const supabaseCookie = getSupabaseServer();
    const { data: { user } } = await supabaseCookie.auth.getUser();

    const url = new URL(req.url);
    const maybeBody = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const user_id: string | undefined =
      user?.id || maybeBody.user_id || url.searchParams.get("user_id") || undefined;

    if (!user_id) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    // 2) Service-role client (headless-safe)
    const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supa = createClient(sbUrl, sbKey, { auth: { persistSession: false } });

    // 3) Get Ads credentials
    const { data: cred, error: credErr } = await supa
      .from("amazon_ads_credentials")
      .select("access_token, refresh_token, region, profile_id, expires_at")
      .eq("user_id", user_id)
      .not("profile_id", "is", null)
      .single<Cred>();

    if (credErr || !cred) {
      return NextResponse.json({ ok: false, error: "no_creds_or_profile" }, { status: 400 });
    }

    // 4) Refresh LWA if needed
    let accessToken = cred.access_token;
    const now = Date.now();
    const exp = cred.expires_at ? Date.parse(cred.expires_at) : 0;
    if (!accessToken || exp <= now) {
      const t = await refreshAdsToken(cred.refresh_token);
      const expires_at = new Date(Date.now() + t.expires_in * 1000).toISOString();
      await supa
        .from("amazon_ads_credentials")
        .update({ access_token: t.access_token, expires_at })
        .eq("user_id", user_id);
      accessToken = t.access_token;
    }

    // 5) Fetch campaigns and upsert
    const host = adsHostFor(cred.region || "na");
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Amazon-Advertising-API-ClientId":
        process.env.ADS_LWA_CLIENT_ID || process.env.NEXT_PUBLIC_ADS_LWA_CLIENT_ID || "",
      "Amazon-Advertising-API-Scope": cred.profile_id,
      Accept: "application/json",
    };

    const camps = await fetch(
      `${host}/v2/sp/campaigns?stateFilter=enabled,paused,archived`,
      { headers }
    );
    if (!camps.ok) {
      return NextResponse.json({ ok: false, error: "camps_fetch" }, { status: 502 });
    }
    const campaigns = await camps.json();

    await supa.from("ads_campaigns").upsert(
      (campaigns as any[]).map((c) => ({
        user_id,
        profile_id: cred.profile_id,
        campaign_id: String(c.campaignId),
        name: c.name,
        state: c.state,
        targeting_type: c.targetingType,
        daily_budget: c.dailyBudget,
        start_date: toISODate(c.startDate),
        end_date: toISODate(c.endDate),
      })),
      { onConflict: "campaign_id" }
    );

    // (Optional TODOs) fetch and upsert ad groups / keywords similarly

    return NextResponse.json({ ok: true, campaigns: (campaigns as any[]).length });
  } catch (e: any) {
    console.error("entities sync error", e);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
