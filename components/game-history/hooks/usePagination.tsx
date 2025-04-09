import { useState, useMemo } from "react";
import { Game } from "../types/GameHistoryTypes";

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

export function usePagination(games: Game[]): UsePaginationResult {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Calculate total pages
  const totalPages = useMemo(
    () => Math.ceil(games.length / itemsPerPage),
    [games.length, itemsPerPage]
  );

  // Get current page's games
  const currentGames = useMemo(() => {
    const indexOfLastGame = currentPage * itemsPerPage;
    const indexOfFirstGame = indexOfLastGame - itemsPerPage;
    return games.slice(indexOfFirstGame, indexOfLastGame);
  }, [games, currentPage, itemsPerPage]);

  // Navigate to next page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Navigate to previous page
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Reset to first page when games or itemsPerPage changes
  useMemo(() => {
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [games.length, itemsPerPage]);

  return {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    currentGames,
    totalPages,
    goToNextPage,
    goToPreviousPage,
  };
}
