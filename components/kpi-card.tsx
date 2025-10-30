"use client"

import { cn } from "@/lib/utils"

interface KpiCardProps {
  label: string
  value: string
  trend?: "up" | "down" | "neutral"
  className?: string
}

export function KpiCard({ label, value, trend, className }: KpiCardProps) {
  return (
    <div
      className={cn(
        "kpi-card-enter rounded-lg border border-border/50 bg-white/90 backdrop-blur-sm px-4 py-3 shadow-lg",
        className,
      )}
    >
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="mt-1 flex items-baseline space-x-2">
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {trend && (
          <div
            className={cn(
              "text-xs font-medium",
              trend === "up" && "text-green-600",
              trend === "down" && "text-red-600",
              trend === "neutral" && "text-muted-foreground",
            )}
          >
            {trend === "up" && "↑"}
            {trend === "down" && "↓"}
          </div>
        )}
      </div>
    </div>
  )
}
