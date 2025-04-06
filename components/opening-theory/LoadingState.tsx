import React from "react";
import { Button } from "@/components/ui/button";
import DotSpinner from "../game-history/Spinner";

interface LoadingStateProps {
  isLoading: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="flex justify-center p-12">
      <DotSpinner />
    </div>
  );
};

interface ErrorStateProps {
  error: string | null;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  if (!error) return null;

  return (
    <div className="p-12 text-center">
      <h3 className="text-lg font-medium text-red-600">
        Error loading openings
      </h3>
      <p className="text-gray-600 mt-2">{error}</p>
      <Button onClick={onRetry} className="mt-4" variant="outline">
        Try Again
      </Button>
    </div>
  );
};

interface FilteringStateProps {
  isFiltering: boolean;
}

export const FilteringState: React.FC<FilteringStateProps> = ({
  isFiltering,
}) => {
  if (!isFiltering) return null;

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <DotSpinner />
      <p className="text-gray-600">Updating results...</p>
    </div>
  );
};

interface NoResultsStateProps {
  showNoResults: boolean;
}

export const NoResultsState: React.FC<NoResultsStateProps> = ({
  showNoResults,
}) => {
  if (!showNoResults) return null;

  return (
    <div className="py-12 text-center">
      <h3 className="text-lg font-medium text-gray-900">No openings found</h3>
      <p className="text-gray-600 mt-2">
        Try different search terms or filters
      </p>
    </div>
  );
};

interface LoadMoreStateProps {
  hasMoreResults: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  setRef: (node: HTMLDivElement | null) => void;
}

export const LoadMoreState: React.FC<LoadMoreStateProps> = ({
  hasMoreResults,
  isLoadingMore,
  onLoadMore,
  setRef,
}) => {
  if (!hasMoreResults) return null;

  return (
    <div ref={setRef} className="w-full flex justify-center py-8">
      {isLoadingMore ? (
        <DotSpinner />
      ) : (
        <Button variant="outline" onClick={onLoadMore} className="my-4">
          Load More
        </Button>
      )}
    </div>
  );
};
