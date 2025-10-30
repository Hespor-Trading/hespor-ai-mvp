"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion"
import { KpiCard } from "./kpi-card"

interface Slide {
  id: string
  image: string
}

interface HeroShowcaseProps {
  slides: Slide[]
  intervalMs?: number
  hue?: number
  showNoise?: boolean
}

const slideData = [
  {
    acos: 18.5,
    goal: "Grow",
    days: 30,
    optimizeCount: 4,
    marketplaces: ["US", "CA", "UK", "GB"],
  },
  {
    acos: 15.5,
    goal: "Profit",
    days: 30,
    optimizeCount: 4,
    marketplaces: ["US", "CA", "UK", "GB"],
  },
  {
    acos: 14.9,
    goal: "Scale",
    days: 45,
    optimizeCount: 4,
    marketplaces: ["US", "CA", "UK", "GB"],
  },
  {
    acos: 22.0,
    goal: "Grow",
    days: 15,
    optimizeCount: 4,
    marketplaces: ["US", "CA", "UK", "GB"],
  },
  {
    acos: 16.8,
    goal: "Profit",
    days: 60,
    optimizeCount: 4,
    marketplaces: ["US", "CA", "UK", "GB"],
  },
  {
    acos: 19.2,
    goal: "Scale",
    days: 25,
    optimizeCount: 4,
    marketplaces: ["US", "CA", "UK", "GB"],
  },
]

export function HeroShowcase({ slides, intervalMs = 3000, hue = 210, showNoise = false }: HeroShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 })

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener("change", handler)
    return () => mediaQuery.removeEventListener("change", handler)
  }, [])

  // Auto-rotate slides
  useEffect(() => {
    if (prefersReducedMotion || isPaused) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, intervalMs)

    return () => clearInterval(interval)
  }, [slides.length, intervalMs, isPaused, prefersReducedMotion])

  // Handle mouse move for parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || prefersReducedMotion) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height

    mouseX.set(x * 14)
    mouseY.set(y * 14)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsPaused(false)
  }

  // Handle touch for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      // Swipe left
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    } else if (touchEndX.current - touchStartX.current > 50) {
      // Swipe right
      setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
    }
  }

  const currentData = slideData[currentIndex % slideData.length]

  return (
    <div
      ref={containerRef}
      className="relative min-h-[520px] w-full overflow-hidden md:min-h-[680px] lg:min-h-[760px]"
      style={{
        background: `linear-gradient(135deg, #FFE7EF 0%, #EAF0FF 100%)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsPaused(true)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Noise overlay */}
      {showNoise && (
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Dynamic blob background */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-3xl"
        style={{
          background: `radial-gradient(circle, hsl(${hue}, 90%, 70%) 0%, transparent 70%)`,
        }}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        aria-hidden="true"
      />

      {/* Central product container */}
      <div className="relative flex h-full items-center justify-center px-4 py-12">
        <motion.div
          className="relative z-10"
          style={{
            x: springX,
            y: springY,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{
                duration: 0.52,
                ease: [0.22, 0.61, 0.36, 1],
              }}
              className="relative"
            >
              {slides[currentIndex]?.image ? (
                <img
                  src={slides[currentIndex].image || "/placeholder.svg"}
                  alt={`${slides[currentIndex].id} product`}
                  className="h-[300px] w-[300px] object-contain drop-shadow-2xl md:h-[400px] md:w-[400px] lg:h-[500px] lg:w-[500px]"
                  loading={currentIndex === 0 ? "eager" : "lazy"}
                  role="img"
                />
              ) : (
                <div
                  className="flex h-[300px] w-[300px] items-center justify-center rounded-3xl md:h-[400px] md:w-[400px] lg:h-[500px] lg:w-[500px]"
                  style={{
                    background: `linear-gradient(135deg, hsl(${hue}, 70%, 60%) 0%, hsl(${hue + 40}, 70%, 60%) 100%)`,
                  }}
                  role="img"
                  aria-label={`${slides[currentIndex].id} placeholder`}
                >
                  <div className="text-6xl opacity-20">📦</div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Floating KPI Cards */}
        <KpiCard
          type="ai-campaigns"
          position="top-right"
          data={{
            goal: currentData.goal,
            acos: currentData.acos,
          }}
          hue={hue}
          parallaxX={springX}
          parallaxY={springY}
          slideIndex={currentIndex}
        />

        <KpiCard
          type="stockout"
          position="bottom-left"
          data={{
            days: currentData.days,
          }}
          hue={hue}
          parallaxX={springX}
          parallaxY={springY}
          slideIndex={currentIndex}
        />

        <KpiCard
          type="optimize"
          position="top-left"
          data={{
            count: currentData.optimizeCount,
            marketplaces: currentData.marketplaces,
          }}
          hue={hue}
          parallaxX={springX}
          parallaxY={springY}
          slideIndex={currentIndex}
        />

        <KpiCard
          type="creator"
          position="bottom-right"
          data={{}}
          hue={hue}
          parallaxX={springX}
          parallaxY={springY}
          slideIndex={currentIndex}
        />
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2" role="tablist">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex ? "w-8 bg-purple-600" : "w-2 bg-purple-600/30"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            role="tab"
            aria-selected={index === currentIndex}
          />
        ))}
      </div>
    </div>
  )
}
