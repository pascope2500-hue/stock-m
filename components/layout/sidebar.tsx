"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  FileText,
  ShoppingCart,
  Calendar,
  Mail,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
} from "lucide-react"
import React from "react"

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}



export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth()

  const prefix_url = user?.role === "Admin" ? "/dashboard/admin" : "/dashboard/seller"

  const navigationItems = [
  {
    title: "Dashboard",
    href: prefix_url,
    icon: LayoutDashboard,
  },
  {
    title: "Inventory",
    href: prefix_url+"/inventory",
    icon: ShoppingBag,
  },
  {
    title: "Sales",
    href: prefix_url+"/"+"sales",
    icon: FileText,
  },
  {
    title: "Report",
    href: prefix_url+"/"+"report",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: prefix_url+"/settings",
    icon: Settings,
  },
]

React.useEffect(() => {
  if (user?.role === "Admin") {
  // push user on array after 0 index
  navigationItems.splice(0, 0, {
     title: "Users",
    href: prefix_url+"/users",
    icon: Users,
  })
}
},[])


  return (
    <div
      className={cn(
        "relative flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-sidebar-accent rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-sidebar-accent-foreground" />
            </div>
            <span className="font-semibold text-sidebar-foreground">Admin Panel</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="font-medium">{item.title}</span>}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      {/* <div className="p-4 border-t border-sidebar-border">
        {!collapsed && <div className="text-xs text-sidebar-foreground/60 text-center">Admin Dashboard v1.0</div>}
      </div> */}
    </div>
  )
}
