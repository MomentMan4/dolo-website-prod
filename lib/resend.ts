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
    <p style="color: white; font-size: 18px; margin: 10px 0 0 0;">Welcome to Dolo, ${data.customerName || data.name}!</p>
  </div>
  
  <div style="background: #f8f9fa; padding: 40px; border-radius: 0 0 10px 10px;">
    <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 30px;">
      <h2 style="color: #ff6b35; margin-top: 0;">📋 Payment Details</h2>
      <p><strong>Project Type:</strong> ${data.projectType || "Website Development"}</p>
      <p><strong>Amount Paid:</strong> $${data.amount || "0.00"}</p>
      <p><strong>Project ID:</strong> #${data.projectId || "DOLO-" + Date.now()}</p>
      ${data.rushDelivery ? "<p><strong>Rush Delivery:</strong> ✅ Included</p>" : ""}
    </div>

    ${
      data.chatAccessToken
        ? `
    <div style="background: #e3f2fd; padding: 25px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #2196f3;">
      <h2 style="color: #1976d2; margin-top: 0;">💬 Exclusive Chat Support Access</h2>
      <p>You now have access to our exclusive customer portal and chat support.</p>
      <p><strong>Your Unique Chat Access Code:</strong></p>
      <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; font-family: monospace; font-size: 16px; font-weight: bold; color: #ff6b35; text-align: center; margin: 15px 0;">
        ${data.chatAccessToken}
      </div>
      <div style="text-align: center; margin-top: 20px;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://dolobuilds.com"}/customer-portal/${data.chatAccessToken}" style="background: #2196f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Access Your Portal</a>
      </div>
    </div>
    `
        : ""
    }
    
    <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
      <h3 style="color: #ff6b35; margin-top: 0;">🚀 What's Next?</h3>
      <ul style="padding-left: 20px;">
        <li>Our team will review your project details within 24 hours</li>
        <li>You'll receive a project timeline and next steps via email</li>
        <li>We'll schedule a project kickoff call to discuss requirements</li>
        <li>Development will begin according to your timeline</li>
      </ul>
    </div>
    
    <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #ff9800;">
      <h4 style="color: #f57c00; margin-top: 0;">📞 Need Help?</h4>
      <p style="margin-bottom: 0;">If you have any questions, reply to this email or contact us at hello@dolobuilds.com</p>
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
🎉 Payment Confirmed! Welcome to Dolo, ${data.customerName || data.name}!

📋 Payment Details:
- Project Type: ${data.projectType || "Website Development"}
- Amount Paid: $${data.amount || "0.00"}
- Project ID: #${data.projectId || "DOLO-" + Date.now()}
${data.rushDelivery ? "- Rush Delivery: ✅ Included" : ""}

${
  data.chatAccessToken
    ? `
💬 Exclusive Chat Support Access
You now have access to our exclusive customer portal and chat support.

Your Unique Chat Access Code: ${data.chatAccessToken}

Access Your Portal: ${process.env.NEXT_PUBLIC_SITE_URL || "https://dolobuilds.com"}/customer-portal/${data.chatAccessToken}
`
    : ""
}

🚀 What's Next?
- Our team will review your project details within 24 hours
- You'll receive a project timeline and next steps via email
- We'll schedule a project kickoff call to discuss requirements
- Development will begin according to your timeline

📞 Need Help?
If you have any questions, reply to this email or contact us at hello@dolobuilds.com

Thank you for choosing Dolo for your web development needs!
🌟 Dolo - Building Digital Excellence
  `
}

function generatePrivateBuildApplicationHTML(data: any): string {
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
      <p><strong>Company:</strong> ${data.company || "Not provided"}</p>
      <p><strong>Project Type:</strong> ${data.projectType}</p>
      <p><strong>Budget Range:</strong> ${data.budget}</p>
      <p><strong>Timeline:</strong> ${data.timeline}</p>
      <p><strong>Referral Source:</strong> ${data.referralSource || "Not provided"}</p>
    </div>
    
    <h3 style="color: #6366f1;">📋 Project Vision</h3>
    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <p style="white-space: pre-wrap;">${data.vision}</p>
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

function generatePrivateBuildApplicationText(data: any): string {
  return `
New Private Build Application

Client Information:
- Name: ${data.name}
- Email: ${data.email}
- Company: ${data.company || "Not provided"}
- Project Type: ${data.projectType}
- Budget Range: ${data.budget}
- Timeline: ${data.timeline}
- Referral Source: ${data.referralSource || "Not provided"}

Project Vision:
${data.vision}

Schedule Consultation: https://cal.com/dolobuilds/quick-consult
Reply to: ${data.email}
  `
}

function generatePrivateBuildConfirmationHTML(data: any): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Private Build Application Received</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px;">🏢 Application Received!</h1>
    <p style="color: white; font-size: 16px; margin: 10px 0 0 0;">Thank you ${data.name}!</p>
  </div>
  
  <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
    <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 30px;">
      <h2 style="color: #6366f1; margin-top: 0;">✅ Your Private Build Application Has Been Received</h2>
      <p>Thank you for your interest in our Private Build service! We've received your application and are excited about the possibility of working together.</p>
      
      <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #6366f1; margin: 20px 0;">
        <h3 style="color: #6366f1; margin-top: 0;">📋 Application Summary</h3>
        <p><strong>Project Type:</strong> ${data.projectType}</p>
        <p><strong>Budget Range:</strong> ${data.budget}</p>
        <p><strong>Timeline:</strong> ${data.timeline}</p>
        <p><strong>Application ID:</strong> #${data.applicationId || "PB-" + Date.now()}</p>
      </div>
    </div>
    
    <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
      <h3 style="color: #6366f1; margin-top: 0;">🚀 What Happens Next?</h3>
      <ol style="padding-left: 20px;">
        <li><strong>Application Review (24-48 hours):</strong> Our team will carefully review your application and project requirements.</li>
        <li><strong>Strategy Call:</strong> We'll schedule a detailed strategy call to discuss your vision and requirements.</li>
        <li><strong>Custom Proposal:</strong> Based on our discussion, we'll create a detailed proposal outlining the project scope, timeline, and investment.</li>
      </ol>
    </div>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="https://cal.com/dolobuilds/quick-consult" style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-right: 10px;">Schedule a Call</a>
      <a href="https://dolobuilds.com/contact" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Contact Us</a>
    </div>
  </div>
  
  <div style="text-align: center; margin-top: 20px; color: #666; font-size: 14px;">
    <p>We're excited to potentially work with you on this project!</p>
  </div>
</body>
</html>
  `
}

function generatePrivateBuildConfirmationText(data: any): string {
  return `
🏢 Private Build Application Received!

Thank you ${data.name}!

Your Private Build application has been received and we're excited about the possibility of working together.

📋 Application Summary:
- Project Type: ${data.projectType}
- Budget Range: ${data.budget}
- Timeline: ${data.timeline}
- Application ID: #${data.applicationId || "PB-" + Date.now()}

🚀 What Happens Next?

1. Application Review (24-48 hours): Our team will carefully review your application and project requirements.

2. Strategy Call: We'll schedule a detailed strategy call to discuss your vision and requirements.

3. Custom Proposal: Based on our discussion, we'll create a detailed proposal outlining the project scope, timeline, and investment.

Schedule a Call: https://cal.com/dolobuilds/quick-consult
Contact Us: https://dolobuilds.com/contact

We're excited to potentially work with you on this project!
  `
}

function generateQuizResultHTML(data: any): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Perfect Website Plan</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px;">🎯 Your Perfect Plan is Ready!</h1>
    <p style="color: white; font-size: 16px; margin: 10px 0 0 0;">Hi ${data.name || "there"}!</p>
  </div>
  
  <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
    <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 30px; text-align: center;">
      <h2 style="color: #10b981; margin-top: 0;">🌟 Recommended Plan: ${data.plan}</h2>
      <p style="font-size: 16px; margin-bottom: 20px;">${data.description}</p>
      
      <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0;">
        <h3 style="color: #166534; margin-top: 0;">📊 Your Quiz Results</h3>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Recommended Plan:</strong> ${data.plan}</p>
        <p><strong>Match Score:</strong> 95%</p>
      </div>
      
      <div style="text-align: center; margin: 25px 0;">
        <a href="${data.link}" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px;">
          🚀 Start My ${data.plan} Website
        </a>
      </div>
    </div>
    
    <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
      <h3 style="color: #10b981; margin-top: 0;">✨ Why This Plan is Perfect for You</h3>
      <ul style="padding-left: 20px;">
        <li>Tailored to your specific business needs</li>
        <li>Optimized for your budget and timeline</li>
        <li>Includes all the features you requested</li>
        <li>Built for long-term growth and success</li>
      </ul>
    </div>
    
    <div style="background: #e0f2fe; padding: 20px; border-radius: 8px; text-align: center;">
      <h4 style="color: #0277bd; margin-top: 0;">💬 Have Questions?</h4>
      <p style="margin-bottom: 15px;">Want to discuss your project in more detail?</p>
      <a href="https://dolobuilds.com/contact" style="background: #0277bd; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Contact Our Team</a>
    </div>
  </div>
  
  <div style="text-align: center; margin-top: 20px; color: #666; font-size: 14px;">
    <p>Ready to build something amazing? We're here to help! 🏗️</p>
  </div>
</body>
</html>
  `
}

function generateQuizResultText(data: any): string {
  return `
🎯 Your Perfect Website Plan: ${data.plan}

Hi ${data.name || "there"},

Great news! We've analyzed your quiz responses and found the perfect plan for your needs.

YOUR RECOMMENDED PLAN: ${data.plan}

${data.description}

📊 Your Quiz Results:
- Email: ${data.email}
- Recommended Plan: ${data.plan}
- Match Score: 95%

WHY THIS PLAN IS PERFECT FOR YOU:
✨ Tailored to your specific business needs
✨ Optimized for your budget and timeline  
✨ Includes all the features you requested
✨ Built for long-term growth and success

READY TO GET STARTED?
Visit this link to begin: ${data.link}

Questions? Contact us at: https://dolobuilds.com/contact

Best regards,
The Dolo Team

---
Ready to build something amazing? We're here to help! 🏗️
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

      case "private-build-application":
        subject = `🏢 New Private Build Application from ${data.name}`
        html = generatePrivateBuildApplicationHTML(data)
        text = generatePrivateBuildApplicationText(data)
        break

      case "private-build-confirmation":
        subject = `🏢 Private Build Application Received - Next Steps`
        html = generatePrivateBuildConfirmationHTML(data)
        text = generatePrivateBuildConfirmationText(data)
        break

      case "quiz-result":
        subject = `🎯 Your Personalized Website Plan: ${data.plan}`
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
  const adminEmail = process.env.ADMIN_EMAIL || "hello@dolobuilds.com"
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
