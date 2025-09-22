import { NextRequest, NextResponse } from "next/server";
import { secrets } from "@/lib/aws";
import { brandFromQuery } from "@/lib/amazon";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// NOTE: SP-API partner central gives you the refresh token in redirect query param "spapi_oauth_code" -> you must exchange to LWA refresh token.
// Some setups return LWA refresh token directly. We persist what we get.
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const brand = brandFromQuery(url.search);
    const spCode = url.searchParams.get("spapi_oauth_code") || url.searchParams.get("lwa_refresh_token");
    if (!spCode) return NextResponse.json({ error: "Missing SP-API token/code" }, { status: 400 });

    const name = `amazon-sp/credentials/${brand}`;
    const payload = {
      SP_LWA_CLIENT_ID: process.env.SP_LWA_CLIENT_ID,
      SP_LWA_CLIENT_SECRET: process.env.SP_LWA_CLIENT_SECRET,
      SP_REFRESH_TOKEN: spCode, // store raw; your fetcher can use/exchange as needed
      SP_REGION: "na",
    };

    const sm = secrets();
    const Put = (await import("@aws-sdk/client-secrets-manager")).PutSecretValueCommand;
    const Create = (await import("@aws-sdk/client-secrets-manager")).CreateSecretCommand;

    await sm.send(new Put({ SecretId: name, SecretString: JSON.stringify(payload) })).catch(async (e: any) => {
      if (String(e?.name) === "ResourceNotFoundException") {
        await sm.send(new Create({ Name: name, SecretString: JSON.stringify(payload) }));
      } else throw e;
    });

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/connect?sp=ok&brand=${brand}`);
  } catch (e: any) {
    return NextResponse.json({ error: "SP-API callback failed", detail: String(e?.message || e) }, { status: 500 });
  }
}
