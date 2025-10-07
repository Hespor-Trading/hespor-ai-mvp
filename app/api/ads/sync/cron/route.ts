import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Called by Vercel Cron once daily
export async function GET() {
  try {
    const { data: creds, error } = await supabaseAdmin
      .from("amazon_ads_credentials")
      .select("user_id")
      .not("profile_id", "is", null);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const base = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://localhost:3000";
    const searchURL = new URL("/api/ads/sync/searchterms", base).toString();

    const uniq = Array.from(new Set((creds || []).map(c => c.user_id))).filter(Boolean);

    const results: any[] = [];
    for (const uid of uniq) {
      const res = await fetch(searchURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: uid, days: 30 })
      });
      results.push({ user_id: uid, status: res.status });
    }

    return NextResponse.json({ ok: true, ran: results.length, results });
  } catch (e:any) {
    console.error("ads/sync/cron error", e);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
