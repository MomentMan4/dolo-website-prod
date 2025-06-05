import { createRouteHandlerSupabaseClient } from "@/lib/supabase/client"

export interface FormSubmissionResult {
  success: boolean
  data?: any
  error?: string
  fallbackUsed?: boolean
  table?: string
}

export interface ContactSubmissionData {
  name: string
  email: string
  company?: string
  message: string
  source: string
}

export interface PrivateBuildData {
  name: string
  email: string
  company?: string
  project_type: string
  budget: string
  timeline: string
  vision: string
  referral_source?: string
}

export interface QuizResultData {
  email: string
  plan: string
  description: string
  link: string
  consent: boolean
}

/**
 * Safely submit data to the database with fallback mechanisms
 */
export async function safeSubmitToDatabase<T extends Record<string, any>>(
  primaryTable: string,
  fallbackTable: string,
  data: T,
  transformForFallback?: (data: T) => any,
): Promise<FormSubmissionResult> {
  const supabase = createRouteHandlerSupabaseClient()

  try {
    // For contact_submissions, always use direct insertion (like Private Build)
    if (primaryTable === "contact_submissions" || fallbackTable === "contact_submissions") {
      // Ensure message field is never null for contact_submissions
      const contactData = {
        ...data,
        message: data.message || (data.vision ? `Application details: ${data.vision}` : "No message provided"),
        created_at: new Date().toISOString(),
        status: "new",
      }

      const { data: result, error } = await supabase.from("contact_submissions").insert(contactData).select().single()

      if (error) {
        console.error(`Contact submissions insertion failed:`, error)
        return {
          success: false,
          error: `Database error: ${error.message}`,
        }
      }

      return {
        success: true,
        data: result,
        table: "contact_submissions",
      }
    }

    // For other tables, try primary first, then fallback
    const { data: result, error: primaryError } = await supabase
      .from(primaryTable)
      .insert({
        ...data,
        created_at: new Date().toISOString(),
        status: "new",
      })
      .select()
      .single()

    if (!primaryError && result) {
      return {
        success: true,
        data: result,
        table: primaryTable,
      }
    }

    console.warn(`Primary table ${primaryTable} insertion failed:`, primaryError?.message)

    // Fallback to contact_submissions with transformed data
    const fallbackData = transformForFallback ? transformForFallback(data) : data

    // Ensure message field is never null for fallback
    const safeContactData = {
      ...fallbackData,
      message:
        fallbackData.message ||
        (fallbackData.vision ? `Application details: ${fallbackData.vision}` : "No message provided from fallback"),
      created_at: new Date().toISOString(),
      status: "new",
    }

    const { data: fallbackResult, error: fallbackError } = await supabase
      .from("contact_submissions")
      .insert(safeContactData)
      .select()
      .single()

    if (fallbackError) {
      console.error(`Fallback insertion failed:`, fallbackError)
      return {
        success: false,
        error: `Failed to save: ${fallbackError.message}`,
      }
    }

    return {
      success: true,
      data: fallbackResult,
      fallbackUsed: true,
      table: "contact_submissions",
    }
  } catch (error) {
    console.error("Database submission error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown database error",
    }
  }
}

/**
 * Submit contact form data - direct insertion like Private Build
 */
export async function submitContactForm(data: ContactSubmissionData): Promise<FormSubmissionResult> {
  const supabase = createRouteHandlerSupabaseClient()

  try {
    // Ensure message is never null
    const safeMessage = data.message || "No message provided"

    const { data: result, error } = await supabase
      .from("contact_submissions")
      .insert({
        name: data.name,
        email: data.email,
        company: data.company || null,
        message: safeMessage,
        source: data.source || "website",
        status: "new",
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Contact form submission error:", error)
      return {
        success: false,
        error: `Failed to save contact form: ${error.message}`,
      }
    }

    return {
      success: true,
      data: result,
      table: "contact_submissions",
    }
  } catch (error) {
    console.error("Contact form submission exception:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Submit private build application
 */
export async function submitPrivateBuildApplication(data: PrivateBuildData): Promise<FormSubmissionResult> {
  return safeSubmitToDatabase("private_build_applications", "contact_submissions", data, (privateBuildData) => ({
    name: privateBuildData.name,
    email: privateBuildData.email,
    company: privateBuildData.company || "Not provided",
    message: `Private Build Application:
Project Type: ${privateBuildData.project_type || "Not specified"}
Budget: ${privateBuildData.budget || "Not specified"}
Timeline: ${privateBuildData.timeline || "Not specified"}
Vision: ${privateBuildData.vision || "Not provided"}
Referral Source: ${privateBuildData.referral_source || "Not provided"}`,
    source: "private-build",
  }))
}

/**
 * Submit quiz result - try quiz_results first, then contact_submissions
 */
export async function submitQuizResult(data: QuizResultData): Promise<FormSubmissionResult> {
  const supabase = createRouteHandlerSupabaseClient()

  try {
    // First try quiz_results table if it exists
    const { data: quizResult, error: quizError } = await supabase
      .from("quiz_results")
      .insert({
        email: data.email,
        plan: data.plan,
        description: data.description,
        link: data.link,
        consent: data.consent,
        status: "new",
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (!quizError && quizResult) {
      return {
        success: true,
        data: quizResult,
        table: "quiz_results",
      }
    }

    console.warn("Quiz results table insertion failed, using contact_submissions:", quizError?.message)

    // Fallback to contact_submissions (direct insertion like Private Build)
    const quizMessage = `Quiz Result: ${data.plan || "Not specified"}
Description: ${data.description || "Not provided"}
Link: ${data.link || "Not provided"}
Consent: ${data.consent}`

    const { data: contactResult, error: contactError } = await supabase
      .from("contact_submissions")
      .insert({
        name: data.email.split("@")[0] || "Quiz User",
        email: data.email,
        company: null,
        message: quizMessage,
        source: "quiz",
        status: "new",
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (contactError) {
      console.error("Contact submissions fallback failed:", contactError)
      return {
        success: false,
        error: `Failed to save quiz result: ${contactError.message}`,
      }
    }

    return {
      success: true,
      data: contactResult,
      fallbackUsed: true,
      table: "contact_submissions",
    }
  } catch (error) {
    console.error("Quiz result submission exception:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate required fields
 */
export function validateRequiredFields(data: Record<string, any>, requiredFields: string[]): string | null {
  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === "string" && data[field].trim() === "")) {
      return `${field} is required`
    }
  }
  return null
}
