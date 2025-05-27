"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"

export function FAQsPage() {
  const [activeCategory, setActiveCategory] = useState("all")

  // FAQ categories
  const categories = [
    { id: "all", name: "All FAQs" },
    { id: "general", name: "General" },
    { id: "process", name: "Build Process" },
    { id: "pricing", name: "Pricing" },
    { id: "timeline", name: "Timeline & Delivery" },
  ]

  // FAQ data
  const faqs = [
    // General FAQs
    {
      category: "general",
      question: "What types of websites do you build?",
      answer:
        "We specialize in creating professional, modern websites for small businesses, entrepreneurs, and creators. Our expertise includes business websites, landing pages, portfolios, blogs, and simple e-commerce sites.",
    },
    {
      category: "general",
      question: "Do I need to provide my own hosting?",
      answer:
        "No, all of our packages include hosting for the first year. After the first year, hosting can be renewed at our standard rate, or we can help you migrate to your preferred hosting provider.",
    },
    {
      category: "general",
      question: "Will my website be mobile-friendly?",
      answer:
        "All our websites are fully responsive and optimized for all devices including desktops, tablets, and mobile phones.",
    },
    {
      category: "general",
      question: "Can I update the website myself after it's built?",
      answer:
        "Yes, depending on your package, we can build your site on user-friendly platforms that allow you to make basic updates. We also offer training sessions and ongoing maintenance packages if you prefer us to handle updates.",
    },

    // Build Process FAQs
    {
      category: "process",
      question: "What's your website building process?",
      answer:
        "Our process includes: 1) Discovery & Planning, 2) Design Approval, 3) Development, 4) Content Integration, 5) Testing & Refinement, and 6) Launch & Training. We keep you involved throughout to ensure the final product meets your expectations.",
    },
    {
      category: "process",
      question: "What information do you need from me to get started?",
      answer:
        "To begin, we'll need your business information, brand assets (logo, colors, etc.), content (text and images), website goals, and any design preferences. Don't worry if you don't have everything ready – our onboarding process will guide you through what's needed.",
    },
    {
      category: "process",
      question: "Do you write content for the website?",
      answer:
        "Our packages include basic content integration and formatting. For full content creation, we offer additional copywriting services that can be added to any package.",
    },
    {
      category: "process",
      question: "Can I request changes during or after the build?",
      answer:
        "Yes, all of our packages include a set number of revision rounds during the build phase. You'll have the opportunity to review and request edits as your site takes shape. After your site is launched, you can request additional changes during your included support window. If you need updates beyond that, we offer flexible add-on support and maintenance options to keep your site evolving.",
    },

    // Pricing FAQs
    {
      category: "pricing",
      question: "How much does a website cost?",
      answer:
        "Our websites start at $499.99 for the Essential package. The final cost depends on your specific needs, features required, and the package you choose. Visit our pricing page for detailed information on all packages.",
    },
    {
      category: "pricing",
      question: "Do you offer payment plans?",
      answer:
        "Yes, we offer flexible payment options. Typically, we require a 50% deposit to begin work, with the remaining balance due before the website launch. For larger projects, we can arrange milestone-based payments.",
    },
    {
      category: "pricing",
      question: "Are there any hidden fees?",
      answer:
        "No, we believe in transparent pricing. The package price includes everything listed in the package details. Any additional services or features not included in your chosen package will be clearly communicated and quoted before implementation.",
    },
    {
      category: "pricing",
      question: "What's included in the annual hosting fee?",
      answer:
        "Our annual hosting fee includes website hosting, SSL certificate, basic security monitoring, and regular software updates. It also includes access to our support team for any hosting-related issues.",
    },

    // Timeline & Delivery FAQs
    {
      category: "timeline",
      question: "How long does it take to build a website?",
      answer:
        "Our Essential package takes 10-14 days, Pro takes 14-21 days, and Premier takes 21-30 days from kickoff to launch. Timeline may vary based on project complexity and how quickly you provide feedback and content.",
    },
    {
      category: "timeline",
      question: "What can delay the website launch?",
      answer:
        "Common delays include waiting for content from clients, extended revision cycles, adding features mid-project, and delayed feedback on design or development milestones. We'll work with you to minimize these potential delays.",
    },
    {
      category: "timeline",
      question: "Can you rush my website if I need it quickly?",
      answer:
        "We offer rush delivery options for an additional fee, subject to our current schedule. Please contact us to discuss your timeline needs and we'll do our best to accommodate your request.",
    },
    {
      category: "timeline",
      question: "What happens after my website launches?",
      answer:
        "After launch, we provide a handover session to walk you through your new website. You'll also receive post-launch support (duration depends on your package) to address any issues or questions. We offer ongoing maintenance packages for continued support.",
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
    general: "General FAQs",
    process: "Build Process FAQs",
    pricing: "Pricing FAQs",
    timeline: "Timeline & Delivery FAQs",
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
