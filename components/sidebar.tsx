"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useClerk, useUser } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart2,
  BookOpen,
  Clock,
  CreditCard,
  Crown,
  FileText,
  Gamepad2,
  GraduationCap,
  Grid,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Puzzle,
  Settings,
  Target,
  TrendingUp,
  Trophy,
  Upload,
  User,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const sidebarSections = [
  {
    title: "Quick Actions",
    icon: Zap,
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Teams", href: "/dashboard/teams", icon: Users },
      { name: "Tournaments", href: "/dashboard/tournaments", icon: Trophy },
      { name: "News", href: "/dashboard/news", icon: Newspaper },
    ],
  },
  {
    title: "Analysis",
    icon: BarChart2,
    items: [
      {
        name: "My Training Plan",
        href: "/dashboard/training-plan",
        icon: Clock,
      },
      { name: "My Game History", href: "/dashboard/game-history", icon: Clock },
      { name: "My Progress", href: "/dashboard/progress", icon: TrendingUp },
      { name: "My Report", href: "/dashboard/report", icon: FileText },
      { name: "Import Games", href: "/dashboard/import", icon: Upload },
    ],
  },
  {
    title: "Learning",
    icon: GraduationCap,
    items: [
      {
        name: "Chess Fundamentals",
        href: "/learn/chess-fundamentals",
        icon: BookOpen,
      },
      { name: "Chess Openings", href: "/dashboard/openings", icon: BookOpen },
      { name: "Lesson Library", href: "/dashboard/library", icon: BookOpen },
    ],
  },
  {
    title: "Practice",
    icon: Target,
    items: [
      { name: "Play vs AI", href: "/dashboard/play-ai", icon: Gamepad2 },
      { name: "Puzzles", href: "/dashboard/puzzles", icon: Puzzle },
      { name: "Board Vision", href: "/dashboard/board-vision", icon: Grid },
      { name: "Endgame Training", href: "/dashboard/endgame", icon: Crown },
    ],
  },
];

export function Sidebar({ open, setOpen }: SidebarProps) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
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
            <nav className="space-y-6">
              {sidebarSections.map((section, sectionIndex) => (
                <div key={section.title} className="space-y-1">
                  <h2 className="flex items-center gap-2 px-6 text-sm font-semibold text-gray-500">
                    <section.icon className="h-4 w-4" />
                    {section.title}
                  </h2>
                  <div className="pl-10">
                    {section.items.map((item, itemIndex) => {
                      const isActive = pathname === item.href;
                      return (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay:
                              (sectionIndex * section.items.length +
                                itemIndex) *
                              0.03,
                          }}
                        >
                          <Link
                            href={item.href}
                            className={cn(
                              "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                              isActive
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                            )}
                          >
                            <item.icon
                              className={cn(
                                "mr-3 h-5 w-5",
                                isActive
                                  ? "text-blue-600"
                                  : "text-gray-400 group-hover:text-gray-900"
                              )}
                            />
                            <span className="flex-1">{item.name}</span>
                            {isActive && (
                              <div className="h-2 w-2 rounded-full bg-blue-600" />
                            )}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
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
                  {user?.imageUrl && (
                    <Image
                      src={user.imageUrl}
                      alt={user?.fullName || "User"}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  )}
                  <div className="flex-1 text-left">
                    <p className="font-medium">{user?.fullName}</p>
                    <p className="text-xs text-gray-500">
                      {user?.primaryEmailAddress?.emailAddress}
                    </p>
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
