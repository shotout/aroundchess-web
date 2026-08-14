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

  const currentPage = totalPages > 0 ? Math.min(Math.max(1, page), totalPages) : 1;

  const currentData = useMemo(() => {
    const indexOfLastGame = currentPage * itemsPerPage;
    const indexOfFirstGame = indexOfLastGame - itemsPerPage;
    return data.slice(indexOfFirstGame, indexOfLastGame);
  }, [data, currentPage, itemsPerPage]);

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