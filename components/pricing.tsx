"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

const plans = [
  {
    name: "Free",
    tagline: "Try before you automate",
    price: { monthly: 0, annual: 0 },
    features: ["1 ASIN access", "Read-only analytics", "AI chat demo", "Weekly report"],
  },
  {
    name: "Starter",
    tagline: "Automation for one ASIN set",
    price: { monthly: 59, annual: 568 },
    annualMonthly: 47,
    features: ["Auto bids & negatives", "Keyword harvesting", "AI chat", "Weekly insights"],
    popular: false,
  },
  {
    name: "Growth",
    tagline: "Full power for multi-ASIN brands",
    price: { monthly: 329, annual: 3158 },
    annualMonthly: 263,
    features: ["Dayparting", "Inventory-aware rules", "Change log & undo", "Team access", "Live support"],
    popular: true,
  },
  {
    name: "Scale",
    tagline: "Agencies / advanced sellers",
    price: { monthly: 499, annual: 4790 },
    annualMonthly: 399,
    features: ["5 brands", "Slack/API alerts", "Custom rule editor", "Cross-market dashboards", "Priority support"],
  },
]

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <section id="pricing" className="py-20 md:py-32">
      <div className="mx-auto max-w-[1200px] px-6 md:px-6">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
            Choose the plan that fits your business. Scale as you grow.
          </p>

          {/* Billing Toggle */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <span className={`text-sm font-medium ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-[var(--brand-green)]/20 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)] focus:ring-offset-2"
              aria-label="Toggle billing period"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-[var(--brand-green)] transition-transform ${
                  isAnnual ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
              Annual
              <span className="ml-1 text-[var(--brand-green)]">(Save 20%)</span>
            </span>
          </div>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`relative rounded-xl border p-8 backdrop-blur-sm ${
                plan.popular ? "border-[var(--brand-green)] bg-white/70 shadow-lg" : "border-border/50 bg-white/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[var(--brand-green)] px-4 py-1 text-xs font-semibold text-white">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{plan.tagline}</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold text-foreground">
                    ${isAnnual && plan.annualMonthly ? plan.annualMonthly : plan.price.monthly}
                  </span>
                  <span className="ml-2 text-muted-foreground">/mo</span>
                </div>
                {isAnnual && plan.price.annual > 0 && (
                  <p className="mt-1 text-xs text-muted-foreground">${plan.price.annual}/yr</p>
                )}
              </div>

              <ul className="mb-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-5 w-5 flex-shrink-0 text-[var(--brand-green)]" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="https://app.hespor.com/auth/login">
                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-[var(--brand-green)] text-white hover:bg-[var(--brand-green-dark)]"
                      : "bg-transparent border-2 border-border hover:bg-white/50"
                  }`}
                >
                  Get Started
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
