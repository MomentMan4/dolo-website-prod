"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"

export function PricingSnapshot() {
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

  // Shimmer animation for Pro plan
  const shimmer = {
    hidden: {
      backgroundPosition: "200% 0",
    },
    hover: {
      backgroundPosition: "-200% 0",
      transition: {
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "mirror",
      },
    },
  }

  return (
    <section id="pricing" className="bg-gray-50 py-16 md:py-20 lg:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-4 text-2xl font-bold text-navy sm:text-3xl md:text-4xl lg:text-5xl">
            Simple Pricing That Grows With You
          </h2>
        </motion.div>

        <motion.div
          className="grid gap-8 md:grid-cols-3 md:gap-6 lg:gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {/* Essential Plan */}
          <motion.div
            className="rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl md:p-8"
            variants={item}
            whileHover={{ y: -10 }}
          >
            <h3 className="mb-2 text-xl font-bold text-navy">Essential</h3>
            <div className="mb-6">
              <span className="text-3xl font-bold text-navy">$499.99</span>
            </div>
            <p className="mb-6 text-sm text-gray-600">10–14 days delivery</p>
            <ul className="mb-8 space-y-3">
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5 text-orange" />
                <span>Up to 3 pages</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5 text-orange" />
                <span>Mobile Design</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5 text-orange" />
                <span>Basic SEO Setup</span>
              </li>
            </ul>
            <Button className="w-full bg-navy text-white hover:bg-navy-600" asChild>
              <Link href="/pricing">See Full Features</Link>
            </Button>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            className="relative rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl md:p-8"
            variants={item}
            whileHover={{
              y: -10,
              boxShadow: "0 0 25px rgba(255, 107, 53, 0.5)",
            }}
          >
            {/* Shimmer effect on hover */}
            <motion.div
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-orange/20 to-transparent pointer-events-none"
              style={{ backgroundSize: "200% 100%" }}
              variants={shimmer}
              initial="hidden"
              whileHover="hover"
            />

            <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-orange px-4 py-1 text-xs font-bold text-white">
              MOST POPULAR
            </div>
            <h3 className="mb-2 text-xl font-bold text-navy">Pro</h3>
            <div className="mb-6">
              <span className="text-3xl font-bold text-navy">$849.99</span>
            </div>
            <p className="mb-6 text-sm text-gray-600">14–21 days delivery</p>
            <ul className="mb-8 space-y-3">
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5 text-orange" />
                <span>Up to 6 pages</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5 text-orange" />
                <span>Booking + Lead Capture</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5 text-orange" />
                <span>Blog or Portfolio Section</span>
              </li>
            </ul>
            <Button className="w-full bg-orange text-white hover:bg-orange-600" asChild>
              <Link href="/pricing#pro-plan">See Full Features</Link>
            </Button>
          </motion.div>

          {/* Premier Plan */}
          <motion.div
            className="rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl md:p-8"
            variants={item}
            whileHover={{ y: -10 }}
          >
            <h3 className="mb-2 text-xl font-bold text-navy">Premier</h3>
            <div className="mb-6">
              <span className="text-3xl font-bold text-navy">$1199.99</span>
            </div>
            <p className="mb-6 text-sm text-gray-600">21–30 days delivery</p>
            <ul className="mb-8 space-y-3">
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5 text-orange" />
                <span>Up to 10 pages</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5 text-orange" />
                <span>Enhanced SEO + Animations</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5 text-orange" />
                <span>Custom Integrations</span>
              </li>
            </ul>
            <Button className="w-full bg-navy text-white hover:bg-navy-600" asChild>
              <Link href="/pricing">See Full Features</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
