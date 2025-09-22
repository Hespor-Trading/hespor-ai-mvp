import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const clientId = process.env.ADS_CLIENT_ID!;
  const redirect = process.env.ADS_REDIRECT_URI!;
  const scope = encodeURIComponent("advertising::campaign_management");
  const url = `https://www.amazon.com/ap/oa?client_id=${clientId}&scope=${scope}&response_type=code&redirect_uri=${encodeURIComponent(redirect)}`;
  return NextResponse.redirect(url);
}
