"use client"

import { motion } from "framer-motion"

export function ContactHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 py-16 md:py-20 lg:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <motion.h1
            className="mb-6 text-2xl font-bold leading-tight tracking-tighter text-navy sm:text-3xl md:text-4xl lg:text-5xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Let&apos;s Connect
          </motion.h1>

          <motion.p
            className="mx-auto mb-8 max-w-2xl text-base text-gray-600 sm:text-lg md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Have a question, an idea, or a vision you want to bring to life? Drop us a message, we&apos;re always
            excited to hear from brands ready to build bold.
          </motion.p>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-[#007196]/10"></div>
      <div className="absolute -right-20 top-20 h-72 w-72 rounded-full bg-[#FF5073]/10"></div>
    </section>
  )
}
