import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { WhatWeDo } from "@/components/what-we-do"
import { HowItWorks } from "@/components/how-it-works"
import { PricingSnapshot } from "@/components/pricing-snapshot"
import { Testimonials } from "@/components/testimonials"
import { CtaBanner } from "@/components/cta-banner"
import { Footer } from "@/components/footer"
import { FAQsSection } from "@/components/faqs-section"

const homeFAQs = [
  {
    question: "How much does a website cost?",
    answer:
      "Our websites start at $499.99 for the Essential package. See our pricing page for full details on all packages and add-ons.",
  },
  {
    question: "How long does it take to build a website?",
    answer:
      "Our Essential package takes 10-14 days, Pro takes 14-21 days, and Premier takes 21-30 days from kickoff to launch.",
  },
  {
    question: "What support is included?",
    answer:
      "All packages include post-launch support: Essential (2 weeks), Pro (3 weeks), and Premier (4 weeks). Additional support plans are available.",
  },
  {
    question: "Can you integrate with my existing tools?",
    answer:
      "Yes, we can integrate with most popular tools and platforms including CRMs, email marketing services, and payment processors.",
  },
]

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <Hero />
      <WhatWeDo />
      <HowItWorks />
      <PricingSnapshot />
      <Testimonials />
      <FAQsSection
        title="Frequently Asked Questions"
        description="Find answers to our most commonly asked questions"
        faqs={homeFAQs}
      />
      <CtaBanner />
      <Footer />
    </main>
  )
}
