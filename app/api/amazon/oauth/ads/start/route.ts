import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"

const AMAZON_ADS_OAUTH_URL = process.env.AMAZON_ADS_OAUTH_URL || "https://www.amazon.com/ap/oa"
const AMAZON_ADS_CLIENT_ID = process.env.AMAZON_ADS_CLIENT_ID
const AMAZON_ADS_REDIRECT_URI =
  process.env.AMAZON_ADS_REDIRECT_URI || `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/amazon/oauth/ads/callback`

function generateState(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export async function GET() {
  if (!AMAZON_ADS_CLIENT_ID) {
    return NextResponse.json({ error: "Missing AMAZON_ADS_CLIENT_ID" }, { status: 500 })
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect("/auth/login")
  }

  const state = generateState()
  ;(await cookies()).set("amz_ads_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 10 * 60, // 10 minutes
  })

  const params = new URLSearchParams({
    client_id: AMAZON_ADS_CLIENT_ID,
    scope: "advertising::campaign_management",
    response_type: "code",
    redirect_uri: AMAZON_ADS_REDIRECT_URI,
    state,
  })

  return NextResponse.redirect(`${AMAZON_ADS_OAUTH_URL}?${params.toString()}`)
}
