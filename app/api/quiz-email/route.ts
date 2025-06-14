import { type NextRequest, NextResponse } from "next/server"
import { sendEmail, isResendConfigured } from "@/lib/resend"
import { insertQuizResult, validateEmail, validateRequiredFields } from "@/lib/simple-form-utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, plan, description, link, consent } = body

    // Validate required fields
    const validationError = validateRequiredFields(body, ["email", "plan", "description", "link"])
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 })
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Check consent
    if (!consent) {
      return NextResponse.json({ error: "Consent is required" }, { status: 400 })
    }

    // Insert quiz result (same approach as Private Build)
    const result = await insertQuizResult({
      email,
      plan,
      description,
      link,
      consent,
    })

    console.log(`Quiz result saved to ${result.table}:`, result.data.id)

    // Send quiz result email if Resend is configured
    let emailSent = false
    if (isResendConfigured()) {
      try {
        const emailResult = await sendEmail("quiz-result", email, {
          plan,
          description,
          link,
          name: email.split("@")[0], // Extract name from email
        })
        emailSent = emailResult.success
        console.log("Quiz result email sent successfully")
      } catch (emailError) {
        console.error("Email sending error:", emailError)
      }
    } else {
      console.warn("Resend not configured - email not sent")
    }

    return NextResponse.json({
      success: true,
      message: emailSent ? "Quiz result sent successfully" : "Quiz result saved (email service not available)",
      quizResultId: result.data.id,
      emailSent,
      table: result.table,
      fallbackUsed: result.fallbackUsed,
    })
  } catch (error) {
    console.error("Quiz email API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
