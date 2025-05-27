"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, CheckCircle } from "lucide-react"

export default function SettingsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const [settings, setSettings] = useState({
    rushFeePercentage: 20,
    addOns: {
      maintenance: 49.99,
      googleBusiness: 129.99,
      accessibility: 149.99,
      privacy: 149.99,
    },
    bannerMessage: "",
    showBanner: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setSettings((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]:
            type === "checkbox"
              ? (e.target as HTMLInputElement).checked
              : type === "number"
                ? Number.parseFloat(value)
                : value,
        },
      }))
    } else {
      setSettings((prev) => ({
        ...prev,
        [name]:
          type === "checkbox"
            ? (e.target as HTMLInputElement).checked
            : type === "number"
              ? Number.parseFloat(value)
              : value,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsSuccess(true)
      setTimeout(() => setIsSuccess(false), 3000)
    } catch (error) {
      console.error("Error saving settings:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl font-bold text-navy sm:text-3xl">Settings</h1>
        <p className="mt-2 text-gray-600">Manage your website settings and configuration.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="rounded-xl bg-white p-6 shadow-md"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-navy">Pricing Settings</h2>

            <div>
              <Label htmlFor="rushFeePercentage">Rush Fee Percentage</Label>
              <div className="mt-1 flex items-center">
                <Input
                  id="rushFeePercentage"
                  name="rushFeePercentage"
                  type="number"
                  value={settings.rushFeePercentage}
                  onChange={handleInputChange}
                  className="max-w-xs"
                  min="0"
                  step="1"
                  required
                />
                <span className="ml-2">%</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-navy">Add-on Pricing</h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="maintenance">Website Maintenance (Monthly)</Label>
                <div className="mt-1 flex items-center">
                  <span className="mr-2">$</span>
                  <Input
                    id="maintenance"
                    name="addOns.maintenance"
                    type="number"
                    value={settings.addOns.maintenance}
                    onChange={handleInputChange}
                    className="max-w-xs"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="googleBusiness">Google Business Profile Setup</Label>
                <div className="mt-1 flex items-center">
                  <span className="mr-2">$</span>
                  <Input
                    id="googleBusiness"
                    name="addOns.googleBusiness"
                    type="number"
                    value={settings.addOns.googleBusiness}
                    onChange={handleInputChange}
                    className="max-w-xs"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="accessibility">Accessibility Enhancements</Label>
                <div className="mt-1 flex items-center">
                  <span className="mr-2">$</span>
                  <Input
                    id="accessibility"
                    name="addOns.accessibility"
                    type="number"
                    value={settings.addOns.accessibility}
                    onChange={handleInputChange}
                    className="max-w-xs"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="privacy">Privacy Compliance</Label>
                <div className="mt-1 flex items-center">
                  <span className="mr-2">$</span>
                  <Input
                    id="privacy"
                    name="addOns.privacy"
                    type="number"
                    value={settings.addOns.privacy}
                    onChange={handleInputChange}
                    className="max-w-xs"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-navy">Banner Message</h3>

            <div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showBanner"
                  name="showBanner"
                  checked={settings.showBanner}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-gray-300 text-orange focus:ring-orange"
                />
                <Label htmlFor="showBanner">Show banner message on website</Label>
              </div>
            </div>

            <div>
              <Label htmlFor="bannerMessage">Banner Message</Label>
              <Textarea
                id="bannerMessage"
                name="bannerMessage"
                value={settings.bannerMessage}
                onChange={handleInputChange}
                placeholder="Enter a message to display on your website banner"
                className="mt-1"
                rows={3}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4 pt-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex">
              <Button type="submit" className="bg-orange text-white hover:bg-orange-600" disabled={isSubmitting}>
                {isSubmitting ? (
                  "Saving..."
                ) : isSuccess ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Saved
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </motion.div>

            {isSuccess && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm text-green-600"
              >
                Settings saved successfully!
              </motion.span>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  )
}
