import { SiteShell } from "@/components/site-shell"
import { Hero } from "@/components/hero"
import { AiChatDemo } from "@/components/ai-chat-demo"
import { Features } from "@/components/features"
import { HowItWorks } from "@/components/how-it-works"
import { BrandMarquee } from "@/components/brand-marquee"
import { Pricing } from "@/components/pricing"
import { Testimonials } from "@/components/testimonials"
import { BlogSection } from "@/components/blog-section"
import { AmazonComplianceSection } from "@/components/amazon-compliance-section"
import { FinanceSection } from "@/components/finance-section"
import { FooterCta } from "@/components/footer-cta"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <SiteShell>
      <main>
        <Hero />
        <AiChatDemo />
        <Features />
        <HowItWorks />
        <BrandMarquee />
        <Pricing />
        <Testimonials />
        <BlogSection />
        <AmazonComplianceSection />
        <FinanceSection />
        <FooterCta />
      </main>
      <Footer />
    </SiteShell>
  )
}
