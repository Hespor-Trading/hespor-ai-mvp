import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const origin = requestUrl.origin
  const next = requestUrl.searchParams.get("next") || "/loading"

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)

    // Optionally short-circuit if user already integrated and next is authorize/loading
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user && (next === "/authorize" || next === "/loading")) {
      const { data: integration } = await supabase
        .from("amazon_integrations")
        .select("is_fully_connected")
        .eq("user_id", user.id)
        .single()
      if (integration?.is_fully_connected) {
        return NextResponse.redirect(`${origin}/dashboard`)
      }
    }
  }

  return NextResponse.redirect(`${origin}${next}`)
}
