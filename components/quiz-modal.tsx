"use client"

import type React from "react"
import { useState } from "react"

interface QuizQuestion {
  id: string
  question: string
  type: "text" | "radio"
  options?: string[]
  required: boolean
}

interface QuizModalProps {
  isOpen: boolean
  onClose: () => void
  questions: QuizQuestion[]
  onSubmit: (answers: { [key: string]: string }) => void
}

const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose, questions, onSubmit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<{ [key: string]: string }>({})

  const currentQuestion = questions[currentQuestionIndex]

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer })
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = () => {
    onSubmit(answers)
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleBackdropClick}>
      <div className="bg-white rounded-lg p-8 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="mb-4 text-lg font-semibold text-navy">
          {currentQuestion.question}
          {currentQuestion.required && <span className="ml-1 text-red-500">*</span>}
        </h3>

        {currentQuestion.type === "text" && (
          <input
            type="text"
            value={answers[currentQuestion.id] || ""}
            onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
            className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 ${
              currentQuestion.required
                ? "border-orange-300 focus:border-orange focus:ring-orange bg-orange-50/20"
                : "border-gray-300 focus:border-gray-500 focus:ring-gray-500"
            }`}
            placeholder="Type your answer here..."
            required={currentQuestion.required}
          />
        )}

        {currentQuestion.type === "radio" && (
          <div
            className={`space-y-3 ${currentQuestion.required ? "bg-orange-50/10 p-4 rounded-lg border border-orange-200" : ""}`}
          >
            {currentQuestion.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={currentQuestion.id}
                  value={option}
                  checked={answers[currentQuestion.id] === option}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  className="focus:ring-orange-500 h-4 w-4 text-orange-500 border-gray-300"
                  required={currentQuestion.required}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-between">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {currentQuestionIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
            >
              Submit
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuizModal
