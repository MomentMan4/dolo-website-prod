"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"

export function OurStory() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-white py-16 md:py-20 lg:py-28">
      {/* Full section gradient overlay - fixed to ensure visibility */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy/15 via-teal/15 to-coral/15 opacity-30 pointer-events-none"></div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 md:items-center md:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-2 md:order-1"
          >
            <h2 className="mb-4 text-2xl font-bold text-navy sm:text-3xl md:text-4xl lg:text-5xl">
              From Idea to Execution
            </h2>
            <p className="text-base text-gray-600 sm:text-lg">
              We've helped founders, creators, and businesses launch online with confidence, not just with code, but
              with clarity. Our approach blends creative direction, modern development, and strategic thinking to create
              digital platforms that work twice as hard as you do. We're not chasing trends. We're crafting timeless
              digital homes for businesses that want to be etched in time.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-1 md:order-2"
          >
            <div className="relative h-[250px] w-full overflow-hidden sm:h-[300px] md:h-[350px] lg:h-[400px]">
              <Image
                src="/business-laptop.jpeg"
                alt="Business professional working on laptop"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-navy/30 via-teal/20 to-coral/10"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
