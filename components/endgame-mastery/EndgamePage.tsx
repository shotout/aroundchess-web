import React, { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { getSlugFromId, useEndgameStore } from "./lib/endgameMapper";

// Import components
import EndgameCard from "./EndgameCard";
import EndgameFilters from "./EndgameFilter";
import {
  LoadingState,
  ErrorState,
  FilteringState,
  NoResultsState,
  LoadMoreState,
} from "@/components/opening-theory/LoadingState"; // Reusing the same loading states

// Import custom hooks
import { useEndgamePagination } from "./lib/hooks/useEndgamePagination";
import { useEndgameFilters } from "./lib/hooks/useEndgameFilter";

const EndgamePage: React.FC = () => {
  const {
    filteredEndgames,
    pagination,
    isLoading,
    error,
    difficultyFilter,
    searchTerm,
    initialized,
    fetchAllEndgames,
    setDifficultyFilter,
    setSearchTerm,
    applyFilters,
  } = useEndgameStore();

  // Initialize pagination hook
  const {
    paginatedEndgames,
    hasMoreResults,
    isLoadingMore,
    loadMoreItems,
    displayCount,
    ref,
  } = useEndgamePagination(filteredEndgames);

  // Initialize filters hook
  const {
    localSearchTerm,
    isFiltering,
    showNoResults,
    handleSearchChange,
    handleDifficultyChange,
  } = useEndgameFilters(
    searchTerm,
    setSearchTerm,
    difficultyFilter,
    setDifficultyFilter,
    filteredEndgames
  );

  // Fetch endgames on mount if not already initialized
  useEffect(() => {
    if (!initialized) {
      fetchAllEndgames();
    } else {
      // Force apply filters when component mounts
      applyFilters();
    }
  }, [initialized, fetchAllEndgames, applyFilters]);

  // Render the content based on current state
  const renderContent = () => {
    if (isLoading && filteredEndgames.length === 0) {
      return <LoadingState isLoading={true} />;
    }

    if (error) {
      return <ErrorState error={error} onRetry={fetchAllEndgames} />;
    }

    if (isFiltering) {
      return <FilteringState isFiltering={true} />;
    }

    if (showNoResults) {
      return <NoResultsState showNoResults={true} />;
    }

    return (
      <>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <AnimatePresence>
            {paginatedEndgames.map((endgame) => {
              const slug = getSlugFromId(endgame.id);
              return (
                <EndgameCard key={endgame.id} endgame={endgame} slug={slug} />
              );
            })}
          </AnimatePresence>
        </div>

        <LoadMoreState
          hasMoreResults={hasMoreResults}
          isLoadingMore={isLoadingMore}
          onLoadMore={loadMoreItems}
          setRef={ref}
        />
      </>
    );
  };

  return (
    <main className="w-full p-6 xl:-mt-16">
      <div className="mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Endgame Mastery</h1>
          <p className="text-gray-600">
            Master the crucial final phase of the game with our comprehensive
            endgame lessons
          </p>
        </div>

        <div className="xl:p-4 xl:border xl:rounded-md xl:flex xl:flex-col xl:gap-y-4">
          <EndgameFilters
            localSearchTerm={localSearchTerm}
            handleSearchChange={handleSearchChange}
            difficultyFilter={difficultyFilter}
            handleDifficultyChange={handleDifficultyChange}
            isFiltering={isFiltering}
          />

          {renderContent()}
        </div>

        {pagination && filteredEndgames.length > 0 && !isFiltering && (
          <div className="text-center text-sm text-gray-500">
            Showing {paginatedEndgames.length} of {filteredEndgames.length}{" "}
            endgames
            {filteredEndgames.length < pagination.total &&
              ` (${filteredEndgames.length} matching your filters out of ${pagination.total} total)`}
          </div>
        )}
      </div>
    </main>
  );
};

export default EndgamePage;
