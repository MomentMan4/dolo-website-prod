"use client"

import type React from "react"
import { useState } from "react"
import { X } from "lucide-react"

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={handleBackdropClick}>
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10">
          <X className="h-6 w-6" />
        </button>

        <div className="p-8">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-navy mb-4">
              {currentQuestion.question}
              {currentQuestion.required && <span className="ml-1 text-red-500">*</span>}
            </h3>
          </div>

          {currentQuestion.type === "text" && (
            <div className="mb-8">
              <input
                type="text"
                value={answers[currentQuestion.id] || ""}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                className={`w-full rounded-md border px-4 py-3 text-lg focus:outline-none focus:ring-2 ${
                  currentQuestion.required
                    ? "border-orange-300 focus:border-orange focus:ring-orange bg-orange-50/20"
                    : "border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                }`}
                placeholder="Type your answer here..."
                required={currentQuestion.required}
              />
            </div>
          )}

          {currentQuestion.type === "radio" && (
            <div
              className={`space-y-4 mb-8 ${currentQuestion.required ? "bg-orange-50/10 p-6 rounded-lg border border-orange-200" : ""}`}
            >
              {currentQuestion.options?.map((option, index) => (
                <label
                  key={index}
                  className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    value={option}
                    checked={answers[currentQuestion.id] === option}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    className="focus:ring-orange-500 h-5 w-5 text-orange-500 border-gray-300"
                    required={currentQuestion.required}
                  />
                  <span className="text-lg">{option}</span>
                </label>
              ))}
            </div>
          )}

          <div className="flex justify-between">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
            >
              Previous
            </button>
            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors font-semibold"
              >
                Get My Recommendation
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizModal
