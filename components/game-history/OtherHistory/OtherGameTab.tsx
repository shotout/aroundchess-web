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
import React, { useState, useEffect } from "react";
import useGameStore, { Game, initializeGameStore } from "../Dialog/DialogStore";
import { dummyOtherGames } from "./DummyGame";

// Dummy data for Other Games

// Helper functions
const getResultData = (result: string) => {
  if (!result || typeof result !== "string") {
    return { text: "UNKNOWN", className: "text-gray-500 font-semibold" };
  }

  if (result === "WIN") {
    return { text: "WIN", className: "text-game-green font-semibold" };
  } else if (result === "LOSS") {
    return { text: "LOSS", className: "text-game-red font-semibold" };
  } else {
    return { text: "DRAW", className: "text-gray-500 font-semibold" };
  }
};

const getEloChangeData = (change: string) => {
  if (!change || typeof change !== "string") {
    return { value: 0, text: "0", className: "text-gray-500" };
  }

  const match = change.match(/\(([+-]\d+) ELO Rating\)/);
  const value = match ? parseInt(match[1]) : 0;

  if (value > 0) {
    return { value, text: `+${value}`, className: "text-green-500" };
  } else if (value < 0) {
    return { value, text: `${value}`, className: "text-red-500" };
  } else {
    return { value, text: "0", className: "text-gray-500" };
  }
};

const OtherGamesTab = () => {
  // Initialize the store with dummy games if it hasn't been done
  useEffect(() => {
    initializeGameStore(dummyOtherGames as Game[]);
  }, []);

  // Get games from the Zustand store
  const { getAllGames, importedGames, isLoading, error } = useGameStore();
  const allGames = getAllGames();

  // State variables
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    color: "All Colors",
    gameFormat: "All Formats",
    results: "All Results",
  });

  // Reset to first page when importing new games
  useEffect(() => {
    if (importedGames.length > 0) {
      setCurrentPage(1);
    }
  }, [importedGames.length]);

  // Apply filters
  const filteredGames = React.useMemo(() => {
    let filtered = [...allGames];

    if (filters.color !== "All Colors") {
      filtered = filtered.filter((game) => game.color === filters.color);
    }

    if (filters.gameFormat !== "All Formats") {
      filtered = filtered.filter(
        (game) => game.gameFormat === filters.gameFormat
      );
    }

    if (filters.results !== "All Results") {
      const resultMap = {
        Wins: "WIN",
        Losses: "LOSS",
        Draws: "DRAW",
      };
      filtered = filtered.filter(
        (game) =>
          game.result === resultMap[filters.results as keyof typeof resultMap]
      );
    }

    return filtered;
  }, [filters, allGames]);

  // Pagination
  const totalPages = Math.ceil(filteredGames.length / itemsPerPage);
  const indexOfLastGame = currentPage * itemsPerPage;
  const indexOfFirstGame = indexOfLastGame - itemsPerPage;
  const currentGames = filteredGames.slice(indexOfFirstGame, indexOfLastGame);

  // Navigation functions
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handlers
  const handleApplyFilters = () => {
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setFilters({
      color: "All Colors",
      gameFormat: "All Formats",
      results: "All Results",
    });
  };

  const handleAnalyzeClick = (game: Game) => {
    // In a real implementation, this would invoke analysis functionality
    console.log("Analyze game:", game);
    alert(`Analyzing game against ${game.opponent} from ${game.source}`);
  };

  const activeFiltersCount = Object.values(filters).filter(
    (value) =>
      value !== "All Colors" &&
      value !== "All Formats" &&
      value !== "All Results"
  ).length;

  const filtersApplied = activeFiltersCount > 0;

  // Function to check if a game is newly imported
  const isNewlyImported = (gameId: string) => {
    return importedGames.some((game) => game.id === gameId);
  };

  return (
    <div className="mx-auto">
      {isLoading && (
        <div className="flex justify-center items-center py-4">
          <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
          <span>Loading...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center mb-4">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      {importedGames.length > 0 && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center mb-4">
          <span>Successfully imported {importedGames.length} game(s)!</span>
        </div>
      )}

      <div className="relative w-full">
        {/* Desktop Filter */}
        <div className="hidden md:flex items-center justify-evenly mb-4 rounded-lg p-4 xl:h-[80px] border shadow-card">
          <div className="flex items-center space-x-2 w-[70%] 2xl:w-[75%]">
            <Select
              value={filters.color}
              onValueChange={(value) =>
                setFilters({ ...filters, color: value })
              }
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
              onValueChange={(value) =>
                setFilters({ ...filters, gameFormat: value })
              }
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
              onValueChange={(value) =>
                setFilters({ ...filters, results: value })
              }
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
                onValueChange={(value) =>
                  setFilters({ ...filters, color: value })
                }
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
                onValueChange={(value) =>
                  setFilters({ ...filters, gameFormat: value })
                }
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
                onValueChange={(value) =>
                  setFilters({ ...filters, results: value })
                }
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

      {currentGames.length === 0 ? (
        <div className="p-8 text-center border rounded-lg">
          <p className="text-gray-500">
            No games found with the current filters.
          </p>
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
                const isNewGame = isNewlyImported(game.id);

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
              {currentGames.map((game) => {
                const isNewGame = isNewlyImported(game.id);

                return (
                  <Card
                    key={game.id}
                    className={`p-4 border rounded-lg mb-4 ${
                      isNewGame ? "bg-green-50 border-green-200" : ""
                    }`}
                  >
                    <div className="flex justify-between mb-2">
                      <div className="text-sm font-medium flex items-center">
                        {isNewGame && (
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        )}
                        {game.date}
                        {isNewGame && (
                          <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      <div className={getResultData(game.result).className}>
                        {getResultData(game.result).text}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
                      <div>
                        <span className="text-gray-500">Opponent</span>
                        <div className="font-semibold truncate">
                          {game.opponent}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Rating</span>
                        <div className="font-semibold">{game.rating}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Elo Change</span>
                        <div
                          className={getEloChangeData(game.eloChange).className}
                        >
                          {getEloChangeData(game.eloChange).text}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Time Control</span>
                        <div className="font-semibold">{game.timeControl}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Moves</span>
                        <div className="font-semibold">{game.moves}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Source</span>
                        <div className="font-semibold">{game.source}</div>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500">Opening</span>
                        <div className="font-semibold">{game.opening}</div>
                      </div>
                    </div>

                    <button
                      className="btn-primary text-white w-full py-2 rounded-3xl text-xs flex justify-center items-center mt-2"
                      onClick={() => handleAnalyzeClick(game)}
                    >
                      <ChartNoAxesColumn className="h-4 w-4 mr-1" />
                      Analyze Game
                    </button>
                  </Card>
                );
              })}
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
                  disabled={currentPage === totalPages}
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
