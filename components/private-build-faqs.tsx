"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

type FAQItem = {
  question: string
  answer: string
}

export function PrivateBuildFaqs() {
  const [openItem, setOpenItem] = useState<number | null>(null)

  const faqItems: FAQItem[] = [
    {
      question: "What does the Private Build service include?",
      answer:
        "Private Build is our premium custom development service for complex projects. It includes a dedicated project manager, custom design and development, advanced functionality, integrations with third-party services, comprehensive testing, and extended support. Each Private Build is uniquely tailored to your specific business requirements.",
    },
    {
      question: "How does the timeline work for a Private Build?",
      answer:
        "Private Build timelines vary based on project complexity. After your initial consultation, we'll provide a detailed timeline estimate. Typically, Private Builds range from 4-12 weeks. We break the process into clear milestones: discovery, design, development, testing, and launch, with regular check-ins throughout.",
    },
    {
      question: "Can I request custom features in my Private Build?",
      answer:
        "Custom features are what make Private Build special. Whether you need e-commerce functionality, membership areas, custom dashboards, or unique integrations, we can build it. During the discovery phase, we'll discuss all your requirements and provide solutions that align with your business goals.",
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
          <h2 className="mb-4 text-2xl font-bold text-navy sm:text-3xl md:text-4xl lg:text-5xl">Private Build FAQs</h2>
          <p className="mx-auto max-w-2xl text-base text-gray-600 sm:text-lg">
            Find answers to common questions about our Private Build service.
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
