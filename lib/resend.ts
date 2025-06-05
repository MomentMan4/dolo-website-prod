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
    let text = ""

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
      text = `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
Company: ${data.company || "Not provided"}
Source: ${data.source}
Submission ID: ${data.submissionId}
Date: ${data.submissionDate}

Message:
${data.message}
      `.trim()
    } else if (template === "quiz-result") {
      subject = `🎯 Your Personalized Web Development Plan: ${data.plan}`

      // HTML version with rich formatting
      html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Quiz Results - Dolo</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎯 Your Perfect Plan is Ready!</h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">Hi ${data.name || "there"}, we've found the perfect solution for you!</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-left: 5px solid #ff6b35;">
            <h2 style="color: #2c3e50; margin-bottom: 20px; font-size: 24px;">
              <span style="color: #ff6b35;">🎯</span> Your Recommended Plan: ${data.plan}
            </h2>
            
            <div style="background: white; padding: 25px; border-radius: 8px; border: 1px solid #e9ecef; margin-bottom: 25px;">
              <p style="font-size: 16px; margin-bottom: 20px; color: #495057;">${data.description}</p>
              
              <div style="text-align: center; margin: 25px 0;">
                <a href="${data.link}" style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px;">
                  🚀 Start My Website
                </a>
              </div>
              
              <p style="font-size: 14px; color: #6c757d; text-align: center; margin: 15px 0 0 0;">
                Click the button above to get started with your ${data.plan} plan
              </p>
            </div>
            
            <div style="background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%); padding: 20px; border-radius: 8px; border-left: 4px solid #28a745;">
              <h3 style="color: #155724; margin-bottom: 15px; font-size: 18px;">
                <span style="font-size: 20px;">✨</span> Why This Plan is Perfect for You
              </h3>
              <ul style="color: #155724; margin: 0; padding-left: 20px;">
                <li>Tailored to your specific business needs</li>
                <li>Optimized for your budget and timeline</li>
                <li>Includes all the features you requested</li>
                <li>Built for long-term growth and success</li>
              </ul>
            </div>
          </div>
          
          <div style="background: #2c3e50; color: white; padding: 25px; text-align: center; border-radius: 0 0 8px 8px;">
            <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">Ready to bring your vision to life?</p>
            <p style="margin: 0; font-size: 14px; color: #bdc3c7;">
              Questions? Reply to this email or visit 
              <a href="https://dolobuilds.com/contact" style="color: #ff6b35; text-decoration: none;">dolobuilds.com/contact</a>
            </p>
            <p style="margin: 15px 0 0 0; font-size: 12px; color: #95a5a6;">
              © ${new Date().getFullYear()} Dolo. All rights reserved.
            </p>
          </div>
        </body>
        </html>
      `

      // Plain text version for accessibility and email clients that don't support HTML
      text = `
🎯 Your Personalized Web Development Plan: ${data.plan}

Hi ${data.name || "there"},

Great news! We've analyzed your quiz responses and found the perfect plan for your needs.

YOUR RECOMMENDED PLAN: ${data.plan}

${data.description}

WHY THIS PLAN IS PERFECT FOR YOU:
✨ Tailored to your specific business needs
✨ Optimized for your budget and timeline  
✨ Includes all the features you requested
✨ Built for long-term growth and success

READY TO GET STARTED?
Visit this link to begin: ${data.link}

Questions? Reply to this email or visit dolobuilds.com/contact

Best regards,
The Dolo Team

---
© ${new Date().getFullYear()} Dolo. All rights reserved.
      `.trim()
    } else if (template === "private-build-application") {
      subject = `🏗️ Premium Private Build Application - ${data.name}`

      html = `
        <h2>🏗️ New Premium Private Build Application</h2>
        <p><strong>Applicant:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Company:</strong> ${data.company || "Not provided"}</p>
        <p><strong>Budget:</strong> ${data.budget}</p>
        <p><strong>Timeline:</strong> ${data.timeline}</p>
        <p><strong>Project Type:</strong> ${data.projectType || "Not specified"}</p>
        <h3>Project Vision:</h3>
        <p>${data.vision ? data.vision.replace(/\n/g, "<br>") : "Not provided"}</p>
        <p><strong>Referral Source:</strong> ${data.referralSource || "Not provided"}</p>
        <p><strong>Application Date:</strong> ${new Date().toLocaleDateString()}</p>
      `

      text = `
🏗️ New Premium Private Build Application

Applicant: ${data.name}
Email: ${data.email}
Company: ${data.company || "Not provided"}
Budget: ${data.budget}
Timeline: ${data.timeline}
Project Type: ${data.projectType || "Not specified"}

Project Vision:
${data.vision || "Not provided"}

Referral Source: ${data.referralSource || "Not provided"}
Application Date: ${new Date().toLocaleDateString()}
      `.trim()
    }

    // Ensure we have both html and text content
    if (!html || !text) {
      throw new Error(`Missing email content for template: ${template}`)
    }

    const result = await resend!.emails.send({
      from: "Dolo <noreply@dolobuilds.com>",
      to: [to],
      subject,
      html,
      text,
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
