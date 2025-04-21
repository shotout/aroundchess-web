"use client";

import React from "react";
import { Chess } from "chess.js";
import Image from "next/image";

interface GameControlsProps {
  game: Chess;
  gameStatus: string;
  handleHint: () => void;
  showSolution: () => void;
  resetPosition: () => void;
  navigateNext: () => void;
  navigatePrevious: () => void;
  isCheckmateMode: boolean;
  playerColor: "w" | "b"; // Added player color prop
}

export default function GameControls({
  gameStatus,
  handleHint,
  showSolution,
  resetPosition,
  navigateNext,
  navigatePrevious,
  isCheckmateMode,
  playerColor, // Added prop
}: GameControlsProps) {
  // Get color name for display purposes
  const colorName = playerColor === "w" ? "White" : "Black";

  return (
    <div className="flex flex-col w-full">
      {/* First group: Hint, Solution, Rematch with shared border */}
      <div className="grid grid-cols-3 gap-4 p-4 border-b border-t border-gray-200 w-full">
        <button
          className="flex gap-x-3 items-center justify-center p-3 bg-blue-base/10 text-blue-base rounded-md border border-blue-base"
          onClick={handleHint}
          disabled={gameStatus !== "ongoing"}
        >
          <Image
            src={"/endgame-training/hint.png"}
            alt="hint icon"
            width={20}
            height={20}
          />{" "}
          Hint
        </button>

        <button
          className="flex gap-x-3 items-center justify-center p-3 bg-white text-gray-700 rounded-md border border-light/60"
          onClick={showSolution}
          disabled={gameStatus !== "ongoing"}
        >
          <Image
            src={"/endgame-training/show-solution.png"}
            alt="solution icon"
            width={20}
            height={20}
          />
          Solution
        </button>

        <button
          onClick={resetPosition}
          className="flex gap-x-3 items-center btn-tertiary justify-center p-3 bg-blue-50 text-blue-base font-semibold rounded-full border border-blue-200"
        >
          <Image
            src={"/endgame-training/rematch.png"}
            alt="rematch icon"
            width={20}
            height={20}
          />
          Rematch
        </button>
      </div>

      {/* Second group: Next Stage/Position button with its own border */}
      <div className="border-b border-light/60 p-3 w-full">
        <button
          onClick={navigateNext}
          className="w-full flex gap-x-3 items-center justify-center p-3 bg-white text-black rounded-md border border-blue-600"
        >
          <Image
            src={"/endgame-training/next-stage.png"}
            alt="next icon"
            width={20}
            height={20}
          />{" "}
          {isCheckmateMode ? "Next Position" : "Next Stage"}
        </button>
      </div>

      {/* Third group: Download and Settings buttons with equal width */}
      <div className="grid grid-cols-2 gap-4 rounded-lg p-3 w-full">
        <button className="flex items-center justify-center p-3 bg-white rounded-md border border-gray-200">
          <Image
            src={"/endgame-training/download.png"}
            alt="download icon"
            width={20}
            height={20}
          />
        </button>

        <button className="flex items-center justify-center p-3 bg-white rounded-md border border-gray-200">
          <Image
            src={"/endgame-training/gear.png"}
            alt="settings icon"
            width={20}
            height={20}
          />
        </button>
      </div>
    </div>
  );
}
