import { Suspense } from "react"
import { SuccessPageContent } from "@/components/success-page-content"

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your confirmation...</p>
          </div>
        </div>
      }
    >
      <SuccessPageContent />
    </Suspense>
  )
}
