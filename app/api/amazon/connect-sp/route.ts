import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { updateAmazonIntegration, createAmazonIntegration, getAmazonIntegration } from "@/lib/amazon"

export async function POST(request: Request) {
  try {
    const { userId, spRefreshToken } = await request.json()

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

    // Update with SP-API credentials
    await updateAmazonIntegration(userId, {
      sp_refresh_token: spRefreshToken,
      sp_connected: true,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error connecting Amazon SP-API:", error)
    return NextResponse.json({ error: "Failed to connect Amazon SP-API" }, { status: 500 })
  }
}
