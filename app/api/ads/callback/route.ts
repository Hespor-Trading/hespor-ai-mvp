import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

type LwaTokenResponse = {
  access_token: string;
  refresh_token?: string;
  token_type: "bearer" | string;
  expires_in: number;
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  // If Amazon returns an error (e.g., user declined)
  if (!code || error) {
    return NextResponse.redirect(new URL("/connect?error=amazon_oauth", req.url));
  }

  // ---- 1) Exchange code for tokens (Login With Amazon) ----
  const client_id =
    process.env.ADS_LWA_CLIENT_ID ||
    process.env.NEXT_PUBLIC_ADS_CLIENT_ID || ""; // fallback

  const client_secret =
    process.env.SP_LWA_CLIENT_SECRET ||
    process.env.ADS_LWA_CLIENT_SECRET || ""; // support either name you may have

  const redirect_uri =
    process.env.ADS_REDIRECT_URI ||
    process.env.NEXT_PUBLIC_ADS_REDIRECT_URI ||
    "https://app.hespor.com/api/ads/callback";

  if (!client_id || !client_secret) {
    // Missing envs – bail gracefully
    return NextResponse.redirect(
      new URL("/connect?error=missing_ads_env", req.url)
    );
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
    if (!r.ok) {
      const msg = await r.text();
      throw new Error(`LWA token exchange failed: ${msg}`);
    }
    token = (await r.json()) as LwaTokenResponse;
  } catch (e) {
    console.error(e);
    return NextResponse.redirect(
      new URL("/connect?error=token_exchange_failed", req.url)
    );
  }

  // ---- 2) Fetch one advertising profile (to know which profile_id to store) ----
  const ADS_API_BASE =
    process.env.ADS_API_BASE || "https://advertising-api.amazon.com";
  // If you need a region, set AMAZON_ADS_REGION env and route to the right host.
  // This generic endpoint lists profiles accessible by the token:
  // https://advertising-api.amazon.com/v2/profiles
  let profileId = "";
  try {
    const rp = await fetch(`${ADS_API_BASE}/v2/profiles`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token.access_token}`,
        "Amazon-Advertising-API-ClientId": client_id,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });
    if (rp.ok) {
      const profiles = (await rp.json()) as Array<{ profileId?: number | string }>;
      profileId = profiles?.[0]?.profileId?.toString() || "";
    }
  } catch (e) {
    // Not fatal; continue without a profile id
    console.warn("Fetching profiles failed:", e);
  }

  // ---- 3) Upsert into Supabase ----
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    // Not signed in – send them to sign-in (preserving that they just connected Ads)
    return NextResponse.redirect(
      new URL("/auth/sign-in?next=/connect", req.url)
    );
  }

  // Your table columns from the screenshot: user_id (uuid), brand (text), profile_id (text), access_token (text)
  // We’ll upsert by user_id. (RLS is disabled per your screenshot.)
  try {
    await supabase
      .from("amazon_ads_credentials")
      .upsert(
        {
          user_id: user.id,
          profile_id: profileId || null,
          access_token: token.access_token,
          // NOTE: if you later add a refresh_token column, also store token.refresh_token here.
          // brand is unknown at connect-time, so we leave it null.
        },
        { onConflict: "user_id" }
      );
  } catch (e) {
    console.error("Supabase upsert error:", e);
    return NextResponse.redirect(new URL("/connect?error=save_failed", req.url));
  }

  // ---- 4) Redirect to dashboard (as requested) ----
  return NextResponse.redirect(new URL("/dashboard", req.url));
}
