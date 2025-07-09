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

  const fetchPgnFamousGame = async () => {
    let arr = null;
    try {
      setEstimateSecond(5);
      setEstimateMinute(0);
      setIsLoading(true);
      const resFamousGame = await fetch("/local-data/famous-game.txt");
      const pgnLocal = await resFamousGame.text();
      setPgn(pgnLocal);
      const resAnalysis = await fetch("/local-data/analysis.json");
      const responseAnalysis = await resAnalysis.json();

      setDataAnalysis(responseAnalysis);
      arr = responseAnalysis;
      setError(null);
    } catch (err) {
      router.push("/");
      setIsLoading(false);
      setError(err instanceof Error ? err : new Error("Failed to fetch PGN"));
    } finally {
      if (arr != null) {
        setTimeout(() => {
          router.push("/analysis");
        }, 4000);
      } else {
        setIsLoading(false);
      }
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

  const { isMember, token, clearAll: clearProfile } = useProfileStore();
  const { setOpen: setOpenSubscribe, setTabType } = usePricingOffer();

  const handleDashboard = () => {
    router.push("/analysis");
  };

  const handleLogout = async () => {
    clearAll();
    clearProfile();
    localStorage.removeItem("token");
    handleSignOut();
  };

  const handleSignOut = async () => {
    logOut({ sessionId })
      .then(() => {})
      .finally(() => {
        clearAll();
        localStorage.removeItem("token");
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
      className="sticky top-0 z-[200] w-full h-[72px] lg:h-[97px] bg-white"
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
            <div className="group inline-flex h-9 w-max items-center justify-center rounded-[4px] px-3 py-2 text-sm font-medium xl:text-xs xl:px-2 xl:py-1.5">
              <Button
                onClick={fetchPgnFamousGame}
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
                onClick={fetchPgnFamousGame}
                color="primary"
                variant="outlineprimary"
                className="rounded-[6px] h-[40px] px-3 bg-[#221AE910] text-sm"
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
                    isMember={isMember}
                    token={token.balance}
                    handleOpenOffer={handleOpenOffer}
                  />
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop: Auth Buttons */}
            <div className="hidden xl:flex items-center gap-2">
              {!isSignedIn ? (
                <div className="flex items-center gap-5">
                  <Link href="/login">
                    <button className="btn-secondary w-[120px] rounded-full border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 ">
                      Sign-In
                    </button>
                  </Link>
                  <Link href="/register">
                    <button className="btn-primary w-[120px] rounded-full bg-primary py-2 px-6 text-sm font-medium text-white ">
                      Try Now
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-[16px]">
                  <button
                    onClick={handleDashboard}
                    className="line-clamp-1 btn-primary rounded-full p-[10px] w-[160px] h-[48px] text-[12px] font-medium"
                  >
                    My Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="rounded-full p-[10px] bg-[#FD0000] w-[160px] h-[48px] text-[12px] font-medium text-white"
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
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
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
}

function MobileNav(props: mobileProps) {
  const { setEstimateMinute, setEstimateSecond } = useLoadingAPI();
  const router = useRouter();
  const { setPgn, setIsLoading, setError, setDataAnalysis } = usePgnStore();

  const fetchPgnFamousGame = async () => {
    let arr = null;
    try {
      setEstimateSecond(5);
      setEstimateMinute(0);
      setIsLoading(true);
      const resFamousGame = await fetch("/local-data/famous-game.txt");
      const pgnLocal = await resFamousGame.text();
      setPgn(pgnLocal);
      const resAnalysis = await fetch("/local-data/analysis.json");
      const responseAnalysis = await resAnalysis.json();

      setDataAnalysis(responseAnalysis);
      arr = responseAnalysis;
      setError(null);
    } catch (err) {
      router.push("/");
      setIsLoading(false);
      setError(err instanceof Error ? err : new Error("Failed to fetch PGN"));
    } finally {
      if (arr != null) {
        setTimeout(() => {
          router.push("/analysis");
        }, 4000);
      } else {
        setIsLoading(false);
      }
    }
  };

  const { setOpen: setOpenSubscribe, setTabType } = usePricingOffer();

  return (
    <div className="flex flex-col ml-4 self-center ">
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/icons/logo.png"
            alt="logo"
            className="w-36 h-12"
            quality={100}
            width={100}
            height={100}
          />
        </Link>
      </div>
      <div
        onClick={fetchPgnFamousGame}
        className="border border-primary bg-[#221AE910] rounded-md px-4 py-2 sm:py-4 flex items-center justify-center gap-1 text-sm sm:text-lg"
      >
        <BarChart2 className="mr-2 h-4 w-4" />
        Analyze Now
      </div>
      <div className="flex flex-col w-full border border-input rounded-md py-0.5 px-1 mt-4 gap-4 sm:gap-6 bg-white ">
        <Link href="/about-us">
          <div className="text-sm sm:text-lg w-full flex flex-row h-9 items-center rounded-md bg-background px-3 py-2 font-medium bg-white xl:text-xs xl:px-2 xl:py-1.5 hover:text-[#221AE9]">
            <Info className="mr-2 h-4 w-4" />
            About
          </div>
        </Link>
        <Link href="/faq">
          <div className="text-sm sm:text-lg w-full flex flex-row h-9 items-center rounded-md bg-background px-3 py-2 font-medium bg-white xl:text-xs xl:px-2 xl:py-1.5 hover:text-[#221AE9]">
            <HelpCircle className="mr-2 h-4 w-4" />
            FAQ
          </div>
        </Link>
        <button onClick={() => setOpenSubscribe(true)}>
          <div className="text-sm sm:text-lg w-full flex flex-row h-9 items-center rounded-md bg-background px-3 py-2 font-medium bg-white xl:text-xs xl:px-2 xl:py-1.5 hover:text-[#221AE9]">
            <DollarSign className="mr-2 h-4 w-4" />
            Pricing
          </div>
        </button>
      </div>

      <div className="flex flex-1 gap-2 mt-8 w-full">
        {props.isSignedIn == false ? (
          <div className="flex flex-col w-full items-center gap-5">
            <Link
              href="/login"
              className="flex sm:h-[56px] items-center justify-center w-full btn-secondary rounded-full border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Sign-In
            </Link>
            <Link
              href="/register"
              className="flex sm:h-[56px] items-center justify-center w-full btn-primary rounded-full bg-primary py-2 px-6 text-sm font-medium text-white hover:bg-blue-700"
            >
              Try Now
            </Link>
          </div>
        ) : (
          <div className="flex flex-col xl:flex-row w-full items-center justify-center gap-[16px]">
            <button
              onClick={props.handleDashboard}
              className="btn-primary rounded-full w-full h-[48px] text-[16px] font-medium"
            >
              My Dashboard
            </button>
            <button
              onClick={props.handleLogout}
              className="rounded-full bg-[#FD0000] w-full h-[48px] text-[16px] font-medium text-white"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
