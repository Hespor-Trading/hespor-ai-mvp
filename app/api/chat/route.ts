// app/api/chat/route.ts
import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // make this a Node serverless function

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Simple GET – lets you test the route in a browser
export async function GET() {
  return NextResponse.json({ ok: true });
}

// POST – send { "message": "hello" }
export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "Missing message" }, { status: 400 });
    }

    const response = await client.responses.create({
      model: "gpt-5",
      input: message,
    });

    const text =
      (response as any).output_text?.trim?.() ??
      (response as any).choices?.[0]?.message?.content ??
      "No reply";

    return NextResponse.json({ reply: text });
  } catch (err: any) {
    console.error("Chat API error:", err?.message ?? err);
    return NextResponse.json({ error: "Chat API failed" }, { status: 500 });
  }
}
