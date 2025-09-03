"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DataTable, type Column } from "@/components/ui/data-table"
import { BulkActions } from "@/components/data/bulk-actions"
import { DataFilters, type FilterConfig, type ActiveFilter } from "@/components/data/data-filters"
import { ImportExport } from "@/components/data/import-export"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useMemo } from "react"
import { Plus, Eye, Edit, MoreHorizontal, Printer, Trash2, Search, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react"
import Modal from "@/components/Modal"
import { ReusableForm } from "@/components/ReusableForm"
import { useRouter } from "next/navigation"
interface Customer {
  id: number;
  customerName: string;
  customerPhone: string;
  companyId: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  description?: string;
}

interface OrderItem {
  productId: number;
  product: Product;
  quantity: number;
  price: number;
}

interface Sells {
  id: number;
  customerId: number;
  userId: number;
  inventoryId: number;
  quantity: number;
  status: Status;
  customer?: Customer;
  createdAt: Date;
  updatedAt: Date;
}

type Status = "pending" | "processing" | "shipped" | "delivered" | "cancelled"

// Sample products data - expanded to show more items
const products: Product[] = [
  { id: 1, name: "Laptop", price: 999.99, stock: 15, description: "High-performance laptop" },
  { id: 2, name: "Smartphone", price: 699.99, stock: 30, description: "Latest smartphone" },
  { id: 3, name: "Headphones", price: 149.99, stock: 50, description: "Noise-cancelling headphones" },
  { id: 4, name: "Monitor", price: 299.99, stock: 20, description: "27-inch 4K monitor" },
  { id: 5, name: "Keyboard", price: 89.99, stock: 40, description: "Mechanical keyboard" },
  { id: 6, name: "Mouse", price: 49.99, stock: 60, description: "Wireless mouse" },
  { id: 7, name: "Webcam", price: 79.99, stock: 25, description: "HD webcam with microphone" },
  { id: 8, name: "Tablet", price: 399.99, stock: 18, description: "10-inch tablet" },
  { id: 9, name: "Smartwatch", price: 249.99, stock: 35, description: "Fitness tracking smartwatch" },
  { id: 10, name: "Printer", price: 199.99, stock: 12, description: "Wireless all-in-one printer" },
  { id: 11, name: "External SSD", price: 129.99, stock: 40, description: "1TB portable SSD" },
  { id: 12, name: "USB-C Hub", price: 69.99, stock: 55, description: "7-in-1 USB-C docking station" },
  { id: 13, name: "Gaming Controller", price: 59.99, stock: 30, description: "Wireless gaming controller" },
  { id: 14, name: "Bluetooth Speaker", price: 89.99, stock: 22, description: "Portable waterproof speaker" },
  { id: 15, name: "Power Bank", price: 45.99, stock: 45, description: "10000mAh power bank" },
]

export default function OrdersPage() {
const router = useRouter();
  const handleExport = async (options: any) => {
    console.log("Exporting with options:", options)
    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }

  return (
    <DashboardLayout title="Orders" subtitle="Manage customer orders and track">
      <div className="space-y-6">
        {/* Orders Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Orders</CardTitle>
                <CardDescription>Manage and track customer orders</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={handleExport} className="cursor-pointer">
                  <Printer className="h-4 w-4 mr-2" /> Print
                </Button>
                <Button className="cursor-pointer" onClick={() => router.push('/dashboard/admin/sales/new')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Order
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* <DataTable data={orders} columns={columns} searchPlaceholder="Search orders..." pageSize={10} /> */}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

// The rest of your code remains the same...