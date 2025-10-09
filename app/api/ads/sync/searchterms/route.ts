import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { gunzipSync } from "zlib";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LWA_CLIENT_ID =
  process.env.ADS_LWA_CLIENT_ID || process.env.NEXT_PUBLIC_ADS_LWA_CLIENT_ID || "";
const LWA_CLIENT_SECRET = process.env.ADS_LWA_CLIENT_SECRET || "";

function hostFor(region: string) {
  const r = (region || "na").toLowerCase();
  if (r === "eu") return "https://advertising-api-eu.amazon.com";
  if (r === "fe") return "https://advertising-api-fe.amazon.com";
  return "https://advertising-api.amazon.com";
}

async function fetchJSON(url: string, init?: RequestInit) {
  const res = await fetch(url, init);
  const text = await res.text();
  let json: any = {};
  try { json = text ? JSON.parse(text) : {}; } catch {}
  if (!res.ok) throw new Error(json?.detail || json?.message || `HTTP ${res.status}: ${text}`);
  return json;
}

async function getCred(user_id: string) {
  const { data, error } = await supabaseAdmin
    .from("amazon_ads_credentials")
    .select("refresh_token, profile_id, region")
    .eq("user_id", user_id)
    .maybeSingle();
  if (error || !data?.refresh_token || !data?.profile_id || !data?.region)
    throw new Error("missing-ads-credentials-for-user");
  return data as { refresh_token: string; profile_id: string; region: string };
}

async function refreshAccessToken(refresh_token: string): Promise<string> {
  const body = new URLSearchParams();
  body.set("grant_type", "refresh_token");
  body.set("refresh_token", refresh_token);
  body.set("client_id", LWA_CLIENT_ID);
  body.set("client_secret", LWA_CLIENT_SECRET);
  const json = await fetchJSON("https://api.amazon.com/auth/o2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  return json.access_token;
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

function parseRows(text: string) {
  const t = text.trim();
  return t.startsWith("[")
    ? JSON.parse(t)
    : t.split(/\r?\n/).filter(Boolean).map(l => JSON.parse(l));
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const user_id = url.searchParams.get("user_id");
    // MUST cap to 31 because Amazon Ads reporting enforces max 31-day windows
    const daysReq = parseInt(url.searchParams.get("days") || "30", 10);
    const days = Math.max(1, Math.min(31, isNaN(daysReq) ? 30 : daysReq));
    if (!user_id) return NextResponse.json({ ok: false, reason: "missing-user-id" });

    const cred = await getCred(user_id);
    const access_token = await refreshAccessToken(cred.refresh_token);
    const host = hostFor(cred.region);

    const since = new Date(Date.now() - days * 86400000);
    const startDate = since.toISOString().slice(0, 10);
    const endDate = new Date().toISOString().slice(0, 10);
    const reportName = `sp-searchterm-${startDate}-${endDate}-${Date.now()}`;

    // Required shape for SP Search Term report
    const body = {
      name: reportName,
      startDate,
      endDate,
      configuration: {
        adProduct: "SPONSORED_PRODUCTS",
        reportTypeId: "spSearchTerm",
        timeUnit: "DAILY",
        groupBy: ["searchTerm"], // ONLY searchTerm allowed
        columns: [
          "date", "searchTerm",
          "impressions", "clicks", "cost",
          "purchases14d", "sales14d",
          "matchType",
          "campaignId", "adGroupId",
          "keywordId", "keyword" // <-- “keyword”, not “keywordText”
        ],
        format: "GZIP_JSON",
      },
    };

    const headers: Record<string,string> = {
      Authorization: `Bearer ${access_token}`,
      "Amazon-Advertising-API-ClientId": LWA_CLIENT_ID,
      "Amazon-Advertising-API-Scope": cred.profile_id,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    // Create report
    const created = await fetchJSON(`${host}/reporting/reports`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    const reportId = created?.reportId;
    if (!reportId) throw new Error("no-report-id");

    // Poll (up to ~10 minutes)
    let status = "PENDING";
    let downloadUrl: string | null = null;
    for (let i = 0; i < 100; i++) {
      const r = await fetchJSON(`${host}/reporting/reports/${reportId}`, { headers });
      status = (r?.status || "").toUpperCase();
      if ((status === "SUCCESS" || status === "COMPLETED") && r?.location) {
        downloadUrl = r.location;
        break;
      }
      if (status === "FAILURE") throw new Error("report-failure");
      await sleep(Math.min(15, i + 1) * 1000);
    }

    if (!downloadUrl) return NextResponse.json({ ok: false, reason: "timeout", reportId, status });

    // Download, parse, map → DB
    const dl = await fetch(downloadUrl);
    const buf = Buffer.from(await dl.arrayBuffer());
    const text = gunzipSync(buf).toString("utf-8");
    const data = parseRows(text);

    const rows = (data as any[])
      .map((r: any) => ({
        user_id: user_id!,
        day: String(r.date || "").slice(0, 10),
        campaign_id: r.campaignId?.toString?.() || null,
        ad_group_id: r.adGroupId?.toString?.() || null,
        keyword_text: r.keyword ?? null,      // map “keyword” → keyword_text
        search_term: r.searchTerm ?? null,
        match_type: r.matchType ?? null,
        impressions: Number(r.impressions ?? 0),
        clicks: Number(r.clicks ?? 0),
        cost: Number(r.cost ?? 0),
        orders: Number(r.purchases14d ?? 0),
        sales: Number(r.sales14d ?? 0),
      }))
      .filter((r) => r.search_term && r.keyword_text);

    if (rows.length) {
      await supabaseAdmin
        .from("ads_search_terms")
        .upsert(rows, {
          onConflict: "user_id,day,campaign_id,ad_group_id,keyword_text,search_term",
        });
    }

    return NextResponse.json({ ok: true, rows: rows.length, reportId });
  } catch (e: any) {
    console.error("searchterms sync error:", e?.message || e);
    return NextResponse.json({ ok: false, reason: "error", details: e?.message || String(e) });
  }
}
