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

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = (await req.json().catch(() => ({})))?.userId || url.searchParams.get("user_id");
    if (!userId) return NextResponse.json({ ok: false, error: "missing userId" }, { status: 400 });

    const sb = admin();

    // Ensure both creds exist
    const [ads, sp] = await Promise.all([
      sb.from("amazon_ads_credentials").select("refresh_token").eq("user_id", userId).maybeSingle(),
      sb.from("spapi_credentials").select("refresh_token").eq("user_id", userId).maybeSingle(),
    ]);
    const hasAds = !!ads.data?.refresh_token;
    const hasSp = !!sp.data?.refresh_token;
    if (!hasAds || !hasSp) {
      return NextResponse.json({ ok: false, error: "missing_tokens" }, { status: 400 });
    }

    // Read current job status
    const { data: existing } = await sb
      .from("job_status")
      .select("id,status,progress")
      .eq("user_id", userId)
      .eq("type", "initial_sync")
      .maybeSingle();

    const current = existing as any;
    const now = new Date().toISOString();

    if (current?.status === "running") {
      return NextResponse.json({ ok: true, status: "running", progress: current.progress ?? 0 });
    }

    // Mark running
    await sb.from("job_status").upsert({
      id: current?.id,
      user_id: userId,
      type: "initial_sync",
      status: "running",
      progress: 5,
      updated_at: now,
    } as any);

    // Stub: immediately mark done so onboarding can proceed
    await sb.from("job_status").upsert({
      id: current?.id,
      user_id: userId,
      type: "initial_sync",
      status: "done",
      progress: 100,
      updated_at: new Date().toISOString(),
    } as any);

    return NextResponse.json({ ok: true, status: "done", progress: 100 });
  } catch (e: any) {
    console.error("start-initial-sync error", e);
    return NextResponse.json({ ok: false, error: e?.message || "server_error" }, { status: 500 });
  }
}
