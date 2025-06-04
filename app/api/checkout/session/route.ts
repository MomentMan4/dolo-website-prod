import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get("session_id")

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    return NextResponse.json({
      customer_email: session.customer_details?.email || "",
      customer_name: session.metadata?.customer_name || "",
      amount_total: session.amount_total || 0,
      plan: session.metadata?.plan || "",
      rush_delivery: session.metadata?.rush_delivery === "true",
    })
  } catch (error) {
    console.error("Error retrieving session:", error)
    return NextResponse.json({ error: "Failed to retrieve session" }, { status: 500 })
  }
}
