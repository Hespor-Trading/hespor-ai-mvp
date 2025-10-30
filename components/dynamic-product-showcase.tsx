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
  angle: number // keep using your angles but we won’t rotate; we’ll use them to place around product
  radius: number // ignored (we auto-scale), but kept for compatibility
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
const slides: ProductSlide[] = [
  {
    id: "product-1",
    name: "Running Shoes",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/71eqRkYOS3L._AC_SY695_-removebg-preview-ZCvUFWfUluUWnJ3nNu5D5HWKbpT5Gq.png",
    metrics: [
      [
        {
          id: "ctr-1",
          label: "CTR",
          value: "2.7%",
          icon: "up",
          angle: 135,
          radius: 340,
          sparkline: [2.1, 2.3, 2.5, 2.7, 2.9],
          marketplace: "US",
          subtext: "↑ 0.4% vs last week",
        },
        {
          id: "acos-1",
          label: "ACoS",
          value: "18.1%",
          icon: "down",
          angle: 45,
          radius: 340,
          sparkline: [22, 20, 19, 18.5, 18.1],
          marketplace: "EU",
          subtext: "↓ 2.1% vs last week",
        },
        {
          id: "roas-1",
          label: "ROAS",
          value: "4.5×",
          icon: "up",
          angle: 225,
          radius: 340,
          sparkline: [3.8, 4.0, 4.2, 4.4, 4.5],
          marketplace: "CA",
          subtext: "↑ 0.7× vs last week",
        },
        {
          id: "spend-1",
          label: "Ad Spend",
          value: "$428",
          icon: "neutral",
          angle: 315,
          radius: 340,
          sparkline: [380, 395, 410, 420, 428],
          marketplace: "US",
          subtext: "Daily average",
        },
      ],
    ],
  },
  {
    id: "product-2",
    name: "Studio Speakers",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/51odD6JDkML._AC_SL1080_-removebg-preview-BQ3nQUVNUymggwvBlXbXXskJ0EMQLt.png",
    metrics: [
      [
        {
          id: "ctr-2",
          label: "CTR",
          value: "3.4%",
          icon: "up",
          angle: 135,
          radius: 340,
          sparkline: [2.8, 3.0, 3.2, 3.3, 3.4],
          marketplace: "US",
          subtext: "↑ 0.6% vs last week",
        },
        {
          id: "acos-2",
          label: "ACoS",
          value: "12.9%",
          icon: "down",
          angle: 45,
          radius: 340,
          sparkline: [16, 15, 14, 13.5, 12.9],
          marketplace: "EU",
          subtext: "↓ 3.1% vs last week",
        },
        {
          id: "roas-2",
          label: "ROAS",
          value: "6.1×",
          icon: "up",
          angle: 225,
          radius: 340,
          sparkline: [5.2, 5.5, 5.8, 6.0, 6.1],
          marketplace: "CA",
          subtext: "↑ 0.9× vs last week",
        },
        {
          id: "conversion-2",
          label: "Conversion Rate",
          value: "14.2%",
          icon: "up",
          angle: 315,
          radius: 340,
          sparkline: [12, 12.5, 13, 13.8, 14.2],
          marketplace: "US",
          subtext: "↑ 2.2% vs last week",
        },
      ],
    ],
  },
  {
    id: "product-3",
    name: "Jump Starter",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/71fQI6aWUyL._AC_SL1500_-removebg-preview-GRc3mBDXBfh3RhSgDZNa2myJ8jLqht.png",
    metrics: [
      [
        {
          id: "ctr-3",
          label: "CTR",
          value: "2.4%",
          icon: "neutral",
          angle: 135,
          radius: 340,
          sparkline: [2.3, 2.4, 2.5, 2.4, 2.4],
          marketplace: "US",
          subtext: "Stable",
        },
        {
          id: "acos-3",
          label: "ACoS",
          value: "19.3%",
          icon: "up",
          angle: 45,
          radius: 340,
          sparkline: [18, 18.5, 19, 19.2, 19.3],
          marketplace: "EU",
          subtext: "↑ 1.3% vs last week",
        },
        {
          id: "roas-3",
          label: "ROAS",
          value: "3.9×",
          icon: "down",
          angle: 225,
          radius: 340,
          sparkline: [4.5, 4.3, 4.1, 4.0, 3.9],
          marketplace: "CA",
          subtext: "↓ 0.6× vs last week",
        },
        {
          id: "spend-3",
          label: "Ad Spend",
          value: "$395",
          icon: "down",
          angle: 315,
          radius: 340,
          sparkline: [450, 430, 410, 400, 395],
          marketplace: "US",
          subtext: "Daily average",
        },
      ],
    ],
  },
  {
    id: "product-4",
    name: "Pet Bed",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/81CHV8%2Bx1cL._AC_SL1500_-removebg-preview-x0dELNPA3y39G8ujW472M8VUxrutq4.png",
    metrics: [
      [
        {
          id: "ctr-4",
          label: "CTR",
          value: "3.6%",
          icon: "up",
          angle: 135,
          radius: 340,
          sparkline: [3.0, 3.2, 3.4, 3.5, 3.6],
          marketplace: "US",
          subtext: "↑ 0.6% vs last week",
        },
        {
          id: "acos-4",
          label: "ACoS",
          value: "13.2%",
          icon: "down",
          angle: 45,
          radius: 340,
          sparkline: [17, 15.5, 14.5, 14, 13.2],
          marketplace: "EU",
          subtext: "↓ 3.8% vs last week",
        },
        {
          id: "roas-4",
          label: "ROAS",
          value: "5.8×",
          icon: "up",
          angle: 225,
          radius: 340,
          sparkline: [4.8, 5.1, 5.4, 5.6, 5.8],
          marketplace: "CA",
          subtext: "↑ 1.0× vs last week",
        },
        {
          id: "conversion-4",
          label: "Conversion Rate",
          value: "15.4%",
          icon: "up",
          angle: 315,
          radius: 340,
          sparkline: [13, 13.8, 14.5, 15, 15.4],
          marketplace: "US",
          subtext: "↑ 2.4% vs last week",
        },
      ],
    ],
  },
]

/** ---------- SMALL HELPERS ---------- */
function MiniSparkline({ data }: { data: number[] }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const points = data.map((v, i) => `${(i / (data.length - 1)) * 40},${16 - ((v - min) / range) * 12}`).join(" ")
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
      <span>{flags[marketplace]}</span>
      <span>{marketplace}</span>
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
      }, 200)
    }, 12000)
    return () => clearInterval(t)
  }, [])

  if (!slides || slides.length === 0) {
    return <div className="relative flex h-[520px] md:h-[560px] w-full items-center justify-center">Loading...</div>
  }

  const slide = slides[i] || slides[0]
  if (!slide) {
    return <div className="relative flex h-[520px] md:h-[560px] w-full items-center justify-center">Loading...</div>
  }

  const metrics = (slide.metrics?.[0] ?? []).slice(0, 4)

  const cardPositions = [
    "left-4 top-4 md:left-16 md:top-12", // Top-left
    "right-4 top-6 md:right-16 md:top-14", // Top-right
    "left-4 bottom-6 md:left-16 md:bottom-14", // Bottom-left
    "right-4 bottom-8 md:right-16 md:bottom-16", // Bottom-right
  ]

  return (
    <section className="w-full py-0">
      <div className="relative mx-auto w-full max-w-[1200px] h-[520px] md:h-[560px] overflow-visible">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[0, 1, 2].map((ring) => (
            <motion.div
              key={ring}
              className="absolute rounded-full border border-emerald-500/20"
              style={{
                width: `${320 + ring * 60}px`,
                height: `${320 + ring * 60}px`,
              }}
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4 + ring * 0.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: ring * 0.3,
              }}
            />
          ))}
          <motion.div
            className="h-[420px] w-[420px] rounded-full bg-gradient-radial from-emerald-500/25 via-emerald-500/10 to-transparent blur-3xl"
            animate={{ opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
        </div>

        <AnimatePresence mode="wait">
          {visible && (
            <motion.div
              key={slide.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              <div className="absolute z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] md:h-[380px] w-auto">
                <Image
                  src={slide.image || "/placeholder.svg"}
                  alt={slide.name}
                  width={380}
                  height={380}
                  className="h-full w-auto object-contain drop-shadow-xl"
                />
              </div>

              <div className="pointer-events-none">
                {metrics.map((m, idx) => (
                  <motion.section
                    key={m.id}
                    role="group"
                    aria-label={m.label}
                    className={`metric-card pointer-events-auto absolute z-20 ${cardPositions[idx]} w-[150px] h-[98px] md:w-[220px] md:h-[130px] rounded-2xl border border-white/60 bg-white/90 backdrop-blur-md shadow-xl p-3 md:p-4`}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      y: [-3, 0, -3],
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      opacity: { duration: 0.2, delay: idx * 0.12 },
                      y: {
                        duration: 4,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                        delay: idx * 0.12,
                      },
                    }}
                  >
                    <div className="flex flex-col justify-between h-full">
                      {m.marketplace && (
                        <div className="mb-1">
                          <MarketplaceBadge marketplace={m.marketplace} />
                        </div>
                      )}

                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] md:text-xs font-medium text-muted-foreground truncate">{m.label}</p>
                          <p className="mt-0.5 text-sm md:text-base font-bold text-foreground">{m.value}</p>
                          {m.subtext && (
                            <p className="mt-0.5 text-[8px] md:text-[9px] text-muted-foreground truncate">
                              {m.subtext}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-0.5">
                          {m.icon === "up" && <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-emerald-600" />}
                          {m.icon === "down" && <TrendingDown className="h-3 w-3 md:h-4 md:w-4 text-red-600" />}
                          {m.icon === "neutral" && <Minus className="h-3 w-3 md:h-4 md:w-4 text-gray-600" />}
                          {m.sparkline && (
                            <div className="text-emerald-600">
                              <MiniSparkline data={m.sparkline} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.section>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
