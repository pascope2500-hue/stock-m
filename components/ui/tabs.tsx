"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface TabItem {
  id: string
  label: string
  content: React.ReactNode
  disabled?: boolean
}

export interface TabsProps {
  items: TabItem[]
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
}

export function Tabs({ items, defaultValue, value, onValueChange, className }: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(value || defaultValue || items[0]?.id)

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    onValueChange?.(tabId)
  }

  const activeItem = items.find((item) => item.id === activeTab)

  return (
    <div className={cn("space-y-4", className)}>
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => !item.disabled && handleTabChange(item.id)}
              disabled={item.disabled}
              className={cn(
                "py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === item.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
                item.disabled && "opacity-50 cursor-not-allowed",
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="py-4">{activeItem?.content}</div>
    </div>
  )
}
