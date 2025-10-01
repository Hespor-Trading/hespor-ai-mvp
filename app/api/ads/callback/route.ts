import { NextRequest, NextResponse } from "next/server";
import {
  SecretsManagerClient,
  CreateSecretCommand,
  PutSecretValueCommand,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REGION = process.env.AWS_REGION || "ca-central-1";
const sm = new SecretsManagerClient({ region: REGION });

async function upsertSecret(name: string, value: string) {
  try {
    await sm.send(new GetSecretValueCommand({ SecretId: name }));
    await sm.send(new PutSecretValueCommand({ SecretId: name, SecretString: value }));
    console.log("✅ Updated secret:", name);
  } catch {
    await sm.send(new CreateSecretCommand({ Name: name, SecretString: value }));
    console.log("✅ Created secret:", name);
  }
}

function readRedirect(): string {
  return (
    process.env.AMZN_ADS_REDIRECT ||
    process.env.ADS_REDIRECT_URI ||
    `${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || ""}/api/ads/callback`
  );
}

async function exchangeCodeForTokens(code: string) {
  const clientId = process.env.ADS_LWA_CLIENT_ID!;
  const clientSecret = process.env.ADS_LWA_CLIENT_SECRET!;
  const redirect = readRedirect();

  console.log("🔑 Exchanging code:", { code, redirect, clientId: clientId.slice(0,6) + "..." });

  const form = new URLSearchParams();
  form.set("grant_type", "authorization_code");
  form.set("code", code);
  form.set("redirect_uri", redirect);
  form.set("client_id", clientId);
  form.set("client_secret", clientSecret);

  const res = await fetch("https://api.amazon.com/auth/o2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("❌ LWA token exchange failed:", text);
    throw new Error(`LWA token exchange failed: ${text}`);
  }
  const data = await res.json();
  console.log("✅ Token exchange success:", Object.keys(data));
  return data;
}

export async function GET(req: NextRequest) {
  const now = Date.now();
  try {
    const u = new URL(req.url);
    const brand = u.searchParams.get("state") || "default";
    const code = u.searchParams.get("code");
    if (!code) {
      console.error("❌ Missing authorization code");
      throw new Error("Missing authorization code");
    }

    const tokens = await exchangeCodeForTokens(code);
    await upsertSecret(
      `amazon-ads/credentials/${brand}`,
      JSON.stringify({ ...tokens, obtained_at: now })
    );

    console.log("✅ Callback complete, redirecting to dashboard");
    const res = NextResponse.redirect(new URL(`/dashboard?brand=${brand}`, u.origin));
    res.cookies.set({
      name: "ads_connected",
      value: "1",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
    });
    return res;
  } catch (err: any) {
    console.error("❌ ADS CALLBACK ERROR:", err?.message || err);
    const u = new URL(req.url);
    const brand = u.searchParams.get("state") || "default";
    return NextResponse.redirect(
      new URL(`/connect?brand=${brand}&error=${encodeURIComponent(err?.message || "ads_callback_error")}`, u.origin)
    );
  }
}
