import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getConversations, getMessages } from "@/lib/db"
import { isAmazonConnected } from "@/lib/amazon"
import { ChatInterface } from "@/components/chat-interface"
import { ConversationSidebar } from "@/components/conversation-sidebar"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { conversation?: string }
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const hasAmazonIntegration = await isAmazonConnected(user.id)

  if (!hasAmazonIntegration) {
    redirect("/onboarding")
  }

  // Get all conversations
  const conversations = await getConversations(user.id)

  // Determine which conversation to show
  let currentConversationId = searchParams.conversation

  // If no conversation specified or conversation doesn't exist, use the most recent one
  if (!currentConversationId || !conversations.find((c) => c.id === currentConversationId)) {
    if (conversations.length > 0) {
      currentConversationId = conversations[0].id
    } else {
      // Create a new conversation if none exist
      const { createConversation } = await import("@/lib/db")
      const newConversation = await createConversation(user.id, "New chat")
      currentConversationId = newConversation.id
      conversations.unshift(newConversation)
    }
  }

  // Get messages for current conversation
  const messages = await getMessages(currentConversationId)

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="w-64 shrink-0">
        <ConversationSidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          userEmail={user.email || ""}
        />
      </div>
      <div className="flex flex-1 flex-col">
        <div className="border-b p-4">
          <h1 className="text-2xl font-bold">Hespor AI Assistant</h1>
          <p className="text-sm text-muted-foreground">Your Amazon PPC optimization partner</p>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatInterface conversationId={currentConversationId} initialMessages={messages} />
        </div>
      </div>
    </div>
  )
}
