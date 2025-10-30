"use client"

import { motion, type MotionValue } from "framer-motion"
import { Zap, Bell, TrendingUp, ChevronDown } from "lucide-react"

interface KpiCardProps {
  type: "ai-campaigns" | "stockout" | "optimize" | "creator"
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right"
  data: any
  hue: number
  parallaxX: MotionValue<number>
  parallaxY: MotionValue<number>
  slideIndex: number
}

const positionClasses = {
  "top-left": "left-[5%] top-[10%] md:left-[8%] md:top-[15%] lg:left-[12%] lg:top-[18%]",
  "top-right": "right-[5%] top-[10%] md:right-[8%] md:top-[15%] lg:right-[12%] lg:top-[18%]",
  "bottom-left": "bottom-[15%] left-[5%] md:bottom-[18%] md:left-[8%] lg:bottom-[20%] lg:left-[12%]",
  "bottom-right": "bottom-[15%] right-[5%] md:bottom-[18%] md:right-[8%] lg:bottom-[20%] lg:right-[12%]",
}

const orbitOffsets = {
  "top-left": { x: [-6, 6, -6], y: [-8, 8, -8] },
  "top-right": { x: [8, -8, 8], y: [-6, 6, -6] },
  "bottom-left": { x: [-8, 8, -8], y: [6, -6, 6] },
  "bottom-right": { x: [6, -6, 6], y: [8, -8, 8] },
}

export function KpiCard({ type, position, data, hue, parallaxX, parallaxY, slideIndex }: KpiCardProps) {
  const offset = orbitOffsets[position]

  const renderContent = () => {
    switch (type) {
      case "ai-campaigns":
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{
                  background: `linear-gradient(135deg, hsl(${hue}, 90%, 60%) 0%, hsl(${hue + 20}, 90%, 60%) 100%)`,
                }}
              >
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-900">AI Smart Campaigns</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white/50 px-3 py-2">
                <TrendingUp className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{data.goal}</span>
                <ChevronDown className="ml-auto h-4 w-4 text-gray-400" />
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-lg font-bold text-gray-900">
                  {data.acos}%
                </div>
                <span className="text-sm text-gray-600">ACOS Limit</span>
              </div>
            </div>
            {/* Mini bar chart */}
            <div className="flex h-12 items-end gap-1" aria-hidden="true">
              {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95].map((height, i) => (
                <div
                  key={i}
                  className="w-2 rounded-t"
                  style={{
                    height: `${height}%`,
                    background: `hsl(${hue + 180}, 70%, 65%)`,
                    opacity: 0.6,
                  }}
                />
              ))}
            </div>
          </div>
        )

      case "stockout":
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-semibold text-gray-900">Stockout Notification</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white/50 px-3 py-2">
                <span className="text-sm text-gray-700">Send Email</span>
                <ChevronDown className="ml-auto h-4 w-4 text-gray-400" />
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-lg font-bold text-gray-900">
                  {data.days}
                </div>
                <span className="text-sm text-gray-600">Days</span>
              </div>
              <p className="text-xs text-gray-500">before estimated stockout</p>
            </div>
          </div>
        )

      case "optimize":
        return (
          <div className="space-y-3">
            <div className="space-y-2">
              {["🇺🇸", "🇨🇦", "🇬🇧", "🇬🇧"].map((flag, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded border border-purple-300 bg-purple-50">
                    <input type="checkbox" checked className="h-4 w-4 text-purple-600" readOnly />
                  </div>
                  <span className="text-lg">{flag}</span>
                  <div className="h-2 flex-1 rounded-full bg-gray-200" />
                </div>
              ))}
            </div>
            <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
              Optimize {data.count} listings
            </button>
          </div>
        )

      case "creator":
        return (
          <div className="space-y-3">
            <span className="text-sm font-semibold text-gray-900">Choose Creator</span>
            <div className="flex gap-2">
              <div
                className="h-16 w-16 overflow-hidden rounded-lg border-2 border-purple-400 bg-gradient-to-br from-purple-200 to-pink-200"
                style={{
                  borderColor: slideIndex % 2 === 0 ? "rgb(168, 85, 247)" : "transparent",
                }}
              >
                <div className="flex h-full items-center justify-center text-2xl">👤</div>
              </div>
              <div
                className="h-16 w-16 overflow-hidden rounded-lg border-2 bg-gradient-to-br from-blue-200 to-cyan-200"
                style={{
                  borderColor: slideIndex % 2 === 1 ? "rgb(168, 85, 247)" : "transparent",
                }}
              >
                <div className="flex h-full items-center justify-center text-2xl">👤</div>
              </div>
            </div>
            {/* Phone mockup ghost */}
            <div className="relative h-24 opacity-30" aria-hidden="true">
              <div className="absolute right-0 h-24 w-12 rounded-lg border border-gray-300 bg-white shadow-sm">
                <div className="m-1 h-1 w-4 rounded-full bg-gray-300" />
                <div className="m-1 space-y-1">
                  <div className="h-2 w-8 rounded bg-gray-200" />
                  <div className="h-2 w-6 rounded bg-gray-200" />
                </div>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <motion.div
      className={`absolute z-20 hidden md:block ${positionClasses[position]}`}
      style={{
        x: parallaxX,
        y: parallaxY,
      }}
      animate={{
        x: offset.x,
        y: offset.y,
      }}
      transition={{
        duration: 6,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
      aria-hidden="true"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="rounded-xl border border-white/60 bg-white/78 p-4 shadow-[0_10px_30px_rgba(17,24,39,0.10)] backdrop-blur-md"
        style={{
          minWidth: type === "ai-campaigns" ? "240px" : "200px",
        }}
      >
        {renderContent()}
      </motion.div>
    </motion.div>
  )
}
