import crypto from "crypto"

/**
 * Verify Stripe webhook signature
 */
export function verifyStripeWebhook(payload: string, signature: string, secret: string): boolean {
  try {
    const elements = signature.split(",")
    const signatureElements: { [key: string]: string } = {}

    for (const element of elements) {
      const [key, value] = element.split("=")
      signatureElements[key] = value
    }

    const timestamp = signatureElements.t
    const v1 = signatureElements.v1

    if (!timestamp || !v1) {
      return false
    }

    // Check if timestamp is within tolerance (5 minutes)
    const timestampTolerance = 300 // 5 minutes
    const currentTime = Math.floor(Date.now() / 1000)
    if (Math.abs(currentTime - Number.parseInt(timestamp)) > timestampTolerance) {
      console.warn("Webhook timestamp outside tolerance")
      return false
    }

    // Verify signature
    const signedPayload = `${timestamp}.${payload}`
    const expectedSignature = crypto.createHmac("sha256", secret).update(signedPayload, "utf8").digest("hex")

    return crypto.timingSafeEqual(Buffer.from(v1, "hex"), Buffer.from(expectedSignature, "hex"))
  } catch (error) {
    console.error("Error verifying webhook signature:", error)
    return false
  }
}

/**
 * Rate limiting for webhook endpoints
 */
const webhookAttempts = new Map<string, { count: number; resetTime: number }>()

export function checkWebhookRateLimit(identifier: string, maxAttempts = 100, windowMs = 60000): boolean {
  const now = Date.now()
  const attempts = webhookAttempts.get(identifier)

  if (!attempts || now > attempts.resetTime) {
    webhookAttempts.set(identifier, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (attempts.count >= maxAttempts) {
    return false
  }

  attempts.count++
  return true
}

/**
 * Extract customer information from Stripe event
 */
export function extractCustomerInfo(event: any): {
  customerId?: string
  customerEmail?: string
  customerName?: string
} {
  let customerId: string | undefined
  let customerEmail: string | undefined
  let customerName: string | undefined

  // Extract from different event types
  if (event.data?.object) {
    const obj = event.data.object

    // Direct customer reference
    if (obj.customer) {
      customerId = typeof obj.customer === "string" ? obj.customer : obj.customer.id
    }

    // Customer email
    if (obj.customer_email) {
      customerEmail = obj.customer_email
    }

    // Customer details
    if (obj.customer_details) {
      customerEmail = customerEmail || obj.customer_details.email
      customerName = obj.customer_details.name
    }

    // Billing details
    if (obj.billing_details) {
      customerEmail = customerEmail || obj.billing_details.email
      customerName = customerName || obj.billing_details.name
    }

    // Receipt email
    if (obj.receipt_email) {
      customerEmail = customerEmail || obj.receipt_email
    }
  }

  return { customerId, customerEmail, customerName }
}
