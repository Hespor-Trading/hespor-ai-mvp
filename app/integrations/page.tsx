import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Check } from "lucide-react"

export default function IntegrationsPage() {
  const integrations = [
    {
      name: "Amazon Seller Central",
      description: "Connect your Amazon Seller Central account to sync campaigns, products, and performance data.",
      category: "Required",
      features: ["Campaign sync", "Product catalog", "Performance metrics", "Order data"],
      status: "Available",
    },
    {
      name: "Amazon Advertising API",
      description: "Direct integration with Amazon Ads API for real-time campaign management and optimization.",
      category: "Required",
      features: ["Bid management", "Budget control", "Keyword optimization", "Real-time updates"],
      status: "Available",
    },
    {
      name: "Shopify",
      description: "Sync your Shopify store data to enhance Amazon listing optimization and inventory management.",
      category: "E-commerce",
      features: ["Product sync", "Inventory tracking", "Order management", "Analytics"],
      status: "Available",
    },
    {
      name: "Google Analytics",
      description: "Track external traffic sources and understand the full customer journey to your Amazon listings.",
      category: "Analytics",
      features: ["Traffic analysis", "Conversion tracking", "Attribution", "Custom reports"],
      status: "Available",
    },
    {
      name: "Slack",
      description: "Receive real-time notifications about campaign performance, alerts, and optimization actions.",
      category: "Communication",
      features: ["Performance alerts", "Daily summaries", "Team notifications", "Custom channels"],
      status: "Available",
    },
    {
      name: "Zapier",
      description: "Connect Hespor AI with thousands of apps to automate workflows and data synchronization.",
      category: "Automation",
      features: ["Custom workflows", "Data sync", "Trigger actions", "Multi-app integration"],
      status: "Coming Soon",
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-background to-muted/20 py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl">Powerful Integrations</h1>
            <p className="text-pretty text-lg text-muted-foreground leading-relaxed">
              Connect Hespor AI with your favorite tools and platforms to create a seamless workflow for your Amazon
              business.
            </p>
          </div>
        </div>
      </section>

      {/* Integrations Grid */}
      <section className="py-24">
        <div className="container">
          <div className="mb-12">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">Available Integrations</h2>
            <p className="text-lg text-muted-foreground">
              Seamlessly connect with the tools you already use to maximize efficiency.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {integrations.map((integration) => (
              <Card key={integration.name} className="flex flex-col border-border/50">
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {integration.category}
                    </span>
                    {integration.status === "Coming Soon" && (
                      <span className="text-xs text-muted-foreground">{integration.status}</span>
                    )}
                  </div>
                  <CardTitle className="text-xl">{integration.name}</CardTitle>
                  <CardDescription>{integration.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-2">
                    {integration.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* API Access */}
      <section className="border-t border-border bg-muted/30 py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">Need a Custom Integration?</h2>
            <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
              Enterprise customers get access to our API for building custom integrations and workflows tailored to your
              specific needs.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/contact">
                <Button size="lg">Contact Sales</Button>
              </Link>
              <Button size="lg" variant="outline" className="bg-transparent">
                View API Docs
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
