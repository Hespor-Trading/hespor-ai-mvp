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

function back(reqUrl: string, reason: string) {
  const u = new URL("/connect", reqUrl);
  u.searchParams.set("error", reason);
  return NextResponse.redirect(u);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const err = url.searchParams.get("error");

  if (err) return back(req.url, `amazon_${err}`);
  if (!code) return back(req.url, "missing_code");

  // 1) Exchange auth code for LWA access token
  const client_id =
    process.env.ADS_LWA_CLIENT_ID ||
    process.env.NEXT_PUBLIC_ADS_CLIENT_ID || "";
  const client_secret =
    process.env.ADS_LWA_CLIENT_SECRET ||
    process.env.SP_LWA_CLIENT_SECRET || "";
  const redirect_uri =
    process.env.ADS_REDIRECT_URI ||
    process.env.NEXT_PUBLIC_ADS_REDIRECT_URI ||
    "https://app.hespor.com/api/ads/callback";

  if (!client_id || !client_secret) return back(req.url, "missing_ads_env");

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
    });
    if (!r.ok) throw new Error(await r.text());
    token = (await r.json()) as LwaTokenResponse;
  } catch (e) {
    console.error("token_exchange_failed:", e);
    return back(req.url, "token_exchange_failed");
  }

  // 2) Best-effort: fetch a profile id (not required to save credentials)
  const ADS_API_BASE = process.env.ADS_API_BASE || "https://advertising-api.amazon.com";
  let profileId = "";
  try {
    const rp = await fetch(`${ADS_API_BASE}/v2/profiles`, {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        "Amazon-Advertising-API-ClientId": client_id,
        Accept: "application/json",
      },
    });
    if (rp.ok) {
      const profiles = (await rp.json()) as Array<{ profileId?: number | string }>;
      profileId = profiles?.[0]?.profileId?.toString() || "";
    }
  } catch (e) {
    console.warn("profiles_fetch_warn:", e);
  }

  // 3) Identify the signed-in Hespor user (from cookie session)
  const authed = createRouteHandlerClient({ cookies });
  const { data: { user } } = await authed.auth.getUser();
  if (!user) return back(req.url, "no_user");

  // 4) Write credentials with the SERVICE ROLE (admin) and harden the write
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!supabaseUrl || !serviceKey) return back(req.url, "missing_service_role");

  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  // Try UPSERT first
  let writeOk = false;
  const row = {
    user_id: user.id,
    profile_id: profileId || null,
    access_token: token.access_token,
  };

  try {
    const { error: upsertErr } = await admin
      .from("amazon_ads_credentials")
      .upsert(row, { onConflict: "user_id" });
    if (!upsertErr) writeOk = true;
    else {
      console.warn("upsert_warn:", upsertErr?.message);
    }
  } catch (e) {
    console.warn("upsert_throw:", e);
  }

  // If UPSERT didn’t work (e.g., no unique constraint), do delete + insert
  if (!writeOk) {
    try {
      await admin.from("amazon_ads_credentials").delete().eq("user_id", user.id);
      const { error: insErr } = await admin.from("amazon_ads_credentials").insert(row);
      if (insErr) {
        console.error("insert_failed:", insErr);
        return back(req.url, "save_failed");
      }
      writeOk = true;
    } catch (e) {
      console.error("delete_insert_throw:", e);
      return back(req.url, "save_failed");
    }
  }

  // Verify row exists to avoid read-after-write race
  try {
    const { data: rows, error: readErr } = await admin
      .from("amazon_ads_credentials")
      .select("user_id")
      .eq("user_id", user.id)
      .limit(1);
    if (readErr || !rows || rows.length === 0) {
      console.error("verify_failed:", readErr);
      return back(req.url, "verify_failed");
    }
  } catch (e) {
    console.error("verify_throw:", e);
    return back(req.url, "verify_failed");
  }

  // 5) Success → dashboard
  return NextResponse.redirect(new URL("/dashboard", req.url));
}
