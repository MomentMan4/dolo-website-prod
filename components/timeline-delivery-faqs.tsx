"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

type FAQItem = {
  question: string
  answer: string
}

export function TimelineDeliveryFaqs() {
  const [openItem, setOpenItem] = useState<number | null>(null)

  const faqItems: FAQItem[] = [
    {
      question: "How long does it take to get my website live?",
      answer:
        "Our delivery timelines vary by plan: Launch (10-14 days), Grow (14-21 days), and Premier (21-30 days). These timelines begin once we have all your content and requirements. For rush orders, we can expedite the process for an additional fee.",
    },
    {
      question: "Can I change my requirements after the build starts?",
      answer:
        "Minor changes can be accommodated during the build process. For significant changes that affect the scope of work, we may need to reassess the timeline and possibly the cost. We encourage thorough planning during the initial consultation to minimize changes later.",
    },
    {
      question: "How do I handle revisions once the project is delivered?",
      answer:
        "Each plan includes a specific number of revision rounds after delivery. Launch includes 1 round, Grow includes 2 rounds, and Premier includes 3 rounds. Additional revisions beyond these can be purchased. All revision requests should be submitted within your post-launch support period.",
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
            Timeline & Delivery FAQs
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-600 sm:text-lg">
            Find answers to common questions about our delivery process and timelines.
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
