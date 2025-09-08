"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash,
  Printer,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { ReusableForm } from "@/components/ReusableForm";
import axios from "axios";
import toast from "react-hot-toast";
export default function OrdersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  type Invent = Omit<Inventory, "companyId" | "createdAt" | "updatedAt">;
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [selectedInventory, setSelectedInventory] = useState<Invent | null>(
    null
  );

  const columns: Column<Inventory>[] = [
    {
      key: "quantity",
      header: "Order",
      sortable: true,
      render: (value, row) => (
        <div>
          <p className="font-medium">PRD-{row.id}</p>
          <p className="text-sm text-muted-foreground">Qty: {value}</p>
        </div>
      ),
      printRender(value, row) {
        return `PRD-${row.id} \n Qty: ${value}`;
      },
    },
    {
      key: "productName",
      header: "Product Name",
      sortable: true,
      render: (value, row) => (
        <div>
          <p className="font-medium">{value}</p>
          {/* <p className="text-sm text-muted-foreground">{row}</p> */}
        </div>
      ),
    },
    {
      key: "purchasePrice",
      header: "Purchase Price",
      sortable: true,
      render: (value) => `Rwf ${value.toFixed(2)}`,
    },
    {
      key: "sellingPrice",
      header: "Selling Price",
      sortable: true,
      render: (value) => `Rwf ${value.toFixed(2)}`,
    },
    {
      key: "purchaseDate",
      header: "Purchase Date",
      sortable: true,
      render: (value) => (value ? new Date(value).toLocaleDateString() : "N/A"),
      printRender(value, row) {
        return value ? new Date(value).toLocaleDateString() : "N/A";
      },
    },
    {
      key: "expirationDate",
      header: "Expiration Date",
      sortable: true,
      render: (value) => (value ? new Date(value).toLocaleDateString() : "N/A"),
      printRender(value, row) {
        return value ? new Date(value).toLocaleDateString() : "N/A";
      },
    },
    {
      key: "id",
      header: "Actions",
      isPrint: false,
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer"
            onClick={() => setSelectedInventory(row)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          {/* <Button
            variant="ghost"
            className="cursor-pointer"
            size="sm"
            onClick={() => handleDelete(row.id)}
          >
            <Trash className="h-4 w-4" />
          </Button> */}
        </div>
      ),
    },
  ];

  const handleDelete = async (id: number) => {
    toast.loading("Deleting inventory...", { id: "delete-inventory" });
    const response = await axios.delete(`/api/inventory/${id}`);
    if (response.status === 200) {
      toast.success("Inventory deleted successfully");
      fetchInventory();
    } else {
      toast.error("Failed to delete inventory");
    }
    toast.dismiss("delete-inventory");
  };
  const onCloseModal = async () => {
    setSelectedInventory(null);
    setIsModalOpen(false);
  };
  

  const handleExport = async (options: any) => {
    window.print();
  };

  const fetchInventory = async () => {
    toast.loading("Fetching inventory...", { id: "fetch-inventory" });
    const inventory = await axios.get("/api/inventory");
    setInventory(inventory.data);
    toast.dismiss("fetch-inventory");
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const saveInventory = async (
    data: Omit<Inventory, "id" | "companyId" | "createdAt" | "updatedAt">
  ) => {
    if (data.expirationDate)
      data.expirationDate = new Date(data.expirationDate);
    if (data.purchaseDate) data.purchaseDate = new Date(data.purchaseDate);
    if (
      data.expirationDate &&
      data.purchaseDate &&
      new Date(data.expirationDate) < new Date(data.purchaseDate)
    ) {
      return toast.error("Expiration date cannot be before purchase date");
    }
    const save = selectedInventory
      ? await axios.put("/api/inventory", { ...data, id: selectedInventory.id })
      : await axios.post("/api/inventory", data);
    if ((save.data.status as number) === 201) {
      onCloseModal();
      fetchInventory();
      return toast.success("Inventory saved successfully");
    } else {
      return toast.error("Failed to save inventory");
    }
  };

  return (
    <DashboardLayout
      title="Inventory"
      subtitle="Manage all products in your store"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Products</CardTitle>
                <CardDescription>Manage and modify product</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                {/* <Button variant="outline" onClick={handleExport} className="cursor-pointer">
                  <Printer className="h-4 w-4 mr-2" />
                  Export
                </Button> */}
                <Button
                  onClick={() => {
                    setIsModalOpen(true);
                    setSelectedInventory(null);
                  }}
                  className="cursor-pointer"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Product
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              data={inventory || []}
              columns={columns}
              searchPlaceholder="Search orders..."
              printTitle="Inventory"
            />
          </CardContent>
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen || selectedInventory !== null}
        onClose={onCloseModal}
        size="lg"
        title={selectedInventory ? "Edit Product" : "Record New Product"}
      >
        <ReusableForm<
          Omit<Inventory, "id" | "companyId" | "createdAt" | "updatedAt">
        >
          fields={[
            {
              label: "Product Name",
              name: "productName",
              type: "text",
              placeholder: "Enter product name",
              required: true,
            },
            {
              label: "Product Sku",
              name: "sku",
              type: "number",
              placeholder: "Enter product sku",
            },
            {
              label: "Quantity",
              name: "quantity",
              type: "number",
              placeholder: "Enter Inital Stock",
              colSpan: 2,
              required: true,
            },
            {
              label: "Purchase Price",
              name: "purchasePrice",
              type: "number",
              placeholder: "Enter purchase price",
              required: true,
            },
            {
              label: "Sale Price",
              name: "sellingPrice",
              type: "number",
              placeholder: "Enter sale price",
              required: true,
            },
            {
              label: "Purchase Date",
              name: "purchaseDate",
              type: "date",
              placeholder: "Enter purchase date",
            },
            {
              label: "Expiration Date",
              name: "expirationDate",
              type: "date",
              placeholder: "Enter expiration date",
            },
          ]}
          initialValues={{
            sku: selectedInventory?.sku || null,
            productName: selectedInventory?.productName || "",
            purchasePrice: selectedInventory?.purchasePrice || "",
            sellingPrice: selectedInventory?.sellingPrice || "",
            quantity: selectedInventory?.quantity || "",
            purchaseDate: selectedInventory?.purchaseDate || null,
            expirationDate: selectedInventory?.expirationDate || null,
          }}
          onSubmit={saveInventory}
          submitButtonText={selectedInventory ? "Update" : "Create"}
        />
      </Modal>
    </DashboardLayout>
  );
}
