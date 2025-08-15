"use client"

import { useState, lazy, Suspense } from "react"
import { Button } from "@/components/ui/button"

// Lazy load the quiz modal for better performance
const QuizModal = lazy(() => import("@/components/quiz-modal"))

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

  const handleQuizSubmit = async (answers: { [key: string]: string }) => {
    try {
      const plan = determinePlan(answers)
      const description = formatDescription(plan, answers)

      // Send quiz results via API
      const response = await fetch("/api/quiz-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: answers.email,
          name: answers.email.split("@")[0], // Extract name from email
          plan: plan,
          description: description,
          link: `${window.location.origin}/start?plan=${plan.toLowerCase()}`,
          consent: true,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log("Quiz submitted successfully:", result)

        // Show success message
        alert(
          `Thank you! We've sent your personalized ${plan} plan recommendation to ${answers.email}. Check your inbox for details and next steps.`,
        )

        // Close the modal after successful submission
        setIsModalOpen(false)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit quiz")
      }
    } catch (error) {
      console.error("Error submitting quiz:", error)
      alert("There was an error submitting your quiz. Please try again or contact support at hello@dolobuilds.com")
    }
  }

  const determinePlan = (answers: { [key: string]: string }) => {
    const budget = answers.budget
    const goal = answers["website-goal"]
    const businessType = answers["business-type"]

    // Budget-based logic
    if (budget === "$500-$1000") return "Essential"
    if (budget === "$5000+") return "Premier"

    // Goal-based logic for mid-range budgets
    if (budget === "$1000-$2000" || budget === "$2000-$5000") {
      if (goal === "Sell products online" || businessType === "E-commerce") return "Pro"
      if (goal === "Generate leads" || goal === "Build brand awareness") return "Pro"
      if (budget === "$2000-$5000") return "Premier"
      return "Pro"
    }

    // Fallback
    return "Pro"
  }

  const formatDescription = (plan: string, answers: { [key: string]: string }) => {
    const planDescriptions = {
      Essential:
        "Perfect for small businesses and startups looking for a professional online presence. Includes responsive design, basic SEO, and contact forms.",
      Pro: "Ideal for growing businesses that need advanced features. Includes e-commerce capabilities, blog integration, and enhanced SEO optimization.",
      Premier:
        "Comprehensive solution for established businesses requiring premium features. Includes custom functionality, advanced integrations, and priority support.",
    }

    const baseDescription = planDescriptions[plan as keyof typeof planDescriptions] || planDescriptions.Pro
    const businessType = answers["business-type"]
    const goal = answers["website-goal"]

    return `${baseDescription} This plan is specifically tailored for your ${businessType} business with a focus on ${goal.toLowerCase()}.`
  }

  return (
    <>
      <Button
        variant="outline"
        className="w-full border-navy text-navy hover:bg-navy/10 sm:w-auto bg-transparent"
        onClick={() => setIsModalOpen(true)}
      >
        Find My Perfect Plan
      </Button>

      {/* Lazy load the modal only when needed */}
      {isModalOpen && (
        <Suspense fallback={<div className="hidden">Loading...</div>}>
          <QuizModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            questions={quizQuestions}
            onSubmit={handleQuizSubmit}
          />
        </Suspense>
      )}
    </>
  )
}
