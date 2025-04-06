// usePagination.ts
import { useState, useMemo } from "react";
import { Game } from "@/app/store/zustandStore";

interface UsePaginationResult {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (count: number) => void;
  currentGames: Game[];
  totalPages: number;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
}

export function usePagination(
  games: Game[]
): UsePaginationResult {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = useMemo(() => Math.ceil(games.length / itemsPerPage), [games.length, itemsPerPage]);
  
  const currentGames = useMemo(() => {
    const indexOfLastGame = currentPage * itemsPerPage;
    const indexOfFirstGame = indexOfLastGame - itemsPerPage;
    return games.slice(indexOfFirstGame, indexOfLastGame);
  }, [games, currentPage, itemsPerPage]);

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
    currentGames,
    totalPages,
    goToNextPage,
    goToPreviousPage
  };
}