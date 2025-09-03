"use client"
import { cn } from "@/lib/utils"

export interface RadioOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

export interface RadioGroupProps {
  options: RadioOption[]
  value?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  className?: string
  label?: string
  error?: string
}

export function RadioGroup({
  options,
  value,
  onValueChange,
  disabled = false,
  className,
  label,
  error,
}: RadioGroupProps) {
  return (
    <div className="space-y-3">
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
      <div className={cn("space-y-2", className)}>
        {options.map((option) => (
          <div key={option.value} className="flex items-start space-x-2">
            <button
              type="button"
              role="radio"
              aria-checked={value === option.value}
              onClick={() => !disabled && !option.disabled && onValueChange?.(option.value)}
              disabled={disabled || option.disabled}
              className={cn(
                "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                value === option.value && "bg-primary",
                error && "border-destructive",
              )}
            >
              {value === option.value && (
                <div className="flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                </div>
              )}
            </button>
            <div className="grid gap-1.5 leading-none">
              <label
                onClick={() => !disabled && !option.disabled && onValueChange?.(option.value)}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {option.label}
              </label>
              {option.description && <p className="text-xs text-muted-foreground">{option.description}</p>}
            </div>
          </div>
        ))}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
