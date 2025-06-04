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
      customers: {
        Row: {
          id: string
          stripe_customer_id: string
          email: string
          name: string
          company: string | null
          phone: string | null
          chat_access_token: string | null
          chat_access_expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          stripe_customer_id: string
          email: string
          name: string
          company?: string | null
          phone?: string | null
          chat_access_token?: string | null
          chat_access_expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          stripe_customer_id?: string
          email?: string
          name?: string
          company?: string | null
          phone?: string | null
          chat_access_token?: string | null
          chat_access_expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          customer_id: string
          stripe_payment_intent_id: string | null
          project_type: "grow" | "scale" | "premier" | "private-build"
          status: "pending" | "in-progress" | "completed" | "cancelled"
          total_amount: number
          rush_fee_applied: boolean
          add_ons: Record<string, any>
          project_details: Record<string, any>
          started_at: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          stripe_payment_intent_id?: string | null
          project_type: "grow" | "scale" | "premier" | "private-build"
          status?: "pending" | "in-progress" | "completed" | "cancelled"
          total_amount: number
          rush_fee_applied?: boolean
          add_ons?: Record<string, any>
          project_details?: Record<string, any>
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          stripe_payment_intent_id?: string | null
          project_type?: "grow" | "scale" | "premier" | "private-build"
          status?: "pending" | "in-progress" | "completed" | "cancelled"
          total_amount?: number
          rush_fee_applied?: boolean
          add_ons?: Record<string, any>
          project_details?: Record<string, any>
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      contact_submissions: {
        Row: {
          id: string
          name: string
          email: string
          company: string | null
          message: string
          source: string
          status: "new" | "contacted" | "converted" | "closed"
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          company?: string | null
          message: string
          source?: string
          status?: "new" | "contacted" | "converted" | "closed"
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          company?: string | null
          message?: string
          source?: string
          status?: "new" | "contacted" | "converted" | "closed"
          created_at?: string
        }
      }
      email_logs: {
        Row: {
          id: string
          customer_id: string | null
          email_type: string
          recipient_email: string
          subject: string | null
          status: "sent" | "delivered" | "failed"
          resend_message_id: string | null
          sent_at: string
        }
        Insert: {
          id?: string
          customer_id?: string | null
          email_type: string
          recipient_email: string
          subject?: string | null
          status?: "sent" | "delivered" | "failed"
          resend_message_id?: string | null
          sent_at?: string
        }
        Update: {
          id?: string
          customer_id?: string | null
          email_type?: string
          recipient_email?: string
          subject?: string | null
          status?: "sent" | "delivered" | "failed"
          resend_message_id?: string | null
          sent_at?: string
        }
      }
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

// Default export for backward compatibility
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
