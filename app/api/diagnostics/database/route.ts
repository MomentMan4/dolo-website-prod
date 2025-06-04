import { NextResponse } from "next/server"
import { createRouteHandlerSupabaseClient } from "@/lib/supabase/client"
import { requireRole } from "@/lib/auth"

export async function GET() {
  try {
    // Check authentication first
    try {
      await requireRole(["super_admin", "admin"])
    } catch (authError) {
      return NextResponse.json(
        {
          error: "Authentication required",
          details: authError instanceof Error ? authError.message : String(authError),
        },
        { status: 401 },
      )
    }

    const supabase = createRouteHandlerSupabaseClient()
    const diagnostics: Record<string, any> = {}

    // Test database connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from("admin_users")
      .select("count(*)")
      .single()

    diagnostics.connection = {
      status: connectionError ? "error" : "success",
      error: connectionError ? connectionError.message : null,
      details: connectionTest || null,
    }

    // Check tables existence
    const tables = [
      "admin_users",
      "customers",
      "projects",
      "contact_submissions",
      "email_logs",
      "quiz_results",
      "private_build_applications",
    ]

    diagnostics.tables = {}

    for (const table of tables) {
      const { data, error } = await supabase.from(table).select("count(*)").single()

      diagnostics.tables[table] = {
        exists: !error || !error.message.includes("does not exist"),
        error: error ? error.message : null,
        count: data ? data.count : null,
      }
    }

    // Check RLS policies
    diagnostics.policies = {}

    // Get current user email for policy testing
    const {
      data: { user },
    } = await supabase.auth.getUser()
    diagnostics.currentUser = user ? { email: user.email } : null

    // Test admin_users policy
    if (diagnostics.tables.admin_users.exists) {
      const { data: adminData, error: adminError } = await supabase.from("admin_users").select("*").limit(1)

      diagnostics.policies.admin_users = {
        canRead: !adminError && adminData && adminData.length > 0,
        error: adminError ? adminError.message : null,
      }
    }

    // Test private_build_applications policy if it exists
    if (diagnostics.tables.private_build_applications?.exists) {
      const { data: pbData, error: pbError } = await supabase.from("private_build_applications").select("*").limit(1)

      diagnostics.policies.private_build_applications = {
        canRead: !pbError && pbData !== null,
        error: pbError ? pbError.message : null,
      }

      // Test insert permission
      const testData = {
        name: "Test User",
        email: "test@example.com",
        project_type: "Test",
        budget: "Test",
        timeline: "Test",
        vision: "Test",
        status: "test",
        created_at: new Date().toISOString(),
      }

      const { data: insertData, error: insertError } = await supabase
        .from("private_build_applications")
        .insert(testData)
        .select()
        .single()

      diagnostics.policies.private_build_applications.canInsert = !insertError
      diagnostics.policies.private_build_applications.insertError = insertError ? insertError.message : null

      // Clean up test data if inserted
      if (insertData?.id) {
        await supabase.from("private_build_applications").delete().eq("id", insertData.id)
      }
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      diagnostics,
    })
  } catch (error) {
    console.error("Diagnostics error:", error)
    return NextResponse.json(
      { error: "Diagnostics failed", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
