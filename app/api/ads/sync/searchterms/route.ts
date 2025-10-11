import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LWA_CLIENT_ID =
  process.env.ADS_LWA_CLIENT_ID || process.env.NEXT_PUBLIC_ADS_LWA_CLIENT_ID || "";
const LWA_CLIENT_SECRET = process.env.ADS_LWA_CLIENT_SECRET || "";

function normalizeRegion(input?: string): "NA" | "EU" | "FE" {
  const r = (input || "").trim().toUpperCase();
  if (r === "NA" || r === "EU" || r === "FE") return r;
  throw new Error(`Unsupported region: ${input ?? "(empty)"}`);
}
function hostFor(region: "NA" | "EU" | "FE") {
  if (region === "EU") return "https://advertising-api-eu.amazon.com";
  if (region === "FE") return "https://advertising-api-fe.amazon.com";
  return "https://advertising-api.amazon.com";
}
async function fetchJSON(url: string, init?: RequestInit) {
  const res = await fetch(url, init);
  const txt = await res.text();
  let json: any = {};
  try { json = txt ? JSON.parse(txt) : {}; } catch {}
  if (!res.ok) throw new Error(json.error_description || json.message || `HTTP ${res.status}: ${txt}`);
  return json;
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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id") || "";
    const daysParam = Number(searchParams.get("days") || "30");
    if (!user_id) return NextResponse.json({ ok: false, reason: "missing-user" }, { status: 400 });
    if (!LWA_CLIENT_ID || !LWA_CLIENT_SECRET) return NextResponse.json({ ok: false, reason: "missing-lwa-env" }, { status: 500 });

    // Load creds (refresh_token, profile_id, region)
    const { data: creds, error } = await supabaseAdmin
      .from("amazon_ads_credentials")
      .select("refresh_token, profile_id, region")
      .eq("user_id", user_id)
      .maybeSingle();
    if (error) throw error;
    if (!creds?.refresh_token) return NextResponse.json({ ok: false, reason: "no-refresh-token-for-user" }, { status: 400 });
    if (!creds?.profile_id)   return NextResponse.json({ ok: false, reason: "no-profile-id" }, { status: 400 });

    const region = normalizeRegion(creds.region);
    const access_token = await refreshAccessToken(creds.refresh_token);
    const host = hostFor(region);

    // Date window (Amazon max 31 days)
    const end = new Date();
    const start = new Date();
    const days = Math.min(Math.max(Number.isFinite(daysParam) ? daysParam : 30, 1), 31);
    start.setUTCDate(end.getUTCDate() - (days - 1));
    const iso = (d: Date) => d.toISOString().slice(0, 10); // YYYY-MM-DD
    const startDate = iso(start);
    const endDate = iso(end);

    // Create report (DO NOT POLL HERE)
    const body = {
      name: `sp-search-term-${startDate}-${endDate}-${Date.now()}`,
      startDate,
      endDate,
      configuration: {
        adProduct: "SPONSORED_PRODUCTS",
        reportTypeId: "spSearchTerm",
        timeUnit: "DAILY",
        groupBy: ["searchTerm"], // allowed for this report
        columns: [
          "date",
          "searchTerm",
          "keyword",         // use new 'keyword' key (not keywordText)
          "matchType",
          "campaignId",
          "adGroupId",
          "impressions",
          "clicks",
          "cost",
          "purchases14d",
          "sales14d"
        ],
        format: "GZIP_JSON",
      },
    };

    const create = await fetchJSON(`${host}/reporting/reports`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Amazon-Advertising-API-ClientId": LWA_CLIENT_ID,
        "Amazon-Advertising-API-Scope": creds.profile_id,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    const reportId = String(create?.reportId || "");
    if (!reportId) return NextResponse.json({ ok: false, reason: "no-report-id" }, { status: 500 });

    // (Optional) record the request
    await supabaseAdmin.from("events").insert({
      user_id,
      type: "ads_searchterms_requested",
      payload: { reportId, startDate, endDate },
    });

    return NextResponse.json({ ok: true, reportId, startDate, endDate });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, reason: "error", details: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}
