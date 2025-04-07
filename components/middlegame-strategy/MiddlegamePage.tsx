import React, { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { getSlugFromId, useMiddlegameStore } from "./lib/middlegameMapper";

// Import components
import MiddlegameCard from "./MiddlegameCard";
import MiddlegameFilters from "./MiddlegameFilter";
import {
  LoadingState,
  ErrorState,
  FilteringState,
  NoResultsState,
  LoadMoreState,
} from "./LoadingState";

// Import custom hooks
import { useMiddlegamePagination } from "./lib/hooks/useMiddlegamePagination";
import { useMiddlegameFilters } from "./lib/hooks/useMiddlegameFilter";

const MiddlegamePage: React.FC = () => {
  const {
    filteredMiddlegames,
    pagination,
    isLoading,
    error,
    difficultyFilter,
    searchTerm,
    initialized,
    fetchAllMiddlegames,
    setDifficultyFilter,
    setSearchTerm,
    applyFilters,
  } = useMiddlegameStore();

  // Initialize pagination hook
  const {
    paginatedMiddlegames,
    hasMoreResults,
    isLoadingMore,
    loadMoreItems,
    displayCount,
    ref,
  } = useMiddlegamePagination(filteredMiddlegames);

  // Initialize filters hook
  const {
    localSearchTerm,
    isFiltering,
    showNoResults,
    handleSearchChange,
    handleDifficultyChange,
  } = useMiddlegameFilters(
    searchTerm,
    setSearchTerm,
    difficultyFilter,
    setDifficultyFilter,
    filteredMiddlegames
  );

  // Fetch middlegames on mount if not already initialized
  useEffect(() => {
    if (!initialized) {
      fetchAllMiddlegames();
    } else {
      // Force apply filters when component mounts
      applyFilters();
    }
  }, [initialized, fetchAllMiddlegames, applyFilters]);

  // Render the content based on current state
  const renderContent = () => {
    if (isLoading && filteredMiddlegames.length === 0) {
      return <LoadingState isLoading={true} />;
    }

    if (error) {
      return <ErrorState error={error} onRetry={fetchAllMiddlegames} />;
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
            {paginatedMiddlegames.map((middlegame) => {
              const slug = getSlugFromId(middlegame.id);
              return (
                <MiddlegameCard
                  key={middlegame.id}
                  middlegame={middlegame}
                  slug={slug}
                />
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
          <h1 className="text-2xl font-bold text-gray-900">
            Middlegame Strategy
          </h1>
          <p className="text-gray-600">
            Master the critical middle phase of the game with our comprehensive
            strategy lessons
          </p>
        </div>

        <div className="xl:p-4 xl:border xl:rounded-md xl:flex xl:flex-col xl:gap-y-4">
          <MiddlegameFilters
            localSearchTerm={localSearchTerm}
            handleSearchChange={handleSearchChange}
            difficultyFilter={difficultyFilter}
            handleDifficultyChange={handleDifficultyChange}
            isFiltering={isFiltering}
          />

          {renderContent()}
        </div>

        {pagination && filteredMiddlegames.length > 0 && !isFiltering && (
          <div className="text-center text-sm text-gray-500">
            Showing {paginatedMiddlegames.length} of{" "}
            {filteredMiddlegames.length} strategies
            {filteredMiddlegames.length < pagination.total &&
              ` (${filteredMiddlegames.length} matching your filters out of ${pagination.total} total)`}
          </div>
        )}
      </div>
    </main>
  );
};

export default MiddlegamePage;
