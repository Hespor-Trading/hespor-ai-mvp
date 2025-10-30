"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { KpiCard } from "./kpi-card"
import { motion, AnimatePresence } from "framer-motion"

interface ProductSlide {
  id: string
  name: string
  image: string
  revenue: string
  acos: string
  trend: "up" | "down" | "neutral"
}

const slides: ProductSlide[] = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    image: "/premium-wireless-headphones-product-transparent-ba.jpg",
    revenue: "$2.8M",
    acos: "11.9%",
    trend: "up",
  },
  {
    id: "2",
    name: "Smart Fitness Tracker",
    image: "/smart-fitness-tracker-product-transparent-backgrou.jpg",
    revenue: "$4.3M",
    acos: "14.7%",
    trend: "up",
  },
  {
    id: "3",
    name: "Portable Bluetooth Speaker",
    image: "/portable-bluetooth-speaker-product-transparent-bac.jpg",
    revenue: "$1.2M",
    acos: "18.3%",
    trend: "neutral",
  },
]

export function StaticProductShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length)
        setIsVisible(true)
      }, 300)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const currentSlide = slides[currentIndex]

  return (
    <div className="relative flex h-[500px] w-full items-center justify-center">
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="h-[350px] w-[350px] rounded-full bg-gradient-radial from-[var(--brand-green)]/20 via-[var(--brand-green)]/5 to-transparent blur-2xl" />
      </motion.div>

      {/* Orbiting Ring with gentle animation */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="h-[380px] w-[380px] rounded-full border-2 border-[var(--brand-green)]/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
      </div>

      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
            style={{
              filter: "drop-shadow(0 10px 30px rgba(0, 0, 0, 0.08))",
            }}
          >
            <motion.div
              className="relative h-[300px] w-[300px]"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 6,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <Image
                src={currentSlide.image || "/placeholder.svg"}
                alt={currentSlide.name}
                fill
                className="object-contain"
                style={{
                  filter: "drop-shadow(0 10px 30px rgba(0, 0, 0, 0.08))",
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isVisible && (
          <>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: 1,
                x: 0,
                y: [0, -5, 0],
              }}
              exit={{ opacity: 0, x: -20 }}
              transition={{
                delay: 0.1,
                duration: 0.3,
                y: {
                  duration: 6,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                },
              }}
            >
              <KpiCard
                label="Annual Revenue"
                value={currentSlide.revenue}
                trend={currentSlide.trend}
                className="absolute left-0 top-1/4"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{
                opacity: 1,
                x: 0,
                y: [0, 5, 0],
              }}
              exit={{ opacity: 0, x: 20 }}
              transition={{
                delay: 0.2,
                duration: 0.3,
                y: {
                  duration: 6,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 1,
                },
              }}
            >
              <KpiCard
                label="ACoS"
                value={currentSlide.acos}
                trend={currentSlide.trend === "up" ? "down" : "up"}
                className="absolute right-0 top-1/3"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: [0, -5, 0],
              }}
              exit={{ opacity: 0, y: 20 }}
              transition={{
                delay: 0.3,
                duration: 0.3,
                y: {
                  duration: 6,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 2,
                },
              }}
            >
              <KpiCard label="Growth Rate" value="+127%" trend="up" className="absolute bottom-1/4 left-8" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: [0, 5, 0],
              }}
              exit={{ opacity: 0, y: 20 }}
              transition={{
                delay: 0.4,
                duration: 0.3,
                y: {
                  duration: 6,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 3,
                },
              }}
            >
              <KpiCard label="ROAS" value="4.2x" trend="up" className="absolute bottom-1/3 right-8" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
