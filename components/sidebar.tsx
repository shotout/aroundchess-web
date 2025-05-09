"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Swords,
  BookOpen,
  Target,
  BarChart2,
  Settings,
  FileText,
  Library,
  Users,
  Trophy,
  Newspaper,
  User,
  LogOut,
  CreditCard,
  HelpCircle,
  MessageSquare,
  Brain,
  History,
  TrendingUp,
  FileBarChart,
  Upload,
  GraduationCap,
  BookOpenCheck,
  School,
  Bot,
  Puzzle,
  Grid,
  Crown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useProfileStore } from "@/app/store/profile";
import { supabase } from "@/lib/supabase";
import InitialAvatar from "./avatar/InitialAvatar";
import { useApiClient } from "@/functions/api-client";
import useLocalStorage from "@/hooks/useLocalStorage";
import { usePgnStore } from "@/app/store/zustandStore";
import { setPersistedCookie } from "@/utils/persisted-cookie";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface SidebarItem {
  name: string;
  href: string;
  icon: any; // We'll use 'any' for now since these are Lucide icons
}

interface SidebarSection {
  name: string;
  icon: any;
  children: SidebarItem[];
}

const sidebarLinks = [
  {
    name: "Quick Actions",
    icon: LayoutDashboard,
    children: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Teams", href: "/dashboard/teams", icon: Users },
      { name: "Tournaments", href: "/dashboard/tournaments", icon: Trophy },
      { name: "News", href: "/dashboard/news", icon: Newspaper },
    ],
  },
  {
    name: "Analysis",
    icon: BarChart2,
    children: [
      {
        name: "My Training Plan",
        href: "/dashboard/analysis/training-plan",
        icon: Brain,
      },
      {
        name: "My Game History",
        href: "/dashboard/analysis/game-history",
        icon: History,
      },
      {
        name: "My Progress",
        href: "/dashboard/analysis/my-progress",
        icon: TrendingUp,
      },
      {
        name: "My Reports",
        href: "/dashboard/analysis/my-reports",
        icon: FileBarChart,
      },
      {
        name: "Import Games",
        href: "/dashboard/analysis/import-games",
        icon: Upload,
      },
    ],
  },
  {
    name: "Learning",
    icon: BookOpen,
    children: [
      {
        name: "Opening Theory",
        href: "/dashboard/learning/openings",
        icon: Swords,
      },
      {
        name: "Middlegame Strategy",
        href: "/dashboard/learning/middlegame",
        icon: Target,
      },
      {
        name: "Endgame Mastery",
        href: "/dashboard/learning/endgame",
        icon: Crown,
      },
    ],
  },
  {
    name: "Practice",
    icon: Target,
    children: [
      { name: "Play vs AI", href: "/dashboard/practice/ai", icon: Bot },
      { name: "Puzzles", href: "/dashboard/practice/puzzles", icon: Puzzle },
      {
        name: "Board Vision",
        href: "/dashboard/practice/board-vision",
        icon: Grid,
      },
      {
        name: "Endgame Training",
        href: "/dashboard/practice/endgame",
        icon: Crown,
      },
    ],
  },
];

export function Sidebar({ open, setOpen }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { username } = usePgnStore();
  const { profile, clearAll } = useProfileStore();
  const { logOut } = useApiClient();
  const [sessionId, setToken] = useLocalStorage<string>("token", "");
  const currentPage =
    sidebarLinks.reduce<SidebarItem | null>((found, section) => {
      if (found) return found;
      if (section.children) {
        return section.children.find((item) => item.href === pathname) || null;
      }
      return null;
    }, null) || sidebarLinks[0].children[0];

  const handleSignOut = async () => {
    logOut({ sessionId }).then(() => {
      clearAll();
      localStorage.removeItem("token");
      setPersistedCookie("token", "", 365);

      router.push("/login");
    });
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error logging out:", error.message);
      throw error;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="h-screen border-r border-gray-200 bg-white"
      >
        <div className="flex h-full flex-col">
          <motion.div
            className="flex h-16 items-center border-b border-gray-200 px-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <motion.div
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LayoutDashboard className="h-6 w-6" />
              </motion.div>
              <motion.span
                className="text-xl font-semibold text-gray-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Dashboard
              </motion.span>
            </div>
          </motion.div>

          <ScrollArea className="flex-1 py-3">
            <nav className="space-y-1 px-3">
              {sidebarLinks.map((section, index) => {
                const hasChildren =
                  section.children && section.children.length > 0;
                const isActive = section.children?.some(
                  (child) => pathname === child.href
                );

                return (
                  <motion.div
                    key={section.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="space-y-1">
                      <div
                        className={cn(
                          "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                          isActive
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        )}
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="mr-3"
                        >
                          <section.icon
                            className={cn(
                              "h-5 w-5 transition-colors",
                              isActive
                                ? "text-blue-600"
                                : "text-gray-400 group-hover:text-blue-600"
                            )}
                          />
                        </motion.div>
                        <span className="flex-1 font-semibold">
                          {section.name}
                        </span>
                      </div>

                      {hasChildren && (
                        <div className="ml-6 space-y-1">
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
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
                                  <motion.div
                                    className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600"
                                    layoutId="activeIndicator"
                                    transition={{
                                      type: "spring",
                                      stiffness: 300,
                                      damping: 30,
                                    }}
                                  />
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </nav>
          </ScrollArea>

          <motion.div
            className="mt-auto border-t border-gray-200 p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <InitialAvatar
                    name={profile?.name != "" ? profile?.name : username}
                    size="sm"
                  />
                  {/* {user?.imageUrl && (
                  <Image
                    src={user.imageUrl}
                    alt={user?.fullName || "User"}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )} */}
                  <div className="flex-1 text-left">
                    <p className="font-medium">
                      {profile?.name != "" ? profile?.name : username}
                    </p>
                    <p className="text-xs text-gray-500">{profile?.email}</p>
                  </div>
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
