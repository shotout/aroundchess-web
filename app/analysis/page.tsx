"use client";
import Navigation from "@/components/navigator/navigation";
import AnalysisLatestGame from "./AnalysisLatestGame";
import AnalysisResult from "./AnalysisResult";
import { useEffect, useState } from "react";
import { usePgnStore } from "../store/zustandStore";
import { AnalyzeDifferentGame } from "@/components/modal/AnalyzeDifferentGame";
import LoadingPage from "@/components/analysis-loading/LoadingPage";
import { ChessConnectDialog } from "@/components/analysis/onboarding/ChessConnectPopover";
import { PremiumSubscription } from "@/components/analysis/onboarding/PremiumSubscription";

export default function AnalysisPage() {
  const { setHideDiv, hideDiv, isLoading, setIsLoading, username } =
    usePgnStore();

  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [showChessConnect, setShowChessConnect] = useState<boolean>(false);
  const [showPremiumDialog, setShowPremiumDialog] = useState<boolean>(false);
  let lastScrollY = 0;

  const isAnyDialogOpen = showChessConnect || showPremiumDialog;

  const handleSuccessfulConnection = (username: string) => {
    setShowChessConnect(false);
  };

  const handleClosePremium = () => {
    setShowPremiumDialog(false);
  };

  const handleGetPremium = () => {
    setShowPremiumDialog(false);
  };

  useEffect(() => {
    setIsLoading(false);
    const handleScroll = () => {
      if (window.innerWidth <= 1024) {
        if (window.scrollY > lastScrollY) {
          setHideDiv(true);
          setIsVisible(false);
        } else if (window.scrollY === 0) {
          setHideDiv(false);
          setIsVisible(true);
        }
      } else {
        if (window.scrollY > lastScrollY) {
          setIsVisible(false);
        } else if (window.scrollY == 0) {
          setIsVisible(true);
        }
      }
      lastScrollY = window.scrollY;
    };

    if (!isAnyDialogOpen) {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [lastScrollY, setHideDiv, setIsLoading, isAnyDialogOpen]);

  return (
    <>
      {isLoading ? (
        <LoadingPage />
      ) : (
        <Navigation>
          <div
            className={`flex flex-col overflow-y-auto relative ${
              isAnyDialogOpen ? "z-30" : ""
            }`}
          >
            <div
              className={`flex flex-col mt-2 bg-white px-2 sm:px-4 md:px-6 lg:px-6 pb-2 sm:pb-4 md:pb-6 lg:pb-8 ${
                hideDiv && "hidden"
              }`}
            >
              <h2 className="text-md pt-4 text-center xl:text-left sm:text-lg md:text-xl lg:text-xl font-bold">
                Analysis Result from{" "}
                <span className="text-[#4E7838]">Chess.com</span>
                <span className="text-sm font-normal ml-2">dummy data</span>
              </h2>
              <div className="xl:hidden flex items-center justify-center mt-2">
                <AnalyzeDifferentGame />
              </div>
              <span className="hidden xl:block text-xs sm:text-sm md:text-md lg:text-md">
                Discover an Analysis of your latest Chess.com Game.
              </span>
              <div className="hidden xl:flex flex-row items-center justify-between">
                <div className="hidden lg:block w-3/5 text-xs sm:text-sm md:text-md lg:text-md">
                  AI-powered chess analysis provides deep insights into
                  positional and tactical aspects of a game. It evaluates piece
                  coordination, pawn structure, king safety, and overall
                  positional advantages, helping players understand strategic
                  strengths and weaknesses
                </div>
                <AnalyzeDifferentGame />
              </div>
            </div>
            <div className="flex flex-col xl:flex-row-reverse gap-4 bg-white px-4">
              <ChessConnectDialog
                open={showChessConnect && !isLoading && !username}
                onOpenChange={setShowChessConnect}
                onSuccess={handleSuccessfulConnection}
              />
              {/* <PremiumSubscription
                open={showPremiumDialog && !isLoading}
                onOpenChange={setShowPremiumDialog}
                onClose={handleClosePremium}
                onGetPremium={handleGetPremium}
              /> */}
              {isAnyDialogOpen && (
                <div className="absolute inset-0 bg-black/50 z-40 pointer-events-none" />
              )}
              <AnalysisResult />
              {/* </div> */}
              <AnalysisLatestGame />
            </div>
          </div>
        </Navigation>
      )}
    </>
  );
}
