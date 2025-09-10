"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useMemo, useEffect } from "react";
import {
  Trash2,
  Search,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { OrderReceipt } from "@/components/receipt/order-receipt";
import { useAuth } from "@/context/AuthContext";
interface OrderItem {
  productId: number;
  product: Inventory;
  quantity: number;
  price: number | "";
}

export default function OrdersPage() {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Inventory | null>(
    null
  );
  const [quantity, setQuantity] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;
  const [products, setProducts] = useState<Inventory[]>([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const { user } = useAuth();
  const fetchInventory = async () => {
    toast.loading("loading inventory ...", { id: "inventory-loading" });
    try {
      const inv = await axios.get("/api/inventory/in-stock");

      setProducts(inv.data);
    } catch (err) {
      const error = err as AxiosError;
      toast.error((error.response?.data as { error: string }).error.toString());
      console.log(error);
    } finally {
      toast.dismiss("inventory-loading");
    }
  };
  useEffect(() => {
    fetchInventory();
  }, []);

  const addToOrder = () => {
    if (!selectedProduct || quantity < 1) return;

    // Check if product already exists in order
    const existingItemIndex = orderItems.findIndex(
      (item) => item.productId === selectedProduct.id
    );

    if (existingItemIndex >= 0) {
      // Update quantity if product already in order
      const updatedItems = [...orderItems];
      updatedItems[existingItemIndex].quantity += quantity;
      setOrderItems(updatedItems);
    } else {
      // Add new product to order
      setOrderItems([
        ...orderItems,
        {
          productId: selectedProduct.id,
          product: selectedProduct,
          quantity,
          price: selectedProduct.sellingPrice,
        },
      ]);
    }

    // Reset selection
    setSelectedProduct(null);
    setQuantity(1);
  };

  const removeFromOrder = (productId: number) => {
    setOrderItems(orderItems.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    setOrderItems(
      orderItems.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const calculateTotal = () => {
    return orderItems.reduce(
      (total, item) => total + parseInt(item.price.toString()) * item.quantity,
      0
    );
  };

  const confirmOrder = async () => {
    try {
      // number less
      if(customerPhone.trim().length >1 ){
        if(customerPhone.trim().length < 10)
        return toast.error("The phone number must be 10 digits");
      }
      toast.loading("creating Order ...", { id: "order-loading" });
      const res = await axios.post("/api/sales", {
        customerName,
        customerPhone,
        items: orderItems.map((item) => ({
          ...item,
          product: undefined,
        })),
        total: calculateTotal(),
      });
      if (res.data.status === 200 || res.status === 200) {
        toast.success("Order created successfully");
        setShowReceipt(true);
      } else {
        toast.error("Error creating order");
      }
    } catch (error) {
      toast.error(error as string);
    } finally {
      toast.dismiss("order-loading");
    }
  };

  const filteredProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          product.productName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.expirationDate
            ?.toString()
            .includes(searchTerm.toLowerCase()) ||
          product.purchaseDate?.toString().includes(searchTerm.toLowerCase()) ||
          product.purchasePrice
            ?.toString()
            .includes(searchTerm.toLowerCase()) ||
          product.sellingPrice?.toString().includes(searchTerm.toLowerCase())
      ),
    [products, searchTerm]
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <DashboardLayout title="Orders" subtitle="Manage customer orders and track">
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label htmlFor="customerName">Customer Name</Label>
            <Input
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter customer name"
            />
          </div>
          <div>
            <Label htmlFor="customerPhone">Customer Phone</Label>
            <Input
              id="customerPhone"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Enter customer phone"
            />
          </div>
        </div>

        {/* Product Selection and Order Summary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Product Selection Panel */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Products</CardTitle>
              <CardDescription>Select products to add to order</CardDescription>
              <div className="relative mt-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto p-4">
                <div className="space-y-3">
                  {currentProducts.map((product) => (
                    <div
                      key={product.id}
                      className={`p-3 border rounded-md cursor-pointer transition-colors ${
                        selectedProduct?.id === product.id
                          ? "border-primary bg-primary/10"
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() => setSelectedProduct(product)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <p className="font-medium">{product.productName}</p>
                          {/* <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p> */}
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-medium">
                            Rwf
                            {parseInt(product.sellingPrice.toString()).toFixed(
                              2
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Stock: {product.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredProducts.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No products found
                    </div>
                  )}
                </div>
              </div>

              {/* Pagination Controls */}
              {filteredProducts.length > productsPerPage && (
                <div className="flex items-center justify-between px-4 py-3 border-t">
                  <div className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * productsPerPage + 1} to{" "}
                    {Math.min(
                      currentPage * productsPerPage,
                      filteredProducts.length
                    )}{" "}
                    of {filteredProducts.length} products
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPrevPage}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Add to Cart Section - Fixed at bottom */}
              {selectedProduct && (
                <div className="border-t p-4 bg-muted/30">
                  <h3 className="font-medium mb-3">Add to Order</h3>
                  <div className="flex items-end justify-between">
                    <div className="space-y-2 flex-1 mr-4">
                      <Label htmlFor="quantity">Quantity</Label>
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="h-9 w-9 p-0"
                        >
                          -
                        </Button>
                        <Input
                          id="quantity"
                          type="number"
                          min="1"
                          max={selectedProduct.quantity}
                          value={quantity}
                          onChange={(e) =>
                            setQuantity(
                              Math.max(1, parseInt(e.target.value) || 1)
                            )
                          }
                          className="mx-2 h-9 w-16 text-center"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setQuantity(
                              Math.min(
                                parseInt(selectedProduct.quantity.toString()),
                                quantity + 1
                              )
                            )
                          }
                          className="h-9 w-9 p-0"
                        >
                          +
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Max: {selectedProduct.quantity} available
                      </p>
                    </div>
                    <Button
                      onClick={addToOrder}
                      className="whitespace-nowrap cursor-pointer"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Order
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Summary Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Review and confirm your order</CardDescription>
            </CardHeader>
            <CardContent>
              {orderItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No items in order yet</p>
                  <p className="text-sm mt-1">
                    Select products from the list to add them to your order
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="max-h-80 overflow-y-auto">
                    {orderItems.map((item) => (
                      <div
                        key={item.productId}
                        className="flex justify-between items-center p-3 border rounded-md"
                      >
                        <div className="flex-1">
                          <p className="font-medium">
                            {item.product.productName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Rwf {parseInt(item.price.toString()).toFixed(2)} each
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                            disabled={
                              item.quantity >=
                              parseInt(item.product.quantity.toString())
                            }
                          >
                            +
                          </Button>
                          <p className="w-20 text-right font-medium">
                            Rwf
                            {(
                              parseInt(item.price.toString()) * item.quantity
                            ).toFixed(2)}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 cursor-pointer"
                            onClick={() => removeFromOrder(item.productId)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>Rwf {calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-4 cursor-pointer"
                    onClick={confirmOrder}
                    disabled={
                      orderItems.length === 0 || !customerName || !customerPhone
                    }
                  >
                    Confirm Order
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {showReceipt && (
          <OrderReceipt
            // orderId={savedProduct?.id ? savedProduct?.id.toString : ''}
            customerName={customerName}
            customerPhone={customerPhone}
            orderItems={orderItems}
            total={calculateTotal()}
            orderDate={new Date()}
            companyAddress={user?.companyAddress}
            companyName={user?.companyAddress}
            onClose={async () => {
              setShowReceipt(false);
              setOrderItems([]);
              await fetchInventory();
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

// The rest of your code remains the same...
