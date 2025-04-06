import { useState, useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { ApiMiddlegame } from "../middlegame";

const INITIAL_PAGE_SIZE = 6;
const PAGE_INCREMENT = 6;

export function useMiddlegamePagination(filteredMiddlegames: ApiMiddlegame[]) {
  const [displayCount, setDisplayCount] = useState(INITIAL_PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(INITIAL_PAGE_SIZE);
  }, [filteredMiddlegames]);

  // Auto-load more when scrolling to the bottom
  useEffect(() => {
    if (inView && filteredMiddlegames.length > displayCount && !isLoadingMore) {
      loadMoreItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, displayCount, filteredMiddlegames.length, isLoadingMore]);

  const loadMoreItems = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayCount((prev) =>
        Math.min(prev + PAGE_INCREMENT, filteredMiddlegames.length)
      );
      setIsLoadingMore(false);
    }, 300);
  };

  const paginatedMiddlegames = useMemo(() => {
    return filteredMiddlegames.slice(0, displayCount);
  }, [filteredMiddlegames, displayCount]);

  const hasMoreResults = filteredMiddlegames.length > displayCount;

  return {
    paginatedMiddlegames,
    hasMoreResults,
    isLoadingMore,
    loadMoreItems,
    displayCount,
    setDisplayCount,
    ref,
  };
}
