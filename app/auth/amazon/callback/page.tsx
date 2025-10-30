"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function AmazonCallbackPage() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Syncing last 90 days of campaigns...")

  useEffect(() => {
    // Simulate OAuth exchange and data sync
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            router.push("/dashboard")
          }, 1000)
          return 100
        }
        return prev + 2
      })
    }, 100)

    // Update status messages
    setTimeout(() => setStatus("Training bid curves and dayparting windows..."), 2000)
    setTimeout(() => setStatus("Analyzing keyword performance..."), 4000)

    return () => clearInterval(interval)
  }, [router])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#E6F9F2]/90 to-white/90 backdrop-blur-md flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-8"
      >
        {/* Progress Ring */}
        <div className="relative inline-flex items-center justify-center">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 56}`}
              strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
              className="text-[var(--brand-green)] transition-all duration-300"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-[var(--brand-green)]">{Math.round(progress)}%</span>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Setting Up Your Dashboard</h2>
          <p className="text-lg text-muted-foreground">{status}</p>
        </div>
      </motion.div>
    </div>
  )
}
