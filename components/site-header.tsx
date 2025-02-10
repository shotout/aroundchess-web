"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { LayoutDashboard, Menu, X, Home, Info, GraduationCap, Dumbbell, BarChart2, Gamepad2, DollarSign, Mail, Zap } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { UserButton, useUser } from "@clerk/nextjs"

const navItems = {
  main: [
    { title: "Home", href: "/", icon: Home },
    { title: "About", href: "/about", icon: Info },
    { title: "Learn", href: "/learn", icon: GraduationCap, items: [
      { title: "Chess Fundamentals", href: "/learn/chess-fundamentals", description: "Master the basic principles and rules of chess" },
      { title: "Opening Principles", href: "/learn/opening-principles", description: "Study and understand key opening strategies" },
      { title: "Middle Game Strategies", href: "/learn/middle-game-stragegies", description: "Develop your tactical and positional play" },
      { title: "Endgame Basics", href: "/learn/endgame-basics", description: "Learn essential endgame techniques" },
      { title: "Chess Tactics", href: "/learn/chess-tactics", description: "Improve your tactical vision and calculation" },
      { title: "Positional Play", href: "/learn/positional-play", description: "Understand strategic concepts and planning" },
      { title: "Famous Games", href: "/learn/famous-games", description: "Study classic games from chess masters" },
      { title: "Chess History", href: "/learn/history", description: "Explore the rich history of chess" },
    ]},
    { title: "Practice", href: "/practice", icon: Dumbbell, items: [
      { title: "Training Hub", href: "/practice/hub", description: "Your personalized training dashboard" },
      { title: "Tactics Arena", href: "/practice/tactics", description: "Solve tactical puzzles and challenges" },
      { title: "Opening Laboratory", href: "/practice/openings", description: "Build and test your opening repertoire" },
      { title: "Endgame Academy", href: "/practice/endgame", description: "Master essential endgame positions" },
      { title: "Play vs AI", href: "/practice/ai", description: "Challenge our advanced chess engine" },
      { title: "Advanced Training", href: "/practice/advanced", description: "Complex exercises for experienced players" },
      { title: "Training Settings", href: "/practice/settings", description: "Customize your training experience" },
      { title: "Training Progress", href: "/practice/progress", description: "Track your improvement over time" },
      { title: "Import Game", href: "/practice/import", description: "Analyze your own chess games" },
    ]},
    { title: "Analysis", href: "/analysis", icon: BarChart2, items: [
      { title: "My Statistics", href: "/analysis/stats", description: "View detailed performance metrics" },
      { title: "My Game History", href: "/analysis/history", description: "Browse and analyze your past games" },
      { title: "My Reports", href: "/analysis/reports", description: "Get insights into your playing style" },
      { title: "My Goals", href: "/analysis/goals", description: "Set and track your chess objectives" },
      { title: "My Progress", href: "/analysis/progress", description: "Monitor your rating and improvements" },
      { title: "My Training", href: "/analysis/training", description: "Review your training activities" },
      { title: "Daily Plan", href: "/analysis/daily", description: "Your personalized daily training" },
      { title: "Weekly Plan", href: "/analysis/weekly", description: "Weekly training schedule and goals" },
    ]},
    { title: "Playground", href: "/playground", icon: Gamepad2 },
    { title: "Pricing", href: "/pricing", icon: DollarSign },
    { title: "Contact", href: "/contact", icon: Mail },
  ],
}

interface SiteHeaderProps {
  children?: React.ReactNode
  onSidebarOpen?: () => void
}

export function SiteHeader({ onSidebarOpen, children }: SiteHeaderProps) {
  const [isScrolled, setIsScrolled] = React.useState(false)

  const {isSignedIn} = useUser()

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      className="sticky top-0 z-50 w-full bg-background border-b border-border"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container px-4 md:px-6 lg:px-8 mx-auto max-w-7xl">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            {/* <Button
              variant="ghost"
              size="icon"
              className="xl:hidden"
              onClick={onSidebarOpen}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open sidebar</span>
            </Button> */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-9 w-9 p-0 xl:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0" aria-describedby="mobile-nav-description">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div id="mobile-nav-description" className="sr-only">
                  Mobile navigation menu for AroundChess
                </div>
                <MobileNav />
              </SheetContent>
            </Sheet>
            <Link href="/" className="flex items-center space-x-2">
              <Zap className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">aroundchess</span>
            </Link>
          </div>

          <div className="hidden xl:flex items-center gap-6">
            <NavigationMenu>
              <NavigationMenuList className="group flex flex-1 list-none items-center justify-center space-x-1 xl:space-x-0.5">
                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 xl:text-xs xl:px-2 xl:py-1.5">
                      <Home className="mr-2 h-4 w-4" />
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/about" legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 xl:text-xs xl:px-2 xl:py-1.5">
                    <Info className="mr-2 h-4 w-4" />
                    About
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Learn
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {navItems.main.find(item => item.title === "Learn")?.items?.map((item) => (
                        <ListItem
                          key={item.href}
                          title={item.title}
                          href={item.href}
                        >
                          {item.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <Dumbbell className="mr-2 h-4 w-4" />
                    Practice
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {navItems.main.find(item => item.title === "Practice")?.items?.map((item) => (
                        <ListItem
                          key={item.href}
                          title={item.title}
                          href={item.href}
                        >
                          {item.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <BarChart2 className="mr-2 h-4 w-4" />
                    Analysis
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {navItems.main.find(item => item.title === "Analysis")?.items?.map((item) => (
                        <ListItem
                          key={item.href}
                          title={item.title}
                          href={item.href}
                        >
                          {item.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/playground" legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 xl:text-xs xl:px-2 xl:py-1.5">
                      <Gamepad2 className="mr-2 h-4 w-4" />
                      Playground
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

                <NavigationMenuItem>
                  <Link href="/contact" legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 xl:text-xs xl:px-2 xl:py-1.5">
                      <Mail className="mr-2 h-4 w-4" />
                      Contact
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-2">

            

            {!isSignedIn ? (
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild className="text-xs px-2 py-1">
                  <Link href="/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild className="text-xs px-2 py-1">
                <Link href="/register">Try Now</Link>
              </Button>
            </div>
              ) : (<UserButton showName={true} />)
            }
          </div>
        </div>
      </div>
      {children}
    </motion.header>
  )
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
  )
})
ListItem.displayName = "ListItem"

function MobileNav() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="flex items-center gap-3">
          <LayoutDashboard className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl text-primary">aroundchess</span>
        </Link>
        {/* <SheetClose className="rounded-full w-8 h-8 flex items-center justify-center hover:bg-muted">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </SheetClose> */}
      </div>

      <nav className="flex-1">
        <div className="space-y-4">
          {navItems.main.map((item) => (
            <React.Fragment key={item.title}>
              {item.items ? (
                <details className="group">
                  <summary className="flex items-center py-2 text-base font-medium cursor-pointer list-none">
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span className="text-lg">{item.title}</span>
                    </div>
                  </summary>
                  <ul className="mt-2 space-y-2">
                    {item.items.map((subItem) => (
                      <li key={subItem.href}>
                        <Link
                          href={subItem.href}
                          className="flex py-2 text-base text-muted-foreground hover:text-primary ml-8"
                        >
                          {subItem.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              ) : (
                <Link
                  href={item.href}
                  className="flex items-center gap-3 py-2 text-lg font-medium hover:text-primary"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              )}
            </React.Fragment>
          ))}
        </div>
      </nav>

      <div className="mt-auto pt-4 space-y-4">
        <Link href="/login" className="block w-full text-center py-3 text-lg">
          Sign In
        </Link>
        <Link 
          href="/register" 
          className="block w-full text-center py-3 text-lg bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Try Now
        </Link>
      </div>
    </div>
  )
}
function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
