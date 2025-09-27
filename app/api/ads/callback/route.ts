import { NextResponse } from "next/server";
import { exchangeAdsCode, upsertAdsTokens } from "@/lib/amazon";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state"); // we passed userId here
  const error = url.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL("/connect?error=ads_denied", url.origin));
  }
  if (!code || !state) {
    return NextResponse.redirect(new URL("/connect?error=ads_missing_code", url.origin));
  }

  try {
    const redirectUri = process.env.AMAZON_ADS_REDIRECT!;
    const tok = await exchangeAdsCode(code, redirectUri);
    await upsertAdsTokens({
      userId: state,
      access_token: tok.access_token,
      refresh_token: tok.refresh_token,
      expires_in: tok.expires_in,
      region: process.env.AMAZON_ADS_REGION || "na",
    });

    // back to connect to finish SP-API
    return NextResponse.redirect(new URL("/connect?ads=ok", url.origin));
  } catch (e) {
    return NextResponse.redirect(new URL("/connect?error=ads_exchange_failed", url.origin));
  }
}
