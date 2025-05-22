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
import { usePathname } from "next/navigation";
import { motion, fadeInUp } from "@/utils/motion";
import { usePricingOffer } from "@/app/store/pricingOffer";
import { useProfileStore } from "@/app/store/profile";
import { useUserStore } from "@/app/training-plan/store";
import { useApiClient } from "@/functions/api-client";

interface HeaderProps {
  onSidebarToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSidebarToggle }) => {
  const pathname = usePathname();
  const [isDesktop, setIsDesktop] = useState(false);
  const { setOpen: setOpenSubscribe, setTabType } = usePricingOffer();
  const { token: tokenBalance, isMember } = useProfileStore();
  const { isLoading } = useApiClient();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const { sessionId } = useProfileStore();
  const { profile } = useUserStore();

  useEffect(() => {
    if (!sessionId) return;
    setIsSignedIn(true);
  }, [sessionId]);

  useEffect(() => {
    const checkIfDesktop = () => {
      setIsDesktop(window.innerWidth >= 1280);
    };

    checkIfDesktop();

    window.addEventListener("resize", checkIfDesktop);
    return () => window.removeEventListener("resize", checkIfDesktop);
  }, []);
  const handleOpenOffer = (type: string) => {
    setOpenSubscribe(true);
    setTabType(type);
  };
  return (
    <header className="fixed xl:sticky top-0 z-100 flex w-full items-center justify-between bg-white px-3 lg:px-6 border-b h-[72px] lg:h-[97px]">
      {/* Left section - Logo and navigation (on desktop only) */}
      <div className="flex items-center h-[70px] lg:h-[100px]">
        {/* Logo/Title - Always visible */}
        <div className="xl:hidden">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/icons/logo.png"
              alt="logo"
              // className="w-28 h-28 object-contain"
              quality={100}
              width={90}
              height={90}
            />
          </Link>
        </div>

        {/* Navigation tabs - visible on desktop only (xl+) */}
        <div className="hidden xl:flex xl:items-center space-x-2">
          <div className="group inline-flex h-9 w-max items-center justify-center rounded-[4px] px-3 py-2 text-sm font-medium xl:text-xs xl:px-2 xl:py-1.5">
            <Link href={"/analysis"}>
              <Button
                color="primary"
                variant="outlineprimary"
                className="rounded-[8px] h-[57px] p-[16px] bg-[#221AE910]"
              >
                <BarChart2 className="mr-2 h-[20px] w-[20px]" />
                <span className="font-normal text-[18px]">Analytics</span>
              </Button>
            </Link>
          </div>
          {/* Grouped navigation tabs */}
          <div className="flex flex-row items-center rounded-[8px] border border-gray-200 w-[348px] h-[57px] overflow-hidden p-[16px] gap-[40px]">
            <Link href={"/about-us"}>
              <button
                className={`flex items-center text-[18px] font-medium ${
                  pathname == "/about-us" ? "text-[#221AE9]" : "text-black"
                } hover:bg-gray-50`}
              >
                <InfoIcon
                  className="h-[20px] w-[20px] mr-2"
                  color={pathname == "/about-us" ? "#221AE9" : "black"}
                />
                About
              </button>
            </Link>
            <Link href="/faq" legacyBehavior passHref>
              <button
                className={`flex items-center text-[18px] font-medium ${
                  pathname == "/faq" ? "text-[#221AE9]" : "text-black"
                } hover:bg-gray-50`}
              >
                <HelpCircle className="h-[20px] w-[20px] mr-2" />
                FAQ
              </button>
            </Link>
            <button
              onClick={() => handleOpenOffer("subscription")}
              className="flex items-center text-[18px] font-medium text-black hover:bg-gray-50"
            >
              <DollarSign className="h-[20px] w-[20px] mr-2" />
              Pricing
            </button>
          </div>
        </div>
      </div>

      {/* Mobile-only "hello" h1 when on training-plan page */}
      {pathname === "/training-plan" && !isDesktop && (
        <div className="flex justify-center items-center flex-col">
          <h1 className="xl:hidden text-base font-bold">My Training Plan</h1>
          <p className="xl:hidden text-xs text-gray-500">
            ({profile?.username || "User"})
          </p>
        </div>
      )}

      {/* Right section - Auth buttons (desktop) or Analytics + hamburger (tablet/mobile) */}
      {!isLoading && (isMember != null || isSignedIn != null) && (
        <div className="flex items-center space-x-4">
          {/* Auth buttons - visible on desktop only (xl+) */}

          {!isSignedIn ? (
            <div className="hidden sm:flex items-center gap-5">
              <Link href="/login">
                <button className="hidden xl:block btn-secondary w-[120px] rounded-full border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Sign-In
                </button>
              </Link>
              <Link href="/register">
                <button className="hidden xl:block btn-primary w-[120px] rounded-full bg-primary py-2 px-6 text-sm font-medium text-white hover:bg-blue-700">
                  Try Now
                </button>
              </Link>
            </div>
          ) : (
            <div className="hidden lg:flex flex-row w-full items-center gap-[8px]">
              <span className="hidden xl:block lg:text-[16px] w-full text-[#221AE9] font-medium">
                Remaining Tokens:{" "}
                <span
                  className={`font-bold ${
                    tokenBalance.balance == 0
                      ? `text-[#FD0000]`
                      : `text-[#221AE9]`
                  }`}
                >
                  {tokenBalance.balance}
                </span>
              </span>
              {/* {isLoading && <DotSpinner />} */}
              {!isMember && (
                <div className="w-full flex flex-row gap-[8px] ">
                  <button
                    onClick={() => handleOpenOffer("tokens")}
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
                  className={`hidden xl:block relative w-full rounded-[8px] bg-[linear-gradient(to_right,_#25CEDA,_#25CEDA,_#25CEDA,_#25CEDA,_#25CEDA,_#25CEDA,_#B2E8F9)] border border-dashed border-white p-[1px]`}
                >
                  <div
                    className={`flex min-w-[240px] xl:min-w-[250px] h-[56px] flex-row items-center rounded-[8px] gap-2`}
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
          )}

          {/* Tablet view - Analytics button next to hamburger */}
          {!isDesktop && (
            <div className="flex items-center space-x-3 w-full">
              {isSignedIn && (
                <div className="hidden sm:flex flex-row w-full ">
                  <span className="lg:text-[16px] text-[#221AE9] font-medium">
                    Tokens:&nbsp;
                  </span>
                  <span
                    className={`font-bold ${
                      tokenBalance.balance == 0
                        ? `text-[#FD0000]`
                        : `text-[#221AE9]`
                    }`}
                  >
                    {tokenBalance.balance}
                  </span>
                </div>
              )}

              {!isMember && (
                <Button
                  color="primary"
                  variant="outlineprimary"
                  className=" rounded-[8px] h-[57px] p-[16px] bg-[#221AE910]"
                >
                  <BarChart2 className="mr-2 h-[20px] w-[20px]" />
                  <span className="font-normal text-[14px] lg:text-[18px]">
                    Analytics
                  </span>
                </Button>
              )}
              {/* Analytics button - visible on tablet */}
              {isMember && (
                <motion.div
                  variants={fadeInUp}
                  className={`hidden sm:block relative w-full rounded-[8px] bg-[linear-gradient(to_right,_#25CEDA,_#25CEDA,_#25CEDA,_#25CEDA,_#25CEDA,_#25CEDA,_#B2E8F9)] border border-dashed border-white p-[1px]`}
                >
                  <div
                    className={`flex min-w-[280px] xl:min-w-[250px] h-[56px] flex-row items-center rounded-[8px] gap-2`}
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
              {/* Hamburger menu */}
              {sessionId.length > 0 && (
                <button
                  type="button"
                  className="text-gray-700 hover:text-blue-600 focus:outline-none"
                  onClick={onSidebarToggle}
                  aria-label="Toggle sidebar"
                >
                  <Menu className="h-6 w-6" />
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
