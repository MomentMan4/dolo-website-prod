import { createClient } from "@supabase/supabase-js"
import type { Database } from "./client"

// This file is specifically for App Router server components that need cookies
// It should only be imported in App Router server components, not in shared utilities

export function createServerSupabaseClientWithCookies() {
  if (typeof window !== "undefined") {
    throw new Error("createServerSupabaseClientWithCookies should only be used server-side")
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase configuration")
  }

  // Only import cookies when actually needed in App Router
  const { cookies } = require("next/headers")
  const cookieStore = cookies()

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
    },
  })
}
