import React from "react";
import { Button } from "@/components/ui/button";
import { ChartNoAxesColumn, AlertCircle } from "lucide-react";
import GameCard from "./GameCard";
import PaginationControls from "./PaginationControls";
import DotSpinner from "../Spinner";
import { getEloChangeData, getResultData } from "../hooks/useGameData";
import { Game } from "../types/GameHistoryTypes";

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
  // Check if a game is newly imported
  const isNewlyImported = (gameId: string | number) => {
    return recentlyImportedIds.includes(gameId);
  };

  if (isLoading) {
    return <DotSpinner />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center mb-4">
        <AlertCircle className="h-5 w-5 mr-2" />
        <span>{error.message}</span>
        <Button
          onClick={handleRetryFetch}
          className="ml-4 bg-red-600 hover:bg-red-700 text-white"
        >
          Retry
        </Button>
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
    <>
      {/* Desktop table view */}
      <div className="hidden lg:block overflow-hidden rounded-lg border border-gray-200">
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
                } hover:bg-blue-50`}
              >
                <div
                  className="absolute h-full w-px bg-gray-200"
                  style={{ left: "3rem" }}
                ></div>

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
                  {game.timeControl}
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
                  {game.opponent}
                </div>
                <div className="col-span-1 px-4 py-3 flex items-center">
                  {game.rating}
                </div>
                <div className="col-span-1 px-4 py-3 flex items-center">
                  {(() => {
                    const currentRating =
                      typeof game.rating === "string"
                        ? parseInt(game.rating)
                        : game.rating;
                    const previousRating: any =
                      index > 0
                        ? typeof currentGames[index - 1].rating === "string"
                          ? parseInt(currentGames[index - 1].rating)
                          : currentGames[index - 1].rating
                        : null;

                    const eloData = getEloChangeData(
                      game.eloChange,
                      currentRating,
                      previousRating
                    );
                    return (
                      <span className={eloData.className}>{eloData.text}</span>
                    );
                  })()}
                </div>
                <div className="col-span-1 px-4 py-3 flex items-center">
                  {game.moves}
                </div>
                <div className="col-span-1 px-4 py-3 flex items-center">
                  {game.opening}
                </div>
                <div className="col-span-1 px-4 py-3 flex items-center">
                  {game.source}
                  {isNewGame && (
                    <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                      New
                    </span>
                  )}
                </div>

                <div className="col-span-1 px-4 py-3 flex items-center">
                  <button
                    className="btn-primary text-white h-8 w-full max-w-24 rounded-3xl text-xs flex justify-center items-center"
                    onClick={() => handleAnalyzeClick(game)}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
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

      {/* Pagination Controls */}
      {currentGames.length > 0 && <PaginationControls {...paginationProps} />}
    </>
  );
};

export default GamesList;
