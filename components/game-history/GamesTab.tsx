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
import { chessGamesData } from "./ChessGameData";

const GamesTab = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [timeRange, setTimeRange] = useState("All Times");
  const [gameType, setGameType] = useState("All Games");
  const [color, setColor] = useState("All Colors");
  const [gameFormat, setGameFormat] = useState("All Formats");
  const [results, setResults] = useState("All Results");
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [filtersApplied, setFiltersApplied] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filteredGames, setFilteredGames] = useState(chessGamesData);

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

  // Calculate active filters count
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

  // Filter games based on selected filters
  useEffect(() => {
    let filtered = [...chessGamesData];

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
      filtered = filtered.filter((game) => game.result === resultMap[results]);
    }

    setFilteredGames(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [timeRange, gameType, color, gameFormat, results, filtersApplied]);

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
    const value = parseInt(change);
    if (value > 0) {
      return <span className="text-green-500">+{value}</span>;
    } else if (value < 0) {
      return <span className="text-red-500">{value}</span>;
    } else {
      return <span className="text-gray-500">0</span>;
    }
  };

  return (
    <div className="mx-auto ">
      <div className="relative w-full">
        {/* Desktop/Tablet Filter UI */}
        <div className="hidden md:flex items-center mb-4 rounded-lg border border-primary-gray p-2 md:h-[56px]">
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
            <Button
              onClick={handleApplyFilters}
              className="btn-secondary text-white flex items-center justify-center lg:w-40 gap-1 h-9 lg:h-12 px-2 rounded-3xl text-xs whitespace-nowrap"
            >
              <Filter className="h-3 w-3" />
              Apply Filters
            </Button>
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="btn-tertiary h-9 lg:h-12 lg:w-40 px-2 rounded-3xl text-xs whitespace-nowrap btn-secondary"
            >
              Clear Filters
            </Button>
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
              <Button
                onClick={handleApplyFilters}
                className="btn-secondary  flex items-center justify-center gap-2 h-10 rounded-3xl flex-1"
              >
                <Filter className="h-4 w-4" />
                <h1 className="test-xs">Apply Filters</h1>
              </Button>
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="btn-tertiary flex items-center justify-center gap-2 h-10 rounded-3xl flex-1"
              >
                <Filter className="h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-hidden rounded-lg border border-gray-200">
        {currentGames.length > 0 ? (
          <>
            {/* Table Header */}
            <div className="grid grid-cols-10 bg-blue-100 py-3 text-xs font-medium text-gray-700">
              <div className="col-span-1 px-6 text-center flex">Date</div>
              <div className="col-span-1 px-4 text-center flex">
                Time Control
              </div>
              <div className="col-span-1 px-4 text-center flex">Result</div>
              <div className="col-span-1 px-4 text-center flex">Opponent</div>
              <div className="col-span-1 px-4 text-center flex">Rating</div>
              <div className="col-span-1 px-4 text-center flex">Elo Change</div>
              <div className="col-span-1 px-4 text-center flex">Moves</div>
              <div className="col-span-1 px-4 text-center flex">Opening</div>
              <div className="col-span-1 px-4 text-center flex">Source</div>
              <div className="col-span-1 px-4 text-center flex items-center justify-center"></div>
            </div>

            <div className="divide-y divide-gray-200 text-xs xl:text-sm">
              {currentGames.map((game, index) => (
                <div
                  key={game.id}
                  className="grid grid-cols-10 relative even:bg-blue-50 odd:bg-white hover:bg-blue-50"
                >
                  {/* This creates a full-height vertical line at a specific position */}
                  <div
                    className="absolute h-full bg-gray-200 w-px"
                    style={{ left: "2.75rem" }}
                  ></div>

                  <div className="col-span-1 px-2 py-3 relative flex items-center justify-center">
                    <span className="absolute left-3 text-gray-500">
                      {indexOfFirstGame + index + 1}
                    </span>
                    <span className="ml-6">{game.date}</span>
                  </div>
                  <div className="col-span-1 px-4 py-3 flex items-center ">
                    {game.timeControl}
                  </div>
                  <div className="col-span-1 px-4 py-3 flex items-center ">
                    {renderResult(game.result)}
                  </div>
                  <div className="col-span-1 px-4 py-3 flex items-center ">
                    {game.opponent}
                  </div>
                  <div className="col-span-1 px-4 py-3 flex items-center ">
                    {game.rating}
                  </div>
                  <div className="col-span-1 px-4 py-3 flex items-center ">
                    {renderEloChange(game.eloChange)}
                  </div>
                  <div className="col-span-1 px-4 py-3 flex items-center ">
                    {game.moves}
                  </div>
                  <div className="col-span-1 px-4 py-3 flex items-center ">
                    {game.opening}
                  </div>
                  <div className="col-span-1 px-4 py-3 flex items-center ">
                    {game.source}
                  </div>
                  <div className="col-span-1 px-4 py-3 flex items-center ">
                    <Button className="btn-primary text-white w-[80px] h-[32px] px-10 lg:px-16 py-4 rounded-3xl text-xs flex justify-center items-center">
                      <ChartNoAxesColumn className="h-4 w-4 mr-1" />
                      <h1>Analyze</h1>
                    </Button>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {currentGames.map((game) => (
              <GamesTabCard key={game.id} gameData={game} />
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
