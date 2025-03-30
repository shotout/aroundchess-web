import { useState, useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { ApiEndgame } from "../endgame";

const INITIAL_PAGE_SIZE = 6;
const PAGE_INCREMENT = 6;

export function useEndgamePagination(filteredEndgames: ApiEndgame[]) {
  const [displayCount, setDisplayCount] = useState(INITIAL_PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(INITIAL_PAGE_SIZE);
  }, [filteredEndgames]);

  // Auto-load more when scrolling to the bottom
  useEffect(() => {
    if (inView && filteredEndgames.length > displayCount && !isLoadingMore) {
      loadMoreItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, displayCount, filteredEndgames.length, isLoadingMore]);

  const loadMoreItems = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayCount((prev) =>
        Math.min(prev + PAGE_INCREMENT, filteredEndgames.length)
      );
      setIsLoadingMore(false);
    }, 300);
  };

  const paginatedEndgames = useMemo(() => {
    return filteredEndgames.slice(0, displayCount);
  }, [filteredEndgames, displayCount]);

  const hasMoreResults = filteredEndgames.length > displayCount;

  return {
    paginatedEndgames,
    hasMoreResults,
    isLoadingMore,
    loadMoreItems,
    displayCount,
    setDisplayCount,
    ref,
  };
}
