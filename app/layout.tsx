// app/layout.tsx
import "../styles/globals.css";   // ✅ correct relative path

export const metadata = {
  title: "HESPOR",
  description: "Hespor AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
