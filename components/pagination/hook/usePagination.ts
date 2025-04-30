// usePagination.ts
import { useState, useMemo } from "react";

interface UsePaginationResult {
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
  data: any[]
): UsePaginationResult {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const totalPages = useMemo(() => Math.ceil(data.length / itemsPerPage), [data.length, itemsPerPage]);
  
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