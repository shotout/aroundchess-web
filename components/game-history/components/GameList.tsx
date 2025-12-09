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
import { DummyList } from "./DummyList";
import { useTutorial } from "@/components/TutorialProvider";
import { DummyCard } from "./DummyCard";
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

const fetchLastAnalysis = async (
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
      throw new Error(`Failed to fetch analysis: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching last analysis:", error);
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
  const { isTutorialPlay, dataTutorial } = useTutorial();
  const { setOpenOffer } = usePricingOffer();

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

      if (Array.isArray(gamesData)) {
        const idx = gamesData.findIndex((g: any) => g.id === id);
        // console.log("Found game index in store:", idx);
        if (idx !== -1) {
          const newGames = [...gamesData];
          newGames[idx] = { ...newGames[idx], is_analysis: true };
          // console.log("Marking game as viewed in store:", newGames);
          setGamesData(newGames);
        }
      }

      if (Array.isArray(otherGamesData)) {
        const idx2 = otherGamesData.findIndex((g: any) => g.id === id);
        if (idx2 !== -1) {
          const newOther = [...otherGamesData];
          newOther[idx2] = { ...newOther[idx2], is_analysis: true };
          setOtherGamesData(newOther);
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
  const [processingAnalysisModeGameId, setProcessingAnalysisModeGameId] = useState<
    string | number | null
  >(null);
  const [gameAnalysisGameId, setGameAnalysisGameId] = useState<
    string | number | null
  >(null);

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
  }, [analysisJobs, totalCompletedJobs, getTokenBalance, setToken]);
  const getAnalysisButtonContent = (gameId: string | number, game: Game) => {
    const job = getJobByGameId(gameId);

    if (game.isAnalysis || (job && job.status === "completed")) {
      return {
        text: "View Analysis",
        icon: <Eye className="h-4 w-4 mr-2" />,
        className:
          "border-2 border-white bg-gradient-to-b from-[#0AD847] to-[#018F34] hover:[#018F34] hover:to-[#018F34] text-white shadow-sm ring-1 ring-green-200",
        onClick: async () => {
          try {
            setDisabled(true);
            setGameId(gameId);
            const pgnHash = createPgnHash(game.pgn);
            const lastAnalysis = await fetchLastAnalysis(pgnHash, sessionId);

            if (game.hasViewedAnalysis === false) {
              // console.log("Marking analysis as viewed for game:", game.id);
              const res = await viewAnalysisResult(game.id);
              // if API reports success (or we got a 2xx), update store and local object
              if (res?.success) {
                // update persisted store arrays
                // also update the in-memory game object so UI updates immediately
                try {
                  game.hasViewedAnalysis = true as any;
                } catch (e) {
                  // if game is immutable, we'll still rely on store update
                }
              }
            }
            if (lastAnalysis?.success && lastAnalysis.data) {
              setDisabled(false);
              setPgn(game.pgn);
              setDataGamesImport(game);
              setDataAnalysis(lastAnalysis.data);
              setIsFromGameHistory(true);
              router.push("/analysis");
              markHasViewedAnalysisInStore(game.id);
            } else {
              setDisabled(false);
              if (job && job.result) {
                setPgn(game.pgn);
                setDataGamesImport(game);
                setDataAnalysis(job.result);
                setIsFromGameHistory(true);
                router.push("/analysis");
                markHasViewedAnalysisInStore(game.id);
              } else {
                console.error("No analysis found for this game");
                setOpenGameId(gameId);
              }
            }
          } catch (error) {
            console.error("Error fetching analysis:", error);
            setDisabled(false);
            if (job && job.result) {
              setPgn(game.pgn);
              setDataGamesImport(game);
              setDataAnalysis(job.result);
              setIsFromGameHistory(true);
              router.push("/analysis");
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
            text: "Analyze",
            icon: <ChartNoAxesColumn className="h-4 w-4 mr-2" />,
            className:
              "border border-[#BDD0F9] bg-gradient-to-b from-blue-600 to-[#221AE9] hover:from-blue-700 hover:to-blue-800 text-white shadow-md",
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
    if (!tc.trim()) {
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
          onClick={handleRetryFetch}
          className="flex md:w-[350px] relative justify-center items-center w-full gap-[4px] p-[10px] text-[14px] font-medium leading-[20px] text-[#E6F7FE] bg-[#221AE9] rounded-full border border-[#1B14CC] shadow-[0px_0px_1px_2px_rgba(34,26,233,.2)] after:content-[''] after:w-full after:h-full after:absolute after:top-0 after:left-0 after:rounded-full after:shadow-inset after:shadow-[0px_0px_0px_2px_rgba(78,71,255,1)] before:content-[''] before:w-full before:h-full before:absolute before:top-0 before:left-0 before:rounded-full before:shadow-inset before:shadow-[0px_2px_2px_0px_rgba(28,23,166,1)] before:z-10 hover:bg-[#2d25ea] hover:after:hidden hover:before:hidden"
        >
          Refresh Games
        </Button>
      </div>
    );
  }

  return (
    <div className="p-0 md:p-4 xl:p-0">
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
          {isOpenTutorial && isTutorialPlay && <DummyList />}
          {!isTutorialPlay &&
            !isOpenTutorial &&
            currentGames.map((game, idx) => {
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
                >
                  <AnalyzeGameHistory
                    open={openGameId === game.id}
                    onOpenChange={(o) => setOpenGameId(o ? game.id : null)}
                    game={game}
                    autoStart={autoStartGameId === game.id}
                    onAutoStartComplete={() => {
                      // clear the auto start marker once done
                      setAutoStartGameId(null);
                    }}
                    onAnalysisStarted={() => {
                      // Open ChooseAnalysisMode when analysis starts
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
                    onOpenProcessingMode={() => {
                      console.log("🔄 Opening ProcessingAnalysisMode from GameList");
                      setProcessingAnalysisModeGameId(game.id);
                    }}
                  />
                  <ProcessingAnalysisMode
                    open={processingAnalysisModeGameId === game.id}
                    onOpenChange={(o) => setProcessingAnalysisModeGameId(o ? game.id : null)}
                    game={game}
                    onOpenGameAnalysis={() => {
                      console.log("🎯 Opening GameAnalysis from GameList");
                      setGameAnalysisGameId(game.id);
                    }}
                  />
                  <GameAnalysis
                    open={gameAnalysisGameId === game.id}
                    onOpenChange={(o) => setGameAnalysisGameId(o ? game.id : null)}
                  />

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

      <div className="lg:hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] md:gap-2 text-[14px] --xs">
          {isOpenTutorial && isTutorialPlay && <DummyCard />}
          {!isTutorialPlay &&
            !isOpenTutorial &&
            currentGames.map((game) => (
              <GameCard
                key={game.id}
                gameData={game}
                isNewlyImported={isNewlyImported(game.id)}
              />
            ))}
        </div>
      </div>

      {currentGames.length > 0 && <PaginationControls {...paginationProps} />}
    </div>
  );
};

export default GamesList;
