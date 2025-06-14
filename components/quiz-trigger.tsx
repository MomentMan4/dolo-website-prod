"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"
import { createPortal } from "react-dom"

// Fix the dynamic import - QuizModal is exported as default
const QuizModal = dynamic(() => import("@/components/quiz-modal"), {
  ssr: false,
  loading: () => <div className="hidden">Loading...</div>,
})

const quizQuestions = [
  {
    id: "business-type",
    question: "What type of business do you have?",
    type: "radio" as const,
    options: ["Restaurant", "Retail Store", "Service Business", "E-commerce", "Professional Services", "Other"],
    required: true,
  },
  {
    id: "website-goal",
    question: "What's your main goal for your website?",
    type: "radio" as const,
    options: [
      "Generate leads",
      "Sell products online",
      "Showcase portfolio",
      "Provide information",
      "Build brand awareness",
    ],
    required: true,
  },
  {
    id: "budget",
    question: "What's your budget range?",
    type: "radio" as const,
    options: ["$500-$1000", "$1000-$2000", "$2000-$5000", "$5000+"],
    required: true,
  },
  {
    id: "timeline",
    question: "When do you need your website completed?",
    type: "radio" as const,
    options: ["ASAP (Rush fee applies)", "Within 2 weeks", "Within 1 month", "No rush"],
    required: true,
  },
  {
    id: "email",
    question: "What's your email address?",
    type: "text" as const,
    required: true,
  },
]

export function QuizTrigger() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Only run this effect on the client
  useState(() => {
    setMounted(true)
  })

  const handleQuizSubmit = async (answers: { [key: string]: string }) => {
    try {
      // Send quiz results via API
      const response = await fetch("/api/quiz-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: answers.email,
          plan: determinePlan(answers),
          description: formatAnswers(answers),
          link: window.location.origin + "/start",
          consent: true,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log("Quiz submitted successfully:", result)

        // Show success message without automatic redirection
        alert("Thank you! We've sent your personalized recommendation to your email. Check your inbox for details.")

        // Close the modal after successful submission
        setIsModalOpen(false)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit quiz")
      }
    } catch (error) {
      console.error("Error submitting quiz:", error)
      alert("There was an error submitting your quiz. Please try again or contact support.")
    }
  }

  const determinePlan = (answers: { [key: string]: string }) => {
    const budget = answers.budget
    const goal = answers["website-goal"]

    if (budget === "$500-$1000") return "Essential"
    if (budget === "$1000-$2000") return "Pro"
    if (budget === "$2000-$5000" || budget === "$5000+") return "Premier"

    // Fallback based on goal
    if (goal === "Sell products online") return "Pro"
    if (goal === "Generate leads" || goal === "Build brand awareness") return "Pro"

    return "Essential"
  }

  const formatAnswers = (answers: { [key: string]: string }) => {
    return `Business Type: ${answers["business-type"]}\nWebsite Goal: ${answers["website-goal"]}\nBudget: ${answers.budget}\nTimeline: ${answers.timeline}`
  }

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
        createPortal(
          <QuizModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            questions={quizQuestions}
            onSubmit={handleQuizSubmit}
          />,
          document.body,
        )}
    </>
  )
}
