"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, Settings, Trash2, Edit, Plus, Eye, Download } from "lucide-react"

export interface ActivityLogEntry {
  id: string
  user: string
  action: string
  target: string
  timestamp: Date
  type: "create" | "update" | "delete" | "view" | "download" | "login" | "logout"
  details?: string
}

interface ActivityLogProps {
  entries?: ActivityLogEntry[]
  maxEntries?: number
  showUser?: boolean
  className?: string
}

const mockEntries: ActivityLogEntry[] = [
  {
    id: "1",
    user: "John Doe",
    action: "Created",
    target: "User Account",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    type: "create",
    details: "Created new user account for sarah@example.com",
  },
  {
    id: "2",
    user: "Sarah Johnson",
    action: "Updated",
    target: "Profile Settings",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    type: "update",
    details: "Updated profile information and preferences",
  },
  {
    id: "3",
    user: "Mike Wilson",
    action: "Deleted",
    target: "Order #1234",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    type: "delete",
    details: "Permanently deleted cancelled order",
  },
  {
    id: "4",
    user: "Emma Davis",
    action: "Downloaded",
    target: "User Report",
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    type: "download",
    details: "Downloaded monthly user activity report",
  },
  {
    id: "5",
    user: "Admin",
    action: "Logged in",
    target: "Dashboard",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    type: "login",
    details: "Successful login from IP 192.168.1.100",
  },
]

export function ActivityLog({ entries = mockEntries, maxEntries = 10, showUser = true, className }: ActivityLogProps) {
  const getIcon = (type: ActivityLogEntry["type"]) => {
    switch (type) {
      case "create":
        return <Plus className="h-4 w-4 text-green-500" />
      case "update":
        return <Edit className="h-4 w-4 text-blue-500" />
      case "delete":
        return <Trash2 className="h-4 w-4 text-red-500" />
      case "view":
        return <Eye className="h-4 w-4 text-gray-500" />
      case "download":
        return <Download className="h-4 w-4 text-purple-500" />
      case "login":
      case "logout":
        return <User className="h-4 w-4 text-indigo-500" />
      default:
        return <Settings className="h-4 w-4 text-gray-500" />
    }
  }

  const getTypeColor = (type: ActivityLogEntry["type"]) => {
    switch (type) {
      case "create":
        return "success"
      case "update":
        return "default"
      case "delete":
        return "error"
      case "view":
        return "secondary"
      case "download":
        return "outline"
      case "login":
      case "logout":
        return "secondary"
      default:
        return "outline"
    }
  }

  const formatTime = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return "Just now"
  }

  const displayEntries = entries.slice(0, maxEntries)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
        <CardDescription>Recent system activities and user actions</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-96">
          <div className="space-y-1">
            {displayEntries.map((entry) => (
              <div key={entry.id} className="p-4 border-b border-border hover:bg-accent/50 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className="p-1 rounded-full bg-accent/20">{getIcon(entry.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {showUser && (
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {entry.user
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <span className="text-sm font-medium">{entry.user}</span>
                        <span className="text-sm text-muted-foreground">{entry.action.toLowerCase()}</span>
                        <span className="text-sm font-medium">{entry.target}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getTypeColor(entry.type) as any} size="sm">
                          {entry.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{formatTime(entry.timestamp)}</span>
                      </div>
                    </div>
                    {entry.details && <p className="text-xs text-muted-foreground mt-1 ml-8">{entry.details}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
