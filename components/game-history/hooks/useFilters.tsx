import { useState, useEffect, useMemo } from "react";
import { Game, FilterState, DefaultFilters } from "../types/GameHistoryTypes";
import { countActiveFilters, filterGames } from "./useGameData";

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

  // Update active filters count
  useEffect(() => {
    const count = countActiveFilters(currentFilters, defaultFilters);
    setActiveFiltersCount(count);
    setFiltersApplied(count > 0);
  }, [
    timeRange,
    gameType,
    color,
    gameFormat,
    results,
    defaultFilters,
    currentFilters,
  ]);

  // Apply filters to games
  useEffect(() => {
    const filtered = filterGames(gamesData, currentFilters);
    setFilteredGames(filtered);
  }, [
    timeRange,
    gameType,
    color,
    gameFormat,
    results,
    filtersApplied,
    gamesData,
  ]);

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

  return {
    filters: currentFilters,
    setFilters: {
      setTimeRange,
      setGameType,
      setColor,
      setGameFormat,
      setResults,
    },
    showFilters,
    setShowFilters,
    activeFiltersCount,
    filtersApplied,
    filteredGames,
    handleApplyFilters,
    handleClearFilters,
  };
}
