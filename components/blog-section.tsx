"use client"

import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

const articles = [
  {
    title: "AI Automation for Amazon PPC",
    description: "Understanding AI-driven optimization and how it transforms your advertising strategy.",
    readTime: "8 min read",
  },
  {
    title: "Top ASIN Optimization Workflows",
    description: "Scaling strategies for Amazon sellers looking to maximize their product performance.",
    readTime: "6 min read",
  },
  {
    title: "How Chat-Driven Insights Boost ROAS",
    description: "Learn to use natural language queries to unlock powerful advertising insights.",
    readTime: "7 min read",
  },
]

export function BlogSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="mx-auto max-w-[1200px] px-6 md:px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Insights from Hespor AI
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
            Expert insights on Amazon PPC automation and AI-driven advertising strategies.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {articles.map((article, index) => (
            <motion.article
              key={article.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group rounded-xl border border-border/50 bg-white/50 p-8 backdrop-blur-sm transition-all hover:border-[var(--brand-green)]/50 hover:shadow-lg cursor-pointer"
            >
              <div className="mb-4 text-sm text-muted-foreground">{article.readTime}</div>
              <h3 className="mb-3 text-xl font-semibold text-foreground group-hover:text-[var(--brand-green)] transition-colors">
                {article.title}
              </h3>
              <p className="mb-4 text-muted-foreground">{article.description}</p>
              <div className="flex items-center text-[var(--brand-green)] font-medium">
                Read more
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
