"use client"

import { motion } from "framer-motion"
import { Shield, Zap, Lightbulb } from "lucide-react"

export function OurValues() {
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
    hidden: { opacity: 0, y: 40 },
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

  const values = [
    {
      title: "Trust",
      description: "We build with integrity. You can count on clarity, transparency, and quality — always.",
      icon: Shield,
      color: "bg-navy/10",
      iconColor: "text-navy",
    },
    {
      title: "Speed",
      description: "We deliver in days, not months. Because in your world, time matters.",
      icon: Zap,
      color: "bg-orange/10",
      iconColor: "text-orange",
    },
    {
      title: "Innovation",
      description: "We are not cookie cutter. Every build is designed to solve, stand out, and scale.",
      icon: Lightbulb,
      color: "bg-coral/10",
      iconColor: "text-coral",
    },
  ]

  return (
    <section className="bg-gray-50 py-16 md:py-20 lg:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-4 text-2xl font-bold text-navy sm:text-3xl md:text-4xl lg:text-5xl">Our Values</h2>
          <p className="mx-auto max-w-2xl text-base text-gray-600 sm:text-lg">
            The principles that guide our work and relationships.
          </p>
        </motion.div>

        <motion.div
          className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8 lg:gap-12"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {values.map((value, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center rounded-xl bg-white p-6 text-center shadow-lg transition-all hover:shadow-xl"
              variants={item}
              whileHover={{ y: -10 }}
            >
              <div className={`mb-4 rounded-full ${value.color} p-4`}>
                <value.icon className={`h-6 w-6 sm:h-8 sm:w-8 ${value.iconColor}`} />
              </div>
              <h3 className="mb-2 text-lg font-bold text-navy sm:text-xl">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
