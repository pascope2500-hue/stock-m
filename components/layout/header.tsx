"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { NotificationCenter } from "@/components/advanced/notification-center"
import { Moon, Sun, User, Settings, LogOut, Link } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import toast from "react-hot-toast"
interface HeaderProps {
  title: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
    const { user } = useAuth();
  
  const [isDark, setIsDark] = React.useState(false)
  const [showProfile, setShowProfile] = React.useState(false)

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  const logout = async() => {
    toast.loading("Logging out...",{id: 'logout'});
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
    toast.dismiss('logout');
    toast.success("Logged out successfully");
    window.location.href = "/"
  }
  return (
    <header className="bg-background border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Title Section */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>

        {/* Actions Section */}
        <div className="flex items-center space-x-4">
      
          {/* Theme Toggle */}
          <Button variant="ghost" size="sm" onClick={toggleTheme}>
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          {/* Notifications */}
          {/* <NotificationCenter /> */}

          {/* Profile Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-accent-foreground" />
              </div>
              <span className="hidden md:block font-medium">{user?.names}</span>
            </Button>

            {showProfile && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg z-50">
                <div className="p-3 border-b border-border">
                  <p className="font-medium">{user?.names}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <div className="p-2 space-y-1">
                  {/* <Link href={user?.role === "Admin" ? "/dashboard/admin/settings" : "/dashboard/seller/settings"}> */}
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                  {/* </Link> */}
                  {/* <Link href={user?.role === "Admin" ? "/dashboard/admin/settings" : "/dashboard/seller/settings"}> */}
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                  {/* </Link> */}
                  <div className="border-t border-border my-1" />
                  <Button variant="ghost" size="sm" className="w-full justify-start text-destructive" onClick={logout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
