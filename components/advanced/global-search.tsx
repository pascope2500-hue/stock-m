"use client"

import * as React from "react"
import { SearchInput } from "@/components/ui/search-input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { User, FileText, ShoppingCart, Settings, Calendar } from "lucide-react"

interface SearchResult {
  id: string
  title: string
  description: string
  type: "user" | "order" | "document" | "setting" | "event"
  url: string
  relevance: number
}

interface GlobalSearchProps {
  onResultClick?: (result: SearchResult) => void
  className?: string
}

const mockResults: SearchResult[] = [
  {
    id: "1",
    title: "John Smith",
    description: "User account - john@example.com",
    type: "user",
    url: "/dashboard/users/1",
    relevance: 0.95,
  },
  {
    id: "2",
    title: "Order #1234",
    description: "Pending order - $299.99",
    type: "order",
    url: "/dashboard/orders/1234",
    relevance: 0.88,
  },
  {
    id: "3",
    title: "User Management Guide",
    description: "Documentation for managing users",
    type: "document",
    url: "/docs/user-management",
    relevance: 0.75,
  },
  {
    id: "4",
    title: "Email Settings",
    description: "Configure email notifications",
    type: "setting",
    url: "/dashboard/settings/email",
    relevance: 0.65,
  },
  {
    id: "5",
    title: "Team Meeting",
    description: "Weekly team sync - Tomorrow 2:00 PM",
    type: "event",
    url: "/dashboard/calendar/event/5",
    relevance: 0.6,
  },
]

export function GlobalSearch({ onResultClick, className }: GlobalSearchProps) {
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const searchRef = React.useRef<HTMLDivElement>(null)

  // Simulate search API call
  const performSearch = React.useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    const filteredResults = mockResults
      .filter(
        (result) =>
          result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      .sort((a, b) => b.relevance - a.relevance)

    setResults(filteredResults)
    setIsLoading(false)
  }, [])

  // Debounced search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, performSearch])

  // Close search on outside click
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const getIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "user":
        return <User className="h-4 w-4" />
      case "order":
        return <ShoppingCart className="h-4 w-4" />
      case "document":
        return <FileText className="h-4 w-4" />
      case "setting":
        return <Settings className="h-4 w-4" />
      case "event":
        return <Calendar className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: SearchResult["type"]) => {
    switch (type) {
      case "user":
        return "default"
      case "order":
        return "success"
      case "document":
        return "secondary"
      case "setting":
        return "outline"
      case "event":
        return "warning"
    }
  }

  const handleResultClick = (result: SearchResult) => {
    onResultClick?.(result)
    setIsOpen(false)
    setQuery("")
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <SearchInput
        value={query}
        onChange={(value) => {
          setQuery(value)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        placeholder="Search users, orders, settings..."
        className="w-full"
      />

      {isOpen && (query || results.length > 0) && (
        <Card className="absolute top-full left-0 right-0 mt-1 shadow-lg z-50">
          <CardContent className="p-0">
            <ScrollArea className="max-h-96">
              {isLoading ? (
                <div className="p-4 text-center text-muted-foreground">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-sm">Searching...</p>
                </div>
              ) : results.length === 0 && query ? (
                <div className="p-4 text-center text-muted-foreground">
                  <p className="text-sm">No results found for "{query}"</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {results.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className="w-full p-3 text-left hover:bg-accent transition-colors border-b border-border last:border-b-0"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="p-1 rounded bg-accent/20 text-accent-foreground">{getIcon(result.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium truncate">{result.title}</p>
                            <Badge variant={getTypeColor(result.type) as any} size="sm">
                              {result.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 truncate">{result.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
