"use client";
import Navigation from "@/components/navigator/navigation";
import AnalysisLatestGame from "./AnalysisLatestGame";
import AnalysisResult from "./AnalysisResult";
import { useEffect, useState } from "react";
import { usePgnStore } from "../store/zustandStore";
import { AnalyzeDifferentGame } from "@/components/modal/AnalyzeDifferentGame";
import LoadingPage from "@/components/analysis-loading/LoadingPage";
import { toast } from "sonner";
import { ChessConnectDialog } from "@/components/analysis/onboarding/ChessConnectPopover";
import { PremiumSubscriptionDialog } from "@/components/analysis/onboarding/PremiumSubscription";
import { useAuthStore } from "@/components/analysis/onboarding/store/AuthStore";
import { ChessApiService } from "@/components/analysis/onboarding/store/APIService";

export default function AnalysisPage() {
  const {
    setHideDiv,
    hideDiv,
    isLoading,
    setIsLoading,
    isChessConnected,
    setIsChessConnected,
    chessComUsername,
    setChessComUsername,
    setDataGames,
  } = usePgnStore();

  const { sessionId, isAuthenticated } = useAuthStore();

  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [showChessConnect, setShowChessConnect] = useState<boolean>(false);
  const [showPremiumDialog, setShowPremiumDialog] = useState<boolean>(false);
  const [connectedUsername, setConnectedUsername] = useState<string>("");
  let lastScrollY = 0;

  const isAnyDialogOpen = showChessConnect || showPremiumDialog;

  useEffect(() => {
    setIsLoading(false);

    if (isAuthenticated && sessionId) {
      if (chessComUsername) {
        setConnectedUsername(chessComUsername);
        setIsChessConnected(true);
      } else if (!isChessConnected) {
        setShowChessConnect(true);
      }

      if (isChessConnected && chessComUsername) {
        fetchGames();
      }
    }

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
  }, [
    lastScrollY,
    setHideDiv,
    setIsLoading,
    isAnyDialogOpen,
    isAuthenticated,
    sessionId,
    isChessConnected,
    chessComUsername,
    setIsChessConnected,
  ]);

  // Fetch games from API
  const fetchGames = async () => {
    if (!sessionId) return;

    try {
      setIsLoading(true);
      const gamesData = await ChessApiService.getGames(sessionId);
      setDataGames(gamesData);
    } catch (error) {
      console.error("Failed to fetch games:", error);
      toast.error("Failed to load your Chess.com games");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessfulConnection = (username: string) => {
    console.log("Successful connection for user:", username);
    setConnectedUsername(username);
    setChessComUsername(username);
    setIsChessConnected(true);

    setShowChessConnect(false);

    setShowPremiumDialog(true);
  };

  const handleGetPremium = () => {
    toast.success("Redirecting to premium checkout...");
    completeOnboarding();
  };

  const handleClosePremium = () => {
    completeOnboarding();
  };

  const completeOnboarding = () => {
    // Make sure both dialogs are closed
    setShowPremiumDialog(false);
    setShowChessConnect(false);

    // Enable scrolling
    document.body.style.overflow = "auto";

    // Show success toast
    toast.success(`Connected to Chess.com account: ${connectedUsername}`);

    // Fetch games after connection is complete
    fetchGames();
  };

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
                {isChessConnected && chessComUsername && (
                  <span className="text-sm font-normal ml-2">
                    (Connected as: {chessComUsername})
                  </span>
                )}
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
              {/* Chess Connect Dialog */}
              <ChessConnectDialog
                open={showChessConnect}
                onOpenChange={setShowChessConnect}
                onSuccess={handleSuccessfulConnection}
              />

              {/* Premium Subscription Dialog */}
              <PremiumSubscriptionDialog
                open={showPremiumDialog}
                onOpenChange={setShowPremiumDialog}
                onClose={handleClosePremium}
                onGetPremium={handleGetPremium}
              />

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
