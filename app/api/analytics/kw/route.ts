import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const days = Number(sp.get("days") ?? 30);
  const profileId = sp.get("profile_id") || undefined;

  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  // Filter the view by user (+ optional profile + date window)
  const { data, error } = await supabase
    .from("v_kw_perf")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle(); // remove maybeSingle() if you want all rows

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // optional: limit by days using last_seen from the view
  const rows = Array.isArray(data)
    ? data.filter(r => !days || (Date.now() - new Date(r.last_seen).getTime()) / 86400000 <= days)
    : [data];

  return NextResponse.json(rows);
}
