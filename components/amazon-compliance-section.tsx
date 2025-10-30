"use client"

import { motion } from "framer-motion"
import { Shield, Lock, FileCheck, ExternalLink } from "lucide-react"

export function AmazonComplianceSection() {
  return (
    <section className="relative overflow-hidden border-y border-border/40 bg-gradient-to-b from-emerald-50/30 to-white/50 py-16">
      <div className="mx-auto max-w-[1200px] px-6 md:px-6">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6 flex justify-center gap-2">
            <Shield className="h-8 w-8 text-[var(--brand-green)]" />
          </div>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Secure Amazon Integration — Verified & Compliant
          </h2>
          <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Hespor AI is an Amazon Verified Partner for advertising optimization, product research, and campaign
            management. We securely connect to your Amazon Seller Central and Amazon Ads data with full compliance to
            Amazon's data protection policies. We do not aggregate competitor data or share private seller information.
          </p>

          <div className="mb-12 flex flex-wrap justify-center gap-4">
            <a
              href="https://developer-docs.amazon.com/sp-api/docs/what-is-the-selling-partner-api"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[var(--brand-green)] hover:underline"
            >
              <FileCheck className="h-4 w-4" />
              Amazon Integration Documentation
              <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href="https://developer-docs.amazon.com/sp-api/docs/list-your-app-on-the-selling-partner-appstore"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[var(--brand-green)] hover:underline"
            >
              <FileCheck className="h-4 w-4" />
              Verified Partner Program
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="mb-12 grid gap-6 md:grid-cols-3">
            <motion.div
              className="rounded-lg border border-border/40 bg-white/80 p-6 backdrop-blur-sm"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Shield className="mx-auto mb-3 h-8 w-8 text-[var(--brand-green)]" />
              <h3 className="mb-2 text-sm font-semibold text-foreground">Secure Amazon Integration</h3>
              <p className="text-xs text-muted-foreground">
                Amazon Services Acceptable Use Policy fully adhered to in all operations.
              </p>
            </motion.div>

            <motion.div
              className="rounded-lg border border-border/40 bg-white/80 p-6 backdrop-blur-sm"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Lock className="mx-auto mb-3 h-8 w-8 text-[var(--brand-green)]" />
              <h3 className="mb-2 text-sm font-semibold text-foreground">Data Protection</h3>
              <p className="text-xs text-muted-foreground">
                Data protected per SP-API Acceptable Use Policy & Data Protection Policy.
              </p>
            </motion.div>

            <motion.div
              className="rounded-lg border border-border/40 bg-white/80 p-6 backdrop-blur-sm"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <FileCheck className="mx-auto mb-3 h-8 w-8 text-[var(--brand-green)]" />
              <h3 className="mb-2 text-sm font-semibold text-foreground">Privacy & Terms</h3>
              <p className="text-xs text-muted-foreground">
                Full transparency with Privacy Policy, Terms of Service, and Data Processing Addendum.
              </p>
            </motion.div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6" />
              <span className="text-sm font-semibold">Amazon Verified Partner</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6" />
              <span className="text-sm font-semibold">SOC 2 Compliant</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
