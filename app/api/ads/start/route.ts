import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sanitizeScope(input?: string) {
  const raw = (input || "advertising::campaign_management").trim();
  const once = raw.includes("%") ? decodeURIComponent(raw) : raw;
  return once.replace(/\s+/g, " ");
}

function resolveRedirect() {
  const fromEnv = process.env.AMZN_ADS_REDIRECT || process.env.ADS_REDIRECT_URI || "";
  if (fromEnv) return fromEnv;
  const base = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "";
  return base ? `${base}/api/ads/callback` : "";
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const brand = url.searchParams.get("brand") || process.env.HESPOR_DEFAULT_BRAND || "default";
  const clientId = process.env.ADS_LWA_CLIENT_ID || "";
  const redirect = resolveRedirect();
  const scope = sanitizeScope(process.env.ADS_LWA_SCOPE);

  if (!clientId || !redirect) {
    return NextResponse.json(
      { error: "missing_env", message: "ADS_LWA_CLIENT_ID and AMZN_ADS_REDIRECT are required" },
      { status: 500 }
    );
  }

  const auth = new URL("https://www.amazon.com/ap/oa");
  auth.searchParams.set("client_id", clientId);
  auth.searchParams.set("scope", scope);
  auth.searchParams.set("response_type", "code");
  auth.searchParams.set("redirect_uri", redirect);
  auth.searchParams.set("state", brand); // pass brand through OAuth

  return NextResponse.redirect(auth.toString());
}
