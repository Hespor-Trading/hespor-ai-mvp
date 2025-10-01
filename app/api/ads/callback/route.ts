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

function getBrand(u: URL) {
  return u.searchParams.get("state") || "default";
}

async function exchangeCodeForTokens(code: string) {
  const clientId = process.env.ADS_LWA_CLIENT_ID!;
  const clientSecret = process.env.ADS_LWA_CLIENT_SECRET!;
  const redirect = process.env.AMZN_ADS_REDIRECT!;

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
    throw new Error(`LWA token exchange failed: ${text}`);
  }
  return res.json() as Promise<{
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
  }>;
}

async function upsertSecret(name: string, value: string) {
  // Try read – if exists, put new version; else create
  try {
    await sm.send(new GetSecretValueCommand({ SecretId: name }));
    await sm.send(new PutSecretValueCommand({ SecretId: name, SecretString: value }));
  } catch {
    await sm.send(new CreateSecretCommand({ Name: name, SecretString: value }));
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const brand = getBrand(url);

    if (!code) {
      throw new Error("Missing code");
    }

    const tokens = await exchangeCodeForTokens(code);

    // Save per-brand in Secrets Manager
    const secretName = `amazon-ads/credentials/${brand}`;
    await upsertSecret(secretName, JSON.stringify(tokens));

    const res = NextResponse.redirect(new URL(`/dashboard?brand=${brand}`, url.origin));
    // Drop a small signal cookie for the UI
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
    const url = new URL(req.url);
    const brand = getBrand(url);
    return NextResponse.redirect(
      new URL(
        `/connect?error=${encodeURIComponent(err?.message || "ads_callback_error")}&brand=${brand}`,
        url.origin
      )
    );
  }
}
