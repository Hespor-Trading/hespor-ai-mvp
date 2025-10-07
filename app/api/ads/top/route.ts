import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function dateNDaysAgo(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

export async function GET(req: Request) {
  try {
    const supabase = getSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const url = new URL(req.url);
    const days = Number(url.searchParams.get("days") || 30);
    const since = dateNDaysAgo(days);

    const { data: rows, error } = await supabaseAdmin
      .from("ads_search_terms")
      .select("day,campaign_id,ad_group_id,search_term,clicks,cost,sales,orders")
      .eq("user_id", user.id)
      .gte("day", since)
      .limit(5000);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const termsAggMap = new Map<string, any>();
    const campAggMap = new Map<string, any>();

    for (const r of rows || []) {
      const key = (r.search_term || "").toLowerCase();
      const t = termsAggMap.get(key) || { search_term: r.search_term, clicks: 0, cost: 0, sales: 0, orders: 0 };
      t.clicks += Number(r.clicks || 0);
      t.cost += Number(r.cost || 0);
      t.sales += Number(r.sales || 0);
      t.orders += Number(r.orders || 0);
      termsAggMap.set(key, t);

      const ckey = String(r.campaign_id || "");
      const c = campAggMap.get(ckey) || { campaign_id: ckey, clicks: 0, cost: 0, sales: 0, orders: 0 };
      c.clicks += Number(r.clicks || 0);
      c.cost += Number(r.cost || 0);
      c.sales += Number(r.sales || 0);
      c.orders += Number(r.orders || 0);
      campAggMap.set(ckey, c);
    }

    const terms = Array.from(termsAggMap.values())
      .map(t => ({ ...t, acos: t.sales > 0 ? Number((t.cost / t.sales) * 100).toFixed(2) : null }))
      .sort((a,b) => (b.sales||0) - (a.sales||0))
      .slice(0, 50);

    const campaigns = Array.from(campAggMap.values())
      .map(c => ({ ...c, acos: c.sales > 0 ? Number((c.cost / c.sales) * 100).toFixed(2) : null }))
      .sort((a,b) => (b.sales||0) - (a.sales||0))
      .slice(0, 50);

    return NextResponse.json({ terms, campaigns, since });
  } catch (e:any) {
    console.error("ads/top error", e);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
