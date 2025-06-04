import { createRouteHandlerSupabaseClient, createBrowserSupabaseClient } from "@/lib/supabase/client"

export async function getUser() {
  try {
    const supabase = createRouteHandlerSupabaseClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      console.error("Error getting user:", error)
      return null
    }

    return user
  } catch (error) {
    console.error("Error in getUser:", error)
    return null
  }
}

export async function isAdmin(userId: string): Promise<boolean> {
  try {
    const supabase = createRouteHandlerSupabaseClient()

    const { data, error } = await supabase
      .from("admin_users")
      .select("id")
      .eq("user_id", userId)
      .eq("is_active", true)
      .single()

    if (error) {
      console.error("Error checking admin status:", error)
      return false
    }

    return !!data
  } catch (error) {
    console.error("Error in isAdmin:", error)
    return false
  }
}

export async function signInWithEmail(email: string, password: string) {
  try {
    const supabase = createBrowserSupabaseClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error("Error signing in:", error)
    throw error
  }
}

export async function signOut() {
  try {
    const supabase = createBrowserSupabaseClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw error
    }
  } catch (error) {
    console.error("Error signing out:", error)
    throw error
  }
}
