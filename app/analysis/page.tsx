"use client";
import Navigation from "@/components/navigator/navigation";
import AnalysisLatestGame from "../../components/analysis/AnalysisLatestGame";
import AnalysisResult from "../../components/analysis/AnalysisResult";
import { useEffect, useState } from "react";
import { usePgnStore } from "../store/zustandStore";
import { AnalyzeDifferentGame } from "@/components/modal/AnalyzeDifferentGame";
import LoadingPage from "@/components/analysis-loading/LoadingPage";
import { useApiClient } from "@/functions/api-client";
import DotSpinner from "@/components/game-history/Spinner";
import ChessAccountSetup from "@/components/analysis/onboarding/ChessAccountSetup";
import { useProfileStore } from "../store/profile";

export default function AnalysisPage() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const { sessionId, hydrated: hydratedProfile } = useProfileStore();

  useEffect(() => {
    const checkSession = () => {
      if (sessionId) {
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
    };
    checkSession();
  }, [sessionId, isSignedIn]);

  const {
    setHideDiv,
    hideDiv,
    isLoading,
    setIsLoading,
    pgn,
    setPgn,
    dataAnalysis,
    setDataAnalysis,
    hydrated,
  } = usePgnStore();

  const {
    getMistakePrevious,
    getLastAnalysis,
    getMistakePreviousDetail,
    isLoading: fetchLoading,
  } = useApiClient();

  const [lastPgn, setLastPgn] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [openAnalyze, setOpenAnalyze] = useState<boolean>(false);
  const [previousAnalyse, setPreviousAnalyse] = useState<any[]>([]);
  const [widthC, setWidthC] = useState<number>(0);
  let lastScrollY = 0;

  const fetchMistakePrevious = async () => {
    try {
      const prevData = await getMistakePrevious();
      const dataPrevious = prevData.data;
      if (dataPrevious.length > 0) {
        setPreviousAnalyse(dataPrevious);
        openModalAnalyze(dataPrevious);
        fetchMistakePreviousDetail(dataPrevious[0].id);
      } else {
        fetchPgnFamousGame();
      }
    } catch (error) {
      openModalAnalyze([]);
    }
  };

  const fetchMistakePreviousDetail = async (id: string) => {
    try {
      const params = { page: 1, limit: 10, phase: "", type: "" };
      const prevDataDetail = await getMistakePreviousDetail(id, params);
      const dataDetail = prevDataDetail.data;
      setLastPgn(dataDetail.pgn);
      fetchExistAnalyze();
    } catch (error) {
      // Handle error silently
    }
  };

  const openModalAnalyze = (data: any) => {
    if (data.length == 0) {
      if (!openAnalyze) {
        setOpenAnalyze(true);
      }
    } else {
      setOpenAnalyze(false);
    }
  };

  const fetchExistAnalyze = async () => {
    try {
      const response = await getLastAnalysis({});
      setDataAnalysis(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hydrated && hydratedProfile) {
      if (isSignedIn) {
        setLoading(true);
        fetchExistAnalyze();
      } else if (dataAnalysis == null && !isLoading) {
        fetchPgnFamousGame();
      } else {
        setIsLoading(false);
      }
    }
  }, [isSignedIn, hydrated, hydratedProfile]);

  const fetchPgnFamousGame = async () => {
    let arr = null;
    try {
      const resFamousGame = await fetch("/local-data/famous-game.txt");
      const pgnLocal = await resFamousGame.text();
      setPgn(pgnLocal);
      const resAnalysis = await fetch("/local-data/analysis.json");
      const responseAnalysis = await resAnalysis.json();
      setDataAnalysis(responseAnalysis);
      arr = responseAnalysis;
      setLoading(false);
    } catch (err) {
      setIsLoading(false);
      setLoading(false);
    } finally {
      if (arr != null) {
        // Do nothing
      } else {
        setIsLoading(false);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    setWidthC(window?.innerWidth);
    setIsLoading(false);
    const handleScroll = () => {
      if (window?.innerWidth <= 1024) {
        if (window?.scrollY > lastScrollY) {
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

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, setHideDiv]);

  return (
    <div className="min-h-screen">
      {isLoading ? (
        <LoadingPage />
      ) : (
        <div className="flex overflow-hidden bg-primary-white">
          <div className="flex flex-col overflow-y-auto w-full">
            <Navigation>
              <div className="w-full space-y-4">
                <ChessAccountSetup isLoading={isLoading} />

                <div className="flex flex-col overflow-y-auto relative bg-white px-4 lg:px-8">
                  <div
                    className={`flex flex-col space-y-4 ${hideDiv && "hidden"}`}
                  >
                    <div className="space-y-2 pt-4">
                      <h2 className="text-md text-center xl:text-left sm:text-lg md:text-[32px] lg:text-[32px] font-medium">
                        Analysis Result from{" "}
                        <span className="text-[#4E7838] font-medium">
                          Chess.com
                        </span>
                      </h2>

                      {isSignedIn && widthC <= 1024 && !loading && (
                        <div className="lg:hidden flex items-center justify-center my-2">
                          <AnalyzeDifferentGame openPopup={openAnalyze} />
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

                      {isSignedIn && widthC > 1024 && !loading && (
                        <AnalyzeDifferentGame openPopup={openAnalyze} />
                      )}
                    </div>
                  </div>

                  {(fetchLoading && pgn.length == 0) || loading ? (
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
      )}
    </div>
  );
}
