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
} from "lucide-react";
import React, { useState } from "react";
import GamesTabCard from "../GamesTabCard";
import DotSpinner from "../Spinner";

// Dummy data for Other Games
const dummyOtherGames = [
  {
    id: "og-1",
    date: "2024-03-20",
    timeControl: "10+0",
    result: "WIN",
    opponent: "FritzEngine",
    rating: "1850",
    eloChange: "(+15 ELO Rating)",
    moves: "42",
    opening: "Sicilian Defense",
    source: "Lichess",
    color: "White",
    gameFormat: "Lichess",
    pgn: '[Event "Casual Game"]\n[Site "Lichess"]\n[Date "2024.03.20"]\n[Result "1-0"]\n[White "User"]\n[Black "FritzEngine"]\n[TimeControl "10+0"]\n1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6',
    gameType: "standard",
  },
  {
    id: "og-2",
    date: "2024-03-18",
    timeControl: "5+3",
    result: "LOSS",
    opponent: "GrandMaster64",
    rating: "1920",
    eloChange: "(-8 ELO Rating)",
    moves: "38",
    opening: "French Defense",
    source: "Lichess",
    color: "Black",
    gameFormat: "Lichess",
    pgn: '[Event "Rated Game"]\n[Site "Lichess"]\n[Date "2024.03.18"]\n[Result "0-1"]\n[White "GrandMaster64"]\n[Black "User"]\n[TimeControl "5+3"]\n1. e4 e6 2. d4 d5 3. Nc3 Bb4',
    gameType: "standard",
  },
  {
    id: "og-3",
    date: "2024-03-15",
    timeControl: "15+10",
    result: "WIN",
    opponent: "ChessWizard",
    rating: "1780",
    eloChange: "(+12 ELO Rating)",
    moves: "56",
    opening: "Ruy Lopez",
    source: "Lichess",
    color: "White",
    gameFormat: "Lichess",
    pgn: '[Event "Tournament Game"]\n[Site "Lichess"]\n[Date "2024.03.15"]\n[Result "1-0"]\n[White "User"]\n[Black "ChessWizard"]\n[TimeControl "15+10"]\n1. e4 e5 2. Nf3 Nc6 3. Bb5 a6',
    gameType: "standard",
  },
  {
    id: "og-4",
    date: "2024-03-12",
    timeControl: "30+0",
    result: "DRAW",
    opponent: "TacticalPlayer",
    rating: "1830",
    eloChange: "(0 ELO Rating)",
    moves: "67",
    opening: "Queen's Gambit",
    source: "Tournament",
    color: "Black",
    gameFormat: "Tournament",
    pgn: '[Event "Local Tournament"]\n[Site "Chess Club"]\n[Date "2024.03.12"]\n[Result "1/2-1/2"]\n[White "TacticalPlayer"]\n[Black "User"]\n[TimeControl "30+0"]\n1. d4 d5 2. c4 e6 3. Nc3 Nf6',
    gameType: "standard",
  },
  {
    id: "og-5",
    date: "2024-03-10",
    timeControl: "3+2",
    result: "WIN",
    opponent: "BlitzMaster",
    rating: "1750",
    eloChange: "(+7 ELO Rating)",
    moves: "32",
    opening: "Caro-Kann Defense",
    source: "Lichess",
    color: "Black",
    gameFormat: "Lichess",
    pgn: '[Event "Blitz Game"]\n[Site "Lichess"]\n[Date "2024.03.10"]\n[Result "0-1"]\n[White "BlitzMaster"]\n[Black "User"]\n[TimeControl "3+2"]\n1. e4 c6 2. d4 d5 3. Nc3 dxe4 4. Nxe4 Bf5',
    gameType: "blitz",
  },
  {
    id: "og-6",
    date: "2024-03-08",
    timeControl: "5+5",
    result: "LOSS",
    opponent: "EndgameExpert",
    rating: "1890",
    eloChange: "(-10 ELO Rating)",
    moves: "45",
    opening: "King's Indian Defense",
    source: "Lichess",
    color: "White",
    gameFormat: "Lichess",
    pgn: '[Event "Casual Game"]\n[Site "Lichess"]\n[Date "2024.03.08"]\n[Result "0-1"]\n[White "User"]\n[Black "EndgameExpert"]\n[TimeControl "5+5"]\n1. d4 Nf6 2. c4 g6 3. Nc3 Bg7',
    gameType: "standard",
  },
  {
    id: "og-7",
    date: "2024-03-05",
    timeControl: "10+5",
    result: "WIN",
    opponent: "OpeningTheory",
    rating: "1800",
    eloChange: "(+9 ELO Rating)",
    moves: "38",
    opening: "English Opening",
    source: "Lichess",
    color: "White",
    gameFormat: "Lichess",
    pgn: '[Event "Rated Game"]\n[Site "Lichess"]\n[Date "2024.03.05"]\n[Result "1-0"]\n[White "User"]\n[Black "OpeningTheory"]\n[TimeControl "10+5"]\n1. c4 e5 2. Nc3 Nf6 3. g3 d5',
    gameType: "standard",
  },
  {
    id: "og-8",
    date: "2024-03-01",
    timeControl: "15+0",
    result: "WIN",
    opponent: "TacticalMaster",
    rating: "1770",
    eloChange: "(+11 ELO Rating)",
    moves: "42",
    opening: "Nimzo-Indian Defense",
    source: "PGN Upload",
    color: "Black",
    gameFormat: "PGN Upload",
    pgn: '[Event "Club Match"]\n[Site "Local Chess Club"]\n[Date "2024.03.01"]\n[Result "0-1"]\n[White "TacticalMaster"]\n[Black "User"]\n[TimeControl "15+0"]\n1. d4 Nf6 2. c4 e6 3. Nc3 Bb4',
    gameType: "standard",
  },
  {
    id: "og-9",
    date: "2024-02-25",
    timeControl: "3+0",
    result: "LOSS",
    opponent: "SpeedDemon",
    rating: "1920",
    eloChange: "(-12 ELO Rating)",
    moves: "28",
    opening: "Scandinavian Defense",
    source: "Lichess",
    color: "White",
    gameFormat: "Lichess",
    pgn: '[Event "Bullet Game"]\n[Site "Lichess"]\n[Date "2024.02.25"]\n[Result "0-1"]\n[White "User"]\n[Black "SpeedDemon"]\n[TimeControl "3+0"]\n1. e4 d5 2. exd5 Qxd5 3. Nc3 Qa5',
    gameType: "bullet",
  },
  {
    id: "og-10",
    date: "2024-02-20",
    timeControl: "30+30",
    result: "DRAW",
    opponent: "PositionalPlayer",
    rating: "1850",
    eloChange: "(0 ELO Rating)",
    moves: "78",
    opening: "Queen's Indian Defense",
    source: "Tournament",
    color: "Black",
    gameFormat: "Tournament",
    pgn: '[Event "Regional Tournament"]\n[Site "Chess Hall"]\n[Date "2024.02.20"]\n[Result "1/2-1/2"]\n[White "PositionalPlayer"]\n[Black "User"]\n[TimeControl "30+30"]\n1. d4 Nf6 2. c4 e6 3. Nf3 b6',
    gameType: "classical",
  },
];

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
  // State variables
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    color: "All Colors",
    gameFormat: "All Formats",
    results: "All Results",
  });

  // Apply filters
  const filteredGames = React.useMemo(() => {
    let filtered = [...dummyOtherGames];

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
        (game) => game.result === resultMap[filters.results]
      );
    }

    return filtered;
  }, [filters]);

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

  const handleAnalyzeClick = (game: {
    id?: string;
    date?: string;
    timeControl?: string;
    result?: string;
    opponent: any;
    rating?: string;
    eloChange?: string;
    moves?: string;
    opening?: string;
    source: any;
    color?: string;
    gameFormat?: string;
    pgn?: string;
    gameType?: string;
  }) => {
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

  return (
    <div className="mx-auto">
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
          </div>

          {/* Mobile view - Card layout */}
          <div className="lg:hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {currentGames.map((game) => (
                <Card key={game.id} className="p-4 border rounded-lg mb-4">
                  <div className="flex justify-between mb-2">
                    <div className="text-sm font-medium">{game.date}</div>
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
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OtherGamesTab;
