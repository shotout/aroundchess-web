import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function FetchStatusManager({
  loading = false,
  error = null,
  onRetry = () => {},
}: {
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading position data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 flex-col">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          onClick={onRetry}
        >
          Retry
        </button>
      </div>
    );
  }

  return null;
}

export function PositionNotFound({
  isCheckmateMode,
  params,
  endgameCategory,
  backLinkTarget,
  backLinkText,
}: {
  isCheckmateMode: boolean;
  params: { slug: string; position: string };
  endgameCategory: any;
  backLinkTarget: string;
  backLinkText: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <p className="text-lg">
        {isCheckmateMode
          ? `Position not found: ${params.position}`
          : !endgameCategory
          ? `Category not found: ${params.slug}`
          : `Subcategory not found: ${params.position}`}
      </p>
      <Link
        href={backLinkTarget}
        className="mt-4 text-blue-600 flex items-center gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        {backLinkText}
      </Link>
    </div>
  );
}

export function PositionHeader({
  getBackLinkTarget,
  getBackLinkText,
  isCheckmateMode,
  positionIndex,
  movesToCheckmate,
  endgameSubcategory,
}: {
  getBackLinkTarget: () => string;
  getBackLinkText: () => string;
  isCheckmateMode: boolean;
  positionIndex: number;
  movesToCheckmate: number;
  endgameSubcategory: any;
}) {
  return (
    <div className="mb-6">
      <Link
        href={getBackLinkTarget()}
        className="text-blue-600 flex items-center gap-1 mb-4"
      >
        <ChevronLeft className="h-4 w-4" />
        {getBackLinkText()}
      </Link>
      <h1 className="text-2xl font-bold text-gray-800">
        {isCheckmateMode
          ? `Position ${positionIndex + 1}`
          : endgameSubcategory?.name}
      </h1>
      <p className="text-gray-600">
        {isCheckmateMode
          ? `Find the ${movesToCheckmate} ${
              movesToCheckmate === 1 ? "move" : "moves"
            } to checkmate`
          : `Practice with these positions`}
      </p>
    </div>
  );
}
