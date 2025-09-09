import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hespor AI – MVP",
  description: "Beginner-friendly, inventory-aware PPC coach",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
