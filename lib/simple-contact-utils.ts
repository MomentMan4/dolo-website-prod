import { createRouteHandlerSupabaseClient } from "@/lib/supabase/client"

export interface ContactSubmissionData {
  name: string
  email: string
  company?: string | null
  message: string
  source: string
}

export async function insertToContactSubmissions(data: ContactSubmissionData) {
  const supabase = createRouteHandlerSupabaseClient()

  try {
    const { data: result, error } = await supabase
      .from("contact_submissions")
      .insert({
        name: data.name,
        email: data.email,
        company: data.company,
        message: data.message,
        source: data.source,
        status: "new",
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Contact submissions insertion failed:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    return result
  } catch (error) {
    console.error("Contact submission exception:", error)
    throw error
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
