import { createRouteHandlerSupabaseClient } from "@/lib/supabase/client"

export async function ensureTablesExist() {
  const supabase = createRouteHandlerSupabaseClient()

  // Check if tables exist
  const tables = ["admin_users", "contact_submissions", "quiz_results", "private_build_applications"]

  const missingTables = []

  for (const table of tables) {
    const { error } = await supabase.from(table).select("count(*)").limit(1).single()

    if (error && error.message.includes("does not exist")) {
      missingTables.push(table)
    }
  }

  // Create missing tables
  if (missingTables.includes("contact_submissions")) {
    await supabase.rpc("create_contact_submissions_table")
  }

  if (missingTables.includes("quiz_results")) {
    await supabase.rpc("create_quiz_results_table")
  }

  if (missingTables.includes("private_build_applications")) {
    await supabase.rpc("create_private_build_applications_table")
  }

  return {
    existingTables: tables.filter((t) => !missingTables.includes(t)),
    createdTables: missingTables,
  }
}
