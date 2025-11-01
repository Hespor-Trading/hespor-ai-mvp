import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Header } from "@/components/header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Hespor AI — Talk to Your Ads. Automate the Rest.",
  description:
    "Chat with your Amazon Ads data while Hespor's AI engine optimizes bids, budgets, and dayparting automatically. Built for serious sellers.",
  keywords:
    "amazon ppc automation, ai ads optimization, dayparting, bid adjustment, keyword harvesting, ppc saas, amazon advertising automation, talk to ads data",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Hespor AI",
              applicationCategory: "AdvertisingPlatform",
              operatingSystem: "Web",
              offers: [
                {
                  "@type": "Offer",
                  name: "Free",
                  price: "0",
                  priceCurrency: "USD",
                },
                {
                  "@type": "Offer",
                  name: "Starter",
                  price: "49",
                  priceCurrency: "USD",
                },
                {
                  "@type": "Offer",
                  name: "Growth",
                  price: "299",
                  priceCurrency: "USD",
                },
                {
                  "@type": "Offer",
                  name: "Scale",
                  price: "399",
                  priceCurrency: "USD",
                },
              ],
            }),
          }}
        />
      </head>
      <body className={`${inter.className} font-sans antialiased`}>
        <Header />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
