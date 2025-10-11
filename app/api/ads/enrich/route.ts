import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LWA_CLIENT_ID =
  process.env.ADS_LWA_CLIENT_ID || process.env.NEXT_PUBLIC_ADS_LWA_CLIENT_ID || "";
const LWA_CLIENT_SECRET = process.env.ADS_LWA_CLIENT_SECRET || "";

const REGION_HOSTS = [
  { region: "NA", host: "https://advertising-api.amazon.com" },
  { region: "EU", host: "https://advertising-api-eu.amazon.com" },
  { region: "FE", host: "https://advertising-api-fe.amazon.com" },
];

function normalizeRegion(input?: string): "NA" | "EU" | "FE" {
  const r = (input || "").trim().toUpperCase();
  if (r === "NA" || r === "EU" || r === "FE") return r;
  throw new Error(`Unsupported region: ${input ?? "(empty)"}`);
}

async function fetchJSON(url: string, init?: RequestInit) {
  const res = await fetch(url, init);
  const txt = await res.text();
  let json: any = {};
  try { json = txt ? JSON.parse(txt) : {}; } catch {}
  if (!res.ok) throw new Error(json.error_description || json.message || `HTTP ${res.status}: ${txt}`);
  return json;
}

async function getRefreshTokenForUser(user_id: string): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from("amazon_ads_credentials")
    .select("refresh_token")
    .eq("user_id", user_id)
    .maybeSingle();
  return data?.refresh_token || null;
}

async function refreshAccessToken(refresh_token: string): Promise<string> {
  const body = new URLSearchParams();
  body.set("grant_type", "refresh_token");
  body.set("refresh_token", refresh_token);
  body.set("client_id", LWA_CLIENT_ID);
  body.set("client_secret", LWA_CLIENT_SECRET);
  const json = await fetchJSON("https://api.amazon.com/auth/o2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  return json.access_token;
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const user_id = url.searchParams.get("user_id");
    if (!user_id) return NextResponse.json({ ok: false, reason: "missing-user-id" });
    if (!LWA_CLIENT_ID || !LWA_CLIENT_SECRET) return NextResponse.json({ ok: false, reason: "missing-lwa-env" });

    const refresh_token = await getRefreshTokenForUser(user_id);
    if (!refresh_token) return NextResponse.json({ ok: false, reason: "no-refresh-token-for-user" });

    const access_token = await refreshAccessToken(refresh_token);

    // Probe profiles in NA → EU → FE until we find one.
    let profile_id: string | null = null;
    let region: "NA" | "EU" | "FE" | null = null;
    let brand: string | null = null;

    for (const { region: r, host } of REGION_HOSTS) {
      try {
        const profiles = await fetchJSON(`${host}/v2/profiles`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Amazon-Advertising-API-ClientId": LWA_CLIENT_ID,
            Accept: "application/json",
          },
        });

        if (Array.isArray(profiles) && profiles.length) {
          // pick the first SP-eligible profile if available, else first
          const picked =
            profiles.find((p: any) => p.profileId && p.accountInfo?.marketplaceStringId) ||
            profiles[0];

          if (picked?.profileId) {
            profile_id = String(picked.profileId);
            region = r as "NA" | "EU" | "FE";
            brand = picked.accountInfo?.name || picked.profileName || "EMPTY";
            break;
          }
        }
      } catch {
        // try next region
      }
    }

    if (!profile_id || !region) {
      return NextResponse.json({ ok: false, reason: "no-profiles-returned" });
    }

    // Store UPPERCASE region everywhere (source of truth)
    const regionUpper = normalizeRegion(region);

    await supabaseAdmin
      .from("amazon_ads_credentials")
      .update({
        profile_id,
        region: regionUpper,        // UPPERCASE
        brand: brand || "EMPTY",
      })
      .eq("user_id", user_id);

    // Ensure ads_profiles is populated so sync works without manual insert
    await supabaseAdmin
      .from("ads_profiles")
      .upsert(
        { user_id, profile_id, country: regionUpper }, // your table uses "country"
        { onConflict: "user_id" }
      );

    return NextResponse.json({ ok: true, user_id, profile_id, region: regionUpper, brand: brand || "EMPTY" });
  } catch (e: any) {
    console.error("Enrich error:", e?.message || e);
    return NextResponse.json({ ok: false, reason: "error", details: e?.message || String(e) });
  }
}
