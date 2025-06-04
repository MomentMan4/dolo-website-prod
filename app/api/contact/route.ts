import { type NextRequest, NextResponse } from "next/server"
import { sendEmail, isResendConfigured } from "@/lib/resend"
import { insertToContactSubmissions } from "@/lib/simple-form-utils"
import { validateContactForm, type ValidationResult } from "@/lib/form-validation"

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const requestId = Math.random().toString(36).substring(7)

  console.log(`=== CONTACT API [${requestId}]: Request received ===`)
  console.log("Timestamp:", new Date().toISOString())
  console.log("URL:", request.url)
  console.log("Method:", request.method)

  try {
    // Step 1: Check content type
    const contentType = request.headers.get("content-type") || ""
    console.log(`Content-Type: ${contentType}`)

    if (!contentType.includes("application/json")) {
      console.error(`Unsupported content type: ${contentType}`)
      return NextResponse.json(
        {
          error: "Unsupported content type",
          requestId,
          details: {
            received: contentType,
            expected: "application/json",
            message: "Contact form only accepts JSON submissions",
          },
        },
        { status: 400 },
      )
    }

    // Step 2: Parse JSON body
    console.log(`=== CONTACT API [${requestId}]: Parsing JSON body ===`)
    let body: Record<string, any>

    try {
      const textBody = await request.text()
      console.log("Raw body length:", textBody.length)

      if (!textBody.trim()) {
        throw new Error("Empty request body")
      }

      body = JSON.parse(textBody)
      console.log("Parsed body keys:", Object.keys(body))
    } catch (parseError) {
      console.error(`JSON parsing failed [${requestId}]:`, parseError)
      return NextResponse.json(
        {
          error: "Invalid JSON format",
          requestId,
          details: {
            message: parseError instanceof Error ? parseError.message : String(parseError),
            timestamp: new Date().toISOString(),
          },
        },
        { status: 400 },
      )
    }

    // Step 3: Validate the data
    console.log(`=== CONTACT API [${requestId}]: Validating data ===`)
    const validation: ValidationResult = validateContactForm(body)

    if (!validation.isValid) {
      console.error(`Validation failed [${requestId}]:`, validation.errors)

      return NextResponse.json(
        {
          error: "Validation failed",
          requestId,
          details: {
            errors: validation.errors,
            warnings: validation.warnings,
            receivedFields: Object.keys(body),
          },
        },
        { status: 400 },
      )
    }

    // Step 4: Process the validated data
    console.log(`=== CONTACT API [${requestId}]: Processing submission ===`)
    const { name, email, company, message, source } = validation.sanitizedData

    // Step 5: Save to database with error handling
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

      // Continue with email even if database fails during deployment
      submissionResult = {
        id: `fallback_${requestId}`,
        created_at: new Date().toISOString(),
        name,
        email,
        company,
        message,
        source,
      }
      console.warn(`Using fallback submission result [${requestId}]`)
    }

    // Step 6: Send notification email
    console.log(`=== CONTACT API [${requestId}]: Sending notification email ===`)
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
        console.log(`Email result [${requestId}]:`, emailResult.success ? "sent" : "failed")
      } catch (emailError) {
        console.error(`Email error [${requestId}]:`, emailError)
        // Don't fail the submission if email fails
      }
    } else {
      console.warn(`Resend not configured [${requestId}] - notification email not sent`)
    }

    // Step 7: Return success response
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
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    const processingTime = Date.now() - startTime
    console.error(`=== CONTACT API [${requestId}]: Unexpected error (${processingTime}ms) ===`)
    console.error("Error details:", error)

    return NextResponse.json(
      {
        error: "Internal server error",
        requestId,
        details: {
          message: error instanceof Error ? error.message : String(error),
          processingTimeMs: processingTime,
          timestamp: new Date().toISOString(),
        },
        support: "If this error persists, please contact support with the requestId",
      },
      { status: 500 },
    )
  }
}
