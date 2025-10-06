// app/api/ads/sync/searchterms/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { adsHostFor } from "@/lib/ads/hosts";
import { refreshAdsToken } from "@/lib/ads/tokens";
import * as zlib from "zlib";

export async function POST(req: Request) {
  const { user_id, days = 30 } = await req.json();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supa = createClient(url, key, { auth: { persistSession: false } });

  const { data: cred } = await supa
    .from("amazon_ads_credentials")
    .select("access_token, refresh_token, region, profile_id, expires_at")
    .eq("user_id", user_id)
    .single();
  if (!cred) return NextResponse.json({ ok: false, error: "no_creds" }, { status: 400 });

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
    "Amazon-Advertising-API-Scope": cred.profile_id,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  // 1) create report (SP search term)
  const start = new Date(Date.now() - days * 86400000);
  const end = new Date();
  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  const create = await fetch(`${host}/v3/reports`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: "sp_search_terms",
      startDate: fmt(start),
      endDate: fmt(end),
      configuration: {
        adProduct: "SPONSORED_PRODUCTS",
        groupBy: ["searchTerm"],
        columns: ["date", "campaignId", "adGroupId", "targetingExpression", "impressions", "clicks", "cost", "purchases14d", "sales14d"],
        reportTypeId: "spSearchTerm", // Amazon’s SP search term preset
      },
      format: "GZIP_JSON",
    }),
  });
  if (!create.ok) return NextResponse.json({ ok: false, error: "create_report" }, { status: 502 });
  const { reportId } = await create.json();

  // 2) poll
  let location = "";
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 2000));
    const st = await fetch(`${host}/v3/reports/${reportId}`, { headers });
    const j = await st.json();
    if (j.status === "SUCCESS") { location = j.location; break; }
    if (j.status === "FAILURE") return NextResponse.json({ ok: false, error: "report_failed" }, { status: 502 });
  }
  if (!location) return NextResponse.json({ ok: false, error: "timeout" }, { status: 504 });

  // 3) download + parse
  const dl = await fetch(location);
  const gz = Buffer.from(await dl.arrayBuffer());
  const raw = zlib.gunzipSync(gz).toString("utf8");
  const rows = JSON.parse(raw) as any[]; // GZIP_JSON rows

  // 4) upsert minimal fields
  const mapped = rows.map(r => ({
    user_id,
    profile_id: cred.profile_id,
    day: r.date,
    campaign_id: String(r.campaignId),
    ad_group_id: String(r.adGroupId),
    keyword_text: String(r.targetingExpression || ""),
    search_term: String(r.searchTerm || ""),
    match_type: String(r.matchType || ""),
    impressions: Number(r.impressions || 0),
    clicks: Number(r.clicks || 0),
    cost: Number(r.cost || 0) / 1000000, // if micro currency, adjust as needed
    orders: Number(r.purchases14d || 0),
    sales: Number(r.sales14d || 0) / 1000000,
  }));

  if (mapped.length) {
    // upsert by (user_id, profile_id, day, campaign_id, ad_group_id, search_term)
    await supa.from("ads_search_terms").upsert(mapped, {
      onConflict: "user_id,profile_id,day,campaign_id,ad_group_id,search_term",
    });
  }

  return NextResponse.json({ ok: true, rows: mapped.length });
}
