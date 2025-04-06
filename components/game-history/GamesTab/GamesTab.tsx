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
} from "lucide-react";
import React from "react";
import GamesTabCard from "../GamesTabCard";
import { usePgnStore } from "@/app/store/zustandStore";
import { useAuth } from "@clerk/nextjs";
import DotSpinner from "../Spinner";
import {
  isCacheValid,
  getEloChangeData,
  getResultData,
} from "./utils/GamesTabHelper";
import { useGamesData } from "./utils/hook/useGameData";
import { useFilters } from "./utils/hook/useFilters";
import { usePagination } from "./utils/hook/usePagination";
import { useAnalyzeGame } from "./utils/hook/useAnalyzeGame";
import DesktopFilter from "./filters/DesktopFilter";
import MobileFilter from "./filters/MobileFilter";

const GamesTab = () => {
  const {
    username,
    setPgn,
    setDataAnalysis,
    setIsLoading,
    lastFetchTimestamp,
    gamesData: cachedGames,
    gamesLastFetched,
    setGamesData,
  } = usePgnStore();

  const { sessionId: rawSessionId, isLoaded: authIsLoaded } = useAuth();
  const sessionId = rawSessionId ?? null;

  // Custom hooks for handling different aspects of the component
  const { isLoading, error, gamesData, handleRetryFetch, handleForceRefresh } =
    useGamesData(
      username,
      sessionId,
      authIsLoaded,
      lastFetchTimestamp,
      cachedGames,
      gamesLastFetched,
      setGamesData
    );

  console.log(gamesData);

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
  const cacheIsValid = isCacheValid(gamesLastFetched, cachedGames);

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
        <div className="text-center text-red-500 p-4">
          <p>Error loading games: {error.message}</p>
          <Button
            onClick={handleRetryFetch}
            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white"
          >
            Retry
          </Button>
        </div>
      )}

      <div className="relative w-full">
        {/* Desktop Filter Component */}
        <DesktopFilter
          filters={filters}
          setFilters={setFilters}
          handleApplyFilters={handleApplyFilters}
          handleClearFilters={handleClearFilters}
          handleForceRefresh={handleForceRefresh}
          cacheIsValid={cacheIsValid}
        />

        {/* Mobile Filter Component */}
        <MobileFilter
          filters={filters}
          setFilters={setFilters}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          activeFiltersCount={activeFiltersCount}
          filtersApplied={filtersApplied}
          handleApplyFilters={handleApplyFilters}
          handleClearFilters={handleClearFilters}
          handleForceRefresh={handleForceRefresh}
          cacheIsValid={cacheIsValid}
        />
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
          <div className="hidden lg:block overflow-hidden rounded-lg border border-gray-200">
            {currentGames.length > 0 ? (
              <>
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
                  {currentGames.map((game, index) => (
                    <div
                      key={game.id}
                      className="grid text-xs grid-cols-10 relative even:bg-blue-50 odd:bg-white hover:bg-blue-50"
                    >
                      <div
                        className="absolute h-full w-px bg-gray-200"
                        style={{ left: "3rem" }}
                      ></div>

                      <div className="col-span-1 py-3 pl-4 flex items-center">
                        <span className="inline-block w-6 text-center text-gray-500 mr-4">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </span>
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
                  ))}
                </div>
              </>
            ) : (
              <div className="p-4 text-center text-gray-500">
                No games found with the current filters.
              </div>
            )}
          </div>

          <div className="lg:hidden">
            {currentGames.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {currentGames.map((game) => (
                  <GamesTabCard
                    key={game.id}
                    gameData={game}
                    onAnalyze={() => handleAnalyzeClick(game)}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-4 border rounded-lg mb-4 text-center">
                <p className="text-gray-500">
                  No games found with the current filters.
                </p>
              </Card>
            )}
          </div>

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
                  const indexOfFirstGame = (currentPage - 1) * itemsPerPage;
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

export default GamesTab;
