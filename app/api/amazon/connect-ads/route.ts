import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { updateAmazonIntegration, createAmazonIntegration, getAmazonIntegration } from "@/lib/amazon"

export async function POST(request: Request) {
  try {
    const { userId, adsRefreshToken } = await request.json()

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user || user.id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if integration exists
    let integration = await getAmazonIntegration(userId)

    if (!integration) {
      // Create new integration
      integration = await createAmazonIntegration(userId)
    }

    // Update with Ads credentials
    await updateAmazonIntegration(userId, {
      ads_refresh_token: adsRefreshToken,
      ads_connected: true,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error connecting Amazon Ads:", error)
    return NextResponse.json({ error: "Failed to connect Amazon Ads" }, { status: 500 })
  }
}
