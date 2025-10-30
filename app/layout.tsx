import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Hespor AI — Amazon Ads Automation with Real-Time AI Chat",
  description:
    "Talk to your ads data. Optimize bids, keywords, and dayparting automatically with Hespor AI — your intelligent PPC automation engine for Amazon sellers.",
  keywords:
    "Amazon PPC automation, AI ad optimization, bid adjustment, dayparting, keyword harvesting, PPC chat, AI ads management, Amazon advertising SaaS",
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
        {children}
        <Analytics />
      </body>
    </html>
  )
}
