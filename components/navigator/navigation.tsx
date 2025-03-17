"use client";
import { SiteFooterNew } from "@/components/site-footer-new";
import { useEffect, useState } from "react";
import Sidebar from "@/components/navigator/Sidebar";
import Header from "@/components/navigator/header";
export default function Navigation({
    children,
  }: {
    children: React.ReactNode;
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
    <div className="flex bg-[#FCFCFD]">
      {/* Desktop sidebar - always visible on desktop */}
      {isDesktop && (
        <div className="w-64 border-r border-gray-200 bg-white">
          <Sidebar />
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <Header onSidebarToggle={toggleSidebar} />
        <main className="flex-1 pt-20 xl:pt-0">
          {children}
          <SiteFooterNew />
        </main>
      </div>

      {/* Mobile sidebar - only visible when toggled */}
      {!isDesktop && isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Mobile sidebar */}
          <div className="fixed inset-y-0 right-0 z-50 w-64 bg-white border-l border-gray-200">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}
    </div>
  );
}
