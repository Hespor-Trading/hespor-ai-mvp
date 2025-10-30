"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap } from "lucide-react"

export function HeroContent() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="container z-30 px-4 text-center">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-300/50 bg-white/80 px-4 py-1.5 text-sm font-medium text-purple-700 backdrop-blur-sm"
          >
            <Zap className="h-4 w-4" />
            AI-Powered Amazon PPC Automation
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-6 text-balance text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl"
          >
            Talk to Your Data.
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Scale Your Amazon Business.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mb-8 text-pretty text-lg leading-relaxed text-gray-700 sm:text-xl"
          >
            Hespor AI combines advanced analytics with intelligent PPC automation. Learn while executing, understand the
            reasoning behind every decision.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Use Hespor Algorithm
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/features">
              <Button
                size="lg"
                variant="outline"
                className="border-purple-300 bg-white/80 backdrop-blur-sm hover:bg-white"
              >
                Explore Features
              </Button>
            </Link>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-4 text-sm text-gray-600"
          >
            No credit card required • 14-day free trial
          </motion.p>
        </div>
      </div>
    </div>
  )
}
