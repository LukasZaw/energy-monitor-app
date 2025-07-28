"use client"

import React, { useEffect, useState } from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import type { VisibilityState, SortingState, ColumnFiltersState,   ColumnDef} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "~/components/ui/button"
import { Checkbox } from "~/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Input } from "~/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import axiosInstance from "~/lib/axios"

export type Device = {
  id: number
  type: string
  name: string
  powerWatt: number
  dailyUsageHours: number
  dailyCost: number
}

export const columns: ColumnDef<Device>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }: any) => <div>{row.getValue("type")}</div>,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }: any) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "powerWatt",
    header: "Power (W)",
    cell: ({ row }: any) => <div>{row.getValue("powerWatt")}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "dailyUsageHours",
    header: "Daily Usage (h)",
    cell: ({ row }: any) => <div>{row.getValue("dailyUsageHours")}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "dailyCost",
    header: "Daily Cost (zł)",
    cell: ({ row }: any) => (
      <div>
        {row.getValue("dailyCost").toFixed(2)} zł
      </div>
    ),
    enableSorting: true,
  },
]

export function DataTableExport() {
  const [data, setData] = useState<Device[]>([]);
  const [filter, setFilter] = useState(""); 
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  useEffect(() => {
    async function fetchDevices() {
      try {
        const response = await axiosInstance.get("/devices/user/me");
        const devices = response.data.map((device: any) => ({
          id: device.id,
          type: device.type,
          name: device.name,
          powerWatt: device.powerWatt,
          dailyUsageHours: device.dailyUsageHours,
          dailyCost:
            (device.powerWatt / 1000) *
            device.dailyUsageHours *
            device.user.energyCostPerKwh,
        }));
        setData(devices);
      } catch (error) {
        console.error("Failed to fetch devices:", error);
      }
    }
    fetchDevices();
  }, []);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter: filter,
    },
    globalFilterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      return value?.toString().toLowerCase().includes(filterValue.toLowerCase());
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by name or type..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      ["powerWatt", "dailyUsageHours", "dailyCost"].includes(
                        header.column.id
                      ) ? (
                        <Button
                          variant="ghost"
                          onClick={() =>
                            header.column.toggleSorting(
                              header.column.getIsSorted() === "asc"
                            )
                          }
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                      )
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-gray-900"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-5 py-3 border-t text-sm"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-500"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {"Export " + table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.{" "}
          
        </div>
          <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportToCSV(table)}
              >
                Export to CSV
              </Button>
          </div>
        <div className="space-x-2">
           
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

function exportToCSV(table: any) {
  const visibleColumns = table
    .getVisibleLeafColumns()
    .filter((column: any) => column.id !== "select");

  const selectedRows = table.getFilteredSelectedRowModel().rows;

  const headers = visibleColumns
    .map((column: any) => {
      if (typeof column.columnDef.header === "string") {
        return column.columnDef.header;
      }
      return column.id; 
    })
    .join(",");

  const rows = selectedRows.map((row: any) =>
    row
      .getVisibleCells()
      .filter((cell: any) => cell.column.id !== "select") 
      .map((cell: any) => cell.getValue())
      .join(",")
  );

  const csvContent = [headers, ...rows].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "exported_data.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}