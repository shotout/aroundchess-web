"use client";

import React, { useState } from "react";
import { Chessboard } from "react-chessboard";

interface CheckmateDetailViewProps {
  fen: string | null;
  positionIndex: number;
  movesToCheckmate: number;
  checkmateData: string[][] | null;
  params: { slug: string; position: string };
  onNextPosition?: () => void;
  onPreviousPosition?: () => void;
}

export default function CheckmateDetailView({
  fen,
  positionIndex,
  movesToCheckmate,
  checkmateData,
  params,
  onNextPosition,
  onPreviousPosition,
}: CheckmateDetailViewProps) {
  const [userMoves, setUserMoves] = useState<string[]>([]);
  const [showSolution, setShowSolution] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!fen) return null;

  const handleMove = (from: string, to: string) => {
    const moveNotation = `${from}-${to}`;
    const newMoves = [...userMoves, moveNotation];
    setUserMoves(newMoves);

    if (newMoves.length >= movesToCheckmate) {
      setFeedback("Great job! That's a checkmate sequence.");
    }

    return true;
  };

  const handleReset = () => {
    setUserMoves([]);
    setShowSolution(false);
    setFeedback(null);
  };

  const handleShowSolution = () => {
    setShowSolution(true);
  };

  const hasNextPosition =
    checkmateData &&
    Array.isArray(checkmateData) &&
    movesToCheckmate > 0 &&
    movesToCheckmate <= checkmateData.length &&
    positionIndex < (checkmateData[movesToCheckmate - 1]?.length || 0) - 1;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="text-center mb-4">
        <p className="text-sm text-gray-500">FEN: {fen}</p>
      </div>

      <div className="flex justify-center mb-6">
        <Chessboard position={fen} onPieceDrop={handleMove} />
      </div>

      <div className="mt-4">
        <h3 className="font-semibold text-lg mb-2">Your moves:</h3>
        <div className="bg-gray-50 p-3 rounded-lg min-h-14">
          {userMoves.length > 0 ? (
            userMoves.map((move, idx) => (
              <div key={idx} className="mb-1">
                <span className="font-medium">{idx + 1}:</span> {move}
              </div>
            ))
          ) : (
            <p className="text-gray-500">Make your moves on the board</p>
          )}
        </div>
      </div>

      {feedback && (
        <div className="mt-4 p-3 rounded-lg bg-green-100 text-green-800">
          {feedback}
        </div>
      )}

      {showSolution && (
        <div className="mt-4">
          <h3 className="font-semibold text-lg mb-2">Solution:</h3>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p>
              In a real implementation, the solution would be calculated by a
              chess engine. For this position, you need to find a sequence of{" "}
              {movesToCheckmate} moves that leads to checkmate.
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={handleReset}
        >
          Reset
        </button>

        {!showSolution && (
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            onClick={handleShowSolution}
          >
            Show Hint
          </button>
        )}

        <div className="flex-grow"></div>

        {positionIndex > 0 && onPreviousPosition && (
          <button
            onClick={onPreviousPosition}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Previous
          </button>
        )}

        {hasNextPosition && onNextPosition && (
          <button
            onClick={onNextPosition}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
          >
            Next
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
