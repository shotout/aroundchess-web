import React, { useEffect } from "react";
import ChessLessonCard from "./ChessLessonCard";
import ChessLessonFilter from "./ChessLessonFilter";
import {
  LoadingState,
  ErrorState,
  FilteringState,
  NoResultsState,
} from "./LoadingState"; 
import {
  useChessLessonFilters,
} from "./ChessLessonHooks"; 
import { ChessLesson, ChessLessonState, LessonType } from "./ChessLessonTypes";
import { getFenFromMoves, getSlugFromId } from "./ChessLessonUtils";
import { useProfileStore } from "@/app/store/profile";

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
  const { sessionId } = useProfileStore();

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

  const fetchWithAuth = async () => {
    try {
      await fetchAllLessons(sessionId || undefined);
    } catch (error) {
      console.error(`Error fetching ${lessonType}:`, error);
    }
  };

  useEffect(() => {
    if (!initialized) {
      fetchWithAuth();
    } else {
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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 lg:gap-4">
        {filteredLessons.map((lesson) => {
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
      </div>
    );
  };

  return (
    <main className="w-full p-3 lg:p-6 xl:-mt-16">
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

      </div>
    </main>
  );
}

export default ChessLessonPage;