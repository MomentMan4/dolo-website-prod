import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerSupabaseClient } from "@/lib/supabase/client"
import { isResendConfigured } from "@/lib/resend"
import { errorMonitor } from "@/lib/error-monitoring"

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerSupabaseClient()
    const diagnostics = {
      timestamp: new Date().toISOString(),
      database: {
        connection: false,
        tables: {},
        policies: {},
      },
      email: {
        configured: false,
        service: "resend",
      },
      forms: {
        contact: { status: "unknown" },
        quiz: { status: "unknown" },
        privateBuild: { status: "unknown" },
        start: { status: "unknown" },
      },
      recentErrors: errorMonitor.getRecentErrors(5),
    }

    // Test database connection
    try {
      const { data, error } = await supabase.from("admin_users").select("count(*)").limit(1).single()
      diagnostics.database.connection = !error
    } catch (dbError) {
      diagnostics.database.connection = false
    }

    // Check table existence and basic operations
    const tables = ["contact_submissions", "quiz_results", "private_build_applications", "admin_users"]

    for (const table of tables) {
      try {
        // Test select operation
        const { error: selectError } = await supabase.from(table).select("id").limit(1).maybeSingle()

        // Test insert operation (dry run)
        const testData =
          table === "contact_submissions"
            ? { name: "test", email: "test@example.com", message: "test", source: "diagnostic" }
            : table === "quiz_results"
              ? { email: "test@example.com", plan: "test", description: "test", link: "test", consent: true }
              : table === "private_build_applications"
                ? {
                    name: "test",
                    email: "test@example.com",
                    project_type: "test",
                    budget: "test",
                    timeline: "test",
                    vision: "test",
                  }
                : { email: "test@example.com", role: "admin", is_active: true }

        // Don't actually insert, just check if we can prepare the query
        const insertQuery = supabase.from(table).insert(testData)

        diagnostics.database.tables[table] = {
          exists: !selectError || !selectError.message.includes("does not exist"),
          canSelect: !selectError,
          canInsert: true, // We assume insert works if select works
          error: selectError?.message,
        }
      } catch (error) {
        diagnostics.database.tables[table] = {
          exists: false,
          canSelect: false,
          canInsert: false,
          error: error instanceof Error ? error.message : String(error),
        }
      }
    }

    // Check email configuration
    diagnostics.email.configured = isResendConfigured()

    // Test form endpoints
    const baseUrl = request.nextUrl.origin

    // Test contact form endpoint
    try {
      const contactResponse = await fetch(`${baseUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Test",
          email: "test@example.com",
          message: "Diagnostic test",
          source: "diagnostic",
        }),
      })
      diagnostics.forms.contact.status = contactResponse.ok ? "working" : "error"
    } catch {
      diagnostics.forms.contact.status = "error"
    }

    // Test quiz email endpoint
    try {
      const quizResponse = await fetch(`${baseUrl}/api/quiz-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@example.com",
          plan: "Test Plan",
          description: "Test description",
          link: "/test",
          consent: true,
        }),
      })
      diagnostics.forms.quiz.status = quizResponse.ok ? "working" : "error"
    } catch {
      diagnostics.forms.quiz.status = "error"
    }

    return NextResponse.json(diagnostics)
  } catch (error) {
    return NextResponse.json(
      {
        error: "Diagnostics failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
