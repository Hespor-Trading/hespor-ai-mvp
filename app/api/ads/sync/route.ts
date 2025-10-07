import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const supabase = getSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const days = Number(body?.days || 30);

    const base = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://localhost:3000";
    const entitiesURL = new URL("/api/ads/sync/entities", base).toString();
    const searchURL = new URL("/api/ads/sync/searchterms", base).toString();

    const [eRes, stRes] = await Promise.all([
      fetch(entitiesURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id })
      }),
      fetch(searchURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, days })
      })
    ]);

    const eJson = await eRes.json().catch(() => ({}));
    const stJson = await stRes.json().catch(() => ({}));

    const ok = eRes.ok && stRes.ok;
    return NextResponse.json({ ok, entities: eJson, searchterms: stJson });
  } catch (e:any) {
    console.error("ads/sync/all error", e);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
