"use client"

import { TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

export function LiveResults() {
  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-[1200px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-[var(--brand-green)]/30 bg-gradient-to-r from-[var(--brand-green)]/5 to-transparent p-8 md:p-12"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-green)]/10">
                  <TrendingUp className="h-6 w-6 text-[var(--brand-green)]" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Real Results</h3>
              </div>
              <p className="text-lg text-foreground leading-relaxed">
                <span className="font-semibold">Drawer Organizer Co.</span> cut ACOS from{" "}
                <span className="text-red-500 line-through">24%</span> →{" "}
                <span className="text-[var(--brand-green)] font-bold">14.9%</span>, ROAS grew{" "}
                <span className="text-[var(--brand-green)] font-bold">+42%</span> in 28 days.
              </p>
            </div>

            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--brand-green)]">14.9%</div>
                <div className="text-sm text-muted-foreground">ACOS</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--brand-green)]">+42%</div>
                <div className="text-sm text-muted-foreground">ROAS Growth</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--brand-green)]">28</div>
                <div className="text-sm text-muted-foreground">Days</div>
              </div>
            </div>
          </div>

          {/* Mini sparkline */}
          <div className="mt-8 h-16 flex items-end gap-1">
            {[30, 45, 40, 55, 50, 65, 60, 75, 70, 80, 85, 90].map((height, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                whileInView={{ height: `${height}%` }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="flex-1 bg-[var(--brand-green)]/30 rounded-t"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
