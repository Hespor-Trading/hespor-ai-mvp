"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

/** ---------- DATA (same structure you had) ---------- */
interface MetricBox {
  id: string
  label: string
  value: string
  icon?: "up" | "down" | "neutral"
  angle: number       // keep using your angles but we won’t rotate; we’ll use them to place around product
  radius: number      // ignored (we auto-scale), but kept for compatibility
  scale?: number
  sparkline?: number[]
  marketplace?: "US" | "EU" | "CA"
  subtext?: string
}
interface ProductSlide {
  id: string
  name: string
  image: string
  metrics?: MetricBox[][]
}

// ✅ paste your slides array exactly as you have it now
const slides: ProductSlide[] = [/* ... your existing slides array ... */]

/** ---------- SMALL HELPERS ---------- */
function MiniSparkline({ data }: { data: number[] }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * 40},${16 - ((v - min) / range) * 12}`)
    .join(" ")
  return (
    <svg width="40" height="16" className="opacity-60">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
function MarketplaceBadge({ marketplace }: { marketplace: "US" | "EU" | "CA" }) {
  const flags = { US: "🇺🇸", EU: "🇪🇺", CA: "🇨🇦" }
  return (
    <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
      <span>{flags[marketplace]}</span><span>{marketplace}</span>
    </div>
  )
}

/** ---------- MAIN ---------- */
export function DynamicProductShowcase() {
  const [i, setI] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setI((p) => (p + 1) % slides.length)
        setVisible(true)
      }, 250)
    }, 12000)
    return () => clearInterval(t)
  }, [])

  // Responsive spacing so cards don’t cover the product
  const vw = typeof window !== "undefined" ? window.innerWidth : 1440
  const R =
    vw >= 1536 ? 250 :
    vw >= 1280 ? 220 :
    vw >= 1024 ? 200 :
    vw >= 768  ? 180 : 160

  const slide = slides[i]
  const metrics = (slide.metrics?.[0] ?? []).slice(0, 4) // show up to 4 neatly

  return (
    <div className="relative flex h-[600px] w-full items-center justify-center overflow-visible">
      {/* soft brand glow */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        animate={{ opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="h-[420px] w-[420px] rounded-full bg-gradient-radial from-[var(--brand-green)]/35 via-[var(--brand-green)]/12 to-transparent blur-3xl" />
      </motion.div>

      {/* Product */}
      <AnimatePresence mode="wait">
        {visible && (
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="relative z-10"
          >
            <motion.div
              className="relative h-[320px] w-[320px]"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src={slide.image || "/placeholder.svg"}
                alt={slide.name}
                fill
                className="object-contain"
                style={{ filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.12))" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating metric cards (no orbit; fixed around product, gentle bob) */}
      <div className="absolute inset-0 pointer-events-none">
        {metrics.map((m, idx) => {
          // Convert your angle (0° at +X axis) into a position around the product, but DO NOT rotate over time.
          const angleRad = (m.angle * Math.PI) / 180
          const x = Math.cos(angleRad) * R
          const y = Math.sin(angleRad) * R

          return (
            <motion.div
              key={m.id}
              className="absolute z-20"
              style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, transform: "translate(-50%,-50%)" }}
              initial={{ opacity: 0, y: y + 8 }}
              animate={{ opacity: 1, y: [y, y - 6, y] }}
              transition={{
                delay: idx * 0.06,
                duration: 5.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div
                className="pointer-events-auto min-w-[180px] rounded-xl border border-white/50 bg-white/90 px-4 py-3 shadow-lg backdrop-blur-md"
                style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)" }}
              >
                {m.marketplace && (
                  <div className="mb-2">
                    <MarketplaceBadge marketplace={m.marketplace} />
                  </div>
                )}

                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-muted-foreground">{m.label}</p>
                    <p className="mt-0.5 text-lg font-bold text-foreground">{m.value}</p>
                    {m.subtext && <p className="mt-1 text-[10px] text-muted-foreground">{m.subtext}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {m.icon === "up" && <TrendingUp className="h-4 w-4 text-emerald-600" />}
                    {m.icon === "down" && <TrendingDown className="h-4 w-4 text-red-600" />}
                    {m.icon === "neutral" && <Minus className="h-4 w-4 text-gray-600" />}
                    {m.sparkline && (
                      <div className="text-emerald-600">
                        <MiniSparkline data={m.sparkline} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
