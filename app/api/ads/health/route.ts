import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseServer();
    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr) throw userErr;

    const user_id = user?.id || null;
    if (!user_id) {
      return NextResponse.json({ ok: false, reason: "no-user" }, { status: 200 });
    }

    // pull profile + region if you stored them in user_profiles (adjust name if yours differs)
    const { data: profileRow } = await supabaseAdmin
      .from("user_profiles")
      .select("ads_profile_id, ads_region")
      .eq("user_id", user_id)
      .maybeSingle();

    const { data: stCount } = await supabaseAdmin
      .from("ads_search_terms")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user_id);

    const { data: campCount } = await supabaseAdmin
      .from("ads_campaigns")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user_id);

    return NextResponse.json({
      ok: true,
      user_id,
      profile_id: profileRow?.ads_profile_id ?? null,
      region: profileRow?.ads_region ?? null,
      counts: {
        search_terms: stCount?.length ?? 0,
        campaigns: campCount?.length ?? 0,
      },
    });
  } catch (e: any) {
    console.error("ads/health fail:", e?.message || e);
    return NextResponse.json({ ok: false, reason: "error" }, { status: 200 });
  }
}
