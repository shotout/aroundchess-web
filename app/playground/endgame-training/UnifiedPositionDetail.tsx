"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useEndgametraining } from "./store/EndgameTrainingStore";
import { useCheckmateTraining } from "./store/CheckmateStore";
import CheckmateDetailView from "./components/CheckmateDetailView";
import EndgameDetailView from "./components/EndgameDetailView";

export default function UnifiedEndgameDetail({
  params,
}: {
  params: { slug: string; position: string };
}) {
  const {
    data: endgameData,
    isLoading: endgameLoading,
    error: endgameError,
    fetchData: fetchEndgameData,
  } = useEndgametraining();
  const {
    data: checkmateData,
    isLoading: checkmateLoading,
    error: checkmateError,
    fetchData: fetchCheckmateData,
  } = useCheckmateTraining();

  // Check if we're in checkmate mode
  const isCheckmateMode = params.slug.startsWith("checkmate-");

  // Track if fetches are in progress to prevent multiple fetches
  const endgameFetchInProgress = React.useRef(false);
  const checkmateFetchInProgress = React.useRef(false);

  // Extract the moves count from the slug for checkmate mode
  const movesToCheckmate = React.useMemo(() => {
    if (isCheckmateMode) {
      const match = params.slug.match(/checkmate-(\d+)/);
      return match ? parseInt(match[1]) : 0;
    }
    return 0;
  }, [params.slug, isCheckmateMode]);

  // Extract position index for checkmate mode
  const positionIndex = React.useMemo(() => {
    if (isCheckmateMode) {
      const match = params.position.match(/position-(\d+)/);
      return match ? parseInt(match[1]) - 1 : -1; // Convert to 0-based index
    }
    return -1;
  }, [params.position, isCheckmateMode]);

  // Get the FEN string for checkmate position
  const fen = React.useMemo(() => {
    if (
      !isCheckmateMode ||
      !checkmateData ||
      !Array.isArray(checkmateData) ||
      movesToCheckmate <= 0 ||
      movesToCheckmate > checkmateData.length
    ) {
      return null;
    }

    // Array is 0-indexed, but our moves count starts at 1
    const positions = checkmateData[movesToCheckmate - 1] || [];

    if (positionIndex < 0 || positionIndex >= positions.length) {
      return null;
    }

    return positions[positionIndex];
  }, [checkmateData, movesToCheckmate, positionIndex, isCheckmateMode]);

  // For endgame mode, get category and subcategory
  const [endgameCategory, endgameSubcategory] = React.useMemo(() => {
    if (isCheckmateMode || !endgameData || !endgameData.categories) {
      return [null, null];
    }

    const category = endgameData.categories.find(
      (cat) => cat.name.toLowerCase().replace(/\s+/g, "-") === params.slug
    );

    if (!category) return [null, null];

    const subcategory = category.subcategories.find(
      (sub) => sub.name.toLowerCase().replace(/\s+/g, "-") === params.position
    );

    return [category, subcategory];
  }, [endgameData, params.slug, params.position, isCheckmateMode]);

  // Fetch the appropriate data
  useEffect(() => {
    const fetchData = async () => {
      if (isCheckmateMode) {
        if (!checkmateData && !checkmateFetchInProgress.current) {
          checkmateFetchInProgress.current = true;
          try {
            await fetchCheckmateData();
          } finally {
            checkmateFetchInProgress.current = false;
          }
        }
      } else {
        if (!endgameData && !endgameFetchInProgress.current) {
          endgameFetchInProgress.current = true;
          try {
            await fetchEndgameData();
          } finally {
            endgameFetchInProgress.current = false;
          }
        }
      }
    };

    fetchData();
  }, [
    isCheckmateMode,
    endgameData,
    checkmateData,
    fetchEndgameData,
    fetchCheckmateData,
  ]);

  const isLoading = isCheckmateMode ? checkmateLoading : endgameLoading;
  const error = isCheckmateMode ? checkmateError : endgameError;
  const retryFetch = isCheckmateMode ? fetchCheckmateData : fetchEndgameData;

  // Determine if we're in a "not found" state
  const isNotFound = isCheckmateMode
    ? !fen
    : !endgameCategory || !endgameSubcategory;

  const getBackLinkTarget = () => {
    if (isCheckmateMode) {
      return `/playground/endgame-training/${params.slug}`;
    } else {
      return endgameCategory
        ? `/playground/endgame-training/${params.slug}`
        : "/playground/endgame-training";
    }
  };

  const getBackLinkText = () => {
    if (isCheckmateMode) {
      return `Back to ${movesToCheckmate} move positions`;
    } else {
      return endgameCategory
        ? `Back to ${endgameCategory.name}`
        : "Back to training selection";
    }
  };

  return (
    <div className="w-full -mt-16 sm:-mt-16 md:-mt-20 lg:-mt-20 xl:mt-0">
      <div className="p-6 max-w-6xl mx-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading position data...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64 flex-col">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
              onClick={() => {
                if (isCheckmateMode) {
                  if (!checkmateFetchInProgress.current) {
                    checkmateFetchInProgress.current = true;
                    retryFetch().finally(() => {
                      checkmateFetchInProgress.current = false;
                    });
                  }
                } else {
                  if (!endgameFetchInProgress.current) {
                    endgameFetchInProgress.current = true;
                    retryFetch().finally(() => {
                      endgameFetchInProgress.current = false;
                    });
                  }
                }
              }}
            >
              Retry
            </button>
          </div>
        ) : isNotFound ? (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-lg">
              {isCheckmateMode
                ? `Position not found: ${params.position}`
                : !endgameCategory
                ? `Category not found: ${params.slug}`
                : `Subcategory not found: ${params.position}`}
            </p>
            <Link
              href={getBackLinkTarget()}
              className="mt-4 text-blue-600 flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              {getBackLinkText()}
            </Link>
          </div>
        ) : (
          <>
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

            {isCheckmateMode ? (
              <CheckmateDetailView
                fen={fen}
                positionIndex={positionIndex}
                movesToCheckmate={movesToCheckmate}
                checkmateData={checkmateData}
                params={params}
              />
            ) : (
              <EndgameDetailView endgameSubcategory={endgameSubcategory} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
