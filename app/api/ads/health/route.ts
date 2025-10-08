import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const user_id = url.searchParams.get("user_id");

    if (!user_id) {
      return NextResponse.json({ ok: false, reason: "missing-user-id" }, { status: 200 });
    }

    // ✅ Read profile_id + region from amazon_ads_credentials (your schema of record)
    const { data: cred, error: credErr } = await supabaseAdmin
      .from("amazon_ads_credentials")
      .select("profile_id, region")
      .eq("user_id", user_id)
      .maybeSingle();

    if (credErr) {
      return NextResponse.json({ ok: false, reason: "credentials-query-failed", details: credErr.message }, { status: 200 });
    }

    // Counts for data loaded
    const { count: stCount } = await supabaseAdmin
      .from("ads_search_terms")
      .select("*", { head: true, count: "exact" })
      .eq("user_id", user_id);

    const { count: campCount } = await supabaseAdmin
      .from("ads_campaigns")
      .select("*", { head: true, count: "exact" })
      .eq("user_id", user_id);

    return NextResponse.json({
      ok: true,
      user_id,
      profile_id: cred?.profile_id ?? null,
      region: cred?.region ?? null,
      counts: {
        search_terms: stCount ?? 0,
        campaigns: campCount ?? 0,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, reason: "error", details: e?.message || String(e) }, { status: 200 });
  }
}
