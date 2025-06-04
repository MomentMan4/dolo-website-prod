export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  sanitizedData: Record<string, any>
}

export interface ValidationRule {
  field: string
  required?: boolean
  type?: "string" | "email" | "number"
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  sanitize?: boolean
}

export class FormValidator {
  private rules: ValidationRule[]
  private data: Record<string, any>

  constructor(data: Record<string, any>, rules: ValidationRule[]) {
    this.data = data
    this.rules = rules
  }

  validate(): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []
    const sanitizedData: Record<string, any> = { ...this.data }

    console.log("=== FORM VALIDATOR: Starting validation ===")
    console.log("Raw data received:", this.data)
    console.log("Data keys:", Object.keys(this.data))

    for (const rule of this.rules) {
      const value = this.data[rule.field]
      const isEmpty = this.isEmpty(value)

      console.log(`Validating field '${rule.field}':`, {
        value: `"${value}"`,
        type: typeof value,
        required: rule.required,
        isEmpty: isEmpty,
        length: value ? String(value).length : 0,
      })

      const fieldErrors = this.validateField(rule, value)

      if (fieldErrors.length > 0) {
        const errorMessages = fieldErrors.map((err) => `${rule.field}: ${err}`)
        errors.push(...errorMessages)
        console.log(`Field '${rule.field}' validation FAILED:`, fieldErrors)
      } else {
        console.log(`Field '${rule.field}' validation PASSED`)
      }

      // Sanitize the field if requested and not empty
      if (rule.sanitize && !isEmpty) {
        sanitizedData[rule.field] = this.sanitizeString(String(value))
      } else if (!isEmpty) {
        sanitizedData[rule.field] = value
      }
    }

    const result = {
      isValid: errors.length === 0,
      errors,
      warnings,
      sanitizedData,
    }

    console.log("=== FORM VALIDATOR: Complete ===")
    console.log("Validation result:", {
      isValid: result.isValid,
      errorCount: result.errors.length,
      errors: result.errors,
      sanitizedDataKeys: Object.keys(result.sanitizedData),
    })

    return result
  }

  private isEmpty(value: any): boolean {
    if (value === undefined || value === null) return true
    if (typeof value === "string") return value.trim() === ""
    return false
  }

  private validateField(rule: ValidationRule, value: any): string[] {
    const errors: string[] = []

    // Check if required field is missing
    if (rule.required && this.isEmpty(value)) {
      errors.push("is required")
      return errors // Don't continue validation if required field is missing
    }

    // Skip further validation if field is empty and not required
    if (!rule.required && this.isEmpty(value)) {
      return errors
    }

    // Convert to string for validation if needed
    const stringValue = String(value).trim()

    // Type validation
    if (rule.type === "email") {
      if (!this.isValidEmail(stringValue)) {
        errors.push("must be a valid email address")
      }
    } else if (rule.type === "number") {
      if (isNaN(Number(stringValue))) {
        errors.push("must be a number")
      }
    } else if (rule.type === "string") {
      if (typeof value !== "string") {
        errors.push("must be a string")
      }
    }

    // Length validation
    if (rule.minLength && stringValue.length < rule.minLength) {
      errors.push(`must be at least ${rule.minLength} characters long`)
    }
    if (rule.maxLength && stringValue.length > rule.maxLength) {
      errors.push(`must be no more than ${rule.maxLength} characters long`)
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(stringValue)) {
      errors.push("format is invalid")
    }

    return errors
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  private sanitizeString(str: string): string {
    return str.trim().replace(/\s+/g, " ")
  }
}

export function validateContactForm(data: Record<string, any>): ValidationResult {
  console.log("=== CONTACT FORM VALIDATION ===")
  console.log("Input data for validation:", data)

  const rules: ValidationRule[] = [
    { field: "name", required: true, type: "string", minLength: 1, maxLength: 100, sanitize: true },
    { field: "email", required: true, type: "email", maxLength: 255, sanitize: true },
    { field: "company", required: false, type: "string", maxLength: 100, sanitize: true },
    { field: "message", required: true, type: "string", minLength: 10, maxLength: 5000, sanitize: true },
    { field: "source", required: false, type: "string", maxLength: 50, sanitize: true },
  ]

  const validator = new FormValidator(data, rules)
  const result = validator.validate()

  console.log("Contact form validation final result:", result)
  return result
}
