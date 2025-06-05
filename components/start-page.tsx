"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
// ... other imports

export function StartPage() {
  const searchParams = useSearchParams()
  const [selectedPlan, setSelectedPlan] = useState<string>("")

  // Add useEffect to handle plan parameter
  useEffect(() => {
    const planParam = searchParams.get("plan")
    if (planParam) {
      setSelectedPlan(planParam.toLowerCase())
      // Auto-select the plan in the form
      const planSelect = document.querySelector('select[name="plan"]') as HTMLSelectElement
      if (planSelect) {
        planSelect.value = planParam.toLowerCase()
        // Trigger change event to update form state
        planSelect.dispatchEvent(new Event("change", { bubbles: true }))
      }
    }
  }, [searchParams])

  // Rest of the component remains the same...
}
