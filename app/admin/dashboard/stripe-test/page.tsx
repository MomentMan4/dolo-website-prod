"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, CheckCircle } from "lucide-react"

export default function StripeTestPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const [formData, setFormData] = useState({
    plan: "launch",
    customerEmail: "",
    rushDelivery: false,
    addOns: {
      maintenance: false,
      googleBusiness: false,
      accessibility: false,
      privacy: false,
    },
  })

  const planPrices = {
    launch: 499.99,
    grow: 849.99,
    elevate: 1199.99,
  }

  const addOnPrices = {
    maintenance: 49.99,
    googleBusiness: 129.99,
    accessibility: 149.99,
    privacy: 149.99,
  }

  // Calculate total price
  const calculateTotal = () => {
    let total = planPrices[formData.plan as keyof typeof planPrices]

    if (formData.rushDelivery) {
      total += total * 0.2 // Add 20% rush fee
    }

    // Add add-ons
    Object.entries(formData.addOns).forEach(([key, isSelected]) => {
      if (isSelected) {
        total += addOnPrices[key as keyof typeof addOnPrices]
      }
    })

    return total.toFixed(2)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      }))
    }
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
      console.error("Error simulating payment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl font-bold text-navy sm:text-3xl">Stripe Test Tool</h1>
        <p className="mt-2 text-gray-600">Test payment flows without processing actual transactions.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="rounded-xl bg-white p-6 shadow-md"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="plan">Select Plan</Label>
              <select
                id="plan"
                name="plan"
                value={formData.plan}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-orange focus:outline-none focus:ring-1 focus:ring-orange sm:text-sm"
                required
              >
                <option value="launch">Launch ($499.99)</option>
                <option value="grow">Grow ($849.99)</option>
                <option value="elevate">Elevate ($1199.99)</option>
              </select>
            </div>

            <div>
              <Label htmlFor="customerEmail">Customer Email</Label>
              <Input
                id="customerEmail"
                name="customerEmail"
                type="email"
                placeholder="customer@example.com"
                value={formData.customerEmail}
                onChange={handleInputChange}
                className="mt-1"
                required
              />
            </div>
          </div>

          <div className="mt-4 space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="rushDelivery"
                name="rushDelivery"
                checked={formData.rushDelivery}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-gray-300 text-orange focus:ring-orange"
              />
              <Label htmlFor="rushDelivery">Rush Delivery (+20%)</Label>
            </div>

            <div className="space-y-2">
              <p className="font-medium text-navy">Add-ons:</p>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="maintenance"
                    name="addOns.maintenance"
                    checked={formData.addOns.maintenance}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-orange focus:ring-orange"
                  />
                  <Label htmlFor="maintenance">Website Maintenance ($49.99/mo)</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="googleBusiness"
                    name="addOns.googleBusiness"
                    checked={formData.addOns.googleBusiness}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-orange focus:ring-orange"
                  />
                  <Label htmlFor="googleBusiness">Google Business ($129.99)</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="accessibility"
                    name="addOns.accessibility"
                    checked={formData.addOns.accessibility}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-orange focus:ring-orange"
                  />
                  <Label htmlFor="accessibility">Accessibility ($149.99)</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="privacy"
                    name="addOns.privacy"
                    checked={formData.addOns.privacy}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-orange focus:ring-orange"
                  />
                  <Label htmlFor="privacy">Privacy Compliance ($149.99)</Label>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-navy">Total:</span>
              <span className="text-xl font-bold text-navy">${calculateTotal()}</span>
            </div>
          </div>

          <div className="pt-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex">
              <Button
                type="submit"
                className="bg-orange text-white hover:bg-orange-600"
                disabled={isSubmitting || !formData.customerEmail}
              >
                {isSubmitting ? (
                  "Processing..."
                ) : isSuccess ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Payment Success
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Simulate Payment
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
                Test payment processed successfully!
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
        <h2 className="mb-4 text-lg font-bold text-navy">Information</h2>
        <p className="text-gray-600">
          This tool simulates Stripe payments for testing purposes. No actual charges are made. For real transactions,
          use the live Stripe dashboard. Test card number: <code>4242 4242 4242 4242</code>
        </p>
      </motion.div>
    </div>
  )
}
