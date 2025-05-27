"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Star } from "lucide-react"

export function CtaBanner() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 1, 0.6])

  // North Star animation
  const starAnimation = {
    initial: { scale: 0.8, opacity: 0.5 },
    animate: {
      scale: [0.8, 1.2, 0.8],
      opacity: [0.5, 1, 0.5],
      rotate: [0, 5, -5, 0],
    },
    transition: {
      duration: 3,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "loop",
    },
  }

  return (
    <section ref={ref} className="relative overflow-hidden bg-navy py-16 text-white md:py-20 lg:py-28">
      {/* Parallax Background */}
      <motion.div className="absolute inset-0 z-0" style={{ y, opacity }}>
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-teal/20"></div>
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-coral/20"></div>
        <div className="absolute left-1/2 top-1/3 h-48 w-48 -translate-x-1/2 rounded-full bg-orange/20"></div>
      </motion.div>

      {/* Shiny North Star */}
      <motion.div
        className="absolute right-10 top-10 z-10 md:right-20 md:top-20"
        initial="initial"
        animate="animate"
        variants={starAnimation}
      >
        <Star
          className="h-10 w-10 text-yellow-300 drop-shadow-[0_0_8px_rgba(255,255,0,0.8)] md:h-16 md:w-16"
          fill="yellow"
        />
      </motion.div>

      <div className="container relative z-10 mx-auto px-4 text-center md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl">Need More Power?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-base text-white/80 sm:text-lg">
            For businesses with complex requirements, our Private Build service offers custom development, advanced
            features, and dedicated support.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link href="/private-build">
              <Button className="w-full bg-coral text-white hover:bg-coral-600 sm:w-auto">Explore Private Build</Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
