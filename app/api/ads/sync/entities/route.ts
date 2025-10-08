import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LWA_CLIENT_ID = process.env.ADS_LWA_CLIENT_ID || process.env.NEXT_PUBLIC_ADS_LWA_CLIENT_ID || "";
const LWA_CLIENT_SECRET = process.env.ADS_LWA_CLIENT_SECRET || "";

type Cred = { refresh_token: string; profile_id: string; region: string };

function hostFor(region: string) {
  const r = (region || "na").toLowerCase();
  if (r === "eu") return "https://advertising-api-eu.amazon.com";
  if (r === "fe") return "https://advertising-api-fe.amazon.com";
  return "https://advertising-api.amazon.com"; // na
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

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const user_id = url.searchParams.get("user_id");
    if (!user_id) return NextResponse.json({ ok: false, reason: "missing-user-id" });

    const cred = await getCred(user_id);
    const access_token = await refreshAccessToken(cred.refresh_token);
    const host = hostFor(cred.region);

    // v2 campaigns list (SP)
    // stateFilter: enabled, paused, etc. We request all states to have a full snapshot.
    const campaigns = await fetchJSON(
      `${host}/v2/sp/campaigns?stateFilter=enabled,paused,archived`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Amazon-Advertising-API-ClientId": LWA_CLIENT_ID,
          "Amazon-Advertising-API-Scope": cred.profile_id,
          Accept: "application/json",
        },
      }
    );

    // Normalize and upsert
    const rows = (Array.isArray(campaigns) ? campaigns : []).map((c: any) => ({
      user_id,
      campaign_id: String(c.campaignId ?? c.campaign_id ?? ""),
      name: String(c.name ?? c.campaignName ?? ""),
      state: String(c.state ?? "").toLowerCase() || null,
      daily_budget: c.dailyBudget ?? null,
      start_date: c.startDate ?? null,
      end_date: c.endDate ?? null,
      targeting_type: c.targetingType ?? null,
    })).filter((r: any) => r.campaign_id);

    if (rows.length) {
      await supabaseAdmin
        .from("ads_campaigns")
        .upsert(rows, { onConflict: "user_id,campaign_id" });
    }

    return NextResponse.json({ ok: true, count: rows.length });
  } catch (e: any) {
    console.error("sync/entities error:", e?.message || e);
    return NextResponse.json({ ok: false, reason: "error", details: e?.message || String(e) });
  }
}
