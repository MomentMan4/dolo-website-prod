export interface ParsedRequest {
  method: "FormData" | "JSON" | "Text"
  contentType: string
  body: Record<string, any>
  files: File[]
  rawBody?: string
}

export interface RequestDiagnostics {
  url: string
  method: string
  headers: Record<string, string>
  contentType: string
  hasBody: boolean
  bodySize?: number
  timestamp: string
}

export function generateDiagnosticsReport(request: Request): RequestDiagnostics {
  const headers: Record<string, string> = {}
  request.headers.forEach((value, key) => {
    headers[key] = value
  })

  return {
    url: request.url,
    method: request.method,
    headers,
    contentType: request.headers.get("content-type") || "",
    hasBody: request.body !== null,
    timestamp: new Date().toISOString(),
  }
}

export async function parseRequest(request: Request): Promise<ParsedRequest> {
  console.log("=== REQUEST PARSER: Starting ===")

  // Clone the request to avoid body consumption issues
  const clonedRequest = request.clone()

  // Get content type with multiple detection methods
  const contentType = request.headers.get("content-type") || request.headers.get("Content-Type") || ""

  console.log("Content-Type detected:", contentType)
  console.log("All headers:", Object.fromEntries(request.headers.entries()))

  // Detect if this is multipart/form-data
  const isMultipart =
    contentType.includes("multipart/form-data") ||
    contentType.includes("multipart") ||
    contentType.includes("form-data") ||
    Array.from(request.headers.entries()).some(
      ([key, value]) => value.includes("boundary") || value.includes("multipart"),
    )

  // Detect if this is JSON
  const isJSON = contentType.includes("application/json") || contentType.includes("json")

  console.log("Detection results:", { isMultipart, isJSON, contentType })

  let body: Record<string, any> = {}
  const files: File[] = []
  let method: "FormData" | "JSON" | "Text" = "Text"
  let rawBody = ""

  try {
    if (isMultipart) {
      console.log("=== PARSING AS FORMDATA ===")
      const formData = await clonedRequest.formData()
      method = "FormData"

      console.log("FormData entries:")
      // Extract all form fields
      for (const [key, value] of formData.entries()) {
        console.log(`  ${key}:`, typeof value, value instanceof File ? `File(${value.name})` : `"${value}"`)

        if (value instanceof File) {
          files.push(value)
          console.log(`Added file: ${value.name} (${value.size} bytes)`)
        } else {
          // Handle form fields - ensure they're strings and trimmed
          const stringValue = String(value).trim()
          body[key] = stringValue
          console.log(`Added field: ${key} = "${stringValue}" (length: ${stringValue.length})`)
        }
      }

      console.log("Final extracted body:", body)
      console.log("Final extracted files:", files.length)
    } else if (isJSON) {
      console.log("=== PARSING AS JSON ===")
      const textBody = await clonedRequest.text()
      rawBody = textBody

      console.log("Raw JSON body:", textBody)

      if (textBody.trim()) {
        body = JSON.parse(textBody)
        method = "JSON"
        console.log("Parsed JSON body:", body)

        // Ensure all string fields are trimmed
        Object.keys(body).forEach((key) => {
          if (typeof body[key] === "string") {
            body[key] = body[key].trim()
          }
        })
      } else {
        throw new Error("Empty JSON body")
      }
    } else {
      console.log("=== PARSING AS TEXT ===")
      rawBody = await clonedRequest.text()

      console.log("Raw text body:", rawBody)

      // Try to parse as JSON if it looks like JSON
      if (rawBody.trim().startsWith("{") && rawBody.trim().endsWith("}")) {
        try {
          body = JSON.parse(rawBody)
          method = "JSON"
          console.log("Successfully parsed text as JSON:", body)

          // Ensure all string fields are trimmed
          Object.keys(body).forEach((key) => {
            if (typeof body[key] === "string") {
              body[key] = body[key].trim()
            }
          })
        } catch {
          console.log("Failed to parse text as JSON, treating as raw text")
          body = { rawText: rawBody }
          method = "Text"
        }
      } else {
        body = { rawText: rawBody }
        method = "Text"
      }
    }
  } catch (error) {
    console.error("Parsing error:", error)
    throw new Error(`Failed to parse request: ${error instanceof Error ? error.message : String(error)}`)
  }

  const result = {
    method,
    contentType,
    body,
    files,
    rawBody,
  }

  console.log("=== REQUEST PARSER: Complete ===")
  console.log("Final result:", {
    method: result.method,
    bodyKeys: Object.keys(result.body),
    bodyValues: Object.entries(result.body).map(([k, v]) => `${k}: "${v}" (${typeof v})`),
    fileCount: result.files.length,
    contentType: result.contentType,
  })

  return result
}
