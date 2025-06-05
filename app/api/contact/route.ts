import { type NextRequest, NextResponse } from "next/server"
import { sendEmail, isResendConfigured } from "@/lib/resend"
import { insertToContactSubmissions } from "@/lib/simple-contact-utils"

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const requestId = Math.random().toString(36).substring(7)

  console.log(`=== CONTACT API [${requestId}]: Request received ===`)

  try {
    // Parse JSON body
    const body = await request.json()
    console.log("Parsed body:", body)

    const { name, email, message, company, source } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          requestId,
        },
        { status: 400 },
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          error: "Invalid email format",
          requestId,
        },
        { status: 400 },
      )
    }

    // Save to database
    console.log(`=== CONTACT API [${requestId}]: Saving to database ===`)
    let submissionResult

    try {
      submissionResult = await insertToContactSubmissions({
        name,
        email,
        company: company || null,
        message,
        source: source || "contact-form",
      })
      console.log(`Database save successful [${requestId}]:`, submissionResult.id)
    } catch (dbError) {
      console.error(`Database error [${requestId}]:`, dbError)

      // Use fallback like the quiz does
      submissionResult = {
        id: `fallback_${requestId}`,
        created_at: new Date().toISOString(),
        name,
        email,
        company,
        message,
        source,
      }
    }

    // Send notification email
    let emailSent = false
    if (isResendConfigured()) {
      try {
        const emailResult = await sendEmail("contact-notification", "hello@dolobuilds.com", {
          name,
          email,
          company: company || "Not provided",
          message,
          source: source || "contact-form",
          submissionId: submissionResult.id,
          submissionDate: submissionResult.created_at,
          fileCount: 0,
        })
        emailSent = emailResult.success
      } catch (emailError) {
        console.error(`Email error [${requestId}]:`, emailError)
        // Don't fail the submission if email fails
      }
    }

    const processingTime = Date.now() - startTime
    console.log(`=== CONTACT API [${requestId}]: Success (${processingTime}ms) ===`)

    return NextResponse.json({
      success: true,
      requestId,
      message: "Contact form submitted successfully",
      details: {
        submissionId: submissionResult.id,
        emailSent,
        processingTimeMs: processingTime,
      },
    })
  } catch (error) {
    const processingTime = Date.now() - startTime
    console.error(`=== CONTACT API [${requestId}]: Error (${processingTime}ms) ===`, error)

    return NextResponse.json(
      {
        error: "Internal server error",
        requestId,
        details: {
          message: "An error occurred while processing your request",
          processingTimeMs: processingTime,
        },
      },
      { status: 500 },
    )
  }
}
