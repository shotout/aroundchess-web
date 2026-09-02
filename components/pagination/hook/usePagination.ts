// usePagination.ts
import { useState, useMemo } from "react";

export interface UsePaginationResult {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (count: number) => void;
  currentData: any[];
  totalPages: number;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
}

export function usePagination(
  data: any[],
  initialItemsPerPage = 10
): UsePaginationResult {
  const [page, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const totalPages = useMemo(() => Math.ceil(data.length / itemsPerPage), [data.length, itemsPerPage]);

  // Clamped rather than taken from state as-is. A page number can fall out of
  // range without anyone navigating: raise "Shows per Page" from 5 to 50 while
  // on page 3, or filter the list down, and the slice below would start past the
  // end of the data and render nothing at all.
  const currentPage = totalPages > 0 ? Math.min(Math.max(1, page), totalPages) : 1;

  const currentData = useMemo(() => {
    const indexOfLastGame = currentPage * itemsPerPage;
    const indexOfFirstGame = indexOfLastGame - itemsPerPage;
    return data.slice(indexOfFirstGame, indexOfLastGame);
  }, [data, currentPage, itemsPerPage]);

  // Stepped off the clamped page, so a stale out-of-range value can't make the
  // arrows look dead for a click or two.
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

  return {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    currentData,
    totalPages,
    goToNextPage,
    goToPreviousPage
  };
}