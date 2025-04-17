"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useEndgametraining } from "./store/EndgameTrainingStore";
import { useCheckmateTraining } from "./store/CheckmateStore";
import CheckmateDetailView from "./components/moves/CheckmateDetailView";
import EndgameDetailView from "./components/board/EndgameDetailView";
import {
  FetchStatusManager,
  PositionHeader,
  PositionNotFound,
} from "./utils/Helpers";

interface UnifiedEndgameDetailProps {
  params: { slug: string; position: string };
}

export default function UnifiedPositionDetail({
  params,
}: UnifiedEndgameDetailProps) {
  const endgameState = useEndgametraining();
  const checkmateState = useCheckmateTraining();

  const isCheckmateMode = params.slug.startsWith("checkmate-");
  const currentState = isCheckmateMode ? checkmateState : endgameState;

  const { data, isLoading, error, fetchData } = currentState;

  // Track if fetches are in progress to prevent multiple fetches
  const fetchInProgress = React.useRef(false);

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

  // Get endgame category and subcategory
  const [endgameCategory, endgameSubcategory] = React.useMemo(() => {
    if (isCheckmateMode || !data || !endgameState.data?.categories) {
      return [null, null];
    }

    const category = endgameState.data.categories.find(
      (cat) => cat.name.toLowerCase().replace(/\s+/g, "-") === params.slug
    );

    if (!category) return [null, null];

    const subcategory = category.subcategories.find(
      (sub) => sub.name.toLowerCase().replace(/\s+/g, "-") === params.position
    );

    return [category, subcategory];
  }, [data, params.slug, params.position, isCheckmateMode, endgameState.data]);

  // Get the FEN string for checkmate position
  const fen = React.useMemo(() => {
    if (
      !isCheckmateMode ||
      !data ||
      !Array.isArray(data) ||
      movesToCheckmate <= 0 ||
      movesToCheckmate > data.length
    ) {
      return null;
    }

    const positions = data[movesToCheckmate - 1] || [];

    if (positionIndex < 0 || positionIndex >= positions.length) {
      return null;
    }

    return positions[positionIndex];
  }, [data, movesToCheckmate, positionIndex, isCheckmateMode]);

  // Fetch the appropriate data
  useEffect(() => {
    if (!data && !fetchInProgress.current) {
      fetchInProgress.current = true;
      fetchData().finally(() => {
        fetchInProgress.current = false;
      });
    }
  }, [data, fetchData]);

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
          <FetchStatusManager loading />
        ) : error ? (
          <FetchStatusManager error={error} onRetry={fetchData} />
        ) : isNotFound ? (
          <PositionNotFound
            isCheckmateMode={isCheckmateMode}
            params={params}
            endgameCategory={endgameCategory}
            backLinkTarget={getBackLinkTarget()}
            backLinkText={getBackLinkText()}
          />
        ) : (
          <>
            <PositionHeader
              getBackLinkTarget={getBackLinkTarget}
              getBackLinkText={getBackLinkText}
              isCheckmateMode={isCheckmateMode}
              positionIndex={positionIndex}
              movesToCheckmate={movesToCheckmate}
              endgameSubcategory={endgameSubcategory}
            />

            {isCheckmateMode ? (
              <CheckmateDetailView
                fen={fen}
                positionIndex={positionIndex}
                movesToCheckmate={movesToCheckmate}
                checkmateData={data as string[][] | null}
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
