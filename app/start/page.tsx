import { Header } from "@/components/header"
import { StartPage } from "@/components/start-page"
import { Footer } from "@/components/footer"
import { FAQsSection } from "@/components/faqs-section"

const buildProcessFAQs = [
  {
    question: "What do I need to provide?",
    answer:
      "You'll need to provide content, images, and brand assets. We'll guide you through exactly what's needed during onboarding.",
  },
  {
    question: "Do I need to provide all the content and images?",
    answer:
      "Yes, you'll need to provide your written copy, images, and any branding assets. We don't create logos or write content, but we can recommend tools or freelancers if needed.",
  },
  {
    question: "How do I make payment securely?",
    answer:
      "We use Stripe, a global payments platform. You'll be redirected to a secure checkout as part of onboarding. Your invoice and confirmation are sent automatically.",
  },
  {
    question: "What if I change my mind after paying?",
    answer:
      "If your project has not yet started, you may request a full refund within 24 hours of payment. If work has already begun, we may offer a partial refund depending on the work done within the first 2 business days. After this window, all fees are considered non-refundable.",
  },
]

export default function Start() {
  return (
    <>
      <Header />
      <StartPage />
      <FAQsSection
        title="Build Process FAQs"
        description="Common questions about getting started with your website"
        faqs={buildProcessFAQs}
        category="Build Process"
      />
      <Footer />
    </>
  )
}
