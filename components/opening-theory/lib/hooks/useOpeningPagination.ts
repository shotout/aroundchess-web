import { useState, useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { ApiOpening } from "../../lib/opening";

const INITIAL_PAGE_SIZE = 6;
const PAGE_INCREMENT = 6;

export function useOpeningPagination(filteredOpenings: ApiOpening[]) {
  const [displayCount, setDisplayCount] = useState(INITIAL_PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(INITIAL_PAGE_SIZE);
  }, [filteredOpenings]);

  // Auto-load more when scrolling to the bottom
  useEffect(() => {
    if (inView && filteredOpenings.length > displayCount && !isLoadingMore) {
      loadMoreItems();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, displayCount, filteredOpenings.length, isLoadingMore]);

  const loadMoreItems = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayCount((prev) =>
        Math.min(prev + PAGE_INCREMENT, filteredOpenings.length)
      );
      setIsLoadingMore(false);
    }, 300);
  };

  const paginatedOpenings = useMemo(() => {
    return filteredOpenings.slice(0, displayCount);
  }, [filteredOpenings, displayCount]);

  const hasMoreResults = filteredOpenings.length > displayCount;

  return {
    paginatedOpenings,
    hasMoreResults,
    isLoadingMore,
    loadMoreItems,
    displayCount,
    setDisplayCount,
    ref,
  };
}