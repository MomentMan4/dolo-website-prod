"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { QuoteIcon } from "lucide-react"

export function Quote() {
  const quoteRef = useRef(null)
  const isInView = useInView(quoteRef, { once: true, margin: "-100px" })

  return (
    <section ref={quoteRef} className="relative overflow-hidden bg-navy py-16 text-white md:py-20 lg:py-28">
      {/* Parallax Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-teal/20"></div>
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-coral/20"></div>
        <div className="absolute left-1/2 top-1/3 h-48 w-48 -translate-x-1/2 rounded-full bg-orange/20"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center md:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto max-w-3xl"
        >
          <QuoteIcon className="mx-auto mb-4 h-10 w-10 text-orange opacity-80 sm:mb-6 sm:h-12 sm:w-12" />
          <p className="mb-6 text-xl font-medium italic sm:text-2xl md:text-3xl lg:text-4xl">
            "A brand's website isn't just a destination — it's the engine behind its growth."
          </p>
        </motion.div>
      </div>
    </section>
  )
}
