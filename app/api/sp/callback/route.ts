import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const spCode = url.searchParams.get("spapi_oauth_code"); // Amazon SP-API returns this
  const sellingPartnerId = url.searchParams.get("selling_partner_id") || null;
  const error = url.searchParams.get("error");
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.hespor.com";

  if (error) {
    return NextResponse.redirect(`${base}/connect?sp=error&msg=${encodeURIComponent(error)}`);
  }
  if (!spCode) {
    return NextResponse.redirect(`${base}/connect?sp=error&msg=missing_spapi_oauth_code`);
  }

  // who is logged in?
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user }, error: uerr } = await supabase.auth.getUser();
  if (uerr || !user) {
    return NextResponse.redirect(`${base}/auth/sign-in?reason=no_user`);
  }

  try {
    // exchange SP-API code via LWA
    const tokenRes = await fetch("https://api.amazon.com/auth/o2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: spCode,
        client_id: process.env.SP_LWA_CLIENT_ID || "",
        client_secret: process.env.SP_LWA_CLIENT_SECRET || "",
        redirect_uri: `${base}/api/sp/callback`,
      }),
    });

    if (!tokenRes.ok) {
      const t = await tokenRes.text();
      return NextResponse.redirect(`${base}/connect?sp=error&msg=${encodeURIComponent(t.slice(0,200))}`);
    }
    const tokens = await tokenRes.json() as {
      access_token: string;
      refresh_token: string;
      expires_in: number;
      token_type: string;
    };

    const { error: dberr } = await supabase
      .from("spapi_credentials")
      .upsert({
        user_id: user.id,
        brand: "default",
        refresh_token: tokens.refresh_token,
        region: "na",
        // you can store sellingPartnerId if you want:
        // seller_id: sellingPartnerId,
      });

    if (dberr) {
      return NextResponse.redirect(`${base}/connect?sp=error&msg=${encodeURIComponent(dberr.message)}`);
    }

    return NextResponse.redirect(`${base}/connect?sp=ok`);
  } catch (e: any) {
    return NextResponse.redirect(`${base}/connect?sp=error&msg=${encodeURIComponent(e?.message || "exception")}`);
  }
}
