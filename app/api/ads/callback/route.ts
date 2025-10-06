import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

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

  // 2) Try to fetch first profile id (non-fatal if it fails)
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

  // 3) Save to Supabase (force execution + catch DB errors)
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL("/auth/sign-in?next=/connect", req.url));
  }

  const { error: upsertError } = await supabase
    .from("amazon_ads_credentials")
    .upsert(
      {
        user_id: user.id,
        profile_id: profileId || null,
        access_token: token.access_token,
      },
      { onConflict: "user_id" }
    )
    .select(); // <- ensure statement executes and returns an error if any

  if (upsertError) {
    console.error("Supabase upsert error:", upsertError);
    return NextResponse.redirect(new URL("/connect?error=save_failed", req.url));
  }

  // 4) Done → dashboard
  return NextResponse.redirect(new URL("/dashboard", req.url));
}
