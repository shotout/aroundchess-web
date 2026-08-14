"use client";

import { usePathname } from "next/navigation";
import Navigation from "./navigator/navigation";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const routesWithoutNavigation = ["/login", "/signup", "/reset-password"];

  const shouldShowNavigation = pathname
    ? !routesWithoutNavigation.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
      )
    : true;

  console.log(
    "Current path:",
    pathname,
    "Show navigation:",
    shouldShowNavigation
  );

  return shouldShowNavigation ? <Navigation>{children}</Navigation> : children;
}
