import { SiteShell } from "@/components/site-shell"
import { Footer } from "@/components/footer"
import { Shield, Target, Users, Zap } from "lucide-react"

export const metadata = {
  title: "About Us | Hespor AI",
  description: "Learn about Hespor AI's mission to revolutionize Amazon advertising with AI-powered automation.",
}

export default function AboutPage() {
  return (
    <SiteShell>
      <main className="py-20">
        <div className="mx-auto max-w-[900px] px-6">
          <h1 className="mb-6 text-4xl font-bold text-foreground md:text-5xl">About Hespor AI</h1>
          <p className="mb-8 text-xl leading-relaxed text-muted-foreground">
            Hespor is a next-generation AI platform that helps Amazon sellers automate advertising and performance
            management through secure data intelligence.
          </p>

          <div className="mb-12 space-y-6">
            <div className="rounded-lg border border-border/40 bg-white/80 p-6 backdrop-blur-sm">
              <div className="mb-3 flex items-center gap-3">
                <Target className="h-6 w-6 text-[var(--brand-green)]" />
                <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
              </div>
              <p className="leading-relaxed text-muted-foreground">
                To empower Amazon sellers with intelligent automation that learns from their data, optimizes campaigns
                in real-time, and provides conversational insights that drive profitability. We believe advertising
                should be simple, transparent, and powered by AI that works for you.
              </p>
            </div>

            <div className="rounded-lg border border-border/40 bg-white/80 p-6 backdrop-blur-sm">
              <div className="mb-3 flex items-center gap-3">
                <Zap className="h-6 w-6 text-[var(--brand-green)]" />
                <h2 className="text-2xl font-bold text-foreground">What We Do</h2>
              </div>
              <p className="leading-relaxed text-muted-foreground">
                Hespor AI combines advanced machine learning algorithms with secure Amazon integration to automatically
                manage bids, budgets, negative keywords, and dayparting strategies. Our conversational AI interface lets
                you chat with your Amazon Seller Central data and Amazon Ads data, ask questions, and get actionable
                insights without complex dashboards.
              </p>
            </div>

            <div className="rounded-lg border border-border/40 bg-white/80 p-6 backdrop-blur-sm">
              <div className="mb-3 flex items-center gap-3">
                <Shield className="h-6 w-6 text-[var(--brand-green)]" />
                <h2 className="text-2xl font-bold text-foreground">Compliance & Security</h2>
              </div>
              <p className="leading-relaxed text-muted-foreground">
                Hespor is an Amazon-verified SaaS solution provider, fully compliant with Amazon's data protection and
                acceptable use policies. We do not aggregate competitor data or share private seller information. Your
                data is encrypted and protected with industry-leading security. We maintain SOC 2 compliance and follow
                best practices for data security and privacy.
              </p>
            </div>

            <div className="rounded-lg border border-border/40 bg-white/80 p-6 backdrop-blur-sm">
              <div className="mb-3 flex items-center gap-3">
                <Users className="h-6 w-6 text-[var(--brand-green)]" />
                <h2 className="text-2xl font-bold text-foreground">Our Team</h2>
              </div>
              <p className="leading-relaxed text-muted-foreground">
                Founded by experienced Amazon sellers and AI engineers, Hespor AI was built to solve the challenges we
                faced managing our own advertising campaigns. We understand the complexity of Amazon PPC and have
                created a solution that combines automation with human insight.
              </p>
            </div>
          </div>

          <div className="rounded-lg border-2 border-[var(--brand-green)]/30 bg-gradient-to-br from-emerald-50/50 to-white p-8 text-center">
            <h2 className="mb-4 text-2xl font-bold text-foreground">Join Thousands of Sellers</h2>
            <p className="mb-6 text-muted-foreground">Start automating your Amazon advertising today with Hespor AI.</p>
            <a
              href="/auth/sign-up"
              className="inline-block rounded-lg bg-[var(--brand-green)] px-6 py-3 font-semibold text-white transition-transform hover:scale-105 hover:bg-[var(--brand-green-dark)]"
            >
              Get Started Free
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </SiteShell>
  )
}
