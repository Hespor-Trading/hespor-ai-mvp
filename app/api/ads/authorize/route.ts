import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.ADS_CLIENT_ID!;
  const redirectUri = process.env.ADS_REDIRECT_URI!;
  const scope = "advertising::campaign_management";

  const authUrl = `https://www.amazon.com/ap/oa?client_id=${encodeURIComponent(
    clientId
  )}&scope=${encodeURIComponent(
    scope
  )}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}`;

  return NextResponse.redirect(authUrl);
}
