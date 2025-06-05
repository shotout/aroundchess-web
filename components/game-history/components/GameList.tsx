import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChartNoAxesColumn, AlertCircle, Clock, BookOpen } from "lucide-react";
import GameCard from "./GameCard";
import PaginationControls from "./PaginationControls";
import DotSpinner from "../Spinner";
import { getResultData } from "../hooks/useGameData";
import { Game } from "../types/GameHistoryTypes";
import { AnalyzeGameHistory } from "./AnalyzeGameHistory";

interface GamesListProps {
  games: Game[];
  currentGames: Game[];
  isLoading: boolean;
  error: Error | null;
  handleAnalyzeClick: (game: Game) => void;
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

const GamesList: React.FC<GamesListProps> = ({
  games,
  currentGames,
  isLoading,
  error,
  handleAnalyzeClick,
  handleRetryFetch,
  paginationProps,
  recentlyImportedIds = [],
}) => {
  const isNewlyImported = (gameId: string | number) => {
    return recentlyImportedIds.includes(gameId);
  };

  const [openGameId, setOpenGameId] = useState<string | number | null>(null);

  const displayTimeControl = (timeControl: string) => {
    if (!timeControl || timeControl.trim() === "") {
      return (
        <span className="text-gray-400 italic flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          N/A
        </span>
      );
    }
    return timeControl;
  };

  const displayOpening = (opening: string) => {
    if (!opening || opening.toLowerCase().includes("unknown")) {
      return (
        <span className="text-gray-400 italic flex items-center">
          <BookOpen className="h-3 w-3 mr-1" />
          Not Available
        </span>
      );
    }
    return opening;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <DotSpinner />
        <p className="mt-4 text-gray-500 text-sm">
          Loading and processing games data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center mb-4">
        <AlertCircle className="h-5 w-5 mr-2" />
        <span>{error.message}</span>
        <a
          href={"/login"}
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
      {/* Desktop table view */}
      <div className="hidden lg:block overflow-hidden rounded-lg border border-gray-200 ">
        <div className="grid grid-cols-10 bg-blue-100 py-3 text-xs font-medium text-gray-700">
          <div className="col-span-1 pl-16 text-left">Date</div>
          <div className="col-span-1 px-4 text-left">Time Control</div>
          <div className="col-span-1 px-4 text-left">Result</div>
          <div className="col-span-1 px-4 text-left">Opponent</div>
          <div className="col-span-1 px-4 text-left">Rating</div>
          <div className="col-span-1 px-4 text-left">Elo Change</div>
          <div className="col-span-1 px-4 text-left">Moves</div>
          <div className="col-span-1 px-4 text-left">Opening</div>
          <div className="col-span-1 px-4 text-left">Source</div>
          <div className="col-span-1 px-4 text-left">Actions</div>
        </div>

        <div className="divide-y divide-gray-200 text-xs xl:text-sm">
          {currentGames.map((game, index) => {
            const isNewGame = isNewlyImported(game.id);
            const indexInPage =
              (paginationProps.currentPage - 1) * paginationProps.itemsPerPage +
              index +
              1;

            return (
              <div
                key={game.id}
                className={`grid text-xs grid-cols-10 relative ${
                  isNewGame ? "bg-green-50" : "even:bg-blue-50 odd:bg-white"
                } hover:bg-blue-50 transition-colors duration-150`}
              >
                <div
                  className="absolute h-full w-px bg-gray-200"
                  style={{ left: "3rem" }}
                ></div>

                <AnalyzeGameHistory
                  open={openGameId === game.id}
                  onOpenChange={(isOpen) =>
                    setOpenGameId(isOpen ? game.id : null)
                  }
                  game={game}
                />

                <div className="col-span-1 py-3 pl-4 flex items-center">
                  <span className="inline-block w-6 text-center text-gray-500 mr-4">
                    {indexInPage}
                  </span>
                  {isNewGame && (
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  )}
                  <span className="ml-2">{game.date}</span>
                </div>

                <div className="col-span-1 px-4 py-3 flex items-center">
                  {displayTimeControl(game.timeControl)}
                </div>

                <div className="col-span-1 px-4 py-3 flex items-center">
                  {(() => {
                    const resultData = getResultData(game.result);
                    return (
                      <span className={resultData.className}>
                        {resultData.text}
                      </span>
                    );
                  })()}
                </div>

                <div className="col-span-1 px-4 py-3 flex items-center truncate">
                  {game.opponent || "Unknown Player"}
                </div>

                <div className="col-span-1 px-4 py-3 flex items-center">
                  {game.rating || "N/A"}
                </div>

                <div className="col-span-1 px-4 py-3 flex items-center">
                  <span
                    className={
                      Number(game.eloChange) >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {game.eloChange}
                  </span>
                </div>

                <div className="col-span-1 px-4 py-3 flex items-center">
                  {game.moves || "N/A"}
                </div>

                <div className="col-span-1 px-4 py-3 flex items-center">
                  {displayOpening(game.opening)}
                </div>

                <div className="col-span-1 px-4 py-3 flex items-center">
                  {game.source || "Unknown"}
                  {isNewGame && (
                    <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                      New
                    </span>
                  )}
                </div>

                <div className="col-span-1 px-4 py-3 flex items-center">
                  <button
                    className="btn-primary text-white h-8 w-full max-w-24 rounded-3xl text-xs flex justify-center items-center transition-colors duration-150"
                    onClick={() => setOpenGameId(game.id)}
                  >
                    <ChartNoAxesColumn className="h-4 w-4 mr-1" />
                    Analyze
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile card view */}
      <div className="lg:hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] md:gap-2 text-xs">
          {currentGames.map((game) => (
            <GameCard
              key={game.id}
              gameData={game}
              onAnalyze={handleAnalyzeClick}
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
