"use client"

import { motion } from "framer-motion"

const brands = [
  "Amazon Partners",
  "AMZ One Step",
  "Incrementum",
  "Headline",
  "Toucan Labs",
  "Decada",
  "Snowball Partners",
  "Nexus Brands",
  "Atomberg",
  "Marico",
]

export function BrandMarquee() {
  return (
    <section className="py-12 md:py-16 overflow-hidden">
      <div className="mx-auto max-w-[1400px]">
        <p className="text-center text-sm text-muted-foreground mb-8">Trusted by leading Amazon brands and agencies</p>

        <div className="space-y-8">
          {/* First row - left to right */}
          <div className="relative">
            <motion.div
              className="flex gap-12"
              animate={{
                x: [0, -1000],
              }}
              transition={{
                x: {
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                  duration: 30,
                  ease: "linear",
                },
              }}
            >
              {[...brands, ...brands, ...brands].map((brand, index) => (
                <div
                  key={`row1-${index}`}
                  className="flex-shrink-0 px-8 py-4 text-lg font-semibold text-muted-foreground/70 hover:text-foreground transition-colors whitespace-nowrap"
                >
                  {brand}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Second row - right to left */}
          <div className="relative">
            <motion.div
              className="flex gap-12"
              animate={{
                x: [-1000, 0],
              }}
              transition={{
                x: {
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                  duration: 30,
                  ease: "linear",
                },
              }}
            >
              {[...brands, ...brands, ...brands].map((brand, index) => (
                <div
                  key={`row2-${index}`}
                  className="flex-shrink-0 px-8 py-4 text-lg font-semibold text-muted-foreground/70 hover:text-foreground transition-colors whitespace-nowrap"
                >
                  {brand}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
