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
import { useTutorial } from "@/components/TutorialProvider";

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
    name: "Play & Practice",
    icon: "/icons/sidebar-playground-practice-icon.png",
    iconActive: "/icons/sidebar-playground-practice-icon-active.png",
    children: [
      {
        name: "You vs AI",
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
    ]
  },
  {
    name: "Analyze Games",
    icon: "/icons/sidebar-analyze-icon.png",
    iconActive: "/icons/sidebar-analyze-icon-active.png",
    children: [
      {
        name: "Game History",
        href: "/my-game-history",
        icon: "/icons/sidebar-game-history.png",
        iconActive: "/icons/sidebar-game-history-active.png",
      },
      {
        name: "Saved Mistakes",
        href: "/saved-mistakes",
        icon: "/icons/sidebar-saved-mistakes-icon.svg",
        iconActive: "/icons/sidebar-saved-mistakes-icon-active.svg",
      }
    ]
  },
  {
    name: "Training",
    icon: "/icons/sidebar-training-plan-icon.png",
    iconActive: "/icons/sidebar-training-plan-icon-active.png",
    children: [
      {
        name: "Training Plan",
        href: "/training-plan",
        icon: "/icons/sidebar-training-plan-icon-2.svg",
        iconActive: "/icons/sidebar-training-plan-icon-active-2.svg",
      },
      {
        name: "Handbook : Chess Theory",
        href: "/handbook",
        icon: "/icons/sidebar-theory-icon.png",
        iconActive: "/icons/sidebar-theory-icon-active.png",
      }
    ]
  },

  /*
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
  */
];

export default function Sidebar({ onClose, isMobile = false }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    isMember,
    isMemberMonthly,
    token,
    profile: profileShow,
    sessionId,
  } = useProfileStore();
  const { username } = usePgnStore();
  const { setOpen: setOpenConfirmLogin } = useConfirmLogin();
  const { setOpen: setOpenSubscribe, setTabType } = usePricingOffer();
  const { startTutorial } = useTutorial();
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
    visible: {
      opacity: 1,
      transition: { duration: 0.2, staggerChildren: 0.05, delayChildren: 0.1 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, x: -20, transition: { duration: 0.2 } },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const sidebarContent = (
    <div className="flex h-full flex-col z-10">
      {/* Logo */}
      <motion.div
        className="flex md:h-24 py-[8px] items-center px-6 md:justify-center sm:border-b mb-[16px]"
        variants={isMobile ? itemVariants : {}}
      >
        <Link href="/">
          <Image
            src="/icons/logo.png"
            alt="logo"
            width={199}
            height={64}
            quality={100}
            className="w-[125px] md:w-[199px] h-[40px] md:h-[64px] object-contain"
          />
        </Link>

        <button
          className="absolute right-4 md:hidden"
          onClick={() => {
            if (onClose) onClose();
          }}
        >
          <Image
            src="/icons/close-icon.png"
            alt="close"
            width={20}
            height={20}
            className="w-6 h-6 object-contain"
          />
        </button>
      </motion.div>

      {/* Mobile token & offers */}
      <motion.div
        className="flex sm:hidden flex-col justify-center pb-4 px-4 border-b gap-2"
        variants={isMobile ? itemVariants : {}}
      >
        <div className="flex items-center justify-center gap-[8px]">
          <Image
            src="/images/pricing/token-icon.png"
            alt="icon"
            width={1000}
            height={1000}
            className="w-5 h-5 object-contain"
          />
          <span className={`flex gap-[4px] ${token.balance === 0 ? "text-[#2e3133]" : "text-[#221AE9]"} font-medium`}>
            Remaining Tokens:
            <span className={`${token.balance === 0 ? "text-[#FD0000]" : "text-[#221AE9]"} font-bold`}>
              {token.balance}
            </span>
          </span>

          <button type="button" className="font-semibold text-[#221AE9] underline" onClick={() => handleOpenOffer("tokens")}>
            Buy More
          </button>
        </div>
        {!isMember && !isMemberMonthly && token.balance === 0 ? (
          <motion.div
            variants={fadeInUp}
            className="relative w-full rounded-lg bg-[linear-gradient(to_right,_#f7fdff,_#E6F7FE,_#f7fdff)] outline-dashed outline-[2px] outline-[#C0CED4] -outline-offset-[2px]"
          >
            <div className="flex flex-col justify-center items-center bg-[url(/images/asset-icon-_member.svg)] bg-contain bg-no-repeat bg-right h-[64px] rounded-[8px] px-[16px]">
              <div className="flex items-center gap-[8px] text-[14px]">
                <Image 
                  src="/images/asset-icon-_member2.svg"
                  alt="icon"
                  width={24}
                  height={24}
                  className="w-[24px] h-[24px] object-contain"
                />
                <span className="mt-1">You are on the Free Package.</span>
              </div>
              <button type="button" className="font-semibold text-[16px] text-[#221AE9] leading-[140%] underline" onClick={() => handleOpenOffer("subscription")}>
                Get the Unlimited Package now.
              </button>
            </div>
          </motion.div>
          // <div className="w-full flex flex-col gap-2">
          //   <button
          //     onClick={() => handleOpenOffer("tokens")}
          //     className="btn-secondary w-full h-12 rounded-full border border-gray-300 px-6 text-[14px] --sm font-medium text-gray-700 hover:bg-gray-50"
          //   >
          //     Buy Tokens
          //   </button>
          //   <button
          //     onClick={() => handleOpenOffer("subscription")}
          //     className="btn-primary w-full h-12 rounded-full bg-primary px-6 text-[14px] --sm font-medium text-white hover:bg-blue-700"
          //   >
          //     Go Unlimited
          //   </button>
          // </div>
        ) : (
          <motion.div
            variants={fadeInUp}
            className="relative w-full rounded-lg bg-[linear-gradient(to_right,_#25CEDA,_#B2E8F9)] outline-dashed outline-[2px] outline-white -outline-offset-[2px]"
          >
            <div className="flex bg-[url(/icons/sparks-member.png)] bg-contain bg-no-repeat bg-right items-center gap-2 h-[64px] rounded-[8px] px-[16px]">
              <Image
                src="/icons/onboarding-popup.png"
                alt="icon"
                width={40}
                height={40}
                className="w-[40px] h-[40] object-contain"
              />
              <span className="font-semibold text-[16px] text-[#17119B]">
                Premium package active!
              </span>
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
              <motion.div
                key={section.name}
                variants={isMobile ? itemVariants : {}}
              >
                <div className="space-y-2">
                  {section.href ? (
                    <Link
                      href={
                        !isSignedIn && !section.permission ? "#" : section.href!
                      }
                      onClick={() =>
                        handleNavigation(section.href!, section.permission)
                      }
                      className={cn(
                        "group gap-x-2 flex items-center rounded-lg px-3 py-2 text-[14px] --sm font-medium transition-all duration-200",
                        isActive
                          ? "text-[#221AE9]"
                          : "hover:bg-[#221AE950] hover:text-[#221AE9]"
                      )}
                    >
                      <Image
                        src={isActive ? section.iconActive : section.icon}
                        alt={section.name}
                        width={1000}
                        height={1000}
                        className={cn(
                          "h-5 w-5 transition-colors",
                          isActive
                            ? "text-[#221AE9]"
                            : "text-gray-400 group-hover:text-[#221AE9]"
                        )}
                      />
                      <span className="flex-1 font-semibold">
                        {section.name}
                      </span>
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
                        "group flex gap-x-2 items-center rounded-lg px-3 py-2 text-[14px] --sm font-medium transition-all duration-200",
                        isActive
                          ? "text-[#221AE9]"
                          : section.disabled
                          ? "text-[#AAA4A4]"
                          : ""
                      )}
                    >
                      <Image
                        src={isActive ? section.iconActive : section.icon}
                        alt={section.name}
                        width={1000}
                        height={1000}
                        className={cn(
                          "h-5 w-5 transition-colors",
                          isActive
                            ? "text-[#221AE9]"
                            : "text-gray-400 group-hover:text-[#221AE9]"
                        )}
                      />
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
                      {section.children!.map((child) => {
                        const isChildActive = pathname?.includes(child.href);
                        return (
                          <motion.div
                            key={child.href}
                            variants={isMobile ? itemVariants : {}}
                          >
                            <Link
                              data-tutorial={
                                child.name === "My Game History"
                                  ? "5"
                                  : undefined
                              }
                              href={
                                !isSignedIn && !child.permission
                                  ? "#"
                                  : child.href
                              }
                              onClick={() =>
                                handleNavigation(child.href, child.permission)
                              }
                              className={cn(
                                "min-h-[52px] group flex items-center justify-between rounded-sm px-3 py-2 text-[14px] --sm font-medium transition-all duration-200",
                                isChildActive
                                  ? "bg-[#221AE910] text-[#221AE9] border-r-4 border-[#221AE9]"
                                  : child.disabled
                                  ? "text-[#AAA4A4]"
                                  : "text-gray-600 hover:bg-gray-50 hover:text-[#221AE9]"
                              )}
                            >
                              <div className="flex items-center">
                                <Image
                                  src={
                                    isChildActive
                                      ? child.iconActive
                                      : child.icon
                                  }
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

      {/* ========================================
          🧪 TESTING BUTTON - EASY TO DELETE
          Tutorial Test Button (Delete this section when done)
          ======================================== */}
      <motion.div
        className="px-4 py-2 border-t border-dashed border-yellow-400 bg-yellow-50"
        variants={isMobile ? itemVariants : {}}
      >
        <button
          onClick={() => {
            if (!pathname.includes("/analysis")) {
              router.replace("/analysis");
            }
            startTutorial();
            if (isMobile && onClose) onClose();
          }}
          className="w-full px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg shadow-md transition-all duration-200 flex items-center justify-center gap-2"
        >
          <span>🧪</span>
          <span>Test Tutorial</span>
        </button>
      </motion.div>
      {/* ========================================
          END OF TESTING BUTTON
          ======================================== */}

      {/* Profile */}
      {isSignedIn && (
        <motion.div
          className="mt-auto border-t border-[#c0ced4] p-[14px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: isMobile ? 0.4 : 0.3 }}
        >
          <div className="flex xl:hidden w-full items-center gap-[8px] mb-[12px]">
            <Link href={'/faq'} className="flex items-center justify-center gap-[4px] w-1/2 bg-[#f7fcff] rounded-full border border-[#81cff3] p-[8px] text-[#17119B] font-medium hover:bg-[#def3ff]">
              <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_821_190318)">
                  <path d="M16.2105 16.6094H5.33266C5.07559 16.6094 4.86719 16.8185 4.86719 17.0764V18.315C4.86719 18.5729 5.07559 18.782 5.33266 18.782H16.2105C16.4675 18.782 16.6759 18.5729 16.6759 18.315V17.0764C16.6759 16.8185 16.4675 16.6094 16.2105 16.6094Z" fill="#17119B"/>
                  <path d="M15.9724 17.5936H6.7187V15.4464L7.19935 14.284V13.2789L6.7187 11.2078C6.7187 11.2078 5.94461 11.3906 5.79788 11.5023C5.65116 11.6139 5.47914 12.1114 4.86188 11.7662C4.24463 11.421 3.73363 10.9084 3.73363 10.9084L3.53125 9.02003L6.53656 5.17231L8.33267 2.9185L9.18771 2.28906L10.4526 3.14185L14.7177 5.17739L16.2912 9.30429L15.4918 13.5682L15.0111 15.6748L14.4597 16.487L14.3838 17.1875L15.9674 17.5835L15.9724 17.5936Z" fill="#17119B"/>
                  <path d="M10.3461 16.9792C10.675 16.9792 10.9482 16.8675 11.1708 16.6441C11.3934 16.4208 11.5047 16.1467 11.5047 15.8167C11.5047 15.4868 11.3934 15.2127 11.1708 14.9893C10.9482 14.766 10.675 14.6543 10.3461 14.6543C10.0173 14.6543 9.74404 14.766 9.52142 14.9893C9.29881 15.2127 9.1875 15.4868 9.1875 15.8167C9.1875 16.1467 9.29881 16.4208 9.52142 16.6441C9.74404 16.8675 10.0173 16.9792 10.3461 16.9792Z" fill="#FAFDFF"/>
                  <path d="M10.0747 13.827H10.7071C10.9955 13.827 11.2384 13.6036 11.2687 13.3143C11.2991 13.0554 11.3497 12.8371 11.4306 12.6493C11.5571 12.3498 11.8101 11.9894 12.1946 11.563C12.5437 11.1772 12.8776 10.7864 13.2065 10.3904C13.5354 9.99451 13.6973 9.47674 13.6973 8.83715C13.6973 8.02496 13.3836 7.33969 12.7562 6.77623C12.1288 6.21278 11.3547 5.93359 10.4288 5.93359C9.65981 5.93359 8.96161 6.15694 8.33424 6.59857C7.88395 6.91837 7.52978 7.30923 7.27175 7.77116C7.10985 8.06557 7.24646 8.43613 7.55508 8.56811L8.09644 8.79654C8.35953 8.90821 8.6631 8.79654 8.80982 8.55288C8.94137 8.33461 9.10833 8.14172 9.31577 7.98435C9.65475 7.72547 10.0241 7.59349 10.4288 7.59349C10.8336 7.59349 11.2029 7.71024 11.4863 7.94375C11.7645 8.17725 11.9062 8.47674 11.9062 8.84222C11.9062 9.24831 11.7848 9.60872 11.547 9.92852C11.3092 10.2483 11.0208 10.5732 10.6919 10.8981C10.3074 11.3042 10.0089 11.7102 9.79642 12.1163C9.64969 12.4006 9.55356 12.761 9.50803 13.2026C9.47261 13.5377 9.74076 13.827 10.0747 13.827Z" fill="#FAFDFF"/>
                  <path d="M16.4143 17.8843H14.5068C14.3551 17.8843 14.2134 17.8183 14.1173 17.7016C14.0211 17.5848 13.9807 17.4325 14.011 17.2803C14.3551 15.4935 14.6637 14.8691 14.9318 14.2397C14.9622 14.1635 14.9926 14.0924 15.028 14.0214C15.4327 13.0518 15.7059 11.996 15.8425 10.8792C16.0196 9.43255 15.8324 8.14828 15.2911 7.05691C14.9723 6.41732 14.6283 5.87925 14.2286 5.42239C13.667 4.77265 13.0295 4.30057 12.2807 3.99092C11.628 3.71681 10.8995 3.55945 10.2063 3.41732C9.80662 3.3361 9.49799 3.17366 9.21467 2.89448C9.07806 2.75742 8.92122 2.62544 8.74414 2.48331C8.74414 2.49854 8.74414 2.51376 8.74414 2.52392C8.75426 2.70666 8.76438 2.93001 8.68342 3.16859C8.64801 3.27519 8.57212 3.37163 8.47599 3.43255L8.40515 3.47823C8.31914 3.53407 8.22301 3.59498 8.12182 3.6559C7.88909 3.78788 7.73225 3.97062 7.64624 4.22442C7.52987 4.57468 7.32243 4.81833 7.115 5.03153C6.93286 5.21935 6.76589 5.41224 6.58375 5.62036C6.41679 5.80818 6.24983 6.00615 6.06769 6.19397C5.63764 6.64067 5.19746 7.08229 4.76741 7.51377L4.54479 7.73712C4.47396 7.80818 4.39807 7.87925 4.31712 7.94524C4.23111 8.02138 4.15522 8.09245 4.08944 8.16351C3.5582 8.73204 3.43678 9.32087 3.70493 10.0315C3.72011 10.0772 3.74034 10.1178 3.76058 10.1635C3.80106 10.2498 3.84659 10.3513 3.87695 10.4681C3.96296 10.7574 4.06921 10.7574 4.18051 10.7574H4.18557C4.37783 10.7574 4.55997 10.8691 4.64092 11.0468C4.66116 11.0924 4.6814 11.1331 4.70164 11.1737C4.72188 11.2244 4.74211 11.2701 4.75729 11.2904C4.80283 11.3615 4.83318 11.397 4.84836 11.4122C4.86354 11.4122 4.8939 11.4021 4.94449 11.3869C5.16205 11.3107 5.39478 11.194 5.63764 11.0315C6.06263 10.7473 6.55846 10.798 6.95815 11.1686C7.58552 11.7473 8.05605 13.2752 7.66647 13.9909C7.30725 14.6508 7.26678 15.3259 7.48939 17.331C7.50457 17.4732 7.45904 17.6204 7.36291 17.727C7.26678 17.8336 7.13017 17.8945 6.98345 17.8945H5.1924C4.91413 17.8945 4.68646 17.666 4.68646 17.3869C4.68646 17.1077 4.91413 16.8792 5.1924 16.8792H6.41679C6.23971 15.0315 6.33078 14.3056 6.77095 13.5036C6.82155 13.3767 6.77095 12.8183 6.5281 12.3107C6.38643 12.0163 6.25489 11.9046 6.20935 11.8792C6.20935 11.8792 6.20429 11.8792 6.19923 11.8843C5.88555 12.0975 5.57186 12.2549 5.27336 12.3564C4.51444 12.6153 4.12992 12.199 3.9073 11.8589C3.88201 11.8183 3.86177 11.7828 3.84153 11.7473C3.49749 11.666 3.09273 11.4224 2.89541 10.7676C2.88024 10.7168 2.84988 10.6508 2.82458 10.5848C2.79929 10.5239 2.76893 10.463 2.74869 10.4021C2.34393 9.33102 2.55137 8.32087 3.34065 7.47823C3.43678 7.37163 3.53796 7.28026 3.63915 7.19397C3.69987 7.13813 3.76564 7.08229 3.82129 7.02646L4.04897 6.80311C4.47396 6.38179 4.91413 5.94524 5.33407 5.50361C5.49597 5.33102 5.65281 5.15336 5.81978 4.96554C6.00192 4.75742 6.18912 4.54422 6.38643 4.3361C6.53316 4.18382 6.63435 4.06199 6.68494 3.9097C6.8519 3.41224 7.17065 3.03153 7.626 2.77772C7.66142 2.75742 7.69683 2.73712 7.73225 2.71681C7.73225 2.6762 7.73225 2.63559 7.72719 2.59498C7.71201 2.29549 7.67659 1.6762 8.36974 1.36148C8.50634 1.29549 8.66825 1.30057 8.80485 1.36656C8.83521 1.38179 8.87062 1.39701 8.90098 1.41224C9.00723 1.45793 9.13877 1.51376 9.2602 1.61021C9.51317 1.8031 9.73073 1.99092 9.92299 2.17874C10.0647 2.32087 10.1962 2.38686 10.4036 2.42747C11.1423 2.57975 11.9316 2.75234 12.6703 3.05691C13.5557 3.42747 14.3348 4.00107 14.9926 4.7625C15.4428 5.28534 15.8375 5.8894 16.1967 6.61021C16.8291 7.88432 17.0467 9.36148 16.8443 11.0112C16.6976 12.2193 16.3991 13.3716 15.9589 14.4275C15.9286 14.5036 15.8931 14.5798 15.8628 14.6559C15.6452 15.1635 15.3973 15.6356 15.1292 16.8792H16.4143C16.6925 16.8792 16.9202 17.1077 16.9202 17.3869C16.9202 17.666 16.6925 17.8945 16.4143 17.8945V17.8843Z" fill="#17119B"/>
                  <path d="M16.4134 18.2088H14.506C14.2581 18.2088 14.0203 18.0972 13.8634 17.9043C13.7066 17.7114 13.6408 17.4627 13.6863 17.2139C14.0051 15.5337 14.3036 14.8535 14.5616 14.2545L14.7235 13.884C15.1182 12.9449 15.3813 11.9144 15.5179 10.8281C15.6848 9.44742 15.5128 8.22408 15.0018 7.19362C14.6982 6.57941 14.3643 6.06671 13.9849 5.63017C13.4587 5.02103 12.8566 4.5794 12.1584 4.28499C11.531 4.02103 10.8176 3.86874 10.1447 3.73169C9.70456 3.64032 9.3504 3.45758 9.03165 3.16316C9.02153 3.19869 9.01141 3.23423 9.00129 3.27484C8.94058 3.4525 8.81915 3.60986 8.65725 3.70631L8.59148 3.74692C8.49029 3.81291 8.3891 3.8789 8.28791 3.93473C8.12601 4.02611 8.01976 4.14793 7.96411 4.3256C7.8275 4.73677 7.57959 5.02611 7.35697 5.25453C7.17989 5.43727 7.01293 5.62509 6.84091 5.82814C6.66889 6.02611 6.49687 6.22408 6.31473 6.41189C5.88467 6.86367 5.43944 7.30529 5.00939 7.73677L4.78677 7.96012C4.71594 8.03118 4.64005 8.10225 4.5591 8.17331C4.46803 8.25453 4.3972 8.31545 4.34154 8.38144C3.89125 8.85859 3.79512 9.32052 4.0228 9.91443C4.03797 9.95504 4.05315 9.99057 4.07339 10.0312C4.11893 10.1378 4.16952 10.2495 4.20494 10.3764C4.21 10.4017 4.22012 10.417 4.22517 10.4322C4.5591 10.4525 4.82725 10.6302 4.95374 10.8992C4.97397 10.9398 4.98915 10.9804 5.00939 11.016C5.15611 10.95 5.31296 10.8637 5.47992 10.752C6.0314 10.3865 6.68913 10.4474 7.20013 10.9195C7.93375 11.5997 8.44475 13.2799 7.97423 14.1429C7.67572 14.6911 7.60995 15.2495 7.83762 17.2901C7.86292 17.5286 7.78703 17.7621 7.63018 17.9398C7.46828 18.1175 7.24567 18.219 7.00787 18.219H5.21683C4.75642 18.219 4.38202 17.8434 4.38202 17.3814C4.38202 16.9195 4.75642 16.5439 5.21683 16.5439H6.08705C5.95551 14.9449 6.05669 14.1936 6.48675 13.3764C6.49687 13.2495 6.44627 12.8332 6.25907 12.4423C6.22872 12.3814 6.19836 12.3307 6.17306 12.2901C5.92009 12.4423 5.657 12.5693 5.39897 12.6555C4.68053 12.8992 4.09363 12.6911 3.65852 12.0312C3.65852 12.0261 3.65346 12.021 3.6484 12.016C3.26894 11.889 2.82371 11.5794 2.60615 10.8535C2.59603 10.8129 2.57074 10.7621 2.54544 10.7114C2.51508 10.6454 2.48472 10.5743 2.45943 10.5083C2.00914 9.31545 2.23681 8.18854 3.12221 7.24438C3.2234 7.1327 3.33471 7.03626 3.44096 6.93981C3.50167 6.88397 3.55733 6.83321 3.61298 6.78245L3.8356 6.5591C4.26059 6.13778 4.6957 5.70123 5.11564 5.26468C5.27248 5.09717 5.42932 4.91951 5.58617 4.73677C5.77337 4.52357 5.96057 4.30529 6.16294 4.09717C6.29955 3.95504 6.36026 3.87382 6.38556 3.7926C6.57276 3.24438 6.9168 2.81798 7.40757 2.51849C7.39239 2.16316 7.41769 1.42712 8.24238 1.05149C8.47005 0.944887 8.73314 0.949963 8.95576 1.06164C8.98106 1.07687 9.01141 1.08702 9.03671 1.09717C9.15308 1.14793 9.30992 1.219 9.46676 1.33575C9.72985 1.5388 9.95753 1.73169 10.1599 1.92966C10.256 2.02611 10.3319 2.06164 10.4787 2.09209C11.2376 2.24438 12.037 2.42204 12.806 2.74184C13.7369 3.1327 14.5616 3.73677 15.2497 4.53372C15.7202 5.07687 16.1301 5.70631 16.4994 6.44743C17.1571 7.77737 17.3848 9.32052 17.1774 11.0312C17.0256 12.2698 16.717 13.4474 16.2667 14.5337L16.0896 14.95C15.9176 15.3408 15.7405 15.7418 15.5482 16.5337H16.4235C16.8839 16.5337 17.2583 16.9094 17.2583 17.3713C17.2583 17.8332 16.8839 18.2088 16.4235 18.2088H16.4134Z" fill="#17119B"/>
                  <path d="M16.9078 21.2539H4.63354C4.15852 21.2539 3.77344 21.6403 3.77344 22.1169V22.1676C3.77344 22.6442 4.15852 23.0306 4.63354 23.0306H16.9078C17.3828 23.0306 17.7679 22.6442 17.7679 22.1676V22.1169C17.7679 21.6403 17.3828 21.2539 16.9078 21.2539Z" fill="#17119B"/>
                  <path d="M15.7427 18.7812H5.20892C4.7311 18.7812 4.34375 19.1687 4.34375 19.6467C4.34375 20.1247 4.7311 20.5122 5.20892 20.5122H15.7427C16.2205 20.5122 16.6079 20.1247 16.6079 19.6467C16.6079 19.1687 16.2205 18.7812 15.7427 18.7812Z" fill="#17119B"/>
                </g>
                <defs>
                  <clipPath id="clip0_821_190318">
                    <rect width="20" height="24" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
              <span>FAQ</span>
            </Link>

            <Link href={'/about-us'} className="flex items-center justify-center gap-[4px] w-1/2 bg-[#f7fcff] rounded-full border border-[#81cff3] p-[8px] text-[#17119B] font-medium hover:bg-[#def3ff]">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.71337 15.3303C1.82471 12.3396 1.82471 7.48762 4.71337 4.49693C7.60203 1.50623 12.2884 1.50623 15.1771 4.49693C18.0658 7.48762 18.0658 12.3396 15.1771 15.3303C12.2884 18.321 7.60203 18.321 4.71337 15.3303Z" fill="#17119B"/>
                <path d="M8.79688 6.63352V6.1386C8.79688 5.57599 9.23814 5.11914 9.78155 5.11914H10.1248C10.6682 5.11914 11.1094 5.57599 11.1094 6.1386V6.63352C11.1094 7.19613 10.6682 7.65298 10.1248 7.65298H9.78155C9.23814 7.65298 8.79688 7.19613 8.79688 6.63352ZM8.79688 14.0532V9.85687C8.79688 9.29427 9.23814 8.83741 9.78155 8.83741H10.1248C10.6682 8.83741 11.1094 9.29427 11.1094 9.85687V14.0532C11.1094 14.6158 10.6682 15.0726 10.1248 15.0726H9.78155C9.23814 15.0726 8.79688 14.6158 8.79688 14.0532Z" fill="#17119B"/>
                <path d="M9.93638 18.2439C9.78521 18.2439 9.63403 18.2397 9.48286 18.2312C9.10288 18.2101 8.7229 18.1593 8.35109 18.0832C8.0038 18.0113 7.77908 17.6602 7.84854 17.3048C7.91799 16.9453 8.25303 16.7126 8.60032 16.7845C8.91084 16.848 9.23362 16.8903 9.55231 16.9114C9.84241 16.9284 10.1366 16.9284 10.4226 16.903C10.7781 16.8776 11.0804 17.1525 11.109 17.5163C11.1335 17.8801 10.872 18.1974 10.5166 18.227C10.3245 18.2397 10.1284 18.2481 9.93229 18.2481L9.93638 18.2439Z" fill="#17119B"/>
                <path d="M4.27927 15.655C2.65312 13.8445 1.89316 11.7379 2.06067 9.3056C2.19551 7.31744 2.96772 5.60847 4.31604 4.18716C7.0617 1.30221 11.4294 0.938424 14.5796 3.33267C16.2793 4.62286 17.3089 6.36144 17.7011 8.50188C17.9871 10.067 17.8319 12.4528 16.4917 14.4875C16.5326 14.4917 16.5653 14.5002 16.598 14.5002C16.8513 14.5002 17.1087 14.5002 17.362 14.5002C17.697 14.5044 17.9422 14.7582 17.9381 15.0839C17.9381 15.4054 17.6889 15.6423 17.3538 15.6423C16.8063 15.6423 16.2629 15.6423 15.7154 15.6423C15.6215 15.6423 15.5561 15.6677 15.4825 15.7354C15.1516 16.0442 14.8084 16.3487 14.4652 16.6575C14.5469 16.6575 14.6449 16.6575 14.743 16.6575C15.6827 16.6575 16.6225 16.6491 17.5622 16.6575C17.9626 16.6575 18.2445 16.9537 18.2445 17.3471C18.2445 17.7658 17.9708 18.0619 17.5581 18.0662C16.8308 18.0662 16.1036 18.0662 15.3763 18.0662C14.408 18.0662 13.4396 18.0577 12.4754 18.0746C11.981 18.0831 11.6051 17.677 11.7685 17.034C11.8176 16.8479 11.9565 16.7464 12.1281 16.6872C12.9248 16.4122 13.6562 15.9976 14.2977 15.4393C15.6664 14.2464 16.5203 12.7362 16.7369 10.8919C17.0311 8.41304 16.2834 6.30644 14.4979 4.61863C13.411 3.59071 12.1158 2.99426 10.6449 2.85467C8.39775 2.63893 6.47334 3.37074 4.91256 5.05856C3.80531 6.25568 3.16384 7.69815 3.06987 9.35636C2.90235 12.3048 4.0668 14.5594 6.48968 16.1161C6.72666 16.2684 6.83289 16.4545 6.78795 16.7083C6.74709 16.941 6.49377 17.1694 6.22002 17.2075C6.1097 17.2244 5.99939 17.2244 5.88907 17.2244C4.78182 17.2244 3.67457 17.2244 2.5714 17.2244C2.13013 17.2244 1.83187 16.9833 1.76241 16.5772C1.6807 16.0949 2.01165 15.6677 2.4856 15.6592C3.02084 15.6508 3.56016 15.6592 4.0954 15.6592C4.14443 15.6592 4.19346 15.6592 4.27518 15.6592L4.27927 15.655Z" fill="#17119B"/>
                <path d="M11.086 11.958C11.086 12.6306 11.086 13.299 11.086 13.9716C11.086 14.6611 10.6897 15.0714 10.0237 15.0756C9.88069 15.0756 9.7336 15.0841 9.59468 15.0587C9.08804 14.9699 8.77344 14.5596 8.77344 13.9927C8.77344 13.1086 8.77344 12.2203 8.77344 11.3362C8.77344 10.8624 8.77344 10.3887 8.77344 9.91489C8.77752 9.39459 9.06353 8.98003 9.52114 8.89543C9.79897 8.84467 10.0972 8.85313 10.371 8.90389C10.7632 8.98003 11.0574 9.35229 11.0697 9.76684C11.0901 10.414 11.0778 11.0613 11.0819 11.7042C11.0819 11.7888 11.0819 11.8777 11.0819 11.9623L11.086 11.958Z" fill="#FAFDFF"/>
                <path d="M11.0962 6.41164C11.0839 6.56392 11.0921 6.72043 11.0594 6.86849C10.9777 7.29573 10.6467 7.60453 10.2218 7.65106C10.042 7.67221 9.85817 7.67644 9.68248 7.65529C9.17584 7.6003 8.83672 7.26612 8.78769 6.74158C8.76318 6.48778 8.77135 6.22128 8.80403 5.96747C8.86124 5.52331 9.22079 5.1849 9.6498 5.14683C9.81323 5.12991 9.98483 5.12991 10.1483 5.13837C10.6876 5.17221 11.0553 5.56138 11.0839 6.11976C11.088 6.21705 11.0839 6.31011 11.0839 6.40741C11.0839 6.40741 11.0921 6.40741 11.0962 6.40741V6.41164Z" fill="#FAFDFF"/>
              </svg>
              <span>About Us</span>
            </Link>
          </div>
          <motion.button
            onClick={handleToProfile}
            className="flex w-full items-center gap-[8px] rounded-[8px] py-[10px] px-[16px] border border-[#c0ced4] bg-white shadow-[0px_4px_8px_rgba(0,0,0,0.12)]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <InitialAvatar
              name={profileShow?.name || username || "Anonymous"}
              className="w-[40px] h-[40px]"
            />
            <div className="overflow-hidden text-left">
              <h4 className="font-medium text-[18px] truncate">
                {profileShow?.name || username}
              </h4>
              <p className="text-[14px] text-[#364152] truncate">
                {profileShow?.email || "-"}
              </p>
            </div>
          </motion.button>

          <div className="xl:hidden flex justify-center gap-[14px] mt-[12px]">
            <Link href="/privacy-policy" className="text-[14px] text-[#000] underline">
              Privacy Policy
            </Link>

            <Link href="/terms-of-service" className="text-[14px] text-[#000] underline">
              Terms of Service
            </Link>

            <Link href="/eu-compliance" className="text-[14px] text-[#000] underline">
              EU Compliance
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );

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

  return sidebarContent;
}
