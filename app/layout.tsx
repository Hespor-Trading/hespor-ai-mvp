// app/layout.tsx
import "../styles/globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "HESPOR",
  description: "Hespor AI",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Keep Tailwind CDN for instant styling on auth pages */}
        <script src="https://cdn.tailwindcss.com"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = { theme: { extend: {} } }
            `,
          }}
        />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
