"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"

export function FAQsPage() {
  const [activeCategory, setActiveCategory] = useState("all")

  // FAQ categories
  const categories = [
    { id: "all", name: "All FAQs" },
    { id: "pricing", name: "Pricing" },
    { id: "process", name: "Build Process" },
    { id: "support", name: "Support" },
    { id: "features", name: "Special Features" },
    { id: "private", name: "Private Build" },
    { id: "refunds", name: "Refunds & Cancellations" },
  ]

  // FAQ data - only including FAQs from the provided content
  const faqs = [
    // Pricing FAQs
    {
      category: "pricing",
      question: "How much does a website cost?",
      answer:
        "Our websites start at $499.99 for the Essential package. See our pricing page for full details on all packages and add-ons.",
    },
    {
      category: "pricing",
      question: "Are there any hidden fees?",
      answer:
        "No, our pricing is transparent. The price you see is the price you pay, with no hidden fees or surprise charges.",
    },
    {
      category: "pricing",
      question: "How long does it take to build a website?",
      answer:
        "Our Essential package takes 10-14 days, Pro takes 14-21 days, and Premier takes 21-30 days from kickoff to launch.",
    },
    {
      category: "pricing",
      question: "What do I need to provide?",
      answer:
        "You'll need to provide content, images, and brand assets. We'll guide you through exactly what's needed during onboarding.",
    },

    // Build Process FAQs
    {
      category: "process",
      question: "What happens after I submit the form?",
      answer:
        "You'll receive a confirmation email and we'll review your brief. Once payment and assets are confirmed, your project officially kicks off and we begin building.",
    },
    {
      category: "process",
      question: "Do I need to provide all the content and images?",
      answer:
        "Yes, you'll need to provide your written copy, images, and any branding assets. We don't create logos or write content, but we can recommend tools or freelancers if needed.",
    },
    {
      category: "process",
      question: "How long will it take to get my website?",
      answer:
        "Launch builds are ready in 10 - 14 days, Grow takes 14 - 21 days, and Elevate usually completes within 21 - 30 days. Timing starts after we've received everything we need from you.",
    },
    {
      category: "process",
      question: "How do I make payment securely?",
      answer:
        "We use Stripe, a global payments platform. You'll be redirected to a secure checkout as part of onboarding. Your invoice and confirmation are sent automatically.",
    },
    {
      category: "process",
      question: "Can I send updates or more files later?",
      answer:
        "Yes. After payment, you'll gain access to our secure client-only chat where you can share additional files or feedback.",
    },
    {
      category: "process",
      question: "Can I request changes during or after the build?",
      answer:
        "Yes — all of our packages include a set number of revision rounds during the build phase. You'll have the opportunity to review and request edits as your site takes shape. After your site is launched, you can request additional changes during your included support window. If you need updates beyond that, we offer flexible add-on support and maintenance options to keep your site evolving.",
    },

    // Support FAQs
    {
      category: "support",
      question: "What support is included?",
      answer:
        "All packages include post-launch support: Essential (2 weeks), Pro (3 weeks), and Premier (4 weeks). Additional support plans are available.",
    },
    {
      category: "support",
      question: "Do you offer website maintenance?",
      answer: "Yes, we offer monthly maintenance plans to keep your website secure, updated, and running smoothly.",
    },

    // Special Features FAQs
    {
      category: "features",
      question: "Can you integrate with my existing tools?",
      answer:
        "Yes, we can integrate with most popular tools and platforms including CRMs, email marketing services, and payment processors.",
    },
    {
      category: "features",
      question: "Can you help with SEO?",
      answer: "Yes, all our packages include basic SEO setup. We also offer advanced SEO services as an add-on.",
    },
    {
      category: "features",
      question: "Do you offer e-commerce websites?",
      answer:
        "Yes, our Premier and Private Build packages include e-commerce functionality. We can help you set up your online store.",
    },

    // Private Build FAQs
    {
      category: "private",
      question: "What makes a project qualify for Private Build?",
      answer:
        "If your project requires advanced features like dashboards, AI-enhanced forms, CRM or API integrations, or full-stack infrastructure — it's a fit for Private Build. These are custom builds beyond a standard site.",
    },
    {
      category: "private",
      question: "How much does a Private Build cost?",
      answer:
        "Because each build is tailored, pricing varies based on scope and complexity. Most Private Builds start around $3000 and scale from there. After our discovery call, you'll receive a detailed proposal.",
    },
    {
      category: "private",
      question: "How long does a Private Build take to deliver?",
      answer:
        "Most Private Builds take 4 - 6 weeks from discovery to launch. This includes strategy, design sprints, development, and testing. If you have a tight deadline, we can explore accelerated timelines.",
    },
    {
      category: "private",
      question: "Can you integrate with our CRM or internal systems?",
      answer:
        "Yes. We support integrations with tools like HubSpot, Salesforce, Mailchimp, Notion, Stripe, and more. If you have a custom stack, we'll assess it during our discovery phase to ensure compatibility.",
    },
    {
      category: "private",
      question: "What support is included after launch?",
      answer:
        "You'll receive 30 days of post-launch support for tweaks, training, and QA. Ongoing retainer support is available for Private Build clients who need us to manage or enhance their product over time.",
    },

    // Refunds and Cancellations FAQs
    {
      category: "refunds",
      question: "Do you offer refunds?",
      answer:
        "We only consider refunds if the project has not yet started and no time or resources have been committed. Once the project kick-off is confirmed and scheduled, the refund policy is limited.",
    },
    {
      category: "refunds",
      question: "What if I change my mind after paying?",
      answer:
        "If your project has not yet started, you may request a full refund within 24 hours of payment. If work has already begun, we may offer a partial refund depending on the work done within the first 2 business days. After this window, all fees are considered non-refundable.",
    },
    {
      category: "refunds",
      question: 'What counts as "work has started"?',
      answer:
        "Once we've begun reviewing your assets, planning your site structure, initiating design drafts, or allocating build time, the project is considered active. This typically begins within 24 - 48 hours after payment and Kick-Off confirmation.",
    },
    {
      category: "refunds",
      question: "Are add-ons refundable?",
      answer:
        "No. Add-ons that involve third-party external tools are non-refundable once initiated or delivered. If an add-on hasn't been started yet, we may cancel and refund it upon request.",
    },
    {
      category: "refunds",
      question: "What happens if I can't continue with the project right now?",
      answer:
        "We get it, life happens. If your project has not yet started, we'll gladly defer your build to a future slot within 60 days of your original Kick-Off date at no extra cost. If we've already started, we'll pause your build and resume when you're ready.",
    },
  ]

  // Filter FAQs based on active category
  const filteredFaqs = activeCategory === "all" ? faqs : faqs.filter((faq) => faq.category === activeCategory)

  // Group FAQs by category for display
  const groupedFaqs = filteredFaqs.reduce((acc, faq) => {
    const category = faq.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(faq)
    return acc
  }, {})

  // Category display names
  const categoryNames = {
    pricing: "Pricing FAQs",
    process: "Build Process FAQs",
    support: "Support FAQs",
    features: "Special Features FAQs",
    private: "Private Build FAQs",
    refunds: "Refunds & Cancellations FAQs",
  }

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-3xl font-bold text-navy md:text-4xl lg:text-5xl">Frequently Asked Questions</h1>
          <p className="mx-auto mb-12 max-w-2xl text-base text-gray-600 sm:text-lg md:text-xl">
            Find answers to common questions about our website design and development services.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mb-12 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors md:text-base ${
                activeCategory === category.id ? "bg-navy text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* FAQs */}
        <div className="mx-auto max-w-4xl">
          {Object.keys(groupedFaqs).map((category) => (
            <div key={category} className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-navy">{categoryNames[category]}</h2>
              <div className="space-y-4">
                {groupedFaqs[category].map((faq, index) => (
                  <FAQItem key={index} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// FAQ Item Component with Animation
function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <button
        className="flex w-full items-center justify-between p-4 text-left font-medium text-navy"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="pr-2">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={`flex-shrink-0 rounded-full ${isOpen ? "bg-orange" : "bg-gray-200"} p-1`}
        >
          <ChevronDown className={`h-4 w-4 ${isOpen ? "text-white" : "text-navy"}`} />
        </motion.div>
      </button>

      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="p-4 pt-0">
          <p className="text-gray-600">{answer}</p>
        </div>
      </motion.div>
    </div>
  )
}
