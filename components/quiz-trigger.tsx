"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"
import { createPortal } from "react-dom"

// Dynamically import the QuizModal component to improve performance
const QuizModal = dynamic(() => import("@/components/quiz-modal").then((mod) => ({ default: mod.QuizModal })), {
  ssr: false,
  loading: () => <div className="hidden">Loading...</div>,
})

export function QuizTrigger() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Only run this effect on the client
  useState(() => {
    setMounted(true)
  })

  return (
    <>
      <Button
        variant="outline"
        className="w-full border-navy text-navy hover:bg-navy/10 sm:w-auto"
        onClick={() => setIsModalOpen(true)}
      >
        Find My Perfect Plan
      </Button>

      {/* Use createPortal to render the modal at the document root */}
      {isModalOpen &&
        mounted &&
        typeof document !== "undefined" &&
        createPortal(<QuizModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />, document.body)}
    </>
  )
}
