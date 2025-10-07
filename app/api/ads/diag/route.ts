// app/api/ads/diag/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { refreshAdsToken } from "@/lib/ads/tokens";
import { adsHostFor } from "@/lib/ads/hosts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Helper to trim long texts for readability
function snip(s: string, n = 600) {
  if (!s) return s;
  return s.length > n ? s.slice(0, n) + "…(truncated)" : s;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const user_id = url.searchParams.get("user_id") || "";
    const days = Number(url.searchParams.get("days") || 30);
    if (!user_id) return NextResponse.json({ error: "missing user_id" }, { status: 400 });

    const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supa = createClient(sbUrl, sbKey, { auth: { persistSession: false } });

    const { data: cred, error: credErr } = await supa
      .from("amazon_ads_credentials")
      .select("access_token, refresh_token, region, profile_id, expires_at")
      .eq("user_id", user_id)
      .not("profile_id", "is", null)
      .single();

    if (credErr || !cred) {
      return NextResponse.json({ error: "no_creds_or_profile", detail: credErr?.message }, { status: 400 });
    }

    let accessToken: string | null = cred.access_token;
    const exp = cred.expires_at ? Date.parse(cred.expires_at) : 0;
    if (!accessToken || exp <= Date.now()) {
      const t = await refreshAdsToken(cred.refresh_token);
      accessToken = t.access_token;
      const expires_at = new Date(Date.now() + t.expires_in * 1000).toISOString();
      await supa.from("amazon_ads_credentials").update({ access_token: accessToken, expires_at }).eq("user_id", user_id);
    }

    const host = adsHostFor(cred.region || "na");
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Amazon-Advertising-API-ClientId":
        process.env.ADS_LWA_CLIENT_ID || process.env.NEXT_PUBLIC_ADS_LWA_CLIENT_ID || "",
      "Amazon-Advertising-API-Scope": cred.profile_id,
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    // 1) quick SP campaigns probe (tells us if SP endpoints are allowed)
    const campRes = await fetch(`${host}/v2/sp/campaigns?startIndex=0&count=1`, { headers });
    const campText = await campRes.text().catch(() => "");

    // 2) try v3 report (A: query, B: searchTerm) — return raw responses
    const start = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
    const end = new Date().toISOString().slice(0, 10);

    const bodyA = {
      name: "sp_search_terms",
      startDate: start,
      endDate: end,
      configuration: {
        adProduct: "SPONSORED_PRODUCTS",
        groupBy: ["query"],
        columns: [
          "date","campaignId","adGroupId","query","keywordText","matchType",
          "impressions","clicks","cost","purchases14d","sales14d"
        ]
      },
      reportTypeId: "spSearchTerm",
      timeUnit: "DAILY",
      format: "GZIP_JSON"
    };

    const bodyB = {
      name: "sp_search_terms",
      startDate: start,
      endDate: end,
      configuration: {
        adProduct: "SPONSORED_PRODUCTS",
        groupBy: ["searchTerm"],
        columns: [
          "date","campaignId","adGroupId","searchTerm","targetingExpression","matchType",
          "impressions","clicks","cost","purchases14d","sales14d"
        ]
      },
      reportTypeId: "spSearchTerm",
      timeUnit: "DAILY",
      format: "GZIP_JSON"
    };

    const createA = await fetch(`${host}/v3/reports`, { method: "POST", headers, body: JSON.stringify(bodyA) });
    const textA = await createA.text().catch(() => "");

    const createB = await fetch(`${host}/v3/reports`, { method: "POST", headers, body: JSON.stringify(bodyB) });
    const textB = await createB.text().catch(() => "");

    return NextResponse.json({
      user_id,
      profile_id: cred.profile_id,
      host,
      probes: {
        sp_campaigns: { status: campRes.status, body: snip(campText) },
        create_report_A_query: { status: createA.status, body: snip(textA) },
        create_report_B_searchTerm: { status: createB.status, body: snip(textB) },
      }
    });
  } catch (e: any) {
    console.error("diag error", e);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
