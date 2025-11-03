import { NextResponse } from "next/server"
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/env"

export async function GET(req: Request) {
  const projectRef = SUPABASE_URL.match(/https?:\/\/([^.]+)\.supabase\.co/)?.[1] || "unknown"
  const headers = Object.fromEntries(new Headers(req.headers).entries())
  const host = headers["x-forwarded-host"] || headers["host"] || ""
  const proto = headers["x-forwarded-proto"] || "https"
  const origin = `${proto}://${host}`
  const expectedCallback = `${origin}/auth/callback`
  const expectedAmazonNext = `${origin}/connect/amazon`
  return NextResponse.json({
    env: {
      SUPABASE_URL,
      SUPABASE_ANON_KEY_prefix: SUPABASE_ANON_KEY ? SUPABASE_ANON_KEY.slice(0, 8) : "",
      projectRef
    },
    runtime: {
      origin,
      expectedCallback,
      expectedAmazonNext
    }
  })
}
