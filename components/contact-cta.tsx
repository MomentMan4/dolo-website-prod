"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { QuizTrigger } from "@/components/quiz-trigger"

export function ContactCTA() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-navy md:text-4xl lg:text-5xl xl:text-6xl">
            Ready to Take Action?
          </h2>

          <motion.div
            className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="/private-build" className="w-full sm:w-auto">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" className="w-full border-navy text-navy hover:bg-navy/10 sm:w-auto">
                  Explore Private Build
                </Button>
              </motion.div>
            </Link>

            <Link href="/start" className="w-full sm:w-auto">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="w-full bg-orange text-white hover:bg-orange-600 sm:w-auto">Start My Website</Button>
              </motion.div>
            </Link>

            <div className="w-full sm:w-auto">
              <QuizTrigger />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
