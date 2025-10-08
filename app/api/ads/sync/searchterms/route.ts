import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { gunzipSync } from "zlib";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LWA_CLIENT_ID = process.env.ADS_LWA_CLIENT_ID || process.env.NEXT_PUBLIC_ADS_LWA_CLIENT_ID || "";
const LWA_CLIENT_SECRET = process.env.ADS_LWA_CLIENT_SECRET || "";

type Cred = { refresh_token: string; profile_id: string; region: string };

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
  if (!res.ok) throw new Error(json.error_description || json.message || `HTTP ${res.status}: ${text}`);
  return json;
}

async function getCred(user_id: string): Promise<Cred> {
  const { data, error } = await supabaseAdmin
    .from("amazon_ads_credentials")
    .select("refresh_token, profile_id, region")
    .eq("user_id", user_id)
    .maybeSingle();
  if (error || !data?.refresh_token || !data?.profile_id || !data?.region) {
    throw new Error("missing-ads-credentials-for-user");
  }
  return { refresh_token: data.refresh_token, profile_id: data.profile_id, region: data.region };
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

/**
 * Create + poll a v3 search term report for the last N days, then upsert to ads_search_terms.
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const user_id = url.searchParams.get("user_id");
    const days = Math.max(7, Math.min(60, parseInt(url.searchParams.get("days") || "30", 10)));

    if (!user_id) return NextResponse.json({ ok: false, reason: "missing-user-id" });

    const cred = await getCred(user_id);
    const access_token = await refreshAccessToken(cred.refresh_token);
    const host = hostFor(cred.region);

    // 1) Create report
    const since = new Date(Date.now() - days * 86400000);
    const startDate = since.toISOString().slice(0, 10);
    const endDate = new Date().toISOString().slice(0, 10);

    const createBody = {
      name: `sp-search-term-${startDate}-${endDate}`,
      startDate, endDate,
      configuration: {
        adProduct: "SPONSORED_PRODUCTS",
        groupBy: ["query"],
        columns: [
          "query",
          "impressions",
          "clicks",
          "cost",
          "attributedConversions14d",
          "attributedSales14d"
        ],
        reportTypeId: "spSearchTerm",
        timeUnit: "DAILY"
      }
    };

    const headers = {
      Authorization: `Bearer ${access_token}`,
      "Amazon-Advertising-API-ClientId": LWA_CLIENT_ID,
      "Amazon-Advertising-API-Scope": cred.profile_id,
      "Content-Type": "application/json",
      Accept: "application/json",
    } as Record<string, string>;

    const created = await fetchJSON(`${host}/reporting/reports`, {
      method: "POST",
      headers,
      body: JSON.stringify(createBody),
    });

    const reportId = created.reportId || created.reportId?.toString?.();
    if (!reportId) throw new Error("no-report-id");

    // 2) Poll for READY/SUCCESS (up to ~20s)
    let status = "PENDING";
    let location: string | null = null;

    for (let i = 0; i < 20; i++) {
      const r = await fetchJSON(`${host}/reporting/reports/${reportId}`, { headers });
      status = r.status;
      if (r.status === "SUCCESS" && r.location) { location = r.location; break; }
      if (r.status === "FAILURE") throw new Error("report-failure");
      await new Promise(res => setTimeout(res, 1000));
    }
    if (!location) return NextResponse.json({ ok: false, reason: "timeout-waiting-report", reportId, status });

    // 3) Download gzip + parse
    const dl = await fetch(location);
    const buf = Buffer.from(await dl.arrayBuffer());
    let jsonRows: any[] = [];
    try {
      const unz = gunzipSync(buf);
      const txt = unz.toString("utf-8").trim();

      // v3 often returns NDJSON; handle both JSON array and NDJSON
      if (txt.startsWith("[")) {
        jsonRows = JSON.parse(txt);
      } else {
        jsonRows = txt.split(/\r?\n/).filter(Boolean).map(line => JSON.parse(line));
      }
    } catch (e) {
      throw new Error("gzip-parse-failed");
    }

    // 4) Transform + upsert
    const rows = jsonRows.map((r: any) => {
      // flexible field names
      const term = r.query ?? r.searchTerm ?? r.keywordText ?? "";
      const day = (r.date ?? r.reportDate ?? r.startDate ?? "").toString().slice(0, 10);
      const clicks = Number(r.clicks ?? 0);
      const impressions = Number(r.impressions ?? 0);
      const cost = Number(r.cost ?? 0); // usually in micro currency? Amazon returns cost in full currency units for v3
      const orders = Number(r.attributedConversions14d ?? r.conversions ?? 0);
      const sales = Number(r.attributedSales14d ?? r.sales ?? 0);

      return {
        user_id,
        term: String(term || "").slice(0, 255),
        day,
        clicks,
        impressions,
        cost,
        orders,
        sales,
      };
    }).filter((r: any) => r.term && r.day);

    if (rows.length) {
      // Upsert by (user_id, term, day) if you have a unique index; otherwise plain insert
      await supabaseAdmin.from("ads_search_terms").upsert(rows, { onConflict: "user_id,term,day" });
    }

    return NextResponse.json({ ok: true, rows: rows.length, reportId });
  } catch (e: any) {
    console.error("searchterms sync error:", e?.message || e);
    return NextResponse.json({ ok: false, reason: "error", details: e?.message || String(e) });
  }
}
