import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { usePgnStore } from "@/app/store/zustandStore";
import { useAuth } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { useGames } from "../../hooks/useGameData";
import { useFilters } from "../../hooks/useFilters";
import { usePagination } from "../../hooks/usePagination";
import { Game } from "../../types/GameHistoryTypes";
import { gameHistoryApi } from "../../services/api";
import { toast } from "sonner";
import Filters from "../Filters";
import GamesList from "../GameList";
import { useStockfishAnalysis } from "@/utils/stockfish-utils";
import { usePricingOffer } from "@/app/store/pricingOffer";
import { useProfileStore } from "@/app/store/profile";

const GamesTab: React.FC = () => {
  const { proceedAnalysis } = useStockfishAnalysis();
  const router = useRouter();
  const {
    username,
    setPgn,
    setDataAnalysis,
    setIsLoading: setZustandIsLoading,
  } = usePgnStore();
  const { setOpen: setOpenPricing, setTabType } = usePricingOffer();
  const { isMember, token } = useProfileStore();
  // Fetch games data
  const {
    games,
    isLoading,
    error,
    cacheIsValid,
    handleRetryFetch,
    handleForceRefresh,
  } = useGames("chessdotcom");

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

  const paginationProps = usePagination(filteredGames);

  // Handle game analysis
  const handleAnalyzeClick = useCallback(
    async (game: Game) => {
      if (token.balance > 1) {
        try {
          setZustandIsLoading(true);
          setPgn(game.pgn);

          const response = await proceedAnalysis(
            game?.pgn,
            username,
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
      } else {
        setOpenPricing(true);
        setTabType("tokens");
      }
    },
    [router, setPgn, setDataAnalysis, setZustandIsLoading, username]
  );

  const sourceOptions = [
    { value: "All Formats", label: "All Sources" },
    { value: "Chess.com", label: "Chess.com" },
    { value: "PGN Upload", label: "PGN Upload" },
    { value: "Online Games", label: "Online Games" },
    { value: "Tournaments", label: "Tournaments" },
  ];

  return (
    <div className="mx-auto relative">
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

export default GamesTab;
