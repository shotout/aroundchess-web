"use client";

import Navigation from "@/components/navigator/navigation";
import AnalysisLatestGame from "../../components/analysis/AnalysisLatestGame";
import AnalysisResult from "../../components/analysis/AnalysisResult";
import { useEffect, useState } from "react";
import { usePgnStore } from "../store/zustandStore";
import LoadingPage from "@/components/analysis-loading/LoadingPage";
import { useApiClient } from "@/functions/api-client";
import DotSpinner from "@/components/game-history/Spinner";
import ChessAccountSetup from "@/components/analysis/onboarding/ChessAccountSetup";
import { useProfileStore } from "../store/profile";
import Link from "next/link";

export default function AnalysisPage() {
  const [mounted, setMounted] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [_, setInitialLoading] = useState(true);
  const [hasExistingData, setHasExistingData] = useState(false);
  const { sessionId, hydrated: hydratedProfile } = useProfileStore();

  const {
    isLoading,
    pgn,
    setPgn,
    setDataAnalysis,
    dataAnalysis,
    hydrated,
    username,
  } = usePgnStore();

  const { getLastAnalysis, isLoading: fetchLoading } = useApiClient();

  const [widthC, setWidthC] = useState<number>(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (hydratedProfile) {
      setIsSignedIn(sessionId.length > 0);
    }
  }, [mounted, sessionId, hydratedProfile]);

  useEffect(() => {
    if (hydrated && pgn && dataAnalysis) {
      setHasExistingData(true);
    }
  }, [hydrated, pgn, dataAnalysis]);

  const fetchExistAnalysis = async () => {
    try {
      const response = await getLastAnalysis({});
      if (response.data != null) {
        setDataAnalysis(response.data);
        setPgn(response.data.gameInfo.pgn);
      } else {
        await loadFamousGame();
      }
    } catch (error) {
      console.error("Error fetching analysis:", error);
      await loadFamousGame();
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
    if (!mounted) return;

    if (hydrated && hydratedProfile) {
      if (hasExistingData) {
        console.log("Using existing data from game-history");
        setInitialLoading(false);
        return;
      }

      if (isLoading) {
        setInitialLoading(false);
        return;
      }

      if (isSignedIn && username) {
        fetchExistAnalysis().finally(() => setInitialLoading(false));
      } else {
        loadFamousGame().finally(() => setInitialLoading(false));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, hydratedProfile, hydrated, isSignedIn, username, isLoading, hasExistingData]);

  useEffect(() => {
    if (!mounted) return;
    setWidthC(window.innerWidth);
  }, [mounted]);

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

                    {isSignedIn && widthC > 1024 && username && (
                      <Link
                        href="/my-game-history"
                        className="w-fill px-5 py-2 btn-primary rounded-full"
                      >
                        Analyze a different game
                      </Link>
                    )}
                  </div>
                </div>

                {fetchLoading && pgn.length === 0 && !hasExistingData ? (
                  <div className="py-4">
                    <DotSpinner />
                  </div>
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