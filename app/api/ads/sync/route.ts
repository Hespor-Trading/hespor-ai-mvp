import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const user_id = url.searchParams.get("user_id");
    const days = url.searchParams.get("days") || "30";
    if (!user_id) return NextResponse.json({ ok: false, reason: "missing-user-id" });

    const base = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "";
    const stRes = await fetch(`${base}/api/ads/sync/searchterms?user_id=${encodeURIComponent(user_id)}&days=${encodeURIComponent(days)}`);
    const searchterms = await stRes.json();

    return NextResponse.json({
      ok: searchterms?.ok === true,
      steps: { searchterms },
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, reason: "error", details: e?.message || String(e) });
  }
}
