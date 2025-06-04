import { createClient } from "@supabase/supabase-js"

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string
          email: string
          name: string
          role: "super_admin" | "admin" | "viewer"
          avatar_url: string | null
          last_login: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role?: "super_admin" | "admin" | "viewer"
          avatar_url?: string | null
          last_login?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: "super_admin" | "admin" | "viewer"
          avatar_url?: string | null
          last_login?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      // Other tables...
    }
  }
}

// Get environment variables with validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Validate required environment variables
if (!supabaseUrl) {
  console.warn("Missing Supabase URL. Some features may not work correctly.")
}

if (!supabaseAnonKey && !supabaseServiceKey) {
  console.warn("Missing Supabase API key. Some features may not work correctly.")
}

// Create client-side Supabase client (for browser)
export function createBrowserSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Missing Supabase configuration for browser client")
    // Return a mock client to prevent crashes
    return {
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: null }),
        update: () => Promise.resolve({ data: null, error: null }),
        delete: () => Promise.resolve({ data: null, error: null }),
      }),
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        signIn: () => Promise.resolve({ data: null, error: null }),
        signOut: () => Promise.resolve({ error: null }),
        signInWithPassword: () => Promise.resolve({ data: null, error: null }),
      },
    } as any
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
}

// Create server-side Supabase client (for API routes)
export function createRouteHandlerSupabaseClient() {
  if (!supabaseUrl) {
    console.warn("Missing Supabase URL for server client")
    return null
  }

  // Prefer service role key for server operations, fallback to anon key
  const apiKey = supabaseServiceKey || supabaseAnonKey

  if (!apiKey) {
    console.warn("Missing API key for server client")
    return null
  }

  return createClient<Database>(supabaseUrl, apiKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

// Create admin Supabase client (with service role key)
export function createAdminSupabaseClient() {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn("Missing configuration for admin client")
    return null
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

// Export a pre-initialized client for client-side use
export const supabase = createBrowserSupabaseClient()

// Export configuration check function
export function checkSupabaseConfig() {
  return {
    hasUrl: !!supabaseUrl,
    hasAnonKey: !!supabaseAnonKey,
    hasServiceKey: !!supabaseServiceKey,
    url: supabaseUrl,
    // Don't log actual keys for security
    anonKeyLength: supabaseAnonKey?.length || 0,
    serviceKeyLength: supabaseServiceKey?.length || 0,
  }
}

// Default export for backward compatibility
export default supabase
