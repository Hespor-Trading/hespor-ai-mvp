import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { ensureConversation, addMessage, getMessages } from "@/lib/db"

export const runtime = "edge"

export async function POST(req: Request) {
  try {
    const { prompt, conversationId } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: "No prompt provided" }, { status: 400 })
    }

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

    // Ensure conversation exists or use provided one
    const activeConversationId = conversationId || (await ensureConversation(user.id))

    // Add user message to database
    await addMessage(activeConversationId, "user", prompt)

    // Get conversation history for context
    const messages = await getMessages(activeConversationId)
    const conversationHistory = messages.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }))

    // Call OpenAI API
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        stream: true,
        messages: [
          {
            role: "system",
            content:
              "You are Hespor AI, an intelligent Amazon PPC assistant. You help sellers optimize their advertising campaigns, analyze data, and make data-driven decisions. Be helpful, concise, and actionable in your responses.",
          },
          ...conversationHistory,
        ],
      }),
    })

    if (!openaiResponse.ok) {
      const error = await openaiResponse.text()
      console.error("[v0] OpenAI API error:", error)
      return NextResponse.json({ error: "Failed to get response from AI" }, { status: 500 })
    }

    // Stream the response
    const encoder = new TextEncoder()
    const decoder = new TextDecoder()
    let fullResponse = ""

    const stream = new ReadableStream({
      async start(controller) {
        const reader = openaiResponse.body?.getReader()
        if (!reader) {
          controller.close()
          return
        }

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value)
            const lines = chunk.split("\n").filter((line) => line.trim() !== "")

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6)
                if (data === "[DONE]") continue

                try {
                  const parsed = JSON.parse(data)
                  const content = parsed.choices?.[0]?.delta?.content

                  if (content) {
                    fullResponse += content
                    controller.enqueue(encoder.encode(content))
                  }
                } catch (e) {
                  console.error("[v0] Error parsing SSE data:", e)
                }
              }
            }
          }

          // Save assistant response to database
          if (fullResponse) {
            await addMessage(activeConversationId, "assistant", fullResponse)
          }

          controller.close()
        } catch (error) {
          console.error("[v0] Stream error:", error)
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Conversation-Id": activeConversationId,
      },
    })
  } catch (error: any) {
    console.error("[v0] Chat API error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
