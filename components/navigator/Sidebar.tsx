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
  const { isMember, token, profile } = useProfileStore();
  const router = useRouter();

  const { setOpen: setOpenConfirmLogin } = useConfirmLogin();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const { sessionId } = useProfileStore();

  useEffect(() => {
    if (!sessionId) return;
    setIsSignedIn(true);
  }, [sessionId]);

  useEffect(() => {}, []);
  const handleToProfile = () => {
    router.push("/profile");
  };
  return (
    <div className="flex h-full flex-col z-100">
      <div className="flex h-24 items-center px-6 justify-center sm:border-b">
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
      </div>
      <div className="flex sm:hidden flex-col justify-center pb-[16px] px-[16px] border-b">
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
      </div>
      <ScrollArea className="flex-1 py-3">
        <nav className="space-y-5 px-2">
          {sidebarLinks.map((section: any) => {
            const hasChildren = section.children && section.children.length > 0;
            const isActive = section.href
              ? pathname?.includes(section.href)
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
                    // Non-clickable title (section header)
                    <div
                      // style={{ width: widthContainer - 50 }}
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
                    <div className="ml-6 space-y-2 ">
                      {section.children.map((child: any) => {
                        const isChildActive = pathname?.includes(child.href);
                        return (
                          <Link
                            key={child.href}
                            onClick={
                              !isSignedIn && !section.permission
                                ? () => setOpenConfirmLogin(true)
                                : () => null
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
                                  isChildActive ? child.iconActive : child.icon
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
      {sessionId && (
        <motion.div
          className="mt-auto border-t border-gray-200 p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            onClick={handleToProfile}
            className="flex w-full items-center gap-3 h-[80px] rounded-[8px] p-[16px] border border-[#221AE9] bg-[#221AE910]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <InitialAvatar name={profile?.name} size="sm" />
            {/* {user?.imageUrl && (
              <Image
                src={user.imageUrl}
                alt={profile?.name || "User"}
                width={40}
                height={40}
                className="rounded-full"
              />
            )} */}
            <div className="flex-1 text-left">
              <p className="font-medium text-[18px] text-[#121212] line-clamp-1">
                {profile?.name}
              </p>
              <p className="font-normal text-[#364152] text-[14px] line-clamp-1">
                {profile?.email}
              </p>
            </div>
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}

// className={cn(
//   "mr-3 h-5 w-5",
//   isChildActive
//     ? "text-[#221AE9]"
//     : child.href == "/training-plan"
//     ? "text-[#AAA4A4]"
//     : "text-gray-400 group-hover:text-[#221AE9]"
// )}
