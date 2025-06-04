import { createRouteHandlerSupabaseClient } from "@/lib/supabase/client"

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateRequiredFields(data: Record<string, any>, requiredFields: string[]): string | null {
  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === "string" && data[field].trim() === "")) {
      return `${field} is required`
    }
  }
  return null
}

export async function insertToContactSubmissions(data: {
  name: string
  email: string
  company: string | null
  message: string
  source: string
}) {
  console.log("=== INSERTING TO CONTACT SUBMISSIONS ===")
  console.log("Data to insert:", data)

  const supabase = createRouteHandlerSupabaseClient()

  if (!supabase) {
    console.warn("Supabase client not available - using fallback")
    // Return a mock response to prevent crashes during deployment
    return {
      id: `mock_${Date.now()}`,
      created_at: new Date().toISOString(),
      ...data,
    }
  }

  try {
    const { data: result, error } = await supabase
      .from("contact_submissions")
      .insert([
        {
          name: data.name,
          email: data.email,
          company: data.company,
          message: data.message,
          source: data.source,
          status: "new",
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Supabase insertion error:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    console.log("Successfully inserted to contact_submissions:", result.id)
    return result
  } catch (error) {
    console.error("Error inserting to contact_submissions:", error)
    throw error
  }
}
