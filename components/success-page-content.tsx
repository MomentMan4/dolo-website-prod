"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Check, Mail, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface SessionData {
  customer_email: string
  customer_name: string
  amount_total: number
  plan: string
  rush_delivery: boolean
}

export function SuccessPageContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (sessionId) {
      fetch(`/api/checkout/session?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          setSessionData(data)
          setLoading(false)
        })
        .catch((error) => {
          console.error("Error fetching session data:", error)
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-16">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-green-100"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Check className="h-10 w-10 text-green-600" />
          </motion.div>

          <h1 className="mb-4 text-3xl font-bold text-navy md:text-4xl">Payment Successful!</h1>

          {sessionData ? (
            <div className="space-y-6">
              <p className="text-lg text-gray-600">
                Thank you, {sessionData.customer_name}! Your payment has been processed successfully.
              </p>

              <div className="rounded-xl bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-xl font-bold text-navy">Order Summary</h2>
                <div className="space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan:</span>
                    <span className="font-medium capitalize">{sessionData.plan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">${(sessionData.amount_total / 100).toFixed(2)}</span>
                  </div>
                  {sessionData.rush_delivery && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rush Delivery:</span>
                      <span className="font-medium text-orange">Yes</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-xl bg-blue-50 p-6">
                <h3 className="mb-4 text-lg font-bold text-navy">What happens next?</h3>
                <div className="space-y-4 text-left">
                  <div className="flex items-start space-x-3">
                    <Mail className="mt-1 h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Check your email</p>
                      <p className="text-sm text-gray-600">
                        We've sent a welcome email to {sessionData.customer_email} with your project details.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MessageCircle className="mt-1 h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Support chat access</p>
                      <p className="text-sm text-gray-600">
                        Your dedicated support chat will be activated within 24 hours.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="mt-1 h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Project kickoff</p>
                      <p className="text-sm text-gray-600">
                        Our team will review your requirements and start development within 1-2 business days.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-lg text-gray-600">
                Your payment has been processed successfully! Check your email for confirmation details.
              </p>
            </div>
          )}

          <div className="mt-8 space-y-4">
            <Link href="/">
              <Button className="bg-orange text-white hover:bg-orange-600">Return to Homepage</Button>
            </Link>
            <p className="text-sm text-gray-500">
              Questions? Contact us at{" "}
              <a href="mailto:hello@dolobuilds.com" className="text-orange hover:underline">
                hello@dolobuilds.com
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
