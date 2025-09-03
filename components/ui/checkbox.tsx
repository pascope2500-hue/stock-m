"use client"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

export interface CheckboxProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
  label?: string
  description?: string
  error?: string
}

export function Checkbox({
  checked = false,
  onCheckedChange,
  disabled = false,
  className,
  label,
  description,
  error,
}: CheckboxProps) {
  const handleChange = () => {
    if (!disabled) {
      onCheckedChange?.(!checked)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-start space-x-2">
        <button
          type="button"
          role="checkbox"
          aria-checked={checked}
          onClick={handleChange}
          disabled={disabled}
          className={cn(
            "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            checked && "bg-primary text-primary-foreground",
            error && "border-destructive",
            className,
          )}
        >
          {checked && <Check className="h-3 w-3" />}
        </button>
        {(label || description) && (
          <div className="grid gap-1.5 leading-none">
            {label && (
              <label
                onClick={handleChange}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {label}
              </label>
            )}
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
