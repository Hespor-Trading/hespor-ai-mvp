import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function weekAgoISO() {
  return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
}

export async function POST(req: Request) {
  try {
    const supabase = getSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { answer: "Please sign in to use the assistant." },
        { status: 401 }
      );
    }

    // Identify plan (treat missing col as "free")
    let plan: string | null = null;
    {
      const { data } = await supabaseAdmin
        .from("profiles")
        .select("plan")
        .eq("id", user.id)
        .single();
      plan = (data as any)?.plan ?? null;
    }

    const isPro = plan === "pro";

    if (!isPro) {
      // Count usages in last 7d
      const { count, error: cntErr } = await supabaseAdmin
        .from("chat_usage")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("ts", weekAgoISO());

      if (cntErr) {
        // Don’t hard-fail UX on metering issues; log and proceed with a soft cap
        console.error("chat_usage count error:", cntErr);
      }

      if ((count ?? 0) >= 10) {
        return NextResponse.json(
          {
            answer:
              "You’ve reached the Free plan limit of 10 questions this week. Upgrade to Pro for unlimited questions.",
            limit: 10,
            window: "7d",
          },
          { status: 429 }
        );
      }
    }

    const { brand, query } = await req.json();

    // Pull a simple snapshot first (works even with empty data)
    const base =
      process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "";
    const summaryRes = await fetch(
      `${base}/api/ads/summary?brand=${encodeURIComponent(
        brand || "default"
      )}&range=30d`,
      { cache: "no-store" }
    ).catch(() => null);

    const summary = summaryRes && (await summaryRes.json().catch(() => null));

    // Compose answer deterministically (you can swap to OpenAI later if you want)
    const answer = (() => {
      if (!summary || (!summary.sales && !summary.spend)) {
        return "I couldn’t find recent ads data for your account. If this is a new or inactive advertiser, connect a seller account with campaigns.";
      }
      const bits = [
        `Sales (30d): $${(summary.sales || 0).toLocaleString()}`,
        `Spend (30d): $${(summary.spend || 0).toLocaleString()}`,
        `ACOS (30d): ${summary.acos == null ? "—" : summary.acos + "%"}`,
      ];
      return `Here’s a quick snapshot for the last 30 days:\n• ${bits.join(
        "\n• "
      )}\nAsk me for campaigns or keywords next.`;
    })();

    // Record usage (only for Free; Pro is unmetered)
    if (!isPro) {
      await supabaseAdmin.from("chat_usage").insert({
        user_id: user.id,
        ts: new Date().toISOString(),
        brand: brand || "default",
        question: String(query || ""),
      });
    }

    return NextResponse.json({ answer });
  } catch (e: any) {
    console.error("AI route error:", e);
    return NextResponse.json(
      { answer: "Sorry, I hit an error handling that request." },
      { status: 200 }
    );
  }
}
