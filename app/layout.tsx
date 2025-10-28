import './globals.css';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: "HESPOR – AI Advertising Engine for Amazon & E-commerce Sellers",
  description:
    "HESPOR is an AI-powered advertising automation engine that helps Amazon and e-commerce sellers increase sales, optimize bids, and scale efficiently.",
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/icon.png",
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
      <body>{children}</body>
    </html>
  );
}
