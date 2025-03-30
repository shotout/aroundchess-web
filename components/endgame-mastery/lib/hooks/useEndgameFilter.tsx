import { useState, useCallback, useEffect } from "react";
import debounce from "lodash/debounce";
import { DifficultyFilter } from "../endgame";

export function useEndgameFilters(
  searchTerm: string,
  setSearchTerm: (term: string) => void,
  difficultyFilter: DifficultyFilter | null,
  setDifficultyFilter: (filter: DifficultyFilter | null) => void,
  filteredEndgames: any[]
) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [isFiltering, setIsFiltering] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setIsFiltering(true);
      setSearchTerm(value);
      setTimeout(() => setIsFiltering(false), 300);
    }, 300),
    [setSearchTerm]
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    debouncedSearch(value);
  };

  // Handle difficulty filter change
  const handleDifficultyChange = (difficulty: DifficultyFilter) => {
    setIsFiltering(true);
    const newFilter = difficultyFilter === difficulty ? null : difficulty;
    setDifficultyFilter(newFilter);
    setTimeout(() => setIsFiltering(false), 300);
  };

  // Clear all filters
  const clearFilters = () => {
    setIsFiltering(true);
    setLocalSearchTerm("");
    setDifficultyFilter(null);
    setTimeout(() => {
      setIsFiltering(false);
    }, 300);
  };

  // Check for no results after filtering
  useEffect(() => {
    if (!isFiltering && (difficultyFilter || searchTerm)) {
      setShowNoResults(filteredEndgames.length === 0);
    } else {
      setShowNoResults(false);
    }
  }, [filteredEndgames.length, isFiltering, difficultyFilter, searchTerm]);

  return {
    localSearchTerm,
    isFiltering,
    showNoResults,
    handleSearchChange,
    handleDifficultyChange,
    clearFilters,
  };
}
