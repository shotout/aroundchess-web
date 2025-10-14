"use client";

import Navigation from "@/components/navigator/navigation";
import AnalysisLatestGame from "../../components/analysis/AnalysisLatestGame";
import AnalysisResult from "../../components/analysis/AnalysisResult";
import { useEffect, useState } from "react";
import { usePgnStore } from "../store/zustandStore";
import LoadingPage from "@/components/analysis-loading/LoadingPage";
import { useApiClient } from "@/functions/api-client";
import ChessAccountSetup from "@/components/analysis/onboarding/ChessAccountSetup";
import { useProfileStore } from "../store/profile";
import Link from "next/link";
import { AnalysisSkeleton } from "./skeleton";
import { trackCustomEvent } from "../utils/facebookPixel";
import { AnalyzeDifferentGame } from "@/components/modal/AnalyzeDifferentGame";

export default function AnalysisPage() {
  const [mounted, setMounted] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { sessionId, hydrated: hydratedProfile } = useProfileStore();

  const {
    isLoading,
    pgn,
    setPgn,
    setDataAnalysis,
    dataAnalysis,
    hydrated,
    username,
    hasAnalyzedGame,
    isFromGameHistory,
    clearGameHistoryData,
    lastAnalysisFetched,
    setLastAnalysisFetched,
    isLastAnalysisLoading,
    setIsLastAnalysisLoading,
    setIsFromGameHistory,
  } = usePgnStore();
  const [openNewAnalysis, setOpenNewAnalysis] = useState(false);
  const { getLastAnalysis } = useApiClient();
  const [widthC, setWidthC] = useState<number>(0);
  useEffect(() => {
    trackCustomEvent("ViewAnalysis");
  }, []);
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (!isFromGameHistory) {
      setOpenNewAnalysis(true);
      setIsFromGameHistory(false);
    }
  }, [isFromGameHistory]);
  useEffect(() => {
    if (!mounted) return;
    if (hydratedProfile) {
      setIsSignedIn(sessionId.length > 0);
    }
  }, [mounted, sessionId, hydratedProfile]);

  const hasExistingData = () => {
    return pgn && dataAnalysis;
  };

  const fetchExistAnalysis = async () => {
    setIsLastAnalysisLoading(true);
    try {
      const response = await getLastAnalysis({});
      if (response.data != null) {
        setDataAnalysis(response.data);
        setPgn(response.data.gameInfo.pgn);
        setLastAnalysisFetched(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error fetching analysis:", error);
      return false;
    } finally {
      setIsLastAnalysisLoading(false);
    }
  };

  const loadFamousGame = async () => {
    try {
      const [resFamousGame, resAnalysis] = await Promise.all([
        fetch("/local-data/famous-game.txt"),
        fetch("/local-data/analysis.json"),
      ]);

      const pgnLocal = await resFamousGame.text();
      const responseAnalysis = await resAnalysis.json();

      setPgn(pgnLocal);
      setDataAnalysis(responseAnalysis);
    } catch (err) {
      console.error("Error loading famous game:", err);
    }
  };

  useEffect(() => {
    if (!mounted || !hydrated || !hydratedProfile) return;

    const initializeAnalysisPage = async () => {
      // if (hasExistingData() && isFromGameHistory) {
      //   setInitialLoading(false);
      //   setIsFromGameHistory(false)
      //   return;
      // }

      if (hasExistingData()) {
        setInitialLoading(false);
        return;
      }

      if (isSignedIn && username) {
        const hasApiData = await fetchExistAnalysis();
        if (!hasApiData) {
          await loadFamousGame();
        }
      } else {
        await loadFamousGame();
      }

      setInitialLoading(false);
    };

    initializeAnalysisPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, hydrated, hydratedProfile, isSignedIn, username]);

  useEffect(() => {
    if (!mounted) return;
    setWidthC(window.innerWidth);
  }, [mounted]);

  const handleAnalyzeDifferentGame = () => {
    clearGameHistoryData();
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen">
      <div className="flex overflow-hidden bg-primary-white">
        <div className="flex flex-col overflow-y-auto w-full">
          <Navigation>
            <div className="w-full space-y-4">
              <ChessAccountSetup isLoading={false} />

              <div className="flex flex-col overflow-y-auto relative bg-white px-4 lg:px-8">
                <div className={`flex flex-col space-y-4`}>
                  <div className="space-y-2 pt-4">
                    <h2 className="text-md text-center xl:text-left sm:text-lg md:text-[32px] lg:text-[32px] font-medium">
                      Analysis Result from{" "}
                      <span className="text-[#4E7838] font-medium">
                        Chess.com
                      </span>
                    </h2>

                    {isSignedIn && widthC <= 1024 && username && (
                      <div className="lg:hidden flex items-center justify-center my-2">
                        <Link
                          href="/my-game-history"
                          className="w-fill px-5 py-2 btn-primary rounded-full"
                          onClick={handleAnalyzeDifferentGame}
                        >
                          Analyze a different game
                        </Link>
                      </div>
                    )}

                    <span className="hidden xl:block text-xs sm:text-[18px] md:text-[18px] lg:text-[18px] line-height-[20px] text-center xl:text-left">
                      Discover a Chess.com Game Analysis.
                    </span>
                  </div>

                  <div className="hidden xl:flex flex-row items-center justify-between space-x-4">
                    <div
                      className={`hidden lg:block ${
                        !isSignedIn ? `w-4/5` : `w-3/5`
                      } text-xs sm:text-[18px] md:text-[18px] lg:text-[18px] line-height-[20px] leading-normal`}
                    >
                      Our AI-powered chess analysis provides deep insights into
                      positional and tactical aspects of a game. It evaluates
                      piece coordination, pawn structure, king safety, and
                      overall positional advantages, helping players understand
                      strategic strengths and weaknesses.
                    </div>
                    <AnalyzeDifferentGame openPopup={openNewAnalysis} />

                    {/* {isSignedIn && widthC > 1024 && username && (
                      <Link
                        href="/my-game-history"
                        className="w-fill px-5 py-2 btn-primary rounded-full"
                        onClick={handleAnalyzeDifferentGame}
                      >
                        Analyze a different game
                      </Link>
                    )} */}
                  </div>
                </div>
                {isLastAnalysisLoading ? (
                  <AnalysisSkeleton />
                ) : (
                  <div className="flex flex-col xl:flex-row-reverse gap-4 xl:gap-x-6 justify-center py-4 max-w-full overflow-hidden">
                    <div className="flex-shrink-0">
                      <AnalysisResult />
                    </div>
                    <div className="flex-shrink-1 min-w-0">
                      <AnalysisLatestGame />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Navigation>
        </div>
      </div>
    </div>
  );
}
