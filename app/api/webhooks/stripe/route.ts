import { headers } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { stripe, createCustomerWithChatAccess, createProject } from "@/lib/stripe"
import { sendEmail } from "@/lib/resend"
import type Stripe from "stripe"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = headers().get("stripe-signature")

  if (!signature) {
    console.error("Missing Stripe signature")
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  console.log(`Received Stripe webhook: ${event.type}`)

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case "payment_intent.succeeded":
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent)
        break

      case "customer.created":
        await handleCustomerCreated(event.data.object as Stripe.Customer)
        break

      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error(`Webhook handler error for ${event.type}:`, error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log("Processing checkout completion:", session.id)

  if (!session.customer || !session.metadata) {
    console.error("Missing customer or metadata in session:", session.id)
    return
  }

  const customerId = session.customer as string

  try {
    const customer = (await stripe.customers.retrieve(customerId)) as Stripe.Customer

    if (!customer.email) {
      console.error("Customer email not found for session:", session.id)
      return
    }

    // Parse project details from metadata
    let projectDetails = {}
    try {
      projectDetails = JSON.parse(session.metadata.project_details || "{}")
    } catch (e) {
      console.warn("Failed to parse project details for session:", session.id, e)
    }

    // Create customer in our database with chat access
    const dbCustomer = await createCustomerWithChatAccess(customerId, {
      email: customer.email,
      name: customer.name || session.metadata.customer_name || "",
      company: customer.metadata?.company,
      phone: customer.metadata?.phone,
    })

    // Create project record
    const project = await createProject(dbCustomer.id, {
      project_type: session.metadata.plan as any,
      stripe_payment_intent_id: session.payment_intent as string,
      total_amount: (session.amount_total || 0) / 100,
      rush_fee_applied: session.metadata.rush_delivery === "true",
      project_details: {
        session_id: session.id,
        customer_metadata: customer.metadata,
        form_data: projectDetails,
        payment_details: {
          amount_total: session.amount_total,
          currency: session.currency,
          payment_status: session.payment_status,
        },
      },
    })

    // Send welcome email with enhanced data
    await sendWelcomeEmail({
      customerEmail: customer.email,
      customerName: dbCustomer.name,
      projectType: session.metadata.plan,
      chatAccessToken: dbCustomer.chat_access_token,
      projectDetails: projectDetails,
      customerId: dbCustomer.id,
      projectId: project.id,
      amount: (session.amount_total || 0) / 100,
      rushDelivery: session.metadata.rush_delivery === "true",
    })

    console.log("Successfully processed checkout completion for customer:", dbCustomer.id)
  } catch (error) {
    console.error("Error processing checkout completion:", error)
    // Don't throw - we want to acknowledge the webhook even if our processing fails
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log("Processing payment success:", paymentIntent.id)

  try {
    // Get customer information
    const customerId = paymentIntent.customer as string
    if (!customerId) {
      console.log("No customer associated with payment intent:", paymentIntent.id)
      return
    }

    const customer = (await stripe.customers.retrieve(customerId)) as Stripe.Customer
    if (!customer.email) {
      console.error("Customer email not found for payment intent:", paymentIntent.id)
      return
    }

    // Check if this is a standalone payment (not part of checkout session)
    const sessions = await stripe.checkout.sessions.list({
      payment_intent: paymentIntent.id,
      limit: 1,
    })

    if (sessions.data.length === 0) {
      // This is a standalone payment - send welcome email
      await sendWelcomeEmail({
        customerEmail: customer.email,
        customerName: customer.name || "Valued Customer",
        projectType: paymentIntent.metadata?.plan || "custom",
        customerId: customerId,
        amount: paymentIntent.amount / 100,
        paymentIntentId: paymentIntent.id,
      })

      console.log("Sent welcome email for standalone payment:", paymentIntent.id)
    } else {
      console.log(
        "Payment intent is part of checkout session, welcome email will be sent via checkout.session.completed",
      )
    }
  } catch (error) {
    console.error("Error processing payment success:", error)
    // Don't throw - we want to acknowledge the webhook
  }
}

async function handleCustomerCreated(customer: Stripe.Customer) {
  console.log("Customer created:", customer.id)
  // Log customer creation for analytics
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log("Invoice payment succeeded:", invoice.id)

  try {
    const customerId = invoice.customer as string
    if (!customerId) return

    const customer = (await stripe.customers.retrieve(customerId)) as Stripe.Customer
    if (!customer.email) return

    // Send payment confirmation for recurring payments
    await sendEmail("payment-confirmation", customer.email, {
      customerName: customer.name || "Valued Customer",
      amount: (invoice.amount_paid || 0) / 100,
      invoiceNumber: invoice.number,
      customerId: customerId,
    })

    console.log("Sent payment confirmation for invoice:", invoice.id)
  } catch (error) {
    console.error("Error processing invoice payment:", error)
  }
}

// Enhanced welcome email function with retry logic
async function sendWelcomeEmail(data: {
  customerEmail: string
  customerName: string
  projectType: string
  chatAccessToken?: string
  projectDetails?: any
  customerId: string
  projectId?: string
  amount: number
  rushDelivery?: boolean
  paymentIntentId?: string
}) {
  const maxRetries = 3
  let attempt = 0

  while (attempt < maxRetries) {
    try {
      // Send welcome email
      const welcomeResult = await sendEmail("welcome", data.customerEmail, {
        customerName: data.customerName,
        projectType: data.projectType,
        chatAccessToken: data.chatAccessToken,
        projectDetails: data.projectDetails,
        customerId: data.customerId,
      })

      // Send payment confirmation
      const confirmationResult = await sendEmail("payment-confirmation", data.customerEmail, {
        customerName: data.customerName,
        projectType: data.projectType,
        amount: data.amount,
        rushDelivery: data.rushDelivery,
        projectId: data.projectId,
        customerId: data.customerId,
      })

      console.log("Welcome emails sent successfully:", {
        welcome: welcomeResult.success,
        confirmation: confirmationResult.success,
        customer: data.customerEmail,
      })

      // If we get here, emails were sent successfully
      break
    } catch (error) {
      attempt++
      console.error(`Welcome email attempt ${attempt} failed:`, error)

      if (attempt >= maxRetries) {
        console.error("Failed to send welcome email after all retries:", {
          customer: data.customerEmail,
          error: error,
        })

        // Log the failure for manual follow-up
        await logEmailFailure(data.customerEmail, data.customerId, error)
      } else {
        // Wait before retrying (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000))
      }
    }
  }
}

// Log email failures for manual follow-up
async function logEmailFailure(email: string, customerId: string, error: any) {
  try {
    const { createRouteHandlerSupabaseClient } = await import("@/lib/supabase/client")
    const supabase = createRouteHandlerSupabaseClient()

    await supabase.from("email_logs").insert({
      customer_id: customerId,
      email_type: "welcome_failed",
      recipient_email: email,
      status: "failed",
      error_message: error instanceof Error ? error.message : String(error),
    })
  } catch (logError) {
    console.error("Failed to log email failure:", logError)
  }
}
