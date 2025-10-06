import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

const ADS_BASE = process.env.ADS_API_BASE || "https://advertising-api.amazon.com";
const CLIENT_ID =
  process.env.ADS_LWA_CLIENT_ID || process.env.NEXT_PUBLIC_ADS_CLIENT_ID || "";

function secondsFromNow(s: number) {
  return new Date(Date.now() + s * 1000).toISOString();
}

async function refreshAdsToken(refresh_token: string) {
  const client_id =
    process.env.ADS_LWA_CLIENT_ID || process.env.NEXT_PUBLIC_ADS_CLIENT_ID!;
  const client_secret =
    process.env.ADS_LWA_CLIENT_SECRET || process.env.SP_LWA_CLIENT_SECRET!;
  const r = await fetch("https://api.amazon.com/auth/o2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token,
      client_id,
      client_secret,
    }),
  });
  if (!r.ok) throw new Error(await r.text());
  return (await r.json()) as { access_token: string; expires_in: number };
}

export async function GET(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/auth/sign-in", req.url));

  // 1) Get current creds
  const { data: row, error } = await supabase
    .from("amazon_ads_credentials")
    .select("*")
    .eq("user_id", user.id)
    .single();
  if (error || !row) return NextResponse.redirect(new URL("/connect?error=no_creds", req.url));

  let access_token: string = row.access_token;
  let expires_at: string | null = row.expires_at ?? null;

  // 2) Refresh if expiring in <5m (or missing)
  const expSoon =
    !expires_at || new Date(expires_at).getTime() - Date.now() < 5 * 60 * 1000;

  if (expSoon && row.refresh_token) {
    try {
      const t = await refreshAdsToken(row.refresh_token);
      access_token = t.access_token;
      expires_at = secondsFromNow(t.expires_in);
      await supabase
        .from("amazon_ads_credentials")
        .update({ access_token, expires_at })
        .eq("user_id", user.id);
    } catch {
      // ignore; we'll still try enrich with existing token
    }
  }

  // 3) Pull profiles, pick default profile + region
  let profile_id = row.profile_id || "";
  let brand = row.brand || "";
  let region = row.region || "";

  try {
    const rp = await fetch(`${ADS_BASE}/v2/profiles`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Amazon-Advertising-API-ClientId": CLIENT_ID,
        Accept: "application/json",
      },
    });
    if (rp.ok) {
      const profiles = (await rp.json()) as Array<any>;
      // pick the default else first
      const p = profiles.find((x) => x?.accountInfo?.marketplaceStringId) || profiles[0];
      if (p) {
        profile_id = p.profileId?.toString() || profile_id;
        brand = p.accountInfo?.name || brand || "";
        const rid = (p.countryCode || p.accountInfo?.marketplaceStringId || "").toString().toUpperCase();
        region =
          rid.startsWith("US") || rid === "NA" ? "NA" :
          rid === "EU" || ["DE","FR","IT","ES","UK","SE","PL","NL","BE"].includes(rid) ? "EU" :
          rid === "FE" || ["JP","SG","AU","AE","SA","IN","TR","CN"].includes(rid) ? "FE" :
          region || "NA";
      }
    }
  } catch {
    // ignore enrich failure
  }

  // 4) Save enrichment (brand/profile/region/expires_at/access_token)
  await supabase
    .from("amazon_ads_credentials")
    .update({
      profile_id: profile_id || null,
      brand: brand || null,
      region: region || null,
      expires_at: expires_at || null,
      access_token,
    })
    .eq("user_id", user.id);

  // 5) Done
  return NextResponse.redirect(new URL("/dashboard", req.url));
}
