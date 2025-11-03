"use client"

import { Button } from "@/components/ui/button"
import { DynamicProductShowcase } from "./dynamic-product-showcase"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useEffect, useState } from "react"

const typingWords = ["bids", "budgets", "negatives", "dayparting", "rank", "profitability"]

export function Hero() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) {
      setDisplayText(typingWords[0])
      return
    }

    const currentWord = typingWords[currentWordIndex]
    const typingSpeed = isDeleting ? 50 : 100
    const pauseTime = isDeleting ? 500 : 2000

    const timeout = setTimeout(
      () => {
        if (!isDeleting && displayText === currentWord) {
          setTimeout(() => setIsDeleting(true), pauseTime)
        } else if (isDeleting && displayText === "") {
          setIsDeleting(false)
          setCurrentWordIndex((prev) => (prev + 1) % typingWords.length)
        } else {
          setDisplayText(
            isDeleting
              ? currentWord.substring(0, displayText.length - 1)
              : currentWord.substring(0, displayText.length + 1),
          )
        }
      },
      isDeleting && displayText === "" ? 0 : typingSpeed,
    )

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, currentWordIndex])

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="mx-auto max-w-[1200px] px-6 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column - Text Content */}
          <motion.div
            className="flex flex-col justify-center space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-4">
              <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
                Talk to Your Ads.{" "}
                <span className="inline-block">
                  <span className="bg-gradient-to-r from-[var(--brand-green)] to-emerald-600 bg-clip-text text-transparent">
                    Automate{" "}
                    <span className="inline-block min-w-[200px] text-left">
                      {displayText}
                      <span className="animate-pulse">|</span>
                    </span>
                  </span>
                </span>
              </h1>
              <p className="text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
                Hespor AI lets you chat with your Amazon data while our algorithm learns and manages bids, budgets, and
                dayparting for you.
              </p>
            </div>

            <motion.div
              className="flex flex-col gap-4 sm:flex-row"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Link href="https://app.hespor.com/auth/login">
                <Button
                  size="lg"
                  className="h-12 min-w-[200px] bg-[var(--brand-green)] text-base font-semibold text-white hover:bg-[var(--brand-green-dark)] hover:scale-105 transition-transform"
                >
                  Start Free — No Credit Card
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="https://app.hespor.com/auth/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 min-w-[200px] border-2 text-base font-semibold bg-transparent hover:bg-white/50 hover:scale-105 transition-transform"
                >
                  Sign In
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column - Product Showcase */}
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <DynamicProductShowcase />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
