"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import InitialAvatar from "../avatar/InitialAvatar";
import { fadeInUp } from "@/utils/motion";

import { useProfileStore } from "@/app/store/profile";
import { usePgnStore } from "@/app/store/zustandStore";
import { useConfirmLogin } from "@/app/store/confirmLogin";
import { usePricingOffer } from "@/app/store/pricingOffer";

interface SidebarProps {
  onClose?: () => void;
  isMobile?: boolean;
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
    name: "Chess Blog",
    icon: "/icons/sidebar-news-icon.png",
    iconActive: "/icons/sidebar-news-icon-active.png",
    href: "/chess-blog",
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
        permission: true,
      },
      {
        name: "My Game History",
        href: "/my-game-history",
        icon: "/icons/sidebar-game-history.png",
        iconActive: "/icons/sidebar-game-history-active.png",
      },
      {
        name: "Feedback Log",
        href: "/feedback-log",
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
        href: "/playground/puzzle",
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
];

export default function Sidebar({ onClose, isMobile = false }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isMember, isMemberMonthly, token, profile, sessionId } = useProfileStore();
  const { username, profileShow } = usePgnStore();
  const { setOpen: setOpenConfirmLogin } = useConfirmLogin();
  const { setOpen: setOpenSubscribe, setTabType } = usePricingOffer();
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    if (sessionId) {
      setIsSignedIn(true);
    }
  }, [sessionId]);

  const handleToProfile = () => {
    router.push("/profile");
    if (isMobile && onClose) onClose();
  };

  const handleOpenOffer = (type: string) => {
    setOpenSubscribe(true);
    setTabType(type);
    if (isMobile && onClose) onClose();
  };

  const handleNavigation = (href: string, hasPermission?: boolean) => {
    if (!isSignedIn && !hasPermission) {
      setOpenConfirmLogin(true);
    } else if (href && href !== "#") {
      if (isMobile && onClose) onClose();
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2, staggerChildren: 0.05, delayChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, x: -20, transition: { duration: 0.2 } },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
  };

  const sidebarContent = (
    <div className="flex h-full flex-col z-100">
      {/* Logo */}
      <motion.div
        className="flex h-24 items-center px-6 justify-center sm:border-b"
        variants={isMobile ? itemVariants : {}}
      >
        <Link href="/">
          <Image
            src="/icons/logo.png"
            alt="logo"
            width={1000}
            height={1000}
            quality={100}
            className="w-[199px] h-[64px] object-contain"
          />
        </Link>
      </motion.div>

      {/* Mobile token & offers */}
      <motion.div
        className="flex sm:hidden flex-col justify-center pb-4 px-4 border-b gap-2"
        variants={isMobile ? itemVariants : {}}
      >
        <div className="flex items-center justify-center gap-2">
          <Image
            src="/images/pricing/token-icon.png"
            alt="icon"
            width={1000}
            height={1000}
            className="w-5 h-5 object-contain"
          />
          <span className="text-[#221AE9] font-medium">
            Remaining Tokens:{" "}
            <span className={cn(token.balance === 0 ? "text-[#FD0000]" : "text-[#221AE9]", "font-bold")}>
              {token.balance}
            </span>
          </span>
        </div>
        {(!isMember &&!isMemberMonthly) ? (
          <div className="w-full flex flex-col gap-2">
            <button
              onClick={() => handleOpenOffer("tokens")}
              className="btn-secondary w-full h-12 rounded-full border border-gray-300 px-6 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Buy Tokens
            </button>
            <button
              onClick={() => handleOpenOffer("subscription")}
              className="btn-primary w-full h-12 rounded-full bg-primary px-6 text-sm font-medium text-white hover:bg-blue-700"
            >
              Go Unlimited
            </button>
          </div>
        ) : (
          <motion.div
            variants={fadeInUp}
            className="relative w-full rounded-lg bg-[linear-gradient(to_right,_#25CEDA,_#B2E8F9)] border border-dashed border-white p-[1px]"
          >
            <div className="flex items-center gap-2 h-14 rounded-lg bg-white pl-4">
              <Image
                src="/icons/onboarding-popup.png"
                alt="icon"
                width={1000}
                height={1000}
                className="w-10 h-10 object-contain"
              />
              <span className="font-semibold text-sm text-[#17119B]">
                Premium package active!
              </span>
              <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center pr-2">
                <Image
                  src="/icons/sparks-member.png"
                  alt="icon"
                  width={1000}
                  height={1000}
                  className="w-14 h-14 object-cover"
                />
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-3">
        <motion.nav
          className="space-y-5 px-2"
          variants={isMobile ? containerVariants : {}}
          initial={isMobile ? "hidden" : "visible"}
          animate="visible"
        >
          {sidebarLinks.map((section) => {
            const hasChildren = !!section.children?.length;
            const isActive = section.href
              ? pathname?.includes(section.href)
              : section.children?.some((c) => pathname === c.href);

            return (
              <motion.div key={section.name} variants={isMobile ? itemVariants : {}}>
                <div className="space-y-2"  >
                  {section.href ? (
                    <Link
                      href={!isSignedIn && !section.permission ? "#" : section.href!}
                      onClick={() => handleNavigation(section.href!, section.permission)}
                      className={cn(
                        "group gap-x-2 flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                        isActive ? "text-[#221AE9]" : "hover:bg-[#221AE950] hover:text-[#221AE9]"
                      )}
                    >
                      <Image
                        src={isActive ? section.iconActive : section.icon}
                        alt={section.name}
                        width={1000}
                        height={1000}
                        className={cn(
                          "h-5 w-5 transition-colors",
                          isActive ? "text-[#221AE9]" : "text-gray-400 group-hover:text-[#221AE9]"
                        )}
                      />
                      <span className="flex-1 font-semibold">{section.name}</span>
                      {!isSignedIn && !section.permission && (
                        <Image
                          src="/icons/lock.png"
                          alt="lock"
                          width={1000}
                          height={1000}
                          quality={100}
                          className="w-4 h-4 object-contain"
                        />
                      )}
                    </Link>
                  ) : (
                    <div
                      className={cn(
                        "group flex gap-x-2 items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                        isActive ? "text-[#221AE9]" : section.disabled ? "text-[#AAA4A4]" : ""
                      )}
                    >
                      <Image
                        src={isActive ? section.iconActive : section.icon}
                        alt={section.name}
                        width={1000}
                        height={1000}
                        className={cn(
                          "h-5 w-5 transition-colors",
                          isActive ? "text-[#221AE9]" : "text-gray-400 group-hover:text-[#221AE9]"
                        )}
                      />
                      <span className="flex-1 font-semibold">{section.name}</span>
                    </div>
                  )}

                  {hasChildren && (
                    <motion.div className="ml-6 space-y-2" variants={isMobile ? containerVariants : {}}>
                      {section.children!.map((child) => {
                        const isChildActive = pathname?.includes(child.href);
                        return (
                          <motion.div key={child.href} variants={isMobile ? itemVariants : {}}>
                            <Link
                            data-tutorial={child.name === "My Game History" ? "5" : undefined}
                              href={!isSignedIn && !child.permission ? "#" : child.href}
                              onClick={() => handleNavigation(child.href, child.permission)}
                              className={cn(
                                "min-h-[52px] group flex items-center justify-between rounded-sm px-3 py-2 text-sm font-medium transition-all duration-200",
                                isChildActive
                                  ? "bg-[#221AE910] text-[#221AE9] border-r-4 border-[#221AE9]"
                                  : child.disabled
                                  ? "text-[#AAA4A4]"
                                  : "text-gray-600 hover:bg-gray-50 hover:text-[#221AE9]"
                              )}
                            >
                              <div className="flex items-center">
                                <Image
                                  src={isChildActive ? child.iconActive : child.icon}
                                  alt={child.name}
                                  width={1000}
                                  height={1000}
                                  className={cn(
                                    "mr-3 h-5 w-5",
                                    isChildActive
                                      ? "text-[#221AE9]"
                                      : "text-gray-400 group-hover:text-[#221AE9]"
                                  )}
                                />
                                <span>{child.name}</span>
                              </div>
                              {!isSignedIn && !child.permission && (
                                <Image
                                  src="/icons/lock.png"
                                  alt="lock"
                                  width={1000}
                                  height={1000}
                                  quality={100}
                                  className="w-4 h-4 object-contain"
                                />
                              )}
                            </Link>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.nav>
      </ScrollArea>

      {/* Profile */}
      {isSignedIn && (
        <motion.div
          className="mt-auto border-t border-gray-200 p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: isMobile ? 0.4 : 0.3 }}
        >
          <motion.button
            onClick={handleToProfile}
            className="flex w-full items-center gap-3 h-20 rounded-lg p-4 border border-[#221AE9] bg-[#221AE910]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <InitialAvatar
              name={profileShow?.data?.name || username || "Anonymous"}
              size="sm"
            />
            <div className="flex-1 overflow-hidden text-left">
              <p className="font-medium text-lg truncate">
                {profileShow?.data?.name || username }
              </p>
              <p className="text-sm text-gray-600 truncate">
                {profileShow?.data?.email || "-"}
              </p>
            </div>
          </motion.button>
        </motion.div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="h-full">
        {sidebarContent}
      </motion.div>
    );
  }

  return sidebarContent;
}