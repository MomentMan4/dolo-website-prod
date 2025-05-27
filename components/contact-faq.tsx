"use client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function ContactFaq() {
  return (
    <section className="bg-gray-50 py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <motion.h2
            className="mb-4 text-3xl font-bold text-navy md:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            className="mb-12 text-lg text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Find answers to common questions about our services
          </motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {faqCategories.map((category, index) => (
            <motion.div
              key={index}
              className="rounded-xl bg-white p-6 shadow-sm md:p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
            >
              <h3 className="mb-4 text-xl font-bold text-navy">{category.title}</h3>
              <ul className="mb-6 space-y-2">
                {category.questions.map((question, qIndex) => (
                  <li key={qIndex} className="flex items-start">
                    <svg
                      className="mr-2 mt-1 h-4 w-4 flex-shrink-0 text-orange"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-gray-600">{question}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full border-navy text-navy hover:bg-navy/10" asChild>
                <Link href={category.link}>View FAQs</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const faqCategories = [
  {
    title: "Website Plans",
    questions: [
      "What's included in each plan?",
      "How long does it take to build?",
      "Can I upgrade my plan later?",
      "Do you offer maintenance?",
    ],
    link: "/faqs#website-plans",
  },
  {
    title: "Private Build",
    questions: [
      "How does Private Build differ?",
      "What's the development process?",
      "How much does it cost?",
      "What's the timeline?",
    ],
    link: "/faqs#private-build",
  },
  {
    title: "Support & Billing",
    questions: [
      "What support is included?",
      "How do payments work?",
      "Can I get a refund?",
      "How do I contact support?",
    ],
    link: "/faqs#support-billing",
  },
]
