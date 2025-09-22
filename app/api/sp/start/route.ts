import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const appId = process.env.SP_APP_ID!;
  const redirect = process.env.SP_REDIRECT_URI!;
  const url = `https://sellercentral.amazon.com/apps/authorize/consent?application_id=${encodeURIComponent(appId)}&state=hespor&redirect_uri=${encodeURIComponent(redirect)}`;
  return NextResponse.redirect(url);
}
