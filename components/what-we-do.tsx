"use client"

import { motion } from "framer-motion"
import { Rocket, TrendingUp, Award } from "lucide-react"

export function WhatWeDo() {
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
    <section className="bg-white py-20 md:py-28 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-4 text-3xl font-bold text-navy md:text-4xl lg:text-5xl">What We Do</h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            We don't just build websites, we launch bold brands. Dolo delivers sites that help you:
          </p>
        </motion.div>

        <motion.div
          className="grid gap-8 md:grid-cols-3 md:gap-12"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.div
            className="flex flex-col items-center rounded-xl bg-white p-6 text-center shadow-lg transition-all hover:shadow-xl"
            variants={item}
            whileHover={{ y: -10 }}
          >
            <div className="mb-4 rounded-full bg-orange/10 p-4">
              <Rocket className="h-8 w-8 text-orange" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-navy">Launch</h3>
            <p className="text-gray-600">
              Get your business online quickly with our streamlined website development process.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col items-center rounded-xl bg-white p-6 text-center shadow-lg transition-all hover:shadow-xl"
            variants={item}
            whileHover={{ y: -10 }}
          >
            <div className="mb-4 rounded-full bg-teal/10 p-4">
              <TrendingUp className="h-8 w-8 text-teal" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-navy">Grow</h3>
            <p className="text-gray-600">
              Attract more customers with a professional website optimized for conversions.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col items-center rounded-xl bg-white p-6 text-center shadow-lg transition-all hover:shadow-xl"
            variants={item}
            whileHover={{ y: -10 }}
          >
            <div className="mb-4 rounded-full bg-coral/10 p-4">
              <Award className="h-8 w-8 text-coral" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-navy">Elevate</h3>
            <p className="text-gray-600">
              Stand out from the competition with a premium website that reflects your brand.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
