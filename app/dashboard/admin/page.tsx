"use client";
import React from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import axios from "axios"
import { BarChart3, Users, ShoppingCart, TrendingUp , ShoppingBag, Link } from "lucide-react"
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
export default function DashboardPage() {
  const [lowSt, setLowSt] = React.useState(0)
  const [expired, setExpired] = React.useState(0)
  const [revenue, setRevenue] = React.useState(0)
  const [totalProducts, setTotalProducts] = React.useState(0)
  const [sales, setSales] = React.useState(0)
  const [loading, setLoading] = React.useState(true)
  const {user} = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    const fetchStats = async() => {
      setLoading(true);
      await axios.get('/api/stats')
      .then((response) => {
        // totalProd, lowStock, totalExpired, totalRevenue
      setLowSt(response.data.lowStock);
      setExpired(response.data.totalExpired);
      setRevenue(response.data.totalRevenue);
      setTotalProducts(response.data.totalProd);
      setSales(response.data.totalSales);
    })
    .catch((error) =>
      {
        console.log(error);
        
      }
      )
    .finally(()=> {
      setLoading(false);
    })
    }
    fetchStats();
    
  },[])


  const stats = [
  {
    title: "Total Products",
    value: totalProducts.toString(),
    icon: Users,
  },
  {
    title: "Low Stock Products",
    value: lowSt.toString(),
    icon: ShoppingCart,
  },
   {
    title: "Expired Products",
    value: expired.toString(),
    icon: ShoppingCart,
  },
  {
    title: "Revenue",
    value: "Rwf "+revenue.toString(),
    icon: TrendingUp,
  },
  {
    title: "Total Sales",
    value: sales.toString(),
    icon: TrendingUp,
  }
]
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
                  <div className="text-2xl font-bold">{loading ? <LoadingSpinner/> : stat.value}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    {
                      (stat.title === "Revenue" || stat.title === "Total Sales") &&(
                        <span className="ml-1">from last month</span>
                      )
                    }
                    {
                      (stat.title === "Low Stock Products") &&(
                        <span className="ml-1 bg-green-500 text-white px-2 py-1 rounded-md cursor-pointer" onClick={() => router.push("/dashboard/admin/out-stock")}>View</span>
                      )
                    }
                    {
                      (stat.title === "Expired Products") &&(
                        <span className="ml-1 bg-green-500 text-white px-2 py-1 rounded-md cursor-pointer" onClick={() => router.push("/dashboard/admin/expired")}>View</span>
                      )
                    }
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
                { label: "Sales", icon: ShoppingCart },
                { label: "Inventory", icon: ShoppingBag },
                { label: "View Reports", icon: BarChart3 },
                
              ].filter((action => action.label === "Add User" && user?.role === "Admin" || action.label !== "Add User"))
              .map((action) => {
                const Icon = action.icon
                return (
                  <button
                  key={action.label}
                    onClick={() => {
                      router.push(`/dashboard/${user?.role.toLowerCase()}/${action.label == "Add User" ? "users" : action.label === "Sales" ? 'sales' : action.label === "Inventory" ? 'inventory' : 'report'}`)
                    }}
                    className="flex flex-col items-center p-4 border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
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
