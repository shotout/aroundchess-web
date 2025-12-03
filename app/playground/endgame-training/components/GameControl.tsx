"use client";

import React from "react";
import { Chess } from "chess.js";
import Image from "next/image";

interface GameControlsProps {
  game: Chess;
  gameStatus: string;
  handleHint: () => void;
  handleShowSolution: () => void;
  resetPosition: () => void;
  navigateNext: () => void;
  isCheckmateMode: boolean;
  playerColor: "w" | "b";
  isAutoSolution: boolean;
  handleShare?: () => void;
}

export default function GameControls({
  gameStatus,
  handleHint,
  handleShowSolution,
  resetPosition,
  navigateNext,
  isCheckmateMode,
  playerColor,
  isAutoSolution,
  handleShare,
}: GameControlsProps) {
  const colorName = playerColor === "w" ? "White" : "Black";
  const isGameOver = gameStatus === "solved";

  return (
    <div className="flex flex-col w-full">
      {!isGameOver && (
        <div
          className={`grid ${
            isCheckmateMode ? "grid-cols-1" : "grid-cols-2  "
          } gap-4 p-4 border-b border-t border-gray-200 w-full`}
        >
          <button
            className="flex gap-x-3 text-[14px] --xs xl:text-base items-center justify-center p-3 text-blue-base rounded-md border border-primary-gray"
            onClick={handleHint}
          >
            <Image
              src={"/endgame-training/hint.png"}
              alt="hint icon"
              width={15}
              height={15}
            />{" "}
            Hint
          </button>

          {!isCheckmateMode && (
            <button
              className={`flex gap-x-3 text-[14px] --xs xl:text-base items-center justify-center p-3 rounded-md border ${
                isAutoSolution
                  ? "border-blue-base bg-blue-base/5 text-blue-base"
                  : "border-primary-gray text-black"
              }`}
              onClick={handleShowSolution}
              disabled={isAutoSolution}
            >
              <Image
                src={"/endgame-training/show-solution.png"}
                alt="solution icon"
                width={15}
                height={15}
              />{" "}
              {isAutoSolution ? "Solving..." : "Show Solution"}
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 2xl:gap-4 rounded-lg p-2 sm:p-3 w-full">
        <button
          onClick={handleShare}
          className="flex gap-x-1 2xl:gap-x-2 items-center justify-center p-3 bg-white rounded-md border border-gray-200"
        >
          <Image
            src={"/endgame-training/share.png"}
            alt="download icon"
            width={16}
            height={16}
            className="w-4 h-4"
          />

          <h1 className="text-[10px] md:text-[14px] --xs text-nowrap">Share PGN/FEN</h1>
        </button>
        <button
          onClick={resetPosition}
          className="flex gap-x-1 2xl:gap-x-2 items-center justify-center p-3 bg-white rounded-full btn-tertiary"
        >
          <Image
            src={"/endgame-training/rematch.png"}
            alt="download icon"
            width={16}
            height={16}
            className="w-4 h-4 "
          />
          <span className="text-[10px] md:text-[14px] --xs">Restart</span>
        </button>
        <button
          onClick={navigateNext}
          className="flex gap-x-1 2xl:gap-x-2 items-center justify-center p-3 btn-primary rounded-full border"
        >
          <span className="text-[10px] md:text-[14px] --xs">Next Stage</span>
          <Image
            src={"/endgame-training/Union.png"}
            alt="arrow right icon"
            width={16}
            height={16}
            className="w-4 h-4 "
          />
        </button>
      </div>
    </div>
  );
}
