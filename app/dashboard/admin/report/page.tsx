"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DataTable, selectTyp, type Column } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Plus,
  Eye,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { OrderItem, OrderReceipt } from "@/components/receipt/order-receipt";

export default function OrdersPage() {
  const [sales, setSales] = useState<Sells[]>([]);
  const [selectedSales, setSelectedSales] = useState<Sells[]>([]);
  const router = useRouter();
  const columns: Column<Sells>[] = [
  {
    header: "Customer",
    key: "customer",
    sortable: true,
    render: (customer: Customer) => (
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-accent-foreground">
            {customer.customerName.split(" ")[0].charAt(0).toUpperCase() +(customer.customerName.split(" ")[1]?.charAt(0)?.toUpperCase() || "")}
          </span>
        </div>
        <div>
          <p className="font-medium">{customer.customerName}</p>
          <p className="text-sm text-muted-foreground">
            {customer.customerPhone}
          </p>
        </div>
      </div>
    ),
    printRender: (customer: Customer) => 
      `${customer.customerName}\n${customer.customerPhone}`
  },
  {
    header: "Product",
    key: "inventory",
    sortable: true,
    render: (inventory, row) => {
      return (
        <div className="flex items-center space-x-3">
          <div>
            <p className="font-medium">{row.inventory.productName}</p>
            <p className="text-sm text-muted-foreground">
              Rwf {row.inventory.sellingPrice}
            </p>
          </div>
        </div>
      );
    },
    printRender: (inventory: any) => 
      `${inventory.productName}\nRwf ${inventory.sellingPrice}`
  },
  {
    header: "Quantity",
    key: "quantity",
    sortable: true,
    render: (quantity) => <span className="font-semibold">{quantity}</span>,
    printRender: (quantity) => String(quantity)
  },
  {
    header: "Total Amount",
    key: "totalAmount",
    sortable: true,
    render: (totalAmount) => (
      <span className="font-semibold">Rwf {totalAmount}</span>
    ),
    printRender: (totalAmount) => `Rwf ${totalAmount}`
  },
  {
    header: "Status",
    key: "status",
    sortable: true,
    render: (status) => (
      <span className="font-semibold bg-green-500 text-white px-2 py-1 rounded-md">
        {status}
      </span>
    ),
    printRender: (status) => String(status)
  }, {
    header: "Date",
    key: "createdAt",
    sortable: true,
    render: (createdAt) => (
      <span className="font-semibold">{new Date(createdAt).toLocaleString()}</span>
    ),
  },
    {
      header: "Actions",
      key: "id",
      isPrint: false,
      render: (id, row) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer"
            title="View and print receipt"
            onClick={() => handleOrderReceipt(id, row.customer.id)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer"
            title="delete order"
            onClick={async () => {
              toast.loading("Deleting order...", { id: "deleting-order" });
              await axios
                .delete(`/api/sales/${id}`)
                .then((data) => {
                  if (data.status === 200) {
                    toast.success("Order deleted successfully", {
                      id: "order-deleted",
                    });
                    sales.filter((sale) => sale.id !== id);
                    router.refresh();
                  }
                })
                .catch((error) => {
                  toast.error("Failed to delete order", {
                    id: "order-deleted",
                  });
                })
                .finally(() => {
                  toast.dismiss("deleting-order");
                });
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
];

  const handleOrderReceipt = (id: number, customerId: number) => {
    const filtered = sales.filter(
      (sale) => sale.id === id && sale.customer.id === customerId
    );
    if (filtered.length > 0) {
      setSelectedSales(filtered);
    }
  };

  useEffect(() => {
    const fetchSales = async () => {
      toast.loading("Loading sales...", { id: "loading-sales" });
      const sales = await axios.get("/api/sales");
      setSales(sales.data);
      toast.dismiss("loading-sales");
    };
    fetchSales();
  }, []);
  const items: OrderItem[] = selectedSales.map((sale) => ({
    productId: sale.id,
    product: {
      productName: sale.inventory.productName,
      sellingPrice: sale.inventory.sellingPrice,
    },
    quantity: sale.quantity,
    price: sale.inventory.sellingPrice,
  }));

  const handleSelectRange = async(type: selectTyp) => {
    try{
      toast.loading("Loading sales...", { id: "loading-sales" });
      const sales = await axios.get(`/api/sales/${type}`);
      setSales(sales.data);
      toast.dismiss("loading-sales");
    } catch (error) {
      console.log(error);
      toast.error("Failed to load sales", { id: "loading-sales" });
    }finally{
      toast.dismiss("loading-sales");
    }
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
                <CardDescription>
                  Manage and track customer orders
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                {/* <Button
                  variant="outline"
                  onClick={handleExport}
                  className="cursor-pointer"
                >
                  <Printer className="h-4 w-4 mr-2" /> Print
                </Button> */}
                {/* <Button
                  className="cursor-pointer"
                  onClick={() => router.push("/dashboard/admin/sales/new")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Order
                </Button> */}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              data={sales}
              columns={columns}
              searchPlaceholder="Search from sales..."
              printTitle="Sales Report"
              onSelectRange={handleSelectRange}
            />
          </CardContent>
        </Card>
        {selectedSales && selectedSales.length > 0 && (
          <OrderReceipt
            orderId={selectedSales[0].id.toString()}
            customerName={selectedSales[0].customer.customerName}
            customerPhone={selectedSales[0].customer.customerPhone}
            orderDate={new Date(selectedSales[0].createdAt)}
            orderItems={items}
            total={selectedSales.reduce(
              (acc, sale) =>
                acc +
                sale.quantity *
                  parseInt(sale.inventory.sellingPrice.toString()),
              0
            )}
            onClose={() => setSelectedSales([])}
            companyName={selectedSales[0]?.company?.name}
            companyAddress={selectedSales[0]?.company?.address}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
