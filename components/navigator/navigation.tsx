"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useProfileStore } from "@/app/store/profile";
import { SiteFooterNew } from "@/components/site-footer-new";
import { SiteHeaderNew } from "../site-header-new";
import DesktopNavigation from "./DesktopNavigation";
import MobileNavigation from "./MobileNavigation";

interface NavigationProps {
  children: React.ReactNode;
  isDialogOpen?: boolean;
}

export default function Navigation({
  children,
  isDialogOpen = false,
}: NavigationProps) {
  const pathname = usePathname();
  const { sessionId } = useProfileStore();

  // State management
  const [isDesktop, setIsDesktop] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Derived state
  const isSignedIn = sessionId.length > 0;
  const isAnalysisPage = pathname?.includes("analysis");
  const shouldShowMainNavigation = isSignedIn || isAnalysisPage;

  // Desktop detection
  const checkIfDesktop = () => {
    if (typeof window === "undefined") return;
    const isDesktopSize = window.innerWidth >= 1280;
    setIsDesktop(isDesktopSize);
  };

  // Effects
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    checkIfDesktop();
    window.addEventListener("resize", checkIfDesktop);
    return () => window.removeEventListener("resize", checkIfDesktop);
  }, [mounted]);

  // Don't render anything until mounted to prevent hydration issues
  if (!mounted) {
    return null;
  }

  // Render simple layout for non-authenticated users (except analysis page)
  if (!shouldShowMainNavigation) {
    return (
      <>
        <SiteHeaderNew />
        {children}
        <SiteFooterNew />
      </>
    );
  }

  // Render appropriate navigation based on screen size
  if (isDesktop) {
    return (
      <DesktopNavigation isDialogOpen={isDialogOpen}>
        {children}
      </DesktopNavigation>
    );
  }

  return (
    <MobileNavigation isDialogOpen={isDialogOpen}>{children}</MobileNavigation>
  );
}
