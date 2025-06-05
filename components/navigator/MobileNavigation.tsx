"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useProfileStore } from "@/app/store/profile";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/navigator/Sidebar";
import Header from "@/components/navigator/header";
import { SiteFooterNew } from "@/components/site-footer-new";

interface MobileNavigationProps {
  children: React.ReactNode;
  isDialogOpen?: boolean;
}

export default function MobileNavigation({
  children,
  isDialogOpen = false,
}: MobileNavigationProps) {
  const pathname = usePathname();
  const { sessionId } = useProfileStore();

  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const isSignedIn = sessionId.length > 0;
  const isAnalysisPage = pathname?.includes("analysis");
  const shouldShowSidebar = isSignedIn || isAnalysisPage;

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSidebarOpen) {
        closeSidebar();
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]);

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

  const sidebarVariants = {
    hidden: {
      x: "-100%",
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

  if (!shouldShowSidebar) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-[#FCFCFD]">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white">
        <Header onSidebarToggle={toggleSidebar} />
      </div>

      <main className="flex-1 overflow-y-auto pt-[72px]">
        {isDialogOpen && (
          <div className="fixed inset-0 bg-black/10 z-20 top-[4.5rem]" />
        )}

        <div className="relative z-10 min-h-[calc(100vh-72px)]">{children}</div>

        <div className="z-49 relative">
          <SiteFooterNew />
        </div>
      </main>

      <AnimatePresence mode="wait">
        {isSidebarOpen && isSignedIn && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={closeSidebar}
            />

            <motion.div
              className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-xl"
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <Sidebar onClose={closeSidebar} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
