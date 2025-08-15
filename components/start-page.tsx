"use client"

import type React from "react"

import { useSearchParams } from "next/navigation"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion } from "framer-motion"
import { Check, ArrowRight, Shield, Zap, Star, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { handleStartFormSubmission } from "@/app/start/actions"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
type PlanType = "essential" | "pro" | "premier"

interface PlanDetails {
  name: string
  price: number
  originalPrice?: number
  description: string
  features: string[]
  popular?: boolean
  color: string
}

const plans: Record<PlanType, PlanDetails> = {
  essential: {
    name: "Essential",
    price: 499.99,
    description: "Perfect for small businesses and startups",
    features: [
      "Custom responsive design",
      "Up to 5 pages",
      "Mobile optimization",
      "Basic SEO setup",
      "Contact form",
      "Social media integration",
      "1 month support",
    ],
    color: "from-blue-500 to-blue-600",
  },
  pro: {
    name: "Pro",
    price: 849.99,
    description: "Ideal for growing businesses",
    features: [
      "Everything in Essential",
      "Up to 10 pages",
      "Advanced SEO optimization",
      "E-commerce ready",
      "Blog integration",
      "Analytics setup",
      "Lead capture forms",
      "3 months support",
    ],
    popular: true,
    color: "from-orange to-orange/90",
  },
  premier: {
    name: "Premier",
    price: 1199.99,
    description: "Complete solution for established businesses",
    features: [
      "Everything in Pro",
      "Unlimited pages",
      "Premium SEO package",
      "Full e-commerce suite",
      "Custom integrations",
      "Performance optimization",
      "Security enhancements",
      "6 months support",
    ],
    color: "from-purple-500 to-purple-600",
  },
}

const addOnPrices = {
  maintenance: { monthly: 49.99, yearly: 539.89 }, // 10% discount for yearly
  googleBusiness: 149.99,
  accessibility: 299.99,
  privacy: 199.99,
}

// Form persistence utilities
const FORM_STORAGE_KEY = "dolo_start_form_data"
const FORM_EXPIRY_KEY = "dolo_start_form_expiry"
const FORM_EXPIRY_HOURS = 24 // Form data expires after 24 hours

const saveFormData = (data: any) => {
  try {
    const expiryTime = Date.now() + FORM_EXPIRY_HOURS * 60 * 60 * 1000
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(data))
    localStorage.setItem(FORM_EXPIRY_KEY, expiryTime.toString())
  } catch (error) {
    console.warn("Failed to save form data:", error)
  }
}

const loadFormData = () => {
  try {
    const expiryTime = localStorage.getItem(FORM_EXPIRY_KEY)
    if (expiryTime && Date.now() > Number.parseInt(expiryTime)) {
      // Data has expired, clear it
      clearFormData()
      return null
    }

    const savedData = localStorage.getItem(FORM_STORAGE_KEY)
    return savedData ? JSON.parse(savedData) : null
  } catch (error) {
    console.warn("Failed to load form data:", error)
    return null
  }
}

const clearFormData = () => {
  try {
    localStorage.removeItem(FORM_STORAGE_KEY)
    localStorage.removeItem(FORM_EXPIRY_KEY)
  } catch (error) {
    console.warn("Failed to clear form data:", error)
  }
}

export function StartPage() {
  const searchParams = useSearchParams()

  // State for selected plan - initialize with URL parameter
  // Form state
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null)
  const [rushDelivery, setRushDelivery] = useState(false)
  const [addOns, setAddOns] = useState({
    maintenance: false,
    googleBusiness: false,
    accessibility: false,
    privacy: false,
  })
  const [yearlyMaintenance, setYearlyMaintenance] = useState(false)

  // Customer information
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    hasExistingWebsite: null as boolean | null,
    existingWebsiteUrl: "",
    hasHostingDomain: null as boolean | null,
    hasLogo: null as boolean | null,
    logoLink: "",
    websitePurpose: {
      generateLeads: false,
      provideInformation: false,
      other: false,
    },
    otherPurpose: "",
    targetAudience: "",
    productsServices: "",
    brandingGuidelines: null as boolean | null,
    competitors: "",
    updates: "",
    keywords: "",
  })

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})

  // Load saved form data on mount
  useEffect(() => {
    const savedData = loadFormData()
    if (savedData) {
      setSelectedPlan(savedData.selectedPlan || null)
      setRushDelivery(savedData.rushDelivery || false)
      setAddOns(
        savedData.addOns || {
          maintenance: false,
          googleBusiness: false,
          accessibility: false,
          privacy: false,
        },
      )
      setYearlyMaintenance(savedData.yearlyMaintenance || false)
      setFormData(
        savedData.formData || {
          name: "",
          email: "",
          hasExistingWebsite: null,
          existingWebsiteUrl: "",
          hasHostingDomain: null,
          hasLogo: null,
          logoLink: "",
          websitePurpose: {
            generateLeads: false,
            provideInformation: false,
            other: false,
          },
          otherPurpose: "",
          targetAudience: "",
          productsServices: "",
          brandingGuidelines: null,
          competitors: "",
          updates: "",
          keywords: "",
        },
      )
    }
  }, [])

  // Save form data whenever it changes
  useEffect(() => {
    const dataToSave = {
      selectedPlan,
      rushDelivery,
      addOns,
      yearlyMaintenance,
      formData,
    }
    saveFormData(dataToSave)
  }, [selectedPlan, rushDelivery, addOns, yearlyMaintenance, formData])

  // Clear form data when component unmounts (browser close)
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Don't clear data on page refresh/navigation, only on browser close
      // The data will expire naturally after 24 hours
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [])

  // Calculate total price
  const totalPrice = useMemo(() => {
    if (!selectedPlan) return 0

    let total = plans[selectedPlan].price

    // Add rush delivery fee (20% of base plan price)
    if (rushDelivery) {
      total += plans[selectedPlan].price * 0.2
    }

    // Add add-ons
    if (addOns.maintenance) {
      if (yearlyMaintenance) {
        total += addOnPrices.maintenance.yearly
      } else {
        // For monthly maintenance, we add the first month to the initial payment
        total += addOnPrices.maintenance.monthly
      }
    }
    if (addOns.googleBusiness) total += addOnPrices.googleBusiness
    if (addOns.accessibility) total += addOnPrices.accessibility
    if (addOns.privacy) total += addOnPrices.privacy

    return total
  }, [selectedPlan, rushDelivery, addOns, yearlyMaintenance])

  // Handle form field changes
  const handleInputChange = useCallback(
    (field: string, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }))

      // Clear validation errors for this field
      if (validationErrors[field]) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[field]
          return newErrors
        })
      }
    },
    [validationErrors],
  )

  // Handle add-on changes
  const handleAddOnChange = useCallback((addOn: keyof typeof addOns, checked: boolean) => {
    setAddOns((prev) => ({ ...prev, [addOn]: checked }))

    // If maintenance is unchecked, also uncheck yearly maintenance
    if (addOn === "maintenance" && !checked) {
      setYearlyMaintenance(false)
    }
  }, [])

  // Validate form
  const validateForm = useCallback(() => {
    const errors: Record<string, string[]> = {}

    if (!selectedPlan) {
      errors.plan = ["Please select a plan"]
    }

    if (!formData.name.trim()) {
      errors.name = ["Name is required"]
    }

    if (!formData.email.trim()) {
      errors.email = ["Email is required"]
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = ["Please enter a valid email address"]
    }

    if (formData.hasExistingWebsite === null) {
      errors.hasExistingWebsite = ["Please specify if you have an existing website"]
    }

    if (formData.hasExistingWebsite && !formData.existingWebsiteUrl.trim()) {
      errors.existingWebsiteUrl = ["Please provide your existing website URL"]
    }

    if (formData.hasExistingWebsite && formData.existingWebsiteUrl.trim()) {
      const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
      if (!urlPattern.test(formData.existingWebsiteUrl.trim())) {
        errors.existingWebsiteUrl = ["Please enter a valid website URL"]
      }
    }

    if (formData.hasHostingDomain === null) {
      errors.hasHostingDomain = ["Please specify if you have hosting and domain"]
    }

    if (formData.hasLogo === null) {
      errors.hasLogo = ["Please specify if you have a logo"]
    }

    if (formData.hasLogo && !formData.logoLink.trim()) {
      errors.logoLink = ["Please provide a link to your logo"]
    }

    if (
      !formData.websitePurpose.generateLeads &&
      !formData.websitePurpose.provideInformation &&
      !formData.websitePurpose.other
    ) {
      errors.websitePurpose = ["Please select at least one website purpose"]
    }

    if (formData.websitePurpose.other && !formData.otherPurpose.trim()) {
      errors.otherPurpose = ["Please specify your other purpose"]
    }

    if (!formData.targetAudience.trim()) {
      errors.targetAudience = ["Please describe your target audience"]
    }

    if (!formData.productsServices.trim()) {
      errors.productsServices = ["Please describe your products/services"]
    }

    if (formData.brandingGuidelines === null) {
      errors.brandingGuidelines = ["Please specify if you have branding guidelines"]
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }, [selectedPlan, formData])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(validationErrors)[0]
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`)
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" })
      }
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Create FormData object
      const submitData = new FormData()

      // Add customer data
      submitData.append("name", formData.name)
      submitData.append("email", formData.email)

      // Add plan selection
      submitData.append("selectedPlan", selectedPlan!)
      submitData.append("rushDelivery", rushDelivery.toString())

      // Add add-ons
      Object.entries(addOns).forEach(([key, value]) => {
        submitData.append(key, value.toString())
      })
      submitData.append("yearlyMaintenance", yearlyMaintenance.toString())

      // Add project details
      submitData.append("hasExistingWebsite", formData.hasExistingWebsite?.toString() || "false")
      if (formData.existingWebsiteUrl) {
        submitData.append("existingWebsiteUrl", formData.existingWebsiteUrl)
      }
      submitData.append("hasHostingDomain", formData.hasHostingDomain?.toString() || "false")
      submitData.append("hasLogo", formData.hasLogo?.toString() || "false")
      if (formData.logoLink) {
        submitData.append("logoLink", formData.logoLink)
      }

      // Add website purpose
      submitData.append("generateLeads", formData.websitePurpose.generateLeads.toString())
      submitData.append("provideInformation", formData.websitePurpose.provideInformation.toString())
      if (formData.websitePurpose.other) {
        submitData.append("otherPurpose", formData.otherPurpose)
      }

      submitData.append("targetAudience", formData.targetAudience)
      submitData.append("productsServices", formData.productsServices)
      submitData.append("brandingGuidelines", formData.brandingGuidelines?.toString() || "false")

      if (formData.competitors) {
        submitData.append("competitors", formData.competitors)
      }
      if (formData.updates) {
        submitData.append("updates", formData.updates)
      }
      if (formData.keywords) {
        submitData.append("keywords", formData.keywords)
      }

      console.log("Submitting form data...")
      const result = await handleStartFormSubmission(submitData)

      if (result.success && result.redirectUrl) {
        console.log("Redirecting to Stripe:", result.redirectUrl)
        // Don't clear form data here - only clear after successful payment
        window.location.href = result.redirectUrl
      } else {
        console.error("Form submission failed:", result.error)
        setSubmitError(result.error || "An unexpected error occurred")
      }
    } catch (error) {
      console.error("Form submission error:", error)
      setSubmitError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get field classes for styling
  const getFieldClasses = (fieldName: string, required = false) =>
    cn(
      "mt-1 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1",
      required
        ? "border-orange-300 focus:border-orange focus:ring-orange bg-orange-50/20"
        : "border-gray-300 focus:border-gray-500 focus:ring-gray-500",
      validationErrors[fieldName] && "border-red-300 focus:border-red-500 focus:ring-red-500",
    )

  // Handle URL parameters for plan selection
  useEffect(() => {
    const planParam = searchParams.get("plan")
    if (planParam && (planParam === "essential" || planParam === "pro" || planParam === "premier")) {
      setSelectedPlan(planParam)
      console.log("Plan pre-selected from URL:", planParam)
    }
  }, [searchParams])

  // Pricing data
  const plansOld = {
    essential: 499.99,
    pro: 849.99,
    premier: 1199.99,
  }

  const addOnPricesOld = {
    maintenance: 49.99,
    googleBusiness: 129.99,
    accessibility: 149.99,
    privacy: 149.99,
  }

  // Calculate total price
  const [totalPriceOld, setTotalPriceOld] = useState(0)
  const [monthlyPriceOld, setMonthlyPriceOld] = useState(0)

  useEffect(() => {
    let oneTimePrice = 0
    let monthly = 0

    // Add plan price
    if (selectedPlan === "essential") oneTimePrice += plansOld.essential
    else if (selectedPlan === "pro") oneTimePrice += plansOld.pro
    else if (selectedPlan === "premier") oneTimePrice += plansOld.premier

    // Add rush delivery
    if (rushDelivery && selectedPlan) {
      const basePlanPrice =
        selectedPlan === "essential" ? plansOld.essential : selectedPlan === "pro" ? plansOld.pro : plansOld.premier
      oneTimePrice += basePlanPrice * 0.2
    }

    // Add add-ons
    if (addOns.maintenance) {
      if (yearlyMaintenance) {
        // 10% discount for yearly and charge for 12 months upfront
        const yearlyRate = addOnPricesOld.maintenance * 12 * 0.9
        oneTimePrice += yearlyRate
      } else {
        monthly += addOnPricesOld.maintenance
      }
    }

    if (addOns.googleBusiness) oneTimePrice += addOnPricesOld.googleBusiness
    if (addOns.accessibility) oneTimePrice += addOnPricesOld.accessibility
    if (addOns.privacy) oneTimePrice += addOnPricesOld.privacy

    setTotalPriceOld(oneTimePrice)
    setMonthlyPriceOld(monthly)
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
  const handleSubmitOld = async (formData: FormData) => {
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
      formData.append("generateLeads", formData.websitePurpose.generateLeads.toString())
      formData.append("provideInformation", formData.websitePurpose.provideInformation.toString())
      if (formData.websitePurpose.other && formData.otherPurpose) {
        formData.append("otherPurpose", formData.otherPurpose)
      }

      // Add boolean fields
      if (formData.hasExistingWebsite !== null) {
        formData.append("hasExistingWebsite", formData.hasExistingWebsite.toString())
      }
      if (formData.hasHostingDomain !== null) {
        formData.append("hasHostingDomain", formData.hasHostingDomain.toString())
      }
      if (formData.hasLogo !== null) {
        formData.append("hasLogo", formData.hasLogo.toString())
      }
      if (formData.brandingGuidelines !== null) {
        formData.append("brandingGuidelines", formData.brandingGuidelines.toString())
      }

      // Add optional fields
      if (formData.existingWebsiteUrl) {
        formData.append("existingWebsiteUrl", formData.existingWebsiteUrl)
      }
      if (formData.logoLink) {
        formData.append("logoLink", formData.logoLink)
      }

      console.log("Calling server action...")

      // Call the server action and get the response
      const result = await handleStartFormSubmission(formData)

      console.log("Server action response:", result)

      if (result.success && result.redirectUrl) {
        // Clear form cache on successful submission
        clearFormData()
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
    <div className="min-h-screen bg-gradient-to-br from-[#003B6F]/5 via-[#007196]/5 to-[#FF5073]/5">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange/20 to-pink/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-navy/20 to-teal/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-4xl md:text-6xl font-bold text-navy mb-6">
                Start Your Website
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange to-pink">
                  Journey Today
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Choose your plan, tell us about your vision, and we'll create a stunning website that drives results for
                your business.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Plan Selection Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Choose Your Perfect Plan</h2>
              <p className="text-lg text-gray-600">Select the plan that best fits your business needs and budget</p>
            </motion.div>

            {/* Plan Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {Object.entries(plans).map(([key, plan], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className={cn(
                    "relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 cursor-pointer hover:shadow-xl",
                    selectedPlan === key
                      ? "border-orange ring-2 ring-orange/20"
                      : "border-gray-200 hover:border-orange/50",
                    plan.popular && "ring-2 ring-orange/20",
                  )}
                  onClick={() => setSelectedPlan(key as PlanType)}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-orange to-pink text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div className="p-8">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-navy mb-2">{plan.name}</h3>
                      <div className="text-4xl font-bold text-navy mb-2">${plan.price.toLocaleString()}</div>
                      <p className="text-gray-600">{plan.description}</p>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm">
                          <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="text-center">
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full border-2 mx-auto transition-all duration-200",
                          selectedPlan === key ? "border-orange bg-orange" : "border-gray-300",
                        )}
                      >
                        {selectedPlan === key && <Check className="h-4 w-4 text-white m-0.5" />}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {validationErrors.plan && (
              <div className="text-red-500 text-sm mb-4 text-center">{validationErrors.plan[0]}</div>
            )}

            {/* Rush Delivery Option */}
            {selectedPlan && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-lg p-6 mb-8"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Zap className="h-6 w-6 text-orange" />
                    <div>
                      <h3 className="font-semibold text-navy">Rush Delivery</h3>
                      <p className="text-sm text-gray-600">Get your website 50% faster</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-semibold text-navy">
                      +${(plans[selectedPlan].price * 0.2).toFixed(2)}
                    </span>
                    <Checkbox checked={rushDelivery} onCheckedChange={setRushDelivery} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Add-ons Section */}
            {selectedPlan && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 mb-8"
              >
                <h3 className="text-xl font-semibold text-navy mb-6">Add-ons & Services</h3>

                <div className="space-y-4">
                  {/* Maintenance */}
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-green-500" />
                      <div>
                        <h4 className="font-medium text-navy">Website Maintenance</h4>
                        <p className="text-sm text-gray-600">Updates, backups, and security monitoring</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium text-navy">${addOnPrices.maintenance.monthly}/month</div>
                        <div className="text-xs text-gray-500">
                          or ${addOnPrices.maintenance.yearly}/year (save 10%)
                        </div>
                      </div>
                      <Checkbox
                        checked={addOns.maintenance}
                        onCheckedChange={(checked) => handleAddOnChange("maintenance", checked as boolean)}
                      />
                    </div>
                  </div>

                  {/* Yearly Maintenance Option */}
                  {addOns.maintenance && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.2 }}
                      className="ml-8 p-4 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-green-800">Pay Yearly & Save 10%</h5>
                          <p className="text-sm text-green-600">
                            Pay ${addOnPrices.maintenance.yearly} upfront instead of monthly billing
                          </p>
                        </div>
                        <Checkbox checked={yearlyMaintenance} onCheckedChange={setYearlyMaintenance} />
                      </div>
                    </motion.div>
                  )}

                  {/* Google Business Profile */}
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <div>
                        <h4 className="font-medium text-navy">Google Business Profile Setup</h4>
                        <p className="text-sm text-gray-600">Professional Google listing optimization</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-navy">${addOnPrices.googleBusiness}</span>
                      <Checkbox
                        checked={addOns.googleBusiness}
                        onCheckedChange={(checked) => handleAddOnChange("googleBusiness", checked as boolean)}
                      />
                    </div>
                  </div>

                  {/* Accessibility Compliance */}
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-blue-500" />
                      <div>
                        <h4 className="font-medium text-navy">Accessibility Compliance</h4>
                        <p className="text-sm text-gray-600">WCAG 2.1 AA compliance implementation</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-navy">${addOnPrices.accessibility}</span>
                      <Checkbox
                        checked={addOns.accessibility}
                        onCheckedChange={(checked) => handleAddOnChange("accessibility", checked as boolean)}
                      />
                    </div>
                  </div>

                  {/* Privacy Compliance */}
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-purple-500" />
                      <div>
                        <h4 className="font-medium text-navy">Privacy Compliance</h4>
                        <p className="text-sm text-gray-600">GDPR/CCPA privacy policy and cookie consent</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-navy">${addOnPrices.privacy}</span>
                      <Checkbox
                        checked={addOns.privacy}
                        onCheckedChange={(checked) => handleAddOnChange("privacy", checked as boolean)}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Price Summary */}
            {selectedPlan && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="bg-gradient-to-r from-orange/10 to-pink/10 rounded-xl p-6 mb-8"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-navy">Total Investment</h3>
                    <p className="text-sm text-gray-600">
                      {addOns.maintenance &&
                        !yearlyMaintenance &&
                        "Includes first month of maintenance. Monthly billing starts after project completion."}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-navy">${totalPrice.toLocaleString()}</div>
                    {addOns.maintenance && !yearlyMaintenance && (
                      <div className="text-sm text-gray-600">+ ${addOnPrices.maintenance.monthly}/month ongoing</div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Project Details Form */}
      {selectedPlan && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="py-16"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Tell Us About Your Project</h2>
                <p className="text-lg text-gray-600">
                  Help us understand your vision so we can create the perfect website for you
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Customer Information */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h3 className="text-xl font-semibold text-navy mb-6">Contact Information</h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className={getFieldClasses("name", true)}
                        placeholder="Enter your full name"
                      />
                      {validationErrors.name && <p className="text-red-500 text-xs mt-1">{validationErrors.name[0]}</p>}
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={getFieldClasses("email", true)}
                        placeholder="Enter your email address"
                      />
                      {validationErrors.email && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.email[0]}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Website Information */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h3 className="text-xl font-semibold text-navy mb-6">Current Website Status</h3>

                  <div className="space-y-6">
                    {/* Existing Website */}
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-3 block">
                        Do you currently have a website? <span className="text-red-500">*</span>
                      </Label>
                      <RadioGroup
                        value={formData.hasExistingWebsite?.toString() || ""}
                        onValueChange={(value) => handleInputChange("hasExistingWebsite", value === "true")}
                        className="flex space-x-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id="existing-yes" />
                          <Label htmlFor="existing-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="existing-no" />
                          <Label htmlFor="existing-no">No</Label>
                        </div>
                      </RadioGroup>
                      {validationErrors.hasExistingWebsite && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.hasExistingWebsite[0]}</p>
                      )}
                    </div>

                    {/* Website URL */}
                    {formData.hasExistingWebsite && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3 }}
                      >
                        <Label htmlFor="existingWebsiteUrl" className="text-sm font-medium text-gray-700">
                          Current Website URL <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="existingWebsiteUrl"
                          name="existingWebsiteUrl"
                          type="url"
                          value={formData.existingWebsiteUrl}
                          onChange={(e) => handleInputChange("existingWebsiteUrl", e.target.value)}
                          className={getFieldClasses("existingWebsiteUrl", true)}
                          placeholder="https://www.yourwebsite.com"
                        />
                        {validationErrors.existingWebsiteUrl && (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.existingWebsiteUrl[0]}</p>
                        )}
                      </motion.div>
                    )}

                    {/* Hosting and Domain */}
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-3 block">
                        Do you have hosting and a domain name? <span className="text-red-500">*</span>
                      </Label>
                      <RadioGroup
                        value={formData.hasHostingDomain?.toString() || ""}
                        onValueChange={(value) => handleInputChange("hasHostingDomain", value === "true")}
                        className="flex space-x-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id="hosting-yes" />
                          <Label htmlFor="hosting-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="hosting-no" />
                          <Label htmlFor="hosting-no">No</Label>
                        </div>
                      </RadioGroup>
                      {validationErrors.hasHostingDomain && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.hasHostingDomain[0]}</p>
                      )}
                    </div>

                    {/* Logo */}
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-3 block">
                        Do you have a logo? <span className="text-red-500">*</span>
                      </Label>
                      <RadioGroup
                        value={formData.hasLogo?.toString() || ""}
                        onValueChange={(value) => handleInputChange("hasLogo", value === "true")}
                        className="flex space-x-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id="logo-yes" />
                          <Label htmlFor="logo-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="logo-no" />
                          <Label htmlFor="logo-no">No</Label>
                        </div>
                      </RadioGroup>
                      {validationErrors.hasLogo && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.hasLogo[0]}</p>
                      )}
                    </div>

                    {/* Logo Link */}
                    {formData.hasLogo && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3 }}
                      >
                        <Label htmlFor="logoLink" className="text-sm font-medium text-gray-700">
                          Logo Link (Google Drive, Dropbox, etc.) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="logoLink"
                          name="logoLink"
                          type="url"
                          value={formData.logoLink}
                          onChange={(e) => handleInputChange("logoLink", e.target.value)}
                          className={getFieldClasses("logoLink", true)}
                          placeholder="https://drive.google.com/..."
                        />
                        {validationErrors.logoLink && (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.logoLink[0]}</p>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Business Information */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h3 className="text-xl font-semibold text-navy mb-6">Business Information</h3>

                  <div className="space-y-6">
                    {/* Website Purpose */}
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-3 block">
                        What is the main purpose of your website? <span className="text-red-500">*</span>
                      </Label>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="generate-leads"
                            checked={formData.websitePurpose.generateLeads}
                            onCheckedChange={(checked) =>
                              handleInputChange("websitePurpose", {
                                ...formData.websitePurpose,
                                generateLeads: checked as boolean,
                              })
                            }
                          />
                          <Label htmlFor="generate-leads">Generate leads and sales</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="provide-info"
                            checked={formData.websitePurpose.provideInformation}
                            onCheckedChange={(checked) =>
                              handleInputChange("websitePurpose", {
                                ...formData.websitePurpose,
                                provideInformation: checked as boolean,
                              })
                            }
                          />
                          <Label htmlFor="provide-info">Provide information about my business</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="other-purpose"
                            checked={formData.websitePurpose.other}
                            onCheckedChange={(checked) =>
                              handleInputChange("websitePurpose", {
                                ...formData.websitePurpose,
                                other: checked as boolean,
                              })
                            }
                          />
                          <Label htmlFor="other-purpose">Other</Label>
                        </div>
                      </div>
                      {validationErrors.websitePurpose && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.websitePurpose[0]}</p>
                      )}
                    </div>

                    {/* Other Purpose */}
                    {formData.websitePurpose.other && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3 }}
                      >
                        <Label htmlFor="otherPurpose" className="text-sm font-medium text-gray-700">
                          Please specify <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="otherPurpose"
                          name="otherPurpose"
                          value={formData.otherPurpose}
                          onChange={(e) => handleInputChange("otherPurpose", e.target.value)}
                          className={getFieldClasses("otherPurpose", true)}
                          placeholder="Describe your website's purpose"
                        />
                        {validationErrors.otherPurpose && (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.otherPurpose[0]}</p>
                        )}
                      </motion.div>
                    )}

                    {/* Target Audience */}
                    <div>
                      <Label htmlFor="targetAudience" className="text-sm font-medium text-gray-700">
                        Who is your target audience? <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="targetAudience"
                        name="targetAudience"
                        value={formData.targetAudience}
                        onChange={(e) => handleInputChange("targetAudience", e.target.value)}
                        className={getFieldClasses("targetAudience", true)}
                        placeholder="Describe your ideal customers or clients"
                        rows={3}
                      />
                      {validationErrors.targetAudience && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.targetAudience[0]}</p>
                      )}
                    </div>

                    {/* Products/Services */}
                    <div>
                      <Label htmlFor="productsServices" className="text-sm font-medium text-gray-700">
                        What products or services do you offer? <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="productsServices"
                        name="productsServices"
                        value={formData.productsServices}
                        onChange={(e) => handleInputChange("productsServices", e.target.value)}
                        className={getFieldClasses("productsServices", true)}
                        placeholder="Describe your main products or services"
                        rows={3}
                      />
                      {validationErrors.productsServices && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.productsServices[0]}</p>
                      )}
                    </div>

                    {/* Branding Guidelines */}
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-3 block">
                        Do you have existing branding guidelines or style preferences?{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <RadioGroup
                        value={formData.brandingGuidelines?.toString() || ""}
                        onValueChange={(value) => handleInputChange("brandingGuidelines", value === "true")}
                        className="flex space-x-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id="branding-yes" />
                          <Label htmlFor="branding-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="branding-no" />
                          <Label htmlFor="branding-no">No</Label>
                        </div>
                      </RadioGroup>
                      {validationErrors.brandingGuidelines && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.brandingGuidelines[0]}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h3 className="text-xl font-semibold text-navy mb-6">Additional Information</h3>

                  <div className="space-y-6">
                    {/* Competitors */}
                    <div>
                      <Label htmlFor="competitors" className="text-sm font-medium text-gray-700">
                        Competitor websites you admire (optional)
                      </Label>
                      <Textarea
                        id="competitors"
                        name="competitors"
                        value={formData.competitors}
                        onChange={(e) => handleInputChange("competitors", e.target.value)}
                        className={getFieldClasses("competitors")}
                        placeholder="List any competitor websites you like and what you like about them"
                        rows={3}
                      />
                    </div>

                    {/* Updates */}
                    <div>
                      <Label htmlFor="updates" className="text-sm font-medium text-gray-700">
                        How often do you plan to update your website? (optional)
                      </Label>
                      <Textarea
                        id="updates"
                        name="updates"
                        value={formData.updates}
                        onChange={(e) => handleInputChange("updates", e.target.value)}
                        className={getFieldClasses("updates")}
                        placeholder="Daily, weekly, monthly, or as needed"
                        rows={2}
                      />
                    </div>

                    {/* Keywords */}
                    <div>
                      <Label htmlFor="keywords" className="text-sm font-medium text-gray-700">
                        Important keywords for SEO (optional)
                      </Label>
                      <Textarea
                        id="keywords"
                        name="keywords"
                        value={formData.keywords}
                        onChange={(e) => handleInputChange("keywords", e.target.value)}
                        className={getFieldClasses("keywords")}
                        placeholder="List keywords you want to rank for"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  {submitError && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <p className="text-red-700">{submitError}</p>
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-orange to-pink hover:from-orange/90 hover:to-pink/90 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>Proceed to Payment</span>
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    )}
                  </Button>

                  <p className="text-sm text-gray-600 mt-4">
                    You'll be redirected to Stripe for secure payment processing
                  </p>
                </div>
              </form>
            </div>
          </div>
        </motion.section>
      )}
    </div>
  )
}
