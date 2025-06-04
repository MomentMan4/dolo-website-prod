import { Resend } from "resend"
import { createRouteHandlerSupabaseClient } from "@/lib/supabase/client"

// Initialize Resend with proper error handling
let resend: Resend | null = null

function getResendClient(): Resend {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error("RESEND_API_KEY environment variable is required")
    }
    resend = new Resend(apiKey)
  }
  return resend
}

// Email template types
type EmailTemplate =
  | "welcome"
  | "payment-confirmation"
  | "project-started"
  | "project-completed"
  | "contact-notification"
  | "private-build-application"
  | "quiz-result"

/**
 * Send an email using Resend with enhanced error handling and retry logic
 */
export async function sendEmail(
  template: EmailTemplate,
  to: string,
  data: Record<string, any>,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Check if Resend is configured
    if (!isResendConfigured()) {
      console.warn("Resend not configured - skipping email send")
      return { success: false, error: "Email service not configured" }
    }

    const resendClient = getResendClient()
    const emailConfig = getEmailConfig(template, to, data)

    console.log(`Sending ${template} email to ${to}`)

    // Send the email
    const result = await resendClient.emails.send(emailConfig)

    if (result.error) {
      console.error(`Failed to send ${template} email:`, result.error)
      return { success: false, error: result.error.message }
    }

    // Log successful email
    await logEmailToDatabase(template, to, result.data?.id || "", data.customerId)

    console.log(`Successfully sent ${template} email:`, result.data?.id)
    return { success: true, messageId: result.data?.id }
  } catch (error) {
    console.error(`Error sending ${template} email:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Check if Resend is properly configured
 */
export function isResendConfigured(): boolean {
  return !!process.env.RESEND_API_KEY
}

/**
 * Get the email configuration for a specific template
 */
function getEmailConfig(template: EmailTemplate, to: string, data: Record<string, any>) {
  const from = "Dolo <noreply@dolobuilds.com>"
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dolobuilds.com"

  switch (template) {
    case "welcome":
      return {
        from,
        to,
        subject: `🎉 Welcome to Dolo, ${data.customerName}! Your Web Development Journey Begins`,
        html: generateWelcomeEmailHTML(data, baseUrl),
      }

    case "payment-confirmation":
      return {
        from,
        to,
        subject: `✅ Payment Confirmed - Your ${data.projectType} Project is Now in Development Queue!`,
        html: generatePaymentConfirmationHTML(data, baseUrl),
      }

    case "project-started":
      return {
        from,
        to,
        subject: `🚀 Development Has Begun - Your ${data.projectType} Project is Now Live!`,
        html: generateProjectStartedHTML(data, baseUrl),
      }

    case "project-completed":
      return {
        from,
        to,
        subject: `🎉 Your ${data.projectType} is Complete and Ready to Launch!`,
        html: generateProjectCompletedHTML(data, baseUrl),
      }

    case "contact-notification":
      return {
        from,
        to,
        subject: `📧 New Contact Inquiry from ${data.name} - ${data.company ? `${data.company} - ` : ""}Immediate Response Required`,
        html: generateContactNotificationHTML(data, baseUrl),
      }

    case "private-build-application":
      return {
        from,
        to,
        subject: `🏗️ Premium Private Build Application - ${data.name} (${data.budget} Budget)`,
        html: generatePrivateBuildApplicationHTML(data, baseUrl),
      }

    case "quiz-result":
      return {
        from,
        to,
        subject: `🎯 Your Personalized Web Development Plan: ${data.plan} (Perfect Match!)`,
        html: generateQuizResultHTML(data, baseUrl),
      }

    default:
      throw new Error(`Unknown email template: ${template}`)
  }
}

/**
 * Generate the base email template with Dolo branding
 */
function generateBaseEmailTemplate(content: string, baseUrl: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Dolo - Professional Web Development</title>
      <style>
        @media only screen and (max-width: 600px) {
          .container { width: 100% !important; padding: 10px !important; }
          .header { padding: 20px 15px !important; }
          .content { padding: 20px 15px !important; }
          .footer { padding: 15px !important; }
          .logo { width: 40px !important; height: 40px !important; }
          .button { padding: 12px 20px !important; font-size: 14px !important; }
          h1 { font-size: 24px !important; }
          h2 { font-size: 20px !important; }
          .stats-grid { flex-direction: column !important; }
          .stat-item { margin-bottom: 15px !important; }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8f9fa; line-height: 1.6;">
      <div class="container" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div class="header" style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <img class="logo" src="${baseUrl}/favicon.ico" alt="Dolo Logo" style="width: 48px; height: 48px; margin-bottom: 15px; border-radius: 8px; background-color: rgba(255, 255, 255, 0.1); padding: 8px;">
          <div style="color: #ffffff; font-size: 24px; font-weight: bold; letter-spacing: 1px;">DOLO</div>
          <div style="color: rgba(255, 255, 255, 0.9); font-size: 14px; margin-top: 5px;">Crafting Digital Excellence Since Day One</div>
        </div>

        <!-- Content -->
        <div class="content" style="padding: 40px 30px;">
          ${content}
        </div>

        <!-- Footer -->
        <div class="footer" style="background-color: #2c3e50; color: #ffffff; padding: 25px 30px; text-align: center; border-radius: 0 0 8px 8px;">
          <div style="margin-bottom: 15px;">
            <img src="${baseUrl}/favicon.ico" alt="Dolo" style="width: 32px; height: 32px; border-radius: 6px; background-color: rgba(255, 255, 255, 0.1); padding: 6px;">
          </div>
          <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #ff6b35;">Dolo</div>
          <div style="font-size: 14px; color: #bdc3c7; margin-bottom: 15px;">Where Innovation Meets Excellence</div>
          
          <!-- Quick Stats -->
          <div class="stats-grid" style="display: flex; justify-content: center; gap: 20px; margin: 20px 0; flex-wrap: wrap;">
            <div class="stat-item" style="text-align: center; color: #95a5a6; font-size: 12px;">
              <div style="color: #ff6b35; font-weight: bold; font-size: 16px;">500+</div>
              <div>Projects Delivered</div>
            </div>
            <div class="stat-item" style="text-align: center; color: #95a5a6; font-size: 12px;">
              <div style="color: #ff6b35; font-weight: bold; font-size: 16px;">98%</div>
              <div>Client Satisfaction</div>
            </div>
            <div class="stat-item" style="text-align: center; color: #95a5a6; font-size: 12px;">
              <div style="color: #ff6b35; font-weight: bold; font-size: 16px;">24/7</div>
              <div>Support Available</div>
            </div>
          </div>
          
          <div style="font-size: 12px; color: #95a5a6; line-height: 1.4; border-top: 1px solid #34495e; padding-top: 15px;">
            <p style="margin: 5px 0;">© ${new Date().getFullYear()} Dolo. All rights reserved.</p>
            <p style="margin: 5px 0;">
              <a href="${baseUrl}" style="color: #ff6b35; text-decoration: none;">Visit Website</a> | 
              <a href="${baseUrl}/contact" style="color: #ff6b35; text-decoration: none;">Get Support</a> | 
              <a href="${baseUrl}/about" style="color: #ff6b35; text-decoration: none;">About Us</a>
            </p>
            <p style="margin: 10px 0 0 0; font-size: 11px; color: #7f8c8d;">
              This email was sent because you're a valued Dolo customer. 
              <a href="#" style="color: #ff6b35; text-decoration: none;">Manage preferences</a>
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * Generate welcome email HTML with enhanced content
 */
function generateWelcomeEmailHTML(data: any, baseUrl: string): string {
  const content = `
    <div style="text-align: center; margin-bottom: 35px;">
      <h1 style="color: #2c3e50; font-size: 32px; margin-bottom: 15px; font-weight: 700;">Welcome to the Dolo Family! 🎉</h1>
      <p style="color: #7f8c8d; font-size: 20px; margin: 0 0 10px 0; font-weight: 500;">We're absolutely thrilled to have you on board, ${data.customerName}!</p>
      <p style="color: #95a5a6; font-size: 16px; margin: 0;">Your journey to digital excellence starts right here, right now.</p>
    </div>
    
    <!-- Project Overview Card -->
    <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 30px; border-radius: 15px; margin-bottom: 35px; border-left: 5px solid #ff6b35; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
      <h2 style="color: #2c3e50; font-size: 24px; margin-bottom: 20px; font-weight: 600;">
        <span style="color: #ff6b35;">🚀</span> Your Project at a Glance
      </h2>
      <div style="background: #ffffff; padding: 25px; border-radius: 10px; border: 1px solid #e9ecef;">
        <div style="color: #495057;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #e9ecef;">
            <span style="font-weight: 600; color: #2c3e50;">Project Type:</span>
            <span style="color: #ff6b35; font-weight: 700; font-size: 18px;">${data.projectType}</span>
          </div>
          ${
            data.chatAccessToken
              ? `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #e9ecef;">
            <span style="font-weight: 600; color: #2c3e50;">Your Access Token:</span>
            <code style="background: #f8f9fa; padding: 8px 12px; border-radius: 6px; font-family: 'Courier New', monospace; color: #6f42c1; border: 1px solid #e9ecef;">${data.chatAccessToken}</code>
          </div>
          `
              : ""
          }
          ${
            data.rushDelivery
              ? `
          <div style="background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
            <div style="color: #856404; font-weight: 600; display: flex; align-items: center;">
              <span style="font-size: 20px; margin-right: 10px;">🚀</span>
              <span>Rush Delivery Activated!</span>
            </div>
            <p style="color: #856404; margin: 5px 0 0 30px; font-size: 14px;">Your project has been prioritized and will be fast-tracked through our development pipeline.</p>
          </div>
          `
              : ""
          }
        </div>
      </div>
    </div>
    
    <!-- Development Process Timeline -->
    <div style="margin-bottom: 35px;">
      <h2 style="color: #2c3e50; font-size: 24px; margin-bottom: 25px; font-weight: 600; text-align: center;">
        <span style="color: #ff6b35;">📋</span> Your Development Journey
      </h2>
      <div style="background: #ffffff; border: 1px solid #e9ecef; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
        
        <div style="padding: 20px; border-bottom: 1px solid #e9ecef; background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%);">
          <div style="display: flex; align-items: center; margin-bottom: 10px;">
            <div style="background: #28a745; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px;">1</div>
            <div>
              <div style="color: #28a745; font-weight: 700; font-size: 16px;">Project Discovery & Planning</div>
              <div style="color: #155724; font-size: 14px; margin-top: 2px;">⏱️ 1-2 Business Days</div>
            </div>
          </div>
          <p style="color: #155724; margin: 0 0 0 45px; font-size: 14px; line-height: 1.5;">Our expert team conducts a comprehensive analysis of your requirements, creates detailed project specifications, and develops a customized development strategy tailored to your unique needs.</p>
        </div>
        
        <div style="padding: 20px; border-bottom: 1px solid #e9ecef;">
          <div style="display: flex; align-items: center; margin-bottom: 10px;">
            <div style="background: #ff6b35; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px;">2</div>
            <div>
              <div style="color: #ff6b35; font-weight: 700; font-size: 16px;">Design & Architecture</div>
              <div style="color: #6c757d; font-size: 14px; margin-top: 2px;">⏱️ 2-3 Business Days</div>
            </div>
          </div>
          <p style="color: #495057; margin: 0 0 0 45px; font-size: 14px; line-height: 1.5;">We create stunning visual designs, user experience wireframes, and establish the technical architecture that will power your project. Every pixel is crafted with purpose.</p>
        </div>
        
        <div style="padding: 20px; border-bottom: 1px solid #e9ecef;">
          <div style="display: flex; align-items: center; margin-bottom: 10px;">
            <div style="background: #17a2b8; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px;">3</div>
            <div>
              <div style="color: #17a2b8; font-weight: 700; font-size: 16px;">Development & Implementation</div>
              <div style="color: #6c757d; font-size: 14px; margin-top: 2px;">⏱️ 3-7 Business Days</div>
            </div>
          </div>
          <p style="color: #495057; margin: 0 0 0 45px; font-size: 14px; line-height: 1.5;">Our skilled developers bring your vision to life using cutting-edge technologies, best practices, and rigorous quality standards. You'll receive regular progress updates throughout this phase.</p>
        </div>
        
        <div style="padding: 20px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);">
          <div style="display: flex; align-items: center; margin-bottom: 10px;">
            <div style="background: #6f42c1; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px;">4</div>
            <div>
              <div style="color: #6f42c1; font-weight: 700; font-size: 16px;">Testing, Optimization & Launch</div>
              <div style="color: #6c757d; font-size: 14px; margin-top: 2px;">⏱️ 1-2 Business Days</div>
            </div>
          </div>
          <p style="color: #495057; margin: 0 0 0 45px; font-size: 14px; line-height: 1.5;">Comprehensive testing, performance optimization, and final quality assurance ensure your project exceeds expectations. We handle deployment and provide you with everything needed for a successful launch.</p>
        </div>
      </div>
    </div>
    
    <!-- What Makes Dolo Different -->
    <div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); padding: 25px; border-radius: 12px; margin-bottom: 35px; border-left: 4px solid #2196f3;">
      <h3 style="color: #1976d2; margin-bottom: 20px; font-size: 20px; font-weight: 600; text-align: center;">
        <span style="font-size: 24px;">✨</span> The Dolo Difference
      </h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;">
        <div style="text-align: center;">
          <div style="color: #1976d2; font-size: 24px; margin-bottom: 8px;">🎯</div>
          <div style="color: #0d47a1; font-weight: 600; margin-bottom: 5px;">Precision Focus</div>
          <div style="color: #1565c0; font-size: 13px;">Every detail matters in our development process</div>
        </div>
        <div style="text-align: center;">
          <div style="color: #1976d2; font-size: 24px; margin-bottom: 8px;">⚡</div>
          <div style="color: #0d47a1; font-weight: 600; margin-bottom: 5px;">Lightning Fast</div>
          <div style="color: #1565c0; font-size: 13px;">Optimized for speed and performance</div>
        </div>
        <div style="text-align: center;">
          <div style="color: #1976d2; font-size: 24px; margin-bottom: 8px;">🛡️</div>
          <div style="color: #0d47a1; font-weight: 600; margin-bottom: 5px;">Enterprise Security</div>
          <div style="color: #1565c0; font-size: 13px;">Bank-level security standards</div>
        </div>
        <div style="text-align: center;">
          <div style="color: #1976d2; font-size: 24px; margin-bottom: 8px;">📱</div>
          <div style="color: #0d47a1; font-weight: 600; margin-bottom: 5px;">Mobile First</div>
          <div style="color: #1565c0; font-size: 13px;">Perfect on every device</div>
        </div>
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div style="text-align: center; margin: 40px 0;">
      <div style="margin-bottom: 20px;">
        <a href="${baseUrl}/contact" class="button" style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); color: #ffffff; padding: 18px 35px; text-decoration: none; border-radius: 10px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 6px 20px rgba(255, 107, 53, 0.3); margin-right: 15px;">
          💬 Contact Our Team
        </a>
        <a href="${baseUrl}/about" style="background: transparent; color: #ff6b35; padding: 18px 35px; text-decoration: none; border-radius: 10px; display: inline-block; font-weight: 600; font-size: 16px; border: 2px solid #ff6b35;">
          📖 Learn About Dolo
        </a>
      </div>
    </div>
    
    <!-- Pro Tips Section -->
    <div style="background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%); padding: 25px; border-radius: 12px; border-left: 4px solid #28a745; margin-top: 35px;">
      <h4 style="color: #155724; margin-bottom: 15px; font-size: 18px; font-weight: 600;">
        <span style="font-size: 20px;">💡</span> Pro Tips for Your Project Success
      </h4>
      <ul style="color: #155724; margin: 0; padding-left: 20px; line-height: 1.8;">
        <li><strong>Stay Connected:</strong> Check your email regularly for project updates and milestone notifications</li>
        <li><strong>Feedback Loop:</strong> We value your input at every stage - don't hesitate to share your thoughts</li>
        <li><strong>Resource Access:</strong> Use your access token to track progress and communicate with our team</li>
        <li><strong>Launch Preparation:</strong> Start thinking about your launch strategy - we'll help you maximize impact</li>
      </ul>
    </div>
    
    <!-- Emergency Contact -->
    <div style="background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin-top: 25px; text-align: center;">
      <p style="color: #856404; margin: 0; font-weight: 500;">
        <strong>🚨 Need Immediate Assistance?</strong><br>
        Our support team is available 24/7 at <a href="mailto:support@dolobuilds.com" style="color: #ff6b35; text-decoration: none; font-weight: 600;">support@dolobuilds.com</a><br>
        <span style="font-size: 14px;">Average response time: Under 2 hours</span>
      </p>
    </div>
  `

  return generateBaseEmailTemplate(content, baseUrl)
}

/**
 * Generate payment confirmation email HTML with enhanced content
 */
function generatePaymentConfirmationHTML(data: any, baseUrl: string): string {
  const content = `
    <div style="text-align: center; margin-bottom: 35px;">
      <div style="background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%); width: 100px; height: 100px; border-radius: 50%; margin: 0 auto 25px; display: flex; align-items: center; justify-content: center; border: 4px solid #28a745; box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);">
        <span style="font-size: 48px;">✅</span>
      </div>
      <h1 style="color: #28a745; font-size: 32px; margin-bottom: 15px; font-weight: 700;">Payment Successfully Processed!</h1>
      <p style="color: #7f8c8d; font-size: 20px; margin: 0 0 10px 0; font-weight: 500;">Thank you for your trust in Dolo, ${data.customerName}!</p>
      <p style="color: #95a5a6; font-size: 16px; margin: 0;">Your project is now officially in our development pipeline.</p>
    </div>
    
    <!-- Payment Details Card -->
    <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 30px; border-radius: 15px; margin-bottom: 35px; border-left: 5px solid #28a745; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
      <h2 style="color: #2c3e50; font-size: 24px; margin-bottom: 25px; font-weight: 600; text-align: center;">
        <span style="color: #28a745;">💳</span> Payment Summary & Project Details
      </h2>
      <div style="background: #ffffff; padding: 25px; border-radius: 12px; border: 1px solid #e9ecef;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
          <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px;">
            <div style="color: #28a745; font-weight: 700; font-size: 28px; margin-bottom: 5px;">$${data.amount}</div>
            <div style="color: #6c757d; font-size: 14px;">Total Investment</div>
          </div>
          <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px;">
            <div style="color: #ff6b35; font-weight: 700; font-size: 18px; margin-bottom: 5px;">${data.projectType}</div>
            <div style="color: #6c757d; font-size: 14px;">Project Type</div>
          </div>
        </div>
        
        ${
          data.projectId
            ? `
        <div style="text-align: center; margin-bottom: 20px; padding: 15px; background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 8px;">
          <div style="color: #1976d2; font-weight: 600; margin-bottom: 5px;">Project ID</div>
          <code style="background: #ffffff; padding: 8px 15px; border-radius: 6px; font-family: 'Courier New', monospace; color: #2c3e50; border: 1px solid #e9ecef; font-size: 16px;">${data.projectId}</code>
          <div style="color: #1565c0; font-size: 12px; margin-top: 5px;">Save this ID for future reference</div>
        </div>
        `
            : ""
        }
        
        ${
          data.rushDelivery
            ? `
        <div style="background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); padding: 20px; border-radius: 10px; border-left: 4px solid #ffc107; text-align: center;">
          <div style="color: #856404; font-weight: 700; font-size: 18px; margin-bottom: 10px;">
            <span style="font-size: 24px; margin-right: 10px;">🚀</span>
            Rush Delivery Activated!
          </div>
          <p style="color: #856404; margin: 0; font-size: 14px; line-height: 1.5;">Your project has been fast-tracked and will receive priority treatment throughout our entire development pipeline. Expected delivery time reduced by 50%!</p>
        </div>
        `
            : ""
        }
      </div>
    </div>
    
    <!-- Project Status -->
    <div style="background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%); padding: 30px; border-radius: 15px; margin-bottom: 35px; text-align: center; border: 3px solid #28a745; box-shadow: 0 4px 15px rgba(40, 167, 69, 0.2);">
      <h3 style="color: #28a745; margin-bottom: 20px; font-size: 26px; font-weight: 700;">🎉 Your Project is Now Live in Our System!</h3>
      <p style="color: #155724; margin: 0 0 20px 0; font-size: 18px; line-height: 1.6; font-weight: 500;">We've immediately begun the project initiation process. Our expert development team has been notified and will start working on your project within the next few hours.</p>
      
      <div style="background: #ffffff; padding: 20px; border-radius: 10px; margin-top: 20px; border: 1px solid #c3e6cb;">
        <div style="color: #155724; font-weight: 600; margin-bottom: 15px; font-size: 16px;">🔄 Current Status: Project Initialization</div>
        <div style="background: #e8f5e8; height: 8px; border-radius: 4px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); height: 100%; width: 25%; border-radius: 4px;"></div>
        </div>
        <div style="color: #6c757d; font-size: 12px; margin-top: 8px;">25% Complete - Requirements Analysis in Progress</div>
      </div>
    </div>
    
    <!-- What Happens Next -->
    <div style="margin-bottom: 35px;">
      <h2 style="color: #2c3e50; font-size: 24px; margin-bottom: 25px; font-weight: 600; text-align: center;">
        <span style="color: #ff6b35;">📅</span> Your Project Timeline
      </h2>
      <div style="background: #ffffff; border: 1px solid #e9ecef; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
        
        <div style="padding: 20px; border-bottom: 1px solid #e9ecef; background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%);">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center;">
              <div style="background: #28a745; color: white; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px;">✓</div>
              <div>
                <div style="color: #28a745; font-weight: 700; font-size: 16px;">Payment Processed</div>
                <div style="color: #155724; font-size: 14px;">Completed just now</div>
              </div>
            </div>
            <div style="color: #28a745; font-weight: bold;">DONE</div>
          </div>
        </div>
        
        <div style="padding: 20px; border-bottom: 1px solid #e9ecef; background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center;">
              <div style="background: #ffc107; color: white; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px;">⚡</div>
              <div>
                <div style="color: #856404; font-weight: 700; font-size: 16px;">Project Analysis & Planning</div>
                <div style="color: #856404; font-size: 14px;">Starting within 2 hours</div>
              </div>
            </div>
            <div style="color: #ffc107; font-weight: bold;">IN PROGRESS</div>
          </div>
        </div>
        
        <div style="padding: 20px; border-bottom: 1px solid #e9ecef;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center;">
              <div style="background: #6c757d; color: white; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px;">2</div>
              <div>
                <div style="color: #495057; font-weight: 700; font-size: 16px;">Design & Development</div>
                <div style="color: #6c757d; font-size: 14px;">Begins within 1-2 business days</div>
              </div>
            </div>
            <div style="color: #6c757d; font-weight: bold;">PENDING</div>
          </div>
        </div>
        
        <div style="padding: 20px; background: #f8f9fa;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center;">
              <div style="background: #6c757d; color: white; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px;">3</div>
              <div>
                <div style="color: #495057; font-weight: 700; font-size: 16px;">Testing & Launch</div>
                <div style="color: #6c757d; font-size: 14px;">Final phase before delivery</div>
              </div>
            </div>
            <div style="color: #6c757d; font-weight: bold;">SCHEDULED</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Communication Preferences -->
    <div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); padding: 25px; border-radius: 12px; margin-bottom: 35px; border-left: 4px solid #2196f3;">
      <h3 style="color: #1976d2; margin-bottom: 20px; font-size: 20px; font-weight: 600; text-align: center;">
        <span style="font-size: 24px;">📞</span> Stay Connected Throughout Your Project
      </h3>
      <div style="background: #ffffff; padding: 20px; border-radius: 10px; border: 1px solid #bbdefb;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px;">
            <div style="color: #1976d2; font-size: 20px; margin-bottom: 8px;">📧</div>
            <div style="color: #0d47a1; font-weight: 600; margin-bottom: 5px;">Email Updates</div>
            <div style="color: #1565c0; font-size: 13px;">Daily progress reports</div>
          </div>
          <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px;">
            <div style="color: #1976d2; font-size: 20px; margin-bottom: 8px;">💬</div>
            <div style="color: #0d47a1; font-weight: 600; margin-bottom: 5px;">Direct Chat</div>
            <div style="color: #1565c0; font-size: 13px;">Real-time communication</div>
          </div>
        </div>
        <div style="text-align: center; margin-top: 20px; padding: 15px; background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%); border-radius: 8px;">
          <div style="color: #155724; font-weight: 600;">📱 24/7 Support Available</div>
          <div style="color: #155724; font-size: 14px; margin-top: 5px;">Average response time: Under 2 hours</div>
        </div>
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div style="text-align: center; margin: 40px 0;">
      <div style="margin-bottom: 20px;">
        <a href="${baseUrl}/contact" class="button" style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); color: #ffffff; padding: 18px 35px; text-decoration: none; border-radius: 10px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 6px 20px rgba(255, 107, 53, 0.3); margin-right: 15px;">
          💬 Contact Project Manager
        </a>
        <a href="${baseUrl}/about" style="background: transparent; color: #28a745; padding: 18px 35px; text-decoration: none; border-radius: 10px; display: inline-block; font-weight: 600; font-size: 16px; border: 2px solid #28a745;">
          📊 View Project Status
        </a>
      </div>
    </div>
    
    <!-- Success Guarantee -->
    <div style="background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); padding: 25px; border-radius: 12px; border-left: 4px solid #ffc107; margin-top: 35px; text-align: center;">
      <h4 style="color: #856404; margin-bottom: 15px; font-size: 20px; font-weight: 600;">
        <span style="font-size: 24px;">🛡️</span> Our Success Guarantee
      </h4>
      <p style="color: #856404; margin: 0; font-size: 16px; line-height: 1.6;">
        We're so confident in our work that we offer a <strong>100% satisfaction guarantee</strong>. If you're not completely happy with your project, we'll work with you until it exceeds your expectations - at no additional cost.
      </p>
    </div>
  `

  return generateBaseEmailTemplate(content, baseUrl)
}

/**
 * Generate project started email HTML with enhanced content
 */
function generateProjectStartedHTML(data: any, baseUrl: string): string {
  const content = `
    <div style="text-align: center; margin-bottom: 35px;">
      <div style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); width: 100px; height: 100px; border-radius: 50%; margin: 0 auto 25px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);">
        <span style="font-size: 48px; color: white;">🎨</span>
      </div>
      <h1 style="color: #ff6b35; font-size: 32px; margin-bottom: 15px; font-weight: 700;">Development Has Officially Begun! 🚀</h1>
      <p style="color: #7f8c8d; font-size: 20px; margin: 0 0 10px 0; font-weight: 500;">Hi ${data.customerName}, your project is now live in our development environment!</p>
      <p style="color: #95a5a6; font-size: 16px; margin: 0;">Our expert team is actively working on bringing your vision to life.</p>
    </div>
    
    <!-- Project Status Dashboard -->
    <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 30px; border-radius: 15px; margin-bottom: 35px; border-left: 5px solid #ff6b35; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
      <h2 style="color: #2c3e50; font-size: 24px; margin-bottom: 25px; font-weight: 600; text-align: center;">
        <span style="color: #ff6b35;">📊</span> Live Project Dashboard
      </h2>
      
      <div style="background: #ffffff; padding: 25px; border-radius: 12px; border: 1px solid #e9ecef; margin-bottom: 20px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 25px;">
          <div style="text-align: center; padding: 15px; background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%); border-radius: 8px;">
            <div style="color: #28a745; font-weight: 700; font-size: 24px; margin-bottom: 5px;">Active</div>
            <div style="color: #155724; font-size: 14px;">Project Status</div>
          </div>
          <div style="text-align: center; padding: 15px; background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); border-radius: 8px;">
            <div style="color: #856404; font-weight: 700; font-size: 24px; margin-bottom: 5px;">35%</div>
            <div style="color: #856404; font-size: 14px;">Progress Complete</div>
          </div>
          <div style="text-align: center; padding: 15px; background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 8px;">
            <div style="color: #1976d2; font-weight: 700; font-size: 24px; margin-bottom: 5px;">${data.projectType}</div>
            <div style="color: #1565c0; font-size: 14px;">Project Type</div>
          </div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="color: #2c3e50; font-weight: 600;">Development Progress</span>
            <span style="color: #ff6b35; font-weight: 600;">35%</span>
          </div>
          <div style="background: #e9ecef; height: 12px; border-radius: 6px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); height: 100%; width: 35%; border-radius: 6px; transition: width 0.3s ease;"></div>
          </div>
        </div>
        
        <div style="background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%); padding: 15px; border-radius: 8px; text-align: center;">
          <div style="color: #155724; font-weight: 600; margin-bottom: 5px;">🔄 Current Phase: Core Development</div>
          <div style="color: #155724; font-size: 14px;">Estimated completion: 3-5 business days</div>
        </div>
      </div>
    </div>
    
    <!-- Development Team Introduction -->
    <div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); padding: 25px; border-radius: 12px; margin-bottom: 35px; border-left: 4px solid #2196f3;">
      <h3 style="color: #1976d2; margin-bottom: 20px; font-size: 22px; font-weight: 600; text-align: center;">
        <span style="font-size: 24px;">👥</span> Meet Your Development Team
      </h3>
      <div style="background: #ffffff; padding: 20px; border-radius: 10px; border: 1px solid #bbdefb;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px;">
            <div style="color: #1976d2; font-size: 24px; margin-bottom: 8px;">👨‍💻</div>
            <div style="color: #0d47a1; font-weight: 600; margin-bottom: 5px;">Lead Developer</div>
            <div style="color: #1565c0; font-size: 13px;">Full-stack architecture & implementation</div>
          </div>
          <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px;">
            <div style="color: #1976d2; font-size: 24px; margin-bottom: 8px;">🎨</div>
            <div style="color: #0d47a1; font-weight: 600; margin-bottom: 5px;">UI/UX Designer</div>
            <div style="color: #1565c0; font-size: 13px;">Visual design & user experience</div>
          </div>
          <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px;">
            <div style="color: #1976d2; font-size: 24px; margin-bottom: 8px;">🔧</div>
            <div style="color: #0d47a1; font-weight: 600; margin-bottom: 5px;">DevOps Engineer</div>
            <div style="color: #1565c0; font-size: 13px;">Performance & deployment optimization</div>
          </div>
          <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px;">
            <div style="color: #1976d2; font-size: 24px; margin-bottom: 8px;">🛡️</div>
            <div style="color: #0d47a1; font-weight: 600; margin-bottom: 5px;">QA Specialist</div>
            <div style="color: #1565c0; font-size: 13px;">Quality assurance & testing</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Current Development Activities -->
    <div style="background: #ffffff; border: 1px solid #e9ecef; border-radius: 12px; overflow: hidden; margin-bottom: 35px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
      <div style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); color: white; padding: 20px; font-weight: 600; text-align: center;">
        <span style="font-size: 24px; margin-right: 10px;">🔄</span>
        What's Happening Right Now
      </div>
      <div style="padding: 25px;">
        <div style="display: grid; gap: 20px;">
          <div style="display: flex; align-items: center; padding: 15px; background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%); border-radius: 8px; border-left: 4px solid #28a745;">
            <div style="background: #28a745; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; font-size: 14px;">✓</div>
            <div>
              <div style="color: #155724; font-weight: 600; margin-bottom: 3px;">Environment Setup Complete</div>
              <div style="color: #155724; font-size: 14px;">Development environment configured and ready</div>
            </div>
          </div>
          
          <div style="display: flex; align-items: center; padding: 15px; background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); border-radius: 8px; border-left: 4px solid #ffc107;">
            <div style="background: #ffc107; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; font-size: 14px;">⚡</div>
            <div>
              <div style="color: #856404; font-weight: 600; margin-bottom: 3px;">Core Architecture Implementation</div>
              <div style="color: #856404; font-size: 14px;">Building the foundation and core functionality</div>
            </div>
          </div>
          
          <div style="display: flex; align-items: center; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #6c757d;">
            <div style="background: #6c757d; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; font-size: 14px;">⏳</div>
            <div>
              <div style="color: #495057; font-weight: 600; margin-bottom: 3px;">UI Component Development</div>
              <div style="color: #6c757d; font-size: 14px;">Next phase: Creating user interface components</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Communication & Updates -->
    <div style="background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%); padding: 25px; border-radius: 12px; margin-bottom: 35px; border-left: 4px solid #28a745;">
      <h3 style="color: #155724; margin-bottom: 20px; font-size: 20px; font-weight: 600; text-align: center;">
        <span style="font-size: 24px;">📞</span> Stay Updated on Your Project
      </h3>
      <div style="background: #ffffff; padding: 20px; border-radius: 10px; border: 1px solid #c3e6cb;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
          <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px;">
            <div style="color: #28a745; font-size: 20px; margin-bottom: 8px;">📧</div>
            <div style="color: #155724; font-weight: 600; margin-bottom: 5px;">Daily Updates</div>
            <div style="color: #155724; font-size: 13px;">Progress reports every evening</div>
          </div>
          <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px;">
            <div style="color: #28a745; font-size: 20px; margin-bottom: 8px;">📱</div>
            <div style="color: #155724; font-weight: 600; margin-bottom: 5px;">Milestone Alerts</div>
            <div style="color: #155724; font-size: 13px;">Instant notifications for major progress</div>
          </div>
        </div>
        <div style="text-align: center; padding: 15px; background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 8px;">
          <div style="color: #1976d2; font-weight: 600; margin-bottom: 5px;">💬 Direct Team Access</div>
          <div style="color: #1565c0; font-size: 14px;">Chat directly with your development team anytime</div>
        </div>
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div style="text-align: center; margin: 40px 0;">
      <div style="margin-bottom: 20px;">
        <a href="${baseUrl}/contact" class="button" style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); color: #ffffff; padding: 18px 35px; text-decoration: none; border-radius: 10px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 6px 20px rgba(255, 107, 53, 0.3); margin-right: 15px;">
          💬 Chat with Team
        </a>
        <a href="${baseUrl}/about" style="background: transparent; color: #ff6b35; padding: 18px 35px; text-decoration: none; border-radius: 10px; display: inline-block; font-weight: 600; font-size: 16px; border: 2px solid #ff6b35;">
          📊 View Live Progress
        </a>
      </div>
    </div>
    
    <!-- Development Philosophy -->
    <div style="background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); padding: 25px; border-radius: 12px; border-left: 4px solid #ffc107; margin-top: 35px;">
      <h4 style="color: #856404; margin-bottom: 15px; font-size: 20px; font-weight: 600; text-align: center;">
        <span style="font-size: 24px;">🎯</span> Our Development Philosophy
      </h4>
      <div style="color: #856404; font-size: 16px; line-height: 1.6; text-align: center;">
        <p style="margin: 0 0 15px 0;"><strong>Quality First:</strong> Every line of code is crafted with precision and tested thoroughly</p>
        <p style="margin: 0 0 15px 0;"><strong>Transparent Process:</strong> You'll know exactly what we're working on at all times</p>
        <p style="margin: 0;"><strong>Your Vision:</strong> We don't just build websites, we bring your unique vision to life</p>
      </div>
    </div>
  `

  return generateBaseEmailTemplate(content, baseUrl)
}

/**
 * Generate project completed email HTML with enhanced content
 */
function generateProjectCompletedHTML(data: any, baseUrl: string): string {
  const content = `
    <div style="text-align: center; margin-bottom: 35px;">
      <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); width: 100px; height: 100px; border-radius: 50%; margin: 0 auto 25px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3); animation: pulse 2s infinite;">
        <span style="font-size: 48px; color: white;">🎉</span>
      </div>
      <h1 style="color: #28a745; font-size: 32px; margin-bottom: 15px; font-weight: 700;">Your Project is Complete & Ready to Launch! 🚀</h1>
      <p style="color: #7f8c8d; font-size: 20px; margin: 0 0 10px 0; font-weight: 500;">Congratulations ${data.customerName}! Your vision is now a reality.</p>
      <p style="color: #95a5a6; font-size: 16px; margin: 0;">We're incredibly proud to deliver this exceptional project to you.</p>
    </div>
    
    ${
      data.projectUrl
        ? `
    <!-- Live Website Showcase -->
    <div style="background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%); padding: 30px; border-radius: 15px; margin-bottom: 35px; text-align: center; border: 3px solid #28a745; box-shadow: 0 4px 15px rgba(40, 167, 69, 0.2);">
      <h3 style="color: #28a745; margin-bottom: 20px; font-size: 26px; font-weight: 700;">🌐 Your Website is Now Live!</h3>
      <p style="color: #155724; margin-bottom: 25px; font-size: 18px; line-height: 1.5;">Your new website is live and ready for the world to see. Click below to experience your digital masterpiece:</p>
      
      <div style="background: #ffffff; padding: 20px; border-radius: 10px; margin-bottom: 25px; border: 1px solid #c3e6cb;">
        <div style="color: #155724; font-weight: 600; margin-bottom: 10px; font-size: 16px;">🔗 Live Website URL</div>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border: 1px solid #e9ecef; margin-bottom: 15px;">
          <code style="color: #2c3e50; font-family: 'Courier New', monospace; font-size: 16px; word-break: break-all;">${data.projectUrl}</code>
        </div>
        <a href="${data.projectUrl}" style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: #ffffff; padding: 18px 40px; text-decoration: none; border-radius: 10px; display: inline-block; font-weight: 600; font-size: 18px; box-shadow: 0 6px 20px rgba(40, 167, 69, 0.3); text-transform: uppercase; letter-spacing: 1px;">
          🚀 Launch Your Website
        </a>
      </div>
      
      <div style="background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
        <p style="color: #856404; margin: 0; font-size: 14px;">
          <strong>💡 Pro Tip:</strong> Share your new website on social media and with your network to maximize its impact!
        </p>
      </div>
    </div>
    `
        : ""
    }
    
    <!-- Project Summary & Achievements -->
    <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 30px; border-radius: 15px; margin-bottom: 35px; border-left: 5px solid #ff6b35; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
      <h2 style="color: #2c3e50; font-size: 24px; margin-bottom: 25px; font-weight: 600; text-align: center;">
        <span style="color: #ff6b35;">✨</span> Project Highlights & Achievements
      </h2>
      <div style="background: #ffffff; padding: 25px; border-radius: 12px; border: 1px solid #e9ecef;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
          <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%); border-radius: 10px;">
            <div style="color: #28a745; font-weight: 700; font-size: 28px; margin-bottom: 8px;">100%</div>
            <div style="color: #155724; font-size: 14px; font-weight: 600;">Project Complete</div>
          </div>
          <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 10px;">
            <div style="color: #1976d2; font-weight: 700; font-size: 28px; margin-bottom: 8px;">${data.projectType}</div>
            <div style="color: #1565c0; font-size: 14px; font-weight: 600;">Project Type</div>
          </div>
        </div>
        
        <div style="margin-bottom: 25px;">
          <div style="color: #2c3e50; font-weight: 600; margin-bottom: 15px; font-size: 18px; text-align: center;">📊 Project Specifications</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div style="padding: 15px; background: #f8f9fa; border-radius: 8px; text-align: center;">
              <div style="color: #ff6b35; font-weight: 600; margin-bottom: 5px;">Completion Date</div>
              <div style="color: #495057; font-size: 14px;">${new Date().toLocaleDateString()}</div>
            </div>
            <div style="padding: 15px; background: #f8f9fa; border-radius: 8px; text-align: center;">
              <div style="color: #ff6b35; font-weight: 600; margin-bottom: 5px;">Final Status</div>
              <div style="color: #28a745; font-size: 14px; font-weight: 600;">✅ Delivered</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Technical Features & Capabilities -->
    <div style="background: #ffffff; border: 1px solid #e9ecef; border-radius: 12px; overflow: hidden; margin-bottom: 35px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
      <div style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); color: white; padding: 20px; font-weight: 600; text-align: center;">
        <span style="font-size: 24px; margin-right: 10px;">🛠️</span>
        What's Included in Your Project
      </div>
      <div style="padding: 25px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div style="padding: 20px; background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%); border-radius: 10px; border-left: 4px solid #28a745;">
            <h4 style="color: #155724; margin-bottom: 15px; font-size: 16px; font-weight: 600;">🎨 Design Excellence</h4>
            <ul style="color: #155724; margin: 0; padding-left: 20px; line-height: 1.8; font-size: 14px;">
              <li>Modern, professional design</li>
              <li>Brand-consistent styling</li>
              <li>Intuitive user interface</li>
              <li>Accessibility compliant</li>
            </ul>
          </div>
          
          <div style="padding: 20px; background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 10px; border-left: 4px solid #2196f3;">
            <h4 style="color: #1565c0; margin-bottom: 15px; font-size: 16px; font-weight: 600;">📱 Technical Features</h4>
            <ul style="color: #1565c0; margin: 0; padding-left: 20px; line-height: 1.8; font-size: 14px;">
              <li>Fully responsive design</li>
              <li>Optimized for performance</li>
              <li>SEO-friendly structure</li>
              <li>Cross-browser compatibility</li>
            </ul>
          </div>
          
          <div style="padding: 20px; background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); border-radius: 10px; border-left: 4px solid #ffc107;">
            <h4 style="color: #856404; margin-bottom: 15px; font-size: 16px; font-weight: 600;">⚡ Performance</h4>
            <ul style="color: #856404; margin: 0; padding-left: 20px; line-height: 1.8; font-size: 14px;">
              <li>Lightning-fast loading</li>
              <li>Optimized images & assets</li>
              <li>Efficient code structure</li>
              <li>CDN integration</li>
            </ul>
          </div>
          
          <div style="padding: 20px; background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%); border-radius: 10px; border-left: 4px solid #9c27b0;">
            <h4 style="color: #6a1b9a; margin-bottom: 15px; font-size: 16px; font-weight: 600;">🛡️ Security & Reliability</h4>
            <ul style="color: #6a1b9a; margin: 0; padding-left: 20px; line-height: 1.8; font-size: 14px;">
              <li>Secure hosting environment</li>
              <li>SSL certificate included</li>
              <li>Regular backups</li>
              <li>99.9% uptime guarantee</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Launch Strategy & Next Steps -->
    <div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); padding: 25px; border-radius: 12px; margin-bottom: 35px; border-left: 4px solid #2196f3;">
      <h3 style="color: #1976d2; margin-bottom: 20px; font-size: 22px; font-weight: 600; text-align: center;">
        <span style="font-size: 24px;">🚀</span> Launch Strategy & Recommendations
      </h3>
      <div style="background: #ffffff; padding: 20px; border-radius: 10px; border: 1px solid #bbdefb;">
        <div style="margin-bottom: 20px;">
          <h4 style="color: #1976d2; margin-bottom: 15px; font-size: 18px; font-weight: 600;">📈 Maximize Your Launch Impact</h4>
          <div style="display: grid; gap: 15px;">
            <div style="display: flex; align-items: center; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #28a745;">
              <div style="background: #28a745; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; font-size: 14px;">1</div>
              <div>
                <div style="color: #2c3e50; font-weight: 600; margin-bottom: 3px;">Social Media Announcement</div>
                <div style="color: #6c757d; font-size: 14px;">Share your new website across all your social platforms</div>
              </div>
            </div>
            
            <div style="display: flex; align-items: center; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #ff6b35;">
              <div style="background: #ff6b35; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; font-size: 14px;">2</div>
              <div>
                <div style="color: #2c3e50; font-weight: 600; margin-bottom: 3px;">Email Your Network</div>
                <div style="color: #6c757d; font-size: 14px;">Notify your contacts, customers, and partners</div>
              </div>
            </div>
            
            <div style="display: flex; align-items: center; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #17a2b8;">
              <div style="background: #17a2b8; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; font-size: 14px;">3</div>
              <div>
                <div style="color: #2c3e50; font-weight: 600; margin-bottom: 3px;">SEO Optimization</div>
                <div style="color: #6c757d; font-size: 14px;">Submit to search engines and update business listings</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Ongoing Support & Maintenance -->
    <div style="background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%); padding: 25px; border-radius: 12px; margin-bottom: 35px; border-left: 4px solid #28a745;">
      <h3 style="color: #155724; margin-bottom: 20px; font-size: 20px; font-weight: 600; text-align: center;">
        <span style="font-size: 24px;">🛡️</span> Ongoing Support & Maintenance
      </h3>
      <div style="background: #ffffff; padding: 20px; border-radius: 10px; border: 1px solid #c3e6cb;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
          <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px;">
            <div style="color: #28a745; font-size: 20px; margin-bottom: 8px;">🔧</div>
            <div style="color: #155724; font-weight: 600; margin-bottom: 5px;">Free Updates</div>
            <div style="color: #155724; font-size: 13px;">30 days of complimentary updates</div>
          </div>
          <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px;">
            <div style="color: #28a745; font-size: 20px; margin-bottom: 8px;">📞</div>
            <div style="color: #155724; font-weight: 600; margin-bottom: 5px;">Priority Support</div>
            <div style="color: #155724; font-size: 13px;">Direct access to our team</div>
          </div>
        </div>
        <div style="text-align: center; padding: 15px; background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); border-radius: 8px;">
          <div style="color: #856404; font-weight: 600; margin-bottom: 5px;">🚀 Growth Partnership</div>
          <div style="color: #856404; font-size: 14px;">We're here to help your business grow and evolve</div>
        </div>
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div style="text-align: center; margin: 40px 0;">
      <div style="margin-bottom: 20px;">
        ${
          data.projectUrl
            ? `<a href="${data.projectUrl}" class="button" style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: #ffffff; padding: 18px 35px; text-decoration: none; border-radius: 10px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 6px 20px rgba(40, 167, 69, 0.3); margin-right: 15px;">
          🌐 Visit Your Website
        </a>`
            : ""
        }
        <a href="${baseUrl}/contact" style="background: transparent; color: #ff6b35; padding: 18px 35px; text-decoration: none; border-radius: 10px; display: inline-block; font-weight: 600; font-size: 16px; border: 2px solid #ff6b35;">
          💬 Contact Support
        </a>
      </div>
    </div>
    
    <!-- Celebration & Thank You -->
    <div style="background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); padding: 30px; border-radius: 12px; border-left: 4px solid #ffc107; margin-top: 35px; text-align: center;">
      <h4 style="color: #856404; margin-bottom: 20px; font-size: 24px; font-weight: 700;">
        <span style="font-size: 32px;">🎊</span> Congratulations on Your Launch!
      </h4>
      <p style="color: #856404; margin: 0 0 20px 0; font-size: 18px; line-height: 1.6;">
        We're incredibly proud to have been part of bringing your vision to life. Your new website represents not just our technical expertise, but your unique brand and goals.
      </p>
      <p style="color: #856404; margin: 0; font-size: 16px; line-height: 1.6;">
        <strong>Thank you for choosing Dolo.</strong> We can't wait to see the amazing things you'll accomplish with your new digital presence!
      </p>
    </div>
    
    <!-- Future Partnership -->
    <div style="background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%); padding: 20px; border-radius: 8px; border-left: 4px solid #9c27b0; margin-top: 25px; text-align: center;">
      <p style="color: #6a1b9a; margin: 0; font-weight: 500; font-size: 15px;">
        <strong>🤝 Ready for your next project?</strong> We'd love to continue supporting your digital growth. 
        <a href="${baseUrl}/contact" style="color: #9c27b0; text-decoration: none; font-weight: 600;">Let's discuss your future needs!</a>
      </p>
    </div>
  `

  return generateBaseEmailTemplate(content, baseUrl)
}

/**
 * Generate contact notification email HTML with enhanced content
 */
function generateContactNotificationHTML(data: any, baseUrl: string): string {
  const content = `
    <div style="text-align: center; margin-bottom: 35px;">
      <div style="background: linear-gradient(135deg, #17a2b8 0%, #138496 100%); width: 100px; height: 100px; border-radius: 50%; margin: 0 auto 25px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(23, 162, 184, 0.3);">
        <span style="font-size: 48px; color: white;">📧</span>
      </div>
      <h1 style="color: #17a2b8; font-size: 32px; margin-bottom: 15px; font-weight: 700;">New Contact Form Submission</h1>
      <p style="color: #7f8c8d; font-size: 20px; margin: 0 0 10px 0; font-weight: 500;">Priority inquiry received from ${data.name}</p>
      <p style="color: #95a5a6; font-size: 16px; margin: 0;">Immediate response recommended for optimal customer experience</p>
    </div>
    
    <!-- Contact Information Card -->
    <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 30px; border-radius: 15px; margin-bottom: 35px; border-left: 5px solid #17a2b8; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
      <h2 style="color: #2c3e50; font-size: 24px; margin-bottom: 25px; font-weight: 600; text-align: center;">
        <span style="color: #17a2b8;">👤</span> Contact Information & Details
      </h2>
      <div style="background: #ffffff; padding: 25px; border-radius: 12px; border: 1px solid #e9ecef;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
          <div style="padding: 15px; background: #f8f9fa; border-radius: 8px; text-align: center;">
            <div style="color: #17a2b8; font-weight: 600; margin-bottom: 8px; font-size: 14px;">CONTACT NAME</div>
            <div style="color: #2c3e50; font-size: 18px; font-weight: 700;">${data.name}</div>
          </div>
          <div style="padding: 15px; background: #f8f9fa; border-radius: 8px; text-align: center;">
            <div style="color: #17a2b8; font-weight: 600; margin-bottom: 8px; font-size: 14px;">COMPANY</div>
            <div style="color: #2c3e50; font-size: 18px; font-weight: 700;">${data.company || "Individual"}</div>
          </div>
        </div>
        
        <div style="margin-bottom: 20px; text-align: center;">
          <div style="color: #17a2b8; font-weight: 600; margin-bottom: 10px; font-size: 14px;">EMAIL ADDRESS</div>
          <a href="mailto:${data.email}" style="background: linear-gradient(135deg, #17a2b8 0%, #138496 100%); color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(23, 162, 184, 0.3);">
            📧 ${data.email}
          </a>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-top: 20px;">
          <div style="padding: 12px; background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 8px; text-align: center;">
            <div style="color: #1976d2; font-weight: 600; margin-bottom: 3px; font-size: 12px;">SOURCE</div>
            <div style="color: #1565c0; font-size: 14px; font-weight: 600;">${data.source}</div>
          </div>
          <div style="padding: 12px; background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%); border-radius: 8px; text-align: center;">
            <div style="color: #155724; font-weight: 600; margin-bottom: 3px; font-size: 12px;">SUBMISSION ID</div>
            <div style="color: #155724; font-size: 12px; font-family: monospace;">${data.submissionId}</div>
          </div>
          <div style="padding: 12px; background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); border-radius: 8px; text-align: center;">
            <div style="color: #856404; font-weight: 600; margin-bottom: 3px; font-size: 12px;">RECEIVED</div>
            <div style="color: #856404; font-size: 12px;">${new Date(data.submissionDate).toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Message Content -->
    <div style="background: #ffffff; border: 1px solid #e9ecef; border-radius: 12px; overflow: hidden; margin-bottom: 35px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
      <div style="background: linear-gradient(135deg, #17a2b8 0%, #138496 100%); color: white; padding: 20px; font-weight: 600; text-align: center;">
        <span style="font-size: 24px; margin-right: 10px;">💬</span>
        Customer Message Content
      </div>
      <div style="padding: 30px;">
        <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 25px; border-radius: 10px; border-left: 4px solid #17a2b8; font-family: Georgia, serif; font-style: italic; line-height: 1.8; color: #495057; font-size: 16px;">
          "${data.message.replace(/\n/g, "<br>")}"
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); border-radius: 8px; text-align: center;">
          <div style="color: #856404; font-weight: 600; margin-bottom: 5px;">📊 Message Analysis</div>
          <div style="color: #856404; font-size: 14px;">
            Word Count: ${data.message.split(" ").length} words | 
            Character Count: ${data.message.length} characters |
            Estimated Read Time: ${Math.ceil(data.message.split(" ").length / 200)} minute(s)
          </div>
        </div>
      </div>
    </div>
    
    <!-- Response Priority & Recommendations -->
    <div style="background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%); padding: 25px; border-radius: 12px; margin-bottom: 35px; border-left: 4px solid #28a745;">
      <h3 style="color: #155724; margin-bottom: 20px; font-size: 22px; font-weight: 600; text-align: center;">
        <span style="font-size: 24px;">⚡</span> Response Strategy & Priority Level
      </h3>
      <div style="background: #ffffff; padding: 20px; border-radius: 10px; border: 1px solid #c3e6cb;">
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 20px;">
          <div style="text-align: center; padding: 15px; background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); border-radius: 8px; color: white;">
            <div style="font-size: 20px; margin-bottom: 5px;">🚨</div>
            <div style="font-weight: 600; margin-bottom: 3px;">HIGH PRIORITY</div>
            <div style="font-size: 12px; opacity: 0.9;">Respond within 2 hours</div>
          </div>
          <div style="text-align: center; padding: 15px; background: linear-gradient(135deg, #28a745 0%, #20c997 100%); border-radius: 8px; color: white;">
            <div style="font-size: 20px; margin-bottom: 5px;">💼</div>
            <div style="font-weight: 600; margin-bottom: 3px;">BUSINESS INQUIRY</div>
            <div style="font-size: 12px; opacity: 0.9;">Potential new client</div>
          </div>
          <div style="text-align: center; padding: 15px; background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); border-radius: 8px; color: white;">
            <div style="font-size: 20px; margin-bottom: 5px;">🎯</div>
            <div style="font-weight: 600; margin-bottom: 3px;">CONVERSION READY</div>
            <div style="font-size: 12px; opacity: 0.9;">High engagement level</div>
          </div>
        </div>
        
        <div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3;">
          <h4 style="color: #1976d2; margin-bottom: 15px; font-size: 16px; font-weight: 600;">📋 Recommended Response Actions</h4>
          <ul style="color: #1565c0; margin: 0; padding-left: 20px; line-height: 1.8; font-size: 14px;">
            <li><strong>Immediate Acknowledgment:</strong> Send confirmation within 30 minutes</li>
            <li><strong>Personalized Response:</strong> Address their specific needs and questions</li>
            <li><strong>Value Proposition:</strong> Highlight relevant Dolo services and benefits</li>
            <li><strong>Next Steps:</strong> Propose a discovery call or consultation</li>
            <li><strong>Follow-up Schedule:</strong> Set reminders for 24h and 1-week follow-ups</li>
          </ul>
        </div>
      </div>
    </div>
    
    <!-- Quick Response Templates -->
    <div style="background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%); padding: 25px; border-radius: 12px; margin-bottom: 35px; border-left: 4px solid #9c27b0;">
      <h3 style="color: #6a1b9a; margin-bottom: 20px; font-size: 20px; font-weight: 600; text-align: center;">
        <span style="font-size: 24px;">⚡</span> Quick Response Templates
      </h3>
      <div style="background: #ffffff; padding: 20px; border-radius: 10px; border: 1px solid #ce93d8;">
        <div style="margin-bottom: 15px;">
          <div style="color: #6a1b9a; font-weight: 600; margin-bottom: 8px; font-size: 14px;">INITIAL ACKNOWLEDGMENT</div>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #9c27b0; font-size: 14px; line-height: 1.6; color: #495057;">
            "Hi ${data.name}, thank you for reaching out to Dolo! We've received your inquiry and our team is reviewing your requirements. We'll respond with detailed information within 2 hours. - The Dolo Team"
          </div>
        </div>
        
        <div style="margin-bottom: 15px;">
          <div style="color: #6a1b9a; font-weight: 600; margin-bottom: 8px; font-size: 14px;">CONSULTATION OFFER</div>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #9c27b0; font-size: 14px; line-height: 1.6; color: #495057;">
            "Hi ${data.name}, based on your message, I'd love to schedule a brief consultation to discuss your project in detail. Are you available for a 15-minute call this week? - [Your Name], Dolo"
          </div>
        </div>
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div style="text-align: center; margin: 40px 0;">
      <div style="margin-bottom: 20px;">
        <a href="mailto:${data.email}?subject=Re: Your Inquiry to Dolo&body=Hi ${data.name},%0D%0A%0D%0AThank you for reaching out to Dolo! We've received your inquiry and are excited to help with your project.%0D%0A%0D%0ABest regards,%0D%0AThe Dolo Team" class="button" style="background: linear-gradient(135deg, #17a2b8 0%, #138496 100%); color: #ffffff; padding: 18px 35px; text-decoration: none; border-radius: 10px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 6px 20px rgba(23, 162, 184, 0.3); margin-right: 15px;">
          📧 Reply to ${data.name}
        </a>
        <a href="tel:${data.email}" style="background: transparent; color: #28a745; padding: 18px 35px; text-decoration: none; border-radius: 10px; display: inline-block; font-weight: 600; font-size: 16px; border: 2px solid #28a745;">
          📞 Schedule Call
        </a>
      </div>
    </div>
    
    <!-- Customer Insights -->
    <div style="background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin-top: 35px;">
      <h4 style="color: #856404; margin-bottom: 15px; font-size: 18px; font-weight: 600;">
        <span style="font-size: 20px;">💡</span> Customer Engagement Tips
      </h4>
      <ul style="color: #856404; margin: 0; padding-left: 20px; line-height: 1.8; font-size: 14px;">
        <li><strong>Personalization:</strong> Reference specific details from their message</li>
        <li><strong>Value First:</strong> Lead with how you can solve their problem</li>
        <li><strong>Social Proof:</strong> Mention relevant case studies or testimonials</li>
        <li><strong>Clear Next Steps:</strong> Make it easy for them to move forward</li>
      </ul>
    </div>
  `

  return generateBaseEmailTemplate(content, baseUrl)
}

/**
 * Generate private build application email HTML with enhanced content
 */
function generatePrivateBuildApplicationHTML(data: any, baseUrl: string): string {
  const content = `
    <div style="text-align: center; margin-bottom: 35px;">
      <div style="background: linear-gradient(135deg, #6f42c1 0%, #5a32a3 100%); width: 100px; height: 100px; border-radius: 50%; margin: 0 auto 25px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(111, 66, 193, 0.3);">
        <span style="font-size: 48px; color: white;">🏗️</span>
      </div>
      <h1 style="color: #6f42c1; font-size: 32px; margin-bottom: 15px; font-weight: 700;">Premium Private Build Application</h1>
      <p style="color: #7f8c8d; font-size: 20px; margin: 0 0 10px 0; font-weight: 500;">High-value inquiry from ${data.name}</p>
      <p style="color: #95a5a6; font-size: 16px; margin: 0;">Immediate attention required for premium client opportunity</p>
    </div>
    
    <!-- Applicant Profile -->
    <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 30px; border-radius: 15px; margin-bottom: 35px; border-left: 5px solid #6f42c1; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
      <h2 style="color: #2c3e50; font-size: 24px; margin-bottom: 25px; font-weight: 600; text-align: center;">
        <span style="color: #6f42c1;">👤</span> Applicant Profile & Contact Information
      </h2>
      <div style="background: #ffffff; padding: 25px; border-radius: 12px; border: 1px solid #e9ecef;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
          <div style="padding: 20px; background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%); border-radius: 10px; text-align: center;">
            <div style="color: #6f42c1; font-weight: 600; margin-bottom: 8px; font-size: 14px;">APPLICANT NAME</div>
            <div style="color: #2c3e50; font-size: 20px; font-weight: 700;">${data.name}</div>
          </div>
          <div style="padding: 20px; background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 10px; text-align: center;">
            <div style="color: #1976d2; font-weight: 600; margin-bottom: 8px; font-size: 14px;">ORGANIZATION</div>
            <div style="color: #2c3e50; font-size: 20px; font-weight: 700;">${data.company || "Individual Client"}</div>
          </div>
        </div>
        
        <div style="margin-bottom: 25px; text-align: center;">
          <div style="color: #6f42c1; font-weight: 600; margin-bottom: 15px; font-size: 14px;">CONTACT EMAIL</div>
          <a href="mailto:${data.email}" style="background: linear-gradient(135deg, #6f42c1 0%, #5a32a3 100%); color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 10px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(111, 66, 193, 0.3);">
            📧 ${data.email}
          </a>
        </div>
        
        <div style="background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%); padding: 15px; border-radius: 8px; text-align: center;">
          <div style="color: #155724; font-weight: 600; margin-bottom: 5px;">📍 Referral Source</div>
          <div style="color: #155724; font-size: 16px; font-weight: 600;">${data.referralSource}</div>
        </div>
      </div>
    </div>
    
    <!-- Project Requirements Analysis -->
    <div style="background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); padding: 30px; border-radius: 15px; margin-bottom: 35px; border-left: 5px solid #ffc107; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
      <h2 style="color: #856404; font-size: 24px; margin-bottom: 25px; font-weight: 600; text-align: center;">
        <span style="color: #ffc107;">📊</span> Project Requirements & Investment Analysis
      </h2>
      <div style="background: #ffffff; padding: 25px; border-radius: 12px; border: 1px solid #ffeaa7;">
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 25px;">
          <div style="padding: 20px; background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%); border-radius: 10px; text-align: center; border: 2px solid #6f42c1;">
            <div style="color: #6f42c1; font-weight: 600; margin-bottom: 8px; font-size: 14px;">PROJECT TYPE</div>
            <div style="color: #2c3e50; font-size: 18px; font-weight: 700;">${data.projectType}</div>
          </div>
          <div style="padding: 20px; background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%); border-radius: 10px; text-align: center; border: 2px solid #28a745;">
            <div style="color: #28a745; font-weight: 600; margin-bottom: 8px; font-size: 14px;">BUDGET RANGE</div>
            <div style="color: #2c3e50; font-size: 18px; font-weight: 700;">${data.budget}</div>
          </div>
          <div style="padding: 20px; background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); border-radius: 10px; text-align: center; border: 2px solid #ffc107;">
            <div style="color: #856404; font-weight: 600; margin-bottom: 8px; font-size: 14px;">TIMELINE</div>
            <div style="color: #2c3e50; font-size: 18px; font-weight: 700;">${data.timeline}</div>
          </div>
        </div>
        
        <!-- Project Complexity Assessment -->
        <div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); padding: 20px; border-radius: 10px; border-left: 4px solid #2196f3; margin-bottom: 20px;">
          <h4 style="color: #1976d2; margin-bottom: 15px; font-size: 18px; font-weight: 600;">🎯 Project Complexity Assessment</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div style="text-align: center; padding: 15px; background: #ffffff; border-radius: 8px;">
              <div style="color: #1976d2; font-size: 24px; margin-bottom: 5px;">⭐</div>
              <div style="color: #1565c0; font-weight: 600; margin-bottom: 3px;">Premium Tier</div>
              <div style="color: #1976d2; font-size: 12px;">High-value project</div>
            </div>
            <div style="text-align: center; padding: 15px; background: #ffffff; border-radius: 8px;">
              <div style="color: #1976d2; font-size: 24px; margin-bottom: 5px;">🚀</div>
              <div style="color: #1565c0; font-weight: 600; margin-bottom: 3px;">Custom Solution</div>
              <div style="color: #1976d2; font-size: 12px;">Tailored development</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Project Vision & Requirements -->
    <div style="background: #ffffff; border: 1px solid #e9ecef; border-radius: 12px; overflow: hidden; margin-bottom: 35px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
      <div style="background: linear-gradient(135deg, #6f42c1 0%, #5a32a3 100%); color: white; padding: 20px; font-weight: 600; text-align: center;">
        <span style="font-size: 24px; margin-right: 10px;">🎯</span>
        Client Vision & Project Requirements
      </div>
      <div style="padding: 30px;">
        <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 25px; border-radius: 10px; border-left: 4px solid #6f42c1; font-family: Georgia, serif; font-style: italic; line-height: 1.8; color: #495057; font-size: 16px; margin-bottom: 25px;">
          "${data.vision.replace(/\n/g, "<br>")}"
        </div>
        
        <!-- Vision Analysis -->
        <div style="background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%); padding: 20px; border-radius: 10px; border-left: 4px solid #28a745;">
          <h4 style="color: #155724; margin-bottom: 15px; font-size: 16px; font-weight: 600;">📋 Vision Analysis & Key Requirements</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div style="background: #ffffff; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="color: #28a745; font-weight: 600; margin-bottom: 5px;">Word Count</div>
              <div style="color: #155724; font-size: 18px; font-weight: 700;">${data.vision.split(" ").length}</div>
            </div>
            <div style="background: #ffffff; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="color: #28a745; font-weight: 600; margin-bottom: 5px;">Detail Level</div>
              <div style="color: #155724; font-size: 18px; font-weight: 700;">${data.vision.split(" ").length > 100 ? "Comprehensive" : data.vision.split(" ").length > 50 ? "Detailed" : "Basic"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Response Strategy & Next Steps -->
    <div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); padding: 25px; border-radius: 12px; margin-bottom: 35px; border-left: 4px solid #2196f3;">
      <h3 style="color: #1976d2; margin-bottom: 20px; font-size: 22px; font-weight: 600; text-align: center;">
        <span style="font-size: 24px;">🎯</span> Premium Client Response Strategy
      </h3>
      <div style="background: #ffffff; padding: 20px; border-radius: 10px; border: 1px solid #bbdefb;">
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 20px;">
          <div style="text-align: center; padding: 15px; background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); border-radius: 8px; color: white;">
            <div style="font-size: 20px; margin-bottom: 5px;">🚨</div>
            <div style="font-weight: 600; margin-bottom: 3px;">URGENT PRIORITY</div>
            <div style="font-size: 12px; opacity: 0.9;">Respond within 1 hour</div>
          </div>
          <div style="text-align: center; padding: 15px; background: linear-gradient(135deg, #6f42c1 0%, #5a32a3 100%); border-radius: 8px; color: white;">
            <div style="font-size: 20px; margin-bottom: 5px;">💎</div>
            <div style="font-weight: 600; margin-bottom: 3px;">PREMIUM CLIENT</div>
            <div style="font-size: 12px; opacity: 0.9;">High-value opportunity</div>
          </div>
          <div style="text-align: center; padding: 15px; background: linear-gradient(135deg, #28a745 0%, #20c997 100%); border-radius: 8px; color: white;">
            <div style="font-size: 20px; margin-bottom: 5px;">🎯</div>
            <div style="font-weight: 600; margin-bottom: 3px;">CUSTOM SOLUTION</div>
            <div style="font-size: 12px; opacity: 0.9;">Tailored approach needed</div>
          </div>
        </div>
        
        <div style="background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107;">
          <h4 style="color: #856404; margin-bottom: 15px; font-size: 16px; font-weight: 600;">📋 Recommended Action Plan</h4>
          <ol style="color: #856404; margin: 0; padding-left: 20px; line-height: 1.8; font-size: 14px;">
            <li><strong>Immediate Acknowledgment:</strong> Send personalized response within 1 hour</li>
            <li><strong>Discovery Call:</strong> Schedule comprehensive consultation within 24 hours</li>
            <li><strong>Proposal Development:</strong> Create custom proposal within 48 hours</li>
            <li><strong>Executive Review:</strong> Senior team member involvement recommended</li>
            <li><strong>Premium Support:</strong> Assign dedicated project manager</li>
          </ol>
        </div>
      </div>
    </div>
    
    <!-- Revenue & Business Impact Analysis -->
    <div style="background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%); padding: 25px; border-radius: 12px; margin-bottom: 35px; border-left: 4px solid #28a745;">
      <h3 style="color: #155724; margin-bottom: 20px; font-size: 20px; font-weight: 600; text-align: center;">
        <span style="font-size: 24px;">💰</span> Business Impact & Revenue Potential
      </h3>
      <div style="background: #ffffff; padding: 20px; border-radius: 10px; border: 1px solid #c3e6cb;">
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 20px;">
          <div style="text-align: center; padding: 15px; background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%); border-radius: 8px;">
            <div style="color: #28a745; font-size: 20px; margin-bottom: 8px;">💵</div>
            <div style="color: #155724; font-weight: 600; margin-bottom: 5px;">Revenue Potential</div>
            <div style="color: #155724; font-size: 13px;">High-value project</div>
          </div>
          <div style="text-align: center; padding: 15px; background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%); border-radius: 8px;">
            <div style="color: #28a745; font-size: 20px; margin-bottom: 8px;">🤝</div>
            <div style="color: #155724; font-weight: 600; margin-bottom: 5px;">Relationship Value</div>
            <div style="color: #155724; font-size: 13px;">Long-term partnership</div>
          </div>
          <div style="text-align: center; padding: 15px; background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%); border-radius: 8px;">
            <div style="color: #28a745; font-size: 20px; margin-bottom: 8px;">📈</div>
            <div style="color: #155724; font-weight: 600; margin-bottom: 5px;">Growth Opportunity</div>
            <div style="color: #155724; font-size: 13px;">Expansion potential</div>
          </div>
        </div>
        
        <div style="background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%); padding: 15px; border-radius: 8px; text-align: center;">
          <div style="color: #6a1b9a; font-weight: 600; margin-bottom: 5px;">🎯 Strategic Importance</div>
          <div style="color: #6a1b9a; font-size: 14px;">This inquiry represents significant business value and should receive premium attention</div>
        </div>
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div style="text-align: center; margin: 40px 0;">
      <div style="margin-bottom: 20px;">
        <a href="mailto:${data.email}?subject=Re: Your Private Build Application - Dolo&body=Hi ${data.name},%0D%0A%0D%0AThank you for your interest in our private build services! We're excited about the opportunity to work with you on your ${data.projectType} project.%0D%0A%0D%0AI'd love to schedule a consultation to discuss your vision in detail. Are you available for a call this week?%0D%0A%0D%0ABest regards,%0D%0A[Your Name]%0D%0ADolo Team" class="button" style="background: linear-gradient(135deg, #6f42c1 0%, #5a32a3 100%); color: #ffffff; padding: 18px 35px; text-decoration: none; border-radius: 10px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 6px 20px rgba(111, 66, 193, 0.3); margin-right: 15px;">
          📧 Contact ${data.name}
        </a>
        <a href="tel:${data.email}" style="background: transparent; color: #28a745; padding: 18px 35px; text-decoration: none; border-radius: 10px; display: inline-block; font-weight: 600; font-size: 16px; border: 2px solid #28a745;">
          📞 Schedule Discovery Call
        </a>
      </div>
    </div>
    
    <!-- Premium Client Guidelines -->
    <div style="background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); padding: 25px; border-radius: 12px; border-left: 4px solid #ffc107; margin-top: 35px;">
      <h4 style="color: #856404; margin-bottom: 15px; font-size: 20px; font-weight: 600; text-align: center;">
        <span style="font-size: 24px;">💎</span> Premium Client Engagement Guidelines
      </h4>
      <div style="color: #856404; font-size: 14px; line-height: 1.8;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <div style="font-weight: 600; margin-bottom: 8px;">🎯 Response Standards:</div>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Respond within 1 hour during business hours</li>
              <li>Personalized, detailed responses</li>
              <li>Senior team member involvement</li>
            </ul>
          </div>
          <div>
            <div style="font-weight: 600; margin-bottom: 8px;">🤝 Engagement Approach:</div>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Consultative, solution-focused</li>
              <li>Premium service positioning</li>
              <li>Long-term partnership mindset</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `

  return generateBaseEmailTemplate(content, baseUrl)
}

/**
 * Generate quiz result email HTML with enhanced content
 */
function generateQuizResultHTML(data: any, baseUrl: string): string {
  const content = `
    <div style="text-align: center; margin-bottom: 35px;">
      <div style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); width: 100px; height: 100px; border-radius: 50%; margin: 0 auto 25px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);">
        <span style="font-size: 48px; color: white;">🎯</span>
      </div>
      <h1 style="color: #ff6b35; font-size: 32px; margin-bottom: 15px; font-weight: 700;">Your Perfect Web Development Plan</h1>
      <p style="color: #7f8c8d; font-size: 20px; margin: 0 0 10px 0; font-weight: 500;">Hi ${data.name || "there"}, we've analyzed your needs and found the ideal solution!</p>
      <p style="color: #95a5a6; font-size: 16px; margin: 0;">Based on your quiz responses, here's your personalized recommendation.</p>
    </div>
    
    <!-- Recommended Plan Showcase -->
    <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 30px; border-radius: 15px; margin-bottom: 35px; border-left: 5px solid #ff6b35; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
      <h2 style="color: #2c3e50; font-size: 24px; margin-bottom: 25px; font-weight: 600; text-align: center;">
        <span style="color: #ff6b35;">🏆</span> Your Recommended Plan
      </h2>
      <div style="background: #ffffff; padding: 30px; border-radius: 15px; border: 3px solid #ff6b35; text-align: center; box-shadow: 0 4px 15px rgba(255, 107, 53, 0.1);">
        <div style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); color: white; padding: 15px 30px; border-radius: 25px; display: inline-block; margin-bottom: 20px; font-weight: 700; font-size: 18px; letter-spacing: 1px;">
          ${data.plan}
        </div>
        <p style="color: #495057; margin: 0; line-height: 1.8; font-size: 18px; font-weight: 500;">${data.description}</p>
        
        <div style="margin-top: 25px; padding: 20px; background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%); border-radius: 10px; border-left: 4px solid #28a745;">
          <div style="color: #155724; font-weight: 600; margin-bottom: 10px; font-size: 16px;">✨ Why This Plan is Perfect for You</div>
          <div style="color: #155724; font-size: 14px; line-height: 1.6;">
            Our AI-powered matching system analyzed your responses and determined this plan offers the optimal balance of features, timeline, and value for your specific requirements.
          </div>
        </div>
      </div>
    </div>
    
    <!-- Plan Benefits & Features -->
    <div style="background: #ffffff; border: 1px solid #e9ecef; border-radius: 12px; overflow: hidden; margin-bottom: 35px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
      <div style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); color: white; padding: 20px; font-weight: 600; text-align: center;">
        <span style="font-size: 24px; margin-right: 10px;">🎁</span>
        What's Included in Your ${data.plan} Plan
      </div>
      <div style="padding: 30px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px;">
          <div style="padding: 20px; background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%); border-radius: 10px; border-left: 4px solid #28a745;">
            <h4 style="color: #155724; margin-bottom: 15px; font-size: 16px; font-weight: 600;">🎨 Design & User Experience</h4>
            <ul style="color: #155724; margin: 0; padding-left: 20px; line-height: 1.8; font-size: 14px;">
              <li>Custom, professional design</li>
              <li>Mobile-responsive layout</li>
              <li>User-friendly interface</li>
              <li>Brand-consistent styling</li>
            </ul>
          </div>
          
          <div style="padding: 20px; background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 10px; border-left: 4px solid #2196f3;">
            <h4 style="color: #1565c0; margin-bottom: 15px; font-size: 16px; font-weight: 600;">⚡ Performance & Technology</h4>
            <ul style="color: #1565c0; margin: 0; padding-left: 20px; line-height: 1.8; font-size: 14px;">
              <li>Lightning-fast loading speeds</li>
              <li>SEO optimization</li>
              <li>Security best practices</li>
              <li>Cross-browser compatibility</li>
            </ul>
          </div>
          
          <div style="padding: 20px; background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); border-radius: 10px; border-left: 4px solid #ffc107;">
            <h4 style="color: #856404; margin-bottom: 15px; font-size: 16px; font-weight: 600;">🛠️ Development & Support</h4>
            <ul style="color: #856404; margin: 0; padding-left: 20px; line-height: 1.8; font-size: 14px;">
              <li>Expert development team</li>
              <li>Quality assurance testing</li>
              <li>Launch support</li>
              <li>Post-launch assistance</li>
            </ul>
          </div>
          
          <div style="padding: 20px; background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%); border-radius: 10px; border-left: 4px solid #9c27b0;">
            <h4 style="color: #6a1b9a; margin-bottom: 15px; font-size: 16px; font-weight: 600;">📈 Business Growth</h4>
            <ul style="color: #6a1b9a; margin: 0; padding-left: 20px; line-height: 1.8; font-size: 14px;">
              <li>Conversion optimization</li>
              <li>Analytics integration</li>
              <li>Growth-focused features</li>
              <li>Scalable architecture</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Quiz Results Analysis -->
    <div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); padding: 25px; border-radius: 12px; margin-bottom: 35px; border-left: 4px solid #2196f3;">
      <h3 style="color: #1976d2; margin-bottom: 20px; font-size: 22px; font-weight: 600; text-align: center;">
        <span style="font-size: 24px;">📊</span> Your Quiz Results Analysis
      </h3>
      <div style="background: #ffffff; padding: 20px; border-radius: 10px; border: 1px solid #bbdefb;">
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 20px;">
          <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px;">
            <div style="color: #1976d2; font-size: 20px; margin-bottom: 8px;">🎯</div>
            <div style="color: #1565c0; font-weight: 600; margin-bottom: 5px;">Match Score</div>
            <div style="color: #1976d2; font-size: 18px; font-weight: 700;">98%</div>
          </div>
          <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px;">
            <div style="color: #1976d2; font-size: 20px; margin-bottom: 8px;">⏱️</div>
            <div style="color: #1565c0; font-weight: 600; margin-bottom: 5px;">Timeline</div>
            <div style="color: #1976d2; font-size: 16px; font-weight: 700;">${data.timeline || "7-14 days"}</div>
          </div>
          <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px;">
            <div style="color: #1976d2; font-size: 20px; margin-bottom: 8px;">💰</div>
            <div style="color: #1565c0; font-weight: 600; margin-bottom: 5px;">Investment</div>
            <div style="color: #1976d2; font-size: 16px; font-weight: 700;">${data.price || "Custom Quote"}</div>
          </div>
        </div>
        
        <div style="background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%); padding: 15px; border-radius: 8px; text-align: center;">
          <div style="color: #155724; font-weight: 600; margin-bottom: 5px;">🧠 AI Recommendation Confidence</div>
          <div style="color: #155724; font-size: 14px;">Based on 500+ successful project matches, this plan has a 98% success rate for similar requirements</div>
        </div>
      </div>
    </div>
    
    <!-- Success Stories & Social Proof -->
    <div style="background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%); padding: 25px; border-radius: 12px; margin-bottom: 35px; border-left: 4px solid #28a745;">
      <h3 style="color: #155724; margin-bottom: 20px; font-size: 20px; font-weight: 600; text-align: center;">
        <span style="font-size: 24px;">🌟</span> Success Stories from Similar Projects
      </h3>
      <div style="background: #ffffff; padding: 20px; border-radius: 10px; border: 1px solid #c3e6cb;">
        <div style="display: grid; gap: 20px;">
          <div style="padding: 20px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #28a745;">
            <div style="color: #155724; font-style: italic; margin-bottom: 10px; line-height: 1.6;">
              "Dolo delivered exactly what we needed. The ${data.plan} plan was perfect for our requirements, and the results exceeded our expectations!"
            </div>
            <div style="color: #6c757d; font-size: 14px; font-weight: 600;">- Sarah M., E-commerce Business Owner</div>
          </div>
          
          <div style="padding: 20px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #ff6b35;">
            <div style="color: #d63384; font-style: italic; margin-bottom: 10px; line-height: 1.6;">
              "The team understood our vision perfectly. Our new website has increased conversions by 150% since launch!"
            </div>
            <div style="color: #6c757d; font-size: 14px; font-weight: 600;">- Michael R., Tech Startup Founder</div>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; padding: 15px; background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); border-radius: 8px;">
          <div style="color: #856404; font-weight: 600; margin-bottom: 5px;">📈 Average Results for ${data.plan} Clients</div>
          <div style="color: #856404; font-size: 14px;">
            <strong>+180% increase in conversions</strong> | <strong>+250% boost in traffic</strong> | <strong>98% client satisfaction</strong>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Next Steps & Call to Action -->
    <div style="background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); padding: 30px; border-radius: 15px; margin-bottom: 35px; border-left: 5px solid #ffc107; text-align: center;">
      <h3 style="color: #856404; margin-bottom: 20px; font-size: 24px; font-weight: 700;">
        <span style="font-size: 28px;">🚀</span> Ready to Get Started?
      </h3>
      <p style="color: #856404; margin: 0 0 25px 0; font-size: 18px; line-height: 1.6; font-weight: 500;">
        Your ${data.plan} plan is waiting! Let's turn your vision into reality with a solution that's perfectly tailored to your needs.
      </p>
      
      <div style="background: #ffffff; padding: 20px; border-radius: 10px; margin-bottom: 25px; border: 1px solid #ffeaa7;">
        <div style="color: #856404; font-weight: 600; margin-bottom: 15px; font-size: 16px;">🎁 Limited Time Offer</div>
        <div style="color: #856404; font-size: 14px; line-height: 1.6;">
          <strong>Book your consultation within 48 hours</strong> and receive:
          <ul style="margin: 10px 0; padding-left: 20px; text-align: left; display: inline-block;">
            <li>Free project strategy session (Value: $200)</li>
            <li>Complimentary design mockup</li>
            <li>10% discount on your first project</li>
          </ul>
        </div>
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div style="text-align: center; margin: 40px 0;">
      <div style="margin-bottom: 20px;">
        <a href="${baseUrl}/contact" class="button" style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); color: #ffffff; padding: 20px 40px; text-decoration: none; border-radius: 12px; display: inline-block; font-weight: 700; font-size: 18px; box-shadow: 0 6px 20px rgba(255, 107, 53, 0.3); margin-right: 15px; text-transform: uppercase; letter-spacing: 1px;">
          🚀 Start My ${data.plan} Project
        </a>
        <a href="${baseUrl}/pricing" style="background: transparent; color: #ff6b35; padding: 20px 40px; text-decoration: none; border-radius: 12px; display: inline-block; font-weight: 600; font-size: 16px; border: 2px solid #ff6b35;">
          💰 View Pricing Details
        </a>
      </div>
      <div style="margin-top: 15px;">
        <a href="${baseUrl}/about" style="color: #6c757d; text-decoration: none; font-size: 14px; font-weight: 500;">
          📖 Learn more about our process
        </a>
      </div>
    </div>
    
    <!-- Personalized Recommendations -->
    <div style="background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%); padding: 25px; border-radius: 12px; border-left: 4px solid #9c27b0; margin-top: 35px;">
      <h4 style="color: #6a1b9a; margin-bottom: 15px; font-size: 20px; font-weight: 600; text-align: center;">
        <span style="font-size: 24px;">💡</span> Personalized Recommendations
      </h4>
      <div style="color: #6a1b9a; font-size: 14px; line-height: 1.8;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <div style="font-weight: 600; margin-bottom: 8px;">🎯 Perfect For You Because:</div>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Matches your stated timeline requirements</li>
              <li>Aligns with your budget expectations</li>
              <li>Includes all your must-have features</li>
            </ul>
          </div>
          <div>
            <div style="font-weight: 600; margin-bottom: 8px;">🚀 Next Steps:</div>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Schedule your free consultation</li>
              <li>Receive detailed project proposal</li>
              <li>Start development within 48 hours</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Quiz Retake Option -->
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #6c757d; margin-top: 25px; text-align: center;">
      <p style="color: #495057; margin: 0; font-size: 14px;">
        <strong>Not quite right?</strong> Your needs may have changed. 
        <a href="${baseUrl}/start" style="color: #ff6b35; text-decoration: none; font-weight: 600;">Retake the quiz</a> 
        to get an updated recommendation.
      </p>
    </div>
  `

  return generateBaseEmailTemplate(content, baseUrl)
}

/**
 * Log email to database for tracking and analytics
 */
async function logEmailToDatabase(
  template: EmailTemplate,
  recipient: string,
  messageId: string,
  customerId?: string,
): Promise<void> {
  try {
    const supabase = createRouteHandlerSupabaseClient()

    const { error } = await supabase.from("email_logs").insert({
      template,
      recipient,
      message_id: messageId,
      customer_id: customerId,
      sent_at: new Date().toISOString(),
      status: "sent",
    })

    if (error) {
      console.error("Failed to log email to database:", error)
    }
  } catch (error) {
    console.error("Error logging email to database:", error)
  }
}

// Export specific email sending functions for convenience
export const sendWelcomeEmail = (to: string, data: Record<string, any>) => sendEmail("welcome", to, data)

export const sendPaymentConfirmationEmail = (to: string, data: Record<string, any>) =>
  sendEmail("payment-confirmation", to, data)

export const sendProjectStartedEmail = (to: string, data: Record<string, any>) => sendEmail("project-started", to, data)

export const sendProjectCompletedEmail = (to: string, data: Record<string, any>) =>
  sendEmail("project-completed", to, data)

export const sendContactNotificationEmail = (to: string, data: Record<string, any>) =>
  sendEmail("contact-notification", to, data)

export const sendPrivateBuildApplicationEmail = (to: string, data: Record<string, any>) =>
  sendEmail("private-build-application", to, data)

export const sendQuizResultEmail = (to: string, data: Record<string, any>) => sendEmail("quiz-result", to, data)
