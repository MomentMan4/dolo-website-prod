import { createClient as createSupabaseClient } from "@supabase/supabase-js"

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
          budget: string | null
          timeline: string | null
          project_type: string | null
          vision: string | null
          referral_source: string | null
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
          budget?: string | null
          timeline?: string | null
          project_type?: string | null
          vision?: string | null
          referral_source?: string | null
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
          budget?: string | null
          timeline?: string | null
          project_type?: string | null
          vision?: string | null
          referral_source?: string | null
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
      quiz_results: {
        Row: {
          id: string
          email: string
          plan: string
          answers: Record<string, any>
          consent: boolean
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          plan: string
          answers: Record<string, any>
          consent: boolean
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          plan?: string
          answers?: Record<string, any>
          consent?: boolean
          created_at?: string
        }
      }
      private_build_applications: {
        Row: {
          id: string
          name: string
          email: string
          company: string | null
          project_description: string
          budget_range: string
          timeline: string
          status: "new" | "contacted" | "approved" | "rejected"
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          company?: string | null
          project_description: string
          budget_range: string
          timeline: string
          status?: "new" | "contacted" | "approved" | "rejected"
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          company?: string | null
          project_description?: string
          budget_range?: string
          timeline?: string
          status?: "new" | "contacted" | "approved" | "rejected"
          created_at?: string
        }
      }
    }
  }
}

// Create a mock client for when Supabase is not configured
const createMockClient = () => ({
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => Promise.resolve({ data: null, error: null }),
    delete: () => Promise.resolve({ data: null, error: null }),
    eq: function () {
      return this
    },
    order: function () {
      return this
    },
    single: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
  }),
  auth: {
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    signIn: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
    signOut: () => Promise.resolve({ error: null }),
    signInWithPassword: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
  },
})

// Export the createClient function
export function createClient() {
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    // We're in a server environment during build/prerendering
    console.warn("Supabase client requested during server rendering - returning mock")
    return createMockClient() as any
  }

  // We're in a browser environment
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Missing Supabase configuration for browser client")
    return createMockClient() as any
  }

  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
}

// Create server-side Supabase client (for API routes)
export function createRouteHandlerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn("Missing Supabase configuration for route handler client")
    return createMockClient() as any
  }

  return createSupabaseClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

// Create server-side Supabase client (for server components)
export function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Missing Supabase configuration for server client")
    return createMockClient() as any
  }

  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

// Export a singleton instance for client-side use
let browserClient: ReturnType<typeof createClient> | null = null

// Get the browser client (singleton pattern)
export function getBrowserClient() {
  if (typeof window === "undefined") {
    return createMockClient() as any
  }

  if (!browserClient) {
    browserClient = createClient()
  }

  return browserClient
}

// Export configuration check function
export function checkSupabaseConfig() {
  return {
    hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    // Don't log actual keys for security
    anonKeyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
    serviceKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
  }
}
