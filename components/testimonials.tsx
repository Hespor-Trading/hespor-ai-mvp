"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Ralph T.",
    company: "Decogar",
    text: "ACOS fell from 24% → 15% in 30 days while sales doubled. The chat made optimization effortless.",
    rating: 5,
  },
  {
    name: "Sofia L.",
    company: "Trendora Home",
    text: "Spotted wasted spend instantly. Dayparting now saves hundreds monthly.",
    rating: 5,
  },
  {
    name: "Marcus D.",
    company: "Adflux Brands",
    text: "Every AI change is logged and explained — finally transparent automation.",
    rating: 5,
  },
  {
    name: "Ella K.",
    company: "Lumetis Goods",
    text: "We scaled without touching manual bids. Unreal.",
    rating: 5,
  },
  {
    name: "Jon V.",
    company: "Growvex Labs",
    text: "The chat alone beats anything else we tried.",
    rating: 5,
  },
  {
    name: "Priya N.",
    company: "Marketly",
    text: "Accurate bid logic and easy control. Trustworthy platform.",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="py-20 md:py-32 overflow-hidden">
      <div className="mx-auto max-w-[1200px] px-6 md:px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Trusted by Amazon Sellers
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
            See what our customers are saying about Hespor AI.
          </p>
        </motion.div>

        <div className="relative h-[600px]">
          {/* Left Column - Scrolling Up */}
          <div className="absolute left-0 w-1/2 pr-4 h-full overflow-hidden">
            <motion.div
              className="space-y-6"
              animate={{
                y: [0, -50 * testimonials.length],
              }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <div
                  key={`left-${index}`}
                  className="rounded-xl border border-border/50 bg-white/50 p-6 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="mb-3 flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[var(--brand-green)] text-[var(--brand-green)]" />
                    ))}
                  </div>
                  <p className="mb-4 text-sm text-muted-foreground leading-relaxed">{testimonial.text}</p>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.company}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column - Scrolling Down */}
          <div className="absolute right-0 w-1/2 pl-4 h-full overflow-hidden">
            <motion.div
              className="space-y-6"
              animate={{
                y: [-50 * testimonials.length, 0],
              }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <div
                  key={`right-${index}`}
                  className="rounded-xl border border-border/50 bg-white/50 p-6 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="mb-3 flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[var(--brand-green)] text-[var(--brand-green)]" />
                    ))}
                  </div>
                  <p className="mb-4 text-sm text-muted-foreground leading-relaxed">{testimonial.text}</p>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.company}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Fade Overlays */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#E6F9F2] to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#E6F9F2] to-transparent" />
        </div>
      </div>
    </section>
  )
}
