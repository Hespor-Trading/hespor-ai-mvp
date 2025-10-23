// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hespor – AI Advertising Engine for Amazon & E-commerce Sellers",
  description:
    "Hespor is an AI-powered advertising automation engine that helps Amazon and e-commerce sellers increase sales, optimize bids, and scale efficiently.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  metadataBase: new URL("https://hespor.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
