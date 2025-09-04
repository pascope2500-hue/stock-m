
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, Download, X } from "lucide-react";
// import { useRef } from "react";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

export interface OrderItem {
  productId: number;
  product: {
    productName: string;
    sellingPrice: string | number;
  };
  quantity: number;
  price: number | "";
}

export interface ReceiptProps {
  orderId?: string;
  customerName: string;
  customerPhone: string;
  orderItems: OrderItem[];
  total: number;
  orderDate: Date;
  onClose?: () => void;
  onPrint?: () => void;
  companyName?: string;
  companyAddress?: string;
}

export function OrderReceipt({
  orderId,
  customerName,
  customerPhone,
  orderItems,
  total,
  orderDate,
  onClose,
  onPrint,
  companyName = "",
  companyAddress = ""
}: ReceiptProps) {


  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="bg-muted/30">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Order Receipt</CardTitle>
              {orderId && (
                <p className="text-sm text-muted-foreground">Order #: {orderId}</p>
              )}
            </div>
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Company Information */}
            <div className="text-center mb-4">
              <h2 className="font-bold text-lg">{companyName}</h2>
              <p className="text-sm text-muted-foreground">{companyAddress}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Customer</p>
                <p>{customerName}</p>
                <p>{customerPhone}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">Date</p>
                <p>{orderDate.toLocaleDateString()}</p>
                <p>{orderDate.toLocaleTimeString()}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Items</h3>
              <div className="space-y-2">
                {orderItems.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <div>
                      <p>{item.product.productName}</p>
                      <p className="text-muted-foreground">
                        {item.quantity} × Rwf {parseInt(item.price.toString()).toFixed(2)}
                      </p>
                    </div>
                    <p className="font-medium">
                      RWf {(parseInt(item.price.toString()) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>Rwf {total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between pt-4 print-hide">
              {/* <Button variant="outline" onClick={handleDownloadPDF}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button> */}
              <Button onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}