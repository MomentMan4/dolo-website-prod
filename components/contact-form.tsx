"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface SubmissionResult {
  success: boolean
  requestId?: string
  details?: any
  error?: string
  suggestions?: string[]
}

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactReason: "",
    stage: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [lastSubmissionResult, setLastSubmissionResult] = useState<SubmissionResult | null>(null)

  const formRef = useRef(null)
  const isInView = useInView(formRef, { once: true, margin: "-100px" })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateClientSide = (): string[] => {
    const errors: string[] = []

    if (!formData.name.trim()) {
      errors.push("Name is required")
    }

    if (!formData.email.trim()) {
      errors.push("Email is required")
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email.trim())) {
        errors.push("Please enter a valid email address")
      }
    }

    if (!formData.contactReason) {
      errors.push("Please select what you're contacting us about")
    }

    if (!formData.stage) {
      errors.push("Please select what stage you're in")
    }

    if (!formData.message.trim()) {
      errors.push("Message is required")
    } else if (formData.message.trim().length < 10) {
      errors.push("Message must be at least 10 characters long")
    }

    return errors
  }

  const createCompleteMessage = (): string => {
    // Create a comprehensive message that includes all form context
    let completeMessage = formData.message.trim()

    // Add context information
    if (formData.contactReason) {
      completeMessage = `Contact Reason: ${formData.contactReason}\n\n` + completeMessage
    }

    if (formData.stage) {
      completeMessage = completeMessage + `\n\nStage: ${formData.stage}`
    }

    return completeMessage
  }

  const createJSONPayload = () => {
    const completeMessage = createCompleteMessage()

    return {
      name: formData.name.trim(),
      email: formData.email.trim(),
      message: completeMessage,
      company: "", // Empty string for company
      source: "contact-form",
    }
  }

  const submitForm = async (): Promise<Response> => {
    console.log("=== SUBMITTING CONTACT FORM ===")
    const jsonPayload = createJSONPayload()

    console.log("JSON payload:", jsonPayload)

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonPayload),
    })

    console.log("Response status:", response.status)
    console.log("Response headers:", Object.fromEntries(response.headers.entries()))

    return response
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setLastSubmissionResult(null)

    const submissionId = Math.random().toString(36).substring(7)
    console.log(`=== CONTACT FORM SUBMISSION [${submissionId}] START ===`)
    console.log("Current form data:", formData)
    console.log("Form validation state:", {
      hasName: !!formData.name.trim(),
      hasEmail: !!formData.email.trim(),
      hasMessage: !!formData.message.trim(),
      hasContactReason: !!formData.contactReason,
      hasStage: !!formData.stage,
    })

    try {
      // Client-side validation first
      const clientErrors = validateClientSide()
      if (clientErrors.length > 0) {
        console.error(`[${submissionId}] Client-side validation failed:`, clientErrors)

        toast({
          title: "Please fix the following errors:",
          description: clientErrors.join(", "),
          variant: "destructive",
        })

        setLastSubmissionResult({
          success: false,
          error: "Client-side validation failed",
          details: { errors: clientErrors },
        })

        return
      }

      console.log(`[${submissionId}] Client-side validation passed`)

      // Submit the form
      console.log(`[${submissionId}] Submitting form...`)
      const response = await submitForm()

      if (!response.ok) {
        const errorText = await response.text()
        console.log(`[${submissionId}] Submission failed:`, {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        })

        // Try to parse error response
        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch {
          errorData = { error: `HTTP ${response.status}: ${response.statusText}`, details: errorText }
        }

        setLastSubmissionResult({
          success: false,
          requestId: errorData.requestId,
          error: errorData.error,
          details: errorData.details,
          suggestions: errorData.suggestions,
        })

        throw new Error(errorData.error || `HTTP ${response.status}: Submission failed`)
      }

      // Process successful response
      console.log(`[${submissionId}] Processing response...`)
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

      if (!lastSubmissionResult) {
        setLastSubmissionResult({
          success: false,
          error: error instanceof Error ? error.message : String(error),
        })
      }

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
    },
    {
      id: "email",
      label: "Email",
      type: "email",
      required: true,
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

          {/* Debug Information (only show if there was an error) */}
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
                  {lastSubmissionResult.details?.errors && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-red-800">Validation Errors:</p>
                      <ul className="mt-1 text-xs text-red-700 list-disc list-inside">
                        {lastSubmissionResult.details.errors.map((error: string, index: number) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {lastSubmissionResult.suggestions && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-red-800">Suggestions:</p>
                      <ul className="mt-1 text-xs text-red-700 list-disc list-inside">
                        {lastSubmissionResult.suggestions.map((suggestion, index) => (
                          <li key={index}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
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
              <Button onClick={() => setIsSuccess(false)} className="bg-orange text-white hover:bg-orange-600">
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
                      value={formData[field.id as keyof typeof formData]}
                      onChange={handleChange}
                      required={field.required}
                      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-orange focus:outline-none focus:ring-1 focus:ring-orange"
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
                      value={formData[field.id as keyof typeof formData]}
                      onChange={handleChange}
                      required={field.required}
                      className="min-h-[120px]"
                      placeholder="Please tell us more about your project, timeline, or any specific requirements..."
                    />
                  ) : (
                    <Input
                      id={field.id}
                      name={field.id}
                      type={field.type}
                      value={formData[field.id as keyof typeof formData]}
                      onChange={handleChange}
                      required={field.required}
                      placeholder={
                        field.id === "name" ? "Your full name" : field.id === "email" ? "your.email@example.com" : ""
                      }
                    />
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
                    {isSubmitting ? "Sending..." : "Send Message"}
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
