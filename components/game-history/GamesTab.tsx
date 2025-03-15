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
  Filter,
  ChevronLeft,
  ChevronRight,
  ChartNoAxesColumn,
} from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import GamesTabCard from "./GamesTabCard";
import useFetch from "@/app/hooks/useFetch";
import { usePgnStore } from "@/app/store/zustandStore";
import { useRouter } from "next/navigation";
import DotSpinner from "./Spinner";

interface Game {
  id: number;
  date: string;
  opponent: string;
  result: string;
  eloChange: string;
  resultColor: string;
  rating: string;
  opening: string;
  moves: string;
  timeControl: string;
  source: string;
  gameType: string;
  color: string;
  gameFormat: string;
  pgn: string;
}

const endpoint = process.env.NEXT_PUBLIC_GAME_HISTORY || "";

// Function to transform API data to match the expected format in the component
function transformApiDataToComponentFormat(apiData: any[]) {
  if (!apiData || !Array.isArray(apiData)) return [];

  return apiData.map((game, index) => {
    // Convert date format
    const dateObj = new Date(game.date);
    const formattedDate = `${dateObj.getFullYear()}-${String(
      dateObj.getMonth() + 1
    ).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`;

    // Map result to resultColor
    const resultColorMap: Record<string, string> = {
      WIN: "text-green-500",
      LOSS: "text-red-500",
      DRAW: "text-gray-500",
    };

    // Map time_control to gameType
    let gameType = "Rapid"; // Default
    const timeControl = parseInt(game.time_control);
    if (timeControl < 180) gameType = "Bullet";
    else if (timeControl < 600) gameType = "Blitz";
    else if (timeControl >= 1800) gameType = "Classical";

    return {
      id: index + 1,
      date: formattedDate,
      opponent: game.opponent,
      result: game.result,
      eloChange: `(${game.elo_change > 0 ? "+" : ""}${
        game.elo_change
      } ELO Rating)`,
      resultColor: resultColorMap[game.result] || "text-gray-500",
      rating: game.rating.toString(),
      opening: game.opening_name || "Unknown Opening",
      moves: game.moves.toString(),
      timeControl: formatTimeControl(game.time_control),
      source: game.source,
      gameType: gameType,
      color: game.color,
      gameFormat: game.source,
      pgn: game.pgn,
    };
  });
}

// Helper function to format time control in a more readable way
function formatTimeControl(timeControlStr: string) {
  const seconds = parseInt(timeControlStr);
  if (seconds >= 60) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0
      ? `${minutes}+${remainingSeconds}`
      : `${minutes}+0`;
  }
  return `${seconds}+0`;
}

const GamesTab = () => {
  const router = useRouter(); // Initialize the router
  const [showFilters, setShowFilters] = useState(false);
  const [timeRange, setTimeRange] = useState("All Times");
  const [gameType, setGameType] = useState("All Games");
  const [color, setColor] = useState("All Colors");
  const [gameFormat, setGameFormat] = useState("All Formats");
  const [results, setResults] = useState("All Results");
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [filtersApplied, setFiltersApplied] = useState(false);

  // API fetch
  const { data, isLoading, error } = useFetch(endpoint);
  const { setPgn } = usePgnStore();
  const [apiProcessedData, setApiProcessedData] = useState<Game[]>([]);

  // Process API data when it arrives
  useEffect(() => {
    if (data && data.data) {
      const transformedData = transformApiDataToComponentFormat(data.data);

      setApiProcessedData(transformedData);
    }
  }, [data]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [filteredGames, setFilteredGames] = useState<Game[]>([]);

  const gamesData = useMemo(() => {
    return apiProcessedData;
  }, [apiProcessedData]);

  const defaultFilters = useMemo(
    () => ({
      timeRange: "All Times",
      gameType: "All Games",
      color: "All Colors",
      gameFormat: "All Formats",
      results: "All Results",
    }),
    []
  );

  // Function to handle analyze button click
  const handleAnalyzeClick = (game: Game) => {
    // Set the pgn in the store
    setPgn(game.pgn);
    // Navigate to the analysis page
    router.push("/analysis");
  };

  useEffect(() => {
    let count = 0;
    if (timeRange !== defaultFilters.timeRange) count++;
    if (gameType !== defaultFilters.gameType) count++;
    if (color !== defaultFilters.color) count++;
    if (gameFormat !== defaultFilters.gameFormat) count++;
    if (results !== defaultFilters.results) count++;

    setActiveFiltersCount(count);
    setFiltersApplied(count > 0);
  }, [timeRange, gameType, color, gameFormat, results, defaultFilters]);

  useEffect(() => {
    let filtered = Array.isArray(gamesData) ? [...gamesData] : [];

    // Apply time range filter
    if (timeRange !== "All Times") {
      const today = new Date();

      const cutoffDate = new Date();

      if (timeRange === "Last 30 Days") {
        cutoffDate.setDate(today.getDate() - 30);
      } else if (timeRange === "Last 90 Days") {
        cutoffDate.setDate(today.getDate() - 90);
      } else if (timeRange === "Last 6 Months") {
        cutoffDate.setMonth(today.getMonth() - 6);
      } else if (timeRange === "Last Year") {
        cutoffDate.setFullYear(today.getFullYear() - 1);
      }

      filtered = filtered.filter((game) => {
        const gameDate = new Date(game.date);
        return gameDate >= cutoffDate;
      });
    }

    // Apply game type filter
    if (gameType !== "All Games") {
      filtered = filtered.filter((game) => game.gameType === gameType);
    }

    // Apply color filter
    if (color !== "All Colors") {
      filtered = filtered.filter((game) => game.color === color);
    }

    // Apply game format filter
    if (gameFormat !== "All Formats") {
      filtered = filtered.filter((game) => game.gameFormat === gameFormat);
    }

    // Apply results filter
    if (results !== "All Results") {
      const resultMap: { [key: string]: string } = {
        Wins: "WIN",
        Losses: "LOSS",
        Draws: "DRAW",
      };
      filtered = filtered.filter(
        (game) => game.result === resultMap[results as keyof typeof resultMap]
      );
    }

    setFilteredGames(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [
    timeRange,
    gameType,
    color,
    gameFormat,
    results,
    filtersApplied,
    gamesData,
  ]);

  // Calculate pagination values
  const totalPages = Math.ceil(filteredGames.length / itemsPerPage);
  const indexOfLastGame = currentPage * itemsPerPage;
  const indexOfFirstGame = indexOfLastGame - itemsPerPage;
  const currentGames = filteredGames.slice(indexOfFirstGame, indexOfLastGame);

  // Pagination handlers
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

  const handleApplyFilters = () => {
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setTimeRange(defaultFilters.timeRange);
    setGameType(defaultFilters.gameType);
    setColor(defaultFilters.color);
    setGameFormat(defaultFilters.gameFormat);
    setResults(defaultFilters.results);
    setActiveFiltersCount(0);
    setFiltersApplied(false);
  };

  // Function to render result with appropriate color
  const renderResult = (result: string) => {
    if (result === "WIN") {
      return <span className="text-game-green font-semibold">WIN</span>;
    } else if (result === "LOSS") {
      return <span className="text-game-red font-semibold">LOSS</span>;
    } else {
      return <span className="text-gray-500 font-semibold">DRAW</span>;
    }
  };

  // Function to render Elo change with appropriate color
  const renderEloChange = (change: string) => {
    // Extract the numeric value from the string "(+XX ELO Rating)" or "(-XX ELO Rating)"
    const match = change.match(/\(([+-]\d+) ELO Rating\)/);
    const value = match ? parseInt(match[1]) : 0;

    if (value > 0) {
      return <span className="text-green-500">+{value}</span>;
    } else if (value < 0) {
      return <span className="text-red-500">{value}</span>;
    } else {
      return <span className="text-gray-500">0</span>;
    }
  };

  if (isLoading) {
    return <DotSpinner />;
  }

  return (
    <div className="mx-auto ">
      {error && (
        <div className="text-center text-red-500 p-4">
          Error loading games: {error.message}
        </div>
      )}

      <div className="relative w-full">
        {/* Desktop/Tablet Filter UI */}
        <div className="hidden md:flex items-center mb-4 rounded-lg border border-primary-gray p-2 md:p-4 md:h-[56px] lg:h-[80px]">
          <div className="flex items-center space-x-1 lg:space-x-2 flex-1 flex-nowrap overflow-x-auto">
            {/* Time Range Filter */}
            <Select
              value={timeRange}
              onValueChange={setTimeRange}
              defaultValue="Last 30 Days"
            >
              <SelectTrigger className="h-9 w-24 lg:w-32 lg:h-12 border rounded-lg bg-white text-xs">
                <SelectValue placeholder="Last 30 Days" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="Last 30 Days">Last 30 Days</SelectItem>
                <SelectItem value="Last 90 Days">Last 90 Days</SelectItem>
                <SelectItem value="Last 6 Months">Last 6 Months</SelectItem>
                <SelectItem value="Last Year">Last Year</SelectItem>
                <SelectItem value="All Times">All Times</SelectItem>
              </SelectContent>
            </Select>

            {/* Game Type Filter */}
            <Select
              value={gameType}
              onValueChange={setGameType}
              defaultValue="All Games"
            >
              <SelectTrigger className="h-9 w-24 lg:w-32 lg:h-12 border rounded-md bg-white text-xs shrink-0">
                <SelectValue placeholder="All Games" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="All Games">All Games</SelectItem>
                <SelectItem value="Bullet">Bullet</SelectItem>
                <SelectItem value="Blitz">Blitz</SelectItem>
                <SelectItem value="Rapid">Rapid</SelectItem>
                <SelectItem value="Classical">Classical</SelectItem>
              </SelectContent>
            </Select>

            {/* Color Filter */}
            <Select
              value={color}
              onValueChange={setColor}
              defaultValue="All Colors"
            >
              <SelectTrigger className="h-9 w-24 lg:w-32 lg:h-12 border rounded-md bg-white text-xs shrink-0">
                <SelectValue placeholder="Both Colors" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="All Colors">Both Colors</SelectItem>
                <SelectItem value="White">White</SelectItem>
                <SelectItem value="Black">Black</SelectItem>
              </SelectContent>
            </Select>

            {/* Format Filter */}
            <Select
              value={gameFormat}
              onValueChange={setGameFormat}
              defaultValue="All Formats"
            >
              <SelectTrigger className="h-9 w-24 lg:w-32 lg:h-12 border rounded-md bg-white text-xs shrink-0">
                <SelectValue placeholder="All Sources" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="All Formats">All Sources</SelectItem>
                <SelectItem value="Chess.com">Chess.com</SelectItem>
                <SelectItem value="PGN Upload">PGN Upload</SelectItem>
                <SelectItem value="Online Games">Online Games</SelectItem>
                <SelectItem value="Tournaments">Tournaments</SelectItem>
              </SelectContent>
            </Select>

            {/* Results Filter */}
            <Select
              value={results}
              onValueChange={setResults}
              defaultValue="All Results"
            >
              <SelectTrigger className="h-9 w-24 lg:w-32 lg:h-12 border rounded-lg bg-white text-xs shrink-0">
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
          <div className="flex items-center space-x-1 lg:space-x-2 ml-1 shrink-0">
            <button
              onClick={handleApplyFilters}
              className="btn-secondary text-white flex items-center justify-center lg:w-40 gap-1 h-9 lg:h-12 px-2 rounded-3xl text-xs whitespace-nowrap"
            >
              <Filter className="h-3 w-3" />
              Apply Filters
            </button>
            <button
              onClick={handleClearFilters}
              className="btn-tertiary h-9 lg:h-12 lg:w-40 px-2 rounded-3xl text-xs whitespace-nowrap btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Mobile Filter Button */}
        <Button
          variant="outline"
          className={`md:hidden w-full flex items-center justify-center gap-2 py-5 rounded-lg mb-4 ${
            filtersApplied ? "text-blue-base border-blue-base" : ""
          }`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4" />
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

        {/* Mobile Filter Panel */}
        {showFilters && (
          <Card className="md:hidden p-2 border rounded-lg mb-4 absolute top-full left-0 right-0 z-10 bg-white shadow-lg">
            <div className="flex flex-wrap gap-2 mb-4">
              {/* Time Range Filter */}
              <Select
                value={timeRange}
                onValueChange={setTimeRange}
                defaultValue="Last 30 Days"
              >
                <SelectTrigger className="w-[120px] h-8 border rounded-md bg-gray-50">
                  <SelectValue className="text-xs" placeholder="Last 30 Days" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Last 30 Days">Last 30 Days</SelectItem>
                  <SelectItem value="Last 90 Days">Last 90 Days</SelectItem>
                  <SelectItem value="Last 6 Months">Last 6 Months</SelectItem>
                  <SelectItem value="Last Year">Last Year</SelectItem>
                  <SelectItem value="All Times">All Times</SelectItem>
                </SelectContent>
              </Select>

              {/* Game Type Filter */}
              <Select
                value={gameType}
                onValueChange={setGameType}
                defaultValue="All Games"
              >
                <SelectTrigger className="w-[120px] h-8 border rounded-md bg-gray-50">
                  <SelectValue className="text-xs" placeholder="All Games" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="All Games">All Games</SelectItem>
                  <SelectItem value="Bullet">Bullet</SelectItem>
                  <SelectItem value="Blitz">Blitz</SelectItem>
                  <SelectItem value="Rapid">Rapid</SelectItem>
                  <SelectItem value="Classical">Classical</SelectItem>
                </SelectContent>
              </Select>

              {/* Color Filter */}
              <Select
                value={color}
                onValueChange={setColor}
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

              {/* Format Filter */}
              <Select
                value={gameFormat}
                onValueChange={setGameFormat}
                defaultValue="All Formats"
              >
                <SelectTrigger className="w-[120px] h-8 border rounded-md bg-gray-50">
                  <SelectValue className="text-xs" placeholder="All Sources" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="All Formats">All Sources</SelectItem>
                  <SelectItem value="Chess.com">Chess.com</SelectItem>
                  <SelectItem value="PGN Upload">PGN Upload</SelectItem>
                  <SelectItem value="Online Games">Online Games</SelectItem>
                  <SelectItem value="Tournaments">Tournaments</SelectItem>
                </SelectContent>
              </Select>

              {/* Results Filter */}
              <Select
                value={results}
                onValueChange={setResults}
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
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleApplyFilters}
                className="btn-secondary flex items-center justify-center gap-2 h-10 rounded-3xl flex-1"
              >
                <Filter className="h-4 w-4" />
                <h1 className="test-xs">Apply Filters</h1>
              </button>
              <button
                onClick={handleClearFilters}
                className="btn-tertiary flex items-center justify-center gap-2 h-10 rounded-3xl flex-1"
              >
                <Filter className="h-4 w-4" />
                Clear Filters
              </button>
            </div>
          </Card>
        )}
      </div>

      <div className="hidden lg:block overflow-hidden rounded-lg border border-gray-200">
        {currentGames.length > 0 ? (
          <>
            {/* Table Header */}
            <div className="grid grid-cols-10 bg-blue-100 py-3 text-xs font-medium text-gray-700">
              <div className="col-span-1 pl-14 text-left">Date</div>
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
                  className="grid grid-cols-10 relative even:bg-blue-50 odd:bg-white hover:bg-blue-50"
                >
                  {/* Fixed vertical divider positioning */}
                  <div
                    className="absolute h-full w-px bg-gray-200"
                    style={{ left: "3rem" }}
                  ></div>

                  {/* Fixed date column with better alignment */}
                  <div className="col-span-1 py-3 pl-4 flex items-center">
                    <span className="inline-block w-6 text-right text-gray-500 mr-4">
                      {indexOfFirstGame + index + 1}
                    </span>
                    <span className="ml-2">{game.date}</span>
                  </div>

                  <div className="col-span-1 px-4 py-3 flex items-center">
                    {game.timeControl}
                  </div>
                  <div className="col-span-1 px-4 py-3 flex items-center">
                    {renderResult(game.result)}
                  </div>
                  <div className="col-span-1 px-4 py-3 flex items-center truncate">
                    {game.opponent}
                  </div>
                  <div className="col-span-1 px-4 py-3 flex items-center">
                    {game.rating}
                  </div>
                  <div className="col-span-1 px-4 py-3 flex items-center">
                    {renderEloChange(game.eloChange)}
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

                  {/* Fixed analyze button */}
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
      {/* Mobile/Tablet Game Cards View */}
      <div className="lg:hidden">
        {currentGames.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {currentGames.map((game) => (
              <GamesTabCard
                key={game.id}
                gameData={game}
                onAnalyze={() => handleAnalyzeClick(game)} // Pass the onAnalyze prop
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

      {/* Pagination Controls */}
      <div className="flex flex-col md:flex-col lg:flex-row justify-center items-center mt-4 mb-4 lg:relative">
        {/* Games per page selector - Always centered on mobile/tablet, right on desktop */}
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
            </SelectContent>
          </Select>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </div>

        {/* Page navigation - Always centered */}
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
            // Calculate page numbers to show based on current page
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
    </div>
  );
};

export default GamesTab;
