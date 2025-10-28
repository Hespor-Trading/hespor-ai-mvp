import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

function getSupabaseServer() {
  const cookieStore = cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
    },
  })
}

export async function ensureConversation(userId: string) {
  const supabase = getSupabaseServer()

  // Try to get the most recent conversation
  const { data } = await supabase
    .from("conversations")
    .select("id")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (data) return data.id

  // Create a new conversation if none exists
  const { data: created, error } = await supabase
    .from("conversations")
    .insert({ user_id: userId, title: "New chat" })
    .select("id")
    .single()

  if (error) throw error
  return created.id
}

export async function createConversation(userId: string, title = "New chat") {
  const supabase = getSupabaseServer()

  const { data, error } = await supabase
    .from("conversations")
    .insert({ user_id: userId, title })
    .select("id, title, created_at, updated_at")
    .single()

  if (error) throw error
  return data
}

export async function getConversations(userId: string) {
  const supabase = getSupabaseServer()

  const { data, error } = await supabase
    .from("conversations")
    .select("id, title, created_at, updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function updateConversationTitle(conversationId: string, title: string) {
  const supabase = getSupabaseServer()

  const { error } = await supabase.from("conversations").update({ title }).eq("id", conversationId)

  if (error) throw error
}

export async function deleteConversation(conversationId: string) {
  const supabase = getSupabaseServer()

  const { error } = await supabase.from("conversations").delete().eq("id", conversationId)

  if (error) throw error
}

export async function addMessage(conversationId: string, role: "user" | "assistant", content: string) {
  const supabase = getSupabaseServer()

  const { error } = await supabase.from("messages").insert({ conversation_id: conversationId, role, content })

  if (error) throw error
}

export async function getMessages(conversationId: string) {
  const supabase = getSupabaseServer()

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })

  if (error) throw error
  return data ?? []
}
