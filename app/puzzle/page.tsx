"use client";

import { useState } from "react";
import PuzzleGame from "@/app/components/puzzle/PuzzleGame";
import PuzzleInitializer from "@/app/components/puzzle/PuzzleInitializer";
import { usePuzzles } from "@/app/hooks/usePuzzles";
import PuzzleGameInfo from "@/app/components/puzzle/PuzzleGameInfo";
import { SiteHeader } from "@/components/site-header";

type Puzzle = {
  PuzzleId: string;
  FEN: string;
  Moves: string;
  Themes: string;
};

export default function Play() {
  const [filteredPuzzles, setFilteredPuzzles] = useState<Puzzle[]>([]);

  const {
    currentPuzzle,
    getRandomPuzzle,
    resetPuzzle,
    isSolved,
    solutionHistory,
    currentSolutionIndex,
    fenHistory,
    setFenHistory,
    activePlayer,
    setActivePlayer,
    playerColor,
    handleNavigateToMove,
    handleTakeBackMove,
    toggleBoardOrientation,
    boardOrientation,
    setCurrentSolutionIndex,
    setGameStarted,
    getNextPuzzle,
    getHint,
    hint,
    clearHint,
    showConfirmationBox,
    handleConfirm,
  } = usePuzzles(filteredPuzzles);

  const handleFetchPuzzles = (puzzles: Puzzle[]) => {
    if (puzzles.length === 0) {
      return;
    }

    setFilteredPuzzles(puzzles);

    setTimeout(() => {
      getRandomPuzzle();
    }, 0);
  };

  return (
    <>
      <SiteHeader />
      <div className="flex flex-col items-center w-full h-auto p-4 mt-16">
        <div className="relative w-full max-w-4xl flex flex-col items-center">
          {!currentPuzzle ? (
            <PuzzleInitializer
              jsonPath="/puzzle/mate_puzzles.json"
              onFetchPuzzles={handleFetchPuzzles}
              filteredPuzzles={filteredPuzzles}
              setFilteredPuzzles={setFilteredPuzzles}
              setGameStarted={setGameStarted}
            />
          ) : (
            <>
              <PuzzleGame
                fenHistory={fenHistory}
                puzzleMoves={solutionHistory}
                currentMoveIndex={currentSolutionIndex}
                setCurrentMoveIndex={setCurrentSolutionIndex}
                isGameOver={isSolved}
                onGameOver={() => {}}
                setFenHistory={setFenHistory}
                setActivePlayer={setActivePlayer}
                activePlayer={activePlayer}
                color={playerColor}
                boardOrientation={boardOrientation}
                resetPuzzle={resetPuzzle}
                getNextPuzzle={getNextPuzzle}
                hint={hint}
                clearHint={clearHint}
              />
              <PuzzleGameInfo
                fenHistory={fenHistory}
                currentMoveIndex={currentSolutionIndex}
                navigateToMove={handleNavigateToMove}
                onTakeBackMove={handleTakeBackMove}
                onToggleBoardOrientation={toggleBoardOrientation}
                getNextPuzzle={getNextPuzzle}
                onGetHint={getHint}
                showConfirmationBox={showConfirmationBox}
                handleConfirm={handleConfirm}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
