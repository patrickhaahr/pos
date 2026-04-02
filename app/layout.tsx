import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brewhaus — Artisan Coffee & More",
  description: "Premium coffee, crafted with intention. Order online for pickup.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
