"use client"

import { MessageSquare, TrendingUp, Clock, Zap, Package, Eye } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    icon: MessageSquare,
    title: "Chat to Data",
    description: "Plain-English analysis. Ask anything and get insights instantly.",
  },
  {
    icon: TrendingUp,
    title: "Gradual Learning",
    description: "Improves daily from your results. The algorithm adapts from past performance.",
  },
  {
    icon: Zap,
    title: "Real-Time Bid Engine",
    description: "Bids & budgets adapt in-flight. Adjusts as results change.",
  },
  {
    icon: Clock,
    title: "Smart Dayparting",
    description: "Hourly bid curves that match conversion windows. Learns when your ads convert best.",
  },
  {
    icon: Package,
    title: "Inventory-Aware Rules",
    description: "Protects budget on low stock. Pauses ads when inventory is low.",
  },
  {
    icon: Eye,
    title: "Transparent Logs & Undo",
    description: "Every AI change is visible and reversible. See every decision and revert anytime.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 md:py-32">
      <div className="mx-auto max-w-[1200px] px-6 md:px-6">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Built Different
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
            The features that set Hespor apart from traditional PPC tools.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group relative rounded-xl border border-border/50 bg-white/50 p-8 backdrop-blur-sm transition-all hover:border-[var(--brand-green)]/50 hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--brand-green)]/10 text-[var(--brand-green)] transition-colors group-hover:bg-[var(--brand-green)] group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
