"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useConfirmLogin } from "@/app/store/confirmLogin";
import { useAuth } from "@clerk/nextjs";

interface SidebarProps {
  onClose?: () => void;
}
interface SidebarLink {
  name: string;
  icon: string;
  iconActive: string;
  href?: string;
  disabled?: boolean;
  permission?: boolean;
  children?: {
    name: string;
    href: string;
    icon: string;
    iconActive: string;
    disabled?: boolean;
    permission?: boolean;
  }[];
}

const sidebarLinks: SidebarLink[] = [
  {
    name: "Chess News",
    icon: "/icons/sidebar-news-icon.png",
    iconActive: "/icons/sidebar-news-icon-active.png",
    href: "/chess-news",
    permission: true,
  },
  {
    name: "Dashboard",
    icon: "/icons/sidebar-dashboard-icon.png",
    iconActive: "/icons/sidebar-dashboard-icon-active.png",
    children: [
      {
        name: "Analyze Game",
        href: "/analysis",
        icon: "/icons/sidebar-analyze-icon.png",
        iconActive: "/icons/sidebar-analyze-icon-active.png",
      },
      {
        name: "My Game History",
        href: "/my-game-history",
        icon: "/icons/sidebar-game-history.png",
        iconActive: "/icons/sidebar-game-history-active.png",
      },
      {
        name: "Mistake Log",
        href: "/mistake-log",
        icon: "/icons/sidebar-mistake-log-icon.png",
        iconActive: "/icons/sidebar-mistake-log-icon-active.png",
      },
      {
        name: "My Training Plan",
        href: "/training-plan",
        icon: "/icons/sidebar-training-plan-icon.png",
        iconActive: "/icons/sidebar-training-plan-icon-active.png",
      },
    ],
  },
  {
    name: "Handbook : Chess Theory",
    icon: "/icons/sidebar-theory-icon.png",
    iconActive: "/icons/sidebar-theory-icon-active.png",
    children: [
      {
        name: "Opening Theory",
        href: "/opening-theory",
        icon: "/icons/sidebar-opening-theory-icon.png",
        iconActive: "/icons/sidebar-opening-theory-icon-active.png",
      },
      {
        name: "Middlegame Strategy",
        href: "/middlegame-strategy",
        icon: "/icons/sidebar-middlegame-strategy-icon.png",
        iconActive: "/icons/sidebar-middlegame-strategy-icon-active.png",
      },
      {
        name: "Endgame Mastery",
        href: "/endgame-mastery",
        icon: "/icons/sidebar-endgame-mastery-icon.png",
        iconActive: "/icons/sidebar-endgame-mastery-icon-active.png",
      },
    ],
  },
  {
    name: "Playground : Practice",
    icon: "/icons/sidebar-playground-practice-icon.png",
    iconActive: "/icons/sidebar-playground-practice-icon-active.png",
    children: [
      {
        name: "Play vs AI",
        href: "/playground/play-vs-ai",
        icon: "/icons/sidebar-play-vs-ai-icon.png",
        iconActive: "/icons/sidebar-play-vs-ai-icon-active.png",
      },
      {
        name: "Puzzles",
        href: "/playground/puzzles",
        icon: "/icons/sidebar-puzzle-icon.png",
        iconActive: "/icons/sidebar-puzzle-icon-active.png",
      },
      {
        name: "Board Vision",
        href: "/playground/board-vision",
        icon: "/icons/sidebar-board-vision-icon.png",
        iconActive: "/icons/sidebar-board-vision-icon-active.png",
      },
      {
        name: "Endgame Training",
        href: "/playground/endgame-training",
        icon: "/icons/sidebar-endgame-training-icon.png",
        iconActive: "/icons/sidebar-endgame-training-icon-active.png",
      },
    ],
  },
  {
    name: "Tournaments : (Coming Soon)",
    icon: "/icons/sidebar-tournaments-icon.png",
    iconActive: "/icons/sidebar-tournaments-icon-active.png",
    disabled: true,
    children: [
      {
        name: "My Teams (Coming Soon)",
        href: "#",
        icon: "/icons/sidebar-teams-icon.png",
        iconActive: "/icons/sidebar-teams-icon-active.png",
        disabled: true,
      },
    ],
  },
];

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { open, setOpen: setOpenConfirmLogin } = useConfirmLogin();
  const { isSignedIn } = useAuth();
  const isMobile = !!onClose; // If onClose is provided, we're on mobile
  const [widthContainer, setWidthContainer] = useState<number>(240);
  const [mounted, setMounted] = useState<boolean>(true);
  useEffect(() => {
    if (typeof window === "undefined" || !mounted) return;

    // Initial size calculation
    handleResize();

    // Add event listeners
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mounted]);
  const handleResize = () => {
    let widthC = window?.innerWidth * 0.2;
    // console.log("widthC", widthC);
    setWidthContainer(widthC);
  };
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-24 items-center px-6 justify-center border-b">
        <Link href="/" className="flex items-center justify-center">
          <Image
            src="/icons/logo.png"
            alt="logo"
            className="w-36 h-12 object-contain"
            quality={100}
            width={1000}
            height={1000}
          />
        </Link>

        {/* Close button - only on mobile */}
        {/* {isMobile && onClose && (
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        )} */}
      </div>

      <ScrollArea className="flex-1 py-3">
        <nav className="space-y-5 px-2">
          {sidebarLinks.map((section: any) => {
            const hasChildren = section.children && section.children.length > 0;
            const isActive = section.href
              ? pathname.includes(section.href)
              : section.children?.some((child: any) => pathname === child.href);

            return (
              <div key={section.name}>
                <div className="space-y-2">
                  {section.href ? (
                    <Link
                      href={
                        !isSignedIn && !section.permission ? "" : section.href
                      }
                      onClick={
                        !isSignedIn && !section.permission
                          ? () => setOpenConfirmLogin(true)
                          : () => null
                      }
                      // style={{ width: widthContainer - 50 }}
                      className={cn(
                        "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "text-[#221AE9]"
                          : "hover:bg-[#221AE950] hover:text-[#221AE9]"
                      )}
                    >
                      <div className="mr-3">
                        <Image
                          width={1000}
                          height={1000}
                          alt={section.href}
                          src={
                            pathname === section.href
                              ? section.iconActive
                              : section.icon
                          }
                          className={cn(
                            "h-5 w-5 transition-colors",
                            pathname === section.href
                              ? "text-[#221AE9]"
                              : "text-gray-400 group-hover:text-[#221AE9]"
                          )}
                        />
                      </div>

                      <span className="flex-1 font-semibold">
                        {section.name}
                      </span>
                    </Link>
                  ) : (
                    // Non-clickable title (section header)
                    <div
                      // style={{ width: widthContainer - 50 }}
                      className={cn(
                        "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "text-[#221AE9]"
                          : section.disabled
                          ? "text-[#AAA4A4]"
                          : "text-gray-700 hover:bg-[#221AE950] hover:text-[#221AE9] hover:border-r-4 hover:border-[#221AE9]"
                      )}
                    >
                      <div className="mr-3">
                        <Image
                          width={1000}
                          height={1000}
                          alt={section.href}
                          src={isActive ? section.iconActive : section.icon}
                          className={cn(
                            "h-5 w-5 transition-colors",
                            isActive
                              ? "text-[#221AE9]"
                              : "text-gray-400 group-hover:text-[#221AE9]"
                          )}
                        />
                      </div>
                      <span className="flex-1 font-semibold">
                        {section.name}
                      </span>
                    </div>
                  )}

                  {hasChildren && (
                    <div className="ml-6 space-y-2 ">
                      {section.children.map((child: any) => {
                        const isChildActive = pathname.includes(child.href);
                        return (
                          <Link
                            key={child.href}
                            onClick={
                              !isSignedIn
                                ? () => setOpenConfirmLogin(true)
                                : () => null
                            }
                            href={
                              child.href == "/training-plan" || !isSignedIn
                                ? ""
                                : child.href
                            }
                            // style={{ width: widthContainer - 50 }}
                            className={cn(
                              "min-h-[52px] group flex items-center rounded-sm px-3 py-2 text-sm font-medium transition-all duration-200",
                              isChildActive
                                ? "bg-[#221AE910] text-[#221AE9] border-[#221AE9] border-r-4 "
                                : child.disabled
                                ? "text-[#AAA4A4]"
                                : child.href == "/training-plan"
                                ? "text-[#AAA4A4]"
                                : "text-gray-600 hover:bg-gray-50 hover:text-[#221AE9]"
                            )}
                          >
                            <Image
                              width={1000}
                              height={1000}
                              alt={child.href}
                              src={
                                isChildActive ? child.iconActive : child.icon
                              }
                              className={cn(
                                "mr-3 h-5 w-5",
                                isChildActive
                                  ? "text-[#221AE9]"
                                  : child.href == "/training-plan"
                                  ? "text-[#AAA4A4]"
                                  : "text-gray-400 group-hover:text-[#221AE9]"
                              )}
                            />

                            <span>{child.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </nav>
      </ScrollArea>
    </div>
  );
}
