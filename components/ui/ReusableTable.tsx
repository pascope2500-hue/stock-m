import { useState, useMemo, ReactNode } from "react";
import {
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
  PrinterIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  FunnelIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { LoadingSpinner } from "./loading-spinner";

type SortDirection = "ascending" | "descending";

export type ColumnDefinition<T extends Record<string, unknown>> = {
  key: keyof T;
  header: string;
  cell: (item: T) => ReactNode;
  sortable?: boolean;
  width?: string;
  printable?: boolean;
  defaultVisible?: boolean; // New property to control default visibility
};

type SortConfig<T extends Record<string, unknown>> = {
  key: keyof T;
  direction: SortDirection;
};

type FilterOption = {
  value: string;
  label: string;
};

type ReusableTableProps<T extends Record<string, unknown>> = {
  data: T[];
  columns: ColumnDefinition<T>[];
  defaultSort?: SortConfig<T>;
  searchKeys?: Array<keyof T>;
  filterOptions?: {
    key: keyof T;
    options: FilterOption[];
  };
  itemsPerPageOptions?: number[];
  printTitle?: string;
  className?: string;
  newButton?: ReactNode;
  isLoading?: boolean;
  persistColumnVisibility?: boolean; // New prop to persist visibility settings
};

export function ReusableTable<T extends Record<string, unknown>>({
  data,
  columns,
  defaultSort,
  searchKeys,
  filterOptions,
  itemsPerPageOptions = [5, 10, 20, 50],
  printTitle = "Table Data",
  className = "",
  newButton,
  isLoading = false,
  persistColumnVisibility = false, // Default to not persist
}: ReusableTableProps<T>) {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(
    defaultSort || null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);

  // Initialize visible columns
  const getInitialVisibleColumns = () => {
    if (persistColumnVisibility && typeof window !== "undefined") {
      const storedVisibility = localStorage.getItem("tableColumnVisibility");
      if (storedVisibility) {
        try {
          const parsed = JSON.parse(storedVisibility) as Set<string>;
          const validKeys = new Set<keyof T>();
          parsed.forEach((key) => {
            if (columns.some((col) => col.key === key)) {
              validKeys.add(key as keyof T);
            }
          });
          return validKeys;
        } catch (e) {
          console.error("Failed to parse stored column visibility", e);
        }
      }
    }
    return new Set(
      columns
        .filter((col) => col.defaultVisible !== false) // Only include columns not explicitly set to false
        .map((col) => col.key)
    );
  };
  
  const [visibleColumns, setVisibleColumns] = useState<Set<keyof T>>(
    getInitialVisibleColumns()
  );

  // Save column visibility when it changes
  const updateVisibleColumns = (newVisibleColumns: Set<keyof T>) => {
    setVisibleColumns(newVisibleColumns);
    if (persistColumnVisibility && typeof window !== "undefined") {
      localStorage.setItem(
        "tableColumnVisibility",
        JSON.stringify(Array.from(newVisibleColumns))
      );
    }
  };

  // Toggle column visibility
  const toggleColumnVisibility = (key: keyof T) => {
    const newVisibleColumns = new Set(visibleColumns);
    if (newVisibleColumns.has(key)) {
      newVisibleColumns.delete(key);
    } else {
      newVisibleColumns.add(key);
    }
    updateVisibleColumns(newVisibleColumns);
  };

  // Reset all columns to visible
  const resetColumnVisibility = () => {
    // except image column
    const allColumns = new Set(columns.map(col => col.key));
    updateVisibleColumns(allColumns);
  };

  // Filter columns based on visibility
  const visibleColumnsData = useMemo(() => {
    return columns.filter(col => visibleColumns.has(col.key));
  }, [columns, visibleColumns]);

  // Get search keys from columns if not provided
  const effectiveSearchKeys = searchKeys || columns.map((col) => col.key);

  // Filter, sort and paginate data
  const processedData = useMemo(() => {
    let result = [...data];

    if (searchTerm) {
      result = result.filter((item) =>
        effectiveSearchKeys.some((key) =>
          String(item[key]).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (filterOptions && filterValue) {
      result = result.filter(
        (item) => String(item[filterOptions.key]) === filterValue
      );
    }

    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [
    data,
    searchTerm,
    filterValue,
    sortConfig,
    effectiveSearchKeys,
    filterOptions,
  ]);

  // Pagination
  const totalItems = processedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedData.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, itemsPerPage, processedData]);

  // Handle sort
  const handleSort = (key: keyof T) => {
    let direction: SortDirection = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  // Handle print
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      const printableColumns = columns.filter(
        (col) =>
          (col.sortable !== undefined || 
           (col.header !== "Actions" && col.header !== "image" && col.printable !== false)) &&
          visibleColumns.has(col.key)
      );

      printWindow.document.write(`
        <html>
          <head>
            <title>${printTitle}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              @page { size: auto; margin: 5mm; }
            </style>
          </head>
          <body>
            <h1 style="text-align: center; margin-bottom: 20px;">${printTitle}</h1>
            <p style="text-align: center; margin-bottom: 20px;">Generated on ${new Date().toLocaleString()}</p>
            <table>
              <thead>
                <tr>
                  ${printableColumns
                    .map((col) => `<th>${col.header}</th>`)
                    .join("")}
                </tr>
              </thead>
              <tbody>
                ${
                  processedData.length > 0
                    ? processedData
                        .map(
                          (item) => `
                    <tr>
                      ${printableColumns
                        .map((col) => `<td>${col.cell(item)}</td>`)
                        .join("")}
                    </tr>
                  `
                        )
                        .join("")
                    : `<tr><td colspan="${printableColumns.length}">No data available</td></tr>`
                }
              </tbody>
            </table>
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

const ColumnVisibilityControl = () => {
  return (
    <Menu as="div" className="relative">
      <MenuButton
        className="inline-flex items-center gap-x-1 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 cursor-pointer"
      >
        <Squares2X2Icon className="h-5 w-5" />
        Columns
      </MenuButton>

      <MenuItems
      anchor={"bottom"}
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <div className="py-1 max-h-60 overflow-y-auto">
          <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b">
            Toggle Columns
          </div>
          {columns.map((column) => (
            <MenuItem key={column.key as string}>
              {({ active }) => (
                <div
                  className={`px-4 py-2 text-sm flex items-center ${
                    active ? 'bg-gray-50' : ''
                  }`}
                >
                  <input
                    id={`column-${column.key as string}`}
                    name={`column-${column.key as string}`}
                    type="checkbox"
                    checked={visibleColumns.has(column.key)}
                    onChange={() => toggleColumnVisibility(column.key)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 mr-2"
                  />
                  <label
                    htmlFor={`column-${column.key as string}`}
                    className="text-gray-700 whitespace-nowrap"
                  >
                    {column.header}
                  </label>
                </div>
              )}
            </MenuItem>
          ))}
          <div className="px-4 py-2 border-t">
            <button
              onClick={resetColumnVisibility}
              className="text-xs text-indigo-600 hover:text-indigo-900"
            >
              Reset to Default
            </button>
          </div>
        </div>
      </MenuItems>
    </Menu>
  );
};

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Table Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {filterOptions && (
            <div className="relative flex-1 max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FunnelIcon className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="block w-full rounded-md border-0 py-1.5 pl-10 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={filterValue}
                onChange={(e) => {
                  setFilterValue(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All</option>
                {filterOptions.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          )}
        </div>

        <div className="overflow-x-auto overflow-y-hidden flex items-center gap-3">
  <div className="flex items-center gap-2">
    <label
      htmlFor="itemsPerPage"
      className="text-sm text-gray-700 whitespace-nowrap"
    >
      Items per page:
    </label>
    <select
      id="itemsPerPage"
      className="rounded-md border-0 py-1.5 pl-2 pr-8 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      value={itemsPerPage}
      onChange={(e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
      }}
    >
      {itemsPerPageOptions.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>

  <ColumnVisibilityControl />

  <button
    type="button"
    onClick={handlePrint}
    className="inline-flex items-center gap-x-1 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 cursor-pointer"
  >
    <PrinterIcon className="h-5 w-5" />
    Print
  </button>

  {newButton}
</div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {visibleColumnsData.map((column) => (
                    <th
                      key={column.key as string}
                      scope="col"
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        column.sortable
                          ? "cursor-pointer hover:bg-gray-100"
                          : ""
                      }`}
                      onClick={() => column.sortable && handleSort(column.key)}
                      style={{ width: column.width }}
                    >
                      <div className="flex items-center">
                        {column.header}
                        {column.sortable && (
                          <ChevronUpDownIcon className="ml-2 h-4 w-4 text-gray-400" />
                        )}
                        {sortConfig?.key === column.key && (
                          <span className="ml-1 text-xs">
                            {sortConfig.direction === "ascending" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={visibleColumnsData.length}
                      className="px-6 py-5 text-center text-sm text-gray-500"
                    >
                      <LoadingSpinner size="sm" />
                    </td>
                  </tr>
                ) : currentItems.length > 0 ? (
                  currentItems.map((item, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-50">
                      {visibleColumnsData.map((column) => (
                        <td
                          key={`${column.key as string}-${rowIndex}`}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                          {column.cell(item)}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={visibleColumnsData.length}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, totalItems)}
            </span>{" "}
            of <span className="font-medium">{totalItems}</span> results
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="rounded-md p-1 text-gray-400 hover:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="First page"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-md p-1 text-gray-400 hover:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`rounded-md px-3 py-1 text-sm font-medium ${
                      currentPage === pageNum
                        ? "bg-indigo-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-md p-1 text-gray-400 hover:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="rounded-md p-1 text-gray-400 hover:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Last page"
            >
              <ArrowRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}