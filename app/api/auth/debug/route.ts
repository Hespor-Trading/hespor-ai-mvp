import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  const projectRef = url.match(/https?:\/\/([^.]+)\.supabase\.co/)?.[1] || "unknown"
  const headers = Object.fromEntries(new Headers(req.headers).entries())
  const host = headers["x-forwarded-host"] || headers["host"] || ""
  const proto = headers["x-forwarded-proto"] || "https"
  const origin = `${proto}://${host}`
  const expectedCallback = `${origin}/auth/callback`
  const expectedAmazonNext = `${origin}/connect/amazon`
  return NextResponse.json({
    env: {
      NEXT_PUBLIC_SUPABASE_URL: url,
      NEXT_PUBLIC_SUPABASE_ANON_KEY_prefix: anon ? anon.slice(0,8) : "",
      projectRef
    },
    runtime: {
      origin,
      expectedCallback,
      expectedAmazonNext
    }
  })
}
