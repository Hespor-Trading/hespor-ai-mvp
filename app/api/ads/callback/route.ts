// app/api/ads/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  SecretsManagerClient,
  GetSecretValueCommand,
  CreateSecretCommand,
  PutSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REGION = process.env.AWS_REGION || "ca-central-1";
const sm = new SecretsManagerClient({ region: REGION });

function brandFrom(url: URL) {
  const b = url.searchParams.get("brand");
  return (b && b.trim()) || "DECOGAR";
}

async function exchange(code: string) {
  const res = await fetch("https://api.amazon.com/auth/o2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: process.env.ADS_LWA_CLIENT_ID!,         // << your naming
      client_secret: process.env.ADS_LWA_CLIENT_SECRET!, // << your naming
      redirect_uri: process.env.AMZN_ADS_REDIRECT!,      // << your naming
    }),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`ADS token exchange failed: ${res.status} ${res.statusText} ${t}`);
  }
  return res.json() as Promise<{
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
    scope?: string;
  }>;
}

async function upsertSecret(name: string, obj: Record<string, any>) {
  try {
    await sm.send(new GetSecretValueCommand({ SecretId: name }));
    await sm.send(new PutSecretValueCommand({ SecretId: name, SecretString: JSON.stringify(obj) }));
  } catch (e: any) {
    if (e?.name === "ResourceNotFoundException") {
      await sm.send(new CreateSecretCommand({ Name: name, SecretString: JSON.stringify(obj) }));
    } else {
      throw e;
    }
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const brand = brandFrom(url);
    const code = url.searchParams.get("code");
    if (!code) {
      return NextResponse.redirect(new URL(`/connect?error=missing_code&brand=${brand}`, url.origin));
    }

    // 1) exchange code -> tokens
    const tokens = await exchange(code);
    if (!tokens?.refresh_token) throw new Error("No refresh_token returned from Amazon Ads.");

    // 2) upsert Secrets Manager: amazon-ads/credentials/{brand}
    const secretName = `amazon-ads/credentials/${brand}`;
    let existing: any = null;
    try {
      const got = await sm.send(new GetSecretValueCommand({ SecretId: secretName }));
      existing = got.SecretString ? JSON.parse(got.SecretString) : null;
    } catch {
      /* ignore not found */
    }

    const toSave = {
      client_id: process.env.ADS_LWA_CLIENT_ID!,
      client_secret: process.env.ADS_LWA_CLIENT_SECRET!,
      refresh_token: tokens.refresh_token,
      profile_id: existing?.profile_id || "2819081650104503", // your DECOGAR default; swap per-tenant later
      api_region: existing?.api_region || "na",
    };
    await upsertSecret(secretName, toSave);

    // 3) mark session → allow dashboard without SP-API
    const res = NextResponse.redirect(new URL(`/dashboard?brand=${brand}`, url.origin));
    res.cookies.set({ name: "ads_connected", value: "1", httpOnly: true, sameSite: "lax", secure: true, path: "/" });
    // keep SP optional for now
    res.cookies.set({ name: "spapi_connected", value: "0", httpOnly: true, sameSite: "lax", secure: true, path: "/" });
    return res;
  } catch (err: any) {
    console.error("[ads/callback] error", err);
    const url = new URL(req.url);
    const brand = brandFrom(url);
    return NextResponse.redirect(
      new URL(`/connect?error=${encodeURIComponent(err?.message || "ads_callback_error")}&brand=${brand}`, url.origin),
    );
  }
}
