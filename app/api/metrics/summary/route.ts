// app/api/metrics/summary/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Simple fake series so the chart renders now.
// Replace with real Amazon calls later.
function fakeSeries(days: number) {
  const out: { date: string; sales: number; profit: number; adSpend: number }[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now); d.setDate(now.getDate() - i);
    const seed = 50 + Math.round(Math.random() * 50);
    out.push({
      date: d.toISOString().slice(0,10),
      sales: seed * 20,
      profit: seed * 6,
      adSpend: seed * 4,
    });
  }
  return out;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const range = url.searchParams.get("range") || "30d";
  const days = range === "24h" ? 2 : range === "7d" ? 7 : range === "30d" ? 30 : range === "90d" ? 90 : 180;
  return NextResponse.json({ series: fakeSeries(days) });
}
