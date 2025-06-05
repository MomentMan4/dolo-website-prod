import { Resend } from "resend"

// Initialize Resend with error handling
let resend: Resend | null = null

try {
  if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY)
  } else {
    console.warn("RESEND_API_KEY not found - email functionality will be disabled")
  }
} catch (error) {
  console.warn("Failed to initialize Resend:", error)
}

export function isResendConfigured(): boolean {
  return !!resend && !!process.env.RESEND_API_KEY
}

export async function sendEmail(
  template: string,
  to: string,
  data: Record<string, any>,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!isResendConfigured()) {
    console.warn("Resend not configured - skipping email send")
    return { success: false, error: "Email service not configured" }
  }

  try {
    console.log(`Sending email template '${template}' to ${to}`)

    // Create email content based on template
    let subject = "New Contact Form Submission"
    let html = ""

    if (template === "contact-notification") {
      subject = `New Contact Form Submission from ${data.name}`
      html = `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Company:</strong> ${data.company || "Not provided"}</p>
        <p><strong>Source:</strong> ${data.source}</p>
        <p><strong>Submission ID:</strong> ${data.submissionId}</p>
        <p><strong>Date:</strong> ${data.submissionDate}</p>
        <h3>Message:</h3>
        <p>${data.message.replace(/\n/g, "<br>")}</p>
      `
    }

    const result = await resend!.emails.send({
      from: "noreply@dolobuilds.com",
      to: [to],
      subject,
      html,
    })

    if (result.error) {
      console.error("Resend API error:", result.error)
      return { success: false, error: result.error.message }
    }

    console.log("Email sent successfully:", result.data?.id)
    return { success: true, messageId: result.data?.id }
  } catch (error) {
    console.error("Error sending email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
