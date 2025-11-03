import { NextResponse } from "next/server"

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  const projectRef = url.match(/https?:\/\/([^.]+)\.supabase\.co/)?.[1] || "unknown"

  return NextResponse.json({
    supabaseUrl: url,
    projectRef,
    anonKeyPrefix: anon ? anon.slice(0, 8) : "",
  })
}
