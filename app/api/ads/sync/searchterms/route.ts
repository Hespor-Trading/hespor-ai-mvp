// app/api/ads/sync/searchterms/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { adsHostFor } from "@/lib/ads/hosts";
import { refreshAdsToken } from "@/lib/ads/tokens";
import { getSupabaseServer } from "@/lib/supabaseServer";
import * as zlib from "zlib";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Cred = {
  access_token: string | null;
  refresh_token: string;
  region: string | null;
  profile_id: string;
  expires_at: string | null;
};

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}

async function createReport(host: string, headers: Record<string, string>, start: string, end: string) {
  // Variant A (most common): groupBy=query, columns include query/keywordText
  const a = await fetch(`${host}/v3/reports`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: "sp_search_terms",
      startDate: start,
      endDate: end,
      configuration: {
        adProduct: "SPONSORED_PRODUCTS",
        groupBy: ["query"],
        columns: [
          "date",
          "campaignId",
          "adGroupId",
          "query",
          "keywordText",
          "matchType",
          "impressions",
          "clicks",
          "cost",
          "purchases14d",
          "sales14d"
        ]
      },
      reportTypeId: "spSearchTerm",
      timeUnit: "DAILY",
      format: "GZIP_JSON"
    }),
  });
  if (a.ok) return { ok: true as const, res: await a.json() };

  const aText = await a.text().catch(() => "");

  // Variant B (fallback some accounts use): groupBy=searchTerm, columns use searchTerm/targetingExpression
  const b = await fetch(`${host}/v3/reports`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: "sp_search_terms",
      startDate: start,
      endDate: end,
      configuration: {
        adProduct: "SPONSORED_PRODUCTS",
        groupBy: ["searchTerm"],
        columns: [
          "date",
          "campaignId",
          "adGroupId",
          "searchTerm",
          "targetingExpression",
          "matchType",
          "impressions",
          "clicks",
          "cost",
          "purchases14d",
          "sales14d"
        ]
      },
      reportTypeId: "spSearchTerm",
      timeUnit: "DAILY",
      format: "GZIP_JSON"
    }),
  });
  if (b.ok) return { ok: true as const, res: await b.json() };

  const bText = await b.text().catch(() => "");
  return {
    ok: false as const,
    statusA: a.status,
    detailA: aText,
    statusB: b.status,
    detailB: bText,
  };
}

export async function POST(req: Request) {
  try {
    // Resolve user (cookie OR headless)
    const cookieSb = getSupabaseServer();
    const { data: { user } } = await cookieSb.auth.getUser();

    const url = new URL(req.url);
    const debug = url.searchParams.get("debug") === "1";
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const user_id: string | undefined =
      user?.id || body.user_id || url.searchParams.get("user_id") || undefined;
    const days = Number(body.days || url.searchParams.get("days") || 30);

    if (!user_id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    // Service-role client
    const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supa = createClient(sbUrl, sbKey, { auth: { persistSession: false } });

    // Load creds
    const { data: cred, error: credErr } = await supa
      .from("amazon_ads_credentials")
      .select("access_token, refresh_token, region, profile_id, expires_at")
      .eq("user_id", user_id)
      .not("profile_id", "is", null)
      .single<Cred>();

    if (credErr || !cred) {
      return NextResponse.json({ ok: false, error: "no_creds_or_profile" }, { status: 400 });
    }

    // Refresh LWA if expired
    let accessToken = cred.access_token;
    const exp = cred.expires_at ? Date.parse(cred.expires_at) : 0;
    if (!accessToken || exp <= Date.now()) {
      const t = await refreshAdsToken(cred.refresh_token);
      const expires_at = new Date(Date.now() + t.expires_in * 1000).toISOString();
      await supa.from("amazon_ads_credentials")
        .update({ access_token: t.access_token, expires_at })
        .eq("user_id", user_id);
      accessToken = t.access_token;
    }

    // Build & create report
    const host = adsHostFor(cred.region || "na");
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Amazon-Advertising-API-ClientId":
        process.env.ADS_LWA_CLIENT_ID || process.env.NEXT_PUBLIC_ADS_LWA_CLIENT_ID || "",
      "Amazon-Advertising-API-Scope": cred.profile_id,
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    const start = iso(new Date(Date.now() - days * 86400000));
    const end = iso(new Date());

    const created = await createReport(host, headers, start, end);
    if (!created.ok) {
      const payload = {
        ok: false,
        error: "create_report",
        variantA_status: created.statusA,
        variantA_detail: created.detailA,
        variantB_status: created.statusB,
        variantB_detail: created.detailB,
      };
      return NextResponse.json(debug ? payload : { ok: false, error: "create_report" }, { status: 502 });
    }

    const { reportId } = created.res as any;

    // Poll for completion
    let location = "";
    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 2000));
      const st = await fetch(`${host}/v3/reports/${reportId}`, { headers });
      if (!st.ok) {
        const txt = await st.text().catch(() => "");
        return NextResponse.json(
          debug ? { ok: false, error: "poll_failed", status: st.status, detail: txt } : { ok: false, error: "poll_failed" },
          { status: 502 }
        );
      }
      const j = await st.json();
      if (j.status === "SUCCESS") { location = j.location; break; }
      if (j.status === "FAILURE") {
        return NextResponse.json({ ok: false, error: "report_failed", detail: j }, { status: 502 });
      }
    }
    if (!location) return NextResponse.json({ ok: false, error: "timeout" }, { status: 504 });

    // Download + parse
    const dl = await fetch(location);
    if (!dl.ok) {
      const txt = await dl.text().catch(() => "");
      return NextResponse.json({ ok: false, error: "download_failed", status: dl.status, detail: txt }, { status: 502 });
    }
    const gz = Buffer.from(await dl.arrayBuffer());
    const raw = zlib.gunzipSync(gz).toString("utf8");
    const rows = JSON.parse(raw) as any[];

    // Upsert
    const mapped = rows.map((r) => ({
      user_id,
      profile_id: cred.profile_id,
      day: r.date,
      campaign_id: String(r.campaignId ?? ""),
      ad_group_id: String(r.adGroupId ?? ""),
      keyword_text: String(r.keywordText ?? r.targetingExpression ?? ""),
      search_term: String(r.query ?? r.searchTerm ?? ""),
      match_type: String(r.matchType ?? ""),
      impressions: Number(r.impressions ?? 0),
      clicks: Number(r.clicks ?? 0),
      cost: Number(r.cost ?? 0) / 1_000_000,   // micro → $
      orders: Number(r.purchases14d ?? 0),
      sales: Number(r.sales14d ?? 0) / 1_000_000,
    }));

    if (mapped.length) {
      await supa.from("ads_search_terms").upsert(mapped, {
        onConflict: "user_id,profile_id,day,campaign_id,ad_group_id,search_term",
      });
    }

    return NextResponse.json({ ok: true, rows: mapped.length });
  } catch (e: any) {
    console.error("searchterms sync error", e);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
