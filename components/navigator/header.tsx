"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart2,
  Menu,
  InfoIcon,
  HelpCircle,
  DollarSign,
} from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";

interface HeaderProps {
  onSidebarToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSidebarToggle }) => {
  const [isDesktop, setIsDesktop] = useState(false);

  // Check if desktop on initial load and when window resizes
  useEffect(() => {
    const checkIfDesktop = () => {
      setIsDesktop(window.innerWidth >= 1280);
    };

    // Set initial state
    checkIfDesktop();

    // Add event listener
    window.addEventListener("resize", checkIfDesktop);
    return () => window.removeEventListener("resize", checkIfDesktop);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex w-full items-center justify-between bg-white px-6 border-b">
      {/* Left section - Logo and navigation (on desktop only) */}
      <div className="flex items-center h-24">
        {/* Logo/Title - Always visible */}
        <div className="mr-6 lg:hidden">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/icons/logo.png"
              alt="logo"
              className="w-40 h-7"
              quality={100}
              width={1000}
              height={1000}
            />
          </Link>
        </div>

        {/* Navigation tabs - visible on desktop only (xl+) */}
        <div className="hidden xl:flex xl:items-center space-x-2">
          <div className="group inline-flex h-9 w-max items-center justify-center rounded-[4px] bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 xl:text-xs xl:px-2 xl:py-1.5">
            <Button
              color="primary"
              variant="outlineprimary"
              className="rounded-[8px]"
            >
              <BarChart2 className="mr-2 h-4 w-4" />
              Analytics
            </Button>
          </div>
          {/* Grouped navigation tabs */}
          <div className="flex rounded-[8px] border border-gray-200 overflow-hidden p-1">
            <button className="flex items-center px-4 py-2 text-sm font-medium text-black hover:bg-gray-50">
              <InfoIcon className="h-4 w-4 mr-2" />
              About
            </button>
            <button className="flex items-center px-4 py-2 text-sm font-medium text-black hover:bg-gray-50">
              <HelpCircle className="h-4 w-4 mr-2" />
              FAQ
            </button>
            <button className="flex items-center px-4 py-2 text-sm font-medium text-black hover:bg-gray-50">
              <DollarSign className="h-4 w-4 mr-2" />
              Pricing
            </button>
          </div>
        </div>
      </div>

      {/* Right section - Auth buttons (desktop) or Analytics + hamburger (tablet/mobile) */}
      <div className="flex items-center space-x-4">
        {/* Auth buttons - visible on desktop only (xl+) */}
        <button className="hidden xl:block rounded-md border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Sign-in
        </button>

        <button className="hidden xl:block rounded-md bg-primary py-4 px-6 text-sm font-medium text-white hover:bg-blue-700">
          Try Now
        </button>

        {/* Tablet view - Analytics button next to hamburger */}
        {!isDesktop && (
          <div className="flex items-center space-x-3">
            {/* Analytics button - visible on tablet */}
            <button className="hidden md:flex xl:hidden items-center border rounded-[8px] border-input px-4 py-2 bg-gray-50 text-sm font-medium text-black hover:border-blue-600">
              <BarChart2 className="h-4 w-4 mr-2" />
              Analytics
            </button>

            {/* Hamburger menu */}
            <button
              type="button"
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
              onClick={onSidebarToggle}
              aria-label="Toggle sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
