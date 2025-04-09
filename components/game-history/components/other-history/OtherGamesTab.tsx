import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { usePgnStore } from "@/app/store/zustandStore";
import { useAuth } from "@clerk/nextjs";

import Filters from "../Filters";
import { toast } from "sonner";
import { useGames } from "../../hooks/useGameData";
import { useFilters } from "../../hooks/useFilters";
import { usePagination } from "../../hooks/usePagination";
import { gameHistoryApi } from "../../services/api";
import GamesList from "../GameList";
import { Game } from "../../types/GameHistoryTypes";

const OtherGamesTab: React.FC = () => {
  const router = useRouter();
  const { sessionId } = useAuth();
  const {
    username,
    setPgn,
    setDataAnalysis,
    setIsLoading: setZustandIsLoading,
  } = usePgnStore();

  // Fetch other games data
  const {
    games,
    isLoading,
    error,
    cacheIsValid,
    handleRetryFetch,
    handleForceRefresh,
  } = useGames("other");

  // Handle filters
  const {
    filters,
    setFilters,
    showFilters,
    setShowFilters,
    activeFiltersCount,
    filtersApplied,
    filteredGames,
    handleApplyFilters,
    handleClearFilters,
  } = useFilters(games);

  // Handle pagination
  const paginationProps = usePagination(filteredGames);

  // Handle game analysis
  const handleAnalyzeClick = useCallback(
    async (game: Game) => {
      try {
        setZustandIsLoading(true);
        setPgn(game.pgn);

        // Depth and timeout parameters may need to be adjusted based on your requirements
        const response = await gameHistoryApi.analyzeGame(
          game.pgn,
          username || undefined,
          15,
          60000
        );

        if (response && response.data) {
          setDataAnalysis(response.data);
          router.push("/analysis");
        } else {
          throw new Error("Invalid analysis response");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Analysis failed";
        setDataAnalysis(null);
        setZustandIsLoading(false);
        toast.error(errorMessage);
      }
    },
    [router, setPgn, setDataAnalysis, setZustandIsLoading, username]
  );

  // Source options specific to other games
  const sourceOptions = [
    { value: "All Formats", label: "All Sources" },
    { value: "Lichess", label: "Lichess" },
    { value: "PGN Upload", label: "PGN Upload" },
    { value: "Tournament", label: "Tournament" },
  ];

  return (
    <div className="mx-auto relative">
      {/* Filters */}
      <Filters
        filters={filters}
        setFilters={setFilters}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        activeFiltersCount={activeFiltersCount}
        filtersApplied={filtersApplied}
        handleApplyFilters={handleApplyFilters}
        handleClearFilters={handleClearFilters}
        handleForceRefresh={handleForceRefresh}
        cacheIsValid={cacheIsValid}
        sourceOptions={sourceOptions}
      />

      {/* Games List */}
      <GamesList
        games={filteredGames}
        currentGames={paginationProps.currentGames}
        isLoading={isLoading}
        error={error}
        handleAnalyzeClick={handleAnalyzeClick}
        handleRetryFetch={handleRetryFetch}
        paginationProps={paginationProps}
      />
    </div>
  );
};

export default OtherGamesTab;
