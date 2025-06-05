"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useProfileStore } from "@/app/store/profile";
import Sidebar from "@/components/navigator/Sidebar";
import Header from "@/components/navigator/header";
import { SiteFooterNew } from "@/components/site-footer-new";

interface DesktopNavigationProps {
  children: React.ReactNode;
  isDialogOpen?: boolean;
}

export default function DesktopNavigation({
  children,
  isDialogOpen = false,
}: DesktopNavigationProps) {
  const pathname = usePathname();
  const { sessionId } = useProfileStore();

  const [widthSidebar, setWidthSidebar] = useState(0);
  const [mounted, setMounted] = useState(false);

  const isSignedIn = sessionId.length > 0;
  const isAnalysisPage = pathname?.includes("analysis");
  const shouldShowSidebar = isSignedIn || isAnalysisPage;

  const calculateSidebarWidth = () => {
    if (typeof window === "undefined") return;
    const sidebarWidth = window.innerWidth / 6;
    setWidthSidebar(sidebarWidth);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    calculateSidebarWidth();
    window.addEventListener("resize", calculateSidebarWidth);
    return () => window.removeEventListener("resize", calculateSidebarWidth);
  }, [mounted]);

  if (!shouldShowSidebar) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#FCFCFD]">
      <div
        style={{ width: widthSidebar }}
        className="fixed top-0 left-0 h-full border-r border-gray-200 bg-white z-30"
      >
        <Sidebar />
      </div>

      <div
        style={{ marginLeft: widthSidebar }}
        className="flex flex-col w-full"
      >
        <div
          style={{ left: widthSidebar }}
          className="fixed -top-[1px] right-0 z-40 bg-white"
        >
          <Header onSidebarToggle={() => {}} />
        </div>

        <main className="flex-1 overflow-y-auto pt-[72px] lg:pt-24">
          {isDialogOpen && (
            <div
              className="fixed inset-0 bg-black/10 z-20"
              style={{
                top: "4.5rem",
                left: widthSidebar,
                bottom: 0,
              }}
            />
          )}

          <div className="relative z-10 min-h-[calc(100vh-56px)] xl:min-h-[calc(100vh-97px)]">
            {children}
          </div>

          <div className="z-49 relative">
            <SiteFooterNew />
          </div>
        </main>
      </div>
    </div>
  );
}
