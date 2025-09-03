"use client"

import * as React from "react"
import { FormField } from "@/components/ui/form-field"
import { Textarea } from "@/components/ui/textarea"
import { Select, type SelectOption } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, type RadioOption } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { validateForm, type ValidationSchema } from "@/lib/validations"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export interface FormFieldConfig {
  name: string
  label: string
  type: "text" | "email" | "password" | "number" | "textarea" | "select" | "checkbox" | "radio"
  placeholder?: string
  required?: boolean
  options?: SelectOption[] | RadioOption[]
  rows?: number
  helperText?: string
  validation?: any[]
}

export interface FormBuilderProps {
  title?: string
  description?: string
  fields: FormFieldConfig[]
  initialData?: Record<string, any>
  onSubmit: (data: Record<string, any>) => Promise<void>
  submitText?: string
  cancelText?: string
  onCancel?: () => void
  loading?: boolean
  validationSchema?: ValidationSchema
}

export function FormBuilder({
  title,
  description,
  fields,
  initialData = {},
  onSubmit,
  submitText = "Submit",
  cancelText = "Cancel",
  onCancel,
  loading = false,
  validationSchema = {},
}: FormBuilderProps) {
  const [formData, setFormData] = React.useState<Record<string, any>>(initialData)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form if schema provided
    if (Object.keys(validationSchema).length > 0) {
      const validationErrors = validateForm(formData, validationSchema)
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        return
      }
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      await onSubmit(formData)
    } catch (error: any) {
      setErrors({ general: error.message || "An error occurred while submitting the form" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderField = (field: FormFieldConfig) => {
    const commonProps = {
      key: field.name,
      label: field.label,
      error: errors[field.name],
      helperText: field.helperText,
    }

    switch (field.type) {
      case "textarea":
        return (
          <Textarea
            {...commonProps}
            value={formData[field.name] || ""}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={field.rows}
            disabled={isSubmitting || loading}
          />
        )

      case "select":
        return (
          <Select
            {...commonProps}
            value={formData[field.name] || ""}
            onValueChange={(value) => handleChange(field.name, value)}
            options={field.options as SelectOption[]}
            placeholder={field.placeholder}
            disabled={isSubmitting || loading}
          />
        )

      case "checkbox":
        return (
          <Checkbox
            {...commonProps}
            checked={formData[field.name] || false}
            onCheckedChange={(checked) => handleChange(field.name, checked)}
            disabled={isSubmitting || loading}
          />
        )

      case "radio":
        return (
          <RadioGroup
            {...commonProps}
            value={formData[field.name] || ""}
            onValueChange={(value) => handleChange(field.name, value)}
            options={field.options as RadioOption[]}
            disabled={isSubmitting || loading}
          />
        )

      default:
        return (
          <FormField
            {...commonProps}
            type={field.type}
            value={formData[field.name] || ""}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            disabled={isSubmitting || loading}
          />
        )
    }
  }

  return (
    <Card>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </CardHeader>
      )}
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              {errors.general}
            </div>
          )}

          <div className="space-y-4">{fields.map(renderField)}</div>

          <div className="flex justify-end space-x-3 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting || loading}>
                {cancelText}
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting || loading}>
              {isSubmitting || loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Submitting...
                </>
              ) : (
                submitText
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
