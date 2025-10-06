import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";

type LwaTokenResponse = {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
};

function redirectWith(reqUrl: string, path: string, reason: string) {
  const u = new URL(path, reqUrl);
  u.searchParams.set("error", reason);
  return NextResponse.redirect(u);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const err = url.searchParams.get("error");

  if (err) return redirectWith(req.url, "/connect", `amazon_${err}`);
  if (!code) return redirectWith(req.url, "/connect", "missing_code");

  // --- 1) Exchange code for tokens (Login With Amazon)
  const client_id =
    process.env.ADS_LWA_CLIENT_ID ||
    process.env.NEXT_PUBLIC_ADS_CLIENT_ID ||
    "";

  const client_secret =
    process.env.ADS_LWA_CLIENT_SECRET ||
    process.env.SP_LWA_CLIENT_SECRET ||
    "";

  const redirect_uri =
    process.env.ADS_REDIRECT_URI ||
    process.env.NEXT_PUBLIC_ADS_REDIRECT_URI ||
    "https://app.hespor.com/api/ads/callback";

  if (!client_id || !client_secret) {
    return redirectWith(req.url, "/connect", "missing_ads_env");
  }

  const tokenBody = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id,
    client_secret,
    redirect_uri,
  });

  let token: LwaTokenResponse;
  try {
    const r = await fetch("https://api.amazon.com/auth/o2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: tokenBody,
    });
    if (!r.ok) throw new Error(await r.text());
    token = (await r.json()) as LwaTokenResponse;
  } catch (e: any) {
    console.error("LWA token exchange failed:", e?.message || e);
    return redirectWith(req.url, "/connect", "token_exchange_failed");
  }

  // --- 2) (Best effort) Fetch first Advertising profile id
  const ADS_API_BASE = process.env.ADS_API_BASE || "https://advertising-api.amazon.com";
  let profileId = "";
  try {
    const rp = await fetch(`${ADS_API_BASE}/v2/profiles`, {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        "Amazon-Advertising-API-ClientId": client_id,
        Accept: "application/json",
      },
    });
    if (rp.ok) {
      const profiles = (await rp.json()) as Array<{ profileId?: number | string }>;
      profileId = profiles?.[0]?.profileId?.toString() || "";
    }
  } catch (e) {
    console.warn("Profiles fetch failed (non-fatal):", e);
  }

  // --- 3) Identify signed-in Hespor user (cookie session)
  const authed = createRouteHandlerClient({ cookies });
  const { data: { user }, error: userErr } = await authed.auth.getUser();
  if (userErr || !user) {
    return redirectWith(req.url, "/auth/sign-in?next=/connect", "no_user");
  }

  // --- 4) Persist credentials with SERVICE ROLE (bypasses any policy)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!supabaseUrl || !serviceKey) {
    return redirectWith(req.url, "/connect", "missing_service_role");
  }

  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  const { error: upsertError } = await admin
    .from("amazon_ads_credentials")
    .upsert(
      {
        user_id: user.id,
        profile_id: profileId || null,
        access_token: token.access_token,
      },
      { onConflict: "user_id" }
    );

  if (upsertError) {
    console.error("Supabase upsert error:", upsertError);
    return redirectWith(req.url, "/connect", "save_failed");
  }

  // Double-check row now exists before leaving (guards that read-after-write)
  const { data: rows, error: readErr } = await admin
    .from("amazon_ads_credentials")
    .select("user_id")
    .eq("user_id", user.id)
    .limit(1);

  if (readErr || !rows || rows.length === 0) {
    console.error("Post-upsert read failed:", readErr);
    return redirectWith(req.url, "/connect", "verify_failed");
  }

  // --- 5) Success → dashboard
  return NextResponse.redirect(new URL("/dashboard", req.url));
}
