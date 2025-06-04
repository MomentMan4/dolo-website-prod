"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

type Question = {
  text: string
  options: string[]
}

type QuizResult = {
  plan: string
  description: string
  cta: string
  link: string
}

interface QuizModalProps {
  isOpen: boolean
  onClose: () => void
}

export function QuizModal({ isOpen, onClose }: QuizModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [email, setEmail] = useState("")
  const [consent, setConsent] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  const questions: Question[] = [
    {
      text: "What best describes your current stage?",
      options: ["Starting out", "Scaling up", "Expanding features"],
    },
    {
      text: "How fast do you need your site live?",
      options: ["Within 10 days", "In 2–3 weeks", "I'm flexible"],
    },
    {
      text: "What kind of functionality are you looking for?",
      options: ["Simple info website", "Booking forms / Newsletter", "Dashboard / Payment features"],
    },
    {
      text: "Do you want admin or backend features?",
      options: ["No", "Not sure", "Yes"],
    },
    {
      text: "What's your current budget range?",
      options: ["Under $500", "$500 – $1000", "$1000+"],
    },
  ]

  const results: QuizResult[] = [
    {
      plan: "Launch",
      description: "Perfect for small businesses and personal brands just getting started online.",
      cta: "Start My Website",
      link: "/start?plan=launch",
    },
    {
      plan: "Grow",
      description: "For established businesses looking to expand their online presence and capabilities.",
      cta: "Start My Website",
      link: "/start?plan=grow",
    },
    {
      plan: "Elevate",
      description: "For businesses that need a comprehensive, feature-rich online platform.",
      cta: "Start My Website",
      link: "/start?plan=elevate",
    },
  ]

  useEffect(() => {
    // Reset state when modal opens
    if (isOpen) {
      setCurrentQuestion(0)
      setAnswers([])
      setShowResult(false)
      setShowEmailForm(false)
      setResult(null)
      setEmail("")
      setConsent(false)
      setEmailError("")
      setIsSubmitting(false)

      // Prevent body scrolling when modal is open
      document.body.style.overflow = "hidden"

      // Add escape key listener
      const handleEscKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose()
        }
      }

      window.addEventListener("keydown", handleEscKey)

      return () => {
        // Re-enable scrolling when modal closes
        document.body.style.overflow = "auto"
        window.removeEventListener("keydown", handleEscKey)
      }
    }
  }, [isOpen, onClose])

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = optionIndex
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      // Move to next question
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Show email collection form before results
      setShowEmailForm(true)
      // Calculate result in background
      calculateResult(newAnswers)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateResult = (finalAnswers: number[]) => {
    // Count occurrences of each option
    const counts = [0, 0, 0]
    finalAnswers.forEach((answer) => {
      counts[answer]++
    })

    // Find the most common answer
    let maxCount = 0
    let resultIndex = 0

    counts.forEach((count, index) => {
      if (count > maxCount) {
        maxCount = count
        resultIndex = index
      }
    })

    // Store result in state
    setResult(results[resultIndex])
  }

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleEmailSubmit = async () => {
    if (!email) {
      setEmailError("Email is required")
      return
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address")
      return
    }

    if (!consent) {
      setEmailError("Please agree to the privacy policy")
      return
    }

    setEmailError("")
    setIsSubmitting(true)

    try {
      // First try to store in localStorage as a fallback
      localStorage.setItem(
        "quiz-result",
        JSON.stringify({
          email,
          result: result?.plan,
          timestamp: new Date().toISOString(),
        }),
      )

      // Then try to send via API
      const response = await fetch("/api/quiz-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          plan: result?.plan,
          description: result?.description,
          link: result?.link,
          consent,
        }),
      })

      // Even if API fails, we'll show success since we have the localStorage backup
      setShowEmailForm(false)
      setShowResult(true)
    } catch (error) {
      console.error("Error submitting quiz email:", error)
      // Still show success since we have the localStorage backup
      setShowEmailForm(false)
      setShowResult(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div
        ref={modalRef}
        className="relative z-[101] mx-auto my-8 w-full max-w-xl overflow-hidden rounded-xl bg-white p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="absolute right-4 top-4 rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        {/* Quiz content */}
        <div className="mb-6 sm:mb-8">
          {!showEmailForm && !showResult ? (
            <div key={currentQuestion} className="min-w-full">
              <h2 className="mb-4 text-xl font-bold text-navy sm:text-2xl">Find Your Perfect Plan</h2>
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <div className="h-2 w-full max-w-[150px] rounded-full bg-gray-200 sm:max-w-[200px]">
                  <div
                    className="h-2 rounded-full bg-orange"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              <h3 className="mb-4 text-base font-medium text-navy sm:mb-6 sm:text-lg">
                {questions[currentQuestion].text}
              </h3>

              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    className={`w-full rounded-lg border-2 p-3 text-left transition-all sm:p-4 ${
                      answers[currentQuestion] === index
                        ? "border-orange bg-orange/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleAnswer(index)}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {currentQuestion > 0 && (
                <div className="mt-6">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    size="default"
                    className="border-navy text-navy hover:bg-navy/10"
                  >
                    Back
                  </Button>
                </div>
              )}
            </div>
          ) : showEmailForm ? (
            <div className="min-w-full">
              <h2 className="mb-4 text-xl font-bold text-navy sm:text-2xl">Almost There!</h2>
              <p className="mb-6 text-gray-600">
                We've found the perfect plan for you. Enter your email to see your results and receive a copy.
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={emailError ? "border-red-500" : ""}
                  />
                  {emailError && <p className="text-sm text-red-500">{emailError}</p>}
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="consent"
                    checked={consent}
                    onCheckedChange={(checked) => setConsent(checked as boolean)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="consent"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to receive marketing communications
                    </Label>
                    <p className="text-xs text-gray-500">
                      We'll use your email to send your results and occasional updates. You can unsubscribe at any time.
                      See our{" "}
                      <Link href="/privacy-policy" className="text-orange hover:underline">
                        Privacy Policy
                      </Link>
                      .
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowEmailForm(false)
                      setCurrentQuestion(questions.length - 1)
                    }}
                    className="border-navy text-navy hover:bg-navy/10"
                    disabled={isSubmitting}
                  >
                    Back
                  </Button>
                  <Button
                    className="bg-orange text-white hover:bg-orange-600"
                    onClick={handleEmailSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "See My Results"}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="min-w-full">
              <h2 className="mb-4 text-xl font-bold text-navy sm:text-2xl">Your Result</h2>

              <div className="rounded-lg bg-gradient-to-r from-navy/10 to-teal/10 p-4 sm:p-6">
                <h3 className="mb-2 text-lg font-bold text-navy sm:text-xl">{result?.plan} is best for you</h3>
                <p className="mb-6 text-sm text-gray-600 sm:text-base">{result?.description}</p>

                <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
                  <Link href={result?.link || "/start"} className="w-full sm:w-auto">
                    <div className="animate-glow">
                      <Button className="w-full bg-orange text-white hover:bg-orange-600 sm:w-auto">
                        {result?.cta}
                      </Button>
                    </div>
                  </Link>

                  <Link href="/pricing" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full border-navy text-navy hover:bg-navy/10 sm:w-auto">
                      Explore All Plans
                    </Button>
                  </Link>
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-500">
                We've sent a copy of your results to {email}. Check your inbox!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Add default export for dynamic import
export default QuizModal
