"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LayoutDashboard, Settings, X } from "lucide-react";
import Image from "next/image";

interface SidebarProps {
  onClose?: () => void;
}

interface SidebarLink {
  name: string;
  icon: string;
  href?: string;
  disabled?: boolean;
  children?: {
    name: string;
    href: string;
    icon: string;
    disabled?: boolean;
  }[];
}

const sidebarLinks: SidebarLink[] = [
  {
    name: "Chess News",
    icon: "/icons/sidebar-news-icon.png",
    href: "/news",
  },
  {
    name: "Dashboard",
    icon: "/icons/sidebar-dashboard-icon.png",
    children: [
      {
        name: "Analyze Game",
        href: "/analysis",
        icon: "/icons/sidebar-analyze-icon.png",
      },
      {
        name: "My Game History",
        href: "/game-history",
        icon: "/icons/sidebar-game-history.png",
      },
      {
        name: "My Training Plan",
        href: "/my-training-plan",
        icon: "/icons/sidebar-training-plan-icon.png",
      },
    ],
  },
  {
    name: "Handbook : Chess Theory",
    icon: "/icons/sidebar-theory-icon.png",
    children: [
      {
        name: "Opening Theory",
        href: "/opening-theory",
        icon: "/icons/sidebar-opening-theory-icon.png",
      },
      {
        name: "Middlegame Strategy",
        href: "/middlegame-strategy",
        icon: "/icons/sidebar-middlegame-strategy-icon.png",
      },
      {
        name: "Endgame Mastery",
        href: "/endgame-mastery",
        icon: "/icons/sidebar-endgame-mastery-icon.png",
      },
    ],
  },
  {
    name: "Playground : Practice",
    icon: "/icons/sidebar-playground-practice-icon.png",
    children: [
      {
        name: "Play vs AI",
        href: "/play-vs-ai",
        icon: "/icons/sidebar-play-vs-ai-icon.png",
      },
      {
        name: "Puzzles",
        href: "/puzzles",
        icon: "/icons/sidebar-puzzle-icon.png",
      },
      {
        name: "Board Vision",
        href: "/board-vision",
        icon: "/icons/sidebar-board-vision-icon.png",
      },
      {
        name: "Endgame Training",
        href: "/endgame-training",
        icon: "/icons/sidebar-endgame-training-icon.png",
      },
    ],
  },
  {
    name: "Tournaments : (Coming Soon)",
    icon: "/icons/sidebar-tournaments-icon.png",
    disabled: true,
    children: [
      {
        name: "My Teams (Coming Soon)",
        href: "#",
        icon: "/icons/sidebar-teams-icon.png",
        disabled: true,
      },
    ],
  },
];

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const isMobile = !!onClose; // If onClose is provided, we're on mobile

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-24 items-center border-b border-gray-200 px-6 justify-center">
        <Link href="/" className="flex items-center justify-center">
          <Image
            src="/icons/logo.png"
            alt="logo"
            className="w-40 h-7"
            quality={100}
            width={1000}
            height={1000}
          />
        </Link>

        {/* Close button - only on mobile */}
        {isMobile && onClose && (
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <ScrollArea className="flex-1 py-3">
        <nav className="space-y-5 px-2">
          {sidebarLinks.map((section: any) => {
            const hasChildren = section.children && section.children.length > 0;
            const isActive = section.href
              ? pathname === section.href
              : section.children?.some((child: any) => pathname === child.href);

            return (
              <div key={section.name}>
                <div className="space-y-2">
                  {section.href ? (
                    // Clickable title as a Link
                    <Link
                      href={section.href}
                      className={cn(
                        "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                        pathname === section.href
                          ? "text-[red]"
                          : "hover:bg-blue-50 hover:text-blue-500"
                      )}
                    >
                      <div className="mr-3">
                        <Image
                          width={1000}
                          height={1000}
                          alt={section.href}
                          src={section.icon}
                          className={cn(
                            "h-5 w-5 transition-colors",
                            pathname === section.href
                              ? "text-primary"
                              : "text-gray-400 group-hover:text-primary"
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
                      className={cn(
                        "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "text-primary"
                          : section.disabled
                          ? "text-[#AAA4A4]"
                          : "text-gray-700 hover:bg-blue-50 hover:text-primary hover:border-r-4 hover:border-primary"
                      )}
                    >
                      <div className="mr-3">
                        <Image
                          width={1000}
                          height={1000}
                          alt={section.href}
                          src={section.icon}
                          className={cn(
                            "h-5 w-5 transition-colors",
                            isActive
                              ? "text-primary"
                              : "text-gray-400 group-hover:text-primary"
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
                        const isChildActive = pathname === child.href;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "min-h-[52px] group flex items-center rounded-sm px-3 py-2 text-sm font-medium transition-all duration-200",
                              isChildActive
                                ? "bg-blue-100 text-primary border-primary border-r-4 "
                                : child.disabled
                                ? "text-[#AAA4A4]"
                                : "text-gray-600 hover:bg-gray-50 hover:text-primary"
                            )}
                          >
                            <Image
                              width={1000}
                              height={1000}
                              alt={child.href}
                              src={child.icon}
                              className={cn(
                                "mr-3 h-5 w-5",
                                isChildActive
                                  ? "text-primary"
                                  : "text-gray-400 group-hover:text-primary"
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
