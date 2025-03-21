"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, BookOpen, Check, CheckCircle2 } from "lucide-react";
import { Chessboard } from "react-chessboard";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import {
  useMiddlegameStore,
  getFenFromMoves,
  getSlugFromId,
  DifficultyFilter,
  ApiMiddlegame,
} from "./lib/MiddlegameMapper";
import debounce from "lodash/debounce";
import { useMiddleGameStore } from "./lib/MiddlegameStore";
import DotSpinner from "../game-history/Spinner";

// Constants
const INITIAL_PAGE_SIZE = 6;
const PAGE_INCREMENT = 6;

// Types
interface MiddlegameCardProps {
  middlegame: ApiMiddlegame;
  slug: string;
  lessonCompleted: boolean;
}

// Optimized chess middlegame card component
const MiddlegameCard = React.memo(
  ({ middlegame, slug, lessonCompleted }: MiddlegameCardProps) => {
    return (
      <Card className="border rounded-lg overflow-hidden shadow-sm h-full flex flex-col">
        {/* Chess board visualization with tag */}
        <div className="relative">
          {/* Fixed aspect ratio for the chessboard */}
          <div className="aspect-square bg-white flex items-center justify-center overflow-hidden">
            <div className="w-full h-full p-4 2xl:p-6">
              <Chessboard
                id={`board-${slug}`}
                key={`board-${slug}`}
                position={getFenFromMoves(null)}
                arePiecesDraggable={false}
                customDarkSquareStyle={{
                  backgroundColor: "#5C9DFF",
                }}
                customLightSquareStyle={{
                  backgroundColor: "#fff",
                }}
              />
            </div>
          </div>
          {/* Status indicator based on completion */}
          <span
            className={`absolute top-2 right-2 ${
              lessonCompleted ? "bg-green-100" : "bg-yellow-100"
            } p-1 rounded-full`}
          >
            {lessonCompleted ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <Check className="h-5 w-5 text-yellow-500" />
            )}
          </span>
        </div>

        {/* Info container with uniform padding and fixed height on mobile */}
        <div className="p-4 flex flex-col h-36 sm:h-auto">
          <div className="flex flex-col space-y-2">
            <span className="text-xs border border-blue-base text-blue-base inline-block px-2 py-1 w-fit">
              {middlegame.difficulty}
            </span>
            <div className="flex items-center gap-1">
              <h3 className="font-medium text-gray-900 text-xs line-clamp-2 h-10">
                {middlegame.title}
              </h3>
            </div>
          </div>
          <div
            className={`w-full flex items-center justify-center space-x-2 rounded-full h-10 px-4 py-2 cursor-pointer mt-auto ${
              lessonCompleted
                ? "btn-tertiary text-green-500 border border-green-500"
                : "btn-primary"
            }`}
          >
            {lessonCompleted ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-xs md:text-sm">Continue Learning</span>
              </>
            ) : (
              <>
                <BookOpen className="h-4 w-4" />
                <span className="text-xs md:text-sm">Start Learning</span>
              </>
            )}
          </div>
        </div>
      </Card>
    );
  }
);

MiddlegameCard.displayName = "MiddlegameCard";

// Main component
const MiddlegameStrategyPage: React.FC = () => {
  // Zustand stores
  const { isLessonCompleted, initializeLessonsCount } = useMiddleGameStore();
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
  } = useMiddlegameStore();

  // Local state
  const [isFiltering, setIsFiltering] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [showNoResults, setShowNoResults] = useState(false);
  const [displayCount, setDisplayCount] = useState(INITIAL_PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Load more trigger ref
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  // Fetch all middlegames on initial load
  useEffect(() => {
    if (!initialized) {
      fetchAllMiddlegames();
    }
  }, [initialized, fetchAllMiddlegames]);

  // Initialize lessons count
  useEffect(() => {
    if (pagination?.total) {
      initializeLessonsCount(pagination.total);
    }
  }, [pagination, initializeLessonsCount]);

  // Update no results state
  useEffect(() => {
    // Only show no results message if we've finished loading and have filters set
    if (!isLoading && !isFiltering && (difficultyFilter || searchTerm)) {
      setShowNoResults(filteredMiddlegames.length === 0);
    } else {
      setShowNoResults(false);
    }
  }, [
    filteredMiddlegames.length,
    isLoading,
    isFiltering,
    difficultyFilter,
    searchTerm,
  ]);

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(INITIAL_PAGE_SIZE);
  }, [difficultyFilter, searchTerm]);

  // Handle load more when user scrolls to the trigger
  useEffect(() => {
    if (inView && filteredMiddlegames.length > displayCount && !isLoadingMore) {
      loadMoreItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, displayCount, filteredMiddlegames.length, isLoadingMore]);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setIsFiltering(true);
      setSearchTerm(value);
      // Small delay to allow for rendering
      setTimeout(() => setIsFiltering(false), 300);
    }, 300),
    [setSearchTerm]
  );

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    debouncedSearch(value);
  };

  // Handle difficulty filter changes
  const handleDifficultyChange = (difficulty: DifficultyFilter) => {
    setIsFiltering(true);
    // Toggle difficulty filter
    const newFilter = difficultyFilter === difficulty ? null : difficulty;
    setDifficultyFilter(newFilter);
    // Small delay to allow for rendering
    setTimeout(() => setIsFiltering(false), 300);
  };

  // Load more items handler
  const loadMoreItems = () => {
    setIsLoadingMore(true);
    // Use setTimeout to allow for UI updates
    setTimeout(() => {
      setDisplayCount((prev) =>
        Math.min(prev + PAGE_INCREMENT, filteredMiddlegames.length)
      );
      setIsLoadingMore(false);
    }, 300);
  };

  // Clear all filters
  const clearFilters = () => {
    setIsFiltering(true);
    setLocalSearchTerm("");
    setDifficultyFilter(null);
    setTimeout(() => {
      setDisplayCount(INITIAL_PAGE_SIZE);
      setIsFiltering(false);
    }, 300);
  };

  // Get paginated middlegames
  const paginatedMiddlegames = useMemo(() => {
    return filteredMiddlegames.slice(0, displayCount);
  }, [filteredMiddlegames, displayCount]);

  // Difficulty options
  const difficulties: DifficultyFilter[] = [
    "Beginner",
    "Intermediate",
    "Advanced",
    "Expert",
  ];

  // Determine if more results are available
  const hasMoreResults = filteredMiddlegames.length > displayCount;

  // Content to show based on current state
  const renderContent = () => {
    // Initial loading
    if (isLoading && filteredMiddlegames.length === 0) {
      return (
        <div className="flex justify-center p-12">
          <DotSpinner />
        </div>
      );
    }

    // Error state
    if (error) {
      return (
        <div className="p-12 text-center">
          <h3 className="text-lg font-medium text-red-600">
            Error loading middlegames
          </h3>
          <p className="text-gray-600 mt-2">{error}</p>
          <Button
            onClick={() => fetchAllMiddlegames()}
            className="mt-4"
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      );
    }

    // Filtering in progress
    if (isFiltering) {
      return <DotSpinner />;
    }

    // No results
    if (showNoResults) {
      return (
        <div className="py-12 text-center">
          <h3 className="text-lg font-medium text-gray-900">
            No middlegames found
          </h3>
          <p className="text-gray-600 mt-2">
            Try different search terms or filters
          </p>
        </div>
      );
    }

    // Normal content - middlegame cards
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <AnimatePresence>
            {paginatedMiddlegames.map((middlegame) => {
              // Create slug from ID
              const slug = getSlugFromId(middlegame.id);

              // Check if this lesson is completed
              const lessonCompleted = isLessonCompleted(slug);

              return (
                <Link key={middlegame.id} href={`/middlegame-strategy/${slug}`}>
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="h-full"
                  >
                    <MiddlegameCard
                      middlegame={middlegame}
                      slug={slug}
                      lessonCompleted={lessonCompleted}
                    />
                  </motion.div>
                </Link>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Show load more trigger if more results available */}
        {hasMoreResults && (
          <div ref={ref} className="w-full flex justify-center py-8">
            {isLoadingMore ? (
              <DotSpinner />
            ) : (
              <Button
                variant="outline"
                onClick={loadMoreItems}
                className="my-4"
              >
                Load More
              </Button>
            )}
          </div>
        )}
      </>
    );
  };

  return (
    // Main wrapper with uniform padding
    <main className="w-full p-6 xl:-mt-16">
      {/* Content container with uniform spacing */}
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Middlegame Strategy
          </h1>
          <p className="text-gray-600">
            Master the crucial middle phase of the game with our comprehensive
            strategic lessons
          </p>
        </div>

        {/* Search and filters */}
        <div>
          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
            {/* Search input - 60% width on tablet and desktop */}
            <div className="relative w-full md:w-[60%]">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search className="h-4 w-4" />
              </div>
              <Input
                placeholder="Search topics..."
                className="pl-10 py-2 w-full"
                value={localSearchTerm}
                onChange={handleSearchChange}
              />
            </div>

            {/* Difficulty buttons container - 40% width on tablet and desktop */}
            <div className="w-full md:w-[40%] flex justify-between gap-x-1 xl:gap-x-2">
              {difficulties.map((difficulty) => (
                <Button
                  key={difficulty}
                  variant={
                    difficultyFilter === difficulty ? "default" : "outline"
                  }
                  className={`flex-1 md:flex-initial md:px-6 xl:px-10 h-10 rounded-sm flex items-center justify-center text-xs lg:text-sm whitespace-nowrap overflow-hidden ${
                    difficultyFilter === difficulty
                      ? "bg-blue-base text-white"
                      : ""
                  }`}
                  onClick={() => handleDifficultyChange(difficulty)}
                  disabled={isFiltering}
                >
                  {difficulty}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Main content area */}
        {renderContent()}

        {/* Pagination info */}
        {pagination && filteredMiddlegames.length > 0 && !isFiltering && (
          <div className="text-center text-sm text-gray-500">
            Showing {paginatedMiddlegames.length} of{" "}
            {filteredMiddlegames.length} middlegames
            {filteredMiddlegames.length < pagination.total &&
              ` (${filteredMiddlegames.length} matching your filters out of ${pagination.total} total)`}
          </div>
        )}
      </div>
    </main>
  );
};

export default MiddlegameStrategyPage;
