import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // get user_id from query (since auth cookie not included in direct URL test)
    const u = new URL(req.url);
    const user_id = u.searchParams.get("user_id");

    if (!user_id) {
      return NextResponse.json({
        ok: false,
        reason: "missing-user-id (add ?user_id=YOUR_USER_ID)"
      });
    }

    // check profile info
    const { data: profileRow } = await supabaseAdmin
      .from("user_profiles")
      .select("ads_profile_id, ads_region")
      .eq("user_id", user_id)
      .maybeSingle();

    // count tables
    const { count: stCount } = await supabaseAdmin
      .from("ads_search_terms")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user_id);

    const { count: campCount } = await supabaseAdmin
      .from("ads_campaigns")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user_id);

    return NextResponse.json({
      ok: true,
      user_id,
      profile_id: profileRow?.ads_profile_id ?? null,
      region: profileRow?.ads_region ?? null,
      counts: {
        search_terms: stCount ?? 0,
        campaigns: campCount ?? 0
      }
    });
  } catch (e: any) {
    console.error("ads/health fail:", e?.message || e);
    return NextResponse.json({ ok: false, reason: "error" });
  }
}
