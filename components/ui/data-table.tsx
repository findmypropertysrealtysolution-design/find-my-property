"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTableSkeleton } from "@/components/skeletons/data-table-skeleton";

import { cn } from "@/lib/utils";

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  emptyMessage = "No results.",
  className,
}: DataTableProps<TData, TValue>) {
  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table's useReactTable is flagged by React Compiler; safe here.
  const table = useReactTable({
    data: isLoading ? [] : data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className={cn("overflow-hidden", className)}>
        <DataTableSkeleton columns={columns.length} />
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden", className)}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-muted/50 hover:bg-muted/50">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground italic">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
