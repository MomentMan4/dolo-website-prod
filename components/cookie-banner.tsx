"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookieConsent = localStorage.getItem("cookie-consent")

    if (!cookieConsent) {
      // If no consent is stored, show the banner
      setIsVisible(true)
    } else {
      // If consent is stored, check if it's expired (30 days)
      const consentData = JSON.parse(cookieConsent)
      const expirationDate = new Date(consentData.expiresAt)

      if (new Date() > expirationDate) {
        // If expired, show the banner again
        setIsVisible(true)
      }
    }
  }, [])

  const handleAccept = () => {
    // Set expiration date to 30 days from now
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    // Store consent in localStorage
    localStorage.setItem(
      "cookie-consent",
      JSON.stringify({
        accepted: true,
        expiresAt: expiresAt.toISOString(),
      }),
    )

    // Hide the banner
    setIsVisible(false)
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-4 right-4 z-50 max-w-sm md:max-w-md"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="rounded-lg bg-gradient-to-r from-navy to-coral p-4 shadow-lg">
            {isExpanded ? (
              <div className="flex flex-col space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    {/* Realistic cookie icon */}
                    <svg
                      className="mr-2 h-5 w-5 text-white"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M21.598 11.064a1.006 1.006 0 0 0-.854-.172A2.938 2.938 0 0 1 20 11c-1.654 0-3-1.346-3-3 0-.217.031-.444.099-.7a1.003 1.003 0 0 0-1.098-1.181 2.969 2.969 0 0 1-.517.052c-1.654 0-3-1.346-3-3 0-.217.031-.444.099-.7A1.004 1.004 0 0 0 11.68 2.3a2.94 2.94 0 0 1-.68-.05 1.003 1.003 0 0 0-1.155.856C9.612 4.113 9.054 5 8 5 6.346 5 5 3.654 5 2c0-.14.009-.283.028-.446A1.001 1.001 0 0 0 4.003 1a10.935 10.935 0 0 0-3.001.535 1 1 0 0 0-.684.949v.38a12.058 12.058 0 0 0 3.453 8.466A12.055 12.055 0 0 0 12.001 15c2.863 0 5.577-1.024 7.707-2.881.246.89.445 1.891.591 2.881a1.001 1.001 0 0 0 .991.855c.03 0 .06-.001.09-.005a1 1 0 0 0 .905-1.085 20.633 20.633 0 0 0-.587-2.678 1.001 1.001 0 0 0-.1-1.023zM12 13c-3.34 0-6.47-1.3-8.84-3.66a10.097 10.097 0 0 1-2.891-6.893c.611-.154 1.227-.267 1.851-.341C2.571 3.175 3.462 4 4.5 4c1.47 0 2.715-.872 3.3-2.127.65.071 1.293.127 1.93.127 1.654 0 3 1.346 3 3 0 .217-.031.444-.099.7.569.111 1.12.3 1.635.568.183.635.464 1.231.831 1.764.152.219.336.41.525.59.345.328.729.598 1.148.806.2.098.41.178.63.242.325.094.665.15 1.013.16.185.598.298 1.221.332 1.855-.902.578-1.861 1.044-2.863 1.374A10.085 10.085 0 0 1 12 13zm10.995 7.938a1 1 0 0 1-1.401.219A2.978 2.978 0 0 0 20 21c-1.654 0-3-1.346-3-3a3.04 3.04 0 0 0-.167-1 1 1 0 0 1 1.91-.583c.03.167.057.337.057.5 0 .551.448 1 1 1 .366 0 .673-.2.857-.504a1 1 0 0 1 1.338-.475z" />
                      <circle cx="7.5" cy="14.5" r="1.5" fill="#ffffff" />
                      <circle cx="11.5" cy="18.5" r="1.5" fill="#ffffff" />
                      <circle cx="16.5" cy="18.5" r="1.5" fill="#ffffff" />
                    </svg>
                    <p className="text-sm text-white">Cookies</p>
                  </div>
                  <button
                    onClick={toggleExpanded}
                    className="ml-2 rounded-full bg-white/20 p-1 text-white hover:bg-white/30"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-white">
                  🍪 We use cookies to enhance your experience on our website. By clicking "Accept", you agree to our
                  use of cookies. Learn more in our{" "}
                  <Link href="/cookie-policy" className="underline hover:text-orange">
                    Cookie Policy
                  </Link>
                  .
                </p>
                <div className="flex justify-end space-x-2">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleAccept}
                      className="whitespace-nowrap bg-orange text-white hover:bg-orange-600"
                      size="sm"
                    >
                      Accept
                    </Button>
                  </motion.div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {/* Realistic cookie icon */}
                  <svg
                    className="mr-2 h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M21.598 11.064a1.006 1.006 0 0 0-.854-.172A2.938 2.938 0 0 1 20 11c-1.654 0-3-1.346-3-3 0-.217.031-.444.099-.7a1.003 1.003 0 0 0-1.098-1.181 2.969 2.969 0 0 1-.517.052c-1.654 0-3-1.346-3-3 0-.217.031-.444.099-.7A1.004 1.004 0 0 0 11.68 2.3a2.94 2.94 0 0 1-.68-.05 1.003 1.003 0 0 0-1.155.856C9.612 4.113 9.054 5 8 5 6.346 5 5 3.654 5 2c0-.14.009-.283.028-.446A1.001 1.001 0 0 0 4.003 1a10.935 10.935 0 0 0-3.001.535 1 1 0 0 0-.684.949v.38a12.058 12.058 0 0 0 3.453 8.466A12.055 12.055 0 0 0 12.001 15c2.863 0 5.577-1.024 7.707-2.881.246.89.445 1.891.591 2.881a1.001 1.001 0 0 0 .991.855c.03 0 .06-.001.09-.005a1 1 0 0 0 .905-1.085 20.633 20.633 0 0 0-.587-2.678 1.001 1.001 0 0 0-.1-1.023zM12 13c-3.34 0-6.47-1.3-8.84-3.66a10.097 10.097 0 0 1-2.891-6.893c.611-.154 1.227-.267 1.851-.341C2.571 3.175 3.462 4 4.5 4c1.47 0 2.715-.872 3.3-2.127.65.071 1.293.127 1.93.127 1.654 0 3 1.346 3 3 0 .217-.031.444-.099.7.569.111 1.12.3 1.635.568.183.635.464 1.231.831 1.764.152.219.336.41.525.59.345.328.729.598 1.148.806.2.098.41.178.63.242.325.094.665.15 1.013.16.185.598.298 1.221.332 1.855-.902.578-1.861 1.044-2.863 1.374A10.085 10.085 0 0 1 12 13zm10.995 7.938a1 1 0 0 1-1.401.219A2.978 2.978 0 0 0 20 21c-1.654 0-3-1.346-3-3a3.04 3.04 0 0 0-.167-1 1 1 0 0 1 1.91-.583c.03.167.057.337.057.5 0 .551.448 1 1 1 .366 0 .673-.2.857-.504a1 1 0 0 1 1.338-.475z" />
                    <circle cx="7.5" cy="14.5" r="1.5" fill="#ffffff" />
                    <circle cx="11.5" cy="18.5" r="1.5" fill="#ffffff" />
                    <circle cx="16.5" cy="18.5" r="1.5" fill="#ffffff" />
                  </svg>
                  <p className="text-sm text-white">Cookies</p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={toggleExpanded}
                    className="rounded-full bg-white/20 px-2 py-1 text-white hover:bg-white/30"
                  >
                    <span className="text-xs">See More</span>
                  </button>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleAccept}
                      className="whitespace-nowrap bg-orange text-white hover:bg-orange-600"
                      size="sm"
                    >
                      Accept
                    </Button>
                  </motion.div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
