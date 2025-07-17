import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import { FloatingAIElectrician } from "@/components/floating-ai-electrician";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ElectroFix - Home Electrical Repair Service Platform",
  description:
    "Connect with trusted electrical mechanics for home repair services. Fast, reliable, and professional electrical solutions.",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen flex flex-col">
          <AuthProvider>
            <main className="flex-1">{children}</main>
            <Footer />
            <FloatingAIElectrician />
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
