import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") || "/connect/amazon"
  const supabase = await createClient()

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      const url = new URL("/auth/error", origin)
      url.searchParams.set("message", error.message)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.redirect(new URL(next, origin))
}
