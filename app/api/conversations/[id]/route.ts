import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { deleteConversation } from "@/lib/db"

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    // Get authenticated user
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      },
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify the conversation belongs to the user
    const { data: conversation } = await supabase.from("conversations").select("user_id").eq("id", params.id).single()

    if (!conversation || conversation.user_id !== user.id) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    await deleteConversation(params.id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Delete conversation error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
