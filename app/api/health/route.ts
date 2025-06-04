import { NextResponse } from "next/server"
import { checkSupabaseConfig } from "@/lib/supabase/client"
import { isResendConfigured } from "@/lib/resend"

export async function GET() {
  try {
    const supabaseConfig = checkSupabaseConfig()
    const resendConfigured = isResendConfigured()

    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        supabase: {
          configured: supabaseConfig.hasUrl && supabaseConfig.hasAnonKey,
          hasUrl: supabaseConfig.hasUrl,
          hasAnonKey: supabaseConfig.hasAnonKey,
          hasServiceKey: supabaseConfig.hasServiceKey,
        },
        resend: {
          configured: resendConfigured,
        },
        stripe: {
          configured: !!process.env.STRIPE_SECRET_KEY,
        },
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasSiteUrl: !!process.env.NEXT_PUBLIC_SITE_URL,
      },
    }

    return NextResponse.json(health)
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
