// "use client"

// import * as React from "react"
// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Skeleton } from "@/components/ui/skeleton"
// import { ChevronLeft, ChevronRight, Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"

// export interface Column<T> {
//   key: keyof T
//   header: string
//   sortable?: boolean
//   render?: (value: any, row: T) => React.ReactNode
//   width?: string
// }

// export interface DataTableProps<T> {
//   data: T[]
//   columns: Column<T>[]
//   loading?: boolean
//   searchable?: boolean
//   searchPlaceholder?: string
//   pageSize?: number
//   className?: string
//   emptyMessage?: string
// }

// export function DataTable<T extends Record<string, any>>({
//   data,
//   columns,
//   loading = false,
//   searchable = true,
//   searchPlaceholder = "Search...",
//   pageSize = 10,
//   className,
//   emptyMessage = "No data available",
// }: DataTableProps<T>) {
//   const [searchTerm, setSearchTerm] = React.useState("")
//   const [sortConfig, setSortConfig] = React.useState<{
//     key: keyof T | null
//     direction: "asc" | "desc"
//   }>({ key: null, direction: "asc" })
//   const [currentPage, setCurrentPage] = React.useState(1)

//   // Filter data based on search term
//   const filteredData = React.useMemo(() => {
//     if (!searchTerm) return data
//     return data.filter((item) =>
//       Object.values(item).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase())),
//     )
//   }, [data, searchTerm])

//   // Sort data
//   const sortedData = React.useMemo(() => {
//     if (!sortConfig.key) return filteredData

//     return [...filteredData].sort((a, b) => {
//       const aValue = a[sortConfig.key!]
//       const bValue = b[sortConfig.key!]

//       if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
//       if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
//       return 0
//     })
//   }, [filteredData, sortConfig])

//   // Paginate data
//   const paginatedData = React.useMemo(() => {
//     const startIndex = (currentPage - 1) * pageSize
//     return sortedData.slice(startIndex, startIndex + pageSize)
//   }, [sortedData, currentPage, pageSize])

//   const totalPages = Math.ceil(sortedData.length / pageSize)

//   const handleSort = (key: keyof T) => {
//     setSortConfig((prev) => ({
//       key,
//       direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
//     }))
//   }

//   const getSortIcon = (key: keyof T) => {
//     if (sortConfig.key !== key) return <ArrowUpDown className="h-4 w-4" />
//     return sortConfig.direction === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
//   }

//   if (loading) {
//     return (
//       <div className={cn("space-y-4", className)}>
//         {searchable && <Skeleton className="h-10 w-full max-w-sm" />}
//         <div className="border rounded-md">
//           <div className="p-4">
//             <div className="space-y-2">
//               {Array.from({ length: 5 }).map((_, i) => (
//                 <Skeleton key={i} className="h-12 w-full" />
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className={cn("space-y-4", className)}>
//       {searchable && (
//         <div className="flex items-center space-x-2">
//           <div className="relative flex-1 max-w-sm">
//             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//             <Input
//               placeholder={searchPlaceholder}
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-9"
//             />
//           </div>
//         </div>
//       )}

//       <div className="border rounded-md">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b bg-muted/50">
//                 {columns.map((column) => (
//                   <th
//                     key={String(column.key)}
//                     className={cn(
//                       "px-4 py-3 text-left text-sm font-medium text-muted-foreground",
//                       column.sortable && "cursor-pointer hover:text-foreground",
//                       column.width && `w-${column.width}`,
//                     )}
//                     onClick={() => column.sortable && handleSort(column.key)}
//                   >
//                     <div className="flex items-center space-x-2">
//                       <span>{column.header}</span>
//                       {column.sortable && getSortIcon(column.key)}
//                     </div>
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {paginatedData.length === 0 ? (
//                 <tr>
//                   <td colSpan={columns.length} className="px-4 py-8 text-center text-muted-foreground">
//                     {emptyMessage}
//                   </td>
//                 </tr>
//               ) : (
//                 paginatedData.map((row, index) => (
//                   <tr key={index} className="border-b hover:bg-muted/50">
//                     {columns.map((column) => (
//                       <td key={String(column.key)} className="px-4 py-3 text-sm">
//                         {column.render ? column.render(row[column.key], row) : String(row[column.key] || "")}
//                       </td>
//                     ))}
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {totalPages > 1 && (
//           <div className="flex items-center justify-between px-4 py-3 border-t">
//             <div className="text-sm text-muted-foreground">
//               Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of{" "}
//               {sortedData.length} results
//             </div>
//             <div className="flex items-center space-x-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
//                 disabled={currentPage === 1}
//               >
//                 <ChevronLeft className="h-4 w-4" />
//                 Previous
//               </Button>
//               <div className="flex items-center space-x-1">
//                 {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                   const page = i + 1
//                   return (
//                     <Button
//                       key={page}
//                       variant={currentPage === page ? "default" : "outline"}
//                       size="sm"
//                       onClick={() => setCurrentPage(page)}
//                       className="w-8 h-8 p-0"
//                     >
//                       {page}
//                     </Button>
//                   )
//                 })}
//               </div>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
//                 disabled={currentPage === totalPages}
//               >
//                 Next
//                 <ChevronRight className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Printer,
} from "lucide-react";

export interface Column<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
  isPrint?: boolean;
  printRender?: (value: any, row: T) => string;
}
export type selectTyp =
  | "today"
  | "yesterday"
  | "last_week"
  | "last_month"
  | "all";
export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  itemsPerPageOptions?: number[];
  className?: string;
  emptyMessage?: string;
  printTitle?: string;
  onPrint?: () => void;
  onSelectRange?: (range: selectTyp) => void;

}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  searchable = true,
  searchPlaceholder = "Search...",
  itemsPerPageOptions = [5, 10, 20, 50, 100, 500],
  className,
  emptyMessage = "No data available",
  printTitle = "Table",
  onPrint,
  onSelectRange,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortConfig, setSortConfig] = React.useState<{
    key: keyof T | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = React.useState(1);
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [selectedRange, setSelectedRange] = React.useState("select");
  const [pageSize, setPageSize] = React.useState(itemsPerPageOptions[0]);
  // Filter data based on search term
  const filteredData = React.useMemo(() => {
    if (!searchTerm) return data;
    return data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (key: keyof T) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortIcon = (key: keyof T) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="h-4 w-4" />;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
      return;
    }

    // Only include columns where isPrint !== false
    const printColumns = columns.filter((col) => col.isPrint !== false);
    const printableRows = sortedData;
    const printWindow = window.open("", "_blank");

    if (printWindow) {
      // Helper function to extract text content from rendered cells
      const getPrintValue = (row: T, col: Column<T>) => {
        // Use printRender if available
        if (col.printRender) {
          return col.printRender(row[col.key], row);
        }

        // Fallback to regular render or raw value
        if (col.render) {
          // For complex React components, fall back to raw data
          const value = row[col.key];

          // Handle common data types for fallback
          if (typeof value === "object" && value !== null) {
            // Try to extract meaningful information from objects
            if ("customerName" in value && "customerPhone" in value) {
              return `${value.customerName}\n${value.customerPhone}`;
            }
            if ("productName" in value && "sellingPrice" in value) {
              return `${value.productName}\nRwf ${value.sellingPrice}`;
            }
            return JSON.stringify(value);
          }

          return String(value ?? "");
        }

        // For non-rendered cells
        const value = row[col.key];
        if (typeof value === "object" && value !== null) {
          return JSON.stringify(value);
        }
        return String(value ?? "");
      };

      printWindow.document.write(`
      <html>
        <head>
          <title>${printTitle}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f8f9fa; font-weight: bold; }
            tr:nth-child(even) { background-color: #f2f2f2; }
            .text-center { text-align: center; }
            @media print { 
              body { margin: 0; }
              table { font-size: 12px; }
            }
          </style>
        </head>
        <body>
          <h2 style="text-align:center; margin-bottom: 20px;">${printTitle}</h2>
          <table>
            <thead>
              <tr>
                ${printColumns.map((col) => `<th>${col.header}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${
                printableRows.length > 0
                  ? printableRows
                      .map(
                        (row) =>
                          `<tr>
                        ${printColumns
                          .map(
                            (col) =>
                              `<td>${getPrintValue(row, col).replace(
                                /\n/g,
                                "<br>"
                              )}</td>`
                          )
                          .join("")}
                      </tr>`
                      )
                      .join("")
                  : `<tr><td colspan="${printColumns.length}" class="text-center">${emptyMessage}</td></tr>`
              }
            </tbody>
          </table>
          <div style="margin-top: 20px; text-align: center; font-size: 12px; color: #666;">
            Generated on ${new Date().toLocaleDateString()}
          </div>
        </body>
      </html>
    `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 200);
    }
  };

  const rangeOptions = [
    { value: "select", label: "Select" },
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "last_week", label: "Last Week" },
    { value: "last_month", label: "Last Month" },
    { value: "all", label: "All" },
  ];

  if (loading) {
    return (
      <div className={cn("space-y-4", className)}>
        {searchable && <Skeleton className="h-10 w-full max-w-sm" />}
        <div className="border rounded-md">
          <div className="p-4">
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center space-x-2">
        {searchable && (
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        )}

        <div>
          <label
            htmlFor="page-select"
            className="mr-2 text-sm text-muted-foreground"
          >
            Page
          </label>
          <select
            id="page-select"
            value={pageSize}
            onChange={(e) => {
              setPageSize(parseInt(e.target.value));
            }}
            className="border rounded px-2 py-2 text-sm"
          >
            {
              // must be 5, 10, 50, 100
              [5, 10, 50, 100].map((opt) => (
                <option key={opt} value={opt}>
                  {" "}
                  {opt}
                </option>
              ))
            }
          </select>
        </div>
        {
          onSelectRange&&(
            <div>
          <label
            htmlFor="range-select"
            className="mr-2 text-sm text-muted-foreground"
          >
            Range
          </label>
          <select
            id="range-select"
            value={selectedRange}
            onChange={(e) => {
              setSelectedRange(e.target.value as selectTyp);
              if (onSelectRange) {
                onSelectRange(e.target.value as selectTyp);
              }
            }}
            className="border rounded px-3 py-2 text-sm "
          >
            {rangeOptions.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                disabled={opt.value === "select"}
              >
                {opt.label}
              </option>
            ))}
          </select>
        </div>
          )
        }
        

        <Button
          variant="outline"
          onClick={handlePrint}
          className="ml-auto flex-shrink-0"
        >
          <Printer className="h-4 w-4 mr-2" />
          Print Table
        </Button>
      </div>

      <div className="border rounded-md" ref={tableRef}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={cn(
                      "px-4 py-3 text-left text-sm font-medium text-muted-foreground",
                      column.sortable && "cursor-pointer hover:text-foreground",
                      column.width && `w-${column.width}`
                    )}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{column.header}</span>
                      {column.sortable && getSortIcon(column.key)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className="px-4 py-3 text-sm"
                      >
                        {column.render
                          ? column.render(row[column.key], row)
                          : String(row[column.key] || "")}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, sortedData.length)} of{" "}
              {sortedData.length} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
