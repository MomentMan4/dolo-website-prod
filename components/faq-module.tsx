"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

type FAQItem = {
  question: string
  answer: string
}

type FAQCategory = {
  title: string
  items: FAQItem[]
}

export function FAQModule() {
  const [openCategory, setOpenCategory] = useState<number | null>(0)
  const [openItem, setOpenItem] = useState<number | null>(null)

  const faqData: FAQCategory[] = [
    {
      title: "Plans & Pricing",
      items: [
        {
          question: "What's included in each plan?",
          answer:
            "Our Launch plan includes up to 3 pages, mobile design, and basic SEO setup. The Grow plan adds up to 6 pages, booking and lead capture functionality, and advanced SEO. Our Premier plan includes up to 10 pages, enhanced SEO with animations, and custom integrations. All plans include hosting setup, SSL certificates, and post-launch support.",
        },
        {
          question: "Do you offer discounts for long-term contracts?",
          answer:
            "Yes, we offer a 10% discount for annual commitments on any of our plans. For larger projects or multi-site builds, we also provide custom package pricing. Contact us to discuss your specific needs and we'll create a tailored solution.",
        },
        {
          question: "Are there any hidden fees?",
          answer:
            "No, we believe in transparent pricing. The price you see is what you pay for the website build. The only additional costs would be for third-party services you might need (like premium hosting, domain registration, or specific plugins), which we'll clearly communicate before any purchase.",
        },
        {
          question: "How does the 'rush' feature work?",
          answer:
            "Our rush feature prioritizes your project in our queue for an additional 20% of your plan cost. This typically reduces delivery time by 30-40%. When you select this option during checkout, your project immediately moves to the top of our production schedule.",
        },
      ],
    },
    {
      title: "Private Build FAQs",
      items: [
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
      ],
    },
    {
      title: "Timeline & Delivery FAQs",
      items: [
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
      ],
    },
  ]

  const handleCategoryToggle = (index: number) => {
    setOpenCategory(openCategory === index ? null : index)
    setOpenItem(null)
  }

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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  }

  const contentVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
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
            Frequently Asked Questions
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-600 sm:text-lg">
            Find answers to common questions about our services, process, and delivery.
          </p>
        </motion.div>

        <motion.div
          className="mx-auto max-w-3xl space-y-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {faqData.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              className="rounded-lg border border-gray-200 bg-white shadow-sm"
              variants={itemVariants}
            >
              <button
                className={`flex w-full items-center justify-between rounded-t-lg p-4 text-left transition-all sm:p-6 ${
                  openCategory === categoryIndex ? "bg-navy text-white" : "bg-white text-navy hover:bg-gray-50"
                }`}
                onClick={() => handleCategoryToggle(categoryIndex)}
                aria-expanded={openCategory === categoryIndex}
              >
                <h3 className="text-lg font-bold sm:text-xl">{category.title}</h3>
                <motion.div
                  animate={{ rotate: openCategory === categoryIndex ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="h-5 w-5" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openCategory === categoryIndex && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={contentVariants}
                    className="overflow-hidden"
                  >
                    <div className="divide-y divide-gray-200 px-4 pb-4 sm:px-6 sm:pb-6">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="py-4">
                          <button
                            className="flex w-full items-center justify-between text-left font-medium text-navy"
                            onClick={() => handleItemToggle(itemIndex)}
                            aria-expanded={openItem === itemIndex}
                          >
                            <span className="pr-2">{item.question}</span>
                            <motion.div
                              animate={{ rotate: openItem === itemIndex ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                              className={`flex-shrink-0 rounded-full ${
                                openItem === itemIndex ? "bg-orange" : "bg-gray-200"
                              } p-1`}
                            >
                              <ChevronDown
                                className={`h-4 w-4 ${openItem === itemIndex ? "text-white" : "text-navy"}`}
                              />
                            </motion.div>
                          </button>

                          <AnimatePresence>
                            {openItem === itemIndex && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                                className="overflow-hidden"
                              >
                                <p className="mt-4 text-gray-600">{item.answer}</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
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
