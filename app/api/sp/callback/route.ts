import { NextResponse } from "next/server";
import { exchangeSpCode, upsertSpTokens } from "@/lib/amazon";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("spapi_oauth_code");
  const state = url.searchParams.get("state"); // userId
  const error = url.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL("/connect?error=sp_denied", url.origin));
  }
  if (!code || !state) {
    return NextResponse.redirect(new URL("/connect?error=sp_missing_code", url.origin));
  }

  try {
    const redirectUri = process.env.SP_LWA_REDIRECT!;
    const tok = await exchangeSpCode(code, redirectUri);

    await upsertSpTokens({
      userId: state,
      refresh_token: tok.refresh_token,
      region: process.env.SP_REGION || "na",
    });

    // both done → light loading → dashboard
    return NextResponse.redirect(new URL("/loading", url.origin));
  } catch (e) {
    return NextResponse.redirect(new URL("/connect?error=sp_exchange_failed", url.origin));
  }
}
