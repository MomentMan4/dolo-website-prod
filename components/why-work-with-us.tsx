"use client"

import { motion } from "framer-motion"
import { Code, Clock, Headphones, Zap } from "lucide-react"

export function WhyWorkWithUs() {
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

  const cards = [
    {
      icon: <Code className="h-6 w-6 text-navy" />,
      title: "Clean & Modern Website",
      description: "Built for performance and user experience",
    },
    {
      icon: <Clock className="h-6 w-6 text-orange" />,
      title: "Fast Turnaround",
      description: "Typically within 10-30 days",
    },
    {
      icon: <Headphones className="h-6 w-6 text-teal" />,
      title: "Ongoing Support",
      description: "That respects your time and needs",
    },
    {
      icon: <Zap className="h-6 w-6 text-coral" />,
      title: "Scalable Tools",
      description: "That grow with you, not against you",
    },
  ]

  return (
    <section className="bg-white py-16 md:py-20 lg:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="mb-12 text-center md:text-left"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-4 text-2xl font-bold text-navy sm:text-3xl md:text-4xl lg:text-5xl">Why Work With Us?</h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          <motion.div
            className="flex flex-col justify-center"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-lg text-gray-700">
              We're not the agency that makes you wait four months for one homepage. We're the partner that delivers in
              two weeks and still gets the details right. We don't hide behind jargon, force you into templates, or
              nickel-and-dime you for every button. We believe in quick starts, clean design, and tech that actually
              delivers. We're powered by process, driven by creativity, and obsessed with making sure your online
              presence reflects your offline power.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            {cards.map((card, index) => (
              <motion.div
                key={index}
                variants={item}
                className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-50">
                  {card.icon}
                </div>
                <h3 className="mb-1 text-lg font-semibold text-navy">{card.title}</h3>
                <p className="text-sm text-gray-600">{card.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="mt-12 rounded-lg bg-gray-50 p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-lg font-medium text-navy">We're not here to be trendy. We're here to build your future.</p>
        </motion.div>
      </div>
    </section>
  )
}
