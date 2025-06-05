interface ValidationRule {
  field: string
  required?: boolean
  type?: "string" | "email" | "select"
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  customValidator?: (value: any) => string | null
}

interface ValidationResult {
  isValid: boolean
  errors: Record<string, string[]>
  sanitizedData: Record<string, any>
  warnings: string[]
}

export class ContactFormValidator {
  private rules: ValidationRule[] = [
    {
      field: "name",
      required: true,
      type: "string",
      minLength: 2,
      maxLength: 100,
      customValidator: (value: string) => {
        if (value && !/^[a-zA-Z\s\-'.]+$/.test(value.trim())) {
          return "Name can only contain letters, spaces, hyphens, apostrophes, and periods"
        }
        return null
      },
    },
    {
      field: "email",
      required: true,
      type: "email",
      maxLength: 255,
      customValidator: (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (value && !emailRegex.test(value.trim())) {
          return "Please enter a valid email address"
        }
        return null
      },
    },
    {
      field: "contactReason",
      required: true,
      type: "select",
      customValidator: (value: string) => {
        const validReasons = ["general", "website", "privateBuild", "partnership", "support"]
        if (value && !validReasons.includes(value)) {
          return "Please select a valid contact reason"
        }
        return null
      },
    },
    {
      field: "stage",
      required: true,
      type: "select",
      customValidator: (value: string) => {
        const validStages = ["exploring", "readyToBuild", "comparing", "needAdvice"]
        if (value && !validStages.includes(value)) {
          return "Please select a valid stage"
        }
        return null
      },
    },
    {
      field: "message",
      required: true,
      type: "string",
      minLength: 10,
      maxLength: 5000,
      customValidator: (value: string) => {
        if (value && value.trim().length < 10) {
          return "Message must be at least 10 characters long"
        }
        if (value && /^\s*$/.test(value)) {
          return "Message cannot be empty or contain only whitespace"
        }
        return null
      },
    },
  ]

  validate(data: Record<string, any>): ValidationResult {
    const errors: Record<string, string[]> = {}
    const warnings: string[] = []
    const sanitizedData: Record<string, any> = {}

    console.log("=== CONTACT FORM VALIDATION START ===")
    console.log("Input data:", data)

    for (const rule of this.rules) {
      const value = data[rule.field]
      const fieldErrors: string[] = []

      console.log(`Validating field '${rule.field}':`, {
        value: typeof value === "string" ? `"${value}"` : value,
        type: typeof value,
        required: rule.required,
      })

      // Check required fields
      if (rule.required && this.isEmpty(value)) {
        fieldErrors.push(`${this.getFieldLabel(rule.field)} is required`)
      }

      // Skip further validation if field is empty and not required
      if (!rule.required && this.isEmpty(value)) {
        sanitizedData[rule.field] = null
        continue
      }

      // Type validation
      if (!this.isEmpty(value)) {
        const stringValue = String(value).trim()

        // Length validation
        if (rule.minLength && stringValue.length < rule.minLength) {
          fieldErrors.push(`${this.getFieldLabel(rule.field)} must be at least ${rule.minLength} characters long`)
        }

        if (rule.maxLength && stringValue.length > rule.maxLength) {
          fieldErrors.push(`${this.getFieldLabel(rule.field)} must be no more than ${rule.maxLength} characters long`)
        }

        // Custom validation
        if (rule.customValidator) {
          const customError = rule.customValidator(stringValue)
          if (customError) {
            fieldErrors.push(customError)
          }
        }

        // Sanitize the value
        sanitizedData[rule.field] = this.sanitizeValue(stringValue, rule.type)
      }

      if (fieldErrors.length > 0) {
        errors[rule.field] = fieldErrors
        console.log(`Field '${rule.field}' validation FAILED:`, fieldErrors)
      } else {
        console.log(`Field '${rule.field}' validation PASSED`)
      }
    }

    const result = {
      isValid: Object.keys(errors).length === 0,
      errors,
      sanitizedData,
      warnings,
    }

    console.log("=== CONTACT FORM VALIDATION COMPLETE ===")
    console.log("Validation result:", {
      isValid: result.isValid,
      errorCount: Object.keys(errors).length,
      errors: Object.keys(errors),
    })

    return result
  }

  private isEmpty(value: any): boolean {
    return value === undefined || value === null || (typeof value === "string" && value.trim() === "")
  }

  private sanitizeValue(value: string, type?: string): string {
    let sanitized = value.trim()

    // Remove multiple consecutive spaces
    sanitized = sanitized.replace(/\s+/g, " ")

    // Basic XSS prevention
    sanitized = sanitized
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;")

    return sanitized
  }

  private getFieldLabel(field: string): string {
    const labels: Record<string, string> = {
      name: "Name",
      email: "Email",
      contactReason: "Contact reason",
      stage: "Stage",
      message: "Message",
    }
    return labels[field] || field
  }
}

export const contactFormValidator = new ContactFormValidator()
