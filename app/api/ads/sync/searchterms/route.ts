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
  if (!res.ok) {
    const msg = (json && (json.detail || json.message)) || `HTTP ${res.status}: ${text}`;
    const err: any = new Error(msg);
    err.status = res.status;
    err.text = text;
    err.json = json;
    throw err;
  }
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

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const user_id = url.searchParams.get("user_id");
    const days = Math.max(7, Math.min(60, parseInt(url.searchParams.get("days") || "30", 10)));
    const force = (url.searchParams.get("force") || "").toLowerCase(); // "", "new"
    if (!user_id) return NextResponse.json({ ok: false, reason: "missing-user-id" });

    const cred = await getCred(user_id);
    const access_token = await refreshAccessToken(cred.refresh_token);
    const host = hostFor(cred.region);

    const since = new Date(Date.now() - days * 86400000);
    const startDate = since.toISOString().slice(0, 10);
    const endDate = new Date().toISOString().slice(0, 10);

    const baseName = `sp-search-term-${startDate}-${endDate}`;
    const name = force === "new" ? `${baseName}-${Date.now()}` : baseName;

    // ✅ confirmed working schema for your account (from last run)
    const createBody = {
      name,
      startDate,
      endDate,
      configuration: {
        adProduct: "SPONSORED_PRODUCTS",
        reportTypeId: "spSearchTerm",
        timeUnit: "DAILY",
        groupBy: ["searchTerm"],
        columns: ["date","searchTerm","impressions","clicks","cost","purchases14d","sales14d"],
        filters: [],
        format: "GZIP_JSON",
      },
    };

    const headers = {
      Authorization: `Bearer ${access_token}`,
      "Amazon-Advertising-API-ClientId": LWA_CLIENT_ID,
      "Amazon-Advertising-API-Scope": cred.profile_id,
      "Content-Type": "application/json",
      Accept: "application/json",
    } as Record<string, string>;

    let reportId: string | null = null;
    try {
      const created = await fetchJSON(`${host}/reporting/reports`, {
        method: "POST",
        headers,
        body: JSON.stringify(createBody),
      });
      reportId = created?.reportId?.toString?.() || null;
    } catch (e: any) {
      // Amazon duplicate error contains "... duplicate of : <reportId>"
      const m = (e?.message || e?.text || "").match(/duplicate of\s*:\s*([0-9a-f-]{20,})/i);
      if (m?.[1]) {
        reportId = m[1];
      } else {
        throw e;
      }
    }

    if (!reportId) throw new Error("no-report-id");

    // Poll up to ~180s with gentle backoff (1s → 6s)
    let status = "PENDING";
    let location: string | null = null;
    for (let i = 0; i < 60; i++) {
      const r = await fetchJSON(`${host}/reporting/reports/${reportId}`, { headers });
      status = r?.status;
      if (status === "SUCCESS" && r?.location) { location = r.location; break; }
      if (status === "FAILURE") throw new Error("report-failure");
      // backoff: 1,2,3,4,5,6 then stay at 6s
      const wait = Math.min(i + 1, 6) * 1000;
      await sleep(wait);
    }

    if (!location) {
      return NextResponse.json({ ok: false, reason: "timeout", reportId, status });
    }

    // Download & parse (gzipped JSON or NDJSON)
    const dl = await fetch(location);
    const buf = Buffer.from(await dl.arrayBuffer());
    const unz = gunzipSync(buf);
    const txt = unz.toString("utf-8").trim();
    const jsonRows: any[] = txt.startsWith("[")
      ? JSON.parse(txt)
      : txt.split(/\r?\n/).filter(Boolean).map(line => JSON.parse(line));

    // Upsert rows
    const rows = jsonRows.map((r: any) => ({
      user_id: user_id!,
      term: String(r.searchTerm || "").slice(0, 255),
      day: String(r.date || "").slice(0, 10),
      clicks: Number(r.clicks ?? 0),
      impressions: Number(r.impressions ?? 0),
      cost: Number(r.cost ?? 0),
      orders: Number(r.purchases14d ?? 0),
      sales: Number(r.sales14d ?? 0),
    })).filter(r => r.term && r.day);

    if (rows.length) {
      await supabaseAdmin.from("ads_search_terms").upsert(rows, { onConflict: "user_id,term,day" });
    }

    return NextResponse.json({ ok: true, rows: rows.length, reportId });
  } catch (e: any) {
    console.error("searchterms sync error:", e?.message || e);
    return NextResponse.json({ ok: false, reason: "error", details: e?.message || String(e) });
  }
}
