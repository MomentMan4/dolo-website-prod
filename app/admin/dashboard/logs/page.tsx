"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Download, Search } from "lucide-react"

type LogEntry = {
  id: string
  action: string
  admin: string
  timestamp: string
}

export default function LogsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock log data
  const logs: LogEntry[] = [
    {
      id: "log_1",
      action: "Created new launch plan",
      admin: "john@dolo.com",
      timestamp: "2025-05-14T12:30:00Z",
    },
    {
      id: "log_2",
      action: "Updated pricing for accessibility add-on",
      admin: "sarah@dolo.com",
      timestamp: "2025-05-14T10:15:22Z",
    },
    {
      id: "log_3",
      action: "Deleted test project",
      admin: "john@dolo.com",
      timestamp: "2025-05-13T16:45:11Z",
    },
    {
      id: "log_4",
      action: "Marked project as complete",
      admin: "alex@dolo.com",
      timestamp: "2025-05-13T14:22:30Z",
    },
    {
      id: "log_5",
      action: "Added new admin user",
      admin: "sarah@dolo.com",
      timestamp: "2025-05-12T09:10:05Z",
    },
    {
      id: "log_6",
      action: "Sent test email",
      admin: "john@dolo.com",
      timestamp: "2025-05-12T08:30:45Z",
    },
    {
      id: "log_7",
      action: "Updated banner message",
      admin: "alex@dolo.com",
      timestamp: "2025-05-11T17:12:33Z",
    },
    {
      id: "log_8",
      action: "Changed rush fee percentage",
      admin: "sarah@dolo.com",
      timestamp: "2025-05-11T11:05:19Z",
    },
  ]

  // Filter logs based on search term
  const filteredLogs = logs.filter(
    (log) =>
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.admin.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Format timestamp for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date)
  }

  const handleExportCSV = () => {
    // Create CSV content
    const headers = ["Action", "Admin", "Timestamp"]
    const csvContent = [
      headers.join(","),
      ...filteredLogs.map((log) => [log.action, log.admin, formatDate(log.timestamp)].join(",")),
    ].join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "dolo_admin_logs.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl font-bold text-navy sm:text-3xl">Admin Logs</h1>
        <p className="mt-2 text-gray-600">View and search through admin activity logs.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="rounded-xl bg-white p-6 shadow-md"
      >
        <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search logs by action or admin..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="ml-auto whitespace-nowrap border-navy text-navy hover:bg-navy/10"
          >
            <Download className="mr-2 h-4 w-4" />
            Export to CSV
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Action
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Admin
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log, index) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="font-medium text-navy">{log.action}</span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-600">{log.admin}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-600">{formatDate(log.timestamp)}</td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                    No logs found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
