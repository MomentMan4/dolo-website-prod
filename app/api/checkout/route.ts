import { type NextRequest, NextResponse } from "next/server"
import { createCheckoutSession } from "@/lib/stripe"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { plan, customerData, options } = body

    if (!plan || !customerData || !customerData.email || !customerData.name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const session = await createCheckoutSession(plan, customerData, {
      rushDelivery: options?.rushDelivery || false,
      addOns: options?.addOns || [],
      successUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
    })

    return NextResponse.json({
      sessionId: session.sessionId,
      url: session.url,
    })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
