"use client";
import Navigation from "@/components/navigator/navigation";
import AnalysisLatestGame from "./AnalysisLatestGame";
import AnalysisResult from "./AnalysisResult";
import { useEffect, useState } from "react";
import { usePgnStore } from "../store/zustandStore";
import { AnalyzeDifferentGame } from "@/components/modal/AnalyzeDifferentGame";
import LoadingPage from "@/components/analysis-loading/LoadingPage";

export default function AnalysisPage() {
  const { setHideDiv, hideDiv, isLoading, setIsLoading } = usePgnStore();

  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [showChessConnect, setShowChessConnect] = useState<boolean>(false);
  const [showPremiumDialog, setShowPremiumDialog] = useState<boolean>(false);
  let lastScrollY = 0;

  const isAnyDialogOpen = showChessConnect || showPremiumDialog;

  useEffect(() => {
    setIsLoading(false);

    if (isAnyDialogOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    const handleScroll = () => {
      if (window.innerWidth <= 1024) {
        if (window.scrollY > lastScrollY) {
          setHideDiv(true);
          setIsVisible(false);
        } else if (window.scrollY === 0) {
          setHideDiv(false);
          setIsVisible(true);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
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
              className={`flex flex-col bg-white px-2 sm:px-4 md:px-6 lg:px-6 pb-2 sm:pb-4 md:pb-6 lg:pb-8 ${
                hideDiv && "hidden"
              }`}
            >
              <h2 className="text-md pt-4 text-center xl:text-left sm:text-lg md:text-xl lg:text-2xl font-bold">
                Analysis Result from{" "}
                <span className="text-[#4E7838]">Chess.com</span>
                <span className="text-sm font-normal ml-2">dummy data</span>
              </h2>
              <div className="xl:hidden flex items-center justify-center mt-2">
                <AnalyzeDifferentGame />
              </div>
              <span className="hidden xl:block text-xs sm:text-sm md:text-md lg:text-lg">
                Discover an Analysis of your latest Chess.com Game.
              </span>
              <div className="hidden xl:flex flex-row items-center justify-between">
                <div className="hidden lg:block w-3/4 text-xs sm:text-sm md:text-md lg:text-lg">
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
              {/* <ChessConnectDialog
                open={showChessConnect}
                onOpenChange={setShowChessConnect}
                onSuccess={handleSuccessfulConnection}
              />

              <PremiumSubscriptionDialog
                open={showPremiumDialog}
                onOpenChange={setShowPremiumDialog}
                onClose={handleClosePremium}
                onGetPremium={handleGetPremium}
              /> */}

              {/* Overlay that darkens only the main content */}
              {isAnyDialogOpen && (
                <div className="absolute inset-0 bg-black/50 z-40 pointer-events-none" />
              )}
              <AnalysisResult />
              <div className="xl:w-3/4">
                <AnalysisLatestGame />
              </div>
            </div>
          </div>
        </Navigation>
      )}
    </>
  );
}
