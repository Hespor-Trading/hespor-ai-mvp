// app/api/ads/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { SecretsManagerClient, GetSecretValueCommand, CreateSecretCommand, PutSecretValueCommand } from "@aws-sdk/client-secrets-manager";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// --- helpers --------------------------------------------------------------

function parseBrand(url: URL) {
  const b = url.searchParams.get("brand");
  // Temporary default for testing so you don't need to pass brand each time
  return (b && b.trim()) || "DECOGAR";
}

async function exchangeAuthCodeForTokens(code: string) {
  const res = await fetch("https://api.amazon.com/auth/o2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: process.env.ADS_CLIENT_ID!,
      client_secret: process.env.ADS_CLIENT_SECRET!,
      redirect_uri: process.env.ADS_REDIRECT_URI!,
    }),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`ADS token exchange failed: ${res.status} ${res.statusText} ${txt}`);
  }
  return res.json() as Promise<{
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
    scope?: string;
  }>;
}

const sm = new SecretsManagerClient({ region: process.env.AWS_REGION || "us-west-2" });

async function upsertSecret(name: string, valueObj: Record<string, any>) {
  // Try get; if not found -> create; else put new version
  try {
    await sm.send(new GetSecretValueCommand({ SecretId: name }));
    await sm.send(new PutSecretValueCommand({ SecretId: name, SecretString: JSON.stringify(valueObj) }));
  } catch (err: any) {
    if (err?.name === "ResourceNotFoundException") {
      await sm.send(new CreateSecretCommand({ Name: name, SecretString: JSON.stringify(valueObj) }));
    } else {
      throw err;
    }
  }
}

// Build the canonical Hespor Ads secret object.
// (We store profile_id/region if you already know them; you can fill later via your provisioner.)
function buildAdsSecret(existing: any, refresh_token: string) {
  return {
    client_id: process.env.ADS_CLIENT_ID!,
    client_secret: process.env.ADS_CLIENT_SECRET!,
    refresh_token,
    profile_id: existing?.profile_id || "2819081650104503", // safe default for DECOGAR; replace per-tenant later
    api_region: existing?.api_region || "na",
  };
}

// --- route ---------------------------------------------------------------

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const brand = parseBrand(url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state") || "";

    if (!code) {
      return NextResponse.redirect(new URL(`/connect?error=missing_code&brand=${brand}`, url.origin));
    }

    // 1) Exchange code for tokens (we only need the refresh_token for long-term)
    const tokens = await exchangeAuthCodeForTokens(code);
    if (!tokens?.refresh_token) {
      throw new Error("No refresh_token returned by Amazon Ads.");
    }

    // 2) Upsert the per-brand Ads credentials in Secrets Manager
    const secretName = `amazon-ads/credentials/${brand}`;
    // Fetch existing to preserve profile_id/api_region if you’ve set them before
    let existing: any = null;
    try {
      const got = await sm.send(new GetSecretValueCommand({ SecretId: secretName }));
      existing = got.SecretString ? JSON.parse(got.SecretString) : null;
    } catch (e) {
      // ignore not found
    }

    const toSave = buildAdsSecret(existing, tokens.refresh_token);
    await upsertSecret(secretName, toSave);

    // 3) Mark session via HttpOnly cookie so /dashboard can open with only Ads connected
    const res = NextResponse.redirect(new URL(`/dashboard?brand=${brand}`, url.origin));
    res.cookies.set({
      name: "ads_connected",
      value: "1",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      // session cookie is fine; if you want persistence add expires:
      // expires: new Date(Date.now() + 7*24*60*60*1000),
    });

    // Keep SP-API optional flag for UI (useful for badges on /connect)
    res.cookies.set({
      name: "spapi_connected",
      value: "0", // we'll flip to "1" when you wire /api/sp/callback
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
    });

    // Optional: preserve state if you used it
    if (state) {
      res.cookies.set({ name: "auth_state", value: state, httpOnly: true, sameSite: "lax", secure: true, path: "/" });
    }

    return res;
  } catch (err: any) {
    console.error("[/api/ads/callback] error", err);
    const url = new URL(req.url);
    const brand = url.searchParams.get("brand") || "DECOGAR";
    return NextResponse.redirect(new URL(`/connect?error=${encodeURIComponent(err?.message || "ads_callback_error")}&brand=${brand}`, url.origin));
  }
}
