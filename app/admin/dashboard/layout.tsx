"use client"

import type React from "react"

import {
  HomeIcon,
  UsersIcon,
  FolderIcon,
  CalendarDaysIcon,
  DocumentDuplicateIcon,
  ChartBarSquareIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline"
import { usePathname } from "next/navigation"

const navigation = [
  { name: "Home", href: "/admin/dashboard", icon: HomeIcon, current: false },
  { name: "Users", href: "/admin/dashboard/users", icon: UsersIcon, current: false },
  { name: "Projects", href: "/admin/dashboard/projects", icon: FolderIcon, current: false },
  { name: "Calendar", href: "/admin/dashboard/calendar", icon: CalendarDaysIcon, current: false },
  { name: "Documents", href: "/admin/dashboard/documents", icon: DocumentDuplicateIcon, current: false },
  { name: "Reports", href: "/admin/dashboard/reports", icon: ChartBarSquareIcon, current: false },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const updatedNavigation = navigation.map((item) => ({
    ...item,
    current: pathname === item.href,
  }))

  updatedNavigation.push({
    name: "Quiz Results",
    href: "/admin/dashboard/quiz-results",
    icon: ClipboardDocumentListIcon,
    current: pathname === "/admin/dashboard/quiz-results",
  })

  return (
    <>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <div className="hidden w-64 border-r border-gray-200 dark:border-gray-700 lg:flex lg:flex-col">
          {/* Sidebar content */}
          <div className="flex min-h-0 flex-col border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 pt-5">
            <div className="flex flex-shrink-0 px-4">
              <a href="#" className="flex items-center">
                <img
                  className="h-8 w-auto"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                  alt="Your Company"
                />
                <span className="ml-3 text-xl font-bold dark:text-white">Your Company</span>
              </a>
            </div>
            <nav
              className="mt-5 flex-1 divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto"
              aria-label="Sidebar"
            >
              <div className="space-y-1 px-2">
                {updatedNavigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white",
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    )}
                  >
                    <item.icon
                      className={classNames(
                        item.current
                          ? "text-gray-500 dark:text-gray-400"
                          : "text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300",
                        "mr-3 flex-shrink-0 h-6 w-6",
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                ))}
              </div>
            </nav>
          </div>
        </div>
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </>
  )
}
