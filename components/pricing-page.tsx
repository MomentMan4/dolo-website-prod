"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function PricingPage() {
  // Remove the checkout loading state and handleCheckout function
  // Add redirect handler function
  const handlePlanSelection = (plan: string) => {
    // Redirect to start page with selected plan
    window.location.href = `/start?plan=${plan.toLowerCase()}`
  }

  // Animation variants
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

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  // Define button text consistently for all plans
  const buttonText = "Start My Website"

  return (
    <TooltipProvider delayDuration={300}>
      <section className="relative overflow-hidden bg-gradient-to-br from-[#003B6F]/5 via-[#007196]/5 to-[#FF5073]/5 py-20 md:py-28 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="mb-16 text-center"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h1 className="mb-4 text-3xl font-bold text-navy md:text-4xl lg:text-5xl">
              Choose the Right Plan for Your Website
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Whether you're just getting started or ready to scale, there's a Dolo plan built for your next move.
            </p>
          </motion.div>
        </div>

        {/* Background Elements - Added to match About page */}
        <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-[#FF6B35]/10"></div>
        <div className="absolute -right-20 top-20 h-72 w-72 rounded-full bg-[#007196]/10"></div>
        <div className="absolute bottom-40 right-40 h-48 w-48 rounded-full bg-[#FF5073]/10"></div>
        <div className="absolute left-40 top-40 h-56 w-56 rounded-full bg-[#003B6F]/10"></div>

        {/* Additional gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#003B6F]/5 via-[#FF6B35]/5 to-[#FF5073]/5 pointer-events-none"></div>
      </section>

      <section className="bg-white py-20 md:py-28 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="grid gap-8 md:grid-cols-3 md:gap-6 lg:gap-8"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {/* Essential Plan */}
            <motion.div
              className="relative flex flex-col rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl md:p-8"
              variants={item}
              whileHover={{
                y: -10,
                transition: { type: "spring", stiffness: 300, damping: 15 },
              }}
            >
              <h3 className="mb-2 text-xl font-bold text-navy">Essential</h3>
              <div className="mb-6 flex items-baseline">
                <span className="text-3xl font-bold text-navy">$499</span>
                <span className="text-lg font-medium text-navy">.99</span>
              </div>
              <p className="mb-6 text-sm text-gray-600">10–14 days delivery</p>

              <div className="mb-6 flex-grow">
                <h4 className="mb-4 font-medium text-navy">What's included:</h4>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="mr-2 mt-1 h-5 w-5 flex-shrink-0 text-orange" />
                    <span>Up to 3 pages</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 mt-1 h-5 w-5 flex-shrink-0 text-orange" />
                    <span>Mobile responsive design</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 mt-1 h-5 w-5 flex-shrink-0 text-orange" />
                    <span>Contact form</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 mt-1 h-5 w-5 flex-shrink-0 text-orange" />
                    <span>Google Analytics setup</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 mt-1 h-5 w-5 flex-shrink-0 text-orange" />
                    <span>Basic SEO tags</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 mt-1 h-5 w-5 flex-shrink-0 text-orange" />
                    <span>SSL certificate installation</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 mt-1 h-5 w-5 flex-shrink-0 text-orange" />
                    <span className="flex items-center">
                      Payment integration
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="ml-1 h-4 w-4 cursor-pointer text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="w-[200px] text-sm">Stripe, PayPal, PayStack, Flutterwave, Square</p>
                        </TooltipContent>
                      </Tooltip>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 mt-1 h-5 w-5 flex-shrink-0 text-orange" />
                    <span>Post-launch support: 2 weeks</span>
                  </li>
                </ul>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="mt-auto"
              >
                <Button
                  className="w-full bg-navy text-white hover:bg-navy-600"
                  onClick={() => handlePlanSelection("essential")}
                >
                  {buttonText}
                </Button>
              </motion.div>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              className="relative flex flex-col rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl md:p-8"
              variants={item}
              whileHover={{
                y: -10,
                boxShadow: "0 0 30px rgba(255, 107, 53, 0.7)",
                transition: { type: "spring", stiffness: 300, damping: 15 },
              }}
            >
              {/* Enhanced glow effect */}
              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange/20 via-orange/30 to-orange/20 pointer-events-none"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(255, 107, 53, 0.3)",
                    "0 0 30px rgba(255, 107, 53, 0.6)",
                    "0 0 20px rgba(255, 107, 53, 0.3)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />

              <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-orange px-4 py-1 text-xs font-bold text-white">
                MOST POPULAR
              </div>
              <h3 className="mb-2 text-xl font-bold text-navy">Pro</h3>
              <div className="mb-6 flex items-baseline">
                <span className="text-3xl font-bold text-navy">$849</span>
                <span className="text-lg font-medium text-navy">.99</span>
              </div>
              <p className="mb-6 text-sm text-gray-600">14–21 days delivery</p>

              <div className="mb-6 flex-grow">
                <h4 className="mb-4 font-medium text-navy">Everything in Essential, plus:</h4>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="mr-2 mt-1 h-5 w-5 flex-shrink-0 text-orange" />
                    <span className="flex items-center">
                      Up to 6 pages
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="ml-1 h-4 w-4 cursor-pointer text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="w-[200px] text-sm">3 more than Essential</p>
                        </TooltipContent>
                      </Tooltip>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 mt-1 h-5 w-5 flex-shrink-0 text-orange" />
                    <span className="flex items-center">
                      Booking integration
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="ml-1 h-4 w-4 cursor-pointer text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="w-[200px] text-sm">Calendly, Acuity</p>
                        </TooltipContent>
                      </Tooltip>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 mt-1 h-5 w-5 flex-shrink-0 text-orange" />
                    <span>Blog or portfolio section</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 mt-1 h-5 w-5 flex-shrink-0 text-orange" />
                    <span className="flex items-center">
                      Lead magnet integration
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="ml-1 h-4 w-4 cursor-pointer text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="w-[200px] text-sm">Freebie download setup for lead capture</p>
                        </TooltipContent>
                      </Tooltip>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 mt-1 h-5 w-5 flex-shrink-0 text-orange" />
                    <span className="flex items-center">
                      Custom forms
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="ml-1 h-4 w-4 cursor-pointer text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="w-[200px] text-sm">Conditional logic, multi-step</p>
                        </TooltipContent>
                      </Tooltip>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 mt-1 h-5 w-5 flex-shrink-0 text-orange" />
                    <span>Standard performance optimization</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 mt-1 h-5 w-5 flex-shrink-0 text-orange" />
                    <span>2 rounds of revisions</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 mt-1 h-5 w-5 flex-shrink-0 text-orange" />
                    <span>Post-launch support: 3 weeks</span>
                  </li>
                </ul>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="mt-auto"
              >
                <Button
                  className="w-full bg-orange text-white hover:bg-orange-600"
                  onClick={() => handlePlanSelection("pro")}
                >
                  {buttonText}
                </Button>
              </motion.div>
            </motion.div>

            {/* Premier Plan */}
            <motion.div
              className="relative flex flex-col rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl md:p-8"
              variants={item}
              whileHover={{
                y: -10,
                transition: { type: "spring", stiffness: 300, damping: 15 },
              }}
            >
              <h3 className="mb-2 text-xl font-bold text-navy">Premier</h3>
              <div className="mb-6 flex items-baseline">
                <span className="text-3xl font-bold text-navy">$1199</span>
                <span className="text-lg font-medium text-navy">.99</span>
              </div>
              <p className="mb-6 text-sm text-gray-600">21–30 days delivery</p>

              <div className="mb-6 flex-grow">
                <h4 className="mb-4 font-medium text-navy">Everything in Pro, plus:</h4>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="mr-2 mt-1 h-5 w-5 flex-shrink-0 text-orange" />
                    <span className="flex items-center">
                      Up to 10 pages
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="ml-1 h-4 w-4 cursor-pointer text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="w-[200px] text-sm">4 more than Pro</p>
                        </TooltipContent>
                      </Tooltip>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 mt-1 h-5 w-5 flex-shrink-0 text-orange" />
                    <span className="flex items-center">
                      Enhanced SEO
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="ml-1 h-4 w-4 cursor-pointer text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="w-[200px] text-sm">Meta, schema</p>
                        </TooltipContent>
                      </Tooltip>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 mt-1 h-5 w-5 flex-shrink-0 text-orange" />
                    <span className="flex items-center">
                      Advanced analytics
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="ml-1 h-4 w-4 cursor-pointer text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="w-[200px] text-sm">Custom dashboards, event tracking</p>
                        </TooltipContent>
                      </Tooltip>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 mt-1 h-5 w-5 flex-shrink-0 text-orange" />
                    <span className="flex items-center">
                      Custom animations
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="ml-1 h-4 w-4 cursor-pointer text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="w-[200px] text-sm">Scroll effects, transitions</p>
                        </TooltipContent>
                      </Tooltip>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 mt-1 h-5 w-5 flex-shrink-0 text-orange" />
                    <span className="flex items-center">
                      Advanced integrations
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="ml-1 h-4 w-4 cursor-pointer text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="w-[200px] text-sm">CRM, marketing automation</p>
                        </TooltipContent>
                      </Tooltip>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 mt-1 h-5 w-5 flex-shrink-0 text-orange" />
                    <span className="flex items-center">
                      Premium performance optimization
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="ml-1 h-4 w-4 cursor-pointer text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="w-[200px] text-sm">Core Web Vitals optimization</p>
                        </TooltipContent>
                      </Tooltip>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 mt-1 h-5 w-5 flex-shrink-0 text-orange" />
                    <span>3 rounds of revisions</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 mt-1 h-5 w-5 flex-shrink-0 text-orange" />
                    <span>Post-launch support: 4 weeks</span>
                  </li>
                </ul>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="mt-auto"
              >
                <Button
                  className="w-full bg-teal text-white hover:bg-teal-600"
                  onClick={() => handlePlanSelection("premier")}
                >
                  {buttonText}
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </TooltipProvider>
  )
}
