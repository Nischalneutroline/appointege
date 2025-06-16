"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const DataTableSkeleton = () => {
  // Simulate 5 columns (select, title/name, description/email, status, actions, etc.)
  const columnCount = 5;
  // Show 5 placeholder rows
  const rowCount = 5;

  return (
    <div className="flex flex-col gap-2">
      {/* Search bar and column toggle skeleton */}
      <div className="flex items-center justify-between gap-4">
        <div className="h-10 w-1/3 rounded-md bg-gray-200 animate-pulse" />{" "}
        {/* Search bar */}
        <div className="h-10 w-32 rounded-md bg-gray-200 animate-pulse" />{" "}
        {/* Column toggle */}
      </div>
      {/* Table skeleton */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: columnCount }).map((_, index) => (
                <TableHead key={index}>
                  <div className="h-6 w-20 rounded bg-gray-200 animate-pulse" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rowCount }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from({ length: columnCount }).map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    <div className="h-6 w-full rounded bg-gray-200 animate-pulse" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Pagination skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-40 rounded bg-gray-200 animate-pulse" />{" "}
        {/* Page info */}
        <div className="flex gap-2">
          <div className="h-8 w-24 rounded bg-gray-200 animate-pulse" />{" "}
          {/* Previous */}
          <div className="h-8 w-24 rounded bg-gray-200 animate-pulse" />{" "}
          {/* Next */}
        </div>
      </div>
    </div>
  );
};

export default DataTableSkeleton;
