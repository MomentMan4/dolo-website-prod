import { contactErrorHandler } from "./contact-error-handler"

interface ContactFormData {
  name: string
  email: string
  contactReason: string
  stage: string
  message: string
}

interface ApiResponse {
  success: boolean
  requestId?: string
  message?: string
  details?: any
  error?: string
  suggestions?: string[]
}

export class ContactApiClient {
  private static instance: ContactApiClient
  private baseUrl: string

  constructor() {
    this.baseUrl = typeof window !== "undefined" ? window.location.origin : ""
  }

  static getInstance(): ContactApiClient {
    if (!ContactApiClient.instance) {
      ContactApiClient.instance = new ContactApiClient()
    }
    return ContactApiClient.instance
  }

  async submitContactForm(data: ContactFormData): Promise<ApiResponse> {
    const requestId = Math.random().toString(36).substring(7)

    console.log(`=== CONTACT API CLIENT [${requestId}]: Starting submission ===`)
    console.log("Form data:", data)

    try {
      return await contactErrorHandler.retryWithBackoff(async () => {
        return await this.makeApiCall(data, requestId)
      })
    } catch (error) {
      // Check if this is a non-retryable error
      if (error instanceof Error && (error as any).shouldNotRetry) {
        console.log(`Non-retryable error [${requestId}]:`, error.message)
        throw error
      }

      const contactError = contactErrorHandler.createError(
        "network",
        "SUBMISSION_FAILED",
        "Failed to submit contact form after retries",
        {
          originalError: error instanceof Error ? error.message : String(error),
          errorType: error instanceof Error ? error.constructor.name : typeof error,
        },
        requestId,
      )

      contactErrorHandler.logError(contactError)
      throw error
    }
  }

  private async makeApiCall(data: ContactFormData, requestId: string): Promise<ApiResponse> {
    console.log(`=== API CALL [${requestId}]: Making request ===`)

    // Prepare the payload
    const payload = this.preparePayload(data)
    console.log("API payload:", payload)

    // Validate payload before sending
    this.validatePayload(payload)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      console.log(`Request timeout [${requestId}] - aborting`)
      controller.abort()
    }, 30000) // 30 second timeout

    try {
      const response = await fetch(`${this.baseUrl}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Request-ID": requestId,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      console.log(`API Response [${requestId}]:`, {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url,
        ok: response.ok,
      })

      return await this.handleResponse(response, requestId)
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          const timeoutError = new Error("Request timeout - please try again")
          ;(timeoutError as any).shouldNotRetry = false // Allow retry for timeouts
          throw timeoutError
        }

        if (error.message.includes("fetch")) {
          const networkError = new Error("Network connection failed - please check your internet connection")
          ;(networkError as any).shouldNotRetry = false // Allow retry for network errors
          throw networkError
        }
      }

      throw error
    }
  }

  private preparePayload(data: ContactFormData): Record<string, any> {
    // Create a comprehensive message that includes all form context
    let completeMessage = data.message.trim()

    // Add context information
    if (data.contactReason) {
      completeMessage = `Contact Reason: ${data.contactReason}\n\n` + completeMessage
    }

    if (data.stage) {
      completeMessage = completeMessage + `\n\nStage: ${data.stage}`
    }

    return {
      name: data.name.trim(),
      email: data.email.trim(),
      message: completeMessage,
      company: "", // Empty string for company
      source: "contact-form",
    }
  }

  private validatePayload(payload: Record<string, any>): void {
    const requiredFields = ["name", "email", "message", "source"]

    for (const field of requiredFields) {
      if (!payload[field] || (typeof payload[field] === "string" && payload[field].trim() === "")) {
        throw new Error(`Invalid payload: ${field} is required`)
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(payload.email)) {
      throw new Error("Invalid payload: email format is invalid")
    }

    // Validate message length
    if (payload.message.length < 10) {
      throw new Error("Invalid payload: message is too short")
    }
  }

  private async handleResponse(response: Response, requestId: string): Promise<ApiResponse> {
    let responseText = ""
    let responseData: any = {}

    try {
      responseText = await response.text()
      console.log(`Response text [${requestId}] (${responseText.length} chars):`, responseText.substring(0, 500))

      if (responseText.trim()) {
        // Check if response looks like JSON
        if (responseText.trim().startsWith("{") || responseText.trim().startsWith("[")) {
          try {
            responseData = JSON.parse(responseText)
            console.log(`Parsed JSON response [${requestId}]:`, responseData)
          } catch (jsonError) {
            console.warn(`JSON parse failed [${requestId}]:`, jsonError)

            // Extract error info from HTML or plain text response
            const errorInfo = contactErrorHandler.extractErrorInfo(response, responseText)

            responseData = {
              error: errorInfo.message,
              details: {
                rawResponse: responseText.substring(0, 200),
                parseError: jsonError instanceof Error ? jsonError.message : String(jsonError),
              },
              shouldRetry: errorInfo.shouldRetry,
            }
          }
        } else {
          // Handle HTML or plain text error responses
          console.log(`Non-JSON response detected [${requestId}]`)
          const errorInfo = contactErrorHandler.extractErrorInfo(response, responseText)

          responseData = {
            error: errorInfo.message,
            details: {
              rawResponse: responseText.substring(0, 200),
              contentType: response.headers.get("content-type") || "unknown",
            },
            shouldRetry: errorInfo.shouldRetry,
          }
        }
      } else {
        console.warn(`Empty response body [${requestId}]`)
        responseData = {
          error: `Empty response from server: ${response.status} ${response.statusText}`,
          details: { status: response.status, statusText: response.statusText },
          shouldRetry: response.status >= 500,
        }
      }
    } catch (textError) {
      console.error(`Failed to read response [${requestId}]:`, textError)
      responseData = {
        error: `Failed to read server response: ${textError instanceof Error ? textError.message : String(textError)}`,
        details: { readError: textError instanceof Error ? textError.message : String(textError) },
        shouldRetry: true,
      }
    }

    if (!response.ok) {
      const error = contactErrorHandler.createError(
        "server",
        `HTTP_${response.status}`,
        responseData.error || `Server error: ${response.status} ${response.statusText}`,
        {
          status: response.status,
          statusText: response.statusText,
          responseData,
          rawResponse: responseText.substring(0, 200),
          shouldRetry: responseData.shouldRetry,
        },
        requestId,
      )

      contactErrorHandler.logError(error)

      // Create a more specific error for non-retryable errors
      if (!responseData.shouldRetry) {
        const nonRetryableError = new Error(error.message)
        ;(nonRetryableError as any).shouldNotRetry = true
        throw nonRetryableError
      }

      throw new Error(error.message)
    }

    return {
      success: true,
      requestId: responseData.requestId || requestId,
      message: responseData.message || "Form submitted successfully",
      details: responseData.details,
    }
  }
}

export const contactApiClient = ContactApiClient.getInstance()
