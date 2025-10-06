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

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const err = url.searchParams.get("error");

  if (!code || err) {
    return NextResponse.redirect(new URL("/connect?error=amazon_oauth", req.url));
  }

  // 1) LWA token exchange
  const client_id =
    process.env.ADS_LWA_CLIENT_ID ||
    process.env.NEXT_PUBLIC_ADS_CLIENT_ID || "";

  const client_secret =
    process.env.ADS_LWA_CLIENT_SECRET ||
    process.env.SP_LWA_CLIENT_SECRET || "";

  const redirect_uri =
    process.env.ADS_REDIRECT_URI ||
    process.env.NEXT_PUBLIC_ADS_REDIRECT_URI ||
    "https://app.hespor.com/api/ads/callback";

  if (!client_id || !client_secret) {
    return NextResponse.redirect(new URL("/connect?error=missing_ads_env", req.url));
  }

  const body = new URLSearchParams({
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
      body,
    });
    if (!r.ok) throw new Error(await r.text());
    token = (await r.json()) as LwaTokenResponse;
  } catch (e) {
    console.error("LWA token exchange failed:", e);
    return NextResponse.redirect(new URL("/connect?error=token_exchange_failed", req.url));
  }

  // 2) Try to fetch first profile id (non-fatal)
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
    console.warn("Fetching profiles failed (non-fatal):", e);
  }

  // 3) Identify the signed-in user via cookie auth
  const userClient = createRouteHandlerClient({ cookies });
  const { data: { user }, error: userErr } = await userClient.auth.getUser();
  if (userErr || !user) {
    return NextResponse.redirect(new URL("/auth/sign-in?next=/connect", req.url));
  }

  // 4) Use ADMIN client for the DB write (guaranteed upsert)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  const { error: upsertError } = await admin
    .from("amazon_ads_credentials")
    .upsert(
      {
        user_id: user.id,                   // uuid
        profile_id: profileId || null,      // text
        access_token: token.access_token,   // text
        // brand: null // leave as-is; your column is nullable
      },
      { onConflict: "user_id" }
    );

  if (upsertError) {
    console.error("Supabase upsert error:", upsertError);
    return NextResponse.redirect(new URL("/connect?error=save_failed", req.url));
  }

  // 5) Redirect to dashboard
  return NextResponse.redirect(new URL("/dashboard", req.url));
}
