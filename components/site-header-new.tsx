"use client";

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
import { UserButton, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
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

const navItems = {
  main: [
    { title: "Home", href: "/", icon: Home },
    { title: "About", href: "/about", icon: Info },
    {
      title: "Analysis",
      href: "/analysis",
      icon: BarChart2,
      items: [
        {
          title: "My Statistics",
          href: "/analysis/stats",
          description: "View detailed performance metrics",
        },
        {
          title: "My Game History",
          href: "/analysis/history",
          description: "Browse and analyze your past games",
        },
        {
          title: "My Reports",
          href: "/analysis/reports",
          description: "Get insights into your playing style",
        },
        {
          title: "My Goals",
          href: "/analysis/goals",
          description: "Set and track your chess objectives",
        },
        {
          title: "My Progress",
          href: "/analysis/progress",
          description: "Monitor your rating and improvements",
        },
        {
          title: "My Training",
          href: "/analysis/training",
          description: "Review your training activities",
        },
        {
          title: "Daily Plan",
          href: "/analysis/daily",
          description: "Your personalized daily training",
        },
        {
          title: "Weekly Plan",
          href: "/analysis/weekly",
          description: "Weekly training schedule and goals",
        },
      ],
    },
    { title: "FAQ", href: "/faq", icon: HelpCircle },
    { title: "Pricing", href: "/pricing", icon: DollarSign },
  ],
};

interface SiteHeaderProps {
  children?: React.ReactNode;
  onSidebarOpen?: () => void;
}

export function SiteHeaderNew({ onSidebarOpen, children }: SiteHeaderProps) {
  const [isScrolled, setIsScrolled] = React.useState(false);

  const { isSignedIn } = useUser();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className="sticky top-0 z-50 w-full bg-white py-2"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container px-4 md:px-6 lg:px-8 mx-auto w-full">
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
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-xs bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 xl:text-xs xl:px-2 xl:py-1.5">
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
                        <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 xl:text-xs xl:px-2 xl:py-1.5">
                          <Info className="mr-2 h-4 w-4" />
                          About
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                      <Link href="/faq" legacyBehavior passHref>
                        <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 xl:text-xs xl:px-2 xl:py-1.5">
                          <HelpCircle className="mr-2 h-4 w-4" />
                          FAQ
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Link href="/pricing" legacyBehavior passHref>
                        <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 xl:text-xs xl:px-2 xl:py-1.5">
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
              <MobileNav isSignedIn={isSignedIn} />
            </SheetContent>
          </Sheet>
          <div className="hidden xl:flex items-center gap-2">
            {!isSignedIn ? (
              <div className="hidden sm:flex items-center gap-2">
                <button className="btn-secondary rounded-full w-20 h-8 text-xs px-2 py-1">
                  <Link href="/login">Sign In</Link>
                </button>
                <button className="btn-primary rounded-full w-20 text-xs px-2 py-1">
                  <Link href="/register">Try Now</Link>
                </button>
              </div>
            ) : (
              <UserButton showName={true} />
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

function MobileNav(props: { isSignedIn: any }) {
  return (
    <div className="flex flex-col min-h-[100dvh] max-w-[240px] sm:max-w-[372px] self-center px-4">
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
      <div className="border border-primary rounded-sm px-4 py-2 sm:py-3 flex items-center gap-1 text-sm sm:text-lg">
        <BarChart2 className="mr-2 h-4 w-4" />
        Analytics
      </div>
      <div className="flex flex-col w-full border border-input rounded-md py-0.5 px-1 mt-4 gap-4 sm:gap-6">
        <Link href="/about" legacyBehavior passHref>
          <div className="text-sm sm:text-lg w-full inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 xl:text-xs xl:px-2 xl:py-1.5">
            <Info className="mr-2 h-4 w-4" />
            About
          </div>
        </Link>
        <Link href="/faq" legacyBehavior passHref>
          <div className="text-sm sm:text-lg w-full inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 xl:text-xs xl:px-2 xl:py-1.5">
            <HelpCircle className="mr-2 h-4 w-4" />
            FAQ
          </div>
        </Link>
        <Link href="/pricing" legacyBehavior passHref>
          <div className="text-sm sm:text-lg w-full inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 xl:text-xs xl:px-2 xl:py-1.5">
            <DollarSign className="mr-2 h-4 w-4" />
            Pricing
          </div>
        </Link>
      </div>

      <div className="flex flex-1 gap-2 mt-8">
        {!props.isSignedIn ? (
          <div className="sm:flex sm:flex-col w-full items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="mb-2 w-full h-8 sm:h-12 text-xs px-2 py-1"
            >
              <Link href="/login">Sign In</Link>
            </Button>
            <Button
              size="sm"
              variant="default"
              asChild
              className="w-full text-xs h-8 sm:h-12 px-2 py-1"
            >
              <Link href="/register">Try Now</Link>
            </Button>
          </div>
        ) : (
          <UserButton showName={true} />
        )}
      </div>
    </div>
  );
}
function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
