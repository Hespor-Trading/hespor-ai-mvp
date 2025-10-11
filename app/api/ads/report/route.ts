import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { gunzipSync } from "zlib";

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
function tryGunzipToText(buf: Buffer): string {
  try {
    return gunzipSync(buf).toString("utf-8");
  } catch {
    return buf.toString("utf-8");
  }
}
function parseRows(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return [];
  // Some endpoints return JSON Lines; others return a JSON array.
  if (trimmed.startsWith("[")) {
    try { return JSON.parse(trimmed); } catch { return []; }
  }
  return trimmed.split(/\r?\n/).filter(Boolean).map((l) => {
    try { return JSON.parse(l); } catch { return null; }
  }).filter(Boolean);
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id") || "";
    const report_id = searchParams.get("report_id") || "";
    if (!user_id || !report_id) {
      return NextResponse.json({ ok: false, reason: "missing-params" }, { status: 400 });
    }
    if (!LWA_CLIENT_ID || !LWA_CLIENT_SECRET) {
      return NextResponse.json({ ok: false, reason: "missing-lwa-env" }, { status: 500 });
    }

    // Load creds for user
    const { data: creds, error } = await supabaseAdmin
      .from("amazon_ads_credentials")
      .select("refresh_token, profile_id, region")
      .eq("user_id", user_id)
      .maybeSingle();
    if (error) throw error;
    if (!creds?.refresh_token || !creds?.profile_id) {
      return NextResponse.json({ ok: false, reason: "missing-creds" }, { status: 400 });
    }

    const region = normalizeRegion(creds.region);
    const access_token = await refreshAccessToken(creds.refresh_token);
    const host = hostFor(region);

    // Check status
    const statusResp = await fetchJSON(`${host}/reporting/reports/${report_id}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Amazon-Advertising-API-ClientId": LWA_CLIENT_ID,
        "Amazon-Advertising-API-Scope": creds.profile_id,
        Accept: "application/json",
      },
    });

    const status: string = (statusResp?.status || "").toUpperCase();
    const downloadUrl: string | undefined = statusResp?.location || statusResp?.url;

    if (!(status === "SUCCESS" || status === "COMPLETED") || !downloadUrl) {
      return NextResponse.json({ ok: false, status: status || "PENDING", reportId: report_id });
    }

    // Download and parse
    const dl = await fetch(downloadUrl);
    const buf = Buffer.from(await dl.arrayBuffer());
    const text = tryGunzipToText(buf);
    const data = parseRows(text) as any[];

    // Map → DB rows (use "keyword" field; fallback to keywordText if present)
    const rows = data
      .map((r: any) => ({
        user_id,
        profile_id: creds.profile_id,
        day: String(r.date || "").slice(0, 10),
        campaign_id: r.campaignId?.toString?.() || null,
        ad_group_id: r.adGroupId?.toString?.() || null,
        keyword_text: (r.keyword ?? r.keywordText) ?? null,
        search_term: r.searchTerm ?? null,
        match_type: r.matchType ?? null,
        impressions: Number(r.impressions ?? 0),
        clicks: Number(r.clicks ?? 0),
        cost: Number(r.cost ?? 0),
        orders: Number(r.purchases14d ?? 0),
        sales: Number(r.sales14d ?? 0),
      }))
      .filter(
        (r: any) =>
          r.day && r.search_term && r.keyword_text && r.campaign_id && r.ad_group_id
      );

    if (rows.length) {
      await supabaseAdmin
        .from("ads_search_terms")
        .upsert(rows, {
          onConflict:
            "user_id,profile_id,day,campaign_id,ad_group_id,keyword_text,search_term",
        });
    }

    return NextResponse.json({ ok: true, rows: rows.length, reportId: report_id });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, reason: "error", details: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}
