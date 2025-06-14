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
  customerId?: string,
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
      subject = `🔔 New Contact Form Submission from ${data.name}`

      // Parse the message to extract contact reason and stage for suggested replies
      const messageLines = data.message.split("\n")
      let contactReason = "general"
      let stage = "exploring"
      let actualMessage = data.message

      // Extract contact reason and stage from structured message
      messageLines.forEach((line) => {
        if (line.startsWith("Contact Reason:")) {
          contactReason = line.replace("Contact Reason:", "").trim().toLowerCase()
        }
        if (line.startsWith("Stage:")) {
          stage = line.replace("Stage:", "").trim().toLowerCase()
        }
      })

      // Clean the actual message by removing the structured data
      actualMessage = data.message
        .replace(/Contact Reason:.*?\n\n/g, "")
        .replace(/\n\nStage:.*$/g, "")
        .trim()

      // Generate suggested replies based on contact reason and stage
      const getSuggestedReplies = (reason: string, userStage: string) => {
        const replies = {
          website: {
            exploring: [
              "Thank you for your interest! I'd love to learn more about your vision. What type of website are you looking to create?",
              "Hi! Thanks for reaching out. Let's schedule a quick 15-minute call to discuss your project goals and see how we can help.",
              "Great to hear from you! What's your timeline for this project, and do you have any specific features in mind?",
            ],
            readyToBuild: [
              "Excellent! I'm excited to help bring your website to life. When would be a good time for a project kickoff call?",
              "Perfect timing! Let's discuss your requirements in detail. Do you have a preferred launch date in mind?",
              "Thanks for choosing Dolo! I'll prepare a custom proposal for you. Can we schedule a call this week?",
            ],
            comparing: [
              "I appreciate you considering Dolo! I'd be happy to explain what sets us apart. What factors are most important to you?",
              "Thanks for including us in your evaluation! I can provide references and examples that match your project type.",
              "Great question! Let me show you our unique approach and how we ensure project success. When can we chat?",
            ],
          },
          privateBuild: {
            exploring: [
              "Private Build is perfect for unique, high-end projects! What's your vision, and what budget range are you considering?",
              "I'd love to discuss Private Build with you. This service is ideal for complex, custom solutions. Tell me more about your needs.",
              "Thanks for your interest in Private Build! Let's explore if this premium service aligns with your project goals.",
            ],
            readyToBuild: [
              "Fantastic! Private Build clients get our full attention. Let's schedule a strategy session to plan your custom solution.",
              "Perfect! I'll prepare a comprehensive Private Build proposal. What's your ideal project timeline?",
              "Excellent choice! Private Build ensures a truly unique result. When can we discuss your specific requirements?",
            ],
          },
          general: {
            exploring: [
              "Thanks for reaching out! I'd love to learn more about how Dolo can help you. What's on your mind?",
              "Hi! Great to hear from you. What questions can I answer about our services?",
              "Thanks for contacting us! I'm here to help with any questions about web development or our process.",
            ],
            needAdvice: [
              "I'd be happy to provide guidance! Based on your situation, here are some initial thoughts...",
              "Great question! Let me share some insights that might help with your decision.",
              "I love helping with strategic decisions! Let's discuss your options and find the best path forward.",
            ],
          },
          partnership: {
            exploring: [
              "Partnership opportunities are always exciting! What type of collaboration are you envisioning?",
              "Thanks for thinking of Dolo for a partnership! I'd love to explore how we can work together.",
              "Interesting! Let's discuss how a partnership could benefit both our organizations.",
            ],
          },
          support: {
            exploring: [
              "I'm here to help! Let me look into this issue and get back to you with a solution.",
              "Thanks for reaching out for support. I'll prioritize this and have an answer for you soon.",
              "No problem! Support is important to us. Let me address your concern right away.",
            ],
          },
        }

        const reasonReplies = replies[reason as keyof typeof replies] || replies.general
        const stageReplies =
          reasonReplies[userStage as keyof typeof reasonReplies] || reasonReplies.exploring || replies.general.exploring

        return Array.isArray(stageReplies) ? stageReplies : [stageReplies]
      }

      const suggestedReplies = getSuggestedReplies(contactReason, stage)

      html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission - Dolo</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 700px; margin: 0 auto; padding: 0; background-color: #f8f9fa;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <div style="background: rgba(255, 255, 255, 0.1); width: 50px; height: 50px; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 24px;">🔔</span>
            </div>
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">New Contact Form Submission</h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 14px;">Received ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>
          
          <!-- Contact Information -->
          <div style="background: white; padding: 30px; border-bottom: 1px solid #e9ecef;">
            <h2 style="color: #2c3e50; margin-bottom: 20px; font-size: 20px; font-weight: 600;">
              <span style="color: #ff6b35;">👤</span> Contact Information
            </h2>
            
            <div style="display: grid; gap: 15px;">
              <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 3px solid #ff6b35;">
                <strong style="color: #2c3e50;">Name:</strong> 
                <span style="color: #495057; margin-left: 10px;">${data.name}</span>
              </div>
              
              <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 3px solid #ff6b35;">
                <strong style="color: #2c3e50;">Email:</strong> 
                <a href="mailto:${data.email}" style="color: #ff6b35; text-decoration: none; margin-left: 10px;">${data.email}</a>
              </div>
              
              <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 3px solid #ff6b35;">
                <strong style="color: #2c3e50;">Company:</strong> 
                <span style="color: #495057; margin-left: 10px;">${data.company || "Not provided"}</span>
              </div>
              
              <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 3px solid #ff6b35;">
                <strong style="color: #2c3e50;">Source:</strong> 
                <span style="color: #495057; margin-left: 10px;">${data.source}</span>
              </div>
            </div>
          </div>
          
          <!-- Inquiry Details -->
          <div style="background: white; padding: 30px; border-bottom: 1px solid #e9ecef;">
            <h2 style="color: #2c3e50; margin-bottom: 20px; font-size: 20px; font-weight: 600;">
              <span style="color: #ff6b35;">📋</span> Inquiry Details
            </h2>
            
            <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745; margin-bottom: 20px;">
              <p style="margin: 0; color: #155724;"><strong>Contact Reason:</strong> ${contactReason.charAt(0).toUpperCase() + contactReason.slice(1)}</p>
              <p style="margin: 10px 0 0 0; color: #155724;"><strong>Stage:</strong> ${stage.charAt(0).toUpperCase() + stage.slice(1)}</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #e9ecef;">
              <h3 style="color: #2c3e50; margin-bottom: 15px; font-size: 16px; font-weight: 600;">Message:</h3>
              <div style="color: #495057; line-height: 1.8; white-space: pre-wrap;">${actualMessage}</div>
            </div>
          </div>
          
          <!-- Suggested Replies -->
          <div style="background: white; padding: 30px; border-bottom: 1px solid #e9ecef;">
            <h2 style="color: #2c3e50; margin-bottom: 20px; font-size: 20px; font-weight: 600;">
              <span style="color: #ff6b35;">💬</span> Suggested Replies
            </h2>
            
            <p style="color: #6c757d; margin-bottom: 20px; font-size: 14px;">
              Based on their inquiry type and stage, here are some personalized response suggestions:
            </p>
            
            ${suggestedReplies
              .map(
                (reply, index) => `
              <div style="background: linear-gradient(135deg, #fff5f0 0%, #ffe8d6 100%); padding: 20px; border-radius: 8px; border-left: 4px solid #ff6b35; margin-bottom: 15px;">
                <div style="display: flex; align-items: flex-start; gap: 10px;">
                  <span style="background: #ff6b35; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; flex-shrink: 0;">${index + 1}</span>
                  <p style="margin: 0; color: #8b4513; line-height: 1.6; font-style: italic;">"${reply}"</p>
                </div>
              </div>
            `,
              )
              .join("")}
            
            <div style="background: #e3f2fd; padding: 15px; border-radius: 6px; border-left: 3px solid #2196f3; margin-top: 20px;">
              <p style="margin: 0; color: #1565c0; font-size: 14px;">
                <strong>💡 Pro Tip:</strong> Personalize these responses with specific details from their message to create a more engaging conversation.
              </p>
            </div>
          </div>
          
          <!-- Quick Actions -->
          <div style="background: white; padding: 30px; border-bottom: 1px solid #e9ecef;">
            <h2 style="color: #2c3e50; margin-bottom: 20px; font-size: 20px; font-weight: 600;">
              <span style="color: #ff6b35;">⚡</span> Quick Actions
            </h2>
            
            <div style="display: grid; gap: 15px;">
              <div style="text-align: center;">
                <a href="mailto:${data.email}?subject=Re: Your inquiry about ${contactReason}&body=Hi ${data.name},%0D%0A%0D%0A" 
                   style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 14px; margin: 5px;">
                  📧 Reply to ${data.name}
                </a>
                
                <a href="https://calendly.com/dolo" 
                   style="background: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 14px; margin: 5px;">
                  📅 Schedule Call
                </a>
                
                <a href="https://dolobuilds.com/admin/dashboard" 
                   style="background: #6c757d; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 14px; margin: 5px;">
                  🔧 Admin Dashboard
                </a>
              </div>
            </div>
          </div>
          
          <!-- Submission Metadata -->
          <div style="background: white; padding: 30px;">
            <h2 style="color: #2c3e50; margin-bottom: 20px; font-size: 20px; font-weight: 600;">
              <span style="color: #ff6b35;">📊</span> Submission Details
            </h2>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #e9ecef;">
              <div style="display: grid; gap: 10px; font-size: 14px;">
                <div><strong>Submission ID:</strong> <code style="background: #e9ecef; padding: 2px 6px; border-radius: 3px;">${data.submissionId}</code></div>
                <div><strong>Date:</strong> ${data.submissionDate}</div>
                <div><strong>Time:</strong> ${new Date().toLocaleTimeString()}</div>
                <div><strong>User Agent:</strong> <span style="color: #6c757d; font-size: 12px;">Web Form Submission</span></div>
              </div>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #2c3e50; color: white; padding: 25px; text-align: center; border-radius: 0 0 8px 8px;">
            <div style="margin-bottom: 15px;">
              <div style="background: rgba(255, 255, 255, 0.1); width: 40px; height: 40px; border-radius: 50%; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 18px; color: #ff6b35;">🏗️</span>
              </div>
              <p style="margin: 0; font-size: 14px; font-weight: 600; color: #ecf0f1;">Dolo - Building the future, one website at a time</p>
            </div>
            
            <div style="border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 15px;">
              <p style="margin: 0 0 8px 0; font-size: 11px; color: #bdc3c7;">
                © ${new Date().getFullYear()} Dolo. All rights reserved.
              </p>
              <p style="margin: 0; font-size: 10px; color: #95a5a6;">
                This notification was generated automatically from the contact form at dolobuilds.com
              </p>
            </div>
          </div>
        </body>
        </html>
      `

      text = `
🔔 NEW CONTACT FORM SUBMISSION
Received ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}

👤 CONTACT INFORMATION
Name: ${data.name}
Email: ${data.email}
Company: ${data.company || "Not provided"}
Source: ${data.source}

📋 INQUIRY DETAILS
Contact Reason: ${contactReason.charAt(0).toUpperCase() + contactReason.slice(1)}
Stage: ${stage.charAt(0).toUpperCase() + stage.slice(1)}

Message:
${actualMessage}

💬 SUGGESTED REPLIES
Based on their inquiry type and stage:

${suggestedReplies.map((reply, index) => `${index + 1}. "${reply}"`).join("\n\n")}

⚡ QUICK ACTIONS
- Reply to ${data.name}: mailto:${data.email}
- Schedule Call: https://calendly.com/dolo
- Admin Dashboard: https://dolobuilds.com/admin/dashboard

📊 SUBMISSION DETAILS
Submission ID: ${data.submissionId}
Date: ${data.submissionDate}
Time: ${new Date().toLocaleTimeString()}

---
© ${new Date().getFullYear()} Dolo. All rights reserved.
This notification was generated automatically from the contact form at dolobuilds.com
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
    } else if (template === "payment-confirmation") {
      subject = `💳 Payment Confirmed - Your ${data.projectType} Project is Starting!`

      html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Payment Confirmed - Dolo</title>
          <link rel="icon" type="image/x-icon" href="https://dolobuilds.com/favicon.ico">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f8f9fa;">
          
          <!-- Header with Dolo Branding -->
          <div style="background: #2c3e50; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <div style="background: rgba(255, 255, 255, 0.1); width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
              <img src="https://dolobuilds.com/favicon.ico" alt="Dolo" style="width: 32px; height: 32px; filter: brightness(0) invert(1);" />
            </div>
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">💳 Payment Confirmed!</h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 15px 0 0 0; font-size: 16px;">Thank you ${data.customerName || "valued customer"}!</p>
          </div>
          
          <!-- Payment Details -->
          <div style="background: white; padding: 30px; border-bottom: 1px solid #e9ecef;">
            <h2 style="color: #2c3e50; margin-bottom: 20px; font-size: 22px; font-weight: 600;">
              <span style="color: #28a745;">✅</span> Payment Successfully Processed
            </h2>
            
            <div style="background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%); padding: 25px; border-radius: 8px; border-left: 4px solid #28a745;">
              <div style="display: grid; gap: 15px;">
                <div><strong style="color: #155724;">Amount Paid:</strong> <span style="color: #155724; font-size: 20px; font-weight: 600;">$${data.amount}</span></div>
                <div><strong style="color: #155724;">Project Type:</strong> <span style="color: #155724;">${data.projectType}</span></div>
                <div><strong style="color: #155724;">Project ID:</strong> <span style="color: #155724; font-family: monospace;">#${data.projectId}</span></div>
                <div><strong style="color: #155724;">Payment Date:</strong> <span style="color: #155724;">${new Date().toLocaleDateString()}</span></div>
                ${data.rushDelivery ? '<div><strong style="color: #155724;">Rush Delivery:</strong> <span style="color: #155724;">✅ Included</span></div>' : ""}
              </div>
            </div>
          </div>
          
          <!-- What's Next -->
          <div style="background: white; padding: 30px; border-bottom: 1px solid #e9ecef;">
            <h2 style="color: #2c3e50; margin-bottom: 20px; font-size: 22px; font-weight: 600;">
              <span style="color: #ff6b35;">🚀</span> What Happens Next
            </h2>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 3px solid #ff6b35;">
              <ol style="color: #495057; margin: 0; padding-left: 20px; line-height: 1.8;">
                <li><strong>Project Kickoff:</strong> Our team will contact you within 24 hours to schedule your project kickoff call</li>
                <li><strong>Requirements Gathering:</strong> We'll discuss your specific needs and gather all necessary materials</li>
                <li><strong>Design & Development:</strong> Our team will create your custom website according to your specifications</li>
                <li><strong>Review & Launch:</strong> You'll review the completed website and we'll launch it live</li>
              </ol>
            </div>
          </div>
          
          <!-- Contact Information -->
          <div style="background: white; padding: 30px;">
            <h2 style="color: #2c3e50; margin-bottom: 20px; font-size: 22px; font-weight: 600;">
              <span style="color: #ff6b35;">📞</span> Questions? We're Here to Help
            </h2>
            
            <div style="text-align: center;">
              <a href="mailto:hello@dolobuilds.com?subject=Project%20Inquiry%20-%20${data.projectId}" style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 14px; margin: 5px;">
                📧 Email Our Team
              </a>
              
              <a href="https://calendly.com/dolo" style="background: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 14px; margin: 5px;">
                📅 Schedule a Call
              </a>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #2c3e50; color: white; padding: 25px; text-align: center; border-radius: 0 0 8px 8px;">
            <div style="margin-bottom: 15px;">
              <div style="background: rgba(255, 255, 255, 0.1); width: 40px; height: 40px; border-radius: 50%; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center;">
                <img src="https://dolobuilds.com/favicon.ico" alt="Dolo" style="width: 24px; height: 24px; filter: brightness(0) invert(1);" />
              </div>
              <p style="margin: 0; font-size: 14px; font-weight: 600; color: #ecf0f1;">Dolo - Building the future, one website at a time</p>
            </div>
            
            <div style="border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 15px;">
              <p style="margin: 0 0 8px 0; font-size: 11px; color: #bdc3c7;">
                © ${new Date().getFullYear()} Dolo. All rights reserved.
              </p>
              <p style="margin: 0; font-size: 10px; color: #95a5a6;">
                This notification was generated automatically from your payment confirmation
              </p>
            </div>
          </div>
        </body>
        </html>
      `

      text = `
💳 PAYMENT CONFIRMED

Thank you for your payment, ${data.customerName || "valued customer"}!

PAYMENT DETAILS:
Amount: $${data.amount}
Project Type: ${data.projectType}
Project ID: #${data.projectId}
Payment Date: ${new Date().toLocaleDateString()}
${data.rushDelivery ? "Rush Delivery: ✅ Included" : ""}

WHAT HAPPENS NEXT:
1. Project Kickoff: Our team will contact you within 24 hours
2. Requirements Gathering: We'll discuss your specific needs
3. Design & Development: We'll create your custom website
4. Review & Launch: You'll review and we'll launch it live

Questions? Contact us at hello@dolobuilds.com

---
© ${new Date().getFullYear()} Dolo. All rights reserved.
      `.trim()
    } else if (template === "welcome") {
      subject = `🎉 Welcome to Dolo - Your ${data.projectType || "Project"} is Starting!`

      // Generate plan details based on project type
      const getPlanDetails = (projectType: string) => {
        const planDetails = {
          essential: {
            name: "Essential Plan",
            description: "Perfect for small businesses and startups looking for a professional online presence",
            features: [
              "Custom responsive website design",
              "Up to 5 pages of content",
              "Mobile-optimized layout",
              "Basic SEO optimization",
              "Contact form integration",
              "Social media integration",
              "1 month of free support",
            ],
            timeline: "2-3 weeks",
          },
          pro: {
            name: "Pro Plan",
            description: "Ideal for growing businesses that need advanced features and functionality",
            features: [
              "Custom responsive website design",
              "Up to 10 pages of content",
              "Advanced SEO optimization",
              "E-commerce integration (if needed)",
              "Blog/news section",
              "Analytics integration",
              "Contact forms and lead capture",
              "Social media integration",
              "3 months of free support",
            ],
            timeline: "3-4 weeks",
          },
          premier: {
            name: "Premier Plan",
            description: "Comprehensive solution for established businesses requiring premium features",
            features: [
              "Custom responsive website design",
              "Unlimited pages",
              "Advanced SEO & marketing tools",
              "Full e-commerce solution",
              "Custom functionality development",
              "Third-party integrations",
              "Performance optimization",
              "Security enhancements",
              "6 months of free support",
            ],
            timeline: "4-6 weeks",
          },
          "private-build": {
            name: "Private Build",
            description: "Exclusive, fully customized solution tailored to your unique requirements",
            features: [
              "Completely custom design and development",
              "Unlimited pages and functionality",
              "Advanced integrations",
              "Custom backend development",
              "API development and integration",
              "Advanced security implementation",
              "Performance optimization",
              "Dedicated project manager",
              "12 months of premium support",
            ],
            timeline: "6-12 weeks",
          },
        }
        return planDetails[projectType as keyof typeof planDetails] || planDetails.essential
      }

      const planInfo = getPlanDetails(data.projectType || "essential")
      const chatUrl = `https://tawk.to/chat/${data.chatAccessToken || "default"}`

      // HTML version with enhanced project information
      html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Dolo - ${data.projectType || "Project"} Starting</title>
      <link rel="icon" type="image/x-icon" href="https://dolobuilds.com/favicon.ico">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f8f9fa;">
      
      <!-- Header with Dolo Branding -->
      <div style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <div style="background: rgba(255, 255, 255, 0.1); width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
          <img src="https://dolobuilds.com/favicon.ico" alt="Dolo" style="width: 32px; height: 32px; filter: brightness(0) invert(1);" />
        </div>
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">🎉 Welcome to Dolo!</h1>
        <p style="color: rgba(255, 255, 255, 0.9); margin: 15px 0 0 0; font-size: 16px;">Hi ${data.customerName || data.name || "there"}, your ${data.projectType || "project"} is starting!</p>
      </div>
      
      ${
        data.amount
          ? `
      <!-- Payment Confirmation -->
      <div style="background: white; padding: 30px; border-bottom: 1px solid #e9ecef;">
        <h2 style="color: #2c3e50; margin-bottom: 20px; font-size: 22px; font-weight: 600;">
          <span style="color: #28a745;">✅</span> Payment Confirmed
        </h2>
        
        <div style="background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%); padding: 20px; border-radius: 8px; border-left: 4px solid #28a745;">
          <div style="display: grid; gap: 10px;">
            <div><strong style="color: #155724;">Amount Paid:</strong> <span style="color: #155724; font-size: 18px; font-weight: 600;">$${data.amount}</span></div>
            <div><strong style="color: #155724;">Project ID:</strong> <span style="color: #155724; font-family: monospace;">#${data.projectId || "DOLO-" + Date.now()}</span></div>
            ${data.rushDelivery ? '<div><strong style="color: #155724;">Rush Delivery:</strong> <span style="color: #155724;">✅ Included</span></div>' : ""}
          </div>
        </div>
      </div>
      `
          : ""
      }
      
      <!-- Plan Details -->
      <div style="background: white; padding: 30px; border-bottom: 1px solid #e9ecef;">
        <h2 style="color: #2c3e50; margin-bottom: 20px; font-size: 22px; font-weight: 600;">
          <span style="color: #ff6b35;">📋</span> Your ${planInfo.name}
        </h2>
        
        <p style="color: #495057; margin-bottom: 20px; line-height: 1.8;">${planInfo.description}</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 3px solid #ff6b35;">
          <h3 style="color: #2c3e50; margin-bottom: 15px; font-size: 18px; font-weight: 600;">What's Included:</h3>
          <ul style="color: #495057; margin: 0; padding-left: 20px; line-height: 1.8;">
            ${planInfo.features.map((feature) => `<li>${feature}</li>`).join("")}
          </ul>
        </div>
        
        <div style="background: white; padding: 15px; border-radius: 6px; text-align: center; border: 1px solid #e9ecef; margin-top: 20px;">
          <div style="color: #ff6b35; font-size: 24px; margin-bottom: 5px;">⏱️</div>
          <div style="font-weight: 600; color: #2c3e50;">Expected Timeline</div>
          <div style="color: #6c757d; font-size: 14px;">${data.rushDelivery ? "Rush: " + Math.ceil(Number.parseInt(planInfo.timeline.split("-")[0]) * 0.5) + "-" + Math.ceil(Number.parseInt(planInfo.timeline.split("-")[1]) * 0.5) + " weeks" : planInfo.timeline}</div>
        </div>
      </div>
      
      ${
        data.chatAccessToken
          ? `
<!-- Customer Portal Access -->
<div style="background: white; padding: 30px; border-bottom: 1px solid #e9ecef;">
  <h2 style="color: #2c3e50; margin-bottom: 20px; font-size: 22px; font-weight: 600;">
    <span style="color: #ff6b35;">💬</span> Priority Customer Portal
  </h2>
  
  <div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3;">
    <p style="color: #1565c0; margin-bottom: 15px; font-size: 16px; line-height: 1.6;">
      You now have exclusive access to our priority customer support portal where you can chat directly with our team.
    </p>
    
    <div style="text-align: center; margin: 20px 0;">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL}/customer-portal/${data.chatAccessToken}" style="background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px;">
        🚀 Access Customer Portal
      </a>
    </div>
    
    <div style="background: white; padding: 15px; border-radius: 6px; margin-top: 15px;">
      <p style="margin: 0; color: #2c3e50; font-size: 14px;">
        <strong>Your Access Link:</strong><br>
        <span style="font-family: monospace; color: #666; font-size: 12px; word-break: break-all;">
          ${process.env.NEXT_PUBLIC_SITE_URL}/customer-portal/${data.chatAccessToken}
        </span>
      </p>
      <p style="margin: 10px 0 0 0; color: #666; font-size: 12px;">
        Bookmark this link for easy access to priority support. Access expires in 6 months.
      </p>
    </div>
  </div>
</div>
`
          : ""
      }
      
      ${
        data.chatAccessToken
          ? `
      <!-- Chat Access -->
      <div style="background: white; padding: 30px; border-bottom: 1px solid #e9ecef;">
        <h2 style="color: #2c3e50; margin-bottom: 20px; font-size: 22px; font-weight: 600;">
          <span style="color: #ff6b35;">💬</span> Priority Chat Support
        </h2>
        
        <div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3;">
          <p style="color: #1565c0; margin-bottom: 15px; font-size: 16px; line-height: 1.6;">
            You have exclusive access to our priority chat support with your unique access token.
          </p>
          
          <div style="background: white; padding: 15px; border-radius: 6px; margin: 15px 0;">
            <strong style="color: #2c3e50;">Chat Access Token:</strong>
            <div style="background: #f8f9fa; padding: 8px; border-radius: 4px; margin-top: 5px; font-family: monospace; color: #ff6b35; font-weight: 600;">${data.chatAccessToken}</div>
          </div>
          
          <div style="text-align: center; margin-top: 15px;">
            <a href="${chatUrl}" style="background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%); color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 14px;">
              💬 Start Priority Chat
            </a>
          </div>
        </div>
      </div>
      `
          : ""
      }
      
      <!-- What's Next -->
      <div style="background: white; padding: 30px; border-bottom: 1px solid #e9ecef;">
        <h2 style="color: #2c3e50; margin-bottom: 20px; font-size: 22px; font-weight: 600;">
          <span style="color: #ff6b35;">🚀</span> What Happens Next
        </h2>
        
        <div style="display: grid; gap: 15px;">
          <div style="display: flex; align-items: center; gap: 15px; padding: 15px; background: #f8f9fa; border-radius: 6px; border-left: 3px solid #ff6b35;">
            <div style="background: #ff6b35; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; flex-shrink: 0;">1</div>
            <span style="color: #495057; font-weight: 500;">Project kickoff call within 24 hours</span>
          </div>
          <div style="display: flex; align-items: center; gap: 15px; padding: 15px; background: #f8f9fa; border-radius: 6px; border-left: 3px solid #28a745;">
            <div style="background: #28a745; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; flex-shrink: 0;">2</div>
            <span style="color: #495057; font-weight: 500;">Requirements gathering and planning</span>
          </div>
          <div style="display: flex; align-items: center; gap: 15px; padding: 15px; background: #f8f9fa; border-radius: 6px; border-left: 3px solid #2196f3;">
            <div style="background: #2196f3; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; flex-shrink: 0;">3</div>
            <span style="color: #495057; font-weight: 500;">Design and development phase</span>
          </div>
          <div style="display: flex; align-items: center; gap: 15px; padding: 15px; background: #f8f9fa; border-radius: 6px; border-left: 3px solid #6f42c1;">
            <div style="background: #6f42c1; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; flex-shrink: 0;">4</div>
            <span style="color: #495057; font-weight: 500;">Review, testing, and launch</span>
          </div>
        </div>
      </div>
      
      <!-- Contact Information -->
      <div style="background: white; padding: 30px;">
        <h2 style="color: #2c3e50; margin-bottom: 20px; font-size: 22px; font-weight: 600;">
          <span style="color: #ff6b35;">📞</span> Get in Touch
        </h2>
        
        <div style="text-align: center;">
          <a href="mailto:hello@dolobuilds.com?subject=Project%20Inquiry%20-%20${data.projectId || "Welcome"}" style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 14px; margin: 5px;">
            📧 Email Our Team
          </a>
          
          <a href="https://calendly.com/dolo" style="background: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 14px; margin: 5px;">
            📅 Schedule a Call
          </a>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background: #2c3e50; color: white; padding: 25px; text-align: center; border-radius: 0 0 8px 8px;">
        <div style="margin-bottom: 15px;">
          <div style="background: rgba(255, 255, 255, 0.1); width: 40px; height: 40px; border-radius: 50%; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center;">
            <img src="https://dolobuilds.com/favicon.ico" alt="Dolo" style="width: 24px; height: 24px; filter: brightness(0) invert(1);" />
          </div>
          <p style="margin: 0; font-size: 14px; font-weight: 600; color: #ecf0f1;">Dolo - Building the future, one website at a time</p>
        </div>
        
        <div style="border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 15px;">
          <p style="margin: 0 0 8px 0; font-size: 11px; color: #bdc3c7;">
            © ${new Date().getFullYear()} Dolo. All rights reserved.
          </p>
          <p style="margin: 0; font-size: 10px; color: #95a5a6;">
            You're receiving this email because you're a valued Dolo customer
          </p>
        </div>
      </div>
    </body>
    </html>
  `

      text = `
🎉 WELCOME TO DOLO!

Hi ${data.customerName || data.name || "there"},

${
  data.amount
    ? `
PAYMENT CONFIRMED:
Amount: $${data.amount}
Project ID: #${data.projectId || "DOLO-" + Date.now()}
${data.rushDelivery ? "Rush Delivery: ✅ Included" : ""}
`
    : ""
}

YOUR ${planInfo.name.toUpperCase()}:
${planInfo.description}

WHAT'S INCLUDED:
${planInfo.features.map((feature) => `• ${feature}`).join("\n")}

EXPECTED TIMELINE: ${data.rushDelivery ? "Rush: " + Math.ceil(Number.parseInt(planInfo.timeline.split("-")[0]) * 0.5) + "-" + Math.ceil(Number.parseInt(planInfo.timeline.split("-")[1]) * 0.5) + " weeks" : planInfo.timeline}

${
  data.chatAccessToken
    ? `
💬 PRIORITY CUSTOMER PORTAL:
You now have exclusive access to our priority customer support portal.

Access your portal: ${process.env.NEXT_PUBLIC_SITE_URL}/customer-portal/${data.chatAccessToken}

Bookmark this link for easy access to priority support.
Access expires in 6 months.
`
    : ""
}

${
  data.chatAccessToken
    ? `
PRIORITY CHAT SUPPORT:
Access Token: ${data.chatAccessToken}
Chat URL: ${chatUrl}
`
    : ""
}

WHAT HAPPENS NEXT:
1. Project kickoff call within 24 hours
2. Requirements gathering and planning  
3. Design and development phase
4. Review, testing, and launch

GET IN TOUCH:
- Email: hello@dolobuilds.com
- Schedule a call: https://calendly.com/dolo

Best regards,
The Dolo Team

---
© ${new Date().getFullYear()} Dolo. All rights reserved.
  `.trim()
    } else if (template === "private-build-application") {
      subject = `🏗️ New Private Build Application - ${data.name}`

      html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Private Build Application - Dolo</title>
          <link rel="icon" type="image/x-icon" href="https://dolobuilds.com/favicon.ico">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 700px; margin: 0 auto; padding: 0; background-color: #f8f9fa;">
          
          <!-- Header -->
          <div style="background: #2c3e50; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <div style="background: rgba(255, 255, 255, 0.1); width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
              <img src="https://dolobuilds.com/favicon.ico" alt="Dolo" style="width: 32px; height: 32px; filter: brightness(0) invert(1);" />
            </div>
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">🏗️ New Private Build Application</h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 15px 0 0 0; font-size: 16px;">Received ${data.submissionDate || new Date().toLocaleDateString()}</p>
          </div>
          
          <!-- Applicant Information -->
          <div style="background: white; padding: 30px; border-bottom: 1px solid #e9ecef;">
            <h2 style="color: #2c3e50; margin-bottom: 20px; font-size: 22px; font-weight: 600;">
              <span style="color: #ff6b35;">👤</span> Applicant Information
            </h2>
            
            <div style="display: grid; gap: 15px;">
              <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 3px solid #ff6b35;">
                <strong style="color: #2c3e50;">Name:</strong> 
                <span style="color: #495057; margin-left: 10px;">${data.name}</span>
              </div>
              
              <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 3px solid #ff6b35;">
                <strong style="color: #2c3e50;">Email:</strong> 
                <a href="mailto:${data.email}" style="color: #ff6b35; text-decoration: none; margin-left: 10px;">${data.email}</a>
              </div>
              
              <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 3px solid #ff6b35;">
                <strong style="color: #2c3e50;">Company:</strong> 
                <span style="color: #495057; margin-left: 10px;">${data.company || "Not provided"}</span>
              </div>
              
              <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 3px solid #ff6b35;">
                <strong style="color: #2c3e50;">Application ID:</strong> 
                <span style="color: #495057; margin-left: 10px; font-family: monospace;">${data.applicationId}</span>
              </div>
            </div>
          </div>
          
          <!-- Project Details -->
          <div style="background: white; padding: 30px; border-bottom: 1px solid #e9ecef;">
            <h2 style="color: #2c3e50; margin-bottom: 20px; font-size: 22px; font-weight: 600;">
              <span style="color: #ff6b35;">📋</span> Project Details
            </h2>
            
            <div style="display: grid; gap: 20px;">
              <div style="background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%); padding: 20px; border-radius: 8px; border-left: 4px solid #28a745;">
                <div style="display: grid; gap: 15px;">
                  <div><strong style="color: #155724;">Project Type:</strong> <span style="color: #155724;">${data.projectType}</span></div>
                  <div><strong style="color: #155724;">Budget:</strong> <span style="color: #155724;">${data.budget}</span></div>
                  <div><strong style="color: #155724;">Timeline:</strong> <span style="color: #155724;">${data.timeline}</span></div>
                  <div><strong style="color: #155724;">Referral Source:</strong> <span style="color: #155724;">${data.referralSource || "Not provided"}</span></div>
                </div>
              </div>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #e9ecef;">
                <h3 style="color: #2c3e50; margin-bottom: 15px; font-size: 18px; font-weight: 600;">Project Vision:</h3>
                <div style="color: #495057; line-height: 1.8; white-space: pre-wrap;">${data.vision}</div>
              </div>
            </div>
          </div>
          
          <!-- Quick Actions -->
          <div style="background: white; padding: 30px;">
            <h2 style="color: #2c3e50; margin-bottom: 20px; font-size: 22px; font-weight: 600;">
              <span style="color: #ff6b35;">⚡</span> Quick Actions
            </h2>
            
            <div style="text-align: center;">
              <a href="mailto:${data.email}?subject=Re: Your Private Build Application&body=Hi ${data.name},%0D%0A%0D%0AThank you for your Private Build application. I'd love to discuss your project in more detail.%0D%0A%0D%0A" 
                 style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 14px; margin: 5px;">
                📧 Reply to ${data.name}
              </a>
              
              <a href="https://calendly.com/dolo" 
                 style="background: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 14px; margin: 5px;">
                📅 Schedule Strategy Call
              </a>
              
              <a href="https://dolobuilds.com/admin/dashboard" 
                 style="background: #6c757d; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 14px; margin: 5px;">
                🔧 Admin Dashboard
              </a>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #2c3e50; color: white; padding: 25px; text-align: center; border-radius: 0 0 8px 8px;">
            <div style="margin-bottom: 15px;">
              <div style="background: rgba(255, 255, 255, 0.1); width: 40px; height: 40px; border-radius: 50%; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center;">
                <img src="https://dolobuilds.com/favicon.ico" alt="Dolo" style="width: 24px; height: 24px; filter: brightness(0) invert(1);" />
              </div>
              <p style="margin: 0; font-size: 14px; font-weight: 600; color: #ecf0f1;">Dolo - Building the future, one website at a time</p>
            </div>
            
            <div style="border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 15px;">
              <p style="margin: 0 0 8px 0; font-size: 11px; color: #bdc3c7;">
                © ${new Date().getFullYear()} Dolo. All rights reserved.
              </p>
              <p style="margin: 0; font-size: 10px; color: #95a5a6;">
                This notification was generated automatically from a Private Build application
              </p>
            </div>
          </div>
        </body>
        </html>
      `

      text = `
🏗️ NEW PRIVATE BUILD APPLICATION

APPLICANT INFORMATION:
Name: ${data.name}
Email: ${data.email}
Company: ${data.company || "Not provided"}
Application ID: ${data.applicationId}

PROJECT DETAILS:
Project Type: ${data.projectType}
Budget: ${data.budget}
Timeline: ${data.timeline}
Referral Source: ${data.referralSource || "Not provided"}

PROJECT VISION:
${data.vision}

QUICK ACTIONS:
- Reply to ${data.name}: mailto:${data.email}
- Schedule Strategy Call: https://calendly.com/dolo
- Admin Dashboard: https://dolobuilds.com/admin/dashboard

Submission Date: ${data.submissionDate || new Date().toLocaleDateString()}

---
© ${new Date().getFullYear()} Dolo. All rights reserved.
      `.trim()
    } else if (template === "private-build-confirmation") {
      subject = `🏗️ Private Build Application Received - Next Steps`

      html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Private Build Application Received - Dolo</title>
          <link rel="icon" type="image/x-icon" href="https://dolobuilds.com/favicon.ico">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f8f9fa;">
          
          <!-- Header -->
          <div style="background: #2c3e50; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <div style="background: rgba(255, 255, 255, 0.1); width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
              <img src="https://dolobuilds.com/favicon.ico" alt="Dolo" style="width: 32px; height: 32px; filter: brightness(0) invert(1);" />
            </div>
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">🏗️ Application Received!</h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 15px 0 0 0; font-size: 16px;">Thank you ${data.name}!</p>
          </div>
          
          <!-- Confirmation Message -->
          <div style="background: white; padding: 30px; border-bottom: 1px solid #e9ecef;">
            <h2 style="color: #2c3e50; margin-bottom: 20px; font-size: 22px; font-weight: 600;">
              <span style="color: #28a745;">✅</span> Your Private Build Application Has Been Received
            </h2>
            
            <p style="color: #495057; margin-bottom: 20px; line-height: 1.8;">
              Thank you for your interest in our Private Build service! We've received your application and are excited about the possibility of working together on your unique project.
            </p>
            
            <div style="background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%); padding: 20px; border-radius: 8px; border-left: 4px solid #28a745;">
              <h3 style="color: #155724; margin-bottom: 15px; font-size: 18px; font-weight: 600;">
                <span style="font-size: 20px;">📋</span> Application Summary
              </h3>
              <div style="color: #155724; line-height: 1.8;">
                <div><strong>Project Type:</strong> ${data.projectType}</div>
                <div><strong>Budget Range:</strong> ${data.budget}</div>
                <div><strong>Timeline:</strong> ${data.timeline}</div>
                <div><strong>Application ID:</strong> #${data.applicationId}</div>
              </div>
            </div>
          </div>
          
          <!-- What's Next -->
          <div style="background: white; padding: 30px; border-bottom: 1px solid #e9ecef;">
            <h2 style="color: #2c3e50; margin-bottom: 20px; font-size: 22px; font-weight: 600;">
              <span style="color: #ff6b35;">🚀</span> What Happens Next
            </h2>
            
            <div style="display: grid; gap: 20px;">
              <div style="display: flex; align-items: flex-start; gap: 15px; padding: 20px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #ff6b35;">
                <div style="background: #ff6b35; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; flex-shrink: 0;">1</div>
                <div>
                  <h3 style="color: #2c3e50; margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Application Review (24-48 hours)</h3>
                  <p style="color: #495057; margin: 0; line-height: 1.6;">Our team will carefully review your application and project requirements to ensure Private Build is the right fit.</p>
                </div>
              </div>
              
              <div style="display: flex; align-items: flex-start; gap: 15px; padding: 20px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #28a745;">
                <div style="background: #28a745; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; flex-shrink: 0;">2</div>
                <div>
                  <h3 style="color: #2c3e50; margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Strategy Call</h3>
                  <p style="color: #495057; margin: 0; line-height: 1.6;">We'll schedule a detailed strategy call to discuss your vision, requirements, and how we can bring your project to life.</p>
                </div>
              </div>
              
              <div style="display: flex; align-items: flex-start; gap: 15px; padding: 20px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #2196f3;">
                <div style="background: #2196f3; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; flex-shrink: 0;">3</div>
                <div>
                  <h3 style="color: #2c3e50; margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Custom Proposal</h3>
                  <p style="color: #495057; margin: 0; line-height: 1.6;">Based on our discussion, we'll create a detailed proposal outlining the project scope, timeline, and investment.</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Contact Information -->
          <div style="background: white; padding: 30px;">
            <h2 style="color: #2c3e50; margin-bottom: 20px; font-size: 22px; font-weight: 600;">
              <span style="color: #ff6b35;">📞</span> Questions? We're Here to Help
            </h2>
            
            <p style="color: #495057; margin-bottom: 20px; line-height: 1.8;">
              Have questions about the Private Build process or want to discuss your project further? Don't hesitate to reach out!
            </p>
            
            <div style="text-align: center;">
              <a href="mailto:hello@dolobuilds.com?subject=Private%20Build%20Inquiry%20-%20${data.applicationId}" style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 14px; margin: 5px;">
                📧 Email Our Team
              </a>
              
              <a href="https://calendly.com/dolo" style="background: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 14px; margin: 5px;">
                📅 Schedule a Call
              </a>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #2c3e50; color: white; padding: 25px; text-align: center; border-radius: 0 0 8px 8px;">
            <div style="margin-bottom: 15px;">
              <div style="background: rgba(255, 255, 255, 0.1); width: 40px; height: 40px; border-radius: 50%; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center;">
                <img src="https://dolobuilds.com/favicon.ico" alt="Dolo" style="width: 24px; height: 24px; filter: brightness(0) invert(1);" />
              </div>
              <p style="margin: 0; font-size: 14px; font-weight: 600; color: #ecf0f1;">Dolo - Building the future, one website at a time</p>
            </div>
            
            <div style="border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 15px;">
              <p style="margin: 0 0 8px 0; font-size: 11px; color: #bdc3c7;">
                © ${new Date().getFullYear()} Dolo. All rights reserved.
              </p>
              <p style="margin: 0; font-size: 10px; color: #95a5a6;">
                This confirmation was generated automatically from your Private Build application
              </p>
            </div>
          </div>
        </body>
        </html>
      `

      text = `
🏗️ PRIVATE BUILD APPLICATION RECEIVED

Thank you ${data.name}!

Your Private Build application has been received and we're excited about the possibility of working together on your unique project.

APPLICATION SUMMARY:
Project Type: ${data.projectType}
Budget Range: ${data.budget}
Timeline: ${data.timeline}
Application ID: #${data.applicationId}

WHAT HAPPENS NEXT:

1. Application Review (24-48 hours)
   Our team will carefully review your application and project requirements.

2. Strategy Call
   We'll schedule a detailed strategy call to discuss your vision and requirements.

3. Custom Proposal
   Based on our discussion, we'll create a detailed proposal outlining the project scope, timeline, and investment.

QUESTIONS?
Have questions about the Private Build process? Don't hesitate to reach out!

- Email: hello@dolobuilds.com
- Schedule a call: https://calendly.com/dolo

Best regards,
The Dolo Team

---
© ${new Date().getFullYear()} Dolo. All rights reserved.
      `.trim()
    }

    // Send the email
    const result = await resend!.emails.send({
      from: "Dolo <noreply@dolobuilds.com>",
      to: [to],
      subject,
      html,
      text,
    })

    console.log(`Email sent successfully: ${result.id}`)
    return { success: true, messageId: result.id }
  } catch (error) {
    console.error("Email sending failed:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
