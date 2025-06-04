"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy via-navy/90 to-teal/20 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-8">
          <Shield className="w-12 h-12 text-red-600" />
        </div>

        <h1 className="text-4xl font-bold text-white mb-4">Access Denied</h1>
        <p className="text-xl text-gray-300 mb-8 max-w-md">
          You don't have permission to access this area. Please contact your administrator.
        </p>

        <Link href="/">
          <Button className="bg-orange hover:bg-orange-600 text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}
