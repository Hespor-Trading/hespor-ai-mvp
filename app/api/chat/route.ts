import { NextResponse } from "next/server";

export async function POST() {
  // Temporary stub (no OpenAI yet)
  return NextResponse.json({
    ok: true,
    message: "Chat is temporarily disabled while we finalize setup.",
  });
}
