interface ErrorLog {
  timestamp: string
  component: string
  action: string
  error: string
  stack?: string
  metadata?: Record<string, any>
}

class ErrorMonitor {
  private errors: ErrorLog[] = []

  log(component: string, action: string, error: Error | string, metadata?: Record<string, any>) {
    const errorLog: ErrorLog = {
      timestamp: new Date().toISOString(),
      component,
      action,
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      metadata,
    }

    this.errors.push(errorLog)
    console.error(`[${component}] ${action}:`, error, metadata)

    // Keep only last 100 errors to prevent memory issues
    if (this.errors.length > 100) {
      this.errors = this.errors.slice(-100)
    }
  }

  getRecentErrors(limit = 10): ErrorLog[] {
    return this.errors.slice(-limit)
  }

  getErrorsByComponent(component: string): ErrorLog[] {
    return this.errors.filter((error) => error.component === component)
  }

  clearErrors() {
    this.errors = []
  }
}

export const errorMonitor = new ErrorMonitor()

export function logFormError(formName: string, action: string, error: Error | string, metadata?: Record<string, any>) {
  errorMonitor.log(`Form:${formName}`, action, error, metadata)
}

export function logDatabaseError(
  table: string,
  operation: string,
  error: Error | string,
  metadata?: Record<string, any>,
) {
  errorMonitor.log(`Database:${table}`, operation, error, metadata)
}

export function logEmailError(
  template: string,
  recipient: string,
  error: Error | string,
  metadata?: Record<string, any>,
) {
  errorMonitor.log(`Email:${template}`, `send-to-${recipient}`, error, metadata)
}
