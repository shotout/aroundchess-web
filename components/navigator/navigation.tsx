"use client";

import Sidebar from "@/components/navigator/Sidebar";
import Header from "@/components/navigator/header";
import { SiteFooterNew } from "@/components/site-footer-new";
import { useCallback, useEffect, useState } from "react";
import { useProfileStore } from "@/app/store/profile";
import { SiteHeaderNew } from "../site-header-new";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import DotSpinner from "../game-history/Spinner";
import { useProfileFetch } from "./hook/useProfileFetch";
import { formatTimePgn } from "@/functions/format-date";
import { useTutorial } from "../TutorialProvider";

export default function Navigation({
  children,
  isDialogOpen = false,
}: {
  children: React.ReactNode;
  isDialogOpen?: boolean;
}) {
  const pathname = usePathname();
  const { sessionId, hydrated, setAlreadyFetch } = useProfileStore();
  const { setCallFetch } = useProfileFetch();
  const { isTutorialPlay, stepFocused } = useTutorial();

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [widthSidebar, setWidthSidebar] = useState(0);
  const [widthContent, setWidthContent] = useState(0);
  const [mounted, setMounted] = useState(true);

  const checkIfDesktop = useCallback(() => {
    const sidebarW = window.innerWidth / 6;
    const contentW = window.innerWidth - sidebarW;
    setIsDesktop(window.innerWidth >= 1280);
    if (window.innerWidth >= 1280) {
      setWidthSidebar(sidebarW);
      setWidthContent(contentW);
    } else {
      setWidthSidebar(0);
    }
  }, []);

  useEffect(() => {
    setAlreadyFetch(false);
    setCallFetch(formatTimePgn());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !mounted) return;

    checkIfDesktop();

    window.addEventListener("resize", checkIfDesktop);
    return () => window.removeEventListener("resize", checkIfDesktop);
  }, [mounted, checkIfDesktop]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (!isDesktop && isSidebarOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;

      // Prevent body scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        // Restore body scroll
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';

        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [isSidebarOpen, isDesktop]);

  const sidebarVariants = {
    hidden: {
      x: "100%",
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    visible: {
      x: 0,
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

  if (!hydrated && !pathname?.includes("analysis")) {
    return (
      <div className="flex h-screen overflow-hidden bg-[#FCFCFD]">
        <div className="flex flex-col w-full">
          <div
            className="fixed top-[-1px] right-0 z-50 bg-white border-gray-200 left-0"
            style={{ top: "calc(var(--banner-height, 0px) - 1px)" }}
          >
            <Header onSidebarToggle={toggleSidebar} />
          </div>
          <main
            className="flex-1 overflow-y-auto !pt-[72px] lg:!pt-[97px]"
            style={{
              paddingTop: "calc(var(--banner-height, 0px) + var(--current-header-height))",
            }}
          >
            <div className="flex items-center justify-center min-h-[calc(100vh-72px)]">
              <DotSpinner />
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (hydrated && sessionId.length == 0 && !pathname?.includes("analysis")) {
    return (
      <>
        <SiteHeaderNew />
        {children}
        <SiteFooterNew />
      </>
    );
  }

  if (hydrated) {
    return (
      <div className="flex h-screen overflow-hidden bg-[#FCFCFD]">
        {isDesktop && (
          <div
            style={{ 
              width: widthSidebar,
              top: "var(--banner-height, 0px)",
              height: "calc(100vh - var(--banner-height, 0px))"
            }}
            className={`fixed left-0 border-r border-gray-200 bg-white z-50`}
          >
            <Sidebar />
          </div>
        )}

        <div
          style={{ marginLeft: widthSidebar }}
          className={`flex flex-col w-full`}
        >
          <div
            style={{ left: widthSidebar, top: "calc(var(--banner-height, 0px) - 1px)" }}
            className={`fixed top-[-1px] right-0 z-50 bg-white border-gray-200 left-0`}
          >
            <Header onSidebarToggle={toggleSidebar} />
          </div>

          <main
            className="flex-1 overflow-y-auto !pt-[72px] lg:!pt-[97px]"
            style={{
              paddingTop: "calc(var(--banner-height, 0px) + var(--current-header-height))",
            }}
          >
            {isDialogOpen && (
              <div
                className="fixed inset-0 bg-black/10 z-20"
                style={{
                  top: "calc(var(--banner-height, 0px) + 4.5rem)",
                  left: isDesktop ? "16rem" : "0",
                  bottom: "0",
                }}
              />
            )}

            {/* <div className={`relative z-10 min-h-[calc(100vh-56px)] xl:min-h-[calc(100vh-97px)]`}> */}
            <div className={`z-10`}>
              {children}
            </div>

            <div className="z-49 relative">
              <SiteFooterNew />
            </div>
          </main>
        </div>

        <AnimatePresence mode="wait">
          {((!isDesktop && isSidebarOpen) ||
            (isTutorialPlay &&
              stepFocused == 4 &&
              window.innerWidth <= 1024)) && (
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
                className="fixed inset-y-0 right-0 z-50 w-[82%] bg-white border-l border-gray-200 shadow-xl overflow-hidden"
                variants={sidebarVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <Sidebar onClose={() => setSidebarOpen(false)} isMobile={true} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return <DotSpinner />;
}
