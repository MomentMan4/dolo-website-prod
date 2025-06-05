import { headers } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { stripe, createCustomerWithChatAccess, createProject } from "@/lib/stripe"
import { sendEmail } from "@/lib/resend"
import type Stripe from "stripe"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = headers().get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

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

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook handler error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log("Checkout completed:", session.id)

  if (!session.customer || !session.metadata) {
    console.error("Missing customer or metadata in session")
    return
  }

  const customerId = session.customer as string
  const customer = (await stripe.customers.retrieve(customerId)) as Stripe.Customer

  if (!customer.email) {
    console.error("Customer email not found")
    return
  }

  try {
    // Parse project details from metadata
    let projectDetails = {}
    try {
      projectDetails = JSON.parse(session.metadata.project_details || "{}")
    } catch (e) {
      console.warn("Failed to parse project details:", e)
    }

    // Create customer in our database with chat access
    const dbCustomer = await createCustomerWithChatAccess(customerId, {
      email: customer.email,
      name: customer.name || session.metadata.customer_name || "",
      company: customer.metadata?.company,
      phone: customer.metadata?.phone,
    })

    // Create project record with enhanced details
    const project = await createProject(dbCustomer.id, {
      project_type: session.metadata.plan as any,
      stripe_payment_intent_id: session.payment_intent as string,
      total_amount: (session.amount_total || 0) / 100, // Convert from cents
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

    console.log("Attempting to send welcome email to:", customer.email)

    // Send welcome email with chat access
    const welcomeEmailResult = await sendEmail(
      "welcome",
      customer.email,
      {
        customerName: dbCustomer.name,
        projectType: session.metadata.plan,
        chatAccessToken: dbCustomer.chat_access_token,
        projectDetails: projectDetails,
        amount: (session.amount_total || 0) / 100,
        rushDelivery: session.metadata.rush_delivery === "true",
        projectId: project.id,
      },
      dbCustomer.id,
    )

    if (!welcomeEmailResult.success) {
      console.error("Failed to send welcome email:", welcomeEmailResult.error)
    } else {
      console.log("Welcome email sent successfully:", welcomeEmailResult.messageId)
    }

    console.log("Attempting to send payment confirmation email to:", customer.email)

    // Send payment confirmation
    const confirmationEmailResult = await sendEmail(
      "payment-confirmation",
      customer.email,
      {
        customerName: dbCustomer.name,
        projectType: session.metadata.plan,
        amount: (session.amount_total || 0) / 100,
        rushDelivery: session.metadata.rush_delivery === "true",
        projectId: project.id,
      },
      dbCustomer.id,
    )

    if (!confirmationEmailResult.success) {
      console.error("Failed to send payment confirmation email:", confirmationEmailResult.error)
    } else {
      console.log("Payment confirmation email sent successfully:", confirmationEmailResult.messageId)
    }

    // Log email attempts to database
    // await logEmailToDatabase(
    //   dbCustomer.id,
    //   "welcome",
    //   customer.email,
    //   welcomeEmailResult.success,
    //   welcomeEmailResult.messageId,
    //   welcomeEmailResult.error,
    // )

    // await logEmailToDatabase(
    //   dbCustomer.id,
    //   "payment-confirmation",
    //   customer.email,
    //   confirmationEmailResult.success,
    //   confirmationEmailResult.messageId,
    //   confirmationEmailResult.error,
    // )

    console.log("Successfully processed checkout completion for customer:", dbCustomer.id)
  } catch (error) {
    console.error("Error processing checkout completion:", error)
    // Still attempt to send a basic email even if database operations fail
    try {
      await sendEmail("payment-confirmation", customer.email, {
        customerName: customer.name || "Valued Customer",
        projectType: session.metadata.plan || "Website Development",
        amount: (session.amount_total || 0) / 100,
        rushDelivery: session.metadata.rush_delivery === "true",
        projectId: "TEMP-" + session.id,
      })
      console.log("Fallback email sent successfully")
    } catch (emailError) {
      console.error("Failed to send fallback email:", emailError)
    }
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log("Payment succeeded:", paymentIntent.id)
  // Additional payment processing logic if needed
}

async function handleCustomerCreated(customer: Stripe.Customer) {
  console.log("Customer created:", customer.id)
  // Additional customer creation logic if needed
}
