"use client"

import { motion } from "framer-motion"
import { Phone, FileText, Code, CheckCircle, Rocket, ArrowRight } from "lucide-react"

export function Roadmap() {
  const steps = [
    {
      title: "Discovery Call",
      description:
        "Once we receive your application, we'll schedule a short call to understand your goals, style, and project scope.",
      icon: Phone,
    },
    {
      title: "Proposal & Timeline",
      description:
        "We'll share a tailored proposal including a timeline, deliverables, and pricing based on your needs.",
      icon: FileText,
    },
    {
      title: "Design & Build",
      description:
        "We begin crafting your experience — from wireframes and design to code and integration. You'll get updates throughout.",
      icon: Code,
    },
    {
      title: "Review & Revisions",
      description: "You'll review the first version. We'll make any changes needed to get it just right.",
      icon: CheckCircle,
    },
    {
      title: "Launch & Handover",
      description:
        "We go live. You'll receive full handover documentation, training (if needed), and ongoing support options.",
      icon: Rocket,
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
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
    <div className="relative">
      {/* Desktop Roadmap (horizontal) */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 bg-gray-200"></div>

          <motion.div
            className="grid grid-cols-5 gap-8"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            {steps.map((step, index) => (
              <motion.div key={index} className="relative" variants={item}>
                <div className="flex flex-col items-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-navy text-white z-10">
                    <step.icon size={32} />
                  </div>
                  <div className="text-center">
                    <h3 className="mb-2 text-lg font-bold text-navy">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>

                  {/* Arrow pointing to the next step */}
                  {index < steps.length - 1 && (
                    <div className="absolute right-[-30px] top-[32px] z-10">
                      <ArrowRight className="h-6 w-6 text-orange" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Mobile Roadmap (vertical) */}
      <div className="md:hidden">
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute left-8 top-0 h-full w-1 bg-gray-200"></div>

          <motion.div
            className="space-y-8"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            {steps.map((step, index) => (
              <motion.div key={index} className="relative" variants={item}>
                <div className="flex items-start">
                  <div className="mr-6 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-navy text-white z-10">
                    <step.icon size={32} />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-bold text-navy">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>

                {/* Arrow pointing to the next step */}
                {index < steps.length - 1 && (
                  <div className="absolute left-8 top-[70px] z-10 transform -translate-x-1/2">
                    <div className="rotate-90">
                      <ArrowRight className="h-6 w-6 text-orange" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
