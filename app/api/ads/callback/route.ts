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
  } catch (e: any) {
    if (e?.name === "ResourceNotFoundException") {
      await sm.send(new CreateSecretCommand({ Name: name, SecretString: value }));
    } else {
      throw e;
    }
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

  const text = await res.text();
  if (!res.ok) throw new Error(`LWA token exchange failed (${res.status}): ${text}`);
  const data = JSON.parse(text);
  return data as {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
  };
}

export async function GET(req: NextRequest) {
  const u = new URL(req.url);
  const brand = u.searchParams.get("state") || "default";

  try {
    const code = u.searchParams.get("code");
    if (!code) throw new Error("missing_authorization_code");

    const tokens = await exchangeCodeForTokens(code);
    const secretName = `amazon-ads/credentials/${brand}`;
    await upsertSecret(secretName, JSON.stringify({ ...tokens, obtained_at: Date.now() }));

    // mark connected and go straight to dashboard after "Allow"
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
    const msg = err?.message || String(err);
    return NextResponse.redirect(new URL(`/connect?error=${encodeURIComponent(msg)}`, u.origin));
  }
}
