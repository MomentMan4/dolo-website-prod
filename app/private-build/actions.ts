"use server"

import { sendEmail, isResendConfigured } from "@/lib/resend"
import { submitPrivateBuildApplication, validateEmail, validateRequiredFields } from "@/lib/form-utils"

export async function submitPrivateBuildForm(formData: FormData) {
  try {
    // Extract form data
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      company: formData.get("company") as string,
      projectType: formData.get("projectType") as string,
      budget: formData.get("budget") as string,
      timeline: formData.get("timeline") as string,
      vision: formData.get("vision") as string,
      referralSource: formData.get("referralSource") as string,
    }

    // Validate required fields
    const requiredFields = ["name", "email", "projectType", "budget", "timeline", "vision"]
    const validationError = validateRequiredFields(data, requiredFields)
    if (validationError) {
      throw new Error(validationError)
    }

    // Validate email format
    if (!validateEmail(data.email)) {
      throw new Error("Invalid email format")
    }

    // Ensure vision is not empty
    if (!data.vision || data.vision.trim() === "") {
      data.vision = "No vision provided"
    }

    // Submit to database with fallback
    const result = await submitPrivateBuildApplication(data)

    if (!result.success) {
      throw new Error(result.error || "Failed to save application")
    }

    console.log(`Private build application saved to ${result.table}`, {
      id: result.data?.id,
      fallbackUsed: result.fallbackUsed,
    })

    // Send notification emails if Resend is configured
    if (isResendConfigured()) {
      try {
        // Send notification to admin
        const adminEmailResult = await sendEmail("private-build-application", "hello@dolobuilds.com", {
          name: data.name,
          email: data.email,
          company: data.company || "Not provided",
          projectType: data.projectType,
          budget: data.budget,
          timeline: data.timeline,
          vision: data.vision,
          referralSource: data.referralSource || "Not provided",
          applicationId: result.data?.id || "N/A",
          submissionDate: new Date().toLocaleDateString(),
        })

        // Send confirmation to user
        const userEmailResult = await sendEmail("private-build-confirmation", data.email, {
          name: data.name,
          projectType: data.projectType,
          budget: data.budget,
          timeline: data.timeline,
          applicationId: result.data?.id || "N/A",
        })

        console.log("Private build emails sent successfully", {
          adminEmail: adminEmailResult.success,
          userEmail: userEmailResult.success,
        })
      } catch (emailError) {
        console.error("Email sending error:", emailError)
        // Don't fail the form submission if email fails
      }
    } else {
      console.warn("Resend not configured - emails not sent")
    }

    return {
      success: true,
      applicationId: result.data?.id,
      table: result.table,
      fallbackUsed: result.fallbackUsed,
    }
  } catch (error) {
    console.error("Private build form submission error:", error)
    throw error
  }
}
