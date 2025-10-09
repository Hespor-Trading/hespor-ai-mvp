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

function parseRows(text: string) {
  const trimmed = text.trim();
  const items: any[] = trimmed.startsWith("[")
    ? JSON.parse(trimmed)
    : trimmed.split(/\r?\n/).filter(Boolean).map(l => JSON.parse(l));
  return items;
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const user_id = url.searchParams.get("user_id");
    const report_id = url.searchParams.get("report_id");
    if (!user_id || !report_id) {
      return NextResponse.json({ ok: false, reason: "missing-user-or-report" });
    }

    const cred = await getCred(user_id);
    const access_token = await refreshAccessToken(cred.refresh_token);
    const host = hostFor(cred.region);
    const headers = {
      Authorization: `Bearer ${access_token}`,
      "Amazon-Advertising-API-ClientId": LWA_CLIENT_ID,
      "Amazon-Advertising-API-Scope": cred.profile_id,
      Accept: "application/json",
    } as Record<string, string>;

    const statusResp = await fetchJSON(`${host}/reporting/reports/${report_id}`, { headers });

    const status: string = (statusResp?.status || "").toUpperCase();
    const downloadUrl: string | undefined = statusResp?.location || statusResp?.url;

    if (!(status === "SUCCESS" || status === "COMPLETED") || !downloadUrl) {
      // Not ready yet
      return NextResponse.json({
        ok: false,
        status: status || "UNKNOWN",
        reportId: report_id,
        raw: statusResp,
      });
    }

    // Download gzip and parse
    const dl = await fetch(downloadUrl);
    const buf = Buffer.from(await dl.arrayBuffer());
    const text = gunzipSync(buf).toString("utf-8");
    const rowsJSON = parseRows(text);

    // Map to our table shape
    const rows = rowsJSON.map((r: any) => ({
      user_id,
      term: String(r.searchTerm || "").slice(0, 255),
      day: String(r.date || "").slice(0, 10),
      clicks: Number(r.clicks ?? 0),
      impressions: Number(r.impressions ?? 0),
      cost: Number(r.cost ?? 0),
      orders: Number(r.purchases14d ?? 0),
      sales: Number(r.sales14d ?? 0),
    })).filter(r => r.term && r.day);

    if (rows.length) {
      await supabaseAdmin
        .from("ads_search_terms")
        .upsert(rows, { onConflict: "user_id,term,day" });
    }

    return NextResponse.json({ ok: true, rows: rows.length, reportId: report_id });
  } catch (e: any) {
    console.error("report status error:", e?.message || e);
    return NextResponse.json({ ok: false, reason: "error", details: e?.message || String(e) });
  }
}
