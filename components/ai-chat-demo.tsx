"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  role: "user" | "assistant"
  content: string
}

const chatScripts: Message[][] = [
  [
    { role: "user", content: "What are my top performing keywords this week?" },
    {
      role: "assistant",
      content: '"drawer organizer", "bamboo divider set", "cutlery tray expandable" — best ROAS, ACOS 12%–14%.',
    },
  ],
  [
    { role: "user", content: "What did the algo change yesterday?" },
    {
      role: "assistant",
      content: 'Raised bids +10% on "drawer organizer", negated "plastic tray divider" (0 convs).',
    },
  ],
  [
    { role: "user", content: "When are my ads most profitable?" },
    { role: "assistant", content: "8AM–2PM — reduced evening bids −25% via automatic dayparting." },
  ],
]

export function AiChatDemo() {
  const [currentScriptIndex, setCurrentScriptIndex] = useState(0)
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const currentScript = chatScripts[currentScriptIndex]
  const currentMessage = currentScript[currentMessageIndex]

  useEffect(() => {
    if (!currentMessage) return

    setIsTyping(true)
    setDisplayedText("")

    const text = currentMessage.content
    let charIndex = 0

    // Typing speed: 70-100 wpm = ~12-17 chars per second, we'll use ~15 chars/sec
    const typingSpeed = 1000 / 15

    const typingInterval = setInterval(() => {
      if (charIndex < text.length) {
        setDisplayedText(text.slice(0, charIndex + 1))
        charIndex++
      } else {
        clearInterval(typingInterval)
        setIsTyping(false)

        // Wait 2 seconds before next message
        setTimeout(() => {
          if (currentMessageIndex < currentScript.length - 1) {
            setCurrentMessageIndex(currentMessageIndex + 1)
          } else {
            // Wait 4 seconds before starting next script
            setTimeout(() => {
              setCurrentMessageIndex(0)
              setCurrentScriptIndex((currentScriptIndex + 1) % chatScripts.length)
            }, 4000)
          }
        }, 2000)
      }
    }, typingSpeed)

    return () => clearInterval(typingInterval)
  }, [currentScriptIndex, currentMessageIndex])

  return (
    <section className="py-12 md:py-20">
      <div className="mx-auto max-w-[900px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-border/30 bg-white/40 p-8 backdrop-blur-sm shadow-xl"
        >
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {currentScript.slice(0, currentMessageIndex + 1).map((message, index) => (
                <motion.div
                  key={`${currentScriptIndex}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                      message.role === "user"
                        ? "bg-[var(--brand-green)] text-white"
                        : "bg-white/80 text-foreground border border-border/50"
                    }`}
                  >
                    <p className="text-sm md:text-base leading-relaxed">
                      {index === currentMessageIndex ? displayedText : message.content}
                      {index === currentMessageIndex && isTyping && (
                        <span className="inline-block w-1 h-4 ml-1 bg-current animate-pulse" />
                      )}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center text-sm text-muted-foreground italic"
          >
            "Live from your Ads Data. Nothing to learn — just ask."
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
