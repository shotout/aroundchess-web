import { useState, useEffect, useMemo } from "react";
import { Game, FilterState, DefaultFilters } from "../types/GameHistoryTypes";

interface UseFiltersResult {
  filters: FilterState;
  setFilters: {
    setTimeRange: (value: string) => void;
    setGameType: (value: string) => void;
    setColor: (value: string) => void;
    setGameFormat: (value: string) => void;
    setResults: (value: string) => void;
  };
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  activeFiltersCount: number;
  filtersApplied: boolean;
  filteredGames: Game[];
  handleApplyFilters: () => void;
  handleClearFilters: () => void;
}

// Updated filter function that only considers color and results
export const filterGames = (
  gamesData: Game[],
  filters: FilterState
): Game[] => {
  if (!Array.isArray(gamesData)) return [];

  let filtered = [...gamesData];

  // Filter by color
  if (filters.color !== "All Colors") {
    filtered = filtered.filter(
      (game) =>
        game.color?.toLowerCase() === filters.color.toLowerCase() ||
        game.playerColor?.toLowerCase() === filters.color.toLowerCase()
    );
  }

  // Filter by results
  if (filters.results !== "All Results") {
    const resultMap: Record<string, string> = {
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
};

// Updated count function that only considers color and results
export const countActiveFilters = (
  filters: FilterState,
  defaultFilters: FilterState
): number => {
  let count = 0;
  if (filters.color !== defaultFilters.color) count++;
  if (filters.results !== defaultFilters.results) count++;
  return count;
};

export function useFilters(gamesData: Game[]): UseFiltersResult {
  const [showFilters, setShowFilters] = useState(false);
  const [timeRange, setTimeRange] = useState("All Times");
  const [gameType, setGameType] = useState("All Games");
  const [color, setColor] = useState("All Colors");
  const [gameFormat, setGameFormat] = useState("All Formats");
  const [results, setResults] = useState("All Results");
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);

  // Default filter values
  const defaultFilters = useMemo<DefaultFilters>(
    () => ({
      timeRange: "All Times",
      gameType: "All Games",
      color: "All Colors",
      gameFormat: "All Formats",
      results: "All Results",
    }),
    []
  );

  // Current filter state
  const currentFilters = useMemo<FilterState>(
    () => ({
      timeRange,
      gameType,
      color,
      gameFormat,
      results,
    }),
    [timeRange, gameType, color, gameFormat, results]
  );

  // Update active filters count (only count color and results)
  useEffect(() => {
    const count = countActiveFilters(currentFilters, defaultFilters);
    setActiveFiltersCount(count);
    setFiltersApplied(count > 0);
  }, [currentFilters, defaultFilters]);

  // Apply filters to games (only apply color and results filters)
  useEffect(() => {
    const filtered = filterGames(gamesData, currentFilters);
    setFilteredGames(filtered);
  }, [gamesData, currentFilters]);

  // Handle filter application
  const handleApplyFilters = () => {
    setShowFilters(false);
  };

  // Handle filter clearing
  const handleClearFilters = () => {
    setTimeRange(defaultFilters.timeRange);
    setGameType(defaultFilters.gameType);
    setColor(defaultFilters.color);
    setGameFormat(defaultFilters.gameFormat);
    setResults(defaultFilters.results);
    setActiveFiltersCount(0);
    setFiltersApplied(false);
  };

  const setFiltersObj = useMemo(
    () => ({
      setTimeRange,
      setGameType,
      setColor,
      setGameFormat,
      setResults,
    }),
    []
  );

  return {
    filters: currentFilters,
    setFilters: setFiltersObj,
    showFilters,
    setShowFilters,
    activeFiltersCount,
    filtersApplied,
    filteredGames,
    handleApplyFilters,
    handleClearFilters,
  };
}
