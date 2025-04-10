import { useState, useEffect, useMemo, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import debounce from "lodash/debounce";
import { DifficultyFilter, ChessLesson } from "./ChessLessonTypes";

// Constants for pagination
const INITIAL_PAGE_SIZE = 6;
const PAGE_INCREMENT = 6;

/**
 * Custom hook for handling pagination of chess lessons
 */
export function useChessLessonPagination<T extends ChessLesson>(
  filteredLessons: T[]
) {
  const [displayCount, setDisplayCount] = useState(INITIAL_PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(INITIAL_PAGE_SIZE);
  }, [filteredLessons]);

  // Auto-load more when scrolling to the bottom
  useEffect(() => {
    if (inView && filteredLessons.length > displayCount && !isLoadingMore) {
      loadMoreItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, displayCount, filteredLessons.length, isLoadingMore]);

  const loadMoreItems = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayCount((prev) =>
        Math.min(prev + PAGE_INCREMENT, filteredLessons.length)
      );
      setIsLoadingMore(false);
    }, 300);
  };

  const paginatedLessons = useMemo(() => {
    return filteredLessons.slice(0, displayCount);
  }, [filteredLessons, displayCount]);

  const hasMoreResults = filteredLessons.length > displayCount;

  return {
    paginatedLessons,
    hasMoreResults,
    isLoadingMore,
    loadMoreItems,
    displayCount,
    setDisplayCount,
    ref,
  };
}

/**
 * Custom hook for handling filters for chess lessons
 */
export function useChessLessonFilters(
  searchTerm: string,
  setSearchTerm: (term: string) => void,
  difficultyFilter: DifficultyFilter,
  setDifficultyFilter: (filter: DifficultyFilter) => void,
  filteredLessons: any[]
) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [isFiltering, setIsFiltering] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);

  // Create a stable reference to the debounced search function
  // that won't recreate on every render
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setIsFiltering(true);
      setSearchTerm(value);
      setTimeout(() => setIsFiltering(false), 300);
    }, 300),
    // Intentionally omit setSearchTerm from deps to prevent recreation
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
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
      setShowNoResults(filteredLessons.length === 0);
    } else {
      setShowNoResults(false);
    }
  }, [filteredLessons.length, isFiltering, difficultyFilter, searchTerm]);

  return {
    localSearchTerm,
    isFiltering,
    showNoResults,
    handleSearchChange,
    handleDifficultyChange,
    clearFilters,
  };
}
