import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LWA_CLIENT_ID = process.env.ADS_LWA_CLIENT_ID || process.env.NEXT_PUBLIC_ADS_LWA_CLIENT_ID || "";
const LWA_CLIENT_SECRET = process.env.ADS_LWA_CLIENT_SECRET || "";

const REGION_HOSTS = [
  { region: "NA", host: "https://advertising-api.amazon.com" },
  { region: "EU", host: "https://advertising-api-eu.amazon.com" },
  { region: "FE", host: "https://advertising-api-fe.amazon.com" },
];

async function fetchJSON(url: string, init?: RequestInit) {
  const res = await fetch(url, init);
  const text = await res.text();
  let json: any = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {}
  if (!res.ok) {
    throw new Error(json.error_description || json.message || `HTTP ${res.status}: ${text}`);
  }
  return json;
}

async function getRefreshTokenForUser(user_id: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin
    .from("amazon_ads_credentials")
    .select("refresh_token")
    .eq("user_id", user_id)
    .maybeSingle();
  if (error) console.error("Token query error:", error.message);
  return data?.refresh_token || null;
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

async function pickProfile(access_token: string): Promise<{ profileId: string; region: string } | null> {
  for (const { region, host } of REGION_HOSTS) {
    try {
      const profiles = await fetchJSON(`${host}/v2/profiles`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Amazon-Advertising-API-ClientId": LWA_CLIENT_ID,
          Accept: "application/json",
        },
      });
      if (Array.isArray(profiles) && profiles.length) {
        const chosen =
          profiles.find((p: any) => p.accountInfo?.marketplaceStringId && p.profileId) || profiles[0];
        if (chosen?.profileId) {
          return { profileId: String(chosen.profileId), region };
        }
      }
    } catch {
      /* try next region */
    }
  }
  return null;
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const user_id = url.searchParams.get("user_id");

    if (!user_id) return NextResponse.json({ ok: false, reason: "missing-user-id" });
    if (!LWA_CLIENT_ID || !LWA_CLIENT_SECRET)
      return NextResponse.json({ ok: false, reason: "missing-lwa-env" });

    // 1️⃣ get refresh token
    const refresh_token = await getRefreshTokenForUser(user_id);
    if (!refresh_token)
      return NextResponse.json({ ok: false, reason: "no-refresh-token-for-user" });

    // 2️⃣ refresh access token
    const access_token = await refreshAccessToken(refresh_token);

    // 3️⃣ get Amazon Ads profile info
    const picked = await pickProfile(access_token);
    if (!picked) return NextResponse.json({ ok: false, reason: "no-profiles-returned" });

    // 4️⃣ save to user_profiles
    await supabaseAdmin
      .from("user_profiles")
      .upsert(
        {
          user_id,
          ads_profile_id: picked.profileId,
          ads_region: picked.region,
        },
        { onConflict: "user_id" }
      );

    return NextResponse.json({ ok: true, profile_id: picked.profileId, region: picked.region });
  } catch (e: any) {
    console.error("Enrich error:", e?.message || e);
    return NextResponse.json({ ok: false, reason: "error", details: e?.message || String(e) });
  }
}
