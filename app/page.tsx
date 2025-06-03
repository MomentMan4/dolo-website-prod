import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { WhatWeDo } from "@/components/what-we-do"
import { HowItWorks } from "@/components/how-it-works"
import { PricingSnapshot } from "@/components/pricing-snapshot"
import { Testimonials } from "@/components/testimonials"
import { CtaBanner } from "@/components/cta-banner"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <Hero />
      <WhatWeDo />
      <HowItWorks />
      <PricingSnapshot />
      <Testimonials />
      <CtaBanner />
      <Footer />
    </main>
  )
}
