"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import Link from "next/link"

type FAQ = {
  question: string
  answer: string
}

interface FAQsSectionProps {
  title?: string
  description?: string
  faqs: FAQ[]
  showAllLink?: boolean
  category?: string
}

export function FAQsSection({
  title = "Frequently Asked Questions",
  description = "Find answers to common questions about our services.",
  faqs,
  showAllLink = true,
  category,
}: FAQsSectionProps) {
  const [openItem, setOpenItem] = useState<number | null>(null)

  const handleToggle = (index: number) => {
    setOpenItem(openItem === index ? null : index)
  }

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-10 text-center">
          <h2 className="mb-4 text-3xl font-bold text-navy">{title}</h2>
          <p className="mx-auto max-w-2xl text-gray-600">{description}</p>
          {category && <p className="mt-2 text-orange">Category: {category}</p>}
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="rounded-lg border border-gray-200 bg-white shadow-sm">
                <button
                  className="flex w-full items-center justify-between p-4 text-left font-medium text-navy"
                  onClick={() => handleToggle(index)}
                  aria-expanded={openItem === index}
                >
                  <span className="pr-2">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: openItem === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex-shrink-0 rounded-full ${openItem === index ? "bg-orange" : "bg-gray-200"} p-1`}
                  >
                    <ChevronDown className={`h-4 w-4 ${openItem === index ? "text-white" : "text-navy"}`} />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openItem === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0">
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {showAllLink && (
            <div className="mt-8 text-center">
              <Link
                href="/faqs"
                className="inline-flex items-center rounded-full bg-navy px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-navy/90"
              >
                View All FAQs
                <ChevronDown className="ml-2 h-4 w-4 rotate-[-90deg]" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// Add a default export
const FAQsSectionDefault = FAQsSection
export default FAQsSectionDefault
