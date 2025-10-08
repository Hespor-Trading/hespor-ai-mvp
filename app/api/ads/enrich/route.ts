import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TokenRow = {
  user_id?: string;
  refresh_token?: string | null;
  lwa_refresh_token?: string | null;
  token_type?: string | null;
  access_token?: string | null;
  expires_at?: string | number | null;
};

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
  try {
    const json = JSON.parse(text || "{}");
    if (!res.ok) {
      throw new Error(json.error_description || json.message || `HTTP ${res.status}`);
    }
    return json;
  } catch (e: any) {
    // if not JSON, still throw useful info
    if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
    throw e;
  }
}

async function getRefreshTokenForUser(user_id: string): Promise<string | null> {
  // Try common table/column names in your project without breaking anything.
  // 1) ads_credentials(refresh_token)
  let q = await supabaseAdmin
    .from("ads_credentials")
    .select("refresh_token")
    .eq("user_id", user_id)
    .maybeSingle();
  if (q.data?.refresh_token) return q.data.refresh_token;

  // 2) amazon_ads_tokens(lwa_refresh_token)
  q = await supabaseAdmin
    .from("amazon_ads_tokens")
    .select("lwa_refresh_token")
    .eq("user_id", user_id)
    .maybeSingle() as any;
  if ((q as any).data?.lwa_refresh_token) return (q as any).data.lwa_refresh_token;

  // 3) ads_tokens(refresh_token)
  q = await supabaseAdmin
    .from("ads_tokens")
    .select("refresh_token")
    .eq("user_id", user_id)
    .maybeSingle();
  if (q.data?.refresh_token) return q.data.refresh_token;

  return null;
}

async function refreshAccessToken(refresh_token: string) {
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

  return String(json.access_token || "");
}

async function pickProfile(access_token: string): Promise<{ profileId: string; region: string } | null> {
  for (const { region, host } of REGION_HOSTS) {
    try {
      const profiles = await fetchJSON(`${host}/v2/profiles`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Amazon-Advertising-API-ClientId": LWA_CLIENT_ID,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (Array.isArray(profiles) && profiles.length) {
        // prefer "vendor" or "seller" active profile; otherwise first
        const active =
          profiles.find((p: any) => p.accountInfo?.marketplaceStringId && p.profileId) ||
          profiles[0];
        if (active?.profileId) {
          return { profileId: String(active.profileId), region };
        }
      }
    } catch (e) {
      // try next region
    }
  }
  return null;
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const user_id = url.searchParams.get("user_id");

    if (!user_id) {
      return NextResponse.json({ ok: false, reason: "missing-user-id" }, { status: 200 });
    }
    if (!LWA_CLIENT_ID || !LWA_CLIENT_SECRET) {
      return NextResponse.json({ ok: false, reason: "missing-lwa-env" }, { status: 200 });
    }

    // 1) Get user's LWA refresh token
    const refresh_token = await getRefreshTokenForUser(user_id);
    if (!refresh_token) {
      return NextResponse.json({ ok: false, reason: "no-refresh-token-for-user" }, { status: 200 });
    }

    // 2) Get short-lived access token
    const access_token = await refreshAccessToken(refresh_token);
    if (!access_token) {
      return NextResponse.json({ ok: false, reason: "token-refresh-failed" }, { status: 200 });
    }

    // 3) Ask Ads API for available profiles (try NA → EU → FE)
    const picked = await pickProfile(access_token);
    if (!picked) {
      return NextResponse.json({ ok: false, reason: "no-profiles-returned" }, { status: 200 });
    }

    // 4) Save to your profile table
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
    return NextResponse.json({ ok: false, reason: "error", details: e?.message || String(e) }, { status: 200 });
  }
}
