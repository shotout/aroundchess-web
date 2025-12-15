import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ChartNoAxesColumn,
  AlertCircle,
  Clock,
  BookOpen,
  Loader2,
  CheckCircle,
  Eye,
} from "lucide-react";
import GameCard from "./GameCard";
import PaginationControls from "./PaginationControls";
import { getResultData } from "../hooks/useGameData";
import { Game } from "../types/GameHistoryTypes";
import { AnalyzeGameHistory } from "./AnalyzeGameHistory";
import { useRouter, usePathname } from "next/navigation";
import { usePgnStore } from "@/app/store/zustandStore";
import { useBackgroundAnalysisStore } from "@/app/store/backgroundAnaysis";
import GamesListSkeleton from "./GameListSkeleton";
import { createPgnHash } from "@/utils/crypto-utils";
import { useProfileStore } from "@/app/store/profile";
import { usePollingManager } from "../hooks/usePollingManager";
import { useProfileFetch } from "@/components/navigator/hook/useProfileFetch";
import { formatTimePgn } from "@/functions/format-date";
import { useApiClient } from "@/functions/api-client";
import { trackCustomEvent } from "@/app/utils/facebookPixel";
import { useTutorial } from "@/components/TutorialProvider";
import { usePricingOffer } from "@/app/store/pricingOffer";
import Image from "next/image";
import ChooseAnalysisMode from "./ChooseAnalysisMode";
import ProcessingAnalysisMode from "./ProcessingAnalysisMode";
import GameAnalysis from "./GameAnalysis";

interface GamesListProps {
  games: Game[];
  currentGames: Game[];
  isLoading: boolean;
  error: Error | null;
  handleRetryFetch: () => void;
  paginationProps: {
    currentPage: number;
    setCurrentPage: (page: number) => void;
    itemsPerPage: number;
    setItemsPerPage: (count: number) => void;
    totalPages: number;
    goToNextPage: () => void;
    goToPreviousPage: () => void;
  };
  recentlyImportedIds?: (string | number)[];
}

interface LastAnalysisResponse {
  success: boolean;
  message: string;
  data?: any;
  statusCode: number;
}

const endpoint = process.env.BASE_URL;

const fetchLastAnalysisV2 = async (
  pgnHash: string,
  sessionId: string
): Promise<LastAnalysisResponse | null> => {
  try {
    const response = await fetch(
      `${endpoint}/v2/analyze/last-analysis/${pgnHash}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionId}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch v2 analysis: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching v2 last analysis:", error);
    return null;
  }
};

const fetchLastAnalysisV3 = async (
  pgnHash: string,
  sessionId: string
): Promise<LastAnalysisResponse | null> => {
  try {
    const response = await fetch(
      `${endpoint}/v3/analyze/last-analysis/${pgnHash}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionId}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch v3 analysis: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching v3 last analysis:", error);
    return null;
  }
};

const DESKTOP_GRID_TEMPLATE = "0.5fr 1.5fr 1fr 1fr 2fr 1fr 1fr 1fr 2fr 1fr 2fr";

const GamesList: React.FC<GamesListProps> = ({
  games,
  currentGames,
  isLoading,
  error,
  handleRetryFetch,
  paginationProps,
  recentlyImportedIds = [],
}) => {
  const router = useRouter();
  const { getJobByGameId, clearOldJobs, analysisJobs } =
    useBackgroundAnalysisStore();
  const {
    setPgn,
    setDataAnalysis,
    isFromAnalyzeDifferentGame,
    isOpenTutorial,
    setDataGamesImport,
    setIsFromGameHistory,
    everShowOffer,
    setEverShowOffer,
    isFromGameHistory,
  } = usePgnStore();
  const { setIsFromAnalyzeDifferentGame } = usePgnStore();
  const pathname = usePathname();
  const { isTutorialPlay, dataTutorial, stepFocused } = useTutorial();
  const { setOpenOffer } = usePricingOffer();

  // Use tutorial dummy data when tutorial is active and no real games
  const displayGames = isTutorialPlay && currentGames.length === 0
    ? dataTutorial.dataHistory as Game[]
    : currentGames;

  // helper to update hasViewedAnalysis flag in the persisted store arrays
  const markHasViewedAnalysisInStore = (id: string | number) => {
    try {
      const state = usePgnStore.getState();
      const { gamesData, otherGamesData, setGamesData, setOtherGamesData } =
        state as any;

      if (Array.isArray(gamesData)) {
        const idx = gamesData.findIndex((g: any) => g.id === id);
        // console.log("Found game index in store:", idx);
        if (idx !== -1) {
          const newGames = [...gamesData];
          newGames[idx] = {
            ...newGames[idx],
            has_viewed_analysis: true,
            hasViewedAnalysis: true,
          };
          // console.log("Marking game as viewed in store:", newGames);
          setGamesData(newGames);
        }
      }

      if (Array.isArray(otherGamesData)) {
        const idx2 = otherGamesData.findIndex((g: any) => g.id === id);
        if (idx2 !== -1) {
          const newOther = [...otherGamesData];
          newOther[idx2] = {
            ...newOther[idx2],
            has_viewed_analysis: true,
            hasViewedAnalysis: true,
          };
          setOtherGamesData(newOther);
        }
      }
    } catch (e) {
      console.error("Error marking game as viewed in store:", e);
    }
  };
  const markIsAnalysisInStore = (id: string | number) => {
    try {
      const state = usePgnStore.getState();
      const { gamesData, otherGamesData, setGamesData, setOtherGamesData } =
        state as any;

      let updated = false;

      if (Array.isArray(gamesData)) {
        const idx = gamesData.findIndex((g: any) => g.id === id);
        // console.log("Found game index in store:", idx);
        if (idx !== -1) {
          const newGames = [...gamesData];
          newGames[idx] = {
            ...newGames[idx],
            // backend field
            is_analysis: true,
            // frontend Game type field
            isAnalysis: true,
          };
          // console.log("Marking game as viewed in store:", newGames);
          setGamesData(newGames);
          updated = true;
        }
      }

      if (Array.isArray(otherGamesData)) {
        const idx2 = otherGamesData.findIndex((g: any) => g.id === id);
        if (idx2 !== -1) {
          const newOther = [...otherGamesData];
          newOther[idx2] = {
            ...newOther[idx2],
            is_analysis: true,
            isAnalysis: true,
          };
          setOtherGamesData(newOther);
          updated = true;
        }
      }

      // Fallback: for games whose background analysis job was started
      // with a synthetic gameId (e.g. You vs AI), try to match by PGN
      // so that "Other Games" rows still flip to "View Results".
      if (!updated) {
        const job = getJobByGameId(id);
        const jobPgn = job?.gamePgn;

        if (jobPgn) {
          if (Array.isArray(gamesData)) {
            const idx = gamesData.findIndex((g: any) => g.pgn === jobPgn);
            if (idx !== -1) {
              const newGames = [...gamesData];
              newGames[idx] = {
                ...newGames[idx],
                is_analysis: true,
                isAnalysis: true,
              };
              setGamesData(newGames);
            }
          }

          if (Array.isArray(otherGamesData)) {
            const idx2 = otherGamesData.findIndex(
              (g: any) => g.pgn === jobPgn
            );
            if (idx2 !== -1) {
              const newOther = [...otherGamesData];
              newOther[idx2] = {
                ...newOther[idx2],
                is_analysis: true,
                isAnalysis: true,
              };
              setOtherGamesData(newOther);
            }
          }
        }
      }
    } catch (e) {
      console.error("Error marking game as viewed in store:", e);
    }
  };
  const { getTokenBalance, viewAnalysisResult, getProfile } = useApiClient();
  const { sessionId, setToken, setProfile } = useProfileStore();
  const { setCallFetch } = useProfileFetch();
  const { restorePollingJobs } = usePollingManager();
  const [totalCompletedJobs, setTotalCompletedJobs] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [gameId, setGameId] = useState<string | number | null>(null);
  const isNewlyImported = (id: string | number) =>
    recentlyImportedIds.includes(id);

  const [openGameId, setOpenGameId] = useState<string | number | null>(null);
  const [autoStartGameId, setAutoStartGameId] = useState<
    string | number | null
  >(null);
  const [chooseAnalysisModeGameId, setChooseAnalysisModeGameId] = useState<
    string | number | null
  >(null);
  const [shortAnalysisData, setShortAnalysisData] = useState<any>(null);
  const [v2AnalysisData, setV2AnalysisData] = useState<any>(null);
  const [processingAnalysisModeGameId, setProcessingAnalysisModeGameId] = useState<
    string | number | null
  >(null);
  const [gameAnalysisGameId, setGameAnalysisGameId] = useState<
    string | number | null
  >(null);
  const [v3AnalysisResult, setV3AnalysisResult] = useState<any>(null);

  // State to detect if device is mobile
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device on mount and window resize
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 576);
    };

    // Check on mount
    checkIsMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIsMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Auto-open first game and start analysis when flagged from AnalyzeDifferentGame flow
  useEffect(() => {
    // only act when flag is true, we're on my-game-history, and there is at least one game
    if (
      isFromAnalyzeDifferentGame &&
      pathname === "/my-game-history" &&
      currentGames &&
      currentGames.length > 0
    ) {
      const first = currentGames[0];
      // don't open modal — trigger auto-start for the first game
      setAutoStartGameId(first.id);
      // reset the flag so this only runs once
      try {
        setIsFromAnalyzeDifferentGame(false);
      } catch (e) {
        // ignore
      }
    }
  }, [
    isFromAnalyzeDifferentGame,
    pathname,
    currentGames,
    setIsFromAnalyzeDifferentGame,
  ]);

  useEffect(() => {
    console.log("GamesList mounted, clearing old jobs and restoring polling");
    clearOldJobs();
    restorePollingJobs();
  }, [clearOldJobs, restorePollingJobs]);

  // Handle tutorial step changes - open modals automatically
  useEffect(() => {
    if (!isTutorialPlay || displayGames.length === 0) return;

    const firstGame = displayGames[0];

    // Step 1 (index 0): Close all modals, show game list
    if (stepFocused === 0) {
      console.log("Tutorial Step 1: Closing all modals, showing game list");
      setOpenGameId(null);
      setChooseAnalysisModeGameId(null);
      setProcessingAnalysisModeGameId(null);
      setGameAnalysisGameId(null);
    }
    // Step 2 (index 1): Open AnalyzeGameHistory modal
    else if (stepFocused === 1) {
      console.log("Tutorial Step 2: Opening AnalyzeGameHistory modal");
      setOpenGameId(firstGame.id);
      // Close other modals
      setChooseAnalysisModeGameId(null);
      setProcessingAnalysisModeGameId(null);
      setGameAnalysisGameId(null);
    }
    // Step 3 (index 2): Open ChooseAnalysisMode modal
    else if (stepFocused === 2) {
      console.log("Tutorial Step 3: Opening ChooseAnalysisMode modal");
      setChooseAnalysisModeGameId(firstGame.id);
      // Close other modals
      setOpenGameId(null);
      setProcessingAnalysisModeGameId(null);
      setGameAnalysisGameId(null);
    }
    // Step 4 (index 3): Open ProcessingAnalysisMode or GameAnalysis modal
    else if (stepFocused === 3) {
      console.log("Tutorial Step 4: Opening GameAnalysis modal");
      // For tutorial, directly show GameAnalysis with dummy data
      setGameAnalysisGameId(firstGame.id);
      // Set dummy v3Result for tutorial
      setV3AnalysisResult({
        summary: {
          criticalMistakes: [
            {
              moveNumber: 15,
              move: "Nxh5",
              analysis: "This move loses material and weakens your position significantly.",
              solution: "Better to play Bf4, maintaining piece coordination and central control."
            }
          ]
        },
        analysisId: "tutorial-dummy-id"
      });
      // Close other modals
      setOpenGameId(null);
      setChooseAnalysisModeGameId(null);
      setProcessingAnalysisModeGameId(null);
    }
    // Step 5 (index 4): Keep GameAnalysis modal open
    else if (stepFocused === 4) {
      console.log("Tutorial Step 5: GameAnalysis modal should be open");
      // Keep GameAnalysis open
      if (gameAnalysisGameId !== firstGame.id) {
        setGameAnalysisGameId(firstGame.id);
      }
    }
  }, [stepFocused, isTutorialPlay, displayGames]);

  useEffect(() => {
    const isCompleted = Object.values(analysisJobs).filter(
      (gameData) => gameData.status == "completed"
    );

    if (totalCompletedJobs < isCompleted.length) {
      setTotalCompletedJobs(isCompleted.length);
      const lastCompleted = isCompleted[isCompleted.length - 1];
      if (lastCompleted) {
        trackCustomEvent("AnalysisCompleted", lastCompleted.gameId);
        markIsAnalysisInStore(lastCompleted.gameId);
      }
      getTokenBalance({}).then((response) => {
        if (response.data != null) {
          const data = response.data;
          setToken(data);
          if (data.balance == 0) {
            getProfile({}).then((response) => {
              if (response.data != null) {
                const profileData = response.data;
                setProfile(data);
                if (
                  data.balance == 0 &&
                  profileData.username.length > 0 &&
                  profileData.discountInfo.hasActiveDiscount &&
                  profileData?.discountInfo?.startDate &&
                  !everShowOffer &&
                  !isFromGameHistory
                ) {
                  setOpenOffer(true);
                  setEverShowOffer(true);
                }
              }
            });
          }
        }
      });
    }
  }, [
    analysisJobs,
    totalCompletedJobs,
    getTokenBalance,
    setToken,
    getProfile,
    everShowOffer,
    isFromGameHistory,
    setOpenOffer,
    setEverShowOffer,
    setProfile,
  ]);

  // Ensure that when games are loaded after analyses have already completed
  // (e.g. user analyzed a game on another page, then navigates here),
  // we still mark the corresponding games as `is_analysis` in the local store
  // without requiring a manual "Update Games" refresh.
  useEffect(() => {
    if (!currentGames || currentGames.length === 0) return;

    const completedJobs = Object.values(analysisJobs).filter(
      (job) => job.status === "completed"
    );

    if (completedJobs.length === 0) return;

    completedJobs.forEach((job) => {
      markIsAnalysisInStore(job.gameId);
    });
  }, [currentGames, analysisJobs]);
  const getAnalysisButtonContent = (gameId: string | number, game: Game) => {
    const job = getJobByGameId(gameId);

    if (game.isAnalysis || (job && job.status === "completed")) {
      return {
        text: "View Analysis",
        icon: <Eye className="h-4 w-4 mr-1" />,
        className:
          "border-2 text-[12px] 2xl:text-[14px] border-white bg-gradient-to-b from-[#0AD847] to-[#018F34] hover:[#018F34] hover:to-[#018F34] text-white shadow-sm ring-1 ring-green-200",
        onClick: async () => {
          try {
            setDisabled(true);
            setGameId(gameId);
            console.log("📤 [View Analysis] Fetching v2 and v3 last-analysis for game:", gameId);

            const pgnHash = createPgnHash(game.pgn);
            console.log("📤 [View Analysis] PGN Hash:", pgnHash);

            // Fetch from both v2 and v3 endpoints in parallel
            const [v2Analysis, v3Analysis] = await Promise.all([
              fetchLastAnalysisV2(pgnHash, sessionId),
              fetchLastAnalysisV3(pgnHash, sessionId)
            ]);

            console.log("📥 [View Analysis] V2 Response:", v2Analysis);
            console.log("📥 [View Analysis] V3 Response:", v3Analysis);

            // Mark as viewed if needed
            if (game.hasViewedAnalysis === false) {
              console.log("📝 [View Analysis] Marking analysis as viewed for game:", game.id);
              const res = await viewAnalysisResult(game.id);
              if (res?.success) {
                try {
                  game.hasViewedAnalysis = true as any;
                } catch (e) {
                  // if game is immutable, we'll still rely on store update
                }
              }
            }

            // Store both v2 and v3 results
            setV2AnalysisData(v2Analysis);
            setShortAnalysisData(v3Analysis);

            if (v3Analysis?.success && v3Analysis.data) {
              console.log("✅ [View Analysis] V3 Analysis found, opening ChooseAnalysisMode");
              setDisabled(false);

              // Open ChooseAnalysisMode dialog with both v2 and v3 data
              setChooseAnalysisModeGameId(gameId);

              markHasViewedAnalysisInStore(game.id);
            } else {
              console.log("⚠️ [View Analysis] No v3 analysis found in response");
              setDisabled(false);

              if (job && job.result) {
                console.log("📦 [View Analysis] Using job result as fallback");
                setShortAnalysisData({ data: job.result });
                setChooseAnalysisModeGameId(gameId);
                markHasViewedAnalysisInStore(game.id);
              } else {
                console.error("❌ [View Analysis] No analysis found for this game");
                setOpenGameId(gameId);
              }
            }
          } catch (error) {
            console.error("❌ [View Analysis] Error fetching analysis:", error);
            setDisabled(false);

            // Fallback to job result if available
            if (job && job.result) {
              console.log("📦 [View Analysis] Using job result as error fallback");
              setShortAnalysisData({ data: job.result });
              setChooseAnalysisModeGameId(gameId);
            } else {
              setOpenGameId(gameId);
            }
          }
        },
      };
    }

    if (job) {
      switch (job.status) {
        case "pending":
        case "processing":
        case "waiting":
        case "finalizing":
          // Show normal "Analyze" button but open ChooseAnalysisMode instead
          return {
            text: "View Analysis",
            icon: <Eye className="h-4 w-4 mr-1" />,
            className:
              "border-2 text-[12px] 2xl:text-[14px] border-white bg-gradient-to-b from-[#0AD847] to-[#018F34] hover:[#018F34] hover:to-[#018F34] text-white shadow-sm ring-1 ring-green-200",
            onClick: () => {
              // Open ChooseAnalysisMode to view progress
              setChooseAnalysisModeGameId(gameId);
            },
          };
        case "failed":
          return {
            text: "Retry",
            icon: <AlertCircle className="h-4 w-4 mr-2" />,
            className:
              "bg-red-600 hover:bg-red-700 border border-white text-white shadow-sm ring-1 ring-red-200",
            onClick: () => {
              trackCustomEvent("RetryAnalysis", gameId);

              setOpenGameId(gameId);
            },
          };
      }
    }

    return {
      text: "Analyze",
      icon: <ChartNoAxesColumn className="h-4 w-4 mr-2" />,
      className:
        "border border-[#BDD0F9] bg-gradient-to-b from-blue-600 to-[#221AE9] hover:from-blue-700 hover:to-blue-800 text-white shadow-md",
      onClick: () => {
        setOpenGameId(gameId);
        trackCustomEvent("StartAnalysis", gameId);
      },
    };
  };

  const displayTimeControl = (tc: string) => {
    if (!tc || !tc.trim()) {
      return (
        <span className="text-gray-400 italic flex items-center">
          <Clock className="h-3 w-3 mr-1" /> N/A
        </span>
      );
    }
    return tc;
  };

  const displayOpening = (op: string) => {
    if (!op || op.toLowerCase().includes("unknown")) {
      return (
        <span className="text-gray-400 italic flex items-center">
          <BookOpen className="h-3 w-3 mr-1" /> Not Available
        </span>
      );
    }
    return op;
  };

  const displayMoves = (moves: number | string) => {
    if (!moves || moves === "N/A") {
      return "N/A";
    }

    const numMoves = typeof moves === "string" ? parseInt(moves) : moves;

    return numMoves;
  };

  if (isLoading && !isTutorialPlay) {
    return <GamesListSkeleton desktopRows={10} mobileCards={8} />;
  }

  if (error && !isTutorialPlay) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center mb-4">
        <AlertCircle className="h-5 w-5 mr-2" />
        <span>{error.message}</span>
        <a
          href="/login"
          className="ml-4 bg-red-600 text-white px-3 py-1 rounded"
        >
          Login Again
        </a>
      </div>
    );
  }

  if (games.length === 0 && !isTutorialPlay) {
    return (
      <div className="w-[calc(100%+32px)] bg-[#FAFDFF] lg:bg-white lg:w-full flex flex-col items-center justify-center gap-[16px] p-[16px] lg:p-[32px] border-t lg:border border-[#C0CED4] lg:rounded-[8px] mb-[16px] mx-[-16px] lg:mx-0">
        <Image src={"/icons/game-history-empty.svg"} alt="empty" width={132} height={120} />
        <div className="text-center">
          <h3 className="font-semibold text-[18px] leading-[140%] mb-[4px]">No Games available</h3>
          <p className="text-[16px] leading-[140%] text-[#585858]">Play against AI or play on Chess.com to <br />see your Games here.</p>
        </div>
        <Button
          onClick={() => {
            router.push("/playground/play-vs-ai");
          }}
          className="flex md:w-[350px] relative justify-center items-center w-full gap-[4px] p-[10px] text-[14px] font-medium leading-[20px] text-[#E6F7FE] bg-[#221AE9] rounded-full border border-[#1B14CC] shadow-[0px_0px_1px_2px_rgba(34,26,233,.2)] after:content-[''] after:w-full after:h-full after:absolute after:top-0 after:left-0 after:rounded-full after:shadow-inset after:shadow-[0px_0px_0px_2px_rgba(78,71,255,1)] before:content-[''] before:w-full before:h-full before:absolute before:top-0 before:left-0 before:rounded-full before:shadow-inset before:shadow-[0px_2px_2px_0px_rgba(28,23,166,1)] before:z-10 hover:bg-[#2d25ea] hover:after:hidden hover:before:hidden"
        >
          You vs AI
        </Button>
      </div>
    );
  }

  return (
    <div className="p-0 md:p-4 xl:p-0">
      {/* Modal Components - Rendered for both mobile and desktop */}
      {displayGames.map((game) => (
        <React.Fragment key={`modals-${game.id}`}>
          <AnalyzeGameHistory
            open={openGameId === game.id}
            onOpenChange={(o) => setOpenGameId(o ? game.id : null)}
            game={game}
            autoStart={autoStartGameId === game.id}
            onAutoStartComplete={() => {
              setAutoStartGameId(null);
            }}
            onAnalysisStarted={() => {
              setChooseAnalysisModeGameId(game.id);
            }}
            onShortAnalysisReceived={(data) => {
              console.log("📥 GameList received short-analysis data:", data);
              setShortAnalysisData(data);
            }}
          />

          <ChooseAnalysisMode
            open={chooseAnalysisModeGameId === game.id}
            onOpenChange={(o) => setChooseAnalysisModeGameId(o ? game.id : null)}
            game={game}
            shortAnalysisData={shortAnalysisData}
            v2AnalysisData={v2AnalysisData}
            onOpenProcessingMode={() => {
              console.log("🔄 Opening ProcessingAnalysisMode from GameList");
              setProcessingAnalysisModeGameId(game.id);
            }}
            onOpenGameAnalysis={(v3Result) => {
              console.log("🎯 Opening GameAnalysis directly from ChooseAnalysisMode");
              console.log("📦 Received v3Result:", v3Result);
              setV3AnalysisResult(v3Result);
              setGameAnalysisGameId(game.id);
            }}
          />

          <ProcessingAnalysisMode
            open={processingAnalysisModeGameId === game.id}
            // open={true}
            onOpenChange={(o) => setProcessingAnalysisModeGameId(o ? game.id : null)}
            game={game}
            onOpenGameAnalysis={(v3Result) => {
              console.log("🎯 Opening GameAnalysis from GameList");
              console.log("📦 Received v3Result from ProcessingAnalysisMode:", v3Result);
              setV3AnalysisResult(v3Result);
              setGameAnalysisGameId(game.id);
            }}
          />

          <GameAnalysis
            open={gameAnalysisGameId === game.id}
            onOpenChange={(o) => setGameAnalysisGameId(o ? game.id : null)}
            v3Result={v3AnalysisResult}
          />
        </React.Fragment>
      ))}

      {/* Desktop View */}
      {!isMobile && (
        <div className="hidden lg:block overflow-hidden rounded-lg border border-gray-200">
          <div
            className="grid bg-blue-100 py-3 text-[14px] --xs font-medium text-gray-700"
            style={{ gridTemplateColumns: DESKTOP_GRID_TEMPLATE }}
          >
            <div className="px-2 text-left invisible">#</div>
            <div className="px-4 text-left">Date</div>
            <div className="px-2 text-left">Time Control</div>
            <div className="px-2 text-left">Result</div>
            <div className="px-4 text-left">Opponent</div>
            <div className="px-2 text-left">Rating</div>
            <div className="px-2 text-left">Game Type</div>
            <div className="px-2 text-left">Moves</div>
            <div className="px-4 text-left">Opening</div>
            <div className="px-2 text-left">Source</div>
            <div className="px-4 text-center">Actions</div>
          </div>

          <div className="divide-y divide-gray-200 text-[14px] --xs xl:text-[14px] --sm">
            {/* Show real games for tutorial, DummyList is no longer needed */}
            {displayGames.map((game, idx) => {
                const btn = getAnalysisButtonContent(game.id, game);
                const isNew =
                  (!game.hasViewedAnalysis && game.isAnalysis) ||
                  isNewlyImported(game.id);
                const indexInPage =
                  (paginationProps.currentPage - 1) *
                    paginationProps.itemsPerPage +
                  idx +
                  1;
                return (
                  <div
                    key={game.id}
                    className={`grid relative transition-colors duration-150 ${isNew ? "" : "even:bg-blue-50 odd:bg-white hover:bg-blue-50"}`}
                    style={{ gridTemplateColumns: DESKTOP_GRID_TEMPLATE }}
                    data-tutorial={idx === 0 ? "1" : null}
                  >
                    <div className="flex items-center px-2 py-3 border-r border-gray-200">
                      {/* {isNew && (
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2" />
                    )} */}
                      <span className="w-6 text-center text-gray-500">
                        {indexInPage}
                      </span>
                    </div>

                    <div className="flex items-center px-4 py-3">{game.date}</div>

                    <div className="flex items-center px-2 py-3">
                      {displayTimeControl(game.timeControl)}
                    </div>

                    <div className="flex items-center px-2 py-3">
                      {(() => {
                        const r = getResultData(game.result);
                        return <span className={r.className}>{r.text}</span>;
                      })()}
                    </div>

                    <div className="flex items-center px-4 py-3 truncate">
                      {game.opponent || "Unknown Player"}
                    </div>

                    <div className="flex items-center px-2 py-3">
                      {game.rating || "N/A"}
                    </div>

                    <div className="flex items-center px-2 py-3 truncate">
                      {game.timeClass || "Unknown Game Type"}
                    </div>

                    <div className="flex items-center px-2 py-3">
                      {displayMoves(game.moves)}
                    </div>

                    <div className="flex items-center px-4 py-3">
                      {displayOpening(game.opening)}
                    </div>

                    <div className="flex items-center px-2 py-3">
                      {game.source || "Unknown"}
                    </div>

                    <div className="px-4 py-3 min-w-[144px] min-h-[40px]">
                      {(() => {
                        const btn = getAnalysisButtonContent(game.id, game);
                        return (
                          <button
                            className={`${btn.className} h-8 w-full rounded-3xl text-[14px] --xs flex justify-center items-center transition-colors duration-150 py-2 min-h-[40px]`}
                            onClick={btn.onClick}
                            disabled={disabled && game.id == gameId}
                          >
                            {disabled && game.id == gameId ? (
                              <Loader2 className={`h-4 w-4 mr-1 animate-spin`} />
                            ) : (
                              btn.icon
                            )}
                            <span className="hidden sm:block max-w-[90px]">
                              {btn.text}
                            </span>
                            <span className="block sm:hidden">
                              {btn.text}
                            </span>
                          </button>
                        );
                      })()}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Mobile View */}
      {isMobile && (
        <div className="lg:hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] md:gap-2 text-[14px] --xs">
            {/* Show real games for tutorial on mobile too */}
            {displayGames.map((game) => (
                <GameCard
                  key={game.id}
                  gameData={game}
                  isNewlyImported={isNewlyImported(game.id)}
                />
              ))}
          </div>
        </div>
      )}

      {displayGames.length > 0 && !isTutorialPlay && <PaginationControls {...paginationProps} />}
    </div>
  );
};

export default GamesList;
