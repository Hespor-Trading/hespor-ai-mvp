"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export function FooterCta() {
  return (
    <section className="py-20 md:py-32">
      <div className="mx-auto max-w-[1200px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-[var(--brand-green)]/30 bg-gradient-to-br from-[var(--brand-green)]/10 to-transparent p-12 md:p-16 text-center"
        >
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Ready to Talk to Your Ads?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
            Start free and see your campaigns learn, optimize, and scale automatically.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button
                size="lg"
                className="h-12 min-w-[200px] bg-[var(--brand-green)] text-base font-semibold text-white hover:bg-[var(--brand-green-dark)] hover:scale-105 transition-transform"
              >
                Start Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button
                size="lg"
                variant="outline"
                className="h-12 min-w-[200px] border-2 text-base font-semibold bg-transparent hover:bg-white/50 hover:scale-105 transition-transform"
              >
                Book a Demo
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
