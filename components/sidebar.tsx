"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
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
  MessageSquare
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUser, useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

const sidebarLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Analysis", href: "/dashboard/analysis", icon: BarChart2 },
  { name: "Reports", href: "/dashboard/reports", icon: FileText },
  { name: "Playground", href: "/dashboard/playground", icon: Swords },
  { name: "Explore", href: "/dashboard/explore", icon: Target },
  { name: "Library", href: "/dashboard/library", icon: Library },
  { name: "Teams", href: "/dashboard/teams", icon: Users },
  { name: "Tournaments", href: "/dashboard/tournaments", icon: Trophy },
  { name: "News", href: "/dashboard/news", icon: Newspaper },
]

export function Sidebar({ open, setOpen }: SidebarProps) {
  const { user } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()
  const pathname = usePathname()
  
  const currentPage = sidebarLinks.find(link => link.href === pathname) || sidebarLinks[0]

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

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
            className="flex h-24 items-center border-b border-gray-200 px-6"
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
                <currentPage.icon className="h-6 w-6" />
              </motion.div>
              <motion.span 
                className="text-xl font-semibold text-gray-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {currentPage.name}
              </motion.span>
            </div>
          </motion.div>

          <ScrollArea className="flex-1 py-3">
            <nav className="space-y-1 px-3">
              {sidebarLinks.map((link, index) => {
                const isActive = pathname === link.href
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-blue-600 text-white shadow-md"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm"
                      )}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="mr-3"
                      >
                        <link.icon
                          className={cn(
                            "h-5 w-5 transition-colors",
                            isActive
                              ? "text-white"
                              : "text-gray-400 group-hover:text-blue-600"
                          )}
                        />
                      </motion.div>
                      <span className="flex-1">{link.name}</span>
                      {isActive && (
                        <motion.div
                          className="h-1.5 w-1.5 rounded-full bg-white"
                          layoutId="activeIndicator"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                )
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
                    <p className="text-xs text-gray-500">{user?.primaryEmailAddress?.emailAddress}</p>
                  </div>
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.fullName}</p>
                    <p className="text-xs leading-none text-gray-500">
                      {user?.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
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
                </DropdownMenuGroup>
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
  )
}
