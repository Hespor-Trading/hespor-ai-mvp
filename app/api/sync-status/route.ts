import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("user_id");
    if (!userId) return NextResponse.json({ ok: false, error: "missing user_id" }, { status: 400 });

    const sb = admin();
    const { data } = await sb
      .from("job_status")
      .select("status,progress,updated_at")
      .eq("user_id", userId)
      .eq("type", "initial_sync")
      .maybeSingle();

    const status = (data as any)?.status || "idle";
    const progress = Number((data as any)?.progress ?? 0);

    return NextResponse.json({ ok: true, status, progress, updated_at: (data as any)?.updated_at });
  } catch (e: any) {
    console.error("sync-status error", e);
    return NextResponse.json({ ok: false, error: e?.message || "server_error" }, { status: 500 });
  }
}
