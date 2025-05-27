import { Header } from "@/components/header"
import { PricingPage } from "@/components/pricing-page"
import { Footer } from "@/components/footer"
import { FAQsSection } from "@/components/faqs-section"

const pricingFAQs = [
  {
    question: "How much does a website cost?",
    answer:
      "Our websites start at $499.99 for the Essential package. See our pricing page for full details on all packages and add-ons.",
  },
  {
    question: "Are there any hidden fees?",
    answer:
      "No, our pricing is transparent. The price you see is the price you pay, with no hidden fees or surprise charges.",
  },
  {
    question: "How long does it take to build a website?",
    answer:
      "Our Essential package takes 10-14 days, Pro takes 14-21 days, and Premier takes 21-30 days from kickoff to launch.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "We only consider refunds if the project has not yet started and no time or resources have been committed. Once the project kick-off is confirmed and scheduled, the refund policy is limited.",
  },
]

export default function Pricing() {
  return (
    <>
      <Header />
      <PricingPage />
      <FAQsSection
        title="Pricing FAQs"
        description="Common questions about our pricing and packages"
        faqs={pricingFAQs}
        category="Pricing"
      />
      <Footer />
    </>
  )
}
