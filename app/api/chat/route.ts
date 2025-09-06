import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // ensure Node runtime on Vercel

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// --- Basic CORS helper ---
function withCors(json: any, status = 200) {
  return new NextResponse(JSON.stringify(json), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

// Preflight
export async function OPTIONS() {
  return withCors({}, 204);
}

// Simple GET for a quick health check
export async function GET() {
  return withCors({ ok: true });
}

// Handle POST /api/chat
export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message) return withCors({ error: "Missing message" }, 400);

    const completion = await client.responses.create({
      model: "gpt-5", // you can use "gpt-4.1" if needed
      input: message,
    });

    const reply =
      completion.output_text?.trim() ||
      completion.output?.[0]?.content?.[0]?.text?.trim() ||
      "No reply";

    return withCors({ reply });
  } catch (err: any) {
    console.error("Chat API error:", err?.message || err);
    return withCors({ error: "Chat API failed" }, 500);
  }
}
