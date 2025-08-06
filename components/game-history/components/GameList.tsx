import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ChartNoAxesColumn,
  AlertCircle,
  Clock,
  BookOpen,
  Loader2,
  CheckCircle,
} from "lucide-react";
import GameCard from "./GameCard";
import PaginationControls from "./PaginationControls";
import { getResultData } from "../hooks/useGameData";
import { Game } from "../types/GameHistoryTypes";
import { AnalyzeGameHistory } from "./AnalyzeGameHistory";
import { useRouter } from "next/navigation";
import { usePgnStore } from "@/app/store/zustandStore";
import { useBackgroundAnalysisStore } from "@/app/store/backgroundAnaysis";
import GamesListSkeleton from "./GameListSkeleton";
import { createPgnHash } from "@/utils/crypto-utils";
import { useProfileStore } from "@/app/store/profile";
import { usePollingManager } from "../hooks/usePollingManager";

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

const DESKTOP_GRID_TEMPLATE =
  "0.5fr 1.5fr 1fr 1fr 2fr 1fr 1fr 1fr 2fr 1fr 2fr";

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
  const { getJobByGameId, clearOldJobs } = useBackgroundAnalysisStore();
  const { setPgn, setDataAnalysis, setDataGamesImport, setIsFromGameHistory } = usePgnStore();
  const { sessionId } = useProfileStore();
  const { restorePollingJobs } = usePollingManager();


  const isNewlyImported = (id: string | number) =>
    recentlyImportedIds.includes(id);

  const [openGameId, setOpenGameId] = useState<string | number | null>(null);

  useEffect(() => {
    clearOldJobs();
     restorePollingJobs();
  }, [clearOldJobs, restorePollingJobs]);


 const getAnalysisButtonContent = (gameId: string | number, game: Game) => {
  const job = getJobByGameId(gameId);

  if (game.isAnalysis || (job && job.status === "completed")) {
    return {
      text: "View Results",
      icon: <CheckCircle className="h-4 w-4 mr-1" />,
      className: "bg-green-600 hover:bg-green-700 text-white",
      onClick: async () => {
        try {
          const pgnHash = createPgnHash(game.pgn);
          const lastAnalysis = await fetchLastAnalysis(pgnHash, sessionId);
          
          if (lastAnalysis?.success && lastAnalysis.data) {
            setPgn(game.pgn); 
            setDataGamesImport(game);
            setDataAnalysis(lastAnalysis.data);
            setIsFromGameHistory(true);
            router.push("/analysis");
          } else {
            if (job && job.result) {
              setPgn(game.pgn);
              setDataGamesImport(game);
              setDataAnalysis(job.result);
              setIsFromGameHistory(true);
              router.push("/analysis");
            } else {
              console.error("No analysis found for this game");
              setOpenGameId(gameId);
            }
          }
        } catch (error) {
          console.error("Error fetching analysis:", error);
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
      case "processing": {
        const pct =
          job.progress > 0 ? `In Progress ${job.progress}%` : "In Progress";
        return {
          text: pct,
          icon: <Loader2 className="h-4 w-4 mr-1 animate-spin" />,
          className: "bg-yellow-500 hover:bg-yellow-600 text-white",
          onClick: () => {},
        };
      }
      case "finalizing":
        return {
          text: "Finalizing...",
          icon: <Loader2 className="h-4 w-4 mr-1 animate-spin" />,
          className: "bg-blue-500 hover:bg-blue-600 text-white",
          onClick: () => {},
        };
      case "failed":
        return {
          text: "Retry",
          icon: <AlertCircle className="h-4 w-4 mr-1" />,
          className: "bg-red-600 hover:bg-red-700 text-white",
          onClick: () => setOpenGameId(gameId),
        };
    }
  }

  return {
    text: "Analyze",
    icon: <ChartNoAxesColumn className="h-4 w-4 mr-1" />,
    className: "btn-primary text-white",
    onClick: () => setOpenGameId(gameId),
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

  if (isLoading) {
    return <GamesListSkeleton desktopRows={10} mobileCards={8} />;
  }

  if (error) {
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

  if (games.length === 0) {
    return (
      <div className="p-8 text-center border rounded-lg">
        <p className="text-gray-500">
          No games found with the current filters.
        </p>
        <Button
          onClick={handleRetryFetch}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white"
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
          className="grid bg-blue-100 py-3 text-xs font-medium text-gray-700"
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

        <div className="divide-y divide-gray-200 text-xs xl:text-sm">
          {currentGames.map((game, idx) => {
            const isNew = isNewlyImported(game.id);
            const indexInPage =
              (paginationProps.currentPage - 1) *
                paginationProps.itemsPerPage +
              idx +
              1;
            return (
              <div
                key={game.id}
                className={`grid relative transition-colors duration-150 ${
                  isNew
                    ? "bg-green-50"
                    : "even:bg-blue-50 odd:bg-white hover:bg-blue-50"
                }`}
                style={{ gridTemplateColumns: DESKTOP_GRID_TEMPLATE }}
              >
                <AnalyzeGameHistory
                  open={openGameId === game.id}
                  onOpenChange={(o) => setOpenGameId(o ? game.id : null)}
                  game={game}
                />

                <div className="flex items-center px-2 py-3 border-r border-gray-200">
                  {isNew && (
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                  )}
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
                  {game.moves || "N/A"}
                </div>

                <div className="flex items-center px-4 py-3">
                  {displayOpening(game.opening)}
                </div>

                <div className="flex items-center px-2 py-3">
                  {game.source || "Unknown"}
                </div>

                <div className="px-4 py-3">
                  {(() => {
                    const btn = getAnalysisButtonContent(game.id, game);
                    return (
                      <button
                        className={`${btn.className} h-8 w-full rounded-3xl text-xs flex justify-center items-center transition-colors duration-150`}
                        onClick={btn.onClick}
                        disabled={
                          btn.text.startsWith("In Progress") ||
                          btn.text === "Finalizing..." ||
                          btn.text === "Checking..."
                        }
                      >
                        {btn.icon}
                        {btn.text}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] md:gap-2 text-xs">
          {currentGames.map((game) => (
            <GameCard
              key={game.id}
              gameData={game}
              isNewlyImported={isNewlyImported(game.id)}
            />
          ))}
        </div>
      </div>

      {currentGames.length > 0 && (
        <PaginationControls {...paginationProps} />
      )}
    </div>
  );
};

export default GamesList;