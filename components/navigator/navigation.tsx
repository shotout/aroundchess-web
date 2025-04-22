"use client";
import { SiteFooterNew } from "@/components/site-footer-new";
import { useEffect, useState } from "react";
import Sidebar from "@/components/navigator/Sidebar";
import Header from "@/components/navigator/header";
import { ConfirmLogin } from "../modal/ConfirmLogin";
import { useAuth } from "@clerk/nextjs";
import { ContactUs } from "../modal/ContactUs";
import { CancelSubscription } from "../modal/CancelSubscription";
import { PricingOffer } from "../modal/PricingOffer";
import { SuccessSubscription } from "../modal/SuccessSubscription";
import { useApiClient } from "@/functions/api-client";
import { useProfileStore } from "@/app/store/profile";
import { usePgnStore } from "@/app/store/zustandStore";

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
  const { setUsername } = usePgnStore();
  const {
    getTokenBalance,
    getProfile,
    getActiveMembership,
    getAllMembershipPackage,
    getPuzzle,
  } = useApiClient();
  const {
    token,
    setToken,
    setActiveMembership,
    setAllMembershipPackages,
    setProfile,
    setPuzzleLog,
    setIsMember,
  } = useProfileStore();
  useEffect(() => {
    if (sessionId) {
      localStorage.setItem("token", sessionId);
      getProfile({}).then((response) => {
        let data = response.data;
        console.log("getProfile", data);
        setProfile(data);
        setUsername(data.username);
      });
      getTokenBalance({}).then((response) => {
        let data = response.data;
        console.log("getTokenBalance", data);
        setToken(data);
      });
      getActiveMembership({}).then((response) => {
        let data = response.data;
        console.log("getActiveMembership", data);
        setIsMember(data.status == "ACTIVE");
        setActiveMembership(data);
      });
      getAllMembershipPackage({}).then((response) => {
        let data = response.data;
        console.log("getAllMembershipPackage", data);
        setAllMembershipPackages(data);
      });
      getPuzzle().then((res) => {
        let logs = res.data;
        setPuzzleLog(logs);
        console.log("log puzzle", logs);
      });
    }
  }, [sessionId]);
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
            className="fixed inset-0 bg-black/50 z-100"
            onClick={() => setSidebarOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 z-100 w-64 bg-white border-r border-gray-200">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}
    </div>
  );
}
