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
import { useClerk, UserButton, useUser } from "@clerk/nextjs";
import {
  BarChart2,
  DollarSign,
  HelpCircle,
  Home,
  Info,
  Menu,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { motion, fadeInUp, staggerContainer } from "@/utils/motion";
import { usePricingOffer } from "@/app/store/pricingOffer";
interface SiteHeaderProps {
  children?: React.ReactNode;
  onSidebarOpen?: () => void;
}

export function SiteHeaderNew({ onSidebarOpen, children }: SiteHeaderProps) {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { signOut } = useClerk();
  const clearAll = usePgnStore((state) => state.clearAll);
  const { isSignedIn } = useUser();
  const [token, setToken] = React.useState(0);
  const [isMember, setIsMember] = React.useState<boolean>(false);
  const { setOpen: setOpenSubscribe, setTabType } = usePricingOffer();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    // Clear Zustand store first
    clearAll();
    localStorage.removeItem("token");
    // Then sign out with Clerk
    await signOut();

    // Optional: redirect to login page or home page
    // window.location.href = '/';
  };
  const handleOpenOffer = (type: string) => {
    setOpenSubscribe(true);
    setTabType(type);
  };
  return (
    <motion.header
      className="sticky top-0 z-20 w-full bg-white py-2"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container px-4 md:px-6 lg:px-12 mx-auto w-full">
        <div className="flex h-16 items-center justify-between">
          <div className="flex md:w-full lg:w-auto items-center gap-2">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/icons/logo.png"
                alt="logo"
                className="w-36 h-12"
                quality={100}
                width={600}
                height={600}
              />
            </Link>
          </div>

          <div className="items-center gap-6">
            <NavigationMenu>
              <NavigationMenuList className="group flex flex-1 list-none items-center justify-center space-x-1 xl:space-x-0.5">
                <NavigationMenuItem className="hidden sm:flex ">
                  <Link href="/analysis" legacyBehavior passHref>
                    <NavigationMenuLink
                      
                      className="group inline-flex h-9 w-max items-center justify-center rounded-xs px-3 py-2 text-sm font-medium transition-colors data-[state=open]:bg-accent/50 xl:text-xs xl:px-2 xl:py-2"
                    >
                      <Button color="primary" variant="outlineprimary">
                        <BarChart2 className="mr-2 h-4 w-4" />
                        Analytics
                      </Button>
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <div className="hidden xl:flex border border-input rounded-md py-0.5 px-1">
                  <NavigationMenuList className="group gap-4 flex flex-1 list-none items-center justify-center space-x-1 xl:space-x-0.5">
                    <NavigationMenuItem>
                      <Link href="/about" legacyBehavior passHref>
                        <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-3 py-2 text-sm font-medium bg-white xl:text-xs xl:px-2 xl:py-1.5">
                          <Info className="mr-2 h-4 w-4" />
                          About
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                      <Link href="/faq" legacyBehavior passHref>
                        <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-3 py-2 text-sm font-medium bg-white xl:text-xs xl:px-2 xl:py-1.5">
                          <HelpCircle className="mr-2 h-4 w-4" />
                          FAQ
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Link href="/pricing" legacyBehavior passHref>
                        <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-3 py-2 text-sm font-medium bg-white xl:text-xs xl:px-2 xl:py-1.5">
                          <DollarSign className="mr-2 h-4 w-4" />
                          Pricing
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </div>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="h-9 w-9 p-0 xl:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="pl-0"
              aria-describedby="mobile-nav-description"
            >
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div id="mobile-nav-description" className="sr-only">
                Mobile navigation menu for AroundChess
              </div>
              <MobileNav
                isSignedIn={isSignedIn}
                handleLogout={handleLogout}
                isMember={isMember}
                token={token}
                handleOpenOffer={handleOpenOffer}
              />
            </SheetContent>
          </Sheet>
          <div className="hidden xl:flex items-center gap-2">
            {!isSignedIn ? (
              <div className="hidden sm:flex items-center gap-5">
                <button className="hidden xl:block btn-secondary w-[120px] rounded-full border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <Link href="/login">Sign-In</Link>
                </button>
                <button className="hidden xl:block btn-primary w-[120px] rounded-full bg-primary py-2 px-6 text-sm font-medium text-white hover:bg-blue-700">
                  Try Now
                </button>
              </div>
            ) : (
              <div className="hidden lg:flex flex-row w-full items-center gap-[8px]">
                <span className="block lg:text-[16px] w-full text-[#221AE9] font-medium">
                  Remaining Tokens:{" "}
                  <span
                    className={`font-bold ${
                      token == 0 ? `text-[#FD0000]` : ``
                    }`}
                  >
                    {token}
                  </span>
                </span>

                {!isMember && (
                  <div className="w-full flex flex-row gap-[8px] ">
                    <button
                      onClick={() => handleOpenOffer("token")}
                      className="hidden xl:block btn-secondary w-[160px] h-[48px] rounded-full border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Buy Tokens
                    </button>
                    <button
                      onClick={() => handleOpenOffer("subscription")}
                      className="hidden xl:block btn-primary w-[160px] h-[48px] rounded-full bg-primary py-2 px-6 text-sm font-medium text-white hover:bg-blue-700"
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
                      className={`flex xl:min-w-[240px] h-[56px] flex-row items-center rounded-[8px] gap-2`}
                    >
                      <Image
                        src={`/icons/onboarding-popup.png`}
                        alt="icon"
                        width={1000}
                        height={1000}
                        className="w-[42px] h-[44px] object-contain m-4 mr-0"
                      />
                      <span className="font-medium text-[14px] z-10 text-black">
                        {"You are on this Package!"}
                      </span>
                      <div className="absolute right-0 top-0 bottom-1 h-full flex items-center justify-center">
                        <Image
                          src={`/icons/sparks-member.png`}
                          alt="icon"
                          width={1000}
                          height={1000}
                          className="w-full h-[56px] object-cover"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
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
}
function MobileNav(props: mobileProps) {
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
      <Link href="/analysis">
        <div className="border border-primary rounded-md px-4 py-2 sm:py-4 flex items-center justify-center gap-1 text-sm sm:text-lg">
          <BarChart2 className="mr-2 h-4 w-4" />
          Analytics
        </div>
      </Link>
      <div className="flex flex-col w-full border border-input rounded-md py-0.5 px-1 mt-4 gap-4 sm:gap-6">
        <Link href="/about" legacyBehavior passHref>
          <div className="text-sm sm:text-lg w-full inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-3 py-2 text-sm font-medium bg-white xl:text-xs xl:px-2 xl:py-1.5">
            <Info className="mr-2 h-4 w-4" />
            About
          </div>
        </Link>
        <Link href="/faq" legacyBehavior passHref>
          <div className="text-sm sm:text-lg w-full inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-3 py-2 text-sm font-medium bg-white xl:text-xs xl:px-2 xl:py-1.5">
            <HelpCircle className="mr-2 h-4 w-4" />
            FAQ
          </div>
        </Link>
        <Link href="/pricing" legacyBehavior passHref>
          <div className="text-sm sm:text-lg w-full inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-3 py-2 text-sm font-medium bg-white xl:text-xs xl:px-2 xl:py-1.5">
            <DollarSign className="mr-2 h-4 w-4" />
            Pricing
          </div>
        </Link>
      </div>

      <div className="flex flex-1 gap-2 mt-8">
        {!props.isSignedIn ? (
          <div className="hidden sm:flex items-center gap-5">
            <button className="hidden xl:block btn-secondary w-[120px] rounded-full border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Link href="/login">Sign-In</Link>
            </button>
            <button className="hidden xl:block btn-primary w-[120px] rounded-full bg-primary py-2 px-6 text-sm font-medium text-white hover:bg-blue-700">
              Try Now
            </button>
          </div>
        ) : (
          <div className="flex flex-col xl:flex-row w-full items-center justify-center gap-[8px]">
            <span className="block lg:text-[16px] w-full text-[#221AE9] font-medium">
              Remaining Tokens:{" "}
              <span
                className={`font-bold ${
                  props.token == 0 ? `text-[#FD0000]` : ``
                }`}
              >
                {props.token}
              </span>
            </span>
            {!props.isMember && (
              <div className="w-full flex flex-col gap-[16px] ">
                <button
                  onClick={() => props.handleOpenOffer("token")}
                  className="block btn-secondary w-full h-[48px] rounded-full border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Buy Tokens
                </button>
                <button
                  onClick={() => props.handleOpenOffer("subscription")}
                  className="block btn-primary w-full h-[48px] rounded-full bg-primary py-2 px-6 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Go Unlimited
                </button>
              </div>
            )}
            {props.isMember && (
              <motion.div
                variants={fadeInUp}
                className={`relative w-full rounded-[8px] bg-[linear-gradient(to_right,_#25CEDA,_#25CEDA,_#25CEDA,_#25CEDA,_#25CEDA,_#25CEDA,_#B2E8F9)] border border-dashed border-white p-[1px]`}
              >
                <div
                  className={`flex xl:min-w-[240px] h-[56px] flex-row items-center rounded-[8px] gap-2`}
                >
                  <Image
                    src={`/icons/onboarding-popup.png`}
                    alt="icon"
                    width={1000}
                    height={1000}
                    className="w-[42px] h-[44px] object-contain m-4 mr-0"
                  />
                  <span className="font-medium text-[14px] z-10 text-black">
                    {"You are on this Package!"}
                  </span>
                  <div className="absolute right-0 top-0 bottom-1 h-full flex items-center justify-center">
                    <Image
                      src={`/icons/sparks-member.png`}
                      alt="icon"
                      width={1000}
                      height={1000}
                      className="w-full h-[56px] object-cover"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
