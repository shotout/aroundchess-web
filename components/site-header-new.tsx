"use client";

import { usePgnStore } from "@/app/store/zustandStore";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BarChart2, DollarSign, HelpCircle, Info, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { motion } from "@/utils/motion";
import { usePricingOffer } from "@/app/store/pricingOffer";
import { useProfileStore } from "@/app/store/profile";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useApiClient } from "@/functions/api-client";
import { setPersistedCookie } from "@/utils/persisted-cookie";
import { useLoadingAPI } from "@/app/store/loadingApi";
import { useConfirmLogin } from "@/app/store/confirmLogin";
import InitialAvatar from "./avatar/InitialAvatar";

interface SiteHeaderProps {
  children?: React.ReactNode;
}

export function SiteHeaderNew({ children }: SiteHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { open } = usePricingOffer();
  const clearAll = usePgnStore((state) => state.clearAll);
  const [isSignedIn, setIsSignedIn] = React.useState(false);
  const { setOpen: setOpenPricing } = usePricingOffer();
  const { sessionId } = useProfileStore();
  const { logOut } = useApiClient();
  const { setEstimateMinute, setEstimateSecond } = useLoadingAPI();
  const { setPgn, setIsLoading, setError, setDataAnalysis } = usePgnStore();

  const handleStartAnalysis = async () => {
    try {
      // Set loading state immediately
      setIsLoading(true);
      setEstimateMinute(0);
      setEstimateSecond(4);
      setError(null);

      // Navigate to analysis page first
      router.push("/analysis");

      // Load the data in background
      const [resFamousGame, resAnalysis] = await Promise.all([
        fetch("/local-data/famous-game.txt"),
        fetch("/local-data/analysis.json"),
      ]);

      const pgnLocal = await resFamousGame.text();
      const responseAnalysis = await resAnalysis.json();

      setPgn(pgnLocal);
      setDataAnalysis(responseAnalysis);

      // Keep loading for exactly 4 seconds
      setTimeout(() => {
        setIsLoading(false);
      }, 4000);
    } catch (err) {
      setIsLoading(false);
      setError(err instanceof Error ? err : new Error("Failed to fetch PGN"));
    }
  };

  React.useEffect(() => {
    const checkSession = () => {
      if (sessionId.length > 0) {
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
    };

    checkSession();
  }, [sessionId, isSignedIn]);

  const { isMember,isMemberMonthly, token, clearAll: clearProfile } = useProfileStore();
  const { setOpen: setOpenSubscribe, setTabType } = usePricingOffer();

  const handleDashboard = () => {
    router.push("/analysis");
  };

  const handleLogout = async () => {
    clearAll();
    clearProfile(); 
    handleSignOut();
  };

  const handleSignOut = async () => {
    logOut({ sessionId })
      .then(() => {})
      .finally(() => {
        clearAll();
        localStorage.removeItem("sessionId");
        localStorage.removeItem("token");
        localStorage.removeItem("background-analysis-storage");
        localStorage.removeItem("training_schedule");
        localStorage.removeItem("training_topics");
        localStorage.removeItem("pgn-local-storage");
        setPersistedCookie("token", "", 365);
        window.location.href = "/login";
      });
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error logging out:", error.message);
      throw error;
    }
  };

  const handleOpenOffer = (type: string) => {
    setOpenSubscribe(true);
    setTabType(type);
  };

  return (
    <motion.header
      className="sticky z-[200] w-full h-[72px] lg:h-[97px] bg-white"
      style={{ 
        top: "var(--banner-height, 0px)",
        marginTop: "var(--banner-height, 0px)"
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container px-4 md:px-6 lg:px-12 mx-auto w-full h-full">
        <div className="flex items-center justify-between h-full">
          {/* Left: Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/icons/logo.png"
                alt="logo"
                className="w-24 h-8 sm:w-28 sm:h-9 lg:w-36 lg:h-12"
                quality={100}
                width={600}
                height={600}
              />
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <div className="hidden xl:flex justify-center items-center gap-6 flex-1">
            {/* Analyze Button - Outside of NavigationMenu */}
            <div className="group inline-flex h-9 w-max items-center justify-center rounded-[4px] px-3 py-2 text-[14px] --sm font-medium xl:text-[14px] --xs xl:px-2 xl:py-1.5">
              <Button
                onClick={handleStartAnalysis}
                color="primary"
                variant="outlineprimary"
                className="rounded-[8px] h-[57px] p-[16px] bg-[#221AE910]"
              >
                <BarChart2
                  className="mr-2 h-[20px] w-[20px]"
                  color={sessionId.length == 0 ? "#221AE9" : "#000"}
                />
                <span
                  className={`font-normal text-[18px] ${
                    sessionId.length == 0 && `text-[#221AE9]`
                  }`}
                >
                  Analyze Now
                </span>
              </Button>
            </div>

            {/* Navigation Menu - Properly structured */}
            <div className="border border-input rounded-[8px] p-[16px]">
              <NavigationMenu>
                <NavigationMenuList className="group gap-4 flex flex-1 list-none items-center justify-center gap-[40px]">
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/about-us"
                        className={`flex items-center text-[18px] font-medium ${
                          pathname == "/about-us"
                            ? "text-[#221AE9]"
                            : "text-black"
                        } hover:text-[#221AE9]`}
                      >
                        <Info className="mr-2 h-4 w-4" />
                        About
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/faq"
                        className={`flex items-center text-[18px] font-medium ${
                          pathname == "/faq" ? "text-[#221AE9]" : "text-black"
                        } hover:text-[#221AE9]`}
                      >
                        <HelpCircle className="mr-2 h-4 w-4" />
                        FAQ
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <button
                        type="button"
                        onClick={() => setOpenPricing(true)}
                        className={`flex items-center text-[18px] font-medium text-black hover:text-[#221AE9] cursor-pointer ${
                          open && `text-[#221AE9]`
                        }`}
                      >
                        <DollarSign className="mr-2 h-4 w-4" />
                        Pricing
                      </button>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          {/* Right: Mobile Analyze Button + Menu / Desktop Auth Buttons */}
          <div className="flex items-center gap-2">
            {/* Mobile: Analyze Button + Hamburger */}
            <div className="flex xl:hidden items-center gap-2">
              <Button
                onClick={handleStartAnalysis}
                color="primary"
                variant="outlineprimary"
                className="rounded-[6px] h-[40px] px-3 bg-[#221AE910] text-[14px] --sm"
              >
                <BarChart2
                  className="mr-1 h-[16px] w-[16px]"
                  color={sessionId.length == 0 ? "#221AE9" : "#000"}
                />
                <span
                  className={`font-normal text-[14px] ${
                    sessionId.length == 0 && `text-[#221AE9]`
                  }`}
                >
                  Analyze
                </span>
              </Button>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" className="h-9 w-9 p-0">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="pl-0 z-[300]"
                  aria-describedby="mobile-nav-description"
                >
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <div id="mobile-nav-description" className="sr-only">
                    Mobile navigation menu for AroundChess
                  </div>
                  <MobileNav
                    isSignedIn={isSignedIn}
                    handleLogout={handleLogout}
                    handleDashboard={handleDashboard}
                    isMember={isMember || isMemberMonthly}
                    token={token.balance}
                    handleOpenOffer={handleOpenOffer}
                    handleStartAnalysis={handleStartAnalysis} // Pass the same function
                  />
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop: Auth Buttons */}
            <div className="hidden xl:flex items-center gap-2">
              {!isSignedIn ? (
                <div className="flex items-center gap-5">
                  <Link href="/login">
                    <button className="btn-secondary w-[120px] rounded-full border border-gray-300 px-6 py-2 text-[14px] --sm font-medium text-gray-700 ">
                      Sign-In
                    </button>
                  </Link>
                  <Link href="/register">
                    <button className="btn-primary w-[120px] rounded-full bg-primary py-2 px-6 text-[14px] --sm font-medium text-white ">
                      Try Now
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-[16px]">
                  <button
                    onClick={handleDashboard}
                    className="line-clamp-1 btn-primary rounded-full p-[10px] w-[160px] h-[48px] text-[14px] -- font-medium"
                  >
                    My Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="rounded-full p-[10px] bg-[#FD0000] w-[160px] h-[48px] text-[14px] -- font-medium text-white"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {children}
    </motion.header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          href={href || "#"}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-[14px] --sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-[14px] --sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});

ListItem.displayName = "ListItem";

interface mobileProps {
  isSignedIn: any;
  handleLogout: () => void;
  token: number;
  isMember: boolean;
  handleOpenOffer: (type: string) => void;
  handleDashboard: () => void;
  handleStartAnalysis: () => void;
}

function MobileNav(props: mobileProps) {
  const { setOpen: setOpenSubscribe } = usePricingOffer();
  const pathname = usePathname();
  const router = useRouter();
  const { profile, sessionId } = useProfileStore();
  const { username } = usePgnStore();
  const { setOpen: setOpenConfirmLogin } = useConfirmLogin();

  // Full sidebar links (same as main Sidebar component)
  const sidebarLinks = [
    {
      name: "Chess Blogs",
      icon: "/icons/sidebar-news-icon.png",
      iconActive: "/icons/sidebar-news-icon-active.png",
      href: "/chess-news",
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
    }, */
  ];

  const handleNavigation = (href: string, hasPermission: boolean) => {
    if (!props.isSignedIn && !hasPermission) {
      setOpenConfirmLogin(true);
    } else if (href && href !== "#") {
      router.push(href);
    }
  };

  const handleToProfile = () => {
    router.push("/profile");
  };

  // Show simple navigation for non-logged-in users
  if (!props.isSignedIn) {
    return (
      <div className="flex flex-col ml-4 self-center">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/icons/logo.png"
              alt="logo"
              width={199}
              height={64}
              quality={100}
              className="w-[125px] md:w-[199px] h-[40px] md:h-[64px] object-contain"
            />
          </Link>
        </div>
        <div
          onClick={props.handleStartAnalysis}
          className="border border-primary bg-[#221AE910] rounded-md px-4 py-2 sm:py-4 flex items-center justify-center gap-1 text-[14px] --sm sm:text-lg cursor-pointer hover:bg-[#221AE920]"
        >
          <BarChart2 className="mr-2 h-4 w-4" />
          Analyze Now
        </div>
        <div className="flex flex-col w-full border border-input rounded-md py-0.5 px-1 mt-4 gap-4 sm:gap-6 bg-white">
          <Link href="/about-us">
            <div className="text-[14px] --sm sm:text-lg w-full flex flex-row h-9 items-center rounded-md bg-background px-3 py-2 font-medium bg-white xl:text-[14px] --xs xl:px-2 xl:py-1.5 hover:text-[#221AE9]">
              <Info className="mr-2 h-4 w-4" />
              About
            </div>
          </Link>
          <Link href="/faq">
            <div className="text-[14px] --sm sm:text-lg w-full flex flex-row h-9 items-center rounded-md bg-background px-3 py-2 font-medium bg-white xl:text-[14px] --xs xl:px-2 xl:py-1.5 hover:text-[#221AE9]">
              <HelpCircle className="mr-2 h-4 w-4" />
              FAQ
            </div>
          </Link>
          <button onClick={() => setOpenSubscribe(true)}>
            <div className="text-[14px] --sm sm:text-lg w-full flex flex-row h-9 items-center rounded-md bg-background px-3 py-2 font-medium bg-white xl:text-[14px] --xs xl:px-2 xl:py-1.5 hover:text-[#221AE9]">
              <DollarSign className="mr-2 h-4 w-4" />
              Pricing
            </div>
          </button>
        </div>

        <div className="flex flex-1 gap-2 mt-8 w-full">
          <div className="flex flex-col w-full items-center gap-5">
            <Link
              href="/login"
              className="flex sm:h-[56px] items-center justify-center w-full btn-secondary rounded-full border border-gray-300 px-6 py-2 text-[14px] --sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Sign-In
            </Link>
            <Link
              href="/register"
              className="flex sm:h-[56px] items-center justify-center w-full btn-primary rounded-full bg-primary py-2 px-6 text-[14px] --sm font-medium text-white hover:bg-blue-700"
            >
              Try Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Logo Section */}
      <div className="flex h-20 items-center px-6 justify-center border-b">
        <Link href="/" className="flex items-center justify-center">
          <Image
            src="/icons/logo.png"
            alt="logo"
            width={199}
            height={64}
            quality={100}
            className="w-[125px] md:w-[199px] h-[40px] md:h-[64px] object-contain"
          />
        </Link>
      </div>

      {/* Token Section */}
      <div className="flex flex-col justify-center pb-[16px] px-[16px] border-b gap-2">
        <div className="flex flex-row items-center justify-center gap-2">
          <Image
            src="/images/pricing/token-icon.png"
            alt="icon"
            width={20}
            height={20}
            className="w-[20px] h-[20px] object-contain"
          />
          <span className="block lg:text-[16px] text-[#221AE9] font-medium">
            Remaining Tokens:{" "}
            <span
              className={`font-bold ${
                props.token == 0 ? `text-[#FD0000]` : `text-[#221AE9]`
              }`}
            >
              {props.token}
            </span>
          </span>
        </div>
        {!props.isMember && (
          <div className="w-full flex flex-col items-center gap-[8px]">
            <button
              onClick={() => props.handleOpenOffer("tokens")}
              className="block btn-secondary w-full h-[48px] rounded-full border border-gray-300 px-6 py-2 text-[14px] --sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Buy Tokens
            </button>
            <button
              onClick={() => props.handleOpenOffer("subscription")}
              className="block btn-primary w-full h-[48px] rounded-full bg-primary py-2 px-6 text-[14px] --sm font-medium text-white hover:bg-blue-700"
            >
              Go Unlimited
            </button>
          </div>
        )}
        {props.isMember && (
          <div className="relative w-full rounded-[8px] bg-[linear-gradient(to_right,_#25CEDA,_#25CEDA,_#25CEDA,_#25CEDA,_#25CEDA,_#25CEDA,_#B2E8F9)] border border-dashed border-white p-[1px]">
            <div className="flex xl:min-w-[250px] h-[56px] flex-row items-center rounded-[8px] gap-2">
              <Image
                src="/icons/onboarding-popup.png"
                alt="icon"
                width={1000}
                height={1000}
                className="w-[42px] h-[44px] object-contain m-4 mr-0"
              />
              <span className="font-semibold text-[14px] z-10 text-[#17119B]">
                Premium package active!
              </span>
              <div className="absolute right-0 top-0 bottom-1 h-full flex items-center justify-center">
                <Image
                  src="/icons/sparks-member.png"
                  alt="icon"
                  width={1000}
                  height={1000}
                  className="w-[56px] h-[56px] object-cover"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-3 px-2 overflow-y-auto">
        <nav className="space-y-5">
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
                        !props.isSignedIn && !section.permission ? "" : section.href
                      }
                      onClick={() =>
                        handleNavigation(section.href, section.permission)
                      }
                      className={cn(
                        "group flex items-center rounded-lg px-3 py-2 text-[14px] --sm font-medium transition-all duration-200",
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
                          className="h-5 w-5"
                        />
                      </div>
                      <span className="flex-1 font-semibold">{section.name}</span>
                      {!props.isSignedIn && !section.permission && (
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
                        "group flex items-center rounded-lg px-3 py-2 text-[14px] --sm font-medium transition-all duration-200",
                        isActive ? "text-[#221AE9]" : ""
                      )}
                    >
                      <div className="mr-3">
                        <Image
                          width={1000}
                          height={1000}
                          alt={section.name}
                          src={isActive ? section.iconActive : section.icon}
                          className="h-5 w-5"
                        />
                      </div>
                      <span className="flex-1 font-semibold">{section.name}</span>
                    </div>
                  )}

                  {hasChildren && (
                    <div className="ml-6 space-y-2">
                      {section.children.map((child: any) => {
                        const isChildActive = pathname?.includes(child.href);
                        return (
                          <div key={child.href}>
                            <Link
                              onClick={() =>
                                handleNavigation(child.href, child.permission)
                              }
                              href={
                                !props.isSignedIn && !child.permission
                                  ? ""
                                  : child.href
                              }
                              className={cn(
                                "min-h-[52px] group flex items-center justify-between rounded-sm px-3 py-2 text-[14px] --sm font-medium transition-all duration-200",
                                isChildActive
                                  ? "bg-[#221AE910] text-[#221AE9] border-[#221AE9] border-r-4"
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
                                  className="mr-3 h-5 w-5"
                                />
                                <span>{child.name}</span>
                              </div>
                              {!props.isSignedIn &&
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
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Profile Section */}
      <div className="mt-auto border-t border-gray-200 p-4">
        <button
          onClick={handleToProfile}
          className="flex w-full items-center gap-3 h-[80px] rounded-[8px] p-[16px] border border-[#221AE9] bg-[#221AE910]"
        >
          <InitialAvatar
            name={profile?.name != "" ? profile?.name : username}
            size="sm"
          />
          <div className="flex-1 text-left overflow-hidden">
            <p className="font-medium text-[16px] text-[#121212] line-clamp-1">
              {profile?.name != "" ? profile?.name : username}
            </p>
            <p className="font-normal text-[#364152] text-[14px] -- truncate line-clamp-1">
              {profile?.email}
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}