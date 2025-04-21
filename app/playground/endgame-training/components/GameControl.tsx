"use client";

import React from "react";
import { RotateCcw, Download, Settings } from "lucide-react";
import { Chess } from "chess.js";

interface GameControlsProps {
  game: Chess;
  gameStatus: string;
  handleHint: () => void;
  showSolution: () => void;
  resetPosition: () => void;
  navigateNext: () => void;
  navigatePrevious: () => void;
  isCheckmateMode: boolean;
}

export default function GameControls({
  game,
  gameStatus,
  handleHint,
  showSolution,
  resetPosition,
  navigateNext,
  navigatePrevious,
  isCheckmateMode,
}: GameControlsProps) {
  return (
    <div className="mt-auto p-4 grid grid-cols-3 gap-4">
      <button
        className="flex items-center justify-center p-3 bg-blue-100 text-blue-600 rounded-md border border-blue-200"
        onClick={handleHint}
        disabled={gameStatus !== "ongoing"}
      >
        <span className="mr-2">💡</span> Hint
      </button>

      <button
        className="flex items-center justify-center p-3 bg-gray-100 text-gray-700 rounded-md border border-gray-200"
        onClick={showSolution}
        disabled={gameStatus !== "ongoing"}
      >
        <span className="mr-2">➡️</span> Solution
      </button>

      <button
        onClick={resetPosition}
        className="flex items-center justify-center p-3 bg-blue-50 text-blue-base font-semibold rounded-md border border-blue-200"
      >
        <RotateCcw className="h-4 w-4 mr-2 text-blue-base" />
        Rematch
      </button>

      <button
        onClick={navigateNext}
        className="col-span-3 flex items-center justify-center p-3 bg-white text-blue-600 rounded-md border border-blue-600"
      >
        <span className="mr-2">➡️</span>
        {isCheckmateMode ? "Next Position" : "Next Stage"}
      </button>

      <div className="col-span-1 flex items-center justify-center p-3 bg-white text-blue-600 rounded-md border border-gray-200">
        <Download
          className="h-6 w-6 mr-2 text-blue-base"
          fill="#3871EC29"
          fillOpacity={16}
        />
      </div>

      <div className="col-span-2 flex items-center justify-center p-3 bg-white text-blue-600 rounded-md border border-gray-200">
        <Settings
          className="h-6 w-6 mr-2 text-blue-base"
          fill="#3871EC29"
          fillOpacity={16}
        />
      </div>
    </div>
  );
}
