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

  useEffect(() => {
    const checkIfDesktop = () => {
      setIsDesktop(window.innerWidth >= 1280);
    };

    checkIfDesktop();

    window.addEventListener("resize", checkIfDesktop);
    return () => window.removeEventListener("resize", checkIfDesktop);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex lg:h-24 h-[72px] w-full items-center justify-between bg-white px-6 border-b">
      <div className="flex items-center">
        <Image
          src="/logo.png"
          alt="Logo"
          width={120}
          height={30}
          className="lg:hidden"
        />

        <div className="hidden xl:flex space-x-2">
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

      <div className="flex items-center space-x-4">
        <button className="hidden xl:block rounded-md border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Sign-in
        </button>

        <button className="hidden xl:block rounded-md bg-blue-600 py-2 px-6 text-sm font-medium text-white hover:bg-blue-700">
          Try Now
        </button>

        {!isDesktop && (
          <div className="flex items-center space-x-3">
            <button className="hidden md:flex xl:hidden items-center border rounded-md border-gray-200 px-4 py-2 bg-gray-50 text-sm font-medium text-gray-900 hover:border-blue-600">
              <BarChart2 className="h-4 w-4 mr-2" />
              Analytics
            </button>

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
