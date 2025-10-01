import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Amazon Ads (LWA) – send user to consent screen.
 * Uses Vercel env names you already have: ADS_LWA_CLIENT_ID, AMZN_ADS_REDIRECT
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const brand = url.searchParams.get("brand") || "default";

  const clientId = process.env.ADS_LWA_CLIENT_ID!;
  const redirect = process.env.AMZN_ADS_REDIRECT!;

  if (!clientId || !redirect) {
    return NextResponse.json(
      { error: "missing_env", message: "ADS_LWA_CLIENT_ID or AMZN_ADS_REDIRECT missing" },
      { status: 500 }
    );
  }

  const scope = encodeURIComponent("advertising::campaign_management");
  const auth = new URL("https://www.amazon.com/ap/oa");
  auth.searchParams.set("client_id", clientId);
  auth.searchParams.set("scope", scope);
  auth.searchParams.set("response_type", "code");
  auth.searchParams.set("redirect_uri", redirect);
  auth.searchParams.set("state", brand);

  return NextResponse.redirect(auth.toString());
}
