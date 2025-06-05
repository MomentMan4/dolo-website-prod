interface ContactFormError {
  type: "validation" | "network" | "server" | "unknown"
  code: string
  message: string
  details?: any
  timestamp: string
  requestId?: string
}

interface RetryConfig {
  maxRetries: number
  baseDelay: number
  maxDelay: number
  backoffMultiplier: number
}

export class ContactFormErrorHandler {
  private static instance: ContactFormErrorHandler
  private errors: ContactFormError[] = []

  static getInstance(): ContactFormErrorHandler {
    if (!ContactFormErrorHandler.instance) {
      ContactFormErrorHandler.instance = new ContactFormErrorHandler()
    }
    return ContactFormErrorHandler.instance
  }

  logError(error: ContactFormError): void {
    this.errors.push(error)
    console.error(`[ContactForm] ${error.type.toUpperCase()} Error:`, error)

    // Keep only last 50 errors to prevent memory issues
    if (this.errors.length > 50) {
      this.errors = this.errors.slice(-50)
    }
  }

  createError(
    type: ContactFormError["type"],
    code: string,
    message: string,
    details?: any,
    requestId?: string,
  ): ContactFormError {
    return {
      type,
      code,
      message,
      details,
      timestamp: new Date().toISOString(),
      requestId,
    }
  }

  getRecentErrors(): ContactFormError[] {
    return this.errors.slice(-10)
  }

  async retryWithBackoff<T>(
    operation: () => Promise<T>,
    config: RetryConfig = {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 10000,
      backoffMultiplier: 2,
    },
  ): Promise<T> {
    let lastError: Error

    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))

        // Don't retry on certain types of errors
        if (this.shouldNotRetry(lastError)) {
          console.log(`Not retrying due to error type: ${lastError.message}`)
          throw lastError
        }

        if (attempt === config.maxRetries) {
          console.error(`All retry attempts exhausted. Final error: ${lastError.message}`)
          throw lastError
        }

        // Calculate delay with exponential backoff
        const delay = Math.min(config.baseDelay * Math.pow(config.backoffMultiplier, attempt), config.maxDelay)

        console.warn(`Retry attempt ${attempt + 1}/${config.maxRetries} after ${delay}ms:`, lastError.message)
        await this.sleep(delay)
      }
    }

    throw lastError!
  }

  private shouldNotRetry(error: Error): boolean {
    const message = error.message.toLowerCase()

    // Don't retry on validation errors, authentication errors, or client errors
    if (
      message.includes("validation") ||
      message.includes("invalid") ||
      message.includes("unauthorized") ||
      message.includes("forbidden") ||
      message.includes("bad request") ||
      message.includes("400") ||
      message.includes("401") ||
      message.includes("403") ||
      message.includes("404")
    ) {
      return true
    }

    return false
  }

  extractErrorInfo(response: Response, responseText: string): { message: string; shouldRetry: boolean } {
    // Try to extract error information from HTML error pages
    if (responseText.includes("<title>") && responseText.includes("</title>")) {
      const titleMatch = responseText.match(/<title>(.*?)<\/title>/i)
      if (titleMatch) {
        return {
          message: `Server error: ${titleMatch[1].trim()}`,
          shouldRetry: response.status >= 500,
        }
      }
    }

    // Check for common error patterns
    if (responseText.includes("Internal Server Error")) {
      return {
        message: "Internal server error occurred",
        shouldRetry: true,
      }
    }

    if (responseText.includes("Bad Gateway") || responseText.includes("502")) {
      return {
        message: "Server temporarily unavailable",
        shouldRetry: true,
      }
    }

    if (responseText.includes("Service Unavailable") || responseText.includes("503")) {
      return {
        message: "Service temporarily unavailable",
        shouldRetry: true,
      }
    }

    // Default error message
    return {
      message: `Server returned ${response.status} error`,
      shouldRetry: response.status >= 500,
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

export const contactErrorHandler = ContactFormErrorHandler.getInstance()
