"use client"

import { Suspense } from "react"
import { SuccessPageContent } from "@/components/success-page-content"

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessPageContent />
    </Suspense>
  )
}
