import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.hespor.com";

  if (error) {
    return NextResponse.redirect(`${base}/connect?ads=error&msg=${encodeURIComponent(error)}`);
  }
  if (!code) {
    return NextResponse.redirect(`${base}/connect?ads=error&msg=missing_code`);
  }

  // who is logged in?
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user }, error: uerr } = await supabase.auth.getUser();
  if (uerr || !user) {
    return NextResponse.redirect(`${base}/auth/sign-in?reason=no_user`);
  }

  try {
    // exchange auth code for tokens (LWA)
    const tokenRes = await fetch("https://api.amazon.com/auth/o2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: process.env.ADS_LWA_CLIENT_ID || "",
        client_secret: process.env.ADS_LWA_CLIENT_SECRET || "",
        redirect_uri: `${base}/api/ads/callback`,
      }),
    });

    if (!tokenRes.ok) {
      const t = await tokenRes.text();
      return NextResponse.redirect(`${base}/connect?ads=error&msg=${encodeURIComponent(t.slice(0,200))}`);
    }
    const tokens = await tokenRes.json() as {
      access_token: string;
      refresh_token: string;
      expires_in: number;
      token_type: string;
    };

    // save in Supabase
    const expiresAt = new Date(Date.now() + (tokens.expires_in ?? 3600) * 1000).toISOString();
    const { error: dberr } = await supabase
      .from("amazon_ads_credentials")
      .upsert({
        user_id: user.id,
        brand: "default",
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: expiresAt,
        region: "na",
      });

    if (dberr) {
      return NextResponse.redirect(`${base}/connect?ads=error&msg=${encodeURIComponent(dberr.message)}`);
    }

    return NextResponse.redirect(`${base}/connect?ads=ok`);
  } catch (e: any) {
    return NextResponse.redirect(`${base}/connect?ads=error&msg=${encodeURIComponent(e?.message || "exception")}`);
  }
}
