"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Send, CheckCircle } from "lucide-react"

export default function ResendTestPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    message: "",
    template: "default",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsSuccess(true)
      setTimeout(() => setIsSuccess(false), 3000)
    } catch (error) {
      console.error("Error sending test email:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl font-bold text-navy sm:text-3xl">Resend Test Tool</h1>
        <p className="mt-2 text-gray-600">Send test emails to verify your email templates and configurations.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="rounded-xl bg-white p-6 shadow-md"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="to">To Email Address</Label>
            <Input
              id="to"
              name="to"
              type="email"
              placeholder="recipient@example.com"
              value={formData.to}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              name="subject"
              placeholder="Email Subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="template">Email Template</Label>
            <select
              id="template"
              name="template"
              value={formData.template}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-orange focus:outline-none focus:ring-1 focus:ring-orange sm:text-sm"
            >
              <option value="default">Default Template</option>
              <option value="welcome">Welcome Email</option>
              <option value="invoice">Invoice Template</option>
              <option value="completion">Project Completion</option>
              <option value="custom">Custom HTML</option>
            </select>
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Enter your email message here..."
              value={formData.message}
              onChange={handleInputChange}
              className="min-h-[150px]"
              required
            />
          </div>

          <div className="pt-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex">
              <Button type="submit" className="bg-orange text-white hover:bg-orange-600" disabled={isSubmitting}>
                {isSubmitting ? (
                  "Sending..."
                ) : isSuccess ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Email Sent
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Test Email
                  </>
                )}
              </Button>
            </motion.div>

            {isSuccess && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="ml-4 text-sm text-green-600"
              >
                Test email sent successfully!
              </motion.span>
            )}
          </div>
        </form>
      </motion.div>

      <motion.div
        className="rounded-xl bg-white p-6 shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h2 className="mb-4 text-lg font-bold text-navy">Email Preview</h2>

        <div className="rounded-lg border border-gray-200 p-4">
          <div className="mb-2 flex items-center">
            <span className="font-medium text-gray-700">To:</span>
            <span className="ml-2 text-gray-600">{formData.to || "recipient@example.com"}</span>
          </div>

          <div className="mb-2 flex items-center">
            <span className="font-medium text-gray-700">Subject:</span>
            <span className="ml-2 text-gray-600">{formData.subject || "No subject"}</span>
          </div>

          <div className="mb-4 flex items-center">
            <span className="font-medium text-gray-700">Template:</span>
            <span className="ml-2 text-gray-600">
              {formData.template === "default"
                ? "Default Template"
                : formData.template === "welcome"
                  ? "Welcome Email"
                  : formData.template === "invoice"
                    ? "Invoice Template"
                    : formData.template === "completion"
                      ? "Project Completion"
                      : "Custom HTML"}
            </span>
          </div>

          <div>
            <span className="font-medium text-gray-700">Message:</span>
            <div className="mt-2 rounded-md bg-gray-50 p-3 text-gray-600">
              {formData.message || "Your message will appear here..."}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
