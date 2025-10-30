"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { TrendingUp, CheckCircle2 } from "lucide-react"

interface MiniShowcaseProps {
  productImage: string
  productName: string
  metrics: Array<{
    label: string
    value: string
    icon?: "up" | "check"
  }>
}

export function MiniShowcase({ productImage, productName, metrics }: MiniShowcaseProps) {
  return (
    <div className="relative flex h-[300px] w-full items-center justify-center">
      {/* Subtle glow */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      >
        <div className="h-[200px] w-[200px] rounded-full bg-gradient-radial from-[var(--brand-green)]/20 via-[var(--brand-green)]/5 to-transparent blur-2xl" />
      </motion.div>

      {/* Product */}
      <motion.div
        className="relative z-10"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      >
        <div className="relative h-[150px] w-[150px]">
          <Image
            src={productImage || "/placeholder.svg"}
            alt={productName}
            fill
            className="object-contain"
            style={{ filter: "drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1))" }}
          />
        </div>
      </motion.div>

      {/* Metric boxes */}
      {metrics.map((metric, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, y: [0, -2, 0] }}
          transition={{
            delay: index * 0.15,
            duration: 0.4,
            y: {
              duration: 2.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: index * 0.3,
            },
          }}
          className="absolute z-20"
          style={{
            top: index === 0 ? "10%" : index === 1 ? "20%" : "auto",
            bottom: index === 2 ? "15%" : "auto",
            left: index % 2 === 0 ? "0" : "auto",
            right: index % 2 === 1 ? "0" : "auto",
          }}
        >
          <div
            className="rounded-lg border border-white/40 bg-white/90 px-3 py-2 shadow-md backdrop-blur-sm"
            style={{ boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)" }}
          >
            <div className="flex items-center gap-2">
              <div>
                <p className="text-[10px] font-medium text-muted-foreground">{metric.label}</p>
                <p className="text-sm font-bold text-foreground">{metric.value}</p>
              </div>
              {metric.icon === "up" && <TrendingUp className="h-3 w-3 text-emerald-600" />}
              {metric.icon === "check" && <CheckCircle2 className="h-3 w-3 text-emerald-600" />}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
