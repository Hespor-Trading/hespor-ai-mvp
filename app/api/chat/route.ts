import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message) return NextResponse.json({ error: "Missing message" }, { status: 400 });

    const response = await client.responses.create({
      model: "gpt-5",
      input: message,
    });

    const text = response.output_text || "No reply";
    return NextResponse.json({ reply: text });
  } catch (err: any) {
    console.error("Chat API error:", err?.message || err);
    return NextResponse.json({ error: "Chat API failed" }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
