// app/api/chat/route.ts
import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function GET() {
  return NextResponse.json({ ok: true });
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "Missing message" }, { status: 400 });
    }

    const completion = await client.responses.create({
      model: "gpt-5", // or "gpt-4.1" if you prefer
      input: message,
    });

    const text =
      (completion.output_text ?? "").trim() || "No reply";

    return NextResponse.json({ reply: text });
  } catch (err: any) {
    console.error("Chat API error:", err?.message ?? err);
    return NextResponse.json({ error: "Chat API failed" }, { status: 500 });
  }
}
