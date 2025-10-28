import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Target, Users, Zap, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-background to-muted/20 py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
              Empowering Amazon Sellers with AI
            </h1>
            <p className="text-pretty text-lg text-muted-foreground leading-relaxed">
              We're on a mission to democratize advanced PPC automation, making enterprise-level tools accessible to
              sellers of all sizes.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold tracking-tight">Our Story</h2>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                Hespor AI was born from a simple observation: Amazon PPC management was too complex, too time-consuming,
                and too expensive for most sellers to do effectively.
              </p>
              <p>
                Our founders, experienced Amazon sellers themselves, spent countless hours manually optimizing
                campaigns, analyzing data, and adjusting bids. They knew there had to be a better way.
              </p>
              <p>
                By combining cutting-edge AI technology with deep Amazon advertising expertise, we created a platform
                that not only automates PPC management but also teaches sellers the strategies behind every decision.
              </p>
              <p>
                Today, Hespor AI helps thousands of sellers scale their Amazon businesses efficiently, profitably, and
                with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-border bg-muted/30 py-24">
        <div className="container">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">Our Values</h2>
            <p className="text-lg text-muted-foreground">The principles that guide everything we do</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border/50">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Transparency</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We believe in clear explanations for every AI decision, so you always understand what's happening.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Customer Success</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your success is our success. We're committed to helping you achieve your Amazon business goals.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Innovation</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We continuously push the boundaries of what's possible with AI and automation technology.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Integrity</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We operate with honesty and ethical practices in everything we do, from pricing to data handling.
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
            <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight">
              Join Thousands of Successful Sellers
            </h2>
            <p className="mb-8 text-pretty text-lg text-muted-foreground leading-relaxed">
              Start optimizing your Amazon PPC campaigns with AI-powered automation today.
            </p>
            <Link href="/auth/signup">
              <Button size="lg">Start Free Trial</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
