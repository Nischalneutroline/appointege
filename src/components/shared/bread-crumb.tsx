"use client"; // required for using hooks like usePathname (client-side only)

import * as React from "react";
import { usePathname } from "next/navigation"; // Hook to get current URL path
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Optional: utility to format strings (you might already have this)
import { cn } from "@/lib/utils";

// Function to prettify each segment (e.g., "create-new" → "Create New")
const formatSegment = (segment: string) => {
  return segment
    .replace(/-/g, " ") // Replace dashes with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
};

const Breadcrumbs = () => {
  const pathname = usePathname(); // Gets current URL path
  const segments = pathname.split("/").filter(Boolean); // Splits path into parts and removes empty strings

  /**
   * Build breadcrumb items
   * Each item has a title and a link (except the last item, which is the current page)
   */
  const crumbs = segments.map((segment, index) => {
    // Build href for each segment up to current index
    const href = "/" + segments.slice(0, index + 1).join("/");

    return {
      title: formatSegment(segment), // Turn slug into readable text
      href: index !== segments.length - 1 ? href : undefined, // Last segment is current page, so no link
    };
  });

  return (
    <Breadcrumb className="mb-4 pl-2">
      <BreadcrumbList>
        {/* Home / Dashboard link */}
        {/* <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link className="text-blue-50" href="/admin">
              Dashboard
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem> */}
        {/* Show separator only if we have more crumbs
        {crumbs.length > 0 && <BreadcrumbSeparator className="text-blue-100" />} */}
        {/* Loop through the dynamic segments */}
        {crumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            <BreadcrumbItem>
              {/* If not the last segment, render it as a link */}
              {crumb.href ? (
                <BreadcrumbLink asChild>
                  <Link className="text-blue-50" href={crumb.href}>
                    {crumb.title}
                  </Link>
                </BreadcrumbLink>
              ) : (
                // Otherwise, render it as the current page
                <BreadcrumbPage className="text-blue-100 font-semibold">
                  {crumb.title}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>

            {/* Add a separator unless it's the last item */}
            {idx < crumbs.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
