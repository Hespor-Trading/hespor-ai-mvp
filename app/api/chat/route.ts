import { NextRequest } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // Lazily instantiate clients at request-time to avoid build-time env requirements
  if (!process.env.OPENAI_API_KEY) {
    return new Response(JSON.stringify({ error: "Missing OPENAI_API_KEY" }), { status: 500 });
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: "Supabase environment not configured" }), { status: 500 });
  }
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const sbAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { userId, message } = await req.json();

  // simple weekly quota (free: 10)
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay()); // Sun week start
  const week = weekStart.toISOString().slice(0,10);

  const { data: row } = await sbAdmin.from("chat_usage").select("*").eq("user_id", userId).maybeSingle();

  if (!row) {
    await sbAdmin.from("chat_usage").insert({ user_id: userId, week_start: week, used: 0 });
  } else {
    // reset if new week
    if (row.week_start !== week) {
      await sbAdmin.from("chat_usage").update({ week_start: week, used: 0 }).eq("user_id", userId);
    }
  }

  const { data: usage } = await sbAdmin.from("chat_usage").select("*").eq("user_id", userId).maybeSingle();

  // check plan for unlimited
  const { data: prof } = await sbAdmin.from("profiles").select("plan").eq("id", userId).maybeSingle();
  const isPro = prof?.plan === "pro";
  if (!isPro && (usage?.used ?? 0) >= 10) {
    return new Response(JSON.stringify({ error: "Free limit reached (10 chats/week). Upgrade to continue." }), { status: 402 });
  }

  // TODO: fetch recent Amazon stats for context (after your OAuth is fully wired)
  const system = `You are HESPOR AI. Be concise and practical. If data is missing, say so.`;

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: message }
    ],
  });

  // increment usage if not pro
  if (!isPro) {
    await sbAdmin.rpc("noop"); // placeholder to keep connection warm
    await sbAdmin.from("chat_usage").update({ used: (usage?.used ?? 0) + 1, updated_at: new Date().toISOString() }).eq("user_id", userId);
  }

  const text = completion.choices[0]?.message?.content ?? "No answer.";
  return new Response(JSON.stringify({ text }));
}
