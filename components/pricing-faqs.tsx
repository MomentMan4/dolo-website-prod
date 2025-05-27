"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

type FAQItem = {
  question: string
  answer: string
}

export function PricingFaqs() {
  const [openItem, setOpenItem] = useState<number | null>(null)

  const faqItems: FAQItem[] = [
    {
      question: "What's included in each plan?",
      answer:
        "Our Essential plan includes up to 3 pages, mobile design, and basic SEO setup. The Pro plan adds up to 6 pages, booking and lead capture functionality, and advanced SEO. Our Premier plan includes up to 10 pages, enhanced SEO with animations, and custom integrations. All plans include post-launch support.",
    },
    {
      question: "Do you offer discounts for long-term contracts?",
      answer:
        "Yes, we offer a discount for commitments on our Private Build plan. For larger projects or multi-site builds, we also provide custom package pricing. Contact us to discuss your specific needs and we'll create a tailored solution.",
    },
    {
      question: "Can I make changes during the build and how do I request changes?",
      answer:
        "Yes, we include revision rounds in all our packages. The number of revisions depends on your chosen package. Also, during your support period, you can request changes through our client chat feature. Once that is done, you can purchase additional support or maintenance.",
    },
    {
      question: "How does the 'rush' feature work?",
      answer:
        "Our rush feature prioritizes your project in our queue for an additional 20% of your plan cost. This typically reduces delivery time by 30-40%. When you select this option during checkout, your project immediately moves to the top of our production schedule.",
    },
  ]

  const handleItemToggle = (index: number) => {
    setOpenItem(openItem === index ? null : index)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  }

  return (
    <section className="bg-white py-16 md:py-20 lg:py-28" id="faqs">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-4 text-2xl font-bold text-navy sm:text-3xl md:text-4xl lg:text-5xl">
            Plans & Pricing FAQs
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-600 sm:text-lg">
            Find answers to common questions about our pricing and plans.
          </p>
        </motion.div>

        <motion.div
          className="mx-auto max-w-3xl space-y-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
              className="rounded-lg border border-gray-200 bg-white shadow-sm"
              variants={itemVariants}
            >
              <button
                className="flex w-full items-center justify-between rounded-lg p-4 text-left transition-all sm:p-6"
                onClick={() => handleItemToggle(index)}
                aria-expanded={openItem === index}
              >
                <h3 className="text-base font-medium text-navy sm:text-lg">{item.question}</h3>
                <motion.div
                  animate={{ rotate: openItem === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={`rounded-full ${openItem === index ? "bg-orange" : "bg-gray-200"} p-1`}
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
                    <div className="px-4 pb-4 sm:px-6 sm:pb-6">
                      <p className="text-gray-600">{item.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
