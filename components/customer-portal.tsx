"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { MessageCircle, Clock, User, Mail, Building } from "lucide-react"

interface Customer {
  id: string
  name: string
  email: string
  company?: string
  phone?: string
  chat_access_token: string
  chat_access_expires_at: string
  created_at: string
}

interface CustomerPortalProps {
  customer: Customer
}

export function CustomerPortal({ customer }: CustomerPortalProps) {
  const [isChatLoaded, setIsChatLoaded] = useState(false)
  const [chatStatus, setChatStatus] = useState<"loading" | "online" | "offline">("loading")

  useEffect(() => {
    // Load TawkTo script
    const script = document.createElement("script")
    script.async = true
    script.src = "https://embed.tawk.to/YOUR_TAWK_TO_ID/YOUR_WIDGET_ID"
    script.charset = "UTF-8"
    script.setAttribute("crossorigin", "*")

    // TawkTo configuration
    window.Tawk_API = window.Tawk_API || {}
    window.Tawk_LoadStart = new Date()

    // Set customer information
    window.Tawk_API.setAttributes = {
      name: customer.name,
      email: customer.email,
      company: customer.company || "",
      phone: customer.phone || "",
      customerId: customer.id,
      accessToken: customer.chat_access_token,
    }

    // TawkTo event handlers
    window.Tawk_API.onLoad = () => {
      setIsChatLoaded(true)
      setChatStatus("online")
    }

    window.Tawk_API.onStatusChange = (status: string) => {
      setChatStatus(status === "online" ? "online" : "offline")
    }

    document.head.appendChild(script)

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [customer])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getTimeUntilExpiry = () => {
    const now = new Date()
    const expires = new Date(customer.chat_access_expires_at)
    const diffTime = expires.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays > 30) {
      const months = Math.floor(diffDays / 30)
      return `${months} month${months > 1 ? "s" : ""}`
    }
    return `${diffDays} day${diffDays > 1 ? "s" : ""}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003B6F]/5 via-[#007196]/5 to-[#FF5073]/5">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="/dolo-logo.svg" alt="Dolo" className="h-8 w-auto" />
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-lg font-semibold text-navy">Customer Portal</h1>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className={`h-2 w-2 rounded-full ${
                  chatStatus === "online" ? "bg-green-500" : chatStatus === "offline" ? "bg-red-500" : "bg-yellow-500"
                }`}
              ></div>
              <span className="text-sm text-gray-600 capitalize">{chatStatus}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-8 mb-8"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-navy mb-2">Welcome back, {customer.name}!</h2>
              <p className="text-gray-600">
                You have priority access to our customer support team. Start a conversation below.
              </p>
            </div>

            {/* Customer Info */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-orange" />
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-navy">{customer.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-orange" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-navy">{customer.email}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {customer.company && (
                  <div className="flex items-center space-x-3">
                    <Building className="h-5 w-5 text-orange" />
                    <div>
                      <p className="text-sm text-gray-500">Company</p>
                      <p className="font-medium text-navy">{customer.company}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-orange" />
                  <div>
                    <p className="text-sm text-gray-500">Access Expires</p>
                    <p className="font-medium text-navy">
                      {formatDate(customer.chat_access_expires_at)} ({getTimeUntilExpiry()} remaining)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Status */}
            <div className="bg-gradient-to-r from-orange/10 to-orange/5 rounded-lg p-6 text-center">
              <MessageCircle className="h-12 w-12 text-orange mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-navy mb-2">Priority Customer Support</h3>
              {isChatLoaded ? (
                <div>
                  <p className="text-gray-600 mb-4">
                    Our support team is {chatStatus}.{" "}
                    {chatStatus === "online"
                      ? "Start chatting now!"
                      : "Leave a message and we'll get back to you soon."}
                  </p>
                  <div className="inline-flex items-center space-x-2 text-sm text-green-600">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Chat widget loaded successfully</span>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4">Loading your priority chat support...</p>
                  <div className="inline-flex items-center space-x-2 text-sm text-yellow-600">
                    <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span>Initializing chat widget</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Support Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-2 gap-6"
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-navy mb-4">How Priority Support Works</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start space-x-2">
                  <div className="h-2 w-2 bg-orange rounded-full mt-2 flex-shrink-0"></div>
                  <span>Direct access to our development team</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="h-2 w-2 bg-orange rounded-full mt-2 flex-shrink-0"></div>
                  <span>Faster response times for urgent issues</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="h-2 w-2 bg-orange rounded-full mt-2 flex-shrink-0"></div>
                  <span>Project updates and progress reports</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="h-2 w-2 bg-orange rounded-full mt-2 flex-shrink-0"></div>
                  <span>Technical support and guidance</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-navy mb-4">Need Help?</h3>
              <div className="space-y-4 text-gray-600">
                <p>If you're experiencing any issues with the chat widget, you can also reach us at:</p>
                <div className="space-y-2">
                  <p>
                    <strong>Email:</strong>{" "}
                    <a href="mailto:hello@dolobuilds.com" className="text-orange hover:underline">
                      hello@dolobuilds.com
                    </a>
                  </p>
                  <p>
                    <strong>Response Time:</strong> Within 4 hours during business days
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  Your access token:{" "}
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">{customer.chat_access_token}</code>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// Extend Window interface for TawkTo
declare global {
  interface Window {
    Tawk_API?: any
    Tawk_LoadStart?: Date
  }
}
