
import type { Metadata } from "next";
import "./globals.css";

import AppNavigation from
  "@/components/layout/AppNavigation";

export const metadata: Metadata = {
  title: "StartupLens AI",
  description:
    "AI-powered startup investment screening.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-950 antialiased">
        <AppNavigation />
        {children}
      </body>
    </html>
  );
}

