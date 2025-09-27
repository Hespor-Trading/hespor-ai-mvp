import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state"); // we set this to userId
  if (!code) return NextResponse.redirect(new URL("/connect?err=no_code", req.url));

  // 1) exchange auth code → tokens (LWA)
  const tokenRes = await fetch("https://api.amazon.com/auth/o2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: process.env.ADS_LWA_CLIENT_ID!,
      client_secret: process.env.ADS_LWA_CLIENT_SECRET!,
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://app.hespor.com"}/api/ads/callback`,
    }),
  });
  if (!tokenRes.ok) {
    return NextResponse.redirect(new URL("/connect?err=token_exchange_failed", req.url));
  }
  const tokens = await tokenRes.json(); // { access_token, refresh_token, expires_in, ... }

  // 2) read user from session OR fallback to state (userId)
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id ?? state;
  if (!userId) return NextResponse.redirect(new URL("/auth/sign-in?from=ads", req.url));

  // (Optional) pick a brand label; you can change this to a real brand picker later
  const brand = "default";

  // 3) upsert into DB
  // expires_at: now + tokens.expires_in seconds
  const expiresAt = new Date(Date.now() + (tokens.expires_in ?? 3600) * 1000).toISOString();

  await supabase.from("amazon_ads_credentials").upsert({
    user_id: userId,
    brand,
    profile_id: null, // you can populate later by calling Profiles list
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_at: expiresAt,
    region: "na",
  }, { onConflict: "user_id,brand" });

  // 4) back to /connect
  return NextResponse.redirect(new URL("/connect?ads=ok", req.url));
}
