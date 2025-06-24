"use client";

import Sidebar from "@/components/navigator/Sidebar";
import Header from "@/components/navigator/header";
import { SiteFooterNew } from "@/components/site-footer-new";
import { useEffect, useState } from "react";
import { useProfileFetch } from "./hook/useProfileFetch";
import { useProfileStore } from "@/app/store/profile";
import { SiteHeaderNew } from "../site-header-new";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import DotSpinner from "../game-history/Spinner";
import { usePgnStore } from "@/app/store/zustandStore";

export default function Navigation({
  children,
  isDialogOpen = false,
}: {
  children: React.ReactNode;
  isDialogOpen?: boolean;
}) {
  const pathname = usePathname();
  const { hydrated: pgnReady } = usePgnStore();
  const { sessionId, hydrated } = useProfileStore();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [widthSidebar, setWidthSidebar] = useState(0);
  const [widthContent, setWidthContent] = useState(0);
  const [mounted, setMounted] = useState(true);
  const { setCallFetch } = useProfileFetch();

  useEffect(() => {
    if (typeof window === "undefined" || !mounted) return;

    checkIfDesktop();

    window.addEventListener("resize", checkIfDesktop);
    return () => window.removeEventListener("resize", checkIfDesktop);
  }, [mounted]);

  const checkIfDesktop = () => {
    const sidebarW = window.innerWidth / 6;
    const contentW = window.innerWidth - sidebarW;
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

  const sidebarVariants = {
    hidden: {
      x: "100%", // Slides off-screen to the right
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    visible: {
      x: 0, // Slides back to normal position
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const backdropVariants = {
    hidden: {
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  useEffect(() => {
    if (hydrated) {
      console.log("TEST SESSIONID", hydrated);
    }
  }, [hydrated]);
  if (!hydrated) return <DotSpinner />;
  if (hydrated && sessionId.length == 0 && !pathname?.includes("analysis")) {
    return (
      <>
        <SiteHeaderNew />
        {children}
        <SiteFooterNew />
      </>
    );
  }
  if (hydrated && sessionId.length > 0) {
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

            <div
              className={`relative z-10 min-h-[calc(100vh-56px)] xl:min-h-[calc(100vh-97px)]`}
            >
              {children}
            </div>

            <div className="z-49 relative">
              <SiteFooterNew />
            </div>
          </main>
        </div>

        <AnimatePresence mode="wait">
          {!isDesktop && isSidebarOpen && sessionId.length > 0 && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/50 z-50"
                variants={backdropVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                onClick={() => setSidebarOpen(false)}
              />

              <motion.div
                className="fixed inset-y-0 right-0 z-50 w-64 bg-white border-l border-gray-200 shadow-xl" // Changed left-0 to right-0, and border-r to border-l
                variants={sidebarVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <Sidebar onClose={() => setSidebarOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }
}
