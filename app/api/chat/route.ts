// app/api/chat/route.ts
import OpenAI from "openai";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // avoid static optimization

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function GET() {
  return NextResponse.json(
    { ok: true },
    { headers: { "Access-Control-Allow-Origin": "*" } }
  );
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json(
        { error: "Missing message" },
        { status: 400, headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    const completion = await client.responses.create({
      model: "gpt-5",
      input: message,
    });

    const text = completion.output_text?.trim() || "No reply";
    return NextResponse.json(
      { reply: text },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Chat API failed", details: err?.message ?? "unknown" },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}

