// app/api/ads/callback/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";

type LwaTokenResponse = {
  access_token: string;
  refresh_token?: string | null;
  token_type: string;
  expires_in: number | null;
};

function back(reqUrl: string, reason: string, why?: string) {
  const u = new URL("/connect", reqUrl);
  u.searchParams.set("error", reason);
  if (why) u.searchParams.set("why", encodeURIComponent(why));
  return NextResponse.redirect(u);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const err = url.searchParams.get("error");
  if (err) return back(req.url, `amazon_${err}`);
  if (!code) return back(req.url, "missing_code");

  // --- 1) Exchange auth code for LWA token ---
  const client_id =
    process.env.ADS_LWA_CLIENT_ID || process.env.NEXT_PUBLIC_ADS_CLIENT_ID || "";
  const client_secret =
    process.env.ADS_LWA_CLIENT_SECRET || process.env.SP_LWA_CLIENT_SECRET || "";
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
  } catch (e: any) {
    console.error("token_exchange_failed:", e);
    return back(req.url, "token_exchange_failed", String(e?.message ?? e));
  }

  // --- 2) Best-effort: fetch first profile id (not required to save) ---
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
    });
    if (rp.ok) {
      const profiles = (await rp.json()) as Array<{ profileId?: number | string }>;
      profileId = profiles?.[0]?.profileId?.toString() || "";
    }
  } catch (e) {
    console.warn("profiles_fetch_warn:", e);
  }

  // --- 3) Identify signed-in Hespor user from auth cookie ---
  const authed = createRouteHandlerClient({ cookies });
  const {
    data: { user },
  } = await authed.auth.getUser();
  if (!user) return back(req.url, "no_user");

  // --- 4) Service-role client (admin write) ---
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!supabaseUrl || !serviceKey) return back(req.url, "missing_service_role");

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  // --- 5) Fill 'brand' for NOT NULL column (best-effort) ---
  let brand = "";
  try {
    const { data: prof } = await admin
      .from("profiles")
      .select("amazon_brand,business_name")
      .eq("id", user.id)
      .single();
    brand = (prof?.amazon_brand || prof?.business_name || "").toString();
  } catch {
    // leave empty string if not found; satisfies NOT NULL if your schema requires it
  }

  // --- 6) Compute expires_at from expires_in (ISO string for timestamptz) ---
  const seconds = Number(token.expires_in ?? 0);
  const expiresAtIso = seconds > 0
    ? new Date(Date.now() + seconds * 1000).toISOString()
    : new Date(Date.now() + 3600 * 1000).toISOString(); // fallback 1h

  // --- 7) UPSERT credentials (now includes expires_at & refresh_token) ---
  const row = {
    user_id: user.id,
    brand,                                // ensure not-null brand column is satisfied
    profile_id: profileId || null,
    access_token: token.access_token,
    refresh_token: token.refresh_token ?? null,
    expires_at: expiresAtIso,
  };

  const { error: upsertErr } = await admin
    .from("amazon_ads_credentials")
    .upsert(row, { onConflict: "user_id" })
    .select(); // force execution and surface DB errors

  if (upsertErr) {
    console.error("save_failed:", upsertErr);
    return back(req.url, "save_failed", upsertErr.message);
  }

  // --- 8) Success → dashboard ---
  return NextResponse.redirect(new URL("/dashboard", req.url));
}
