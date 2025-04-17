"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ArrowLeft, ArrowRight } from "lucide-react";
import { Chessboard } from "react-chessboard";
import { useEndgametraining } from "../../store/EndgameTrainingStore";
import { useNavigationStore } from "../../store/NavigationStore";

interface StageDetailViewProps {
  categorySlug: string;
  subcategorySlug: string;
  stageNumber: string;
}

export default function StageDetailView({
  categorySlug,
  subcategorySlug,
  stageNumber,
}: StageDetailViewProps) {
  const router = useRouter();
  const [position, setPosition] = useState<string | null>(null);
  const [targetPosition, setTargetPosition] = useState<string | null>(null);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [isSolved, setIsSolved] = useState<boolean>(false);

  // Get the previous route from the navigation store
  const { previousRoute } = useNavigationStore();

  // Parse stage number
  const stageNum = parseInt(stageNumber);

  // Get endgame data
  const { data, isLoading, error, fetchData } = useEndgametraining();

  // Track if fetch is in progress to prevent multiple fetches
  const fetchInProgress = React.useRef(false);

  // Extract category, subcategory and fetch data
  useEffect(() => {
    const fetchEndgameData = async () => {
      if (!data && !fetchInProgress.current) {
        fetchInProgress.current = true;
        try {
          await fetchData();
        } finally {
          fetchInProgress.current = false;
        }
      }
    };

    fetchEndgameData();
  }, [data, fetchData]);

  // Get position data once data is loaded
  useEffect(() => {
    if (!data || !data.categories) return;

    // Find the category
    const category = data.categories.find(
      (cat) => cat.name.toLowerCase().replace(/\s+/g, "-") === categorySlug
    );

    if (!category) return;

    // Find the subcategory
    const subcategory = category.subcategories.find(
      (sub) => sub.name.toLowerCase().replace(/\s+/g, "-") === subcategorySlug
    );

    if (!subcategory || !subcategory.games) return;

    // Get the game data for this stage (array index is 0-based, but stage numbers start at 1)
    const game = subcategory.games[stageNum - 1];

    if (game) {
      setPosition(game.fen);
      setTargetPosition(game.target);
    }
  }, [data, categorySlug, subcategorySlug, stageNum]);

  // Handle user move
  const onDrop = (sourceSquare: string, targetSquare: string) => {
    // In a real implementation, we would validate if this move brings us closer to the target position
    // For now, we'll just track the moves
    const move = `${sourceSquare}-${targetSquare}`;
    setMoveHistory([...moveHistory, move]);

    // Check if the player has made enough moves to potentially solve the puzzle
    if (moveHistory.length >= 2) {
      // In a real implementation, we would check if the current position matches the target
      // For demo purposes, let's say the puzzle is solved after 3 moves
      setIsSolved(true);
    }

    return true; // Allow the move
  };

  // Navigate to the next or previous stage
  const navigateToStage = (direction: "next" | "previous") => {
    let newStageNum = stageNum;

    if (direction === "next") {
      newStageNum = stageNum + 1;
    } else {
      newStageNum = Math.max(1, stageNum - 1);
    }

    router.push(
      `/playground/endgame-training/${categorySlug}/${subcategorySlug}/stage-${newStageNum}`
    );
  };

  // Go back to the subcategory view
  const goBackToSelection = () => {
    // Use the previous route from the store if available
    if (previousRoute) {
      router.push(previousRoute);
    } else {
      // Fallback to the category page
      router.push(`/playground/endgame-training/${categorySlug}`);
    }
  };

  // Reset the current position
  const resetPosition = () => {
    setMoveHistory([]);
    setIsSolved(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading stage data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 flex-col">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          onClick={() => {
            if (!fetchInProgress.current) {
              fetchInProgress.current = true;
              fetchData().finally(() => {
                fetchInProgress.current = false;
              });
            }
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!position) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-lg">Stage not found or no position data available</p>
        <button
          onClick={goBackToSelection}
          className="mt-4 text-blue-600 flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to stage selection
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header with back button */}
      <div className="mb-6 flex items-center">
        <button
          onClick={goBackToSelection}
          className="text-blue-600 flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to stage selection
        </button>
        <h1 className="text-2xl font-bold text-gray-800 ml-4">
          Stage {stageNum}
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left side - Chessboard */}
        <div className="w-full md:w-1/2">
          <div className="bg-white rounded-xl shadow-md p-6">
            <Chessboard
              position={position}
              onPieceDrop={onDrop}
              boardWidth={500}
            />
          </div>
        </div>

        {/* Right side - Information and controls */}
        <div className="w-full md:w-1/2">
          <div className="bg-white rounded-xl shadow-md p-6 h-full">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">
                Position Information
              </h2>
              <p className="text-gray-600 mb-2">FEN: {position}</p>
              <p className="text-gray-600 mb-4">
                Target: {targetPosition || "Reach the target position"}
              </p>

              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold mb-2">Your Moves:</h3>
                <div className="bg-gray-50 p-3 rounded-lg min-h-24 mb-4">
                  {moveHistory.length > 0 ? (
                    moveHistory.map((move, idx) => (
                      <div key={idx} className="mb-1">
                        <span className="font-medium">{idx + 1}:</span> {move}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">
                      Make your moves on the board
                    </p>
                  )}
                </div>
              </div>

              {/* Feedback message */}
              {isSolved && (
                <div className="mt-4 p-3 rounded-lg bg-green-100 text-green-800 mb-4">
                  Great job! You've solved this position.
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 mt-auto">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={resetPosition}
              >
                Reset Position
              </button>

              <div className="flex-grow"></div>

              {/* Navigation buttons */}
              <div className="flex gap-2">
                {stageNum > 1 && (
                  <button
                    onClick={() => navigateToStage("previous")}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 flex items-center"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Previous Stage
                  </button>
                )}

                <button
                  onClick={() => navigateToStage("next")}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                >
                  Next Stage
                  <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
