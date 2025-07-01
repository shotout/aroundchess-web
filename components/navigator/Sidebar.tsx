"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useConfirmLogin } from "@/app/store/confirmLogin";
import { motion } from "framer-motion";
import { useProfileStore } from "@/app/store/profile";
import { fadeInUp } from "@/utils/motion";
import InitialAvatar from "../avatar/InitialAvatar";
import { usePgnStore } from "@/app/store/zustandStore";
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
    name: "Chess Blogs",
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
  // {
  //   name: "Tournaments : (Coming Soon)",
  //   icon: "/icons/sidebar-tournaments-icon.png",
  //   iconActive: "/icons/sidebar-tournaments-icon-active.png",
  //   disabled: true,
  //   children: [
  //     {
  //       name: "My Teams (Coming Soon)",
  //       href: "#",
  //       icon: "/icons/sidebar-teams-icon.png",
  //       iconActive: "/icons/sidebar-teams-icon-active.png",
  //       disabled: true,
  //     },
  //   ],
  // },
];

export default function Sidebar({ onClose, isMobile = false }: SidebarProps) {
  const pathname = usePathname();
  const { isMember, token, profile } = useProfileStore();
  const router = useRouter();
  const { username } = usePgnStore();
  const { setOpen: setOpenConfirmLogin } = useConfirmLogin();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const { sessionId } = useProfileStore();
  const { setOpen: setOpenSubscribe, setTabType } = usePricingOffer();

  useEffect(() => {
    if (!sessionId) return;
    setIsSignedIn(true);
  }, [sessionId]);

  const handleToProfile = () => {
    router.push("/profile");
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleOpenOffer = (type: string) => {
    setOpenSubscribe(true);
    setTabType(type);
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleNavigation = (href: string, hasPermission: boolean) => {
    if (!isSignedIn && !hasPermission) {
      setOpenConfirmLogin(true);
    } else if (href && href !== "#") {
      if (isMobile && onClose) {
        onClose();
      }
    }
  };

  // Animation variants for mobile
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.2,
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.2,
      },
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const sidebarContent = (
    <div className="flex h-full flex-col z-100">
      {/* Logo Section */}
      <motion.div
        className="flex h-24 items-center px-6 justify-center sm:border-b"
        variants={isMobile ? itemVariants : {}}
      >
        <Link href="/" className="flex items-center justify-center">
          <Image
            src="/icons/logo.png"
            alt="logo"
            className="w-[199px] h-[64px] object-contain"
            quality={100}
            width={1000}
            height={1000}
          />
        </Link>
      </motion.div>

      {/* Mobile Token Section */}
      <motion.div
        className="flex sm:hidden flex-col justify-center pb-[16px] px-[16px] border-b gap-2"
        variants={isMobile ? itemVariants : {}}
      >
        <div className="flex flex-row items-center justify-center gap-2">
          <Image
            src={`/images/pricing/token-icon.png`}
            alt="icon"
            width={1000}
            height={1000}
            className="w-[20px] h-[20px] object-contain"
          />
          <span className="block lg:text-[16px] text-[#221AE9] font-medium">
            Remaining Tokens:{" "}
            <span
              className={`font-bold ${
                token.balance == 0 ? `text-[#FD0000]` : `text-[#221AE9]`
              }`}
            >
              {token.balance}
            </span>
          </span>
        </div>
        {!isMember && (
          <div className="w-full flex flex-col items-center gap-[8px] ">
            <button
              onClick={() => handleOpenOffer("tokens")}
              className="block btn-secondary w-full h-[48px] rounded-full border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Buy Tokens
            </button>
            <button
              onClick={() => handleOpenOffer("subscription")}
              className="block btn-primary w-full h-[48px] rounded-full bg-primary py-2 px-6 text-sm font-medium text-white hover:bg-blue-700"
            >
              Go Unlimited
            </button>
          </div>
        )}
        {isMember && (
          <motion.div
            variants={fadeInUp}
            className={`relative w-full rounded-[8px] bg-[linear-gradient(to_right,_#25CEDA,_#25CEDA,_#25CEDA,_#25CEDA,_#25CEDA,_#25CEDA,_#B2E8F9)] border border-dashed border-white p-[1px]`}
          >
            <div
              className={`flex xl:min-w-[250px] h-[56px] flex-row items-center rounded-[8px] gap-2`}
            >
              <Image
                src={`/icons/onboarding-popup.png`}
                alt="icon"
                width={1000}
                height={1000}
                className="w-[42px] h-[44px] object-contain m-4 mr-0"
              />
              <span className="font-semibold text-[14px] z-10 text-[#17119B]">
                {"Premium package active!"}
              </span>
              <div className="absolute right-0 top-0 bottom-1 h-full flex items-center justify-center">
                <Image
                  src={`/icons/sparks-member.png`}
                  alt="icon"
                  width={1000}
                  height={1000}
                  className="w-[56px] h-[56px] object-cover"
                />
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Navigation Links */}
      <ScrollArea className="flex-1 py-3">
        <motion.nav
          className="space-y-5 px-2"
          variants={isMobile ? containerVariants : {}}
          initial={isMobile ? "hidden" : "visible"}
          animate="visible"
        >
          {sidebarLinks.map((section: any) => {
            const hasChildren = section.children && section.children.length > 0;
            const isActive = section.href
              ? pathname?.includes(section.href)
              : section.children?.some((child: any) => pathname === child.href);

            return (
              <motion.div
                key={section.name}
                variants={isMobile ? itemVariants : {}}
              >
                <div className="space-y-2">
                  {section.href ? (
                    <Link
                      href={
                        !isSignedIn && !section.permission ? "" : section.href
                      }
                      onClick={() =>
                        handleNavigation(section.href, section.permission)
                      }
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
                      {!isSignedIn && !section.permission && (
                        <Image
                          src="/icons/lock.png"
                          alt="lock"
                          className="w-4 h-4 object-contain"
                          quality={100}
                          width={1000}
                          height={1000}
                        />
                      )}
                    </Link>
                  ) : (
                    <div
                      className={cn(
                        "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "text-[#221AE9]"
                          : section.disabled
                          ? "text-[#AAA4A4]"
                          : ""
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
                    <motion.div
                      className="ml-6 space-y-2"
                      variants={isMobile ? containerVariants : {}}
                    >
                      {section.children.map((child: any) => {
                        const isChildActive = pathname?.includes(child.href);
                        return (
                          <motion.div
                            key={child.href}
                            variants={isMobile ? itemVariants : {}}
                          >
                            <Link
                              onClick={() =>
                                handleNavigation(child.href, child.permission)
                              }
                              href={
                                !isSignedIn && !section.permission
                                  ? ""
                                  : child.href
                              }
                              className={cn(
                                "min-h-[52px] group flex items-center justify-between rounded-sm px-3 py-2 text-sm font-medium transition-all duration-200",
                                isChildActive
                                  ? "bg-[#221AE910] text-[#221AE9] border-[#221AE9] border-r-4 "
                                  : child.disabled
                                  ? "text-[#AAA4A4]"
                                  : "text-gray-600 hover:bg-gray-50 hover:text-[#221AE9]"
                              )}
                            >
                              <div className="flex flex-row items-center">
                                <Image
                                  width={1000}
                                  height={1000}
                                  alt={child.href}
                                  src={
                                    isChildActive
                                      ? child.iconActive
                                      : child.icon
                                  }
                                  className={cn(
                                    "mr-3 h-5 w-5",
                                    isChildActive
                                      ? "text-[#221AE9]"
                                      : "text-gray-400 group-hover:text-[#221AE9]"
                                  )}
                                />
                                <span>{child.name}</span>
                              </div>
                              {!isSignedIn &&
                                !child.permission &&
                                child.href != "#" && (
                                  <Image
                                    src="/icons/lock.png"
                                    alt="lock"
                                    className="w-4 h-4 object-contain"
                                    quality={100}
                                    width={1000}
                                    height={1000}
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

      {/* Profile Section */}
      {sessionId && (
        <motion.div
          className="mt-auto border-t border-gray-200 p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: isMobile ? 0.4 : 0.3 }}
        >
          <motion.button
            onClick={handleToProfile}
            className="flex w-full items-center gap-3 h-[80px] rounded-[8px] p-[16px] border border-[#221AE9] bg-[#221AE910]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <InitialAvatar
              name={profile?.name != "" ? profile?.name : username}
              size="sm"
            />
            <div className="flex-1 text-left overflow-hidden">
              <p className="font-medium text-[16px] text-[#121212] line-clamp-1">
                {profile?.name != "" ? profile?.name : username}
              </p>
              <p className="font-normal text-[#364152] text-[12px] truncate line-clamp-1">
                {profile?.email}
              </p>
            </div>
          </motion.button>
        </motion.div>
      )}
    </div>
  );

  // Return wrapped content for mobile with animations
  if (isMobile) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="h-full"
      >
        {sidebarContent}
      </motion.div>
    );
  }

  // Return plain content for desktop
  return sidebarContent;
}
