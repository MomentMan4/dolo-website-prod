"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export function Hero() {
  // Animation for the bouncing bubble - reduced speed
  const bounceAnimation = {
    y: [0, -15, 0],
    transition: {
      duration: 2.5, // Increased from 1.5 to 2.5 to slow down
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "loop" as const,
      ease: "easeInOut",
    },
  }

  const brandText = "Your "
  const brandHighlight = "Brand"
  const normalText = " Deserves a Website That Works "
  const twiceHighlight = "Twice As Hard"
  const endText = " As You Do"

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 py-16 md:py-20 lg:py-28">
      {/* Full section gradient overlay - adjusted to blend better with image */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy/15 via-teal/15 to-coral/15 opacity-40"></div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <div className="flex flex-col justify-center">
            <motion.h1
              className="mb-6 text-3xl font-bold leading-tight tracking-tighter text-navy sm:text-4xl md:text-5xl lg:text-6xl"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
            >
              {brandText}
              <span className="font-serif italic text-orange">{brandHighlight}</span>
              {normalText}
              <span className="font-serif italic text-coral">{twiceHighlight}</span>
              {endText}
            </motion.h1>

            <motion.div
              className="mb-8 max-w-md rounded-full bg-gradient-to-r from-navy to-teal px-4 py-3 text-white shadow-lg sm:px-6 sm:py-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, ...bounceAnimation }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 15,
                delay: 0.4,
              }}
            >
              <p className="text-base font-medium sm:text-lg">
                Launch yours in as little as 10 days. Starting from $499.99.
              </p>
            </motion.div>

            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <motion.div
                className="w-full sm:w-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.5 }}
              >
                <Link href="/start" className="w-full sm:w-auto">
                  <Button className="w-full bg-orange text-white hover:bg-orange-600 sm:w-auto">
                    Start My Website
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>

          <motion.div
            className="relative flex items-center justify-center"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
          >
            <div className="relative h-[250px] w-full overflow-hidden sm:h-[300px] md:h-[350px] lg:h-[400px]">
              <Image
                src="/builder-ecommerce.jpeg"
                alt="E-commerce website builder"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-br from-navy/40 via-teal/30 to-coral/30"></div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-orange/10"></div>
      <div className="absolute -right-20 top-20 h-72 w-72 rounded-full bg-teal/10"></div>
    </section>
  )
}
