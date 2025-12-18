"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  BarChart2,
  Menu,
  InfoIcon,
  HelpCircle,
  DollarSign,
} from "lucide-react";

import { Button } from "../ui/button";
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
  const { token: tokenBalance, isMember, isMemberMonthly, sessionId } = useProfileStore();
  const { profile, fetchUserProfile } = useUserStore();
  const { isLoading } = useApiClient();

  const isSignedIn = sessionId.length > 0;
  const isGuestMode = !isSignedIn;
  const isEndgameTraining = pathname?.includes("endgame-training");

  useEffect(() => {
    const checkIfDesktop = () => {
      setIsDesktop(window.innerWidth >= 1280);
    };

    checkIfDesktop();
    window.addEventListener("resize", checkIfDesktop);
    return () => window.removeEventListener("resize", checkIfDesktop);
  }, []);

  // Fetch user profile when sessionId is available
  useEffect(() => {
    if (sessionId && sessionId.length > 0) {
      fetchUserProfile(sessionId);
    }
  }, [sessionId, fetchUserProfile]);

  const handleOpenOffer = (type: string) => {
    setOpenSubscribe(true);
    setTabType(type);
  };

  const handleSidebarToggle = () => {
    onSidebarToggle();
  };

  const NavigationTabs = () => (
    <div className="hidden xl:flex xl:items-center space-x-2">
      {/* Analytics/Analyze Now button */}
      <div className="group inline-flex h-9 w-max items-center justify-center rounded-[4px] px-3 py-2 text-[14px] --sm font-medium xl:text-[14px] --xs xl:px-2 xl:py-1.5">
        <Link href="/analysis">
          <Button
            color="primary"
            variant="outlineprimary"
            className="rounded-[8px] h-[57px] p-[16px] bg-[#221AE910]"
          >
            <BarChart2
              className="mr-2 h-[20px] w-[20px]"
              color={isGuestMode ? "#221AE9" : "#000"}
            />
            <span
              className={`font-normal text-[18px] ${
                isGuestMode ? "text-[#221AE9]" : ""
              }`}
            >
              {isSignedIn ? "Analytics" : "Analyze Now"}
            </span>
          </Button>
        </Link>
      </div>

      {/* Navigation menu */}
      <div className="flex flex-row items-center rounded-[8px] border border-gray-200 w-[348px] h-[57px] overflow-hidden p-[16px] gap-[40px]">
        <Link href="/about-us">
          <button
            className={`flex items-center text-[18px] font-medium ${
              pathname === "/about-us" ? "text-[#221AE9]" : "text-black"
            } hover:bg-gray-50`}
          >
            <InfoIcon
              className="h-[20px] w-[20px] mr-2"
              color={pathname === "/about-us" ? "#221AE9" : "black"}
            />
            About
          </button>
        </Link>

        <Link href="/faq">
          <button
            className={`flex items-center text-[18px] font-medium ${
              pathname === "/faq" ? "text-[#221AE9]" : "text-black"
            } hover:bg-gray-50`}
          >
            <HelpCircle
              className="h-[20px] w-[20px] mr-2"
              color={pathname === "/faq" ? "#221AE9" : "black"}
            />
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
  );

  const AuthButtons = () => (
    <div className="hidden sm:flex items-center gap-5">
      <Link href="/login">
        <button className="hidden xl:block btn-secondary w-[120px] rounded-full border border-gray-300 px-6 py-2 text-[14px] --sm font-medium text-gray-700 hover:bg-gray-50">
          Sign-In
        </button>
      </Link>
      <Link href="/register">
        <button className="hidden xl:block btn-primary w-[120px] rounded-full bg-primary py-2 px-6 text-[14px] --sm font-medium text-white hover:bg-blue-700">
          Try Now
        </button>
      </Link>
    </div>
  );

  const SignedInUserUI = () => (
    <div className="hidden lg:flex flex-row w-full items-center gap-[8px]">
      <span className="hidden xl:flex gap-[4px] lg:text-[16px] w-full text-[#221AE9] font-medium">
        <Image
          src="/images/pricing/token-icon.png"
          alt="icon"
          width={20}
          height={20}
          className="w-[20px] h-[20px] object-contain"
        />
        Remaining Tokens:{" "}
        <span
          className={`font-bold ${
            tokenBalance.balance <= 0 ? "text-[#FD0000]" : "text-[#221AE9]"
          }`}
        >
          {tokenBalance.balance < 0 ? 0 : tokenBalance.balance}
        </span>
      </span>

      {(!isMember&&!isMemberMonthly) && (
        <div className="w-full flex flex-row gap-[8px]">
          <button
            onClick={() => handleOpenOffer("tokens")}
            className="hidden xl:block btn-secondary w-[160px] h-[48px] rounded-full border border-gray-300 px-6 py-2 text-[14px] --sm font-medium text-gray-700 "
          >
            Buy Tokens
          </button>
          <button
            onClick={() => handleOpenOffer("subscription")}
            className="hidden xl:block btn-primary w-[160px] h-[48px] rounded-full bg-primary py-2 px-6 text-[14px] --sm font-medium text-white "
          >
            Go Unlimited
          </button>
        </div>
      )}

      {(isMember||isMemberMonthly) && (
        <motion.div
          variants={fadeInUp}
          className="hidden xl:block relative w-full rounded-[8px] bg-[linear-gradient(to_right,_#25CEDA,_#25CEDA,_#25CEDA,_#25CEDA,_#25CEDA,_#25CEDA,_#B2E8F9)] border border-dashed border-white p-[1px]"
        >
          <div className="flex min-w-[240px] xl:min-w-[250px] h-[56px] flex-row items-center rounded-[8px] gap-2">
            <Image
              src="/icons/onboarding-popup.png"
              alt="icon"
              width={42}
              height={44}
              className="w-[42px] h-[44px] object-contain m-4 mr-0"
            />
            <span className="font-semibold text-[14px] z-10 text-[#17119B]">
              Premium package active!
            </span>
            <div className="absolute right-0 top-0 bottom-1 h-full flex items-center justify-center">
              <Image
                src="/icons/sparks-member.png"
                alt="icon"
                width={56}
                height={56}
                className="w-[56px] h-[56px] object-cover"
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );

  const MobileMenuButton = () => (
    <button
      type="button"
      className="text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-md p-1"
      onClick={handleSidebarToggle}
      aria-label="Toggle sidebar menu"
    >
      <Menu className="h-6 w-6" />
    </button>
  );

  const MobileUserInfo = () => (
    <div className="flex items-center space-x-3 w-full">
      {isSignedIn && (
        <div className="hidden sm:flex flex-row w-full">
          <span className="lg:text-[16px] text-[#221AE9] font-medium">
            Tokens:&nbsp;
          </span>
          <span
            className={`font-bold ${
              tokenBalance.balance <= 0 ? "text-[#FD0000]" : "text-[#221AE9]"
            }`}
          >
            {tokenBalance.balance < 0 ? 0 : tokenBalance.balance}
          </span>
        </div>
      )}

      {(isMember||isMemberMonthly) && (
        <motion.div
          variants={fadeInUp}
          className="hidden sm:block relative w-full rounded-[8px] bg-[linear-gradient(to_right,_#25CEDA,_#25CEDA,_#25CEDA,_#25CEDA,_#25CEDA,_#25CEDA,_#B2E8F9)] border border-dashed border-white p-[1px]"
        >
          <div className="flex min-w-[280px] xl:min-w-[250px] h-[56px] flex-row items-center rounded-[8px] gap-2">
            <Image
              src="/icons/onboarding-popup.png"
              alt="icon"
              width={42}
              height={44}
              className="w-[42px] h-[44px] object-contain m-4 mr-0"
            />
            <span className="font-semibold text-[14px] z-10 text-[#17119B]">
              Premium package active!
            </span>
            <div className="absolute right-0 top-0 bottom-1 h-full flex items-center justify-center">
              <Image
                src="/icons/sparks-member.png"
                alt="icon"
                width={56}
                height={56}
                className="w-[56px] h-[56px] object-cover"
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );

  return (
    <header
      className={`fixed xl:sticky top-0 z-60 flex w-full items-center ${
        isGuestMode ? "justify-between xl:justify-center" : "justify-between"
      } ${
        isEndgameTraining && !isDesktop ? "bg-[#E6F7FE]" : "bg-white border-b"
      } px-3 lg:px-6 h-[72px] lg:h-[97px]`}
      style={{ top: "var(--banner-height, 0px)" }}
    >
      <div
        className={`flex ${
          isGuestMode ? "xl:w-full xl:justify-center" : ""
        } items-center h-[70px] lg:h-[100px]`}
      >
        <div className="xl:hidden">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/icons/logo.png"
              alt="logo"
              className="max-w-20 h-28 object-contain"
              quality={100}
              width={90}
              height={90}
            />
          </Link>
        </div>

        <NavigationTabs />
      </div>

      {pathname === "/training-plan" && !isDesktop && (
        <div className="flex justify-center items-center flex-col">
          <h1 className="sm:hidden text-[14px] --xs font-semibold">
            {pathname
              .replace("/", "")
              .replace("-", " ")
              .replace(/\b\w/g, (l) => l.toUpperCase())}
          </h1>
          <p className="sm:hidden text-[14px] --10px text-gray-500">
            ({profile?.username || "User"})
          </p>
        </div>
      )}

      {pathname?.includes("endgame-training") && !isDesktop && (
        <div className="flex justify-center items-center flex-col">
          <h1 className="sm:hidden text-lg font-semibold">Endgame Training</h1>
        </div>
      )}

      {!isDesktop && (
        <div className="flex items-center space-x-3">
          {!isLoading && (isMember !== null || isMemberMonthly!==null|| isSignedIn !== null) && (
            <MobileUserInfo />
          )}
          <MobileMenuButton />
        </div>
      )}

      {isDesktop && 
        (isMember !== null || isMemberMonthly!==null||isSignedIn !== null) && (
          <div
            className={`flex ${
              isGuestMode ? "xl:justify-end" : ""
            } items-center space-x-4`}
          >
            {!isSignedIn ? <AuthButtons /> : <SignedInUserUI />}
          </div>
        )}
    </header>
  );
};

export default Header;
