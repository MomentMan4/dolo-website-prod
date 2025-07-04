"use client"

import { motion } from "framer-motion"

export function ContactHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#003B6F]/5 via-[#007196]/5 to-[#FF5073]/5 py-16 md:py-20 lg:py-28">
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

          <motion.div
            className="mx-auto mb-8 max-w-2xl text-base text-gray-600 sm:text-lg md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <p className="mb-2">Have a question, an idea, or a vision you want to bring to life?</p>
            <p>Drop us a message, we&apos;re always excited to hear from brands ready to build bold.</p>
          </motion.div>
        </div>
      </div>

      {/* Background Elements - Updated to match About page */}
      <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-[#FF6B35]/10"></div>
      <div className="absolute -right-20 top-20 h-72 w-72 rounded-full bg-[#007196]/10"></div>
      <div className="absolute bottom-40 right-40 h-48 w-48 rounded-full bg-[#FF5073]/10"></div>
      <div className="absolute left-40 top-40 h-56 w-56 rounded-full bg-[#003B6F]/10"></div>

      {/* Additional gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#003B6F]/5 via-[#FF6B35]/5 to-[#FF5073]/5 pointer-events-none"></div>
    </section>
  )
}
