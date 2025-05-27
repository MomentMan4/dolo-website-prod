"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface PrivateBuildFormProps {
  isOpen: boolean
  onClose: () => void
}

export function PrivateBuildForm({ isOpen, onClose }: PrivateBuildFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "",
    vision: "",
    budget: "",
    timeline: "",
    referralSource: "",
  })

  const modalRef = useRef<HTMLDivElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
    onClose()
  }

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      // Re-enable scrolling when modal closes
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
          className="relative mx-auto my-8 w-full max-w-2xl overflow-hidden rounded-xl bg-white p-6 shadow-2xl md:p-8"
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

          <form onSubmit={handleSubmit}>
            <motion.div className="space-y-6" variants={formFields} initial="hidden" animate="visible">
              <div className="grid gap-6 md:grid-cols-2">
                <motion.div variants={formField}>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1"
                    required
                  />
                </motion.div>

                <motion.div variants={formField}>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1"
                    required
                  />
                </motion.div>
              </div>

              <motion.div variants={formField}>
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="mt-1"
                  required
                />
              </motion.div>

              <motion.div variants={formField}>
                <Label htmlFor="projectType">What type of project are you looking to build?</Label>
                <select
                  id="projectType"
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                  required
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
                <Label htmlFor="vision">Describe your project vision and goals</Label>
                <Textarea
                  id="vision"
                  name="vision"
                  value={formData.vision}
                  onChange={handleChange}
                  className="mt-1 min-h-[120px]"
                  required
                />
              </motion.div>

              <div className="grid gap-6 md:grid-cols-2">
                <motion.div variants={formField}>
                  <Label htmlFor="budget">Budget Range</Label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                    required
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
                  <Label htmlFor="timeline">Desired Timeline</Label>
                  <select
                    id="timeline"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                    required
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
                  value={formData.referralSource}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                  required
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

              <motion.div variants={formField}>
                <Button
                  type="submit"
                  className="w-full bg-navy text-white hover:bg-navy-600"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Submit Application
                </Button>
              </motion.div>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
