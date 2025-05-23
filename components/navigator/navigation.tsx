"use client";
import CookieConsent from "@/app/cookies-consent/cookies-consent-message";
import Sidebar from "@/components/navigator/Sidebar";
import Header from "@/components/navigator/header";
import { SiteFooterNew } from "@/components/site-footer-new";
import { useEffect, useState } from "react";
import { useProfileFetch } from "./hook/useProfileFetch";
import { useProfileStore } from "@/app/store/profile";
import { SiteHeaderNew } from "../site-header-new";
import { usePathname } from "next/navigation";

export default function Navigation({
  children,
  isDialogOpen = false,
}: {
  children: React.ReactNode;
  isDialogOpen?: boolean;
}) {
  const pathname = usePathname();
  const { sessionId } = useProfileStore();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [widthSidebar, setWidthSidebar] = useState(0);
  const [widthContent, setWidthContent] = useState(0);
  const [mounted, setMounted] = useState(true);
  const { setCallFetch } = useProfileFetch();
  useEffect(() => {
    if (typeof window === "undefined" || !mounted) return;

    // Initial size calculation
    checkIfDesktop();

    // Add event listeners
    window.addEventListener("resize", checkIfDesktop);
    return () => window.removeEventListener("resize", checkIfDesktop);
  }, [mounted]);

  const checkIfDesktop = () => {
    let sidebarW = window.innerWidth / 6;
    let contentW = window.innerWidth - sidebarW;
    setIsDesktop(window.innerWidth >= 1280);
    console.log("sidebarW", sidebarW);
    if (window.innerWidth >= 1280) {
      setWidthSidebar(sidebarW);
      setWidthContent(contentW);
    } else {
      setWidthSidebar(0);
    }
  };
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  if (sessionId.length == 0 && !pathname?.includes("analysis")) {
    return (
      <>
        <SiteHeaderNew />
        {children}
        <SiteFooterNew />
      </>
    );
  } else {
    return (
      <div className="flex h-screen overflow-hidden bg-[#FCFCFD]">
        {isDesktop && (
          <div
            style={{ width: widthSidebar }}
            className={`fixed top-0 left-0 h-full border-r border-gray-200 bg-white z-30`}
          >
            <Sidebar />
          </div>
        )}

        <div
          style={{ marginLeft: widthSidebar }}
          className={`flex flex-col w-full`}
        >
          <div
            style={{ left: widthSidebar }}
            className={`fixed top-[-1px] right-0 z-40 bg-white border-gray-200 left-0`}
          >
            <Header onSidebarToggle={toggleSidebar} />
          </div>

          <main className="flex-1 overflow-y-auto pt-[72px] lg:pt-24">
            {isDialogOpen && (
              <div
                className="fixed inset-0 bg-black/10 z-20"
                style={{
                  top: "4.5rem",
                  left: isDesktop ? "16rem" : "0",
                  bottom: "0",
                }}
              />
            )}

            {/* Main content */}
            <div
              className={`relative z-10 min-h-[calc(100vh-56px)] xl:min-h-[calc(100vh-97px)]`}
            >
              {/* <div className="relative z-10 lg:min-h-[calc(100vh-97px)]"> */}
              {children}
            </div>

            <div className="z-49 relative">
              <SiteFooterNew />
            </div>
          </main>
        </div>

        {!isDesktop &&
          isSidebarOpen &&
          sessionId.length > 0 &&
          pathname?.includes("analysis") && (
            <>
              <div
                className="fixed inset-0 bg-black/50 z-10"
                onClick={() => setSidebarOpen(false)}
              />

              <div className="fixed inset-y-0 left-0 z-10 w-64 bg-white border-r border-gray-200">
                <Sidebar onClose={() => setSidebarOpen(false)} />
              </div>
            </>
          )}
      </div>
    );
  }
}
