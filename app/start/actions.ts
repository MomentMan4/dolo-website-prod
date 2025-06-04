"use server"

import { createCheckoutSession } from "@/lib/stripe"
import type { PlanType } from "@/lib/stripe"
import { validateEmail, validateRequiredFields } from "@/lib/form-utils"

export interface StartFormData {
  // Customer Information
  name: string
  email: string

  // Project Details
  hasExistingWebsite: boolean
  existingWebsiteUrl?: string
  hasHostingDomain: boolean
  hasLogo: boolean
  logoLink?: string
  websitePurpose: {
    generateLeads: boolean
    provideInformation: boolean
    other: boolean
  }
  otherPurpose?: string
  targetAudience: string
  productsServices: string
  brandingGuidelines: boolean
  competitors?: string
  updates?: string
  keywords?: string

  // Plan Selection
  selectedPlan: PlanType
  rushDelivery: boolean
  addOns: {
    maintenance: boolean
    googleBusiness: boolean
    accessibility: boolean
    privacy: boolean
  }
  yearlyMaintenance: boolean
}

// AGGRESSIVE FIX: Return the redirect URL instead of redirecting directly
export async function handleStartFormSubmission(formData: FormData): Promise<{ redirectUrl: string }> {
  try {
    console.log("=== START FORM SUBMISSION PROCESSING ===")

    // Extract customer data
    const customerData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
    }

    const selectedPlan = formData.get("selectedPlan") as PlanType
    const rushDelivery = formData.get("rushDelivery") === "true"

    console.log("Customer data:", customerData)
    console.log("Selected plan:", selectedPlan)
    console.log("Rush delivery:", rushDelivery)

    // Validate required fields
    const validationError = validateRequiredFields(customerData, ["name", "email"])
    if (validationError) {
      throw new Error(validationError)
    }

    if (!selectedPlan) {
      throw new Error("Plan selection is required")
    }

    // Validate email format
    if (!validateEmail(customerData.email)) {
      throw new Error("Invalid email format")
    }

    // Extract add-ons
    const addOns = {
      maintenance: formData.get("maintenance") === "true",
      googleBusiness: formData.get("googleBusiness") === "true",
      accessibility: formData.get("accessibility") === "true",
      privacy: formData.get("privacy") === "true",
    }

    console.log("Add-ons:", addOns)

    // Create project details object
    const projectDetails = {
      hasExistingWebsite: formData.get("hasExistingWebsite") === "true",
      existingWebsiteUrl: (formData.get("existingWebsiteUrl") as string) || undefined,
      hasHostingDomain: formData.get("hasHostingDomain") === "true",
      hasLogo: formData.get("hasLogo") === "true",
      logoLink: (formData.get("logoLink") as string) || undefined,
      websitePurpose: {
        generateLeads: formData.get("generateLeads") === "true",
        provideInformation: formData.get("provideInformation") === "true",
        other: formData.get("otherPurpose") ? true : false,
      },
      otherPurpose: (formData.get("otherPurpose") as string) || undefined,
      targetAudience: formData.get("targetAudience") as string,
      productsServices: formData.get("productsServices") as string,
      brandingGuidelines: formData.get("brandingGuidelines") === "true",
      competitors: (formData.get("competitors") as string) || undefined,
      updates: (formData.get("updates") as string) || undefined,
      keywords: (formData.get("keywords") as string) || undefined,
      yearlyMaintenance: formData.get("yearlyMaintenance") === "true",
    }

    console.log("Project details extracted")

    // Store initial submission in contact_submissions for backup
    try {
      const { insertToContactSubmissions } = await import("@/lib/simple-form-utils")

      const backupResult = await insertToContactSubmissions({
        name: customerData.name,
        email: customerData.email,
        company: "",
        message: `Start Page Submission - Plan: ${selectedPlan}
Project Details: ${JSON.stringify(projectDetails, null, 2)}
Add-ons: ${JSON.stringify(addOns, null, 2)}
Rush Delivery: ${rushDelivery}`,
        source: "start-page",
      })

      console.log("Start page submission backed up to contact_submissions:", backupResult.id)
    } catch (backupError) {
      console.warn("Failed to backup start page submission:", backupError)
      // Continue with Stripe checkout even if backup fails
    }

    console.log("=== CREATING STRIPE CHECKOUT SESSION ===")

    // Create Stripe checkout session
    const session = await createCheckoutSession(selectedPlan, customerData, {
      rushDelivery,
      addOns: Object.entries(addOns)
        .filter(([_, enabled]) => enabled)
        .map(([key, _]) => key),
      successUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/start`,
      projectDetails,
    })

    if (!session.url) {
      throw new Error("Failed to create checkout session - no URL returned")
    }

    console.log("Stripe checkout session created successfully")
    console.log("Redirect URL:", session.url)

    // AGGRESSIVE FIX: Return the URL instead of redirecting
    return { redirectUrl: session.url }
  } catch (error) {
    console.error("=== ERROR IN START FORM SUBMISSION ===")
    console.error("Error details:", error)
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace")

    // Re-throw the error to be handled by the client
    throw error
  }
}
