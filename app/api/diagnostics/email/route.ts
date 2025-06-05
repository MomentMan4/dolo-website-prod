import { type NextRequest, NextResponse } from "next/server"
import { sendEmail, isResendConfigured } from "@/lib/resend"

export async function GET(request: NextRequest) {
  try {
    // Check if Resend is configured
    const isConfigured = isResendConfigured()

    if (!isConfigured) {
      return NextResponse.json({
        status: "error",
        message: "Resend email service is not configured",
        details: {
          hasApiKey: !!process.env.RESEND_API_KEY,
          apiKeyLength: process.env.RESEND_API_KEY?.length || 0,
        },
      })
    }

    return NextResponse.json({
      status: "success",
      message: "Email service is configured and ready",
      details: {
        hasApiKey: true,
        apiKeyLength: process.env.RESEND_API_KEY?.length || 0,
      },
    })
  } catch (error) {
    console.error("Email diagnostics error:", error)
    return NextResponse.json({
      status: "error",
      message: "Failed to check email service",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        {
          status: "error",
          message: "Email address is required",
        },
        { status: 400 },
      )
    }

    // Send test email
    const result = await sendEmail("payment-confirmation", email, {
      customerName: "Test User",
      projectType: "Essential Plan",
      amount: "499.99",
      rushDelivery: false,
      projectId: "TEST-" + Date.now(),
    })

    return NextResponse.json({
      status: result.success ? "success" : "error",
      message: result.success ? "Test email sent successfully" : "Failed to send test email",
      details: {
        messageId: result.messageId,
        error: result.error,
      },
    })
  } catch (error) {
    console.error("Test email error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to send test email",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
