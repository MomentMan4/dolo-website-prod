"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload } from "lucide-react"

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactReason: "",
    stage: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formRef = useRef(null)
  const isInView = useInView(formRef, { once: true, margin: "-100px" })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      console.log("Form submitted:", formData)
      setIsSubmitting(false)
      // Reset form or show success message
    }, 1500)
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
          </motion.div>

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
                  />
                ) : (
                  <Input
                    id={field.id}
                    name={field.id}
                    type={field.type}
                    value={formData[field.id as keyof typeof formData]}
                    onChange={handleChange}
                    required={field.required}
                  />
                )}
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: formFields.length * 0.1 }}
            >
              <Label htmlFor="files" className="mb-2 block">
                Attach files or references (Optional)
              </Label>
              <div className="mt-1 flex items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-4 sm:p-6">
                <div className="space-y-2 text-center">
                  <Upload className="mx-auto h-6 w-6 text-gray-400 sm:h-8 sm:w-8" />
                  <div className="text-sm text-gray-600">
                    <label htmlFor="files" className="cursor-pointer font-medium text-orange hover:text-orange-600">
                      <span>Upload a file</span>
                      <Input id="files" type="file" className="sr-only" />
                    </label>
                    <p>or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                </div>
              </div>
            </motion.div>

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
        </div>
      </div>
    </section>
  )
}
