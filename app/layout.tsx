import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { CookieBanner } from "@/components/cookie-banner"
import { LegalModalsProvider } from "@/components/legal-modals-context"
import { LegalModals } from "@/components/legal-modals"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Dolo - Your Brand Deserves a Website That Works Twice As Hard As You Do",
  description: "Launch yours in as little as 10 days. Starting from $499.99.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <LegalModalsProvider>
            {children}
            <CookieBanner />
            <LegalModals />
          </LegalModalsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
