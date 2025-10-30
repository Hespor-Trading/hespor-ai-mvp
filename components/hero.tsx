"use client"

import { Button } from "@/components/ui/button"
import { StaticProductShowcase } from "./static-product-showcase"
import { ArrowRight, Play } from "lucide-react"
import { motion } from "framer-motion"

export function Hero() {
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
                Talk to Your Ads. <span className="text-[var(--brand-green)]">Automate the Rest.</span>
              </h1>
              <p className="text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
                Hespor AI analyzes your Amazon Ads data in real-time and automatically adjusts bids, negatives, and
                dayparting — while you chat naturally to see why and how.
              </p>
            </div>

            <motion.div
              className="flex flex-col gap-4 sm:flex-row"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Button
                size="lg"
                className="h-12 min-w-[200px] bg-[var(--brand-green)] text-base font-semibold text-white hover:bg-[var(--brand-green-dark)] hover:scale-105 transition-transform"
              >
                Start Free — See It in Action
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 min-w-[200px] border-2 text-base font-semibold bg-transparent hover:bg-white/50 hover:scale-105 transition-transform"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </motion.div>

            <motion.div
              className="flex flex-wrap items-center gap-6 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-green)]/10">
                  <svg
                    className="h-5 w-5 text-[var(--brand-green)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">Bid Accuracy</div>
                  <div className="text-xs text-muted-foreground">+28%</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-green)]/10">
                  <svg
                    className="h-5 w-5 text-[var(--brand-green)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">ACOS</div>
                  <div className="text-xs text-[var(--brand-green)]">14.9% ↓</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-green)]/10">
                  <svg
                    className="h-5 w-5 text-[var(--brand-green)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">ROAS</div>
                  <div className="text-xs text-[var(--brand-green)]">4.2× ↑</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Product Showcase */}
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <StaticProductShowcase />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
