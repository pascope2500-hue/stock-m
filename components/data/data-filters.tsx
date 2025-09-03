"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Select, type SelectOption } from "@/components/ui/select"
import { SearchInput } from "@/components/ui/search-input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Filter, X, RotateCcw } from "lucide-react"

export interface FilterConfig {
  key: string
  label: string
  type: "select" | "search" | "date" | "number"
  options?: SelectOption[]
  placeholder?: string
}

export interface ActiveFilter {
  key: string
  label: string
  value: string
  displayValue?: string
}

export interface DataFiltersProps {
  filters: FilterConfig[]
  activeFilters: ActiveFilter[]
  onFilterChange: (key: string, value: string) => void
  onFilterRemove: (key: string) => void
  onClearAll: () => void
  className?: string
}

export function DataFilters({
  filters,
  activeFilters,
  onFilterChange,
  onFilterRemove,
  onClearAll,
  className,
}: DataFiltersProps) {
  const [showFilters, setShowFilters] = React.useState(false)
  const [filterValues, setFilterValues] = React.useState<Record<string, string>>({})

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }))
    if (value) {
      onFilterChange(key, value)
    } else {
      onFilterRemove(key)
    }
  }

  const renderFilter = (filter: FilterConfig) => {
    const value = filterValues[filter.key] || ""

    switch (filter.type) {
      case "select":
        return (
          <Select
            key={filter.key}
            label={filter.label}
            value={value}
            onValueChange={(val) => handleFilterChange(filter.key, val)}
            options={filter.options || []}
            placeholder={filter.placeholder}
          />
        )

      case "search":
        return (
          <div key={filter.key} className="space-y-2">
            <label className="text-sm font-medium">{filter.label}</label>
            <SearchInput
              value={value}
              onChange={(val) => handleFilterChange(filter.key, val)}
              placeholder={filter.placeholder}
            />
          </div>
        )

      case "date":
        return (
          <div key={filter.key} className="space-y-2">
            <label className="text-sm font-medium">{filter.label}</label>
            <input
              type="date"
              value={value}
              onChange={(e) => handleFilterChange(filter.key, e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
        )

      case "number":
        return (
          <div key={filter.key} className="space-y-2">
            <label className="text-sm font-medium">{filter.label}</label>
            <input
              type="number"
              value={value}
              onChange={(e) => handleFilterChange(filter.key, e.target.value)}
              placeholder={filter.placeholder}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFilters.length > 0 && (
            <Badge variant="secondary" size="sm" className="ml-2">
              {activeFilters.length}
            </Badge>
          )}
        </Button>

        {activeFilters.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearAll}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeFilters.map((filter) => (
            <Badge key={filter.key} variant="secondary" className="flex items-center gap-1">
              <span className="text-xs">
                {filter.label}: {filter.displayValue || filter.value}
              </span>
              <button
                onClick={() => onFilterRemove(filter.key)}
                className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Filter Controls */}
      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{filters.map(renderFilter)}</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
