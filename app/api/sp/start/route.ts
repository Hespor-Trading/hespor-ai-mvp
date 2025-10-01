import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Amazon SP-API consent – Seller Central
 * Env names aligned with your Vercel:
 *   SP_APP_ID, SP_LWA_CLIENT_ID, SP_LWA_CLIENT_SECRET, SP_REDIRECT_URI
 */
export async function GET(request: Request) {
  const u = new URL(request.url);
  const brand = u.searchParams.get("brand") || "default";

  const appId = process.env.SP_APP_ID!;
  const redirect = process.env.SP_REDIRECT_URI!;

  if (!appId || !redirect) {
    return NextResponse.json(
      { error: "missing_env", message: "SP_APP_ID or SP_REDIRECT_URI missing" },
      { status: 500 }
    );
  }

  // Seller Central consent URL
  const auth = new URL("https://sellercentral.amazon.com/apps/authorize/consent");
  auth.searchParams.set("application_id", appId);
  auth.searchParams.set("state", brand);
  auth.searchParams.set("redirect_uri", redirect);

  return NextResponse.redirect(auth.toString());
}
