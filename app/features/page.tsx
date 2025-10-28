import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import {
  MessageSquare,
  Brain,
  Zap,
  BarChart3,
  TrendingUp,
  Shield,
  Target,
  Clock,
  DollarSign,
  Search,
  FileText,
  Users,
  ArrowRight,
} from "lucide-react"

export default function FeaturesPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-background to-muted/20 py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
              Powerful Features for Amazon Sellers
            </h1>
            <p className="text-pretty text-lg text-muted-foreground leading-relaxed">
              Everything you need to automate, optimize, and scale your Amazon PPC campaigns with AI-powered
              intelligence.
            </p>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-24">
        <div className="container">
          <div className="mb-16">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">Core Features</h2>
            <p className="text-lg text-muted-foreground">The foundation of intelligent PPC management</p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            <div className="flex gap-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="mb-3 text-xl font-semibold">Conversational Analytics</h3>
                <p className="mb-4 text-muted-foreground leading-relaxed">
                  Ask questions about your campaigns in plain English. Get instant answers with charts, tables, and
                  actionable insights. No SQL or complex queries required.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    Natural language queries
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    Instant data visualization
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    Historical trend analysis
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="mb-3 text-xl font-semibold">Transparent AI Reasoning</h3>
                <p className="mb-4 text-muted-foreground leading-relaxed">
                  Understand the "why" behind every optimization. Our AI explains its decisions in clear language, so
                  you learn PPC strategies while the system works for you.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    Detailed decision explanations
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    Strategy recommendations
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    Performance attribution
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="mb-3 text-xl font-semibold">Automated PPC Management</h3>
                <p className="mb-4 text-muted-foreground leading-relaxed">
                  Set your goals and let AI handle the rest. Automatic bid adjustments, budget optimization, and keyword
                  management running 24/7 to maximize your ROI.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    Dynamic bid optimization
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    Smart budget allocation
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    Automated keyword harvesting
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="mb-3 text-xl font-semibold">Real-Time Performance Tracking</h3>
                <p className="mb-4 text-muted-foreground leading-relaxed">
                  Monitor all your campaigns in one unified dashboard. Live data updates, custom alerts, and
                  comprehensive reporting keep you informed at all times.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    Live campaign metrics
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    Custom performance alerts
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    Automated reporting
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="border-y border-border bg-muted/30 py-24">
        <div className="container">
          <div className="mb-16">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">Advanced Capabilities</h2>
            <p className="text-lg text-muted-foreground">Take your Amazon business to the next level</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <TrendingUp className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 text-lg font-semibold">Performance Forecasting</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Predict future performance and identify opportunities before competitors with AI-powered forecasting
                  models.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Target className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 text-lg font-semibold">Competitor Analysis</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Track competitor strategies, pricing changes, and market positioning to stay ahead in your niche.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Search className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 text-lg font-semibold">Keyword Research</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Discover high-converting keywords with AI-powered research tools and search term analysis.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <DollarSign className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 text-lg font-semibold">Budget Optimization</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Automatically allocate budgets across campaigns based on performance and opportunity.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Clock className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 text-lg font-semibold">Dayparting</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Optimize bids by time of day and day of week to maximize conversions during peak hours.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <FileText className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 text-lg font-semibold">Custom Reports</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Create and schedule custom reports with the metrics that matter most to your business.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Shield className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 text-lg font-semibold">Account Protection</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Built-in safeguards prevent overspending and protect your account from risky changes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Users className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 text-lg font-semibold">Team Collaboration</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Invite team members with role-based permissions and collaborate on campaign strategies.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <BarChart3 className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 text-lg font-semibold">Multi-Account Management</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Manage multiple Amazon seller accounts from a single dashboard with unified reporting.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-12 text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight">Ready to Get Started?</h2>
            <p className="mb-8 text-pretty text-lg text-muted-foreground leading-relaxed">
              Start your free trial today and see how Hespor AI can transform your Amazon business.
            </p>
            <Link href="/auth/signup">
              <Button size="lg" className="gap-2">
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
