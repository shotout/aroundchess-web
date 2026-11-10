"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { logSuccess } from "@/functions/error-logger";

/**
 * One SCREEN_VIEW log per page the user opens, so a reported error can be read
 * against the path that led to it. Renders nothing.
 */
export function ErrorLoggerHost() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) logSuccess("SCREEN_VIEW", { message: pathname, screen: pathname });
  }, [pathname]);

  return null;
}
