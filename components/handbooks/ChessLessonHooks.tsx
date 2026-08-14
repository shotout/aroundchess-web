import { useState, useEffect, useMemo, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import debounce from "lodash/debounce";
import { DifficultyFilter, ChessLesson } from "./ChessLessonTypes";

const INITIAL_PAGE_SIZE = 6;
const PAGE_INCREMENT = 6;

export function useChessLessonPagination<T extends ChessLesson>(
  filteredLessons: T[]
) {
  const [displayCount, setDisplayCount] = useState(INITIAL_PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  useEffect(() => {
    setDisplayCount(INITIAL_PAGE_SIZE);
  }, [filteredLessons]);

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

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setIsFiltering(true);
      setSearchTerm(value);
      setTimeout(() => setIsFiltering(false), 300);
    }, 300),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    debouncedSearch(value);
  };

  const handleDifficultyChange = (difficulty: DifficultyFilter) => {
    setIsFiltering(true);
    const newFilter = difficultyFilter === difficulty ? null : difficulty;
    setDifficultyFilter(newFilter);
    setTimeout(() => setIsFiltering(false), 300);
  };

  const clearFilters = () => {
    setIsFiltering(true);
    setLocalSearchTerm("");
    setDifficultyFilter(null);
    setTimeout(() => {
      setIsFiltering(false);
    }, 300);
  };

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
