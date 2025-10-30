import { SiteShell } from "@/components/site-shell"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { AiChatDemo } from "@/components/ai-chat-demo"
import { Features } from "@/components/features"
import { HowItWorks } from "@/components/how-it-works"
import { BrandMarquee } from "@/components/brand-marquee"
import { Pricing } from "@/components/pricing"
import { LiveResults } from "@/components/live-results"
import { BlogSection } from "@/components/blog-section"
import { FooterCta } from "@/components/footer-cta"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <SiteShell>
      <Header />
      <main>
        <Hero />
        <AiChatDemo />
        <Features />
        <HowItWorks />
        <BrandMarquee />
        <Pricing />
        <LiveResults />
        <BlogSection />
        <FooterCta />
      </main>
      <Footer />
    </SiteShell>
  )
}
