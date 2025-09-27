// lib/amazon.ts
import { createClient } from "@supabase/supabase-js";

const LWA_TOKEN_URL = "https://api.amazon.com/auth/o2/token";

/** ---- Tokens: UPSERTS INTO SUPABASE ---- **/
export async function upsertAdsTokens({
  userId, brand = "DECOGAR", access_token, refresh_token, expires_in, region = "na"
}: {
  userId: string;
  brand?: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  region?: string;
}) {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const expires_at = new Date(Date.now() + expires_in * 1000).toISOString();

  await sb.from("amazon_ads_credentials").upsert({
    user_id: userId,
    brand,
    access_token,
    refresh_token,
    expires_at,
    region,
  });
}

export async function upsertSpTokens({
  userId, brand = "DECOGAR", refresh_token, region = "na"
}: {
  userId: string;
  brand?: string;
  refresh_token: string;
  region?: string;
}) {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  await sb.from("spapi_credentials").upsert({
    user_id: userId,
    brand,
    refresh_token,
    region,
  });
}

/** ---- LWA CODE EXCHANGES ---- **/
export async function exchangeAdsCode(code: string, redirectUri: string) {
  const res = await fetch(LWA_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body:
      `grant_type=authorization_code` +
      `&code=${encodeURIComponent(code)}` +
      `&client_id=${encodeURIComponent(process.env.AMAZON_ADS_CLIENT_ID!)}` +
      `&client_secret=${encodeURIComponent(process.env.AMAZON_ADS_CLIENT_SECRET!)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}`
  });
  if (!res.ok) throw new Error(`Ads token exchange failed: ${res.status}`);
  return res.json() as Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
  }>;
}

export async function exchangeSpCode(spapi_oauth_code: string, redirectUri: string) {
  const res = await fetch(LWA_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body:
      `grant_type=authorization_code` +
      `&code=${encodeURIComponent(spapi_oauth_code)}` +
      `&client_id=${encodeURIComponent(process.env.SP_LWA_CLIENT_ID!)}` +
      `&client_secret=${encodeURIComponent(process.env.SP_LWA_CLIENT_SECRET!)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}`
  });
  if (!res.ok) throw new Error(`SP token exchange failed: ${res.status}`);
  return res.json() as Promise<{
    refresh_token: string;
    access_token?: string;
    expires_in?: number;
  }>;
}

/** ---- Helper expected by legacy routes ---- **/
/**
 * Extracts the brand from URL search (supports string or URLSearchParams).
 * Defaults to DECOGAR (your primary tenant).
 */
export function brandFromQuery(
  input: URLSearchParams | string | null | undefined
): string {
  if (!input) return "DECOGAR";
  let sp: URLSearchParams;
  if (typeof input === "string") {
    sp = new URLSearchParams(input.startsWith("?") ? input.slice(1) : input);
  } else {
    sp = input;
  }
  const b =
    sp.get("brand") ||
    sp.get("tenant") ||
    sp.get("b");

  // Keep your canonical S3/tenant case. Change here if you add more brands.
  const brand = (b || "DECOGAR").trim();
  return brand.toUpperCase() === "DECOGAR" ? "DECOGAR" : brand;
}
