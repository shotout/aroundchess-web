"use client";
import Sidebar from "@/components/navigator/Sidebar";
import Header from "@/components/navigator/header";
import { SiteFooterNew } from "@/components/site-footer-new";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { CancelSubscription } from "../modal/CancelSubscription";
import { ConfirmLogin } from "../modal/ConfirmLogin";
import { ContactUs } from "../modal/ContactUs";
import { PricingOffer } from "../modal/PricingOffer";
import { SuccessSubscription } from "../modal/SuccessSubscription";
import { StatusPurchaseTokens } from "../modal/StatusPurchaseTokens";

export default function Navigation({
  children,
  isDialogOpen = false,
}: {
  children: React.ReactNode;
  isDialogOpen?: boolean;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const { sessionId } = useAuth();
 
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
      {isDesktop && (
        <div className="fixed top-0 left-0 h-full w-64 border-r border-gray-200 bg-white z-30">
          <Sidebar />
        </div>
      )}

      <div className={`flex flex-col w-full ${isDesktop ? "ml-64" : ""}`}>
        <div className="fixed top-[-1px] right-0 z-40 bg-white border-gray-200 left-0 xl:left-64">
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
          <div className="relative">
            {/* <div className="relative z-10 lg:min-h-[calc(100vh-97px)]"> */}
            {children}
            <ConfirmLogin />
            <ContactUs />
            <SuccessSubscription />
            <CancelSubscription />
            <StatusPurchaseTokens />
            <PricingOffer />
          </div>

          <div className="z-49 relative">
            <SiteFooterNew />
          </div>
        </main>
      </div>

      {!isDesktop && isSidebarOpen && (
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
