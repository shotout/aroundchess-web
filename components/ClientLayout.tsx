"use client";

import { usePathname } from "next/navigation";
import Navigation from "./navigator/navigation";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Define routes that should not have navigation
  const routesWithoutNavigation = ["/login", "/signup", "/reset-password"];

  // Check if current path should have navigation
  // Add null check and exact matching for more reliable behavior
  const shouldShowNavigation = pathname
    ? !routesWithoutNavigation.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
      )
    : true; // Default to showing navigation if pathname is null (during initial hydration)

  console.log(
    "Current path:",
    pathname,
    "Show navigation:",
    shouldShowNavigation
  );

  // Render children directly or with Navigation based on the path
  return shouldShowNavigation ? <Navigation>{children}</Navigation> : children;
}
