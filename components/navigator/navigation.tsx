"use client";
import { SiteFooterNew } from "@/components/site-footer-new";
import { useEffect, useState } from "react";
import Sidebar from "@/components/navigator/Sidebar";
import Header from "@/components/navigator/header";

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
    <div className="flex overflow-hidden bg-[#FCFCFD]">
      {isDesktop && (
        <div className="w-64 border-r border-gray-200 bg-white z-50 relative">
          <Sidebar />
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Header - always stays on top */}
        <div className="z-50 relative">
          <Header onSidebarToggle={toggleSidebar} />
        </div>

        <main className="flex-1 pt-20 xl:pt-0 overflow-y-auto relative">
          {/* Overlay that darkens only the main content when dialog is open */}
          {isDialogOpen && (
            <div
              className="fixed inset-x-0 top-20 bottom-16 md:bottom-20 bg-black/10 z-10"
              style={{
                top: isDesktop ? "0" : "5rem",
                bottom: "0",
                marginBottom: "50px", // Leave space for footer
              }}
            />
          )}

          {/* Main content container */}
          <div className="relative z-20">{children}</div>

          {/* Footer - always stays on top */}
          <div className="z-50 relative">
            <SiteFooterNew />
          </div>
        </main>
      </div>

      {!isDesktop && isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 z-50 w-64 bg-white border-l border-gray-200">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}
    </div>
  );
}
