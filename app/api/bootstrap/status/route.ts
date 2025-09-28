// app/api/bootstrap/status/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const sb = createRouteHandlerClient({ cookies });
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  // Are creds present?
  const [{ data: ads }, { data: sp }, { data: prof }] = await Promise.all([
    sb.from("amazon_ads_credentials").select("user_id").eq("user_id", user.id).maybeSingle(),
    sb.from("spapi_credentials").select("user_id").eq("user_id", user.id).maybeSingle(),
    sb.from("profiles").select("first_ingest_done, plan").eq("id", user.id).maybeSingle(),
  ]);

  const adsReady = !!ads?.user_id;
  const spReady  = !!sp?.user_id;

  // "done" means both connections exist AND the first data ingestion is marked complete.
  // While your real import runs, keep this false and the overlay will stay on.
  const done = !!prof?.first_ingest_done && adsReady && spReady;

  return NextResponse.json({
    adsReady,
    spReady,
    done,
    plan: prof?.plan ?? "free",
  });
}
