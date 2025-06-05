import { createRouteHandlerSupabaseClient } from "@/lib/supabase/client"

export async function requireRole(allowedRoles: string[]) {
  const supabase = createRouteHandlerSupabaseClient()

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("Authentication required")
  }

  // Check if user exists in admin_users table
  const { data: adminUser, error: adminError } = await supabase
    .from("admin_users")
    .select("*")
    .eq("email", user.email)
    .eq("is_active", true)
    .single()

  if (adminError || !adminUser) {
    throw new Error("User not authorized")
  }

  // Check if user has required role
  if (!allowedRoles.includes(adminUser.role)) {
    throw new Error(`Role ${adminUser.role} not authorized. Required: ${allowedRoles.join(", ")}`)
  }

  return { user, adminUser }
}
