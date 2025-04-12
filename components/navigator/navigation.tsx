"use client";
import { SiteFooterNew } from "@/components/site-footer-new";
import { useEffect, useState } from "react";
import Sidebar from "@/components/navigator/Sidebar";
import Header from "@/components/navigator/header";
import { ConfirmLogin } from "../modal/ConfirmLogin";

export default function Navigation({
  children,
  isDialogOpen = false,
}: {
  children: React.ReactNode;
  isDialogOpen?: boolean;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkIfDesktop = () => {
      setIsDesktop(window.innerWidth >= 1280);
    };

    checkIfDesktop();

    window.addEventListener("resize", checkIfDesktop);
    return () => window.removeEventListener("resize", checkIfDesktop);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#FCFCFD]">
      {/* Fixed sidebar for desktop - full height */}
      {isDesktop && (
        <div className="fixed top-0 left-0 h-full w-64 border-r border-gray-200 bg-white z-30">
          <Sidebar />
        </div>
      )}

      {/* Main content wrapper with header */}
      <div className={`flex flex-col w-full ${isDesktop ? "ml-64" : ""}`}>
        {/* Fixed header */}
        <div className="fixed top-[-1px] right-0 z-40 bg-white border-gray-200 left-0 xl:left-64">
          <Header onSidebarToggle={toggleSidebar} />
        </div>

        {/* Scrollable content area */}
        <main className="flex-1 overflow-y-auto pt-[72px] lg:pt-24">
          {/* Overlay when dialog is open */}
          {isDialogOpen && (
            <div
              className="fixed inset-0 bg-black/10 z-20"
              style={{
                top: "4.5rem", // Below header
                left: isDesktop ? "16rem" : "0", // Account for sidebar on desktop
                bottom: "0",
              }}
            />
          )}

          {/* Main content */}
          <div className="relative z-10 min-h-[calc(100vh-10rem)]">
            {children}
            <ConfirmLogin />
          </div>

          <div className="z-50 relative">
            <SiteFooterNew />
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay and panel */}
      {!isDesktop && isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}
    </div>
  );
}
