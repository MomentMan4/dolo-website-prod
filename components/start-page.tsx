"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Check, Zap, Info } from "lucide-react"
import Link from "next/link"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { handleStartFormSubmission } from "@/app/start/actions"
import { toast } from "@/components/ui/use-toast"

export function StartPage() {
  const searchParams = useSearchParams()

  // State for selected plan - initialize with URL parameter
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [rushDelivery, setRushDelivery] = useState(false)
  const [yearlyMaintenance, setYearlyMaintenance] = useState(false)
  const [addOns, setAddOns] = useState({
    maintenance: false,
    googleBusiness: false,
    accessibility: false,
    privacy: false,
  })

  // Form state
  const [hasExistingWebsite, setHasExistingWebsite] = useState<boolean | null>(null)
  const [existingWebsiteUrl, setExistingWebsiteUrl] = useState("")
  const [hasHostingDomain, setHasHostingDomain] = useState<boolean | null>(null)
  const [hasLogo, setHasLogo] = useState<boolean | null>(null)
  const [logoLink, setLogoLink] = useState("")
  const [websitePurpose, setWebsitePurpose] = useState({
    generateLeads: false,
    provideInformation: false,
    other: false,
  })
  const [otherPurpose, setOtherPurpose] = useState("")
  const [brandingGuidelines, setBrandingGuidelines] = useState<boolean | null>(null)

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle URL parameters for plan selection
  useEffect(() => {
    const planParam = searchParams.get("plan")
    if (planParam && (planParam === "essential" || planParam === "pro" || planParam === "premier")) {
      setSelectedPlan(planParam)
      console.log("Plan pre-selected from URL:", planParam)
    }
  }, [searchParams])

  // Pricing data
  const plans = {
    essential: 499.99,
    pro: 849.99,
    premier: 1199.99,
  }

  const addOnPrices = {
    maintenance: 49.99,
    googleBusiness: 129.99,
    accessibility: 149.99,
    privacy: 149.99,
  }

  // Calculate total price
  const [totalPrice, setTotalPrice] = useState(0)
  const [monthlyPrice, setMonthlyPrice] = useState(0)

  useEffect(() => {
    let oneTimePrice = 0
    let monthly = 0

    // Add plan price
    if (selectedPlan === "essential") oneTimePrice += plans.essential
    else if (selectedPlan === "pro") oneTimePrice += plans.pro
    else if (selectedPlan === "premier") oneTimePrice += plans.premier

    // Add rush delivery
    if (rushDelivery && selectedPlan) {
      oneTimePrice += oneTimePrice * 0.2
    }

    // Add add-ons
    if (addOns.maintenance) {
      if (yearlyMaintenance) {
        // 10% discount for yearly and charge for 12 months upfront
        const yearlyRate = addOnPrices.maintenance * 12 * 0.9
        oneTimePrice += yearlyRate
      } else {
        monthly += addOnPrices.maintenance
      }
    }

    if (addOns.googleBusiness) oneTimePrice += addOnPrices.googleBusiness
    if (addOns.accessibility) oneTimePrice += addOnPrices.accessibility
    if (addOns.privacy) oneTimePrice += addOnPrices.privacy

    setTotalPrice(oneTimePrice)
    setMonthlyPrice(monthly)
  }, [selectedPlan, rushDelivery, addOns, yearlyMaintenance])

  // Handle add-on toggle
  const toggleAddOn = (addOn: keyof typeof addOns) => {
    setAddOns((prev) => {
      const newAddOns = {
        ...prev,
        [addOn]: !prev[addOn],
      }

      // If we're turning off maintenance, also turn off yearly maintenance
      if (addOn === "maintenance" && !newAddOns.maintenance) {
        setYearlyMaintenance(false)
      }

      return newAddOns
    })
  }

  // Handle form submission with proper error handling
  const handleSubmit = async (formData: FormData) => {
    if (!selectedPlan) {
      toast({
        title: "Please select a plan",
        description: "You need to select a plan before proceeding.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      console.log("=== START FORM SUBMISSION ===")
      console.log("Selected plan:", selectedPlan)
      console.log("Form data being submitted...")

      // Add plan and add-on information to form data
      formData.append("selectedPlan", selectedPlan)
      formData.append("rushDelivery", rushDelivery.toString())
      formData.append("yearlyMaintenance", yearlyMaintenance.toString())

      // Add add-ons
      Object.entries(addOns).forEach(([key, value]) => {
        formData.append(key, value.toString())
      })

      // Add website purpose
      formData.append("generateLeads", websitePurpose.generateLeads.toString())
      formData.append("provideInformation", websitePurpose.provideInformation.toString())
      if (websitePurpose.other && otherPurpose) {
        formData.append("otherPurpose", otherPurpose)
      }

      // Add boolean fields
      if (hasExistingWebsite !== null) {
        formData.append("hasExistingWebsite", hasExistingWebsite.toString())
      }
      if (hasHostingDomain !== null) {
        formData.append("hasHostingDomain", hasHostingDomain.toString())
      }
      if (hasLogo !== null) {
        formData.append("hasLogo", hasLogo.toString())
      }
      if (brandingGuidelines !== null) {
        formData.append("brandingGuidelines", brandingGuidelines.toString())
      }

      // Add optional fields
      if (existingWebsiteUrl) {
        formData.append("existingWebsiteUrl", existingWebsiteUrl)
      }
      if (logoLink) {
        formData.append("logoLink", logoLink)
      }

      console.log("Calling server action...")

      // Call the server action and get the response
      const result = await handleStartFormSubmission(formData)

      console.log("Server action response:", result)

      if (result.success && result.redirectUrl) {
        // Successful response with redirect URL
        console.log("Redirecting to Stripe checkout:", result.redirectUrl)
        window.location.href = result.redirectUrl
        return
      } else {
        // Error response
        throw new Error(result.error || "Unknown error occurred")
      }
    } catch (error: any) {
      console.error("=== START FORM SUBMISSION ERROR ===")
      console.error("Error details:", error)

      // Show user-friendly error message
      toast({
        title: "Something went wrong",
        description:
          error instanceof Error ? error.message : "Please try again or contact support if the problem persists.",
        variant: "destructive",
      })

      setIsSubmitting(false)
    }
  }

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: {
      opacity: 1,
      x: 0,
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

  return (
    <TooltipProvider>
      <section className="bg-gradient-to-b from-white to-gray-50 py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div className="mb-12 text-center" initial="hidden" animate="show" variants={fadeIn}>
            <h1 className="mb-4 text-3xl font-bold text-navy md:text-4xl lg:text-5xl">
              Let's Get Your Website Started
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Select a plan that fits your needs, choose any add-ons, and tell us a bit about your project.
            </p>
          </motion.div>

          <form action={handleSubmit}>
            {/* Plan Selection */}
            <div className="mb-12">
              <h2 className="mb-6 text-xl font-bold text-navy md:text-2xl">Select Your Plan</h2>

              <motion.div className="grid gap-6 md:grid-cols-3" variants={container} initial="hidden" animate="show">
                {/* Essential Plan */}
                <motion.div
                  className={`relative cursor-pointer rounded-xl border-2 p-6 transition-all ${
                    selectedPlan === "essential"
                      ? "border-orange bg-orange/5"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                  variants={item}
                  onClick={() => setSelectedPlan("essential")}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {selectedPlan === "essential" && (
                    <div className="absolute -right-2 -top-2 rounded-full bg-orange p-1 text-white">
                      <Check size={16} />
                    </div>
                  )}
                  <h3 className="mb-2 text-lg font-bold text-navy">Essential</h3>
                  <div className="mb-4 flex items-baseline">
                    <span className="text-2xl font-bold text-navy">$499</span>
                    <span className="text-sm font-medium text-navy">.99</span>
                  </div>
                  <p className="text-sm text-gray-600">10–14 days delivery</p>
                  <p className="mt-4 text-sm text-gray-600">
                    Perfect for businesses and brands just getting started online.
                  </p>
                </motion.div>

                {/* Pro Plan */}
                <motion.div
                  className={`relative cursor-pointer rounded-xl border-2 p-6 transition-all ${
                    selectedPlan === "pro"
                      ? "border-orange bg-orange/5"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                  variants={item}
                  onClick={() => setSelectedPlan("pro")}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  animate={
                    selectedPlan !== "pro" && !selectedPlan
                      ? {
                          boxShadow: [
                            "0 0 0px rgba(255, 107, 53, 0)",
                            "0 0 20px rgba(255, 107, 53, 0.5)",
                            "0 0 0px rgba(255, 107, 53, 0)",
                          ],
                        }
                      : {}
                  }
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                >
                  {selectedPlan === "pro" && (
                    <div className="absolute -right-2 -top-2 rounded-full bg-orange p-1 text-white">
                      <Check size={16} />
                    </div>
                  )}
                  <div className="absolute -top-3 left-0 right-0 mx-auto w-fit rounded-full bg-orange px-3 py-1 text-xs font-bold text-white">
                    MOST POPULAR
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-navy">Pro</h3>
                  <div className="mb-4 flex items-baseline">
                    <span className="text-2xl font-bold text-navy">$849</span>
                    <span className="text-sm font-medium text-navy">.99</span>
                  </div>
                  <p className="text-sm text-gray-600">14–21 days delivery</p>
                  <p className="mt-4 text-sm text-gray-600">
                    Great for businesses looking to expand their online presence and capabilities.
                  </p>
                </motion.div>

                {/* Premier Plan */}
                <motion.div
                  className={`relative cursor-pointer rounded-xl border-2 p-6 transition-all ${
                    selectedPlan === "premier"
                      ? "border-orange bg-orange/5"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                  variants={item}
                  onClick={() => setSelectedPlan("premier")}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {selectedPlan === "premier" && (
                    <div className="absolute -right-2 -top-2 rounded-full bg-orange p-1 text-white">
                      <Check size={16} />
                    </div>
                  )}
                  <h3 className="mb-2 text-lg font-bold text-navy">Premier</h3>
                  <div className="mb-4 flex items-baseline">
                    <span className="text-2xl font-bold text-navy">$1199</span>
                    <span className="text-sm font-medium text-navy">.99</span>
                  </div>
                  <p className="text-sm text-gray-600">21–30 days delivery</p>
                  <p className="mt-4 text-sm text-gray-600">
                    For businesses that need a comprehensive, feature-rich online platform.
                  </p>
                </motion.div>
              </motion.div>
            </div>

            {/* Rush Toggle */}
            <AnimatePresence>
              {selectedPlan && (
                <motion.div
                  className="mb-12"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="rounded-xl bg-white p-6 shadow-md">
                    <div className="flex items-center">
                      <div className="flex items-center mr-4">
                        <Zap className="mr-2 h-5 w-5 text-orange" />
                        <span className="font-medium text-navy">Need it faster?</span>
                      </div>

                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={rushDelivery}
                          onChange={() => setRushDelivery(!rushDelivery)}
                        />
                        <div
                          className={`peer h-6 w-11 rounded-full after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-focus:outline-none ${
                            rushDelivery ? "bg-orange" : "bg-gray-200"
                          }`}
                        />
                        <span className="ml-3 text-sm font-medium text-gray-700">
                          Yes, prioritize my project (adds +20% cost)
                        </span>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Add-ons Section */}
            <AnimatePresence>
              {selectedPlan && (
                <motion.div
                  className="mb-12"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <h2 className="mb-6 text-xl font-bold text-navy md:text-2xl">Optional Add-ons</h2>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                    <motion.div
                      className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                        addOns.maintenance ? "border-orange bg-orange/5" : "border-gray-200 bg-white"
                      }`}
                      onClick={() => toggleAddOn("maintenance")}
                      whileHover={{ y: -5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-navy">Website Maintenance</span>
                          <span className="text-sm font-bold text-orange">${addOnPrices.maintenance}/month</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          Keep your site secure and running smoothly with regular updates, backups, and performance
                          monitoring.
                        </p>

                        {addOns.maintenance && (
                          <div
                            className="mt-2 p-2 bg-white rounded-lg border border-gray-200 relative z-10"
                            onClick={(e) => e.stopPropagation()} // Prevent click from affecting parent card
                          >
                            <label className="relative inline-flex cursor-pointer items-center">
                              <input
                                type="checkbox"
                                className="peer sr-only"
                                checked={yearlyMaintenance}
                                onChange={() => setYearlyMaintenance(!yearlyMaintenance)}
                                aria-label="Pay yearly for maintenance"
                              />
                              <div
                                className={`peer h-5 w-9 rounded-full after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-focus:outline-none ${
                                  yearlyMaintenance ? "bg-orange" : "bg-gray-200"
                                }`}
                              />
                              <span className="ml-3 text-xs font-medium text-gray-700">Pay yearly (10% discount)</span>
                            </label>
                          </div>
                        )}
                      </div>
                    </motion.div>

                    <motion.div
                      className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                        addOns.googleBusiness ? "border-orange bg-orange/5" : "border-gray-200 bg-white"
                      }`}
                      onClick={() => toggleAddOn("googleBusiness")}
                      whileHover={{ y: -5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-navy">Google Business Profile Setup</span>
                          <span className="text-sm font-bold text-orange">${addOnPrices.googleBusiness}</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          Improve local visibility and show up in Google searches and maps with a professionally
                          optimized Google Business Profile.
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                        addOns.accessibility ? "border-orange bg-orange/5" : "border-gray-200 bg-white"
                      }`}
                      onClick={() => toggleAddOn("accessibility")}
                      whileHover={{ y: -5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-navy">Accessibility Enhancements</span>
                          <span className="text-sm font-bold text-orange">${addOnPrices.accessibility}</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          Make your site inclusive and compliant with WCAG standards to reach all potential customers
                          and reduce legal risks.
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                        addOns.privacy ? "border-orange bg-orange/5" : "border-gray-200 bg-white"
                      }`}
                      onClick={() => toggleAddOn("privacy")}
                      whileHover={{ y: -5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-navy">Privacy Compliance</span>
                          <span className="text-sm font-bold text-orange">${addOnPrices.privacy}</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          Ensure your website is GDPR, CCPA, PIPEDA, NDPR compliant among others. This is for websites
                          that collect and process user information across countries that require compliance.
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pricing Breakdown */}
            <AnimatePresence>
              {selectedPlan && (
                <motion.div
                  className="mb-12"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <div className="rounded-xl bg-white p-6 shadow-md">
                    <h2 className="mb-4 text-xl font-bold text-navy">Pricing Breakdown</h2>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Selected Plan:</span>
                        <motion.span
                          className="font-medium"
                          key={selectedPlan}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          ${selectedPlan === "essential" ? "499.99" : selectedPlan === "pro" ? "849.99" : "1199.99"}
                        </motion.span>
                      </div>

                      {rushDelivery && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rush Delivery (20%):</span>
                          <motion.span
                            className="font-medium"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            $
                            {(selectedPlan === "essential" ? 99.99 : selectedPlan === "pro" ? 169.99 : 239.99).toFixed(
                              2,
                            )}
                          </motion.span>
                        </div>
                      )}

                      {/* Website Maintenance */}
                      {addOns.maintenance && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Website Maintenance ({yearlyMaintenance ? "Yearly with 10% discount" : "Monthly"}):
                          </span>
                          <motion.span
                            className="font-medium"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            {yearlyMaintenance
                              ? `$${(addOnPrices.maintenance * 12 * 0.9).toFixed(2)}`
                              : `$${addOnPrices.maintenance.toFixed(2)}/month`}
                          </motion.span>
                        </div>
                      )}

                      {/* Google Business Profile */}
                      {addOns.googleBusiness && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Google Business Profile Setup:</span>
                          <motion.span
                            className="font-medium"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            ${addOnPrices.googleBusiness.toFixed(2)}
                          </motion.span>
                        </div>
                      )}

                      {/* Accessibility */}
                      {addOns.accessibility && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Accessibility Enhancements:</span>
                          <motion.span
                            className="font-medium"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            ${addOnPrices.accessibility.toFixed(2)}
                          </motion.span>
                        </div>
                      )}

                      {/* Privacy */}
                      {addOns.privacy && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Privacy Compliance:</span>
                          <motion.span
                            className="font-medium"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            ${addOnPrices.privacy.toFixed(2)}
                          </motion.span>
                        </div>
                      )}

                      <div className="border-t border-gray-200 pt-2">
                        <div className="flex justify-between">
                          <span className="text-lg font-bold text-navy">Total One-Time Price:</span>
                          <motion.span
                            className="text-lg font-bold text-orange"
                            key={totalPrice}
                            initial={{ scale: 1 }}
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 0.4 }}
                          >
                            ${totalPrice.toFixed(2)}
                          </motion.span>
                        </div>

                        {monthlyPrice > 0 && !yearlyMaintenance && (
                          <div className="flex justify-between mt-2">
                            <span className="text-sm font-medium text-gray-600">Monthly Recurring:</span>
                            <span className="text-sm font-medium text-gray-600">${monthlyPrice.toFixed(2)}/month</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Intake Form */}
            <AnimatePresence>
              {selectedPlan && (
                <motion.div
                  className="mb-12"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <div className="rounded-xl bg-white p-6 shadow-md">
                    <h2 className="mb-6 text-xl font-bold text-navy">Tell Us About Your Project</h2>
                    <div className="mb-6 rounded-lg bg-orange-50 p-4 border border-orange-200">
                      <p className="text-sm text-gray-600">
                        <span className="text-red-500 font-medium">*</span> indicates required fields. Required fields
                        have a subtle orange background to help you identify them.
                      </p>
                    </div>

                    <div className="space-y-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Label htmlFor="name">
                          Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          className="mt-1 border-orange-300 focus:border-orange focus:ring-orange bg-orange-50/20"
                          required
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Label htmlFor="email">
                          Email Address <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          className="mt-1 border-orange-300 focus:border-orange focus:ring-orange bg-orange-50/20"
                          required
                        />
                      </motion.div>

                      {/* New field: Existing website */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <Label htmlFor="existing-website">
                          Do you have an existing website? <span className="text-red-500">*</span>
                        </Label>
                        <div className="mt-2 flex space-x-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="existing-website"
                              className="h-4 w-4 text-orange"
                              checked={hasExistingWebsite === true}
                              onChange={() => setHasExistingWebsite(true)}
                              required
                            />
                            <span className="ml-2 text-sm">Yes</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="existing-website"
                              className="h-4 w-4 text-orange"
                              checked={hasExistingWebsite === false}
                              onChange={() => setHasExistingWebsite(false)}
                              required
                            />
                            <span className="ml-2 text-sm">No</span>
                          </label>
                        </div>

                        {/* Conditional field for website URL */}
                        <AnimatePresence>
                          {hasExistingWebsite && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-2"
                            >
                              <Label htmlFor="website-url">Website URL</Label>
                              <Input
                                id="website-url"
                                name="existingWebsiteUrl"
                                type="url"
                                placeholder="https://example.com"
                                value={existingWebsiteUrl}
                                onChange={(e) => setExistingWebsiteUrl(e.target.value)}
                                className="mt-1"
                                required
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      {/* New field: Domain & Hosting */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <Label htmlFor="hosting-domain">
                          Do you have existing domain & hosting? <span className="text-red-500">*</span>
                        </Label>
                        <div className="mt-2 flex space-x-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="hosting-domain"
                              className="h-4 w-4 text-orange"
                              checked={hasHostingDomain === true}
                              onChange={() => setHasHostingDomain(true)}
                              required
                            />
                            <span className="ml-2 text-sm">Yes</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="hosting-domain"
                              className="h-4 w-4 text-orange"
                              checked={hasHostingDomain === false}
                              onChange={() => setHasHostingDomain(false)}
                              required
                            />
                            <span className="ml-2 text-sm">No</span>
                          </label>
                        </div>
                      </motion.div>

                      {/* New field: Logo */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                      >
                        <Label htmlFor="has-logo">
                          Do you have a logo? <span className="text-red-500">*</span>
                        </Label>
                        <div className="mt-2 flex space-x-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="has-logo"
                              className="h-4 w-4 text-orange"
                              checked={hasLogo === true}
                              onChange={() => setHasLogo(true)}
                              required
                            />
                            <span className="ml-2 text-sm">Yes</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="has-logo"
                              className="h-4 w-4 text-orange"
                              checked={hasLogo === false}
                              onChange={() => setHasLogo(false)}
                              required
                            />
                            <span className="ml-2 text-sm">No</span>
                          </label>
                        </div>

                        {/* Conditional field for logo link */}
                        <AnimatePresence>
                          {hasLogo && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-2"
                            >
                              <Label htmlFor="logo-link">Logo Link</Label>
                              <Input
                                id="logo-link"
                                name="logoLink"
                                type="url"
                                placeholder="https://drive.google.com/..."
                                value={logoLink}
                                onChange={(e) => setLogoLink(e.target.value)}
                                className="mt-1"
                                required
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      {/* Website Purpose */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                      >
                        <Label>
                          What is the purpose of the website? <span className="text-red-500">*</span>
                        </Label>
                        <div className="mt-2 space-y-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded text-orange"
                              checked={websitePurpose.generateLeads}
                              onChange={() =>
                                setWebsitePurpose((prev) => ({ ...prev, generateLeads: !prev.generateLeads }))
                              }
                            />
                            <span className="ml-2 text-sm">Generate leads</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded text-orange"
                              checked={websitePurpose.provideInformation}
                              onChange={() =>
                                setWebsitePurpose((prev) => ({ ...prev, provideInformation: !prev.provideInformation }))
                              }
                            />
                            <span className="ml-2 text-sm">Provide information</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded text-orange"
                              checked={websitePurpose.other}
                              onChange={() => setWebsitePurpose((prev) => ({ ...prev, other: !prev.other }))}
                            />
                            <span className="ml-2 text-sm">Something else</span>
                          </label>

                          {/* Conditional field for other purpose */}
                          <AnimatePresence>
                            {websitePurpose.other && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <Input
                                  placeholder="Please specify"
                                  value={otherPurpose}
                                  onChange={(e) => setOtherPurpose(e.target.value)}
                                  className="mt-1"
                                  required
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>

                      {/* Target Audience */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0 }}
                      >
                        <Label htmlFor="target-audience">
                          Who is the target audience for the website? <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="target-audience"
                          name="targetAudience"
                          className="mt-1 border-orange-300 focus:border-orange focus:ring-orange bg-orange-50/20"
                          required
                        />
                      </motion.div>

                      {/* Main Products/Services */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1 }}
                      >
                        <Label htmlFor="products-services">
                          What are the main products or services that the website will be promoting?{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="products-services"
                          name="productsServices"
                          className="mt-1 border-orange-300 focus:border-orange focus:ring-orange bg-orange-50/20"
                          required
                        />
                      </motion.div>

                      {/* Branding Guidelines */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                      >
                        <Label htmlFor="branding-guidelines">
                          Are there any existing branding guidelines or materials that should be incorporated into the
                          website?
                        </Label>
                        <div className="mt-2 flex space-x-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="branding-guidelines"
                              className="h-4 w-4 text-orange"
                              checked={brandingGuidelines === true}
                              onChange={() => setBrandingGuidelines(true)}
                            />
                            <span className="ml-2 text-sm">Yes</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="branding-guidelines"
                              className="h-4 w-4 text-orange"
                              checked={brandingGuidelines === false}
                              onChange={() => setBrandingGuidelines(false)}
                            />
                            <span className="ml-2 text-sm">No</span>
                          </label>
                        </div>
                      </motion.div>

                      {/* Competitors */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.3 }}
                      >
                        <Label htmlFor="competitors">
                          What are the main competitors in the industry, and what do you like or dislike about their
                          websites?
                        </Label>
                        <Textarea id="competitors" name="competitors" className="mt-1" />
                      </motion.div>

                      {/* Website Updates */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4 }}
                      >
                        <Label htmlFor="updates">
                          How frequently will the website need to be updated, and who will be responsible for making
                          those updates?
                        </Label>
                        <Textarea id="updates" name="updates" className="mt-1" />
                      </motion.div>

                      {/* SEO Keywords */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5 }}
                      >
                        <Label htmlFor="keywords">
                          Are there any specific keywords or phrases that you want to target for search engine
                          optimization purposes?
                        </Label>
                        <Textarea id="keywords" name="keywords" className="mt-1" />
                      </motion.div>

                      {/* Reference Files */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.6 }}
                      >
                        <div className="flex items-center">
                          <Label htmlFor="files">Upload reference files (optional)</Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="ml-2 h-4 w-4 cursor-pointer text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p className="w-[200px] text-sm">
                                We recommend you share a link to your shared drive folder.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <Input id="files" name="files" type="file" className="mt-1" multiple />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.7 }}
                        className="pt-4"
                      >
                        <Button
                          type="submit"
                          className="w-full bg-orange text-white hover:bg-orange-600 md:w-auto"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Processing..." : "Start My Website"}
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer CTA */}
            <div className="text-center">
              <p className="mb-4 text-gray-600">Need something custom instead?</p>
              <Link href="/private-build">
                <Button variant="outline" className="border-navy text-navy hover:bg-navy/10">
                  Explore Private Build
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </section>
    </TooltipProvider>
  )
}
