import { Resend } from "resend"

// Initialize Resend client
let resend: Resend | null = null

try {
  if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY)
  }
} catch (error) {
  console.warn("Failed to initialize Resend:", error)
}

// Check if Resend is configured
export function isResendConfigured(): boolean {
  return resend !== null && !!process.env.RESEND_API_KEY
}

// Email template generators
function generateContactNotificationHTML(data: any): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px;">🔔 New Contact Form Submission</h1>
  </div>
  
  <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
    <h2 style="color: #ff6b35; margin-top: 0;">👤 Contact Information</h2>
    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> <a href="mailto:${data.email}" style="color: #ff6b35;">${data.email}</a></p>
      <p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
      <p><strong>Company:</strong> ${data.company || "Not provided"}</p>
      <p><strong>Contact Reason:</strong> ${data.contactReason || "General Inquiry"}</p>
      <p><strong>Project Stage:</strong> ${data.stage || "Not specified"}</p>
    </div>
    
    <h3 style="color: #ff6b35;">💬 Message</h3>
    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <p style="white-space: pre-wrap;">${data.message}</p>
    </div>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="mailto:${data.email}" style="background: #ff6b35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reply to ${data.name}</a>
    </div>
  </div>
  
  <div style="text-align: center; margin-top: 20px; color: #666; font-size: 14px;">
    <p>This email was sent from the Dolo contact form</p>
  </div>
</body>
</html>
  `
}

function generateContactNotificationText(data: any): string {
  return `
New Contact Form Submission

Contact Information:
- Name: ${data.name}
- Email: ${data.email}
- Phone: ${data.phone || "Not provided"}
- Company: ${data.company || "Not provided"}
- Contact Reason: ${data.contactReason || "General Inquiry"}
- Project Stage: ${data.stage || "Not specified"}

Message:
${data.message}

Reply to: ${data.email}
  `
}

function generateWelcomeHTML(data: any): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Dolo - Payment Confirmed!</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 700px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); padding: 40px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 32px;">🎉 Payment Confirmed!</h1>
    <p style="color: white; font-size: 18px; margin: 10px 0 0 0;">Welcome to Dolo, ${data.customerName}!</p>
  </div>
  
  <div style="background: #f8f9fa; padding: 40px; border-radius: 0 0 10px 10px;">
    <div style="background: #e3f2fd; padding: 25px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #2196f3;">
      <h2 style="color: #1976d2; margin-top: 0;">💬 Exclusive Chat Support Access</h2>
      <p>Your payment has been processed successfully! You now have access to our exclusive customer portal and chat support.</p>
      <p><strong>Your Unique Chat Access Code:</strong></p>
      <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; font-family: monospace; font-size: 16px; font-weight: bold; color: #ff6b35; text-align: center; margin: 15px 0;">
        ${data.chatAccessToken}
      </div>
      <p style="font-size: 14px; color: #666;">Keep this code safe - you'll need it to access your customer portal and chat with our team.</p>
    </div>
    
    <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
      <h3 style="color: #ff6b35; margin-top: 0;">🚀 What's Next?</h3>
      <ul style="padding-left: 20px;">
        <li>Our team will review your project details within 24 hours</li>
        <li>You'll receive a project timeline and next steps via email</li>
        <li>Use your chat access code to communicate directly with our team</li>
        <li>Track your project progress in your customer portal</li>
      </ul>
    </div>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL}/customer-portal/${data.chatAccessToken}" style="background: #ff6b35; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Access Your Portal</a>
    </div>
    
    <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #ff9800;">
      <h4 style="color: #f57c00; margin-top: 0;">📞 Need Help?</h4>
      <p style="margin-bottom: 0;">If you have any questions, reply to this email or use your chat access code to get instant support!</p>
    </div>
  </div>
  
  <div style="text-align: center; margin-top: 20px; color: #666; font-size: 14px;">
    <p>Thank you for choosing Dolo for your web development needs!</p>
    <p>🌟 Dolo - Building Digital Excellence</p>
  </div>
</body>
</html>
  `
}

function generateWelcomeText(data: any): string {
  return `
🎉 Payment Confirmed! Welcome to Dolo, ${data.customerName}!

💬 Exclusive Chat Support Access
Your payment has been processed successfully! You now have access to our exclusive customer portal and chat support.

Your Unique Chat Access Code: ${data.chatAccessToken}

Keep this code safe - you'll need it to access your customer portal and chat with our team.

🚀 What's Next?
- Our team will review your project details within 24 hours
- You'll receive a project timeline and next steps via email
- Use your chat access code to communicate directly with our team
- Track your project progress in your customer portal

Access Your Portal: ${process.env.NEXT_PUBLIC_SITE_URL}/customer-portal/${data.chatAccessToken}

📞 Need Help?
If you have any questions, reply to this email or use your chat access code to get instant support!

Thank you for choosing Dolo for your web development needs!
🌟 Dolo - Building Digital Excellence
  `
}

function generatePrivateBuildHTML(data: any): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Private Build Application</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px;">🏢 New Private Build Application</h1>
  </div>
  
  <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
    <h2 style="color: #6366f1; margin-top: 0;">👤 Client Information</h2>
    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> <a href="mailto:${data.email}" style="color: #6366f1;">${data.email}</a></p>
      <p><strong>Company:</strong> ${data.company}</p>
      <p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
      <p><strong>Budget Range:</strong> ${data.budgetRange}</p>
      <p><strong>Timeline:</strong> ${data.timeline}</p>
    </div>
    
    <h3 style="color: #6366f1;">📋 Project Details</h3>
    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <p style="white-space: pre-wrap;">${data.projectDetails}</p>
    </div>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="https://cal.com/dolobuilds/quick-consult" style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-right: 10px;">Schedule Consultation</a>
      <a href="mailto:${data.email}" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reply to Client</a>
    </div>
  </div>
  
  <div style="text-align: center; margin-top: 20px; color: #666; font-size: 14px;">
    <p>This application was submitted through the Dolo Private Build form</p>
  </div>
</body>
</html>
  `
}

function generatePrivateBuildText(data: any): string {
  return `
New Private Build Application

Client Information:
- Name: ${data.name}
- Email: ${data.email}
- Company: ${data.company}
- Phone: ${data.phone || "Not provided"}
- Budget Range: ${data.budgetRange}
- Timeline: ${data.timeline}

Project Details:
${data.projectDetails}

Schedule Consultation: https://cal.com/dolobuilds/quick-consult
Reply to: ${data.email}
  `
}

function generateQuizResultHTML(data: any): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Quiz Result Submission</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px;">📊 New Quiz Result</h1>
  </div>
  
  <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
    <h2 style="color: #10b981; margin-top: 0;">👤 User Information</h2>
    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> <a href="mailto:${data.email}" style="color: #10b981;">${data.email}</a></p>
      <p><strong>Recommended Plan:</strong> <span style="background: #dcfce7; color: #166534; padding: 4px 8px; border-radius: 4px; font-weight: bold;">${data.recommendedPlan}</span></p>
    </div>
    
    <h3 style="color: #10b981;">📋 Quiz Responses</h3>
    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      ${Object.entries(data.responses || {})
        .map(([question, answer]) => `<p><strong>${question}:</strong> ${answer}</p>`)
        .join("")}
    </div>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="mailto:${data.email}" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Follow Up with Lead</a>
    </div>
  </div>
  
  <div style="text-align: center; margin-top: 20px; color: #666; font-size: 14px;">
    <p>This quiz result was submitted through the Dolo website</p>
  </div>
</body>
</html>
  `
}

function generateQuizResultText(data: any): string {
  return `
New Quiz Result Submission

User Information:
- Name: ${data.name}
- Email: ${data.email}
- Recommended Plan: ${data.recommendedPlan}

Quiz Responses:
${Object.entries(data.responses || {})
  .map(([question, answer]) => `${question}: ${answer}`)
  .join("\n")}

Follow up with: ${data.email}
  `
}

// Main email sending function
export async function sendEmail(template: string, to: string, data: Record<string, any>, customerId?: string) {
  if (!isResendConfigured()) {
    console.warn("Email service not configured - skipping email send")
    return { success: false, error: "Email service not configured" }
  }

  let subject = ""
  let html = ""
  let text = ""

  try {
    switch (template) {
      case "contact-notification":
        subject = `🔔 New Contact Form Submission from ${data.name}`
        html = generateContactNotificationHTML(data)
        text = generateContactNotificationText(data)
        break

      case "welcome":
        subject = `🎉 Welcome to Dolo - Your Payment is Confirmed!`
        html = generateWelcomeHTML(data)
        text = generateWelcomeText(data)
        break

      case "private-build-notification":
        subject = `🏢 New Private Build Application from ${data.company || data.name}`
        html = generatePrivateBuildHTML(data)
        text = generatePrivateBuildText(data)
        break

      case "quiz-result":
        subject = `📊 New Quiz Result - ${data.recommendedPlan} recommended for ${data.name}`
        html = generateQuizResultHTML(data)
        text = generateQuizResultText(data)
        break

      default:
        throw new Error(`Unknown email template: ${template}`)
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

    console.log(`Email sent successfully: ${template} to ${to}`)
    return { success: true, messageId: result.data?.id }
  } catch (error) {
    console.error("Email sending error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Helper function to send notification emails to admin
export async function sendAdminNotification(template: string, data: Record<string, any>) {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@dolobuilds.com"
  return sendEmail(template, adminEmail, data)
}

// Helper function to send customer emails
export async function sendCustomerEmail(
  template: string,
  customerEmail: string,
  data: Record<string, any>,
  customerId?: string,
) {
  return sendEmail(template, customerEmail, data, customerId)
}
