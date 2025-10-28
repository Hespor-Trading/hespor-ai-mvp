import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("amazon_integrations")
      .select("ads_connected, sp_connected, is_fully_connected, last_synced_at, created_at, updated_at")
      .eq("user_id", user.id)
      .single()

    if (error) {
      return NextResponse.json({ error: "Failed to fetch status" }, { status: 500 })
    }

    const status = data
      ? data.is_fully_connected
        ? data.last_synced_at
          ? "ready"
          : "connected"
        : "partial"
      : "missing"

    return NextResponse.json({ status, integration: data ?? null })
  } catch (e) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 })
  }
}
