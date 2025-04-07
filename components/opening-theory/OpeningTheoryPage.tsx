import React, { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { getSlugFromId, useOpeningsStore } from "./lib/openingMapper";

// Import extracted components
import OpeningCard from "./OpeningCard";
import OpeningFilters from "./OpeningFilter";
import {
  LoadingState,
  ErrorState,
  FilteringState,
  NoResultsState,
  LoadMoreState,
} from "./LoadingState";

// Import custom hooks
import { useOpeningPagination } from "./lib/hooks/useOpeningPagination";
import { useOpeningFilters } from "./lib/hooks/useOpeningFilter";

const OpeningTheoryPage: React.FC = () => {
  const {
    filteredOpenings,
    pagination,
    isLoading,
    error,
    difficultyFilter,
    searchTerm,
    initialized,
    fetchAllOpenings,
    setDifficultyFilter,
    setSearchTerm,
    applyFilters,
  } = useOpeningsStore();

  // Initialize pagination hook
  const {
    paginatedOpenings,
    hasMoreResults,
    isLoadingMore,
    loadMoreItems,
    displayCount,
    ref,
  } = useOpeningPagination(filteredOpenings);

  // Initialize filters hook
  const {
    localSearchTerm,
    isFiltering,
    showNoResults,
    handleSearchChange,
    handleDifficultyChange,
  } = useOpeningFilters(
    searchTerm,
    setSearchTerm,
    difficultyFilter,
    setDifficultyFilter,
    filteredOpenings
  );

  // Fetch openings on mount if not already initialized
  useEffect(() => {
    if (!initialized) {
      fetchAllOpenings();
    } else {
      // Force apply filters when component mounts
      applyFilters();
    }
  }, [initialized, fetchAllOpenings, applyFilters]);

  // Render the content based on current state
  const renderContent = () => {
    if (isLoading && filteredOpenings.length === 0) {
      return <LoadingState isLoading={true} />;
    }

    if (error) {
      return <ErrorState error={error} onRetry={fetchAllOpenings} />;
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
            {paginatedOpenings.map((opening) => {
              const slug = getSlugFromId(opening.id);

              return (
                <OpeningCard key={opening.id} opening={opening} slug={slug} />
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
          <h1 className="text-2xl font-bold text-gray-900">Opening Theory</h1>
          <p className="text-gray-600">
            Master the first phase of the game with our comprehensive opening
            lessons
          </p>
        </div>

        <div className="xl:p-4 xl:border xl:rounded-md xl:flex xl:flex-col xl:gap-y-4">
          <OpeningFilters
            localSearchTerm={localSearchTerm}
            handleSearchChange={handleSearchChange}
            difficultyFilter={difficultyFilter}
            handleDifficultyChange={handleDifficultyChange}
            isFiltering={isFiltering}
          />

          {renderContent()}
        </div>

        {pagination && filteredOpenings.length > 0 && !isFiltering && (
          <div className="text-center text-sm text-gray-500">
            Showing {paginatedOpenings.length} of {filteredOpenings.length}{" "}
            openings
            {filteredOpenings.length < pagination.total &&
              ` (${filteredOpenings.length} matching your filters out of ${pagination.total} total)`}
          </div>
        )}
      </div>
    </main>
  );
};

export default OpeningTheoryPage;
