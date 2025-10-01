import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Make sure we NEVER double-encode scope/redirect
function sanitizeScope(input?: string) {
  const raw = (input || "advertising::campaign_management").trim();
  // If someone put a pre-encoded value (contains %), decode once.
  const once = raw.includes("%") ? decodeURIComponent(raw) : raw;
  // Collapse internal whitespace to a single space (Amazon allows space-separated scopes)
  return once.replace(/\s+/g, " ");
}

function resolveRedirect() {
  const fromEnv =
    process.env.AMZN_ADS_REDIRECT ||
    process.env.ADS_REDIRECT_URI ||
    "";
  if (fromEnv) return fromEnv; // must be plain, unencoded

  const base = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "";
  return base ? `${base}/api/ads/callback` : "";
}

export async function GET(request: Request) {
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
  auth.searchParams.set("scope", scope);              // NOT encoded beforehand
  auth.searchParams.set("response_type", "code");
  auth.searchParams.set("redirect_uri", redirect);    // NOT encoded beforehand
  // keep it simple (no brand/state to avoid surprises)
  return NextResponse.redirect(auth.toString());
}
