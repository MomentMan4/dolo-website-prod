import { type NextRequest, NextResponse } from "next/server"
import { generateDiagnosticsReport } from "@/lib/request-parser"

export async function POST(request: NextRequest) {
  try {
    console.log("=== CONTACT DEBUG API: Request received ===")

    // Generate comprehensive diagnostics
    const diagnostics = generateDiagnosticsReport(request)

    // Try to read the body safely
    let bodyInfo = "Unable to read body"
    try {
      const clonedRequest = request.clone()
      const text = await clonedRequest.text()
      bodyInfo = {
        length: text.length,
        preview: text.substring(0, 500),
        startsWithBrace: text.trim().startsWith("{"),
        endsWithBrace: text.trim().endsWith("}"),
        isEmpty: text.trim().length === 0,
      }
    } catch (bodyError) {
      bodyInfo = `Body read error: ${bodyError instanceof Error ? bodyError.message : String(bodyError)}`
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      diagnostics,
      bodyInfo,
      requestInfo: {
        url: request.url,
        method: request.method,
        headers: Object.fromEntries(request.headers.entries()),
      },
    })
  } catch (error) {
    console.error("Debug API error:", error)
    return NextResponse.json(
      {
        error: "Debug API failed",
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
