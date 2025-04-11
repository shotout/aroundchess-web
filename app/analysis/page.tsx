"use client";
import Navigation from "@/components/navigator/navigation";
import AnalysisLatestGame from "../../components/analysis/AnalysisLatestGame";
import AnalysisResult from "../../components/analysis/AnalysisResult";
import { useEffect, useState } from "react";
import { usePgnStore } from "../store/zustandStore";
import { AnalyzeDifferentGame } from "@/components/modal/AnalyzeDifferentGame";
import LoadingPage from "@/components/analysis-loading/LoadingPage";
import { ChessConnectDialog } from "@/components/analysis/onboarding/ChessConnectPopover";
import { PremiumSubscription } from "@/components/analysis/onboarding/PremiumSubscription";
import { useAuth } from "@clerk/nextjs";
import { useApiClient } from "@/functions/api-client";
import DotSpinner from "@/components/game-history/Spinner";

export default function AnalysisPage() {
  const { isSignedIn } = useAuth();
  const {
    setHideDiv,
    hideDiv,
    isLoading,
    setIsLoading,
    username,
    pgn,
    setPgn,
    setDataAnalysis,
  } = usePgnStore();
  const { getMistakePrevious, isLoading: fetchLoading } = useApiClient();
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [showChessConnect, setShowChessConnect] = useState<boolean>(false);
  const [showPremiumDialog, setShowPremiumDialog] = useState<boolean>(false);
  const [openAnalyze, setOpenAnalyze] = useState<boolean>(false);
  const [previousAnalyse, setPreviousAnalyse] = useState<any[]>([]);
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
  const fetchMistakePrevious = async () => {
    try {
      const prevData = await getMistakePrevious();
      console.log("prevData", prevData.data);
      if (prevData.data.length > 0) {
        setPreviousAnalyse(prevData.data);
        openModalAnalyze(prevData.data);
      }
    } catch (error) {
      openModalAnalyze([]);
      console.error("Failed to fetch mistake previous:", error);
    }
  };
  const openModalAnalyze = (data: any) => {
    if (data.length == 0 && !openAnalyze) {
      fetchPgnFamousGame();
      setOpenAnalyze(true);
    } else {
      setOpenAnalyze(false);
    }
  };
  useEffect(() => {
    fetchMistakePrevious();
  }, []);

  const fetchPgnFamousGame = async () => {
    let arr = null;
    try {
      const resFamousGame = await fetch("/local-data/famous-game.txt");
      const pgnLocal = await resFamousGame.text();
      setPgn(pgnLocal);
      const resAnalysis = await fetch("/local-data/analysis.json");
      const responseAnalysis = await resAnalysis.json();
      console.log("pgnLocal", pgnLocal);
      console.log("responseAnalysis", responseAnalysis);

      setDataAnalysis(responseAnalysis);
      arr = responseAnalysis;
      // router.push("/analysis");
    } catch (err) {
      console.log("error", err);
      setIsLoading(false);
    } finally {
      if (arr != null) {
      } else {
        setIsLoading(false);
      }
    }
  };
  useEffect(() => {
    console.log("masuk");
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
              className={`flex flex-col mt-2 bg-white px-2 sm:px-4 md:px-6 pb-2 sm:pb-4 md:pb-6 lg:pb-8 lg:p-[32px] gap-1 ${
                hideDiv && "hidden"
              }`}
            >
              <h2 className="text-md pt-4 text-center xl:text-left sm:text-lg md:text-[32px] lg:text-[32px] font-medium">
                Analysis Result from{" "}
                <span className="text-[#4E7838] font-medium">Chess.com</span>
              </h2>
              {isSignedIn && (
                <div className="lg:hidden flex items-center justify-center mt-2">
                  <AnalyzeDifferentGame openPopup={openAnalyze} />
                </div>
              )}
              <span className="hidden xl:block text-xs sm:text-[18px] md:text-[18px] lg:text-[18px] line-height-[20px] text-center xl:text-left">
                Discover a Chess.com Game Analysis.
              </span>
              <div className="hidden xl:flex flex-row items-center justify-between">
                <div
                  className={`hidden lg:block ${
                    !isSignedIn ? `w-full` : `w-3/5`
                  } text-xs sm:text-[18px] md:text-[18px] lg:text-[18px] line-height-[20px] leading-normal`}
                >
                  Our AI-powered chess analysis provides deep insights into
                  positional and tactical aspects of a game. It evaluates piece
                  coordination, pawn structure, king safety, and overall
                  positional advantages, helping players understand strategic
                  strengths and weaknesses.
                </div>
                {isSignedIn && <AnalyzeDifferentGame openPopup={openAnalyze} />}
              </div>
            </div>
            {fetchLoading ? (
              <DotSpinner />
            ) : (
              <div className="flex flex-col xl:flex-row-reverse gap-4 bg-white px-4 lg:px-[32px]">
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
            )}
          </div>
        </Navigation>
      )}
    </>
  );
}
