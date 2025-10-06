// lib/insights/wastedSpend.ts
import { createClient } from "@supabase/supabase-js";

export async function topWastedSpend(user_id: string, minClicks = 20, maxConv = 0) {
  const supa = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data } = await supa
    .from("v_kw_perf")
    .select("*")
    .eq("user_id", user_id)
    .gte("clicks", minClicks)
    .lte("sales", maxConv)
    .order("cost", { ascending: false })
    .limit(25);
  return data || [];
}
