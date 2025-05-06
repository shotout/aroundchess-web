import React, { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import ChessLessonCard from "./ChessLessonCard";
import ChessLessonFilter from "./ChessLessonFilter";
import {
  LoadingState,
  ErrorState,
  FilteringState,
  NoResultsState,
  LoadMoreState,
} from "./LoadingState";
import {
  useChessLessonPagination,
  useChessLessonFilters,
} from "./ChessLessonHooks";
import { ChessLesson, ChessLessonState, LessonType } from "./ChessLessonTypes";
import { getFenFromMoves, getSlugFromId } from "./ChessLessonUtils";

interface ChessLessonPageProps<T extends ChessLesson> {
  lessonType: LessonType;
  lessonStore: ChessLessonState<T> & {
    readStatusMap?: Record<string, boolean>;
    checkReadStatus?: (id: string, sessionId?: string) => Promise<boolean>;
  };
  title: string;
  description: string;
}

function ChessLessonPage<T extends ChessLesson>({
  lessonType,
  lessonStore,
  title,
  description,
}: ChessLessonPageProps<T>) {
  const sessionId = localStorage.getItem("token");

  const {
    filteredLessons,
    pagination,
    isLoading,
    error,
    difficultyFilter,
    searchTerm,
    initialized,
    fetchAllLessons,
    fetchLessonDetails,
    setDifficultyFilter,
    setSearchTerm,
    applyFilters,
  } = lessonStore;

  const {
    paginatedLessons,
    hasMoreResults,
    isLoadingMore,
    loadMoreItems,
    ref,
  } = useChessLessonPagination<T>(filteredLessons);

  const {
    localSearchTerm,
    isFiltering,
    showNoResults,
    handleSearchChange,
    handleDifficultyChange,
  } = useChessLessonFilters(
    searchTerm,
    setSearchTerm,
    difficultyFilter,
    setDifficultyFilter,
    filteredLessons
  );

  // Simplified fetch with authentication - no longer need separate fetchLessonDetailsWithAuth
  const fetchWithAuth = async () => {
    try {
      // This single call will handle authentication properly
      await fetchAllLessons(sessionId || undefined);
    } catch (error) {
      console.error(`Error fetching ${lessonType}:`, error);
    }
  };

  useEffect(() => {
    // Only fetch if not initialized
    if (!initialized) {
      fetchWithAuth();
    } else {
      // Just apply filters when already initialized
      applyFilters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized, sessionId]);

  const renderContent = () => {
    if (isLoading && filteredLessons.length === 0) {
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
            {paginatedLessons.map((lesson) => {
              const slug = getSlugFromId(lesson.id, lessonType);
              return (
                <ChessLessonCard
                  key={lesson.id}
                  lesson={lesson}
                  slug={slug}
                  lessonType={lessonType}
                  getFenFromMoves={getFenFromMoves}
                  fetchDetails={fetchLessonDetails}
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
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600">{description}</p>
        </div>

        <div className="xl:p-4 xl:border xl:rounded-md xl:flex xl:flex-col xl:gap-y-4">
          <ChessLessonFilter
            localSearchTerm={localSearchTerm}
            handleSearchChange={handleSearchChange}
            difficultyFilter={difficultyFilter}
            handleDifficultyChange={handleDifficultyChange}
            isFiltering={isFiltering}
          />

          {renderContent()}
        </div>

        {pagination && filteredLessons.length > 0 && !isFiltering && (
          <div className="text-center text-sm text-gray-500">
            Showing {paginatedLessons.length} of {filteredLessons.length}{" "}
            {lessonType === "opening"
              ? "openings"
              : lessonType === "middlegame"
              ? "strategies"
              : "endgames"}
            {filteredLessons.length < (pagination?.total || 0) &&
              ` (${filteredLessons.length} matching your filters out of ${pagination?.total} total)`}
          </div>
        )}
      </div>
    </main>
  );
}

export default ChessLessonPage;
