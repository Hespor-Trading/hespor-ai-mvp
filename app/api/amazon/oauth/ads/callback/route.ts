import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"

const AMAZON_ADS_TOKEN_URL = process.env.AMAZON_ADS_TOKEN_URL || "https://api.amazon.com/auth/o2/token"
const AMAZON_ADS_CLIENT_ID = process.env.AMAZON_ADS_CLIENT_ID
const AMAZON_ADS_CLIENT_SECRET = process.env.AMAZON_ADS_CLIENT_SECRET
const AMAZON_ADS_REDIRECT_URI =
  process.env.AMAZON_ADS_REDIRECT_URI || `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/amazon/oauth/ads/callback`

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")

  const cookieStore = await cookies()
  const expectedState = cookieStore.get("amz_ads_oauth_state")?.value

  if (!state || !expectedState || state !== expectedState) {
    return NextResponse.redirect("/authorize?error=invalid_state")
  }

  if (!code) {
    return NextResponse.redirect("/authorize?error=missing_code")
  }

  if (!AMAZON_ADS_CLIENT_ID || !AMAZON_ADS_CLIENT_SECRET) {
    return NextResponse.redirect("/authorize?error=missing_client")
  }

  try {
    const tokenRes = await fetch(AMAZON_ADS_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: AMAZON_ADS_REDIRECT_URI,
        client_id: AMAZON_ADS_CLIENT_ID,
        client_secret: AMAZON_ADS_CLIENT_SECRET,
      }).toString(),
    })

    if (!tokenRes.ok) {
      return NextResponse.redirect("/authorize?error=token_exchange_failed")
    }

    const tokenJson = (await tokenRes.json()) as {
      access_token: string
      refresh_token: string
      expires_in: number
      token_type: string
    }

    const expiresAt = new Date(Date.now() + (tokenJson.expires_in - 60) * 1000).toISOString()

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect("/auth/login")
    }

    // Store in dedicated credentials table
    await supabase
      .from("ads_credentials")
      .upsert(
        {
          user_id: user.id,
          provider: "ads",
          refresh_token: tokenJson.refresh_token,
          access_token: tokenJson.access_token,
          token_expires_at: expiresAt,
        },
        { onConflict: "user_id,provider" },
      )

    // Update integration status for compatibility with app logic
    await supabase
      .from("amazon_integrations")
      .upsert({ user_id: user.id, ads_connected: true }, { onConflict: "user_id" })

    return NextResponse.redirect("/loading")
  } catch (e) {
    return NextResponse.redirect("/authorize?error=unexpected")
  }
}
