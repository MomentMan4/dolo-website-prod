import Stripe from "stripe"
import { createRouteHandlerSupabaseClient } from "@/lib/supabase/client"

// Stripe Price IDs (Test Environment)
export const STRIPE_PRICES = {
  essential: {
    regular: "price_1RRMtDCzcgSdEvTrW7HX8SI7",
    rush: "price_1RRMudCzcgSdEvTr0BXtV1kB",
  },
  pro: {
    regular: "price_1RTTd1CzcgSdEvTr19qSNLpv",
    rush: "price_1RTTd1CzcgSdEvTrh8mdAmHp",
  },
  maintenance: {
    monthly: "price_1RRMvRCzcgSdEvTrELLhbyTN",
    annual: "price_1RRMvxCzcgSdEvTr8OywTzlb",
  },
  googleBusiness: {
    regular: "price_1RTTekCzcgSdEvTrysXFeN9N",
  },
  accessibility: {
    regular: "price_1RTTekCzcgSdEvTrysXFeN9N", // Placeholder - replace with actual price ID
  },
  privacy: {
    regular: "price_1RTTekCzcgSdEvTrysXFeN9N", // Placeholder - replace with actual price ID
  },
} as const

export type PlanType = "essential" | "pro" | "premier" | "private-build"
export type PriceType = "regular" | "rush" | "monthly" | "annual"

export function getPriceId(plan: PlanType, type: PriceType = "regular"): string {
  switch (plan) {
    case "essential":
      return STRIPE_PRICES.essential[type as keyof typeof STRIPE_PRICES.essential] || STRIPE_PRICES.essential.regular
    case "pro":
      return STRIPE_PRICES.pro[type as keyof typeof STRIPE_PRICES.pro] || STRIPE_PRICES.pro.regular
    case "premier":
      // Premier uses Pro pricing for now, can be updated when Premier prices are available
      return STRIPE_PRICES.pro[type as keyof typeof STRIPE_PRICES.pro] || STRIPE_PRICES.pro.regular
    case "private-build":
      // Private builds are custom pricing, handled separately
      return ""
    default:
      return STRIPE_PRICES.essential.regular
  }
}

export function getPlanDetails(plan: PlanType) {
  const planPrices = {
    essential: 499.99,
    pro: 849.99,
    premier: 1199.99,
    "private-build": 0,
  }

  return {
    price: planPrices[plan] || 0,
    name: plan.charAt(0).toUpperCase() + plan.slice(1),
  }
}

export async function createCustomerWithChatAccess(
  stripeCustomerId: string,
  customerData: {
    email: string
    name: string
    company?: string
    phone?: string
  },
) {
  const supabase = createRouteHandlerSupabaseClient()

  // Generate unique chat access token
  const chatAccessToken = generateUniqueToken()
  const expiresAt = new Date()
  expiresAt.setMonth(expiresAt.getMonth() + 6) // 6 months access

  const { data, error } = await supabase
    .from("customers")
    .insert({
      stripe_customer_id: stripeCustomerId,
      email: customerData.email,
      name: customerData.name,
      company: customerData.company,
      phone: customerData.phone,
      chat_access_token: chatAccessToken,
      chat_access_expires_at: expiresAt.toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating customer:", error)
    throw new Error("Failed to create customer")
  }

  return data
}

export async function createProject(
  customerId: string,
  projectData: {
    project_type: PlanType
    stripe_payment_intent_id?: string
    total_amount: number
    rush_fee_applied?: boolean
    add_ons?: Record<string, any>
    project_details?: Record<string, any>
  },
) {
  const supabase = createRouteHandlerSupabaseClient()

  const { data, error } = await supabase
    .from("projects")
    .insert({
      customer_id: customerId,
      ...projectData,
      status: "pending",
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating project:", error)
    throw new Error("Failed to create project")
  }

  return data
}

function generateUniqueToken(): string {
  return `chat_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function createCheckoutSession(
  plan: PlanType,
  customerData: {
    email: string
    name: string
    company?: string
    phone?: string
  },
  options: {
    rushDelivery?: boolean
    addOns?: string[]
    successUrl: string
    cancelUrl: string
    projectDetails?: Record<string, any>
    rushDeliveryFee?: number
  },
) {
  const priceId = getPriceId(plan, options.rushDelivery ? "rush" : "regular")

  if (!priceId && plan !== "private-build") {
    throw new Error(`No price ID found for plan: ${plan}`)
  }

  // Create or retrieve Stripe customer
  const customer = await stripe.customers.create({
    email: customerData.email,
    name: customerData.name,
    metadata: {
      company: customerData.company || "",
      phone: customerData.phone || "",
      plan: plan,
      rush_delivery: options.rushDelivery ? "true" : "false",
      project_details: JSON.stringify(options.projectDetails || {}),
    },
  })

  // Check if maintenance is included and if it's yearly
  const hasMaintenance = options.addOns?.includes("maintenance") || false
  const isYearlyMaintenance = options.projectDetails?.yearlyMaintenance === true

  // Determine if we need subscription mode
  const needsSubscription = hasMaintenance && !isYearlyMaintenance

  // Create session parameters
  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    customer: customer.id,
    mode: needsSubscription ? "subscription" : "payment", // Use subscription mode if needed
    success_url: options.successUrl,
    cancel_url: options.cancelUrl,
    submit_type: "pay", // This ensures "Pay" instead of "Subscribe"
    metadata: {
      plan: plan,
      customer_name: customerData.name,
      customer_email: customerData.email,
      rush_delivery: options.rushDelivery ? "true" : "false",
      project_details: JSON.stringify(options.projectDetails || {}),
      add_ons: JSON.stringify(options.addOns || []),
    },
    line_items: [],
  }

  if (plan === "private-build") {
    // Private builds use custom pricing
    sessionParams.line_items = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Private Build Consultation",
            description: "Custom website development consultation",
          },
          unit_amount: 0, // Will be updated after consultation
        },
        quantity: 1,
      },
    ]
  } else {
    // Add main plan price
    sessionParams.line_items!.push({
      price: priceId,
      quantity: 1,
    })

    // Add add-ons
    if (options.addOns) {
      // First, add all non-maintenance add-ons
      for (const addOn of options.addOns) {
        if (addOn === "maintenance") continue // Handle maintenance separately

        let addOnPriceId = ""

        switch (addOn) {
          case "googleBusiness":
            addOnPriceId = STRIPE_PRICES.googleBusiness.regular
            break
          case "accessibility":
            addOnPriceId = STRIPE_PRICES.accessibility.regular
            break
          case "privacy":
            addOnPriceId = STRIPE_PRICES.privacy.regular
            break
        }

        if (addOnPriceId) {
          sessionParams.line_items!.push({
            price: addOnPriceId,
            quantity: 1,
          })
        }
      }

      // Now handle maintenance separately
      if (hasMaintenance) {
        if (needsSubscription) {
          // Monthly maintenance as a subscription
          sessionParams.line_items!.push({
            price: STRIPE_PRICES.maintenance.monthly,
            quantity: 1,
          })
        } else if (isYearlyMaintenance) {
          // Yearly maintenance as a one-time payment
          // Create a custom price for the yearly amount
          sessionParams.line_items!.push({
            price_data: {
              currency: "usd",
              product_data: {
                name: "Website Maintenance - Annual Plan",
                description: "12 months of website maintenance (10% discount applied)",
              },
              unit_amount: Math.round(49.99 * 12 * 0.9 * 100), // Convert to cents with 10% discount
            },
            quantity: 1,
          })
        }
      }
    }
  }

  const session = await stripe.checkout.sessions.create(sessionParams)

  return {
    sessionId: session.id,
    url: session.url,
    customerId: customer.id,
  }
}
