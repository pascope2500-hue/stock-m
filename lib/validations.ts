export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: string) => boolean
  message?: string
}

export interface ValidationSchema {
  [key: string]: ValidationRule[]
}

export function validateField(value: string, rules: ValidationRule[]): string | null {
  for (const rule of rules) {
    if (rule.required && !value.trim()) {
      return rule.message || "This field is required"
    }

    if (rule.minLength && value.length < rule.minLength) {
      return rule.message || `Minimum ${rule.minLength} characters required`
    }

    if (rule.maxLength && value.length > rule.maxLength) {
      return rule.message || `Maximum ${rule.maxLength} characters allowed`
    }

    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.message || "Invalid format"
    }

    if (rule.custom && !rule.custom(value)) {
      return rule.message || "Invalid value"
    }
  }

  return null
}

export function validateForm(data: Record<string, string>, schema: ValidationSchema): Record<string, string> {
  const errors: Record<string, string> = {}

  for (const [field, rules] of Object.entries(schema)) {
    const error = validateField(data[field] || "", rules)
    if (error) {
      errors[field] = error
    }
  }

  return errors
}

// Common validation rules
export const validationRules = {
  email: [
    { required: true, message: "Email is required" },
    {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address",
    },
  ],
  password: [
    { required: true, message: "Password is required" },
    { minLength: 8, message: "Password must be at least 8 characters" },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    },
  ],
  confirmPassword: (password: string) => [
    { required: true, message: "Please confirm your password" },
    {
      custom: (value: string) => value === password,
      message: "Passwords do not match",
    },
  ],
  name: [
    { required: true, message: "Name is required" },
    { minLength: 2, message: "Name must be at least 2 characters" },
  ],
}
