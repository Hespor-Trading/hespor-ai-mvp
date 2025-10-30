"use client"

import { motion } from "framer-motion"

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Connect",
      description: "Link your Amazon Ads & SP-API in seconds.",
    },
    {
      number: "02",
      title: "Analyze",
      description: "AI learns 90 days of campaign performance.",
    },
    {
      number: "03",
      title: "Optimize",
      description: "Auto-applies bid, budget, and negative keyword updates.",
    },
    {
      number: "04",
      title: "Chat",
      description: "Ask live questions and see what the AI has changed, instantly.",
    },
  ]

  return (
    <section id="how-it-works" className="py-20 md:py-32">
      <div className="mx-auto max-w-[1200px] px-6 md:px-6">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            How It Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
            Get started in four simple steps and let AI handle your Amazon PPC.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
            >
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-16 hidden h-0.5 w-full bg-gradient-to-r from-[var(--brand-green)]/50 to-transparent lg:block" />
              )}
              <motion.div
                className="relative rounded-xl border border-border/50 bg-white/50 p-8 backdrop-blur-sm"
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[var(--brand-green)]/10 text-2xl font-bold text-[var(--brand-green)]">
                  {step.number}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
