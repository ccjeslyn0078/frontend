"use client";

import * as React from "react";
import { cn } from "./utils";

/* =========================
   TYPES
========================= */

type Column = {
  accessorKey: string;
  header: string;
  cell?: (row: any) => React.ReactNode;
};

type CommonTableProps = {
  data: any[];
  columns: Column[];
};

/* =========================
   BASE UI COMPONENTS (UNCHANGED)
========================= */

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div className="relative w-full overflow-x-auto">
      <table
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead className={cn("[&_tr]:border-b", className)} {...props} />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      className={cn(
        "hover:bg-muted/50 border-b transition-colors",
        className
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      className={cn(
        "text-foreground h-10 px-3 text-left align-middle font-medium whitespace-nowrap",
        className
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      className={cn("p-3 align-middle whitespace-nowrap", className)}
      {...props}
    />
  );
}

/* =========================
   🔥 COMMON TABLE (MAIN)
========================= */

function CommonTable({ data, columns }: CommonTableProps) {
  return (
    <Table>
      {/* HEADER */}
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col.accessorKey}>
              {col.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      {/* BODY */}
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center py-6 text-gray-500">
              No data found
            </TableCell>
          </TableRow>
        ) : (
          data.map((row, index) => (
            <TableRow key={index}>
              {columns.map((col) => (
                <TableCell key={col.accessorKey}>
                  {col.cell
                    ? col.cell(row) // custom UI
                    : row[col.accessorKey]} // default value
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

/* =========================
   EXPORTS
========================= */

export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  CommonTable, 
};
