import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { brand, query } = await req.json();

    // Pull simple facts first (you can expand with other endpoints later)
    const base = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "";
    const summaryRes = await fetch(`${base}/api/ads/summary?brand=${encodeURIComponent(brand)}&range=30d`, { cache: "no-store" });
    const summary = await summaryRes.json();

    // If you want to use OpenAI, uncomment below and ensure env OPENAI_API_KEY/MODEL exist.
    // For now, compose a deterministic answer so it works even without external calls.
    const answer = (() => {
      if (!summary || (!summary.sales && !summary.spend)) {
        return "I couldn’t find recent ads data for your account. If this is a new or inactive advertiser, connect a seller account with campaigns.";
      }
      const bits = [
        `Sales (30d): $${(summary.sales || 0).toLocaleString()}`,
        `Spend (30d): $${(summary.spend || 0).toLocaleString()}`,
        `ACOS (30d): ${summary.acos == null ? "—" : summary.acos + "%"}`,
      ];
      return `Here’s a quick snapshot for the last 30 days:\n• ${bits.join("\n• ")}\nAsk me for campaigns or keywords next.`;
    })();

    return NextResponse.json({ answer });
  } catch (e: any) {
    return NextResponse.json({ answer: "Sorry, I hit an error handling that request." }, { status: 200 });
  }
}
