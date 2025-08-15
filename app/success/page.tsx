import { Suspense } from "react"
import { SuccessPageContent } from "@/components/success-page-content"

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessPageContent />
    </Suspense>
  )
}
