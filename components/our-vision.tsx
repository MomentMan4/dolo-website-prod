"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Eye } from "lucide-react"

export function OurVision() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  return (
    <section ref={sectionRef} className="bg-gray-50 py-16 md:py-20 lg:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-teal/10 p-4">
                <Eye className="h-8 w-8 text-teal" />
              </div>
            </div>
            <h2 className="mb-6 text-2xl font-bold text-navy sm:text-3xl md:text-4xl lg:text-5xl">Our Vision</h2>
            <p className="text-base text-gray-600 sm:text-lg">
              Our vision is to help brands show up with clarity, confidence, and consistency. Because when you look good
              online, people take you seriously offline.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
