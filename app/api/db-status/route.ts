import { NextResponse } from "next/server"
import { createRouteHandlerSupabaseClient } from "@/lib/supabase/client"

export async function GET() {
  try {
    const supabase = createRouteHandlerSupabaseClient()

    // Check tables exist
    const { data: tables, error: tablesError } = await supabase.rpc("get_tables")

    if (tablesError) {
      return NextResponse.json({ error: "Failed to query database tables", details: tablesError }, { status: 500 })
    }

    // Check admin users
    const { data: adminUsers, error: adminError } = await supabase
      .from("admin_users")
      .select("id, email, role")
      .limit(5)

    if (adminError) {
      return NextResponse.json({ error: "Failed to query admin users", details: adminError }, { status: 500 })
    }

    // Check contact submissions
    const { count: contactCount, error: contactError } = await supabase
      .from("contact_submissions")
      .select("*", { count: "exact", head: true })

    if (contactError) {
      return NextResponse.json({ error: "Failed to query contact submissions", details: contactError }, { status: 500 })
    }

    // Check customers
    const { count: customerCount, error: customerError } = await supabase
      .from("customers")
      .select("*", { count: "exact", head: true })

    if (customerError) {
      return NextResponse.json({ error: "Failed to query customers", details: customerError }, { status: 500 })
    }

    // Check projects
    const { count: projectCount, error: projectError } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true })

    if (projectError) {
      return NextResponse.json({ error: "Failed to query projects", details: projectError }, { status: 500 })
    }

    // Check email logs
    const { count: emailCount, error: emailError } = await supabase
      .from("email_logs")
      .select("*", { count: "exact", head: true })

    if (emailError) {
      return NextResponse.json({ error: "Failed to query email logs", details: emailError }, { status: 500 })
    }

    return NextResponse.json({
      status: "Database connected and operational",
      tables: tables || [],
      adminUsers: adminUsers?.length || 0,
      contactSubmissions: contactCount || 0,
      customers: customerCount || 0,
      projects: projectCount || 0,
      emailLogs: emailCount || 0,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Database status check error:", error)
    return NextResponse.json({ error: "Failed to check database status", details: String(error) }, { status: 500 })
  }
}
