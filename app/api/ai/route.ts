import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Very light “talk to your data” endpoint:
 * - pulls /api/ads/summary and /api/ads/top
 * - returns a concise, deterministic answer without long prompts
 * You can swap to a streaming OpenAI call later—UI can stay the same.
 */
export async function POST(req: NextRequest) {
  const { question, range = "30d" } = await req.json().catch(() => ({ question: "", range: "30d" }));

  // fetch from our own APIs so auth context (cookies) applies
  const base = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "";
  const [summaryRes, topRes] = await Promise.all([
    fetch(`${base}/api/ads/summary?range=${encodeURIComponent(range)}`, { headers: { cookie: req.headers.get("cookie") || "" } }),
    fetch(`${base}/api/ads/top?range=${encodeURIComponent(range)}&limit=15`, { headers: { cookie: req.headers.get("cookie") || "" } }),
  ]);

  const summary = await summaryRes.json().catch(() => ({}));
  const top = await topRes.json().catch(() => ({ items: [] as any[] }));

  // Build a short, helpful text (no external LLM dependency needed right now)
  const lines: string[] = [];
  const spend = summary?.spend ?? 0;
  const sales = summary?.sales ?? 0;
  const orders = summary?.orders ?? 0;
  const acos = summary?.acos;

  lines.push(`Last ${range}: Spend $${(+spend).toFixed(2)}, Sales $${(+sales).toFixed(2)}, Orders ${orders}${acos != null ? `, ACOS ${acos}%` : ""}.`);

  if (top.items?.length) {
    const best = [...top.items]
      .filter((x: any) => x.sales > 0)
      .sort((a: any, b: any) => (a.acos ?? 999) - (b.acos ?? 999))
      .slice(0, 3)
      .map((x: any) => `${x.term} (ACOS ${x.acos ?? "–"}%, Sales $${x.sales.toFixed(2)})`);

    const burners = [...top.items]
      .filter((x: any) => (x.sales ?? 0) === 0 && (x.cost ?? 0) > 0)
      .slice(0, 3)
      .map((x: any) => `${x.term} ($${x.cost.toFixed(2)} spend, 0 sales)`);

    if (best.length) lines.push(`Top efficient terms: ${best.join("; ")}.`);
    if (burners.length) lines.push(`Potential negatives: ${burners.join("; ")}.`);
  } else {
    lines.push("No search-term rows yet. Click Sync on the dashboard to load fresh data.");
  }

  // If user asked something specific, append a short note (still deterministic)
  if (question) lines.push(`Q: ${question.trim()}`);

  return NextResponse.json({ answer: lines.join(" ") });
}
