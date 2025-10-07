import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getSupabaseServer } from "@/lib/supabaseServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseRangeDays(range: string): number {
  const m = String(range || "").match(/^(\d+)d$/i);
  return m ? Math.max(1, parseInt(m[1], 10)) : 30;
}
const iso = (d: Date) => d.toISOString().slice(0, 10);

export async function GET(req: NextRequest) {
  const u = new URL(req.url);
  const range = u.searchParams.get("range") || "30d";
  const days = parseRangeDays(range);
  const since = iso(new Date(Date.now() - days * 86400000));
  const limit = Math.min(parseInt(u.searchParams.get("limit") || "25", 10), 100);

  // resolve user_id from session (or allow ?user_id= for server calls)
  let user_id: string | null = null;
  try {
    const supabase = getSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    user_id = user?.id ?? null;
  } catch { /* ignore */ }
  user_id = user_id || u.searchParams.get("user_id");

  if (!user_id) {
    return NextResponse.json({ items: [], period: range });
  }

  // Aggregate the last N days
  const { data, error } = await supabaseAdmin
    .from("ads_search_terms")
    .select("term, cost, sales, orders, clicks, impressions, day")
    .eq("user_id", user_id)
    .gte("day", since);

  if (error) {
    console.error("top terms error:", error);
    return NextResponse.json({ items: [], period: range });
  }

  // reduce by term
  const map = new Map<string, any>();
  for (const r of data || []) {
    const t = String(r.term || "").trim();
    if (!t) continue;
    const cur = map.get(t) || { term: t, cost: 0, sales: 0, orders: 0, clicks: 0, impressions: 0 };
    cur.cost += Number(r.cost || 0);
    cur.sales += Number(r.sales || 0);
    cur.orders += Number(r.orders || 0);
    cur.clicks += Number(r.clicks || 0);
    cur.impressions += Number(r.impressions || 0);
    map.set(t, cur);
  }

  const items = Array.from(map.values())
    .map((x: any) => ({
      term: x.term,
      cost: +x.cost.toFixed(2),
      sales: +x.sales.toFixed(2),
      orders: x.orders,
      clicks: x.clicks,
      impressions: x.impressions,
      acos: x.sales > 0 ? +((x.cost / x.sales) * 100).toFixed(2) : null,
      ctr: x.impressions > 0 ? +((x.clicks / x.impressions) * 100).toFixed(2) : null,
    }))
    // spend first; then sales
    .sort((a, b) => (b.cost - a.cost) || (b.sales - a.sales))
    .slice(0, limit);

  return NextResponse.json({ items, period: range });
}
