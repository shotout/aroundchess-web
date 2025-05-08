"use client";

import React from "react";
import { Chess } from "chess.js";
import Image from "next/image";
import { toast } from "sonner";

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
  game,
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

  const handleDownload = () => {
    if (game) {
      const currentPgn = game.pgn();

      const blob = new Blob([currentPgn], { type: "text/plain" });

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      const currentEpochTimeMs = Date.now();

      let fileName = "endgame-training-" + currentEpochTimeMs;
      if (isCheckmateMode) {
        fileName = `endgame-training-${colorName}-checkmate-${currentEpochTimeMs}`;
      }
      if (gameStatus === "solved") {
        fileName = `endgame-training-${colorName}-checkmate-solved-${currentEpochTimeMs}`;
      }
      a.target = "_blank";
      a.download = fileName + ".pgn";
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast("Current PGN Downloaded!");
    }
  };

  return (
    <div className="flex flex-col w-full">
      {!isGameOver && (
        <div
          className={`grid ${
            isCheckmateMode ? "grid-cols-2" : "grid-cols-3  "
          } gap-4 p-4 border-b border-t border-gray-200 w-full`}
        >
          <button
            className="flex gap-x-3 text-xs xl:text-base items-center justify-center p-3 text-blue-base rounded-md border border-primary-gray"
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
              className={`flex gap-x-3 text-xs xl:text-base items-center justify-center p-3 rounded-md border ${
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

          <button
            onClick={resetPosition}
            className="flex gap-x-3 text-xs xl:text-base items-center btn-tertiary justify-center p-3 bg-blue-50 text-blue-base font-semibold rounded-full border border-blue-200"
          >
            <Image
              src={"/endgame-training/rematch.png"}
              alt="rematch icon"
              width={20}
              height={20}
            />
            Restart
          </button>
        </div>
      )}

      {isGameOver ? (
        <div className="grid grid-cols-3 gap-2 2xl:gap-4 rounded-lg p-2 sm:p-3 w-full">
          <button
            onClick={handleShare}
            className="flex gap-x-1 xl:gap-x-2 items-center justify-center p-3 bg-white rounded-md border border-gray-200"
          >
            <Image
              src={"/endgame-training/share.png"}
              alt="download icon"
              width={16}
              height={16}
              className="w-4 h-4 sm:w-5 sm:h-5"
            />

            <h1 className="text-xs lg:text-sm text-nowrap">Share PGN/FEN</h1>
          </button>
          <button
            onClick={resetPosition}
            className="flex gap-x-1 sm:gap-x-2 items-center justify-center p-3 bg-white rounded-full btn-tertiary"
          >
            <Image
              src={"/endgame-training/rematch.png"}
              alt="download icon"
              width={16}
              height={16}
              className="w-4 h-4 sm:w-5 sm:h-5"
            />
            <span className="text-xs sm:text-sm">Restart</span>
          </button>
          <button
            onClick={navigateNext}
            className="flex gap-x-1 sm:gap-x-2 items-center justify-center p-3 btn-primary rounded-full border"
          >
            <span className="text-xs sm:text-sm">Next Stage</span>
            <Image
              src={"/endgame-training/Union.png"}
              alt="arrow right icon"
              width={16}
              height={16}
              className="w-4 h-4 sm:w-5 sm:h-5"
            />
          </button>
        </div>
      ) : (
        <>
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
              Next Position
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 rounded-lg p-3 w-full">
            <button className="flex items-center justify-center p-3 bg-white rounded-md border border-gray-200">
              <Image
                src={"/endgame-training/download.png"}
                alt="download icon"
                width={20}
                height={20}
              />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
