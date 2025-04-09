import React, { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import {
  getSlugFromId,
  useMiddlegameStore,
  getFenFromMoves,
} from "./lib/middlegameMapper";
import { useAuth } from "@clerk/nextjs";

// Import the new unified card component instead of the specific one
import MiddlegameFilters from "./MiddlegameFilter";

import { useMiddlegamePagination } from "./lib/hooks/useMiddlegamePagination";
import { useMiddlegameFilters } from "./lib/hooks/useMiddlegameFilter";
import {
  ErrorState,
  FilteringState,
  LoadingState,
  LoadMoreState,
  NoResultsState,
} from "../handbooks/LoadingState";
import ChessLessonCard from "../handbooks/HandbookCard";

const MiddlegamePage: React.FC = () => {
  const { sessionId } = useAuth();

  const {
    filteredMiddlegames,
    pagination,
    isLoading,
    error,
    difficultyFilter,
    searchTerm,
    initialized,
    fetchAllMiddlegames,
    fetchMiddlegameDetails,
    setDifficultyFilter,
    setSearchTerm,
    applyFilters,
  } = useMiddlegameStore();

  const {
    paginatedMiddlegames,
    hasMoreResults,
    isLoadingMore,
    loadMoreItems,
    displayCount,
    ref,
  } = useMiddlegamePagination(filteredMiddlegames);

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

  const fetchMiddlegameDetailsWithAuth = async (id: string) => {
    try {
      return await fetchMiddlegameDetails(id, sessionId || undefined);
    } catch (error) {
      console.error("Error fetching middlegame with auth:", error);
      return await fetchMiddlegameDetails(id);
    }
  };

  const fetchWithAuth = async () => {
    try {
      await fetchAllMiddlegames(sessionId || undefined);
    } catch (error) {
      console.error("Error fetching with auth:", error);
      await fetchAllMiddlegames();
    }
  };

  useEffect(() => {
    if (!initialized) {
      fetchWithAuth();
    } else {
      applyFilters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized, applyFilters, sessionId]);

  const renderContent = () => {
    if (isLoading && filteredMiddlegames.length === 0) {
      return <LoadingState isLoading={true} />;
    }

    if (error) {
      return <ErrorState error={error} onRetry={fetchWithAuth} />;
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
                <ChessLessonCard
                  key={middlegame.id}
                  lesson={{
                    title: middlegame.title,
                    difficulty: middlegame.difficulty,
                    moves: middlegame.moves,
                  }}
                  slug={slug}
                  lessonType="middlegame"
                  getFenFromMoves={getFenFromMoves}
                  fetchDetails={fetchMiddlegameDetailsWithAuth}
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
