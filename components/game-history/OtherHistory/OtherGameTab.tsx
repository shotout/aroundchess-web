import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChartNoAxesColumn,
  RefreshCw,
  Download,
  AlertCircle,
} from "lucide-react";
import React from "react";
import { useAuth } from "@clerk/nextjs";
import { usePgnStore } from "@/app/store/zustandStore";
import DotSpinner from "../Spinner";

import GamesTabCard from "../GamesTabCard";
import { usePagination } from "../GamesTab/utils/hook/usePagination";
import { useFilters } from "../GamesTab/utils/hook/useFilters";
import { useAnalyzeGame } from "../GamesTab/utils/hook/useAnalyzeGame";
import {
  getEloChangeData,
  getResultData,
  isCacheValid,
} from "../GamesTab/utils/GamesTabHelper";
import { useOtherGamesData } from "./useOtherGameData";

const OtherGamesTab = () => {
  const {
    username,
    setPgn,
    setDataAnalysis,
    setIsLoading,
    lastFetchTimestamp,
    otherGamesData: cachedGames,
    otherGamesLastFetched,
    setOtherGamesData,
  } = usePgnStore();

  const { sessionId: rawSessionId, isLoaded: authIsLoaded } = useAuth();
  const sessionId = rawSessionId ?? null;

  const { isLoading, error, gamesData, handleRetryFetch, handleForceRefresh } =
    useOtherGamesData(
      username,
      sessionId,
      authIsLoaded,
      lastFetchTimestamp,
      cachedGames,
      otherGamesLastFetched,
      setOtherGamesData
    );

  const {
    filters,
    setFilters,
    showFilters,
    setShowFilters,
    activeFiltersCount,
    filtersApplied,
    filteredGames,
    handleApplyFilters,
    handleClearFilters,
  } = useFilters(gamesData);

  const {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    currentGames,
    totalPages,
    goToNextPage,
    goToPreviousPage,
  } = usePagination(filteredGames);

  const { handleAnalyzeClick } = useAnalyzeGame(
    username,
    setPgn,
    setDataAnalysis,
    setIsLoading
  );

  // Cache validity check for UI rendering
  const cacheIsValid = isCacheValid(otherGamesLastFetched, cachedGames);

  // Function to check if a game is newly imported
  const isNewlyImported = (gameId: string) => {
    // This function would need to be implemented based on how you track newly imported games
    return false;
  };

  if (isLoading) {
    return <DotSpinner />;
  }

  if (!username) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-xl font-semibold mb-4">
          No Chess.com Username Set
        </div>
        <p className="mb-4 text-gray-600">
          Please connect your Chess.com account to view your games.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto">
      {error && (
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
      )}

      <div className="relative w-full">
        {/* Desktop Filter */}
        <div className="hidden md:flex items-center justify-evenly mb-4 rounded-lg p-4 xl:h-[80px] border shadow-card">
          <div className="flex items-center space-x-2 w-[70%] 2xl:w-[75%]">
            <Select
              value={filters.color}
              onValueChange={(value) => setFilters.setColor(value)}
              defaultValue="All Colors"
            >
              <SelectTrigger className="bg-gray-placeholder border border-gray-200 rounded-lg min-w-[150px] h-12 text-gray-placeholder-text">
                <SelectValue placeholder="Both Colors" />
              </SelectTrigger>
              <SelectContent className="bg-gray-placeholder">
                <SelectItem value="All Colors">Both Colors</SelectItem>
                <SelectItem value="White">White</SelectItem>
                <SelectItem value="Black">Black</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.gameFormat}
              onValueChange={(value) => setFilters.setGameFormat(value)}
              defaultValue="All Formats"
            >
              <SelectTrigger className="bg-gray-placeholder border border-gray-200 rounded-lg min-w-[150px] h-12 text-gray-placeholder-text">
                <SelectValue placeholder="All Sources" />
              </SelectTrigger>
              <SelectContent className="bg-gray-placeholder">
                <SelectItem value="All Formats">All Sources</SelectItem>
                <SelectItem value="Lichess">Lichess</SelectItem>
                <SelectItem value="PGN Upload">PGN Upload</SelectItem>
                <SelectItem value="Tournament">Tournament</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.results}
              onValueChange={(value) => setFilters.setResults(value)}
              defaultValue="All Results"
            >
              <SelectTrigger className="bg-gray-placeholder border border-gray-200 rounded-lg min-w-[150px] h-12 text-gray-placeholder-text">
                <SelectValue placeholder="All Results" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="All Results">All Results</SelectItem>
                <SelectItem value="Wins">Wins</SelectItem>
                <SelectItem value="Losses">Losses</SelectItem>
                <SelectItem value="Draws">Draws</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-1 w-[30%] justify-evenly 2xl:w-[25%]">
            <Button
              onClick={handleApplyFilters}
              className="bg-blue-600 text-white w-[156px] rounded-full h-12 px-1 flex items-center gap-2 hover:bg-blue-700"
            >
              <RefreshCw className="h-4 w-4" />
              Apply Filters
            </Button>

            <Button
              onClick={handleClearFilters}
              className="bg-blue-50 text-blue-600 w-[156px] border border-blue-100 rounded-full h-12 px-1 hover:bg-blue-100"
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Mobile Filter Button */}
        <div className="md:hidden flex w-full items-center justify-between gap-2 mb-4">
          <Button
            variant="outline"
            className={`flex-1 flex items-center justify-center gap-2 py-5 rounded-lg ${
              filtersApplied ? "text-blue-base border-blue-base" : ""
            }`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <RefreshCw className="h-4 w-4" />
            {filtersApplied ? (
              <>
                Filters Applied
                {activeFiltersCount > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 ml-1 bg-blue-base text-white text-xs rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </>
            ) : (
              "Add Filters"
            )}
          </Button>

          <Button
            variant="outline"
            className="flex-1 flex items-center justify-center gap-2 py-5 rounded-lg"
          >
            <Download className="h-4 w-4" />
            Export Games
          </Button>
        </div>

        {/* Mobile Filter Panel */}
        {showFilters && (
          <Card className="md:hidden p-2 border rounded-lg mb-4 absolute top-full left-0 right-0 z-10 bg-white shadow-lg">
            <div className="flex flex-wrap gap-2 mb-4">
              <Select
                value={filters.color}
                onValueChange={(value) => setFilters.setColor(value)}
                defaultValue="All Colors"
              >
                <SelectTrigger className="w-[120px] h-8 border rounded-md bg-gray-50">
                  <SelectValue className="text-xs" placeholder="Both Colors" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="All Colors">Both Colors</SelectItem>
                  <SelectItem value="White">White</SelectItem>
                  <SelectItem value="Black">Black</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.gameFormat}
                onValueChange={(value) => setFilters.setGameFormat(value)}
                defaultValue="All Formats"
              >
                <SelectTrigger className="w-[120px] h-8 border rounded-md bg-gray-50">
                  <SelectValue className="text-xs" placeholder="All Sources" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="All Formats">All Sources</SelectItem>
                  <SelectItem value="Lichess">Lichess</SelectItem>
                  <SelectItem value="PGN Upload">PGN Upload</SelectItem>
                  <SelectItem value="Tournament">Tournament</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.results}
                onValueChange={(value) => setFilters.setResults(value)}
                defaultValue="All Results"
              >
                <SelectTrigger className="w-[120px] h-8 border rounded-md bg-gray-50">
                  <SelectValue className="text-xs" placeholder="All Results" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="All Results">All Results</SelectItem>
                  <SelectItem value="Wins">Wins</SelectItem>
                  <SelectItem value="Losses">Losses</SelectItem>
                  <SelectItem value="Draws">Draws</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleApplyFilters}
                className="btn-secondary flex items-center justify-center gap-2 h-10 rounded-3xl flex-1"
              >
                <RefreshCw className="h-4 w-4" />
                <h1 className="text-xs">Apply Filters</h1>
              </button>
              <button
                onClick={handleClearFilters}
                className="btn-tertiary flex items-center justify-center gap-2 h-10 rounded-3xl flex-1"
              >
                <RefreshCw className="h-4 w-4" />
                Clear Filters
              </button>
            </div>
          </Card>
        )}
      </div>

      {currentGames.length === 0 && !isLoading && !error ? (
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
      ) : (
        <>
          {/* Desktop view - Table layout */}
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
                const isNewGame = isNewlyImported(game.id.toString());

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
                        {(currentPage - 1) * itemsPerPage + index + 1}
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
                        const eloData = getEloChangeData(game.eloChange);
                        return (
                          <span className={eloData.className}>
                            {eloData.text}
                          </span>
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

          {/* Mobile view - Card layout */}
          <div className="lg:hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {currentGames.map((game) => (
                <GamesTabCard
                  key={game.id}
                  gameData={game}
                  onAnalyze={() => handleAnalyzeClick(game)}
                />
              ))}
            </div>
          </div>

          {/* Pagination Controls */}
          {currentGames.length > 0 && (
            <div className="flex flex-col md:flex-col lg:flex-row justify-center items-center mt-4 mb-4 lg:relative">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3 md:mb-3 lg:mb-0 lg:absolute lg:right-0">
                <span>Games per Page</span>
                <Select
                  value={String(itemsPerPage)}
                  onValueChange={(value) => setItemsPerPage(Number(value))}
                  defaultValue="10"
                >
                  <SelectTrigger className="w-16 h-8 border rounded-md bg-white">
                    <SelectValue className="text-sm" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>

              <div className="flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="h-10 w-10 p-0 flex items-center justify-center text-blue-500"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={i}
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`h-8 w-8 p-0 flex items-center justify-center mx-1 ${
                        currentPage === pageNum
                          ? "bg-blue-50 border border-blue-base text-blue-base rounded-md"
                          : "text-gray-600 hover:bg-gray-100 border "
                      }`}
                    >
                      {pageNum}
                    </Button>
                  );
                })}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="h-10 w-10 p-0 flex items-center justify-center text-blue-500"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OtherGamesTab;
