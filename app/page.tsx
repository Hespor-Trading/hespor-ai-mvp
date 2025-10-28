import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, BarChart3, Brain, Zap, Shield, TrendingUp, MessageSquare } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-background to-muted/20">
        <div className="container py-24 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <Zap className="h-4 w-4" />
              AI-Powered Amazon PPC Automation
            </div>
            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Talk to Your Data.
              <br />
              <span className="text-primary">Scale Your Amazon Business.</span>
            </h1>
            <p className="mb-8 text-pretty text-lg text-muted-foreground leading-relaxed sm:text-xl">
              Hespor AI combines advanced analytics with intelligent PPC automation. Learn while executing, understand
              the reasoning behind every decision, and grow your Amazon business with confidence.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth/signup">
                <Button size="lg" className="gap-2">
                  Use Hespor Algorithm
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/features">
                <Button size="lg" variant="outline">
                  Explore Features
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">No credit card required • 14-day free trial</p>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-24">
        <div className="container">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Everything You Need to Win on Amazon
            </h2>
            <p className="text-pretty text-lg text-muted-foreground leading-relaxed">
              Powerful tools designed specifically for Amazon sellers who want to scale efficiently.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-border/50 transition-all hover:border-primary/50 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Conversational Analytics</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Ask questions in plain English. Get instant insights from your Amazon data without complex dashboards.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 transition-all hover:border-primary/50 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Transparent AI Reasoning</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Understand why the AI makes each decision. Learn PPC strategies while the system executes them for
                  you.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 transition-all hover:border-primary/50 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Automated PPC Management</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Set your goals and let AI optimize bids, budgets, and keywords 24/7 for maximum ROI.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 transition-all hover:border-primary/50 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Real-Time Insights</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Monitor performance across all your campaigns with live data and actionable recommendations.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 transition-all hover:border-primary/50 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Performance Forecasting</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Predict future performance and identify opportunities before your competitors do.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 transition-all hover:border-primary/50 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Safe & Secure</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Enterprise-grade security with granular controls. Your data and Amazon account are always protected.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-y border-border bg-muted/30 py-16">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-8 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Trusted by Amazon Sellers Worldwide
            </p>
            <div className="grid gap-8 md:grid-cols-3">
              <div>
                <div className="mb-2 text-4xl font-bold text-primary">$50M+</div>
                <p className="text-sm text-muted-foreground">Ad Spend Managed</p>
              </div>
              <div>
                <div className="mb-2 text-4xl font-bold text-primary">10K+</div>
                <p className="text-sm text-muted-foreground">Active Campaigns</p>
              </div>
              <div>
                <div className="mb-2 text-4xl font-bold text-primary">35%</div>
                <p className="text-sm text-muted-foreground">Average ROAS Improvement</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-12 text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Transform Your Amazon Business?
            </h2>
            <p className="mb-8 text-pretty text-lg text-muted-foreground leading-relaxed">
              Join thousands of sellers who are scaling smarter with AI-powered PPC automation.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth/signup">
                <Button size="lg" className="gap-2">
                  Use Hespor Algorithm
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">
                  Talk to Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
