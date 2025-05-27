"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LayoutDashboard, Settings, ClipboardList, CreditCard, Mail, ChevronRight, Menu, X } from "lucide-react"
import Link from "next/link"

type MenuItem = {
  name: string
  href: string
  icon: React.ReactNode
}

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Mock authentication check - in a real app, this would verify admin status
    // For this demo, we'll just set to true
    setIsAuthorized(true)
  }, [])

  const menuItems: MenuItem[] = [
    {
      name: "Overview",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Settings",
      href: "/admin/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
    },
    {
      name: "Logs",
      href: "/admin/dashboard/logs",
      icon: <ClipboardList className="h-5 w-5" />,
    },
    {
      name: "Stripe Test",
      href: "/admin/dashboard/stripe-test",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      name: "Resend Test",
      href: "/admin/dashboard/resend-test",
      icon: <Mail className="h-5 w-5" />,
    },
  ]

  const isActive = (href: string) => {
    if (href === "/admin/dashboard" && pathname === "/admin/dashboard") {
      return true
    }
    return pathname?.startsWith(href) && href !== "/admin/dashboard"
  }

  if (!isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-navy">Access Denied</h1>
          <p className="mt-2 text-gray-600">You need admin permission to view this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="flex flex-1 bg-gray-50">
        {/* Mobile sidebar toggle */}
        <div className="fixed left-0 top-20 z-30 p-4 md:hidden">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="rounded-full bg-white p-2 shadow-md">
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Sidebar for desktop */}
        <div className="hidden w-64 flex-shrink-0 bg-white shadow-md md:block">
          <div className="flex h-16 items-center border-b px-6">
            <h2 className="text-lg font-bold text-navy">Admin Dashboard</h2>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-all hover:bg-gray-100 ${
                      isActive(item.href) ? "bg-orange/10 text-orange" : "text-gray-700"
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                    {isActive(item.href) && <ChevronRight className="ml-auto h-4 w-4" />}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Mobile sidebar */}
        <motion.div
          className={`fixed inset-y-0 left-0 z-20 w-64 transform bg-white shadow-lg md:hidden ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          animate={{ x: isSidebarOpen ? 0 : -256 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex h-16 items-center justify-between border-b px-6">
            <h2 className="text-lg font-bold text-navy">Admin Dashboard</h2>
            <button onClick={() => setIsSidebarOpen(false)}>
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-all hover:bg-gray-100 ${
                      isActive(item.href) ? "bg-orange/10 text-orange" : "text-gray-700"
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                    {isActive(item.href) && <ChevronRight className="ml-auto h-4 w-4" />}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </motion.div>

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-x-hidden p-4 md:p-6 lg:p-8">
          <main className="flex-1">{children}</main>
        </div>
      </div>

      <Footer />
    </div>
  )
}
