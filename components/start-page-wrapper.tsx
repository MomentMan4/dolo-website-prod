"use client"

import { Suspense } from "react"
import { StartPage } from "./start-page"

// Loading component for Suspense fallback
function StartPageLoading() {
  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-16 md:py-20 lg:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-bold text-navy md:text-4xl lg:text-5xl">Let's Get Your Website Started</h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">Loading your plan selection...</p>
        </div>
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange border-t-transparent"></div>
        </div>
      </div>
    </section>
  )
}

// Wrapper component with Suspense boundary
export function StartPageWrapper() {
  return (
    <Suspense fallback={<StartPageLoading />}>
      <StartPage />
    </Suspense>
  )
}
