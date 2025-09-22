import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const messages = body?.messages || [
      { role: "system", content: "You are Hespor Ads Assistant." },
      { role: "user", content: "Hello" }
    ];

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
    }

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages,
      temperature: 0.2,
    });

    const reply = completion.choices[0]?.message || { role: "assistant", content: "" };
    return NextResponse.json({ ok: true, reply });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: "OpenAI request failed", detail: String(err?.message || err) },
      { status: 500 }
    );
  }
}
