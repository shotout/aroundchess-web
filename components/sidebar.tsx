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
  icon: React.ElementType;
  href?: string;
  children?: {
    name: string;
    href: string;
    icon: React.ElementType;
  }[];
}

const sidebarLinks: SidebarLink[] = [
  {
    name: "Chess News",
    icon: Settings,
    href: "/dashboard/settings",
  },
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    children: [
      { name: "Analyze Game", href: "/d", icon: Settings },
      { name: "My Game History", href: "/dashbs", icon: Settings },
      { name: "My Training Plan", href: "/dashbo", icon: Settings },
    ],
  },
  {
    name: "Handbook : Chess Theory",
    icon: LayoutDashboard,
    children: [
      { name: "Opening Theory", href: "/dashboard", icon: Settings },
      { name: "Middlegame Strategy", href: "/da", icon: Settings },
      { name: "Endgame Mastery", href: "/dashboard/tos", icon: Settings },
    ],
  },
  {
    name: "Playground : Practice",
    icon: LayoutDashboard,
    children: [
      { name: "Play vs AI", href: "/dashbsef", icon: Settings },
      { name: "Puzzles", href: "/dashboard/teams", icon: Settings },
      { name: "Board Vision", href: "/dashboard/tournamen", icon: Settings },
      { name: "Endgame Training", href: "/dadrg", icon: Settings },
    ],
  },
];

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const isMobile = !!onClose; // If onClose is provided, we're on mobile

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-24 items-center border-b border-gray-200 px-6 justify-between">
        <div className="flex justify-center items-center gap-3">
          <span className="text-xl font-semibold text-gray-900">
            {isMobile ? (
              "Menu"
            ) : (
              <Image src="/logo.png" alt="Logo" width={120} height={30} />
            )}
          </span>
        </div>

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
        <nav className="space-y-5 px-3">
          {sidebarLinks.map((section) => {
            const hasChildren = section.children && section.children.length > 0;
            const isActive = section.href
              ? pathname === section.href
              : section.children?.some((child) => pathname === child.href);

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
                          ? "bg-blue-50 text-blue-600"
                          : "hover:bg-blue-50 hover:text-blue-500"
                      )}
                    >
                      <div className="mr-3">
                        <section.icon
                          className={cn(
                            "h-5 w-5 transition-colors",
                            pathname === section.href
                              ? "text-blue-600"
                              : "text-gray-400 group-hover:text-blue-600"
                          )}
                        />
                      </div>
                      <span className="flex-1 font-semibold">
                        {section.name}
                      </span>
                      {pathname === section.href && (
                        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600" />
                      )}
                    </Link>
                  ) : (
                    // Non-clickable title (section header)
                    <div
                      className={cn(
                        "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-r-4 hover:border-blue-600"
                      )}
                    >
                      <div className="mr-3">
                        <section.icon
                          className={cn(
                            "h-5 w-5 transition-colors",
                            isActive
                              ? "text-blue-600"
                              : "text-gray-400 group-hover:text-blue-600"
                          )}
                        />
                      </div>
                      <span className="flex-1 font-semibold">
                        {section.name}
                      </span>
                    </div>
                  )}

                  {hasChildren && (
                    <div className="ml-6 space-y-2">
                      {section.children.map((child) => {
                        const isChildActive = pathname === child.href;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                              isChildActive
                                ? "bg-blue-100 text-blue-600"
                                : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                            )}
                          >
                            <child.icon
                              className={cn(
                                "mr-3 h-4 w-4",
                                isChildActive
                                  ? "text-blue-600"
                                  : "text-gray-400 group-hover:text-blue-600"
                              )}
                            />
                            <span>{child.name}</span>
                            {isChildActive && (
                              <div className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600" />
                            )}
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
