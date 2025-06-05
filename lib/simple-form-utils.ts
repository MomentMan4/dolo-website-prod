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

export async function insertContactSubmission(data: {
  name: string
  email: string
  message: string
  budget?: string
}) {
  const supabase = createRouteHandlerSupabaseClient()

  try {
    const { data: result, error } = await supabase
      .from("contact_submissions")
      .insert([
        {
          name: data.name.trim(),
          email: data.email.trim(),
          message: data.message.trim(),
          budget: data.budget?.trim() || null,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      throw error
    }

    return {
      data: result,
      table: "contact_submissions",
      fallbackUsed: false,
    }
  } catch (error) {
    console.error("Failed to insert contact submission:", error)
    throw error
  }
}

export async function insertQuizResult(data: {
  email: string
  plan: string
  description: string
  link: string
  consent: boolean
}) {
  const supabase = createRouteHandlerSupabaseClient()

  try {
    const { data: result, error } = await supabase
      .from("quiz_results")
      .insert([
        {
          email: data.email.trim(),
          plan: data.plan.trim(),
          description: data.description.trim(),
          link: data.link.trim(),
          consent: data.consent,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      throw error
    }

    return {
      data: result,
      table: "quiz_results",
      fallbackUsed: false,
    }
  } catch (error) {
    console.error("Failed to insert quiz result:", error)
    throw error
  }
}

export async function insertPrivateBuildApplication(data: {
  name: string
  email: string
  project_type: string
  budget: string
  timeline: string
  vision: string
}) {
  const supabase = createRouteHandlerSupabaseClient()

  try {
    const { data: result, error } = await supabase
      .from("private_build_applications")
      .insert([
        {
          name: data.name.trim(),
          email: data.email.trim(),
          project_type: data.project_type.trim(),
          budget: data.budget.trim(),
          timeline: data.timeline.trim(),
          vision: data.vision.trim(),
          status: "pending",
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      throw error
    }

    return {
      data: result,
      table: "private_build_applications",
      fallbackUsed: false,
    }
  } catch (error) {
    console.error("Failed to insert private build application:", error)
    throw error
  }
}
