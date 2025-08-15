"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Check, MessageCircle, Mail, Calendar, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface PaymentDetails {
  customerName: string
  customerEmail: string
  amount: number
  projectType: string
  projectId: string
  rushDelivery: boolean
  chatAccessToken?: string
}

export function SuccessPageContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Clear form data from localStorage since payment was successful
    try {
      localStorage.removeItem("dolo_start_form_data")
      localStorage.removeItem("dolo_start_form_expiry")
    } catch (error) {
      console.warn("Failed to clear form data:", error)
    }

    if (sessionId) {
      fetchPaymentDetails(sessionId)
    } else {
      setError("No session ID provided")
      setLoading(false)
    }
  }, [sessionId])

  const fetchPaymentDetails = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/checkout/session?session_id=${sessionId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch payment details")
      }
      const data = await response.json()
      setPaymentDetails(data)
    } catch (error) {
      console.error("Error fetching payment details:", error)
      setError("Failed to load payment details")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#003B6F]/5 via-[#007196]/5 to-[#FF5073]/5">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your confirmation...</p>
        </div>
      </div>
    )
  }

  if (error || !paymentDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#003B6F]/5 via-[#007196]/5 to-[#FF5073]/5">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-navy mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-6">{error || "Unable to load payment confirmation"}</p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-orange to-pink hover:from-orange/90 hover:to-pink/90 text-white">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003B6F]/5 via-[#007196]/5 to-[#FF5073]/5">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-green-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-navy mb-4">Payment Successful! 🎉</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Thank you {paymentDetails.customerName}! Your website project is now officially underway.
            </p>
          </motion.div>

          {/* Payment Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-8 mb-8"
          >
            <h2 className="text-2xl font-semibold text-navy mb-6">Payment Confirmation</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Project Type</p>
                  <p className="font-semibold text-navy capitalize">{paymentDetails.projectType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Project ID</p>
                  <p className="font-semibold text-navy">#{paymentDetails.projectId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Customer Email</p>
                  <p className="font-semibold text-navy">{paymentDetails.customerEmail}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Amount Paid</p>
                  <p className="text-2xl font-bold text-green-600">${paymentDetails.amount.toLocaleString()}</p>
                </div>
                {paymentDetails.rushDelivery && (
                  <div>
                    <p className="text-sm text-gray-500">Rush Delivery</p>
                    <p className="font-semibold text-orange">✅ Included</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Payment Date</p>
                  <p className="font-semibold text-navy">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Customer Portal Access */}
          {paymentDetails.chatAccessToken && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg p-8 mb-8 border border-blue-200"
            >
              <div className="flex items-center mb-4">
                <MessageCircle className="h-8 w-8 text-blue-500 mr-3" />
                <h2 className="text-2xl font-semibold text-navy">Priority Customer Portal</h2>
              </div>

              <p className="text-gray-600 mb-6">
                You now have exclusive access to our priority customer support portal with direct chat access to our
                team.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={`/customer-portal/${paymentDetails.chatAccessToken}`}>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white flex items-center space-x-2">
                    <MessageCircle className="h-4 w-4" />
                    <span>Access Customer Portal</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <div className="text-sm text-gray-600 flex items-center">
                  <span className="bg-gray-100 px-3 py-1 rounded font-mono text-xs">Access expires in 6 months</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* What's Next */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-8 mb-8"
          >
            <h2 className="text-2xl font-semibold text-navy mb-6">What Happens Next?</h2>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-orange text-white rounded-full flex items-center justify-center font-semibold text-sm">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-navy mb-1">Project Kickoff Call</h3>
                  <p className="text-gray-600">
                    Our team will contact you within 24 hours to schedule your project kickoff call and gather
                    additional requirements.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-orange text-white rounded-full flex items-center justify-center font-semibold text-sm">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-navy mb-1">Design & Development</h3>
                  <p className="text-gray-600">
                    We'll create your custom website according to your specifications and brand guidelines.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-orange text-white rounded-full flex items-center justify-center font-semibold text-sm">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-navy mb-1">Review & Launch</h3>
                  <p className="text-gray-600">
                    You'll review the completed website, request any changes, and then we'll launch it live.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center"
          >
            <h2 className="text-2xl font-semibold text-navy mb-6">Questions? We're Here to Help</h2>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:hello@dolobuilds.com">
                <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                  <Mail className="h-4 w-4" />
                  <span>Email Us</span>
                </Button>
              </a>

              <a href="https://calendly.com/dolo" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                  <Calendar className="h-4 w-4" />
                  <span>Schedule a Call</span>
                </Button>
              </a>
            </div>

            <p className="text-gray-600 mt-6">
              A confirmation email with all these details has been sent to {paymentDetails.customerEmail}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
