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
  /** Presentation variant. "default" preserves the legacy look used by /my-statistics
   * and other consumers. "v2" opts into the revamped Game History design. */
  variant?: "default" | "v2";
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
      `${endpoint}/v2/analyze/last-analysis/${pgnHash}?t=${Date.now()}`,
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
      `${endpoint}/v3/analyze/last-analysis/${pgnHash}?t=${Date.now()}`,
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

// Crisp white ring + a glow in the button's own color. Uses an inline style
// (not a Tailwind class) so it can never be dropped by class-merging/purge.
const v2GlowStyle = (r: number, g: number, b: number): React.CSSProperties => ({
  boxShadow: `0 0 0 2px #ffffff, 0 0 10px 3px rgba(${r}, ${g}, ${b}, 0.6)`,
});

const GamesList: React.FC<GamesListProps> = ({
  games,
  currentGames,
  isLoading,
  error,
  handleRetryFetch,
  paginationProps,
  recentlyImportedIds = [],
  variant = "default",
}) => {
  const isV2 = variant === "v2";
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
      setOpenGameId(null);
      setChooseAnalysisModeGameId(null);
      setProcessingAnalysisModeGameId(null);
      setGameAnalysisGameId(null);
    }
    // Step 2 (index 1): Open AnalyzeGameHistory modal
    else if (stepFocused === 1) {
      setOpenGameId(firstGame.id);
      // Close other modals
      setChooseAnalysisModeGameId(null);
      setProcessingAnalysisModeGameId(null);
      setGameAnalysisGameId(null);
    }
    // Step 3 (index 2): Open ChooseAnalysisMode modal
    else if (stepFocused === 2) {
      setChooseAnalysisModeGameId(firstGame.id);
      // Close other modals
      setOpenGameId(null);
      setProcessingAnalysisModeGameId(null);
      setGameAnalysisGameId(null);
    }
    // Step 4 (index 3): Open ProcessingAnalysisMode or GameAnalysis modal
    else if (stepFocused === 3) {
      // For tutorial, directly show GameAnalysis with dummy data
      setGameAnalysisGameId(firstGame.id);
      // Set dummy v3Result for tutorial
      setV3AnalysisResult({
        summary: {
          criticalMistakes: [
            {
              "fen": "r4rk1/ppp2pbp/2npbqp1/4p3/1P2P3/P1NP1N2/2P1BPPP/R2Q1RK1 b - - 0 10",
              "move": "Nc3",
              "type": "Miss",
              "arrows": {
                "badMove": {
                  "piece": "p",
                  "endSquare": "b5",
                  "startSquare": "b7"
                },
                "goodMove": {
                  "piece": "n",
                  "endSquare": "d4",
                  "startSquare": "c6"
                }
              },
              "analysis": "This choice weakens your position quite a bit and hands your opponent more chances.",
              "fenAfter": "r4rk1/p1p2pbp/2npbqp1/1p2p3/1P2P3/P1NP1N2/2P1BPPP/R2Q1RK1 w - - 0 11",
              "solution": "Here, d5 would keep the position much healthier.",
              "moveNumber": 44,
              "keyEvaluation": -1.50,
              "mistakeLogId": "212adc63-f76f-4aba-b659-ec425134fb2b",
              "saved": false,
              "savedDate": null
            },
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
                // Bugfix: `data` here is the token-balance payload from `getTokenBalance`.
                // Overwriting the profile store with it removes `discountInfo`, which breaks
                // the special-offer (discounted monthly price) UI in the pricing modal.
                setProfile(profileData);
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
          "border-2 lg:text-[12px] xxl:text-[14px] border-white bg-gradient-to-b from-[#0AD847] to-[#018F34] hover:[#018F34] hover:to-[#018F34] text-white shadow-sm ring-1 ring-green-200",
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

            if (v3Analysis?.success && v3Analysis.data?.summary) {
              console.log("✅ [View Analysis] V3 Analysis found, opening GameAnalysis directly");
              setDisabled(false);

              // Skip ChooseAnalysisMode — show the mistakes result right away
              setV3AnalysisResult({
                ...v3Analysis.data,
                analysisId: v3Analysis.data.analysisId || v3Analysis.data.id,
              });
              setGameAnalysisGameId(gameId);

              markHasViewedAnalysisInStore(game.id);
            } else if (v3Analysis?.success && v3Analysis.data) {
              // v3 data without a summary — the choose dialog still handles this shape
              setDisabled(false);
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
                setAutoStartGameId(gameId);
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
              setAutoStartGameId(gameId);
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
              // Analysis still running — show the loading dialog directly
              setProcessingAnalysisModeGameId(gameId);
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

              setAutoStartGameId(gameId);
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
        // Skip the depth dialog — auto-run the Standard analysis headlessly
        setAutoStartGameId(gameId);
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

  // --- v2-only presentation helpers (no effect on the default variant) ---
  const displaySource = (src: string) => {
    if (!src) return "Unknown";
    const map: Record<string, string> = {
      chesscom: "Chess.com",
      "chess.com": "Chess.com",
      vs_ai: "Against AI",
      ai: "Against AI",
      "against ai": "Against AI",
      // The API labels these "VS AI Game"; the filter above the table calls the
      // same thing "Against AI", so match it.
      vs_ai_game: "Against AI",
      "vs ai game": "Against AI",
      "vs ai": "Against AI",
      pgn_upload: "Import",
      "pgn upload": "Import",
      "pdn upload": "Import",
      import: "Import",
      // The API also labels manually-added games "other game", which fell
      // through the map and rendered raw in the Source column.
      other_game: "Import",
      "other game": "Import",
      other: "Import",
    };
    return map[src.toLowerCase().trim()] ?? src;
  };

  const renderEloChange = (elo: string | number | undefined | null) => {
    const raw = Number(String(elo ?? "0").replace("+", ""));
    if (!raw || Number.isNaN(raw)) {
      return <span className="text-gray-400">—</span>;
    }
    const positive = raw > 0;
    return (
      <span
        className={
          positive
            ? "text-green-600 font-semibold"
            : "text-red-500 font-semibold"
        }
      >
        {positive ? `+${raw}` : `${raw}`}
      </span>
    );
  };

  const getV2ButtonPresentation = (btn: { text: string }) => {
    if (btn.text === "View Analysis") {
      return {
        label: "See Mistakes",
        icon: <Eye className="h-4 w-4 mr-1" />,
        className: "bg-gradient-to-b from-[#0AD847] to-[#018F34] hover:opacity-90 text-white",
        style: v2GlowStyle(10, 216, 71),
      };
    }
    if (btn.text === "Retry") {
      return {
        label: "Retry",
        icon: <AlertCircle className="h-4 w-4 mr-1" />,
        className: "bg-red-600 hover:bg-red-700 text-white",
        style: v2GlowStyle(220, 38, 38),
      };
    }
    return {
      label: "Analyze Mistakes",
      icon: <ChartNoAxesColumn className="h-4 w-4 mr-1" />,
      className: "bg-[#221AE9] hover:bg-[#1B14CC] text-white",
      style: v2GlowStyle(34, 26, 233),
    };
  };

  if (isLoading && !isTutorialPlay) {
    return <GamesListSkeleton desktopRows={10} mobileCards={8} />;
  }

  // if (error && !isTutorialPlay) {
  //   return (
  //     <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center mb-4">
  //       <AlertCircle className="h-5 w-5 mr-2" />
  //       <span>{error.message}</span>
  //       <a
  //         href="/login"
  //         className="ml-4 bg-red-600 text-white px-3 py-1 rounded"
  //       >
  //         Login Again
  //       </a>
  //     </div>
  //   );
  // }

  if (error || games.length === 0 && !isTutorialPlay) {
    return (
      <div className="w-[calc(100%+32px)] bg-[#FAFDFF] lg:bg-white lg:w-full flex flex-col items-center justify-center gap-[16px] p-[16px] lg:p-[32px] border-t lg:border border-[#C0CED4] lg:rounded-[8px] mb-[16px] mx-[-16px] lg:mx-0">
        <Image src={"/icons/game-history-empty.svg"} alt="empty" width={132} height={120} />
        <div className="text-center">
          <h3 className="font-semibold text-[18px] leading-[140%] mb-[4px]">You have not played any games yet</h3>
          <p className="text-[16px] leading-[140%] text-[#585858]">Play against AI or connect your Chess.com to see your Games here.</p>
        </div>
        <Button
          onClick={() => {
            router.push("/playground/play-vs-ai");
          }}
          className="flex md:w-[350px] relative justify-center items-center w-full gap-[4px] p-[10px] text-[14px] font-medium leading-[20px] text-[#E6F7FE] bg-[#221AE9] rounded-full border border-[#1B14CC] shadow-[0px_0px_1px_2px_rgba(34,26,233,.2)] after:content-[''] after:w-full after:h-full after:absolute after:top-0 after:left-0 after:rounded-full after:shadow-inset after:shadow-[0px_0px_0px_2px_rgba(78,71,255,1)] before:content-[''] before:w-full before:h-full before:absolute before:top-0 before:left-0 before:rounded-full before:shadow-inset before:shadow-[0px_2px_2px_0px_rgba(28,23,166,1)] before:z-10 hover:bg-[#2d25ea] hover:after:hidden hover:before:hidden"
        >
          Play Now
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
              // Tutorial keeps the legacy ChooseAnalysisMode step; real runs
              // jump straight to the loading dialog.
              if (isTutorialPlay) {
                setChooseAnalysisModeGameId(game.id);
              } else {
                setProcessingAnalysisModeGameId(game.id);
              }
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
            className={`grid py-3 text-[14px] --xs font-medium ${
              isV2 ? "bg-[#EEF1FE] text-[#374151]" : "bg-blue-100 text-gray-700"
            }`}
            style={{ gridTemplateColumns: DESKTOP_GRID_TEMPLATE }}
          >
            <div className="px-2 text-left invisible">#</div>
            <div className="px-4 text-left">Date</div>
            <div className="px-2 text-left">Time Control</div>
            <div className="px-2 text-left">Result</div>
            <div className="px-4 text-left">Opponent</div>
            <div className="px-2 text-left">Rating</div>
            <div className="px-2 text-left">{isV2 ? "Elo Change" : "Game Type"}</div>
            <div className="px-2 text-left">Moves</div>
            <div className="px-4 text-left">Opening</div>
            <div className="px-2 text-left">Source</div>
            <div className="px-4 text-center">Actions</div>
          </div>

          <div className="divide-y divide-gray-200 text-[14px] --xs xl:text-[14px] --sm">
            {/* Show real games for tutorial, DummyList is no longer needed */}
            {/* {true ? ( */}
            {isTutorialPlay ? (
              <DummyGameList variant={variant} />
            ) : (
              <>
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
                          {isV2
                            ? renderEloChange(game.eloChange)
                            : game.timeClass || "Unknown Game Type"}
                        </div>

                        <div className="flex items-center px-2 py-3">
                          {displayMoves(game.moves)}
                        </div>

                        <div className="flex items-center px-4 py-3">
                          {displayOpening(game.opening)}
                        </div>

                        <div className="flex items-center px-2 py-3">
                          {isV2
                            ? displaySource(game.source)
                            : game.source || "Unknown"}
                        </div>

                        <div className="px-4 py-3 min-w-[180px] min-h-[40px]">
                          {(() => {
                            const btn = getAnalysisButtonContent(game.id, game);
                            const v2 = isV2 ? getV2ButtonPresentation(btn) : null;
                            const isBusy =
                              (disabled && game.id == gameId) ||
                              autoStartGameId === game.id;
                            return (
                              <button
                                className={`${v2 ? v2.className : btn.className} h-8 w-full ${
                                  isV2 ? "rounded-full" : "rounded-3xl"
                                } text-[14px] --xs flex justify-center items-center transition-colors duration-150 py-2 min-h-[40px]`}
                                style={v2 ? v2.style : undefined}
                                onClick={btn.onClick}
                                disabled={isBusy}
                              >
                                {isBusy ? (
                                  <Loader2 className={`h-4 w-4 mr-1 animate-spin`} />
                                ) : v2 ? (
                                  v2.icon
                                ) : (
                                  btn.icon
                                )}
                                {/* No width cap here — "Analyze Mistakes" has to
                                    stay on one line. */}
                                <span className="whitespace-nowrap">
                                  {v2 ? v2.label : btn.text}
                                </span>
                              </button>
                            );
                          })()}
                        </div>
                      </div>
                    );
                  })}
              </>
            )}
          </div>
        </div>
      )}

      {/* Mobile View */}
      {isMobile && (
        <div className="lg:hidden">
          <div className="grid md:grid-cols-2 md:gap-2 text-[14px] --xs">
            {/* Show real games for tutorial on mobile too */}
            {displayGames.map((game) => (
                <GameCard
                  key={game.id}
                  gameData={game}
                  isNewlyImported={isNewlyImported(game.id)}
                  variant={variant}
                />
              ))}
          </div>
        </div>
      )}

      {displayGames.length > 0 && !isTutorialPlay && <PaginationControls {...paginationProps} variant={variant} />}
    </div>
  );
};

export default GamesList;

const DummyGameList = ({
  variant = "default",
}: {
  variant?: "default" | "v2";
}) => {
  const isV2 = variant === "v2";
  const dummyList = [
    {
      id: "d4c02ecd-7fd2-4aa0-b206-8deb3ef59473",
      userId: "96f24676-c1e8-40f2-b052-0bf0166df14f",
      username: "ainaatub",
      pgn: '[Event "Live Chess"]\n[Site "Chess.com"]\n[Date "2025.10.11"]\n[Round "-"]\n[White "a2thedeep"]\n[Black "ainaatub"]\n[Result "0-1"]\n[CurrentPosition "3k1b1r/p1N1pppp/1p6/7N/5B2/2P2b2/PP2nP1P/R4RK1 w - - 1 17"]\n[Timezone "UTC"]\n[ECO "B01"]\n[ECOUrl "https://www.chess.com/openings/Scandinavian-Defense-Mieses-Kotrc-Variation-3.Nc3-Qe5"]\n[UTCDate "2025.10.11"]\n[UTCTime "14:13:39"]\n[WhiteElo "732"]\n[BlackElo "684"]\n[TimeControl "900+10"]\n[Termination "ainaatub won by checkmate"]\n[StartTime "14:13:39"]\n[EndDate "2025.10.11"]\n[EndTime "14:18:32"]\n[Link "https://www.chess.com/game/live/144167582998"]\n\n1. e4 {[%clk 0:15:09.9]} 1... d5 {[%clk 0:15:06.2]} 2. exd5 {[%clk 0:15:15.1]} 2... Qxd5 {[%clk 0:15:14.7]} 3. Nc3 {[%clk 0:15:24.5]} 3... Qe5+ {[%clk 0:15:21.6]} 4. Nge2 {[%clk 0:15:30.9]} 4... Nf6 {[%clk 0:15:29.4]} 5. d4 {[%clk 0:15:40.1]} 5... Qe6 {[%clk 0:15:34.6]} 6. g4 {[%clk 0:15:37.6]} 6... Qc6 {[%clk 0:15:34.2]} 7. Ng3 {[%clk 0:15:33.1]} 7... Bxg4 {[%clk 0:15:33.1]} 8. Bb5 {[%clk 0:15:26.1]} 8... Qxb5 {[%clk 0:14:58.5]} 9. Nxb5 {[%clk 0:15:23.1]} 9... Bxd1 {[%clk 0:15:05.2]} 10. Nxc7+ {[%clk 0:15:32.9]} 10... Kd8 {[%clk 0:15:05.2]} 11. Nxa8 {[%clk 0:15:41.7]} 11... Bf3 {[%clk 0:15:10.9]} 12. O-O {[%clk 0:15:38.7]} 12... b6 {[%clk 0:15:17.9]} 13. Bf4 {[%clk 0:15:35.7]} 13... Nc6 {[%clk 0:15:15.7]} 14. Nc7 {[%clk 0:15:35.5]} 14... Nh5 {[%clk 0:15:05]} 15. Nxh5 {[%clk 0:15:38]} 15... Nxd4 {[%clk 0:15:08.6]} 16. c3 {[%clk 0:15:24.6]} 16... Ne2# {[%clk 0:15:14.6]} 0-1\n',
      date: "2025-04-13",
      time_control: "10 + 0",
      timeControl: "10 + 0",
      result: "WIN",
      opponent: "Guest1234",
      rating: 1950,
      elo_change: +12,
      eloChange: +12,
      moves: 45,
      opening_eco: "B00",
      opening_name: "Sicilian Defense",
      opening: "Sicilian Defense",
      opening_moves: "1. e4",
      source: "PDN Upload",
      archive_url: "https://api.chess.com/pub/player/ainaatub/games/2025/10",
      color: "Black",
      playerColor: "Black",
      remaining_time: 914,
      time_class: "rapid",
      timeClass: "rapid",
      rated: true,
      termination: "ainaatub won by checkmate",
      accuracies_white: 60.56,
      accuracies_black: 60.56,
      end_time: 1760192312,
      is_analysis: false,
      isAnalysis: false,
      hasViewedAnalysis: false,
      createdAt: "2025-10-13T02:59:31.810Z",
      updatedAt: "2025-10-20T04:42:15.041Z",
    },
    {
      id: "d4c02ecd-7fd2-4aa0-b206-8deb3ef59473",
      userId: "96f24676-c1e8-40f2-b052-0bf0166df14f",
      username: "ainaatub",
      pgn: '[Event "Live Chess"]\n[Site "Chess.com"]\n[Date "2025.10.11"]\n[Round "-"]\n[White "a2thedeep"]\n[Black "ainaatub"]\n[Result "0-1"]\n[CurrentPosition "3k1b1r/p1N1pppp/1p6/7N/5B2/2P2b2/PP2nP1P/R4RK1 w - - 1 17"]\n[Timezone "UTC"]\n[ECO "B01"]\n[ECOUrl "https://www.chess.com/openings/Scandinavian-Defense-Mieses-Kotrc-Variation-3.Nc3-Qe5"]\n[UTCDate "2025.10.11"]\n[UTCTime "14:13:39"]\n[WhiteElo "732"]\n[BlackElo "684"]\n[TimeControl "900+10"]\n[Termination "ainaatub won by checkmate"]\n[StartTime "14:13:39"]\n[EndDate "2025.10.11"]\n[EndTime "14:18:32"]\n[Link "https://www.chess.com/game/live/144167582998"]\n\n1. e4 {[%clk 0:15:09.9]} 1... d5 {[%clk 0:15:06.2]} 2. exd5 {[%clk 0:15:15.1]} 2... Qxd5 {[%clk 0:15:14.7]} 3. Nc3 {[%clk 0:15:24.5]} 3... Qe5+ {[%clk 0:15:21.6]} 4. Nge2 {[%clk 0:15:30.9]} 4... Nf6 {[%clk 0:15:29.4]} 5. d4 {[%clk 0:15:40.1]} 5... Qe6 {[%clk 0:15:34.6]} 6. g4 {[%clk 0:15:37.6]} 6... Qc6 {[%clk 0:15:34.2]} 7. Ng3 {[%clk 0:15:33.1]} 7... Bxg4 {[%clk 0:15:33.1]} 8. Bb5 {[%clk 0:15:26.1]} 8... Qxb5 {[%clk 0:14:58.5]} 9. Nxb5 {[%clk 0:15:23.1]} 9... Bxd1 {[%clk 0:15:05.2]} 10. Nxc7+ {[%clk 0:15:32.9]} 10... Kd8 {[%clk 0:15:05.2]} 11. Nxa8 {[%clk 0:15:41.7]} 11... Bf3 {[%clk 0:15:10.9]} 12. O-O {[%clk 0:15:38.7]} 12... b6 {[%clk 0:15:17.9]} 13. Bf4 {[%clk 0:15:35.7]} 13... Nc6 {[%clk 0:15:15.7]} 14. Nc7 {[%clk 0:15:35.5]} 14... Nh5 {[%clk 0:15:05]} 15. Nxh5 {[%clk 0:15:38]} 15... Nxd4 {[%clk 0:15:08.6]} 16. c3 {[%clk 0:15:24.6]} 16... Ne2# {[%clk 0:15:14.6]} 0-1\n',
      date: "2024-03-20",
      time_control: "10 + 0",
      timeControl: "10 + 0",
      result: "LOSS",
      opponent: "GrandMaster123",
      rating: 1950,
      elo_change: -8,
      eloChange: -8,
      moves: 32,
      opening_eco: "B00",
      opening_name: "Queen's Gambit",
      opening: "Queen's Gambit",
      opening_moves: "1. e4",
      source: "Chess.com",
      archive_url: "https://api.chess.com/pub/player/ainaatub/games/2025/10",
      color: "Black",
      playerColor: "Black",
      remaining_time: 914,
      time_class: "rapid",
      timeClass: "rapid",
      rated: true,
      termination: "ainaatub won by checkmate",
      accuracies_white: 60.56,
      accuracies_black: 60.56,
      end_time: 1760192312,
      is_analysis: true,
      isAnalysis: true,
      hasViewedAnalysis: false,
      createdAt: "2025-10-13T02:59:31.810Z",
      updatedAt: "2025-10-20T04:42:15.041Z",
    },
    {
      id: "d4c02ecd-7fd2-4aa0-b206-8deb3ef59474",
      userId: "96f24676-c1e8-40f2-b052-0bf0166df14f",
      username: "ainaatub",
      pgn: '[Event "Live Chess"]\n[Site "Chess.com"]\n[Date "2025.10.11"]\n[Round "-"]\n[White "a2thedeep"]\n[Black "ainaatub"]\n[Result "0-1"]\n[CurrentPosition "3k1b1r/p1N1pppp/1p6/7N/5B2/2P2b2/PP2nP1P/R4RK1 w - - 1 17"]\n[Timezone "UTC"]\n[ECO "B01"]\n[ECOUrl "https://www.chess.com/openings/Scandinavian-Defense-Mieses-Kotrc-Variation-3.Nc3-Qe5"]\n[UTCDate "2025.10.11"]\n[UTCTime "14:13:39"]\n[WhiteElo "732"]\n[BlackElo "684"]\n[TimeControl "900+10"]\n[Termination "ainaatub won by checkmate"]\n[StartTime "14:13:39"]\n[EndDate "2025.10.11"]\n[EndTime "14:18:32"]\n[Link "https://www.chess.com/game/live/144167582998"]\n\n1. e4 {[%clk 0:15:09.9]} 1... d5 {[%clk 0:15:06.2]} 2. exd5 {[%clk 0:15:15.1]} 2... Qxd5 {[%clk 0:15:14.7]} 3. Nc3 {[%clk 0:15:24.5]} 3... Qe5+ {[%clk 0:15:21.6]} 4. Nge2 {[%clk 0:15:30.9]} 4... Nf6 {[%clk 0:15:29.4]} 5. d4 {[%clk 0:15:40.1]} 5... Qe6 {[%clk 0:15:34.6]} 6. g4 {[%clk 0:15:37.6]} 6... Qc6 {[%clk 0:15:34.2]} 7. Ng3 {[%clk 0:15:33.1]} 7... Bxg4 {[%clk 0:15:33.1]} 8. Bb5 {[%clk 0:15:26.1]} 8... Qxb5 {[%clk 0:14:58.5]} 9. Nxb5 {[%clk 0:15:23.1]} 9... Bxd1 {[%clk 0:15:05.2]} 10. Nxc7+ {[%clk 0:15:32.9]} 10... Kd8 {[%clk 0:15:05.2]} 11. Nxa8 {[%clk 0:15:41.7]} 11... Bf3 {[%clk 0:15:10.9]} 12. O-O {[%clk 0:15:38.7]} 12... b6 {[%clk 0:15:17.9]} 13. Bf4 {[%clk 0:15:35.7]} 13... Nc6 {[%clk 0:15:15.7]} 14. Nc7 {[%clk 0:15:35.5]} 14... Nh5 {[%clk 0:15:05]} 15. Nxh5 {[%clk 0:15:38]} 15... Nxd4 {[%clk 0:15:08.6]} 16. c3 {[%clk 0:15:24.6]} 16... Ne2# {[%clk 0:15:14.6]} 0-1\n',
      date: "2024-03-21",
      time_control: "15 + 5",
      timeControl: "15 + 5",
      result: "WIN",
      opponent: "Guest1234",
      rating: 1962,
      elo_change: 12,
      eloChange: 12,
      moves: 45,
      opening_eco: "B00",
      opening_name: "Sicilian Defense",
      opening: "Sicilian Defense",
      opening_moves: "1. e4",
      source: "Chess.com",
      archive_url: "https://api.chess.com/pub/player/ainaatub/games/2025/10",
      color: "Black",
      playerColor: "Black",
      remaining_time: 914,
      time_class: "rapid",
      timeClass: "rapid",
      rated: true,
      termination: "ainaatub won by checkmate",
      accuracies_white: 60.56,
      accuracies_black: 60.56,
      end_time: 1760192312,
      is_analysis: false,
      isAnalysis: false,
      hasViewedAnalysis: false,
      createdAt: "2025-10-13T02:59:31.810Z",
      updatedAt: "2025-10-20T04:42:15.041Z",
    },
    {
      id: "d4c02ecd-7fd2-4aa0-b206-8deb3ef59475",
      userId: "96f24676-c1e8-40f2-b052-0bf0166df14f",
      username: "ainaatub",
      pgn: '[Event "Live Chess"]\n[Site "Chess.com"]\n[Date "2025.10.11"]\n[Round "-"]\n[White "a2thedeep"]\n[Black "ainaatub"]\n[Result "0-1"]\n[CurrentPosition "3k1b1r/p1N1pppp/1p6/7N/5B2/2P2b2/PP2nP1P/R4RK1 w - - 1 17"]\n[Timezone "UTC"]\n[ECO "B01"]\n[ECOUrl "https://www.chess.com/openings/Scandinavian-Defense-Mieses-Kotrc-Variation-3.Nc3-Qe5"]\n[UTCDate "2025.10.11"]\n[UTCTime "14:13:39"]\n[WhiteElo "732"]\n[BlackElo "684"]\n[TimeControl "900+10"]\n[Termination "ainaatub won by checkmate"]\n[StartTime "14:13:39"]\n[EndDate "2025.10.11"]\n[EndTime "14:18:32"]\n[Link "https://www.chess.com/game/live/144167582998"]\n\n1. e4 {[%clk 0:15:09.9]} 1... d5 {[%clk 0:15:06.2]} 2. exd5 {[%clk 0:15:15.1]} 2... Qxd5 {[%clk 0:15:14.7]} 3. Nc3 {[%clk 0:15:24.5]} 3... Qe5+ {[%clk 0:15:21.6]} 4. Nge2 {[%clk 0:15:30.9]} 4... Nf6 {[%clk 0:15:29.4]} 5. d4 {[%clk 0:15:40.1]} 5... Qe6 {[%clk 0:15:34.6]} 6. g4 {[%clk 0:15:37.6]} 6... Qc6 {[%clk 0:15:34.2]} 7. Ng3 {[%clk 0:15:33.1]} 7... Bxg4 {[%clk 0:15:33.1]} 8. Bb5 {[%clk 0:15:26.1]} 8... Qxb5 {[%clk 0:14:58.5]} 9. Nxb5 {[%clk 0:15:23.1]} 9... Bxd1 {[%clk 0:15:05.2]} 10. Nxc7+ {[%clk 0:15:32.9]} 10... Kd8 {[%clk 0:15:05.2]} 11. Nxa8 {[%clk 0:15:41.7]} 11... Bf3 {[%clk 0:15:10.9]} 12. O-O {[%clk 0:15:38.7]} 12... b6 {[%clk 0:15:17.9]} 13. Bf4 {[%clk 0:15:35.7]} 13... Nc6 {[%clk 0:15:15.7]} 14. Nc7 {[%clk 0:15:35.5]} 14... Nh5 {[%clk 0:15:05]} 15. Nxh5 {[%clk 0:15:38]} 15... Nxd4 {[%clk 0:15:08.6]} 16. c3 {[%clk 0:15:24.6]} 16... Ne2# {[%clk 0:15:14.6]} 0-1\n',
      date: "2024-03-22",
      time_control: "5 + 0",
      timeControl: "5 + 0",
      result: "DRAW",
      opponent: "ProChess99",
      rating: 1938,
      elo_change: -12,
      eloChange: -12,
      moves: 55,
      opening_eco: "B00",
      opening_name: "French Defense",
      opening: "French Defense",
      opening_moves: "1. e4",
      source: "Chess.com",        
      archive_url: "https://api.chess.com/pub/player/ainaatub/games/2025/10",
      color: "White",
      playerColor: "White",
      remaining_time: 914,
      time_class: "blitz",
      timeClass: "blitz",
      rated: true,
      termination: "Game drawn by agreement",
      accuracies_white: 60.56,
      accuracies_black: 60.56,
      end_time: 1760192312,
      is_analysis: false,
      isAnalysis: false,
      hasViewedAnalysis: false,
      createdAt: "2025-10-13T02:59:31.810Z",
      updatedAt: "2025-10-20T04:42:15.041Z",
    },
  ];

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

  const displayMoves = (moves: number | string) => {
    if (!moves || moves === "N/A") {
      return "N/A";
    }

    const numMoves = typeof moves === "string" ? parseInt(moves) : moves;

    return numMoves;
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

  return (
    <>
      {dummyList.map((game, index) => (
        <div
          key={game.id}
          className={`grid relative transition-colors duration-150 even:bg-blue-50 odd:bg-white hover:bg-blue-50`}
          style={{ gridTemplateColumns: DESKTOP_GRID_TEMPLATE }}
          data-tutorial={index === 0 ? "1" : null}
        >
          <div className="flex items-center px-2 py-3 border-r border-gray-200">
            <span className="w-6 text-center text-gray-500">
              {index + 1}
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
            {isV2 ? (
              <span
                className={
                  Number(game.eloChange) >= 0
                    ? "text-green-600 font-semibold"
                    : "text-red-500 font-semibold"
                }
              >
                {Number(game.eloChange) > 0
                  ? `+${game.eloChange}`
                  : `${game.eloChange}`}
              </span>
            ) : (
              game.timeClass || "Unknown Game Type"
            )}
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
            {game.is_analysis ? (
              <button
                type="button"
                className={`lg:text-[12px] xxl:text-[14px] bg-gradient-to-b from-[#0AD847] to-[#018F34] hover:[#018F34] hover:to-[#018F34] text-white h-8 w-full ${
                  isV2
                    ? "rounded-full"
                    : "rounded-3xl border-2 border-white shadow-sm ring-1 ring-green-200"
                } text-[14px] --xs flex justify-center items-center transition-colors duration-150 py-2 min-h-[40px]`}
                style={isV2 ? v2GlowStyle(10, 216, 71) : undefined}
              >
                <Eye className="h-4 w-4 mr-1" />
                <span>{isV2 ? "See Mistakes" : "View Analysis"}</span>
              </button>
            ) : (
              <button
                type="button"
                className={`bg-gradient-to-b from-blue-600 to-[#221AE9] hover:from-blue-700 hover:to-blue-800 text-white h-8 w-full ${
                  isV2 ? "rounded-full" : "rounded-3xl border border-[#BDD0F9] shadow-md"
                } text-[14px] --xs flex justify-center items-center transition-colors duration-150 py-2 min-h-[40px]`}
                style={isV2 ? v2GlowStyle(34, 26, 233) : undefined}
              >
                <ChartNoAxesColumn className="h-4 w-4 mr-2" />
                <span>Analyze</span>
              </button>
            )}
          </div>
        </div>
      ))}
    </>
  );
};