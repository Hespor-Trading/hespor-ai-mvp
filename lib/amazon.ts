// lib/amazon.ts
// Amazon Ads + SP-API OAuth helpers used by /api/* routes

type TokenResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  scope?: string;
};

// ---------------- Amazon Ads ----------------
const ADS_OAUTH_BASE =
  process.env.NEXT_PUBLIC_ADS_OAUTH_URL ||
  "https://www.amazon.com/ap/oa";
const ADS_TOKEN_URL =
  process.env.ADS_API_BASE?.replace(/\/$/, "") + "/auth/o2/token" ||
  "https://api.amazon.com/auth/o2/token";
const ADS_CLIENT_ID = process.env.AMZN_ADS_CLIENT_ID!;
const ADS_CLIENT_SECRET = process.env.AMZN_ADS_CLIENT_SECRET!;
const ADS_REDIRECT_URI = process.env.AMZN_ADS_REDIRECT_URL!;

export function buildAdsAuthUrl(state: string) {
  const u = new URL(ADS_OAUTH_BASE);
  u.searchParams.set("client_id", ADS_CLIENT_ID);
  u.searchParams.set("scope", "advertising::campaign_management");
  u.searchParams.set("response_type", "code");
  u.searchParams.set("redirect_uri", ADS_REDIRECT_URI);
  u.searchParams.set("state", state);
  return u.toString();
}

export async function exchangeAdsCode(code: string): Promise<TokenResponse> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: ADS_CLIENT_ID,
    client_secret: ADS_CLIENT_SECRET,
    redirect_uri: ADS_REDIRECT_URI,
  });
  const res = await fetch(ADS_TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!res.ok) throw new Error(`Ads token error ${res.status}: ${await res.text()}`);
  return res.json();
}

export async function refreshAdsToken(refresh_token: string): Promise<TokenResponse> {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token,
    client_id: ADS_CLIENT_ID,
    client_secret: ADS_CLIENT_SECRET,
  });
  const res = await fetch(ADS_TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!res.ok) throw new Error(`Ads refresh error ${res.status}: ${await res.text()}`);
  return res.json();
}

// ---------------- SP-API (Login with Amazon) ----------------
const SP_OAUTH_BASE =
  process.env.NEXT_PUBLIC_SP_OAUTH_URL ||
  "https://www.amazon.com/ap/oa";
const SP_TOKEN_URL = "https://api.amazon.com/auth/o2/token";
const SP_CLIENT_ID = process.env.SPAPI_CLIENT_ID!;
const SP_CLIENT_SECRET = process.env.SPAPI_CLIENT_SECRET!;
const SP_REDIRECT_URI = process.env.SPAPI_REDIRECT_URL || process.env.SPAPI_REDIRECT_UR!; // you had both keys

export function buildSpAuthUrl(state: string) {
  const u = new URL(SP_OAUTH_BASE);
  u.searchParams.set("client_id", SP_CLIENT_ID);
  u.searchParams.set("scope", "sellingpartnerapi::migration");
  u.searchParams.set("response_type", "code");
  u.searchParams.set("redirect_uri", SP_REDIRECT_URI);
  u.searchParams.set("state", state);
  return u.toString();
}

export async function exchangeSpCode(code: string): Promise<TokenResponse> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: SP_CLIENT_ID,
    client_secret: SP_CLIENT_SECRET,
    redirect_uri: SP_REDIRECT_URI,
  });
  const res = await fetch(SP_TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!res.ok) throw new Error(`SP token error ${res.status}: ${await res.text()}`);
  return res.json();
}
