import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, Users, ShoppingCart, TrendingUp, ArrowUp, ArrowDown, ShoppingBag } from "lucide-react"

const stats = [
  {
    title: "Total Products",
    value: "12,345",
    icon: Users,
  },
  {
    title: "Low Stock Alert",
    value: "2",
    icon: ShoppingCart,
  },
   {
    title: "Expired Products",
    value: "8,432",
    icon: ShoppingCart,
  },
  {
    title: "Revenue",
    value: "$45,678",
    icon: TrendingUp,
  }
]

const recentActivity = [
  { id: 1, user: "John Smith", action: "Created new order", time: "2 minutes ago" },
  { id: 2, user: "Sarah Johnson", action: "Updated profile", time: "5 minutes ago" },
  { id: 3, user: "Mike Wilson", action: "Completed payment", time: "10 minutes ago" },
  { id: 4, user: "Emma Davis", action: "Left a review", time: "15 minutes ago" },
]

export default function DashboardPage() {
  return (
    <DashboardLayout title="Dashboard" subtitle="Welcome back! Here's what's happening with your business.">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span className="ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Add User", icon: Users },
                { label: "Sale", icon: ShoppingCart },
                { label: "Inventory", icon: ShoppingBag },
                { label: "View Reports", icon: BarChart3 },
                
              ].map((action) => {
                const Icon = action.icon
                return (
                  <button
                    key={action.label}
                    className="flex flex-col items-center p-4 border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Icon className="h-6 w-6 mb-2" />
                    <span className="text-sm font-medium">{action.label}</span>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
