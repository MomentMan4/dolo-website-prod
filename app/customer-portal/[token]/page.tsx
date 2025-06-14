import { CustomerPortal } from "@/components/customer-portal"
import { createClient } from "@supabase/supabase-js"
import { notFound, redirect } from "next/navigation"

interface CustomerPortalPageProps {
  params: {
    token: string
  }
}

export default async function CustomerPortalPage({ params }: CustomerPortalPageProps) {
  const { token } = params

  if (!token) {
    notFound()
  }

  // Create Supabase client for server-side operations
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const { data: customer, error } = await supabase
    .from("customers")
    .select("*")
    .eq("chat_access_token", token)
    .eq("is_active", true)
    .single()

  if (error || !customer) {
    // Invalid token
    redirect("/contact?error=invalid-access")
  }

  // Check if token is expired
  const now = new Date()
  const expiresAt = new Date(customer.chat_access_expires_at)

  if (now > expiresAt) {
    // Token expired
    redirect("/contact?error=access-expired")
  }

  return <CustomerPortal customer={customer} />
}

export async function generateMetadata({ params }: CustomerPortalPageProps) {
  return {
    title: "Customer Portal - Dolo",
    description: "Priority customer support portal",
    robots: "noindex, nofollow", // Prevent search engine indexing
  }
}
