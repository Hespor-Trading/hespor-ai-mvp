"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

export function FinanceSection() {
  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-[1200px] px-6 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-xl border border-[var(--brand-green)]/10 bg-[var(--brand-green)]/[0.03] p-8 text-center backdrop-blur-sm"
        >
          <p className="mb-2 text-xs font-medium text-[var(--brand-green)] uppercase tracking-wide">
            Other Hespor Divisions
          </p>
          <h3 className="mb-2 text-lg font-semibold text-foreground md:text-xl">
            Hespor Finance — Cashflow Flexibility for Amazon Sellers
          </h3>
          <p className="mx-auto mb-6 max-w-2xl text-sm text-muted-foreground leading-relaxed">
            Trusted payment-term and cashflow solutions for Amazon sellers and importers.
          </p>
          <a href="https://finance.hespor.com" target="_blank" rel="noopener noreferrer">
            <Button
              size="sm"
              className="bg-[var(--brand-green)] text-white hover:bg-[var(--brand-green-dark)] transition-colors"
            >
              Visit Finance Division
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
