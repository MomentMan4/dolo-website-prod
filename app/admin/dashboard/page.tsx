"use client"

import { motion } from "framer-motion"
import { UserCircle, FileCheck, Clock, DollarSign } from "lucide-react"

export default function AdminDashboard() {
  // Mock data - would come from API in real app
  const metrics = {
    leads: 126,
    privateBuildApps: 43,
    projectsInProgress: 17,
    totalRevenue: 83450.75,
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl font-bold text-navy sm:text-3xl">Dashboard Overview</h1>
        <p className="mt-2 text-gray-600">Welcome to your admin dashboard. Here's what's happening with Dolo.</p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {/* Leads Card */}
        <motion.div variants={item} className="rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-lg">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-navy/10 text-navy">
            <UserCircle className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-medium uppercase text-gray-500">Total Leads</h3>
          <p className="mt-2 text-3xl font-bold text-navy">{metrics.leads}</p>
          <div className="mt-4 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            <span>+12% from last month</span>
          </div>
        </motion.div>

        {/* Private Build Applications Card */}
        <motion.div variants={item} className="rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-lg">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange/10 text-orange">
            <FileCheck className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-medium uppercase text-gray-500">Private Build Apps</h3>
          <p className="mt-2 text-3xl font-bold text-navy">{metrics.privateBuildApps}</p>
          <div className="mt-4 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            <span>+5% from last month</span>
          </div>
        </motion.div>

        {/* Projects In Progress Card */}
        <motion.div variants={item} className="rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-lg">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal/10 text-teal">
            <Clock className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-medium uppercase text-gray-500">Projects In Progress</h3>
          <p className="mt-2 text-3xl font-bold text-navy">{metrics.projectsInProgress}</p>
          <div className="mt-4 inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            <span>+3% from last month</span>
          </div>
        </motion.div>

        {/* Total Revenue Card */}
        <motion.div variants={item} className="rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-lg">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-coral/10 text-coral">
            <DollarSign className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-medium uppercase text-gray-500">Total Revenue</h3>
          <p className="mt-2 text-3xl font-bold text-navy">
            ${metrics.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="mt-4 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            <span>+18% from last month</span>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="rounded-xl bg-white p-6 shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h2 className="text-lg font-bold text-navy">Recent Activity</h2>
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <p className="font-medium text-navy">New Lead: Sarah Johnson</p>
              <p className="text-sm text-gray-500">Interested in Grow plan</p>
            </div>
            <span className="text-sm text-gray-500">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <p className="font-medium text-navy">Private Build Submitted: TechCore Inc</p>
              <p className="text-sm text-gray-500">Budget: $20,000 - $50,000</p>
            </div>
            <span className="text-sm text-gray-500">5 hours ago</span>
          </div>
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <p className="font-medium text-navy">Project Completed: Evergreen Solutions</p>
              <p className="text-sm text-gray-500">Premier plan with add-ons</p>
            </div>
            <span className="text-sm text-gray-500">Yesterday</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
