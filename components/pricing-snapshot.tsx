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
        repeatType: "mirror" as const,
      },
    },
  }

  // Define pricing data with proper structure and error handling
  const pricingPlans = [
    {
      id: "essential",
      name: "Essential",
      price: "$499.99",
      delivery: "10–14 days delivery",
      features: ["Up to 3 pages", "Mobile Design", "Basic SEO Setup"],
      buttonText: "See Full Features",
      buttonLink: "/pricing#essential",
      isPopular: false,
      buttonStyle: "bg-navy text-white hover:bg-navy-600",
    },
    {
      id: "pro",
      name: "Pro",
      price: "$849.99",
      delivery: "14–21 days delivery",
      features: ["Up to 6 pages", "Booking + Lead Capture", "Blog or Portfolio Section"],
      buttonText: "See Full Features",
      buttonLink: "/pricing#pro-plan",
      isPopular: true,
      buttonStyle: "bg-orange text-white hover:bg-orange-600",
    },
    {
      id: "premier",
      name: "Premier",
      price: "$1199.99",
      delivery: "21–30 days delivery",
      features: ["Up to 10 pages", "Enhanced SEO + Animations", "Custom Integrations"],
      buttonText: "See Full Features",
      buttonLink: "/pricing#premier",
      isPopular: false,
      buttonStyle: "bg-navy text-white hover:bg-navy-600",
    },
  ]

  // Error handling: ensure pricingPlans is defined and is an array
  if (!pricingPlans || !Array.isArray(pricingPlans)) {
    return (
      <section id="pricing" className="bg-gray-50 py-16 md:py-20 lg:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <p>Loading pricing information...</p>
          </div>
        </div>
      </section>
    )
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
          {pricingPlans.map((plan) => {
            // Additional safety check for each plan's features array
            const safeFeatures = plan.features && Array.isArray(plan.features) ? plan.features : []

            return (
              <motion.div
                key={plan.id}
                className={`relative rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl md:p-8 ${
                  plan.isPopular ? "ring-2 ring-orange ring-opacity-50" : ""
                }`}
                variants={item}
                whileHover={
                  plan.isPopular
                    ? {
                        y: -10,
                        boxShadow: "0 0 25px rgba(255, 107, 53, 0.5)",
                      }
                    : { y: -10 }
                }
              >
                {/* Shimmer effect for Pro plan */}
                {plan.isPopular && (
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-orange/20 to-transparent pointer-events-none"
                    style={{ backgroundSize: "200% 100%" }}
                    variants={shimmer}
                    initial="hidden"
                    whileHover="hover"
                  />
                )}

                {/* Popular badge */}
                {plan.isPopular && (
                  <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-orange px-4 py-1 text-xs font-bold text-white">
                    MOST POPULAR
                  </div>
                )}

                <h3 className="mb-2 text-xl font-bold text-navy">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-navy">{plan.price}</span>
                </div>
                <p className="mb-6 text-sm text-gray-600">{plan.delivery}</p>

                <ul className="mb-8 space-y-3">
                  {safeFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="mr-2 h-5 w-5 text-orange" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button className={`w-full ${plan.buttonStyle}`} asChild>
                  <Link href={plan.buttonLink}>{plan.buttonText}</Link>
                </Button>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

// Export both named and default for compatibility
export default PricingSnapshot
