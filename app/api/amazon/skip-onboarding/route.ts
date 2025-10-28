import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { updateAmazonIntegration, createAmazonIntegration, getAmazonIntegration } from "@/lib/amazon"

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

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

    // Mark both as connected for demo mode
    await updateAmazonIntegration(userId, {
      ads_connected: true,
      sp_connected: true,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error skipping onboarding:", error)
    return NextResponse.json({ error: "Failed to skip onboarding" }, { status: 500 })
  }
}
