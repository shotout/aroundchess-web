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
  const [initialLoading, setInitialLoading] = useState(true);
  const { sessionId, hydrated: hydratedProfile } = useProfileStore();

  const {
    setHideDiv,
    isLoading,
    pgn,
    setPgn,
    setDataAnalysis,
    hydrated,
    username,
  } = usePgnStore();

  const { getLastAnalysis, isLoading: fetchLoading } = useApiClient();

  const [, setIsVisible] = useState<boolean>(true);
  const [widthC, setWidthC] = useState<number>(0);
  let lastScrollY = 0;

  // Set mounted to true on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check authentication status
  useEffect(() => {
    if (!mounted) return;
    
    if (hydratedProfile) {
      setIsSignedIn(sessionId.length > 0);
    }
  }, [mounted, sessionId, hydratedProfile]);

  // Fetch existing analysis for authenticated users
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

  // Load famous game data
  const loadFamousGame = async () => {
    try {
      const [resFamousGame, resAnalysis] = await Promise.all([
        fetch("/local-data/famous-game.txt"),
        fetch("/local-data/analysis.json")
      ]);
      
      const pgnLocal = await resFamousGame.text();
      const responseAnalysis = await resAnalysis.json();
      
      setPgn(pgnLocal);
      setDataAnalysis(responseAnalysis);
    } catch (err) {
      console.error("Error loading famous game:", err);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    if (!mounted) return;
    
    if (hydrated && hydratedProfile) {
      if (isLoading) {
        setInitialLoading(false);
      } else if (isSignedIn && username) {
        fetchExistAnalysis().finally(() => setInitialLoading(false));
      } else {
        loadFamousGame().finally(() => setInitialLoading(false));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, hydratedProfile, hydrated, isSignedIn, username, isLoading]);

  // Window-dependent effects
  useEffect(() => {
    if (!mounted) return;
    
    setWidthC(window.innerWidth);
    
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
        } else if (window.scrollY === 0) {
          setIsVisible(true);
        }
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mounted, setHideDiv]);

  // Show loading or empty div until mounted
  if (!mounted) {
    return <div className="min-h-screen bg-primary-white" />;
  }

  // Show loading page if actively loading or initial loading
  if (isLoading || initialLoading) {
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
                      Our AI-powered chess analysis provides deep insights
                      into positional and tactical aspects of a game. It
                      evaluates piece coordination, pawn structure, king
                      safety, and overall positional advantages, helping
                      players understand strategic strengths and weaknesses.
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

                {fetchLoading && pgn.length === 0 ? (
                  <div className="py-4">
                    <DotSpinner />
                  </div>
                ) : (
                  <div className="flex flex-col xl:flex-row-reverse gap-4 justify-center py-4">
                    <AnalysisResult />
                    <AnalysisLatestGame />
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