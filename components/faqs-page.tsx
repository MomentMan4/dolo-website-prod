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

export function FAQsPage() {
  const [openCategory, setOpenCategory] = useState<number | null>(0)
  const [openItem, setOpenItem] = useState<number | null>(null)

  const faqData: FAQCategory[] = [
    {
      title: "Pricing FAQs",
      items: [
        {
          question: "How much does a website cost?",
          answer:
            "Our websites start at $499.99 for the Essential package. See our pricing page for full details on all packages and add-ons.",
        },
        {
          question: "Are there any hidden fees?",
          answer:
            "No, our pricing is transparent. The price you see is the price you pay, with no hidden fees or surprise charges.",
        },
        {
          question: "How long does it take to build a website?",
          answer:
            "Our Essential package takes 10-14 days, Pro takes 14-21 days, and Premier takes 21-30 days from kickoff to launch.",
        },
        {
          question: "What do I need to provide?",
          answer:
            "You'll need to provide content, images, and brand assets. We'll guide you through exactly what's needed during onboarding.",
        },
      ],
    },
    {
      title: "Build Process FAQs",
      items: [
        {
          question: "What happens after I submit the form?",
          answer:
            "You'll receive a confirmation email and we'll review your brief. Once payment and assets are confirmed, your project officially kicks off and we begin building.",
        },
        {
          question: "Do I need to provide all the content and images?",
          answer:
            "Yes, you'll need to provide your written copy, images, and any branding assets. We don't create logos or write content, but we can recommend tools or freelancers if needed.",
        },
        {
          question: "How long will it take to get my website?",
          answer:
            "Launch builds are ready in 10 - 14 days, Grow takes 14 - 21 days, and Elevate usually completes within 21 - 30 days. Timing starts after we've received everything we need from you.",
        },
        {
          question: "How do I make payment securely?",
          answer:
            "We use Stripe, a global payments platform. You'll be redirected to a secure checkout as part of onboarding. Your invoice and confirmation are sent automatically.",
        },
        {
          question: "Can I send updates or more files later?",
          answer:
            "Yes. After payment, you'll gain access to our secure client-only chat where you can share additional files or feedback.",
        },
      ],
    },
    {
      title: "Support FAQs",
      items: [
        {
          question: "What support is included?",
          answer:
            "All packages include post-launch support: Essential (2 weeks), Pro (3 weeks), and Premier (4 weeks). Additional support plans are available.",
        },
        {
          question: "Do you offer website maintenance?",
          answer: "Yes, we offer monthly maintenance plans to keep your website secure, updated, and running smoothly.",
        },
      ],
    },
    {
      title: "Special Features FAQs",
      items: [
        {
          question: "Can you integrate with my existing tools?",
          answer:
            "Yes, we can integrate with most popular tools and platforms including CRMs, email marketing services, and payment processors.",
        },
        {
          question: "Can you help with SEO?",
          answer: "Yes, all our packages include basic SEO setup. We also offer advanced SEO services as an add-on.",
        },
        {
          question: "Do you offer e-commerce websites?",
          answer:
            "Yes, our Premier and Private Build packages include e-commerce functionality. We can help you set up your online store.",
        },
      ],
    },
    {
      title: "Private Build FAQs",
      items: [
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
        {
          question: "What support is included after launch?",
          answer:
            "You'll receive 30 days of post-launch support for tweaks, training, and QA. Ongoing retainer support is available for Private Build clients who need us to manage or enhance their product over time.",
        },
      ],
    },
    {
      title: "Refunds and Cancellations FAQs",
      items: [
        {
          question: "Do you offer refunds?",
          answer:
            "We only consider refunds if the project has not yet started and no time or resources have been committed. Once the project kick-off is confirmed and scheduled, the refund policy is limited.",
        },
        {
          question: "What if I change my mind after paying?",
          answer:
            "If your project has not yet started, you may request a full refund within 24 hours of payment. If work has already begun, we may offer a partial refund depending on the work done within the first 2 business days. After this window, all fees are considered non-refundable.",
        },
        {
          question: 'What counts as "work has started"?',
          answer:
            "Once we've begun reviewing your assets, planning your site structure, initiating design drafts, or allocating build time, the project is considered active. This typically begins within 24 - 48 hours after payment and Kick-Off confirmation.",
        },
        {
          question: "Are add-ons refundable?",
          answer:
            "No. Add-ons that involve third-party external tools are non-refundable once initiated or delivered. If an add-on hasn't been started yet, we may cancel and refund it upon request.",
        },
        {
          question: "What happens if I can't continue with the project right now?",
          answer:
            "We get it, life happens. If your project has not yet started, we'll gladly defer your build to a future slot within 60 days of your original Kick-Off date at no extra cost. If we've already started, we'll pause your build and resume when you're ready.",
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
    <section className="bg-white py-16 md:py-20 lg:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-4 text-3xl font-bold text-navy sm:text-4xl md:text-5xl lg:text-6xl">
            Frequently Asked Questions
          </h1>
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
                <h2 className="text-lg font-bold sm:text-xl">{category.title}</h2>
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
