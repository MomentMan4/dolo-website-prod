"use client"

import { useRef, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { submitPrivateBuildForm } from "@/app/private-build/actions"
import { logFormError } from "@/lib/error-monitoring"

interface PrivateBuildFormProps {
  isOpen: boolean
  onClose: () => void
}

export function PrivateBuildForm({ isOpen, onClose }: PrivateBuildFormProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const [submissionResult, setSubmissionResult] = useState<any>(null)

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "auto"
    }
  }, [isOpen, onClose])

  // Close modal on escape key
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey)
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [isOpen, onClose])

  // Reset form state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsSubmitting(false)
      setIsSuccess(false)
      setError("")
      setDebugInfo(null)
      setSubmissionResult(null)
    }
  }, [isOpen])

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    setError("")
    setDebugInfo(null)

    try {
      // Client-side validation
      const name = formData.get("name") as string
      const email = formData.get("email") as string
      const projectType = formData.get("projectType") as string
      const vision = formData.get("vision") as string
      const budget = formData.get("budget") as string
      const timeline = formData.get("timeline") as string

      if (!name || !email || !projectType || !vision || !budget || !timeline) {
        throw new Error("Please fill in all required fields")
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email address")
      }

      console.log("Submitting private build form with data:", {
        name,
        email,
        projectType,
        budget,
        timeline,
      })

      const result = await submitPrivateBuildForm(formData)

      console.log("Private build form submission result:", result)
      setSubmissionResult(result)

      if (result?.success) {
        setIsSuccess(true)
        // Close modal after 3 seconds
        setTimeout(() => {
          onClose()
        }, 3000)
      } else {
        throw new Error("Submission failed - no success response")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)

      logFormError("PrivateBuild", "submit", err instanceof Error ? err : new Error(errorMessage), {
        formData: Object.fromEntries(formData.entries()),
      })

      console.error("Form submission error:", err)

      // Add debug info for development
      if (process.env.NODE_ENV === "development") {
        setDebugInfo(err instanceof Error ? err.stack || err.message : JSON.stringify(err))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Animation variants
  const backdrop = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  const modal = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
    exit: { opacity: 0, y: 50, scale: 0.95, transition: { duration: 0.2 } },
  }

  const formFields = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const formField = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
  }

  if (!isOpen) return null

  if (isSuccess) {
    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdrop}
        >
          <motion.div
            ref={modalRef}
            className="relative mx-auto my-8 w-full max-w-md overflow-hidden rounded-xl bg-white p-8 shadow-2xl"
            variants={modal}
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
              </motion.div>
              <h3 className="mb-2 text-2xl font-bold text-navy">Application Submitted!</h3>
              <p className="text-gray-600">
                Thank you for your interest in Private Build. We'll review your application and get back to you within
                24 hours.
              </p>
              {submissionResult?.fallbackUsed && (
                <p className="mt-2 text-xs text-orange-600">
                  Note: Your application was saved using our backup system and will be processed normally.
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={backdrop}
      >
        <motion.div
          ref={modalRef}
          className="relative mx-auto my-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-2xl md:p-8"
          variants={modal}
        >
          <button
            className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={24} />
          </button>

          <h2 className="mb-6 text-2xl font-bold text-navy md:text-3xl">Apply for a Private Build</h2>

          <div className="mb-6 rounded-lg bg-orange-50 p-4 border border-orange-200">
            <p className="text-sm text-gray-600">
              <span className="text-red-500 font-medium">*</span> indicates required fields
            </p>
          </div>

          <form action={handleSubmit} className="space-y-6">
            <motion.div className="space-y-6" variants={formFields} initial="hidden" animate="visible">
              <div className="grid gap-6 md:grid-cols-2">
                <motion.div variants={formField}>
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

                <motion.div variants={formField}>
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
              </div>

              <motion.div variants={formField}>
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" name="company" className="mt-1" />
              </motion.div>

              <motion.div variants={formField}>
                <Label htmlFor="projectType">
                  What type of project are you looking to build? <span className="text-red-500">*</span>
                </Label>
                <select
                  id="projectType"
                  name="projectType"
                  className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  <option value="Website">Custom Website</option>
                  <option value="Dashboard">Dashboard</option>
                  <option value="E-commerce">E-commerce Platform</option>
                  <option value="Web App">Web Application</option>
                  <option value="CMS">Content Management System</option>
                  <option value="Other">Other</option>
                </select>
              </motion.div>

              <motion.div variants={formField}>
                <Label htmlFor="vision">
                  Describe your project vision and goals <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="vision"
                  name="vision"
                  className="mt-1 min-h-[120px] border-orange-300 focus:border-orange focus:ring-orange bg-orange-50/20"
                  required
                />
              </motion.div>

              <div className="grid gap-6 md:grid-cols-2">
                <motion.div variants={formField}>
                  <Label htmlFor="budget">
                    Budget Range <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="budget"
                    name="budget"
                    className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                    required
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option value="$5,000–$10,000">$5,000–$10,000</option>
                    <option value="$10,000–$25,000">$10,000–$25,000</option>
                    <option value="$25,000–$50,000">$25,000–$50,000</option>
                    <option value="$50,000+">$50,000+</option>
                  </select>
                </motion.div>

                <motion.div variants={formField}>
                  <Label htmlFor="timeline">
                    Desired Timeline <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="timeline"
                    name="timeline"
                    className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                    required
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option value="1-2 months">1-2 months</option>
                    <option value="3-4 months">3-4 months</option>
                    <option value="5-6 months">5-6 months</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </motion.div>
              </div>

              <motion.div variants={formField}>
                <Label htmlFor="referralSource">How did you hear about us?</Label>
                <select
                  id="referralSource"
                  name="referralSource"
                  className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  <option value="Google">Google</option>
                  <option value="Referral">Referral</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Blog">Blog</option>
                  <option value="Other">Other</option>
                </select>
              </motion.div>

              {error && (
                <motion.div
                  className="rounded-md bg-red-50 border border-red-200 p-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-red-800">{error}</p>
                      {debugInfo && process.env.NODE_ENV === "development" && (
                        <details className="mt-2">
                          <summary className="text-xs text-red-600 cursor-pointer">Debug Information</summary>
                          <pre className="mt-2 text-xs overflow-auto p-2 bg-gray-100 rounded max-h-32">{debugInfo}</pre>
                        </details>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              <motion.div variants={formField}>
                <Button
                  type="submit"
                  className="w-full bg-navy text-white hover:bg-navy-600"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </motion.div>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
