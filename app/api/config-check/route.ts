import { NextResponse } from "next/server"
import { checkSupabaseConfig } from "@/lib/supabase/client"

export async function GET() {
  try {
    const supabaseConfig = checkSupabaseConfig()

    return NextResponse.json({
      success: true,
      supabase: supabaseConfig,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasResendKey: !!process.env.RESEND_API_KEY,
        hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
        hasSiteUrl: !!process.env.NEXT_PUBLIC_SITE_URL,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
