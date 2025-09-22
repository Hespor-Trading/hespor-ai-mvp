import { NextRequest, NextResponse } from "next/server";
import { secrets } from "@/lib/aws";
import { brandFromQuery } from "@/lib/amazon";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Exchange code for refresh token via Amazon Ads "Login With Amazon" token endpoint
async function exchange(code: string) {
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
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{ refresh_token: string; access_token: string; expires_in: number }>;
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });

    const brand = brandFromQuery(url.search);
    const token = await exchange(code);

    const name = `amazon-ads/credentials/${brand.toLowerCase()}`;
    const sm = secrets();

    // Create or update secret
    const payload = {
      client_id: process.env.ADS_CLIENT_ID,
      client_secret: process.env.ADS_CLIENT_SECRET,
      refresh_token: token.refresh_token,
      profile_id: "2819081650104503",
      api_region: process.env.ADS_REGION || "na",
    };

    // lazy create/update
    const put = await sm.send(
      new (await import("@aws-sdk/client-secrets-manager")).PutSecretValueCommand({
        SecretId: name,
        SecretString: JSON.stringify(payload),
      })
    ).catch(async (e: any) => {
      if (String(e?.name) === "ResourceNotFoundException") {
        return sm.send(
          new (await import("@aws-sdk/client-secrets-manager")).CreateSecretCommand({
            Name: name,
            SecretString: JSON.stringify(payload),
          })
        );
      }
      throw e;
    });

    console.log("Saved Ads credentials:", put?.$metadata?.httpStatusCode);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/connect?ads=ok&brand=${brand}`);
  } catch (e: any) {
    return NextResponse.json({ error: "Ads callback failed", detail: String(e?.message || e) }, { status: 500 });
  }
}
