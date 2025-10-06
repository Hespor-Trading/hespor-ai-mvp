import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";

type LwaTokenResponse = {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
};

// small helper to always point back to /connect with a short reason + hint
function back(reqUrl: string, reason: string, why?: string) {
  const u = new URL("/connect", reqUrl);
  u.searchParams.set("error", reason);
  if (why) u.searchParams.set("why", why.slice(0, 180)); // keep it short
  return NextResponse.redirect(u);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const err = url.searchParams.get("error");

  if (err) return back(req.url, `amazon_${err}`);
  if (!code) return back(req.url, "missing_code");

  // 1) Exchange auth code → LWA token
  const client_id =
    process.env.ADS_LWA_CLIENT_ID || process.env.NEXT_PUBLIC_ADS_CLIENT_ID || "";
  const client_secret =
    process.env.ADS_LWA_CLIENT_SECRET || process.env.SP_LWA_CLIENT_SECRET || "";
  const redirect_uri =
    process.env.ADS_REDIRECT_URI ||
    process.env.NEXT_PUBLIC_ADS_REDIRECT_URI ||
    "https://app.hespor.com/api/ads/callback";

  if (!client_id || !client_secret) {
    return back(req.url, "missing_ads_env", "client_id/client_secret not set");
  }

  let token: LwaTokenResponse;
  try {
    const r = await fetch("https://api.amazon.com/auth/o2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id,
        client_secret,
        redirect_uri,
      }),
      cache: "no-store",
    });
    if (!r.ok) {
      const body = await r.text();
      throw new Error(`HTTP ${r.status} ${r.statusText} – ${body}`);
    }
    token = (await r.json()) as LwaTokenResponse;
  } catch (e: any) {
    console.error("token_exchange_failed:", e);
    return back(req.url, "token_exchange_failed", String(e?.message || e));
  }

  // 2) Try to read a profile id (non-fatal)
  const ADS_API_BASE =
    process.env.ADS_API_BASE || "https://advertising-api.amazon.com";
  let profileId = "";
  try {
    const rp = await fetch(`${ADS_API_BASE}/v2/profiles`, {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        "Amazon-Advertising-API-ClientId": client_id,
        Accept: "application/json",
      },
      cache: "no-store",
    });
    if (rp.ok) {
      const profiles = (await rp.json()) as Array<{ profileId?: number | string }>;
      profileId = profiles?.[0]?.profileId?.toString() || "";
    }
  } catch (e) {
    console.warn("profiles_fetch_warn:", e);
  }

  // 3) Current signed-in Hespor user
  const authed = createRouteHandlerClient({ cookies });
  const { data: { user }, error: userErr } = await authed.auth.getUser();
  if (userErr) {
    console.error("getUser error:", userErr);
  }
  if (!user) return back(req.url, "no_user", "no Supabase session at callback");

  // 4) Admin client (SERVICE ROLE) – write credential
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!supabaseUrl || !serviceKey) {
    return back(req.url, "missing_service_role", "check SUPABASE_* envs");
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  // NOTE: your table has UNIQUE(user_id) now.
  const row = {
    user_id: user.id,
    profile_id: profileId || null,
    access_token: token.access_token,
  };

  // Force execution and surface any DB error text in `why`
  const { error: upsertError } = await admin
    .from("amazon_ads_credentials")
    .upsert(row, { onConflict: "user_id" })
    .select(); // forces execution

  if (upsertError) {
    console.error("upsert_failed:", upsertError);
    return back(
      req.url,
      "save_failed",
      `${upsertError.code || ""} ${upsertError.message || "DB upsert failed"}`
    );
  }

  // 5) Done → dashboard
  const next = new URL("/dashboard", req.url);
  return NextResponse.redirect(next);
}
