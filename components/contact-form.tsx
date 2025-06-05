"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle, RefreshCw, AlertTriangle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
// Remove these complex imports
// import { contactFormValidator } from "@/lib/contact-form-validator"
// import { contactApiClient } from "@/lib/contact-api-client"
// import { contactErrorHandler } from "@/lib/contact-error-handler"

interface FormState {
  name: string
  email: string
  contactReason: string
  stage: string
  message: string
}

interface SubmissionResult {
  success: boolean
  requestId?: string
  details?: any
  error?: string
}

const INITIAL_FORM_STATE: FormState = {
  name: "",
  email: "",
  contactReason: "",
  stage: "",
  message: "",
}

const INITIAL_SUBMISSION_STATE = {
  isSubmitting: false,
  isSuccess: false,
  error: null,
  requestId: null,
  retryCount: 0,
  lastAttempt: null,
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM_STATE)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})
  const [fieldTouched, setFieldTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [lastSubmissionResult, setLastSubmissionResult] = useState<SubmissionResult | null>(null)

  const formRef = useRef(null)
  const isInView = useInView(formRef, { once: true, margin: "-100px" })

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target

      setFormData((prev) => ({ ...prev, [name]: value }))

      // Mark field as touched
      setFieldTouched((prev) => ({ ...prev, [name]: true }))

      // Clear validation errors for this field when user starts typing
      if (validationErrors[name]) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[name]
          return newErrors
        })
      }
    },
    [validationErrors],
  )

  const validateForm = useCallback((): boolean => {
    console.log("=== FORM VALIDATION START ===")

    const errors: Record<string, string[]> = {}

    if (!formData.name) {
      errors.name = ["Name is required"]
    }

    if (!formData.email) {
      errors.email = ["Email is required"]
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = ["Email is invalid"]
    }

    if (!formData.contactReason) {
      errors.contactReason = ["Contact reason is required"]
    }

    if (!formData.stage) {
      errors.stage = ["Stage is required"]
    }

    if (!formData.message) {
      errors.message = ["Message is required"]
    }

    setValidationErrors(errors)

    if (Object.keys(errors).length > 0) {
      console.log("Form validation failed:", errors)

      // Show toast with first error
      const firstError = Object.values(errors)[0]?.[0]
      if (firstError) {
        toast({
          title: "Please fix the following error:",
          description: firstError,
          variant: "destructive",
        })
      }

      return false
    }

    console.log("Form validation passed")
    return true
  }, [formData])

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE)
    setIsSuccess(false)
    setValidationErrors({})
    setFieldTouched({})
  }, [])

  const createCompleteMessage = () => {
    return `Contact Reason: ${formData.contactReason}\nStage: ${formData.stage}\nMessage: ${formData.message}`
  }

  const validateClientSide = () => {
    const errors: string[] = []

    if (!formData.name) {
      errors.push("Name is required")
    }

    if (!formData.email) {
      errors.push("Email is required")
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push("Email is invalid")
    }

    if (!formData.contactReason) {
      errors.push("Contact reason is required")
    }

    if (!formData.stage) {
      errors.push("Stage is required")
    }

    if (!formData.message) {
      errors.push("Message is required")
    }

    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setLastSubmissionResult(null)

    const submissionId = Math.random().toString(36).substring(7)
    console.log(`=== CONTACT FORM SUBMISSION [${submissionId}] START ===`)

    try {
      // Client-side validation first
      // const clientErrors = validateClientSide()
      // if (clientErrors.length > 0) {
      //   console.error(`[${submissionId}] Client-side validation failed:`, clientErrors)

      //   toast({
      //     title: "Please fix the following errors:",
      //     description: clientErrors.join(", "),
      //     variant: "destructive",
      //   })

      //   setLastSubmissionResult({
      //     success: false,
      //     error: "Client-side validation failed",
      //     details: { errors: clientErrors },
      //   })

      //   setIsSubmitting(false)
      //   return
      // }

      const isValid = validateForm()

      if (!isValid) {
        setIsSubmitting(false)
        return
      }

      console.log(`[${submissionId}] Client-side validation passed`)

      // Create the payload exactly like the quiz does
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: createCompleteMessage(),
        company: "",
        source: "contact-form",
      }

      console.log(`[${submissionId}] Submitting with payload:`, payload)

      // Simple fetch call like the quiz
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      console.log(`[${submissionId}] Response status:`, response.status)

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: Submission failed`

        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          errorMessage = `Server error (${response.status})`
        }

        throw new Error(errorMessage)
      }

      // Process successful response
      const responseData = await response.json()
      console.log(`[${submissionId}] Submission successful:`, responseData)

      setLastSubmissionResult({
        success: true,
        requestId: responseData.requestId,
        details: responseData.details,
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        contactReason: "",
        stage: "",
        message: "",
      })
      setIsSuccess(true)

      toast({
        title: "Message sent successfully!",
        description: "We've received your message and will get back to you soon.",
      })
    } catch (error) {
      console.error(`[${submissionId}] Submission failed:`, error)

      setLastSubmissionResult({
        success: false,
        error: error instanceof Error ? error.message : String(error),
      })

      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Please try again or contact us directly.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formFields = [
    {
      id: "name",
      label: "Full Name",
      type: "text",
      required: true,
      placeholder: "Your full name",
    },
    {
      id: "email",
      label: "Email",
      type: "email",
      required: true,
      placeholder: "your.email@example.com",
    },
    {
      id: "contactReason",
      label: "What are you contacting us about?",
      type: "select",
      required: true,
      options: [
        { value: "", label: "Select an option", disabled: true },
        { value: "general", label: "General Inquiry" },
        { value: "website", label: "I need a website" },
        { value: "privateBuild", label: "I'm interested in Private Build" },
        { value: "partnership", label: "Partnership" },
        { value: "support", label: "Support" },
      ],
    },
    {
      id: "stage",
      label: "What stage are you in?",
      type: "select",
      required: true,
      options: [
        { value: "", label: "Select an option", disabled: true },
        { value: "exploring", label: "Just exploring" },
        { value: "readyToBuild", label: "Ready to build" },
        { value: "comparing", label: "Comparing services" },
        { value: "needAdvice", label: "Need advice" },
      ],
    },
    {
      id: "message",
      label: "What would you like to share?",
      type: "textarea",
      required: true,
      placeholder: "Please tell us more about your project, timeline, or any specific requirements...",
    },
  ]

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    submitting: {
      scale: [1, 1.05, 1],
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "mirror",
        duration: 0.8,
      },
    },
  }

  return (
    <section className="bg-white py-16 md:py-20 lg:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl">
          <motion.div
            className="mb-8 text-center sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4 text-2xl font-bold text-navy sm:text-3xl md:text-4xl">Tell Us a Bit About You</h2>
            <p className="text-gray-600">
              We'd love to hear about your project and how we can help bring your vision to life.
            </p>
          </motion.div>

          {/* Error Display - simplified like quiz */}
          {lastSubmissionResult && !lastSubmissionResult.success && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4"
            >
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-red-800">Submission Error</h3>
                  <p className="mt-1 text-sm text-red-700">{lastSubmissionResult.error}</p>
                  {lastSubmissionResult.requestId && (
                    <p className="mt-1 text-xs text-red-600">Request ID: {lastSubmissionResult.requestId}</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Validation Errors */}
          {Object.keys(validationErrors).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4"
            >
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-yellow-800">Please fix the following errors:</h3>
                  <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
                    {Object.entries(validationErrors).map(([field, errors]) =>
                      errors.map((error, index) => <li key={`${field}-${index}`}>{error}</li>),
                    )}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl bg-white p-8 text-center shadow-lg"
            >
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="mb-4 text-xl font-bold text-navy">Thank You!</h3>
              <p className="mb-6 text-gray-700">
                We've received your message and will get back to you as soon as possible.
              </p>
              {lastSubmissionResult?.requestId && (
                <p className="mb-4 text-xs text-gray-500">Reference ID: {lastSubmissionResult.requestId}</p>
              )}
              <Button onClick={resetForm} className="bg-orange text-white hover:bg-orange-600">
                Send Another Message
              </Button>
            </motion.div>
          ) : (
            <motion.form
              ref={formRef}
              onSubmit={handleSubmit}
              className="space-y-6 rounded-xl bg-white p-4 shadow-lg sm:p-6 md:p-8"
            >
              {formFields.map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Label htmlFor={field.id} className="mb-2 block">
                    {field.label}
                    {field.required && <span className="ml-1 text-coral">*</span>}
                  </Label>

                  {field.type === "select" ? (
                    <select
                      id={field.id}
                      name={field.id}
                      value={formData[field.id as keyof FormState]}
                      onChange={handleChange}
                      required={field.required}
                      className={`mt-1 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                        validationErrors[field.id]
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-orange focus:ring-orange"
                      } bg-white`}
                    >
                      {field.options?.map((option) => (
                        <option key={option.value} value={option.value} disabled={option.disabled}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === "textarea" ? (
                    <Textarea
                      id={field.id}
                      name={field.id}
                      value={formData[field.id as keyof FormState]}
                      onChange={handleChange}
                      required={field.required}
                      placeholder={field.placeholder}
                      className={`min-h-[120px] ${
                        validationErrors[field.id] ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""
                      }`}
                    />
                  ) : (
                    <Input
                      id={field.id}
                      name={field.id}
                      type={field.type}
                      value={formData[field.id as keyof FormState]}
                      onChange={handleChange}
                      required={field.required}
                      placeholder={field.placeholder}
                      className={
                        validationErrors[field.id] ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""
                      }
                    />
                  )}

                  {/* Field-specific error display */}
                  {validationErrors[field.id] && (
                    <div className="mt-1 text-sm text-red-600">
                      {validationErrors[field.id].map((error, errorIndex) => (
                        <div key={errorIndex}>{error}</div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: (formFields.length + 1) * 0.1 }}
                className="pt-4"
              >
                <motion.div
                  variants={buttonVariants}
                  initial="idle"
                  whileHover={isSubmitting ? {} : "hover"}
                  whileTap={isSubmitting ? {} : "tap"}
                  animate={isSubmitting ? "submitting" : "idle"}
                >
                  <Button
                    type="submit"
                    className="w-full bg-orange text-white hover:bg-orange-600 md:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            </motion.form>
          )}
        </div>
      </div>
    </section>
  )
}
