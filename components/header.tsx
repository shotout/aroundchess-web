"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart2,
  Menu,
  InfoIcon,
  HelpCircle,
  DollarSign,
} from "lucide-react";
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
    <header className="sticky top-0 z-30 flex lg:h-24 h-[72px] w-full items-center justify-between bg-white px-6 border-b">
      {/* Left section - Logo and navigation (on desktop only) */}
      <div className="flex items-center">
        {/* Logo/Title - Always visible */}
        {/* <img className="text-xl font-semibold text-gray-900 mr-6 lg:hidden " /> */}
        <Image
          src="/logo.png"
          alt="Logo"
          width={120}
          height={30}
          className="lg:hidden"
        />

        {/* Navigation tabs - visible on desktop only (xl+) */}
        <div className="hidden xl:flex space-x-2">
          {/* Grouped navigation tabs */}
          <div className="flex rounded-md border border-gray-200 overflow-hidden p-1">
            <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50">
              <InfoIcon className="h-4 w-4 mr-2" />
              About
            </button>
            <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50">
              <HelpCircle className="h-4 w-4 mr-2" />
              FAQ
            </button>
            <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50">
              <DollarSign className="h-4 w-4 mr-2" />
              Pricing
            </button>
          </div>
        </div>
      </div>

      {/* Right section - Auth buttons (desktop) or Analytics + hamburger (tablet/mobile) */}
      <div className="flex items-center space-x-4">
        {/* Auth buttons - visible on desktop only (xl+) */}
        <button className="hidden xl:block rounded-md border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Sign-in
        </button>

        <button className="hidden xl:block rounded-md bg-blue-600 py-2 px-6 text-sm font-medium text-white hover:bg-blue-700">
          Try Now
        </button>

        {/* Tablet view - Analytics button next to hamburger */}
        {!isDesktop && (
          <div className="flex items-center space-x-3">
            {/* Analytics button - visible on tablet */}
            <button className="hidden md:flex xl:hidden items-center border rounded-md border-gray-200 px-4 py-2 bg-gray-50 text-sm font-medium text-gray-900 hover:border-blue-600">
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
