import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hespor – AI Advertising Engine for Amazon & E-commerce Sellers",
  description:
    "Hespor is an AI-powered advertising engine that helps Amazon and e-commerce sellers increase sales, optimize bids, and scale efficiently.",
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  metadataBase: new URL("https://hespor.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-emerald-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
