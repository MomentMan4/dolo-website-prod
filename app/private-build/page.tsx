import { Header } from "@/components/header"
import { PrivateBuildPage } from "@/components/private-build-page"
import { Footer } from "@/components/footer"
import { FAQsSection } from "@/components/faqs-section"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Private Build | Dolo",
  description: "Custom digital infrastructure for brands that need more than just a website.",
}

const privateBuildFAQs = [
  {
    question: "What makes a project qualify for Private Build?",
    answer:
      "If your project requires advanced features like dashboards, AI-enhanced forms, CRM or API integrations, or full-stack infrastructure — it's a fit for Private Build. These are custom builds beyond a standard site.",
  },
  {
    question: "How much does a Private Build cost?",
    answer:
      "Because each build is tailored, pricing varies based on scope and complexity. Most Private Builds start around $3000 and scale from there. After our discovery call, you'll receive a detailed proposal.",
  },
  {
    question: "How long does a Private Build take to deliver?",
    answer:
      "Most Private Builds take 4 - 6 weeks from discovery to launch. This includes strategy, design sprints, development, and testing. If you have a tight deadline, we can explore accelerated timelines.",
  },
  {
    question: "Can you integrate with our CRM or internal systems?",
    answer:
      "Yes. We support integrations with tools like HubSpot, Salesforce, Mailchimp, Notion, Stripe, and more. If you have a custom stack, we'll assess it during our discovery phase to ensure compatibility.",
  },
]

export default function PrivateBuild() {
  return (
    <>
      <Header />
      <PrivateBuildPage />
      <FAQsSection
        title="Private Build FAQs"
        description="Common questions about our custom development services"
        faqs={privateBuildFAQs}
        category="Private Build"
      />
      <Footer />
    </>
  )
}
