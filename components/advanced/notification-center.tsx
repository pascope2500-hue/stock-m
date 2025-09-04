"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, X, Check, AlertCircle, Info, CheckCircle, AlertTriangle } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"

export interface Notification {
  id: number
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  timestamp: Date
  read: boolean
  actionUrl?: string,
  entity: string
  entityId: number
}

export function NotificationCenter() {
  const [notifications, setNotifications] = React.useState<Notification[]>([])

  const [isOpen, setIsOpen] = React.useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const removeNotification = async(id: number) => {
    await axios.delete(`/api/notification/${id}`)
    .then((response) => {
      setNotifications((prev) => prev.filter((notification) => notification.id !== id))
    })
    .catch((error) => {
      toast.error('there is an error while deleting notification')
    })
  }

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
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

  // Simulate real-time notifications
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
      const fetchNot = async() => {
        await axios.get("/api/notification")
        .then((response) => {
          const newNotifications = response.data.map((notification: Notification) => ({
            id: notification.id,
            title: notification.title,
            message: notification.message,
            type: notification.type.toLowerCase() as Notification["type"],
            timestamp: new Date(notification.timestamp),
            read: false,
            entity: notification.entity,
            entityId: notification.entityId,
          }))

          setNotifications((prev) => [...prev, ...newNotifications].slice(0, 10))
        })
      }
      fetchNot();
      }
      
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative">
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="relative">
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge
            variant="error"
            size="sm"
            className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute right-0 top-full mt-2 w-96 shadow-lg z-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    <Check className="h-4 w-4 mr-1" />
                    Mark all read
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-96">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-border hover:bg-accent/50 transition-colors ${
                        !notification.read ? "bg-accent/20" : ""
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {getIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium truncate">{notification.title}</p>
                            <div className="flex items-center space-x-1">
                              <span className="text-xs text-muted-foreground">
                                {formatTime(notification.timestamp)}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeNotification(notification.id)}
                                className="h-6 w-6 p-0"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs mt-2 h-6 px-2"
                            >
                              Mark as read
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
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
